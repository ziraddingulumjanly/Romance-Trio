"""Attach aligned candidate example sentences from downloaded Tatoeba pairs.

Usage:
 python scripts/merge_tatoeba.py --fr content/example_pairs/eng-fr.tsv --it content/example_pairs/eng-it.tsv --es content/example_pairs/eng-es.tsv

Format (tab separated): ENGLISH_SENTENCE <TAB> TRANSLATED_SENTENCE <TAB> OPTIONAL_SENTENCE_ID.
Prepare source pairs using Tatoeba's custom export at https://tatoeba.org/downloads.
All three pairs must have an identical English sentence for alignment.
At most one example is attached per English headword; this is a draft,
not sense-verified, so review against each entry before public release.
Original Tatoeba sentence ID is recorded in exampleAttribution.
"""
import argparse, csv, json, re
from pathlib import Path
from sync_freedict import OUTPUT,fold

def load(path):
 d={}
 with path.open(encoding='utf8',newline='') as f:
  for row in csv.reader(f,delimiter='\t'):
   if len(row)<2:continue
   en,tr=row[:2];sid=row[2] if len(row)>2 else ''
   if 10<=len(en)<=130 and 7<=len(tr)<=165 and en not in d:
    d[en]=(tr,sid)
 return d

def main():
 a=argparse.ArgumentParser(description=__doc__)
 for lang in ('fr','it','es'):a.add_argument('--'+lang,required=True,type=Path)
 args=a.parse_args();langs={code:load(getattr(args,code)) for code in ('fr','it','es')}
 shared=set(langs['fr']) & set(langs['it']) & set(langs['es'])
 rows=json.loads(OUTPUT.read_text(encoding='utf8'))
 added=0
 for row in rows:
  if row.get('example'):continue
  en=fold(row['en'])
  if len(en)<4 or len(en)>35:continue
  pat=re.compile(r'(?<!\w)'+re.escape(en)+r'(?!\w)',re.I)
  # Scan sentences in insertion order; choose short likely teachable contexts.
  matches=[s for s in shared if pat.search(fold(s)) and len(s.split())<=15]
  if not matches:continue
  sentence=min(matches,key=len)
  row['example']={'en':sentence,**{l:langs[l][sentence][0] for l in ('fr','it','es')}}
  row['exampleStatus']='candidate-needs-review'
  row['exampleAttribution']='Tatoeba sentence IDs: '+', '.join(f'{l}={langs[l][sentence][1]}' for l in ('fr','it','es'))
  added+=1
 OUTPUT.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 print(f'Attached {added} Tatoeba example CANDIDATES from {len(shared)} four-language sentence matches; please check word senses and sentence-level licensing.')

if __name__=='__main__':main()
