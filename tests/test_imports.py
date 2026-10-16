"""Offline regression fixtures for data import and CEFR tagging."""
import json, tempfile, unittest, sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from sync_freedict import extract,compose,seeds
from level_rules import estimate_level,LEVELS

TEMPLATE='''<?xml version="1.0" encoding="UTF-8"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0"><text><body>
<entry><form><orth>airport</orth></form><gramGrp><pos>n</pos></gramGrp>
 <sense><cit type="trans"><quote>{airport}</quote><gramGrp><gen>{gen}</gen></gramGrp></cit></sense>
</entry>
<entry><form><orth>government</orth></form><sense><cit type="trans"><quote>{government}</quote></cit>
 <cit type="example"><quote>Do not take this example sentence as a translation.</quote>
 <cit type="trans"><quote>WRONG EXAMPLE TRANSLATION</quote></cit></cit></sense></entry>
<entry><form><orth>bank</orth></form><sense><cit type="trans"><quote>{bank}</quote></cit></sense></entry>
</body></text></TEI>'''
class ImportTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.folder=Path(self.tmp.name)
  for l,s in {'fr':('aéroport','gouvernement','banque'),'it':('aeroporto','governo','banca'),'es':('aeropuerto','gobierno','banco')}.items():
   (self.folder/f'{l}.tei').write_text(TEMPLATE.format(airport=s[0],government=s[1],bank=s[2],gen='m'),encoding='utf8')
 def tearDown(self):self.tmp.cleanup()
 def test_parsing_and_merging(self):
  d={l:extract(self.folder/f'{l}.tei') for l in ('fr','it','es')}
  self.assertEqual(d['fr']['government'][0][0],'gouvernement')
  self.assertEqual(len(d['fr']['government']),1,'example translations must be excluded')
  rows,by_topic,by_level,total=compose([],d,seeds())
  self.assertEqual(total,3)
  a=next(w for w in rows if w['topic']=='travel' and w['en']=='airport')
  self.assertEqual((a['fr'],a['it'],a['es']),('aéroport','aeroporto','aeropuerto'))
  self.assertEqual(a['gender']['fr'],'m')
  self.assertEqual(a['reviewStatus'],'imported-draft')
  self.assertIn('level',a)
  self.assertEqual(next(w for w in rows if w['en']=='government' and w['topic']=='politics')['fr'],'gouvernement')
 def test_levels(self):
  self.assertEqual(estimate_level('house','home'),'A1')
  self.assertIn(estimate_level('parliamentary','politics'),LEVELS)
  self.assertIn(estimate_level('macroeconomics','business'),LEVELS)

if __name__=='__main__':unittest.main()
