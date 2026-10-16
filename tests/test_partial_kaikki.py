"""Regression tests for partial-language imports and Wiktextract's real schemas."""
import gzip,json,sys,tempfile,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from catalog import populate_missing,available,LANGS,target_for
from sync_freedict import compose,seeds
from merge_kaikki import import_kaikki,groups

class PartialCoverageTests(unittest.TestCase):
 def test_freedict_union_not_intersection(self):
  # School headword appears in Italian and Spanish, French intentionally missing.
  lex={'fr':{},'it':{'teacher':[('insegnante','m','n')]},'es':{'teacher':[('profesor','m','n')]}}
  rows,stats,levels,total=compose([],lex,seeds())
  self.assertEqual(total,1)
  item=next(w for w in rows if w['topic']=='school' and w['en']=='teacher')
  self.assertEqual((item['fr'],item['it'],item['es']),('—','insegnante','profesor'))
  self.assertFalse(available(item['fr']))
  self.assertTrue(available(item['es']))
 def test_kaikki_entry_level_and_sense_grouping(self):
  word={'word':'airport','lang_code':'en','pos':'noun','translations':[
   {'lang_code':'fr','word':'aéroport','sense':'terminal for aircraft','tags':['masculine']},
   {'lang_code':'it','word':'aeroporto','sense':'terminal for aircraft','tags':['masculine']},
   {'lang_code':'es','word':'aeropuerto','sense':'terminal for aircraft'},
   {'lang_code':'es','word':'fantasia','sense':'different unrelated meaning'}]}
  self.assertEqual(len(groups(word)),2)
  with tempfile.TemporaryDirectory() as tmp:
   file=Path(tmp)/'extract.jsonl.gz'
   with gzip.open(file,'wt',encoding='utf8') as o:o.write(json.dumps(word)+'\n')
   base=[{'id':'travel-airport','topic':'travel','en':'airport','fr':'—','it':'—','es':'—','level':'A1','levelSource':'estimated','reviewStatus':'seed-pending'}]
   after,stats=import_kaikki(file,base)
   item=next(w for w in after if w['topic']=='travel')
   self.assertEqual([item[x] for x in ('fr','it','es')],['aéroport','aeroporto','aeropuerto'])
   self.assertEqual(item['gender']['fr'],'m')
   self.assertGreaterEqual(stats['translations_filled_fr'],1)
 def test_kaikki_partial_sense_is_not_spliced(self):
  mixed={'word':'screen','lang_code':'en','translations':[
   {'lang_code':'fr','word':'écran','sense':'digital display'},
   {'lang_code':'it','word':'schermo','sense':'digital display'},
   {'lang_code':'es','word':'criba','sense':'sieve'}]}
  with tempfile.TemporaryDirectory() as tmp:
   file=Path(tmp)/'test.jsonl'
   file.write_text(json.dumps(mixed)+'\n',encoding='utf8')
   rows,stats=import_kaikki(file,[])
   item=next(w for w in rows if w['topic']=='movies')
   self.assertEqual(item['fr'],'écran')
   self.assertEqual(item['it'],'schermo')
   self.assertEqual(item['es'],'—')
 def test_all_topic_targets_are_english_not_fake_translations(self):
  rows=populate_missing([])
  from collections import Counter
  counts=Counter(w['topic'] for w in rows)
  self.assertTrue(all(counts[t]>=target_for(t) for t in counts))
  self.assertTrue(all(not any(available(w[x]) for x in LANGS) for w in rows))

if __name__=='__main__':unittest.main()
