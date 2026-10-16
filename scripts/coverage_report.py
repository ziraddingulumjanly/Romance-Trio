"""Report distinct English entries AND actual per-language translation coverage.

Topic targets are for English catalogue rows. Never mistake them for fully
translated comparisons. Counts of multilingual data are reported separately.
"""
from pathlib import Path
import json,collections,re,sys
sys.path.insert(0,str(Path(__file__).resolve().parent))
from catalog import LANGS,TARGETS,available,target_for
root=Path(__file__).resolve().parents[1]
rows=json.loads((root/'src/data/vocabulary.json').read_text(encoding='utf8'))
slugs=re.findall(r"slug:'([^']+)'",(root/'src/lib/vocabulary.ts').read_text(encoding='utf8'))
by=collections.defaultdict(list)
for w in rows:by[w['topic']].append(w)
print('TOPIC COVERAGE: English candidates AND genuine translations (only Any counts toward user vocabulary targets)')
print('Topic               English   FR   IT   ES  Any/target   All-3  Translation status')
failed=[]
for slug in slugs:
 rr=by[slug];n=len(rr);target=target_for(slug)
 have={lang:sum(available(w.get(lang)) for w in rr) for lang in LANGS}
 anycount=sum(any(available(w.get(lang)) for lang in LANGS) for w in rr)
 complete=sum(all(available(w.get(lang)) for lang in LANGS) for w in rr)
 ok=anycount>=target
 print(f'{slug:18} {n:6} {have["fr"]:5} {have["it"]:4} {have["es"]:4}  {anycount:4}/{target:<4} {complete:6}  {"MET" if ok else "MORE NEEDED"}')
 if not ok:failed.append(slug)
print('TOTAL:',len(rows),'Entries with ≥1 real translation:',sum(any(available(w.get(lang)) for lang in LANGS) for w in rows), 'Complete 4-column comparisons:',sum(all(available(w.get(lang)) for lang in LANGS) for w in rows))
print('Missing translations are shown as — and excluded from selected-language practice.')
print('CEFR labels are heuristic learning estimates, not certified CEFR levels.')
if failed:
 print('UNMET TRANSLATION TARGETS:', ', '.join(failed))
 print('English-only placeholders DO NOT satisfy the translated-word requirements. Run actual imports or add reviewed translations.')
