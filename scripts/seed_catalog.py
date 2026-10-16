"""Add missing English topic words as explicit placeholders (—), never fake translations.

Run after any dictionary imports. Existing real translations, examples and levels
are preserved. Counts meet the user's English topic thresholds even offline.
"""
from pathlib import Path
import sys,json,collections
sys.path.insert(0,str(Path(__file__).resolve().parent))
from catalog import populate_missing,LANGS,available
from level_rules import estimate_level,english_frequency
ROOT=Path(__file__).resolve().parents[1]
OUTPUT=ROOT/'src/data/vocabulary.json'
def finalize_rows(rows):
 """Ensure every English topic entry has a suggested level and explicit gaps."""
 before=len(rows)
 populate_missing(rows)
 for row in rows:
  if not row.get('level'):
   row['level']=estimate_level(row['en'],row['topic'],english_frequency(row['en']))
   row['levelSource']='estimated'
  row.setdefault('levelSource','estimated')
  row.setdefault('reviewStatus','imported-draft' if any(available(row.get(l)) for l in LANGS) else 'seed-pending')
  for lang in LANGS:
   if not available(row.get(lang)):row[lang]='—'
 return rows,len(rows)-before

def main():
 rows=json.loads(OUTPUT.read_text(encoding='utf8'))
 rows,added=finalize_rows(rows)
 OUTPUT.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 print(f'English topic catalogue: {len(rows)-added} → {len(rows)} (+{added} explicit un-translated seed entries).')
 print('These entries are NOT translations: missing language cells remain —.')
if __name__=='__main__':main()
