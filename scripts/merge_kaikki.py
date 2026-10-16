"""Import PARTIAL French/Italian/Spanish candidates from REAL Kaikki/Wiktionary JSONL.

Modes:
  python scripts/merge_kaikki.py --download-lite
  python scripts/merge_kaikki.py path/to/full-English-wiktextract.jsonl.gz

The automatic lite dataset (Simple English Wiktionary, roughly 4.5 MB)
contains fewer translations than the full English Wiktionary. The full
extract is several GB. Download the full extract separately only if wanted:
https://kaikki.org/dictionary/rawdata.html

Wiktextract stores translation records on the entry itself, sometimes in
individual senses, with a `sense` text label. We NEVER combine translations
with DIFFERENT sense labels to manufacture a three-language match. The
language cells of one selected sense group remain independent; missing='—'.
All imported material remains draft, not pedagogically verified.
"""
from __future__ import annotations
from collections import defaultdict,Counter
from pathlib import Path
import argparse,gzip,bz2,json,re,hashlib,shutil,urllib.request,sys
sys.path.insert(0,str(Path(__file__).resolve().parent))
from catalog import ROOT,LANGS,MISSING,available,fold,assignments,populate_missing
from level_rules import estimate_level,english_frequency
OUTPUT=ROOT/'src/data/vocabulary.json'
CACHE=ROOT/'content/source_dictionaries/kaikki-simple-en.jsonl.gz'
LITE_URL='https://kaikki.org/dictionary/downloads/simple/simple-extract.jsonl.gz'

def download_lite(offline=False):
 """Small optional Kaikki download, cached. Never auto-download a multi-GB file."""
 if CACHE.is_file() and CACHE.stat().st_size>1000:return CACHE
 if offline:raise FileNotFoundError('No cached Kaikki small extract; run online or pass --kaikki PATH')
 CACHE.parent.mkdir(parents=True,exist_ok=True)
 print(f'  Downloading Kaikki Simple English Wiktionary data: {LITE_URL}',flush=True)
 try:
  req=urllib.request.Request(LITE_URL,headers={'User-Agent':'RomanceTrioEducationalProject/3.0'})
  with urllib.request.urlopen(req,timeout=150) as r,open(str(CACHE)+'.part','wb') as f:shutil.copyfileobj(r,f)
  if Path(str(CACHE)+'.part').stat().st_size<1000:raise ValueError('Kaikki file too small')
  Path(str(CACHE)+'.part').replace(CACHE)
 except Exception:
  Path(str(CACHE)+'.part').unlink(missing_ok=True)
  raise
 return CACHE

def read_lines(path:Path):
 opener=gzip.open if path.suffix=='.gz' else bz2.open if path.suffix=='.bz2' else open
 with opener(path,'rt',encoding='utf8') as f:
  for line in f:yield line

def valid_translation(text):
 if not isinstance(text,str):return None
 text=' '.join(text.split()).strip(' ,;')
 if not text or len(text)>80 or len(text.split())>9:return None
 if any(z in text for z in ['http','\n','\t','[',']','{','}','|']):return None
 return text

def groups(entry):
 """Group translations BY THEIR SENSE LABEL, including entry-level records.

 On raw Wiktextract, translations often appear at entry['translations'].
 In postprocessed data they may be nested inside entry['senses'][i].
 Different senses must never be combined in a single 3-language candidate.
 """
 d=defaultdict(dict)
 def add(tr,context=''):
  if not isinstance(tr,dict):return
  code=tr.get('lang_code') or tr.get('code')
  if code not in LANGS:return
  word=valid_translation(tr.get('word'))
  if not word:return
  sense=' '.join(str(tr.get('sense') or context or 'Unspecified sense').split()).casefold()
  if code not in d[sense]:
   gender=next((g[0] for t,g in [('masculine','m'),('feminine','f'),('neuter','n')] if t in tr.get('tags',[])),None)
   d[sense][code]=(word,gender)
 for tr in entry.get('translations',[]) or []:add(tr)
 for i,sense in enumerate(entry.get('senses',[]) or []):
  if not isinstance(sense,dict):continue
  gloss=(sense.get('glosses') or [''])[0]
  for tr in sense.get('translations',[]) or []:add(tr,gloss or f'Sense {i+1}')
 return list(d.items())

