"""Shared topic targets, English seed catalogue and missing-translation rules.

A topic's English count and its translated coverage are deliberately separate:
'—' means NO TRANSLATION AVAILABLE. Seed headwords are not dictionary translations.
"""
from __future__ import annotations
from collections import defaultdict
from pathlib import Path
import re, unicodedata, hashlib
ROOT=Path(__file__).resolve().parents[1]
TARGETS={'school':200,'politics':200,'movies':150,'food':250,'travel':250,
         'daily':300,'science':250,'idioms':150}
LANGS=('fr','it','es')
MISSING='—'

def fold(value:str)->str:
 return ''.join(c for c in unicodedata.normalize('NFKD',str(value).casefold().strip()) if not unicodedata.combining(c))

def available(value)->bool:
 return isinstance(value,str) and value.strip() not in ('','-','—','–','null','undefined')

def topics():
 result=defaultdict(list)
 for ln in (ROOT/'content/topic_seeds.txt').read_text(encoding='utf8').splitlines():
  if not ln.strip() or ln.startswith('#'):continue
  topic,terms=ln.split('|',1)
  for raw in terms.split(';'):
   en=raw.strip();key=fold(en)
   if key and not any(fold(w)==key for w in result[topic]):result[topic].append(en)
 return dict(result)

def assignments():
 result=defaultdict(list)
 for topic,words in topics().items():
  for word in words:result[fold(word)].append(topic)
 return dict(result)

def target_for(topic):return TARGETS.get(topic,100)

def seed_row(topic,en):
 key=re.sub(r'[^a-z0-9]+','-',fold(en)).strip('-')
 suffix=hashlib.sha1(en.encode('utf8')).hexdigest()[:9]
 return {'id':f'{topic}-{key}-{suffix}','topic':topic,'en':en,'fr':MISSING,'it':MISSING,'es':MISSING,
         'source':'English topic catalogue (not translated)',
         'reviewStatus':'seed-pending'}

def populate_missing(rows):
 """Fill *English headword coverage*, without pretending placeholders are translated."""
 seen={(r['topic'],fold(r['en'])) for r in rows}
 for topic,english in topics().items():
  for en in english:
   key=(topic,fold(en))
   if key not in seen:rows.append(seed_row(topic,en));seen.add(key)
 return rows
