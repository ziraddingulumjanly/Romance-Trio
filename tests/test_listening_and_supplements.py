"""Regression checks for shipped dictation exercises and topic gap-filling."""
import json, unittest, sys, copy
from collections import Counter
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'))
from merge_editorial import merge
from catalog import fold,available,target_for,topics

class ListeningAndSupplementTests(unittest.TestCase):
 def test_90_sentences_15_at_each_difficulty(self):
  rows=json.loads((ROOT/'src/data/listening-sentences.json').read_text(encoding='utf8'))
  self.assertEqual(len(rows),90)
  self.assertEqual(dict(Counter(r['level'] for r in rows)),dict.fromkeys(['A1','A2','B1','B2','C1','C2'],15))
  self.assertEqual(len({r['id'] for r in rows}),len(rows))
  for row in rows:
   self.assertTrue(all(row[key].strip() for key in ('en','fr','it','es')))

 def test_supplement_merging_is_idempotent(self):
  starter=json.loads((ROOT/'src/data/vocabulary.json').read_text(encoding='utf8'))
  base=copy.deepcopy(starter)
  result,_=merge(base)
  again,_=merge(result)
  self.assertEqual(len(result),len(again))
  self.assertEqual({(r['topic'],fold(r['en'])) for r in result}, {(r['topic'],fold(r['en'])) for r in again})
  self.assertEqual(len(again),len({r['id'] for r in again}))

 def test_every_supplement_has_actual_spanish(self):
  path=ROOT/'content/editorial_supplements.tsv'
  pairs=[]
  for raw in path.read_text(encoding='utf8').splitlines():
   if raw.startswith('#') or not raw.strip():continue
   parts=raw.split('|')
   self.assertEqual(len(parts),3)
   self.assertTrue(all(part.strip() for part in parts))
   pairs.append(parts)
  self.assertGreaterEqual(len(pairs),500)
  self.assertEqual(len({(r[0],fold(r[1])) for r in pairs}),len(pairs))

 def test_original_targets_met_given_previous_import(self):
  """Guarantees target given the actual counts user reported for v3 import.

  Only candidates absent from the v3 seed catalogue are counted as guaranteed
  new, so this cannot double-count FreeDict/Kaikki matches from that catalogue.
  """
  baseline={'travel':166,'family':98,'daily':211,'science':233,'colors':93,'numbers':99,'phrases':64,'idioms':95}
  new=Counter()
  original_seed_words={(topic,fold(en)) for topic,items in topics().items() for en in items}
  original_seed_words |= {(r['topic'],fold(r['en'])) for r in json.loads((ROOT/'src/data/vocabulary.json').read_text(encoding='utf8')) if r['reviewStatus']=='starter'}
  # FreeDict and Kaikki importer use only original topic seed assignments.
  # Therefore supplementary terms absent from that source couldn't already
  # have been counted in the user's previous v3 import.
  for line in (ROOT/'content/editorial_supplements.tsv').read_text(encoding='utf8').splitlines():
   if not line or line.startswith('#'):continue
   topic,en,es=line.split('|')
   if topic not in baseline:continue
   # The 522 additions include > target gap even if several are duplicated by source.
   if (topic,fold(en)) not in original_seed_words:new[topic]+=1
  for topic,count in baseline.items():
   self.assertGreaterEqual(count+new[topic],target_for(topic),(topic,count,new[topic]))

 def test_lab_is_linked_from_home_and_nav(self):
  self.assertIn('/listening-lab/',(ROOT/'src/app/page.tsx').read_text())
  self.assertIn('/listening-lab/',(ROOT/'src/components/Header.tsx').read_text())
  component=(ROOT/'src/components/listening-lab/ListeningLab.tsx').read_text()
  for text in ['Listen & Type','Listen & Translate','Fill the Gaps','Word Order','Strict accent checking','Keyboard & feedback sounds']:
   self.assertIn(text,component)

if __name__=='__main__':unittest.main()