def best_group(entry,row):
 options=groups(entry)
 if not options:return None
 def score(opt):
  _,trans=opt
  matches=sum(fold(trans[l][0])==fold(row[l]) for l in trans if available(row.get(l)))
  conflicts=sum(fold(trans[l][0])!=fold(row[l]) for l in trans if available(row.get(l)))
  missing_gain=sum(not available(row.get(l)) for l in trans)
  # Prefer an overlapping known translation; penalize conflicts before size.
  return (matches>0,matches,-conflicts,missing_gain,len(trans))
 return max(options,key=score)

def import_kaikki(path:Path,rows:list[dict]):
 """Enrich existing starter/FreeDict rows and add English-seeded partial rows."""
 path=Path(path)
 if not path.is_file():raise FileNotFoundError(path)
 assignments_map=assignments()
 rowlookup={(r['topic'],fold(r['en'])):r for r in rows}
 stats=Counter()
 for line in read_lines(path):
  stats['scanned']+=1
  try:entry=json.loads(line)
  except (json.JSONDecodeError,UnicodeError):continue
  if entry.get('lang_code')!='en':continue
  en=entry.get('word','')
  if not isinstance(en,str) or not re.fullmatch(r"[A-Za-z][A-Za-z '\-]*",en) or len(en)>65:continue
  key=fold(en)
  ts=assignments_map.get(key)
  if not ts:continue
  if not groups(entry):continue
  stats['headwords_matched']+=1
  for topic in ts:
   row=rowlookup.get((topic,key))
   if row is None:
    slug=re.sub(r'[^a-z0-9]+','-',key).strip('-')
    row={'id':f'{topic}-{slug}-{hashlib.sha1(en.encode()).hexdigest()[:9]}','topic':topic,'en':en,**{l:MISSING for l in LANGS},
         'level':estimate_level(en,topic,english_frequency(en)),'levelSource':'estimated',
         'source':'Kaikki/Wiktionary English extract','reviewStatus':'imported-draft'}
    rows.append(row);rowlookup[(topic,key)]=row;stats['new_rows']+=1
   selected=best_group(entry,row)
   if not selected:continue
   sense,tr=selected
   added=[]
   for lang,(value,gender) in tr.items():
    if not available(row.get(lang)):
     row[lang]=value
     if gender:row.setdefault('gender',{})[lang]=gender
     added.append(lang);stats['translations_filled_'+lang]+=1
   if added:
    if row.get('reviewStatus')=='seed-pending':row['reviewStatus']='imported-draft'
    previous=row.get('source','')
    if 'Kaikki' not in previous:row['source']=(previous+'; Kaikki/Wiktionary English extract').strip('; ')
    row.setdefault('senseHint',sense)
    stats['rows_enriched']+=1
   if entry.get('pos') and not row.get('partOfSpeech'):row['partOfSpeech']=entry['pos']
   # Wiktionary example is in English only; DO NOT invent target sentences.
   if not row.get('example'):
    for gloss in (entry.get('senses') or [])[:3]:
     for ex in gloss.get('examples',[]) or []:
      text=ex.get('text') if isinstance(ex,dict) else None
      if isinstance(text,str) and 12<=len(text)<=160 and key in fold(text):
       row['example']={'en':text}
       row['exampleStatus']='Kaikki English example; sense needs review'
       stats['examples_added']+=1;break
     if row.get('example'):break
 return rows,stats

def main():
 p=argparse.ArgumentParser(description=__doc__)
 p.add_argument('dump',nargs='?',type=Path,help='English Wiktextract JSONL(.gz/.bz2) downloaded from Kaikki')
 p.add_argument('--download-lite',action='store_true',help='Download small Simple English Wiktionary file automatically')
 args=p.parse_args()
 path=args.dump or download_lite(offline=False)
 if not OUTPUT.exists():raise SystemExit('Run python scripts/build_vocabulary.py and python scripts/enrich_vocab.py first')
 rows=json.loads(OUTPUT.read_text(encoding='utf8'))
 rows,stats=import_kaikki(path,rows)
 populate_missing(rows)
 OUTPUT.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 print('Kaikki merge complete:',dict(stats),'total English entries:',len(rows))
 print('All Kaikki matches are DRAFTS; missing language translations appear as —.')
if __name__=='__main__':main()
