"""Annotate starter data without changing vetted translation text.

Run after build_vocabulary.py, or via `npm run data:enrich`.
`level` is an *estimated English-reference learning level*.
An absent grammatical gender or example means 'unknown', not 'masculine'.
"""
from pathlib import Path
import json,sys
sys.path.insert(0,str(Path(__file__).resolve().parent))
from level_rules import estimate_level,english_frequency
root=Path(__file__).resolve().parents[1]
path=root/'src/data/vocabulary.json'
rows=json.loads(path.read_text(encoding='utf-8'))
# Only hand-verified grammar hints for unambiguous entries.
GENDER={
 'house':{'fr':'f','it':'f','es':'f'},'school':{'fr':'f','it':'f','es':'f'},
 'book':{'fr':'m','it':'m','es':'m'},'family':{'fr':'f','it':'f','es':'f'},
 'water':{'fr':'f','it':'f','es':'f'},'government':{'fr':'m','it':'m','es':'m'},
 'democracy':{'fr':'f','it':'f','es':'f'},'sun':{'fr':'m','it':'m','es':'m'},
 'moon':{'fr':'f','it':'f','es':'f'},'city':{'fr':'f','it':'f','es':'f'},
 'music':{'fr':'f','it':'f','es':'f'},'time':{'fr':'m','it':'m','es':'m'},
 'coffee':{'fr':'m','it':'m','es':'m'},'airport':{'fr':'m','it':'m','es':'m'},
 'train':{'fr':'m','it':'m','es':'m'},'telephone':{'fr':'m','it':'m','es':'m'},
 'language':{'fr':'f','it':'f','es':'m'}
}
POS={
 'idioms':'idiom','phrases':'phrase','verbs':'verb','adjectives':'adjective',
 'colors':'adjective','numbers':'number'
}
EXAMPLES={
 'house':{'en':"It's a beautiful house.",'fr':'C’est une belle maison.','it':'È una bella casa.','es':'Es una casa hermosa.'},
 'government':{'en':'The government announced a reform.','fr':'Le gouvernement a annoncé une réforme.','it':'Il governo ha annunciato una riforma.','es':'El gobierno anunció una reforma.'},
 'democracy':{'en':'Democracy matters.','fr':'La démocratie est importante.','it':'La democrazia è importante.','es':'La democracia es importante.'},
 'water':{'en':'I drink water.','fr':'Je bois de l’eau.','it':'Bevo acqua.','es':'Bebo agua.'},
 'family':{'en':'My family is here.','fr':'Ma famille est ici.','it':'La mia famiglia è qui.','es':'Mi familia está aquí.'},
 'school':{'en':'The school is open.','fr':'L’école est ouverte.','it':'La scuola è aperta.','es':'La escuela está abierta.'},
 'book':{'en':'I read a book.','fr':'Je lis un livre.','it':'Leggo un libro.','es':'Leo un libro.'},
 'coffee':{'en':'I would like a coffee.','fr':'Je voudrais un café.','it':'Vorrei un caffè.','es':'Quisiera un café.'},
 'beautiful':{'en':'It is a beautiful city.','fr':'C’est une belle ville.','it':'È una bella città.','es':'Es una ciudad bonita.'},
 'important':{'en':'This is important.','fr':'C’est important.','it':'È importante.','es':'Es importante.'},
}
for w in rows:
 w['level']=estimate_level(w['en'],w['topic'],english_frequency(w['en']))
 w['levelSource']='estimated'
 w.setdefault('source','Romance Trio starter collection')
 w.setdefault('reviewStatus','starter')
 if w['en'].lower() in GENDER and w['topic'] not in ('idioms','phrases'):
  w['gender']=GENDER[w['en'].lower()]
 if w['en'].lower() in EXAMPLES: w['example']=EXAMPLES[w['en'].lower()]
 if w['topic'] in POS:w['partOfSpeech']=POS[w['topic']]
path.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
from collections import Counter
print('Enriched',len(rows),'starter records.',dict(Counter(w['level'] for w in rows)))
