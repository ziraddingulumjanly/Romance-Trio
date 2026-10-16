"""Convert reviewed four-language rows into the local JSON bundle.

Input entries are manually curated. This script does not claim automatic
lexicographical validation; it checks structure, duplicates and coverage.
"""
from pathlib import Path
import json, re
ROOT=Path(__file__).resolve().parents[1]
source=ROOT/'content/vocabulary.txt'
output=ROOT/'src/data/vocabulary.json'
entries=[];seen=set();topics={}
for no,line in enumerate(source.read_text(encoding='utf8').splitlines(),1):
    if not line.strip() or line.startswith('#'):continue
    fields=[x.strip() for x in line.split('|')]
    if len(fields)!=5 or not all(fields):raise ValueError(f'Row {no}: expected 5 filled fields')
    topic,en,fr,it,es=fields
    key=(topic,en.casefold())
    if key in seen:raise ValueError(f'Row {no}: duplicate topic/English {key}')
    seen.add(key)
    slug=re.sub(r'[^a-z0-9]+','-',en.lower()).strip('-')
    entries.append({'id':f'{topic}-{slug}','topic':topic,'en':en,'fr':fr,'it':it,'es':es})
    topics[topic]=topics.get(topic,0)+1
output.parent.mkdir(parents=True,exist_ok=True)
output.write_text(json.dumps(entries,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(f'Validated {len(entries)} vocabulary records across {len(topics)} topics: {topics}')
