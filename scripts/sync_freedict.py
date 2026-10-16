"""Download REAL FreeDict English→French/Italian/Spanish TEI dictionaries and merge
TOPIC-CLASSIFIED CANDIDATES into the offline Romance Trio website bundle.

Usage (Python 3.10+, stdlib only):
    python scripts/sync_freedict.py
    python scripts/sync_freedict.py --local-dir path/to/three/tei/files
    python scripts/sync_freedict.py --offline    # reuses cached TEI files

IMPORTANT: Imported rows are marked `imported-draft`, not reviewed translations.
This is an actual import tool, not a simulated dataset. Meanings, grammatical
forms, CEFR estimates, and rights need checking before public redistribution.
Always review the dictionaries' COPYING/LICENSE files before publishing.

FreeDict: https://freedict.org/downloads/
"""
from __future__ import annotations
import argparse
from collections import defaultdict,Counter
from pathlib import Path
import json, re, hashlib, shutil, subprocess, sys, urllib.request, xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
CACHE=ROOT/'content'/'source_dictionaries'
OUTPUT=ROOT/'src/data/vocabulary.json'
sys.path.insert(0,str(Path(__file__).resolve().parent))
from level_rules import estimate_level,english_frequency
from catalog import assignments,available,LANGS,MISSING,populate_missing

URLS={
 'fr':[
   'https://raw.githubusercontent.com/freedict/fd-dictionaries/master/eng-fra/eng-fra.tei',
   'https://download.freedict.org/generated/eng-fra/eng-fra.tei',
 ],
 'it':['https://download.freedict.org/generated/eng-ita/eng-ita.tei',
       'https://raw.githubusercontent.com/freedict/fd-dictionaries/master/eng-ita/eng-ita.tei'],
 'es':['https://download.freedict.org/generated/eng-spa/eng-spa.tei',
       'https://raw.githubusercontent.com/freedict/fd-dictionaries/master/eng-spa/eng-spa.tei']
}

def fold(text:str)->str:
 import unicodedata
 return ''.join(c for c in unicodedata.normalize('NFKD',text.casefold().strip()) if not unicodedata.combining(c))

def download(lang:str,cached:Path,offline:bool)->None:
 if cached.exists() and cached.stat().st_size>100:return
 if offline:raise FileNotFoundError(f'No cached TEI for {lang}: {cached}. Retry without --offline.')
 cached.parent.mkdir(parents=True,exist_ok=True)
 for url in URLS[lang]:
  try:
   print(f'  Downloading {lang.upper()} from {url}',flush=True)
   req=urllib.request.Request(url,headers={'User-Agent':'RomanceTrioDictionaryImport/2.0 (educational project)'})
   with urllib.request.urlopen(req,timeout=120) as r,open(str(cached)+'.part','wb') as f:
    shutil.copyfileobj(r,f)
   if cached.with_suffix('.tei.part').stat().st_size<1000:raise ValueError('Download unexpectedly small')
   cached.with_suffix('.tei.part').replace(cached)
   return
  except Exception as e:
   print(f'  Source unavailable: {e}',file=sys.stderr)
   cached.with_suffix('.tei.part').unlink(missing_ok=True)
 raise RuntimeError(f'Could not download {lang.upper()} dictionary. Download its .tei file from {URLS[lang][0]} and rerun --local-dir DIRECTORY.')

def tag(elem:ET.Element)->str:return elem.tag.rsplit('}',1)[-1]
def descendants(el:ET.Element,kind:str):return (a for a in el.iter() if tag(a)==kind)
def norm_text(el:ET.Element|None)->str:
 return ' '.join(' '.join(el.itertext()).split()) if el is not None else ''
def simple(text:str)->str|None:
 text=re.sub(r'\s+',' ',text).strip().strip(' .;,')
 text=re.sub(r'^\s*\([^)]*\)\s*','',text)
 if not text or len(text)>67 or re.search(r'[\d\n\[\]{}<>]|http|[;=/]',text,re.I):return None
 # Remove dictionary commentary, alternate translations, broken markup.
 if ',' in text or '(' in text or ')' in text or '…' in text or '|' in text:return None
 if len(text.split())>5:return None
 return text

