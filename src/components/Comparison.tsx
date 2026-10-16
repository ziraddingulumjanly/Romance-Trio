'use client';
import {type Word,hasTranslation} from '@/lib/vocabulary';
import {LANGUAGES,type Lang} from '@/lib/languages';
import SpeechButton from './SpeechButton';
import { sitePath } from '@/lib/site-path';
const EXAMPLES:Record<string,Record<Lang,string>>={
 house:{en:'It’s a beautiful house.',fr:'C’est une belle maison.',it:'È una bella casa.',es:'Es una casa hermosa.'},
 beautiful:{en:'It is a beautiful city.',fr:'C’est une belle ville.',it:'È una bella città.',es:'Es una ciudad bonita.'},
 important:{en:'This is important.',fr:'C’est important.',it:'È importante.',es:'Es importante.'},
 coffee:{en:'I would like a coffee.',fr:'Je voudrais un café.',it:'Vorrei un caffè.',es:'Quisiera un café.'},
 family:{en:'My family is here.',fr:'Ma famille est ici.',it:'La mia famiglia è qui.',es:'Mi familia está aquí.'},
 book:{en:'I read a book.',fr:'Je lis un livre.',it:'Leggo un libro.',es:'Leo un libro.'},
 school:{en:'The school is open.',fr:'L’école est ouverte.',it:'La scuola è aperta.',es:'La escuela está abierta.'},
 government:{en:'The government announced a reform.',fr:'Le gouvernement a annoncé une réforme.',it:'Il governo ha annunciato una riforma.',es:'El gobierno anunció una reforma.'},
 water:{en:'I drink water.',fr:'Je bois de l’eau.',it:'Bevo acqua.',es:'Bebo agua.'},
 democracy:{en:'Democracy matters.',fr:'La démocratie est importante.',it:'La democrazia è importante.',es:'La democracia es importante.'}
};
export default function Comparison({word,compact=false}:{word:Word;compact?:boolean}){
 return <div className={'comparison-grid '+(compact?'comparison-compact':'')}>
 {LANGUAGES.map(l=>{const lang=l.code;const text=word[lang];return <article key={lang} className={'language-card lang-'+lang}>
  <div className="language-card-title"><span className="flag" aria-hidden="true">{l.flag}</span><strong>{l.label}</strong></div>
  <div className="language-card-body">
   <div className="word-line"><span className="word-display">{text}</span>{lang!=='en'&&hasTranslation(text)&&<SpeechButton text={text} lang={lang}/>}</div>
   <div className="small-caption">{lang==='en'?'Reference word':hasTranslation(text)?'Translation':'Translation not available yet'} · {word.topic==='idioms'?'idiom':word.topic==='phrases'?'phrase':'vocabulary'} · {word.level??'B1'} estimate</div>
   {lang==='en' && word.en==='house' && <img className="house-illustration" src={sitePath('/images/house.jpg')} alt="A house"/>}
   <div className="example-block">{(hasTranslation(text)&&(word.example?.[lang]||EXAMPLES[word.en]?.[lang])) ? <><p>{word.example?.[lang]||EXAMPLES[word.en][lang]}</p>{lang!=='en'&&<small>{word.example?.en||EXAMPLES[word.en]?.en}</small>}</> : <p className="muted-example">{lang==='en'?'Compare available translations across the cards.':hasTranslation(text)?'Click the speaker to practice pronunciation.':'No verified or imported translation is currently available for this language.'}</p>}</div>
  </div>
 </article>})}
 </div>;
}
