"""Add supplementary original English–Spanish vocabulary with explicit language gaps.

This educational list is *independent* of FreeDict and Kaikki. It is not
machine translated. Existing dictionary/starter values are never overwritten.
Call from sync_freedict after importing dictionaries, or run separately.
"""
from pathlib import Path
import hashlib,json,sys,collections,re
sys.path.insert(0,str(Path(__file__).resolve().parent))
from catalog import LANGS,MISSING,available,fold
from level_rules import estimate_level,english_frequency
ROOT=Path(__file__).resolve().parents[1]
SUPPLEMENT=ROOT/'content/editorial_supplements.tsv'
OUTPUT=ROOT/'src/data/vocabulary.json'
SOURCE='Romance Trio original English–Spanish supplemental collection (editorial draft)'

def merge(rows):
 lookup={(r['topic'],fold(r['en'])):r for r in rows}
 counts=collections.Counter();new=0;updated=0
 for line_no,line in enumerate(SUPPLEMENT.read_text(encoding='utf8').splitlines(),1):
  if not line.strip() or line.startswith('#'):continue
  parts=line.split('|')
  if len(parts)!=3:raise ValueError(f'Malformed editorial TSV line {line_no}: {line}')
  topic,en,es=(p.strip() for p in parts)
  if not en or not es or not topic:raise ValueError(f'Blank bilingual row on line {line_no}')
  key=(topic,fold(en));row=lookup.get(key)
  if row is None:
   slug=re.sub('[^a-z0-9]+','-',fold(en)).strip('-')
   row={'id':f'{topic}-{slug[:64]}-{hashlib.sha1(en.encode()).hexdigest()[:9]}',
    'topic':topic,'en':en,'fr':MISSING,'it':MISSING,'es':es,
    'level':estimate_level(en,topic,english_frequency(en)),'levelSource':'estimated',
    'source':SOURCE,'reviewStatus':'imported-draft'}
   rows.append(row);lookup[key]=row;new+=1;counts[topic]+=1
  elif not available(row.get('es')):
   row['es']=es;row['reviewStatus']='imported-draft'
   original=row.get('source','')
   if SOURCE not in original:row['source']=(original+'; '+SOURCE).strip('; ')
   updated+=1;counts[topic]+=1
 return rows,{'new_rows':new,'previously_untranslated_filled':updated,'added_translations_by_topic':dict(counts)}

def main():
 rows=json.loads(OUTPUT.read_text(encoding='utf8'))
 rows,stats=merge(rows)
 OUTPUT.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 print('Original English–Spanish supplement:',stats)

if __name__=='__main__':main()