def extract(path:Path):
 """Stream TEI using ElementTree. Only <cit type='trans'> direct quotes from
 each sense are considered, avoiding example-translation contamination.
 """
 words=defaultdict(list);cnt=0
 for event,elem in ET.iterparse(path,events=('end',)):
  if tag(elem)!='entry':continue
  forms=[e for e in elem if tag(e)=='form']
  orth=next((e for e in forms[0].iter() if tag(e)=='orth'),None) if forms else None
  en=simple(norm_text(orth))
  if not en or not re.fullmatch(r"[a-zA-Z][a-zA-Z '\-]*",en) or len(en)>55:
   elem.clear();continue
  pos=next((norm_text(g) for g in elem if tag(g)=='gramGrp' for g in descendants(g,'pos')),None)
  candidates=[]
  for sense in elem:
   if tag(sense)!='sense':continue
   for cit in sense:
    if tag(cit)!='cit' or cit.get('type')!='trans':continue
    for q in cit:
     if tag(q)!='quote':continue
     v=simple(norm_text(q))
     if not v:continue
     gender=next((norm_text(g) for gg in cit if tag(gg)=='gramGrp' for g in descendants(gg,'gen')),None)
     candidates.append((v,gender))
  # English should have a single predictable, short headword. A draft
  # translation may be the WRONG sense; therefore `imported-draft` label.
  if candidates:
   for tr,gender in candidates[:5]:
    if (tr,gender) not in words[fold(en)]: words[fold(en)].append((tr,gender,pos))
   cnt+=1
  elem.clear()
 print(f'  Parsed {cnt:,} English headword entries from {path.name}',flush=True)
 return words

def seeds():
 assignment=defaultdict(list)
 path=ROOT/'content/topic_seeds.txt'
 for line in path.read_text(encoding='utf8').splitlines():
  if not line.strip() or line.startswith('#'):continue
  topic,terms=line.split('|',1);topic=topic.strip()
  for item in terms.split(';'):
   item=fold(item)
   if item and topic not in assignment[item]: assignment[item].append(topic)
 return assignment

def compose(base,lexicons,seed_map):
 """Union of FreeDict English headwords: one, two, or three translations.

 Keep all starter translations. Never assign a guessed translation where a
 dictionary has no entry. Imported records are explicitly marked draft.
 """
 result=list(base)
 lookup={(w['topic'],fold(w['en'])):w for w in result}
 stats=Counter();levels=Counter()
 common=set().union(*(set(lexicons[lang]) for lang in LANGS))
 for lemma in sorted(common):
  topics=seed_map.get(lemma,[])
  if not topics:continue
  trans={lang:lexicons[lang][lemma][0][0] for lang in LANGS if lemma in lexicons[lang]}
  genders={lang:lexicons[lang][lemma][0][1] for lang in trans if lexicons[lang][lemma][0][1]}
  genders={l:g.lower() for l,g in genders.items() if g.lower() in ('m','f','n')}
  pos=next((lexicons[l][lemma][0][2] for l in LANGS if l in trans and lexicons[l][lemma][0][2]),None)
  for topic in topics:
   row=lookup.get((topic,lemma))
   if row is None:
    key=re.sub(r'[^a-z0-9]+','-',lemma).strip('-')
    if not key:continue
    row={'id':f'{topic}-{key}-{hashlib.sha1(lemma.encode()).hexdigest()[:9]}','topic':topic,'en':lemma,
         **{l:trans.get(l,MISSING) for l in LANGS},
         'level':estimate_level(lemma,topic,english_frequency(lemma)),
         'levelSource':'estimated','reviewStatus':'imported-draft',
         'source':'FreeDict English bilingual TEI (partial multilingual match)'}
    if genders:row['gender']=genders
    if pos:row['partOfSpeech']=pos
    result.append(row);lookup[(topic,lemma)]=row
    stats[topic]+=1;levels[row['level']]+=1
   else:
    added=[]
    for l,value in trans.items():
     if not available(row.get(l)):
      row[l]=value;added.append(l)
      if l in genders:row.setdefault('gender',{})[l]=genders[l]
    if added:
     row.setdefault('source', 'FreeDict dictionaries')
     row.setdefault('partOfSpeech',pos)
     if row.get('reviewStatus')=='seed-pending':row['reviewStatus']='imported-draft'
 return result,stats,levels,len(common)

