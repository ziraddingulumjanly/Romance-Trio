"""Static checks for content, honest translation placeholders and topic targets."""
from pathlib import Path
import json,re,collections,sys
sys.path.insert(0,str(Path(__file__).resolve().parent))
from catalog import LANGS,available,target_for,fold
root=Path(__file__).resolve().parents[1]
rows=json.loads((root/'src/data/vocabulary.json').read_text(encoding='utf8'))
assert len(rows)>=400,'Expected substantial vocabulary'
assert len({w['id'] for w in rows})==len(rows),'Duplicate IDs'
assert len({(w['topic'],fold(w['en'])) for w in rows})==len(rows),'Duplicate topic+English entries'
LEVELS={'A1','A2','B1','B2','C1','C2'}
for w in rows:
 assert all(isinstance(w.get(x),str) and w[x].strip() for x in ('en','topic','id')),(w,'missing headword')
 assert all(isinstance(w.get(lang),str) and w[lang].strip() for lang in LANGS),(w,'missing language field; use —')
 assert w.get('level') in LEVELS,(w,'invalid CEFR estimate')
 assert w.get('levelSource') in ('estimated','verified'),(w,'unknown CEFR metadata')
 assert w.get('reviewStatus') in ('starter','imported-draft','reviewed','seed-pending'),(w,'bad provenance')
 if w['reviewStatus']=='seed-pending':assert not any(available(w[l]) for l in LANGS),'Untranslated placeholder incorrectly marked translated'
 if w.get('gender'):
  assert all(k in LANGS and v in ('m','f','n') for k,v in w['gender'].items())
topics=set(re.findall(r"slug:'([^']+)'",(root/'src/lib/vocabulary.ts').read_text(encoding='utf8')))
assert set(w['topic'] for w in rows)==topics,'Mismatch between topic routes and data'
counts=collections.Counter(w['topic'] for w in rows)
assert all(counts[t]>=target_for(t) for t in topics),'Not all requested English entry targets have been met'
important=next(w for w in rows if w['en']=='government' and w['topic']=='politics')
assert (important['fr'],important['it'],important['es'])==('gouvernement','governo','gobierno')
for name in ['hero-city.png','travel.jpg','food.jpg','school.jpg','family.jpg','daily.jpg','shopping.jpg']:
 assert (root/'public/images'/name).is_file(),f'Missing image: {name}'
assert 'Filter by CEFR difficulty' in (root/'src/components/WordTable.tsx').read_text(encoding='utf8')
assert 'hasTranslation(word[code])' in (root/'src/components/WordTable.tsx').read_text(encoding='utf8')
assert 'practice-level' in (root/'src/app/practice/page.tsx').read_text(encoding='utf8')
translated=sum(any(available(w[l]) for l in LANGS) for w in rows)
complete=sum(all(available(w[l]) for l in LANGS) for w in rows)
print(f'PASS: {len(rows)} English topic entries; {translated} with ≥1 real translation; {complete} fully translated; {len(topics)} topics meet ENGLISH headword targets.')