def main(argv=None):
 ap=argparse.ArgumentParser(description=__doc__)
 ap.add_argument('--offline',action='store_true',help='Use cached source dictionaries only')
 ap.add_argument('--no-kaikki',action='store_true',help='Skip the automatic small Kaikki Wiktionary download')
 ap.add_argument('--kaikki',type=Path,help='Process a supplied Kaikki English Wiktionary JSONL or .gz file (can be the full dataset)')
 ap.add_argument('--local-dir',type=Path,help='Directory with eng-fra.tei, eng-ita.tei, eng-spa.tei')
 args=ap.parse_args(argv)
 sources={}
 for lang,suffix in [('fr','fra'),('it','ita'),('es','spa')]:
  path=(args.local_dir if args.local_dir else CACHE)/f'eng-{suffix}.tei'
  if not args.local_dir: download(lang,path,args.offline)
  elif not path.exists():ap.error(f'Missing file {path}')
  sources[lang]=path
 print('Building the supplied curated starter set...')
 subprocess.run([sys.executable,str(ROOT/'scripts/build_vocabulary.py')],check=True)
 subprocess.run([sys.executable,str(ROOT/'scripts/enrich_vocab.py')],check=True)
 base=json.loads(OUTPUT.read_text(encoding='utf8'))
 lexicons={lang:extract(path) for lang,path in sources.items()}
 result,per_topic,per_level,intersection=compose(base,lexicons,seeds())
 OUTPUT.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 if not args.no_kaikki:
  from merge_kaikki import import_kaikki,download_lite
  try:
   path=args.kaikki if args.kaikki else download_lite(offline=args.offline)
   result,kstats=import_kaikki(path,result)
   print('Kaikki/Wiktionary matched:',dict(kstats),flush=True)
  except (OSError,ValueError,RuntimeError) as exc:
   print('Kaikki import unavailable:',exc,file=sys.stderr)
   print('FreeDict import will continue. Pass --kaikki PATH for a downloaded full extract.',file=sys.stderr)
 from seed_catalog import finalize_rows
 result,unfilled_added=finalize_rows(result)
 from merge_editorial import merge as merge_editorial
 result,editorial_stats=merge_editorial(result)
 print("Romance Trio original Spanish supplements:",editorial_stats,flush=True)
 assert len({w['id'] for w in result})==len(result),'duplicate IDs'
 OUTPUT.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 info={'total':len(result),'curatedStarter':len(base),'additionalRowsIncludingPlaceholders':len(result)-len(base),
       'dictionaryHeadwordUnion':intersection,'addedByTopic':dict(per_topic),'importLevels':dict(per_level),
       'licenses':'Source dictionaries have their own licenses. Validate individual COPYING texts before redistributing.',
       'status':'Imported translations are DRAFTS. They are not three-language, sense-level verified.',
       'sourceFiles':{k:str(v) for k,v in sources.items()},
       'englishOnlySeedRowsAdded':unfilled_added, 'originalSpanishSupplement':editorial_stats,
       'withAnyTranslation':sum(any(available(r[l]) for l in LANGS) for r in result),
       'fullyTranslated':sum(all(available(r[l]) for l in LANGS) for r in result)}
 (ROOT/'content/import_report.json').write_text(json.dumps(info,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 print(f'\nFinished: {len(result)} English records, including {len(base)} starter and {editorial_stats["new_rows"]} newly added Spanish supplement rows.')
 print('Per topic imported:',dict(per_topic))
 print('CEFR estimate distribution:',dict(per_level))
 print('Run: python scripts/check_content.py')
 print('IMPORTANT: — denotes MISSING translations, not a complete multilingual match. Dictionary translations are unreviewed drafts.')
 return info

if __name__=='__main__':main()
