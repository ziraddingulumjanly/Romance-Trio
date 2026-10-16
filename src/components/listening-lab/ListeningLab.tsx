'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import Link from 'next/link';
import {ArrowLeft,ArrowRight,AudioLines,BookOpen,Check,CheckCheck,ChevronDown,Headphones,Keyboard,Languages,Lightbulb,ListOrdered,Pause,RotateCcw,Settings2,Volume2,VolumeX,WandSparkles,X} from 'lucide-react';
import raw from '@/data/listening-sentences.json';
import {playUiSound} from './sounds';
import type {TargetLang} from '@/lib/languages';

type Level='A1'|'A2'|'B1'|'B2'|'C1'|'C2';
type Mode='dictation'|'translate'|'gap'|'order';
type Sentence={id:string;level:Level;topic:string;en:string;fr:string;it:string;es:string;source:string};
type Verdict='correct'|'wrong'|null;
const SENTENCES=raw as Sentence[];
const LANGS:{id:TargetLang;label:string;flag:string;locale:string}[]=[{id:'fr',label:'French',flag:'🇫🇷',locale:'fr-FR'},{id:'it',label:'Italian',flag:'🇮🇹',locale:'it-IT'},{id:'es',label:'Spanish',flag:'🇪🇸',locale:'es-ES'}];
const LEVELS:Level[]=['A1','A2','B1','B2','C1','C2'];
const MODES:{id:Mode;name:string;short:string;description:string;Icon:typeof Headphones}[]=[
 {id:'dictation',name:'Listen & Type',short:'Type it',description:'Hear a sentence and type it in the same language.',Icon:Keyboard},
 {id:'translate',name:'Listen & Translate',short:'Translate',description:'Hear a sentence and type its English meaning.',Icon:Languages},
 {id:'gap',name:'Fill the Gaps',short:'Missing word',description:'Listen and fill in the missing word.',Icon:BookOpen},
 {id:'order',name:'Word Order',short:'Arrange',description:'Listen and arrange the shuffled words.',Icon:ListOrdered},
];
const tokenRe=/\p{L}[\p{L}\p{M}'’\-]*/gu;
function matchTokens(text:string){return Array.from(text.matchAll(tokenRe));}
function normalize(text:string,strict:boolean){return (strict?text:text.normalize('NFD').replace(/[\u0300-\u036f]/g,''))
 .toLocaleLowerCase().replace(/['’]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').replace(/\s+/g,' ').trim();}
function getGap(sentence:string){
 const hits=matchTokens(sentence);
 const offset=Math.min(hits.length-1,Math.max(0,Math.floor(hits.length*.64)));
 const matched=hits[offset];if(!matched)return {masked:sentence,answer:sentence};
 return {masked:sentence.slice(0,matched.index)+'_____ '+sentence.slice((matched.index??0)+matched[0].length),answer:matched[0]};
}
function shuffled(sentence:string,id:string){
 const tokens=sentence.trim().split(/\s+/).map((label,i)=>({label,i}));
 let seed=([...id].reduce((acc,char)=>acc*31+char.charCodeAt(0),17)>>>0);
 for(let i=tokens.length-1;i>0;i--){seed=(seed*1664525+1013904223)>>>0;const j=seed%(i+1);[tokens[i],tokens[j]]=[tokens[j],tokens[i]];}
 if(tokens.length>1&&tokens.every((t,i)=>t.i===i))tokens.reverse();
 return tokens;
}
function speakSentence(text:string,lang:TargetLang,slow:boolean,onState:(speaking:boolean)=>void){
 if(typeof window==='undefined'||!window.speechSynthesis){onState(false);return false;}
 const locale=LANGS.find(x=>x.id===lang)!.locale;
 const utterance=new SpeechSynthesisUtterance(text);
 utterance.lang=locale;utterance.rate=slow?.7:.9;utterance.pitch=1;
 utterance.onstart=()=>onState(true);utterance.onend=()=>onState(false);utterance.onerror=()=>onState(false);
 window.speechSynthesis.cancel();window.speechSynthesis.speak(utterance);
 return true;
}
export default function ListeningLab(){
 const [lang,setLang]=useState<TargetLang>('fr');
 const [level,setLevel]=useState<Level>('A1');
 const [mode,setMode]=useState<Mode>('dictation');
 const [topic,setTopic]=useState('all');
 const [step,setStep]=useState(0);
 const [typed,setTyped]=useState('');
 const [picked,setPicked]=useState<number[]>([]);
 const [verdict,setVerdict]=useState<Verdict>(null);
 const [hint,setHint]=useState(false);
 const [slow,setSlow]=useState(false);
 const [sounds,setSounds]=useState(true);
 const [strict,setStrict]=useState(false);
 const [speaking,setSpeaking]=useState(false);
 const [message,setMessage]=useState('');
 const inputRef=useRef<HTMLTextAreaElement|null>(null);
 const options=useMemo(()=>SENTENCES.filter(s=>s.level===level&&(topic==='all'||s.topic===topic)),[level,topic]);
 const sentence=options[step%options.length];
 const target=sentence[lang];
 const gap=getGap(target);
 const words=useMemo(()=>shuffled(target,sentence.id+lang),[target,sentence.id,lang]);
 const actual=mode==='order'?picked.map(i=>words.find(w=>w.i===i)?.label??'').join(' '):typed;
 const expected=mode==='translate'?sentence.en:mode==='gap'?gap.answer:target;
 const topicLabels:Record<string,string>={daily:'Daily Life',food:'Food & Dining',travel:'Travel',school:'School',family:'Family',shopping:'Shopping',work:'Work',science:'Science',politics:'Politics',movies:'Movies'};
 const availableTopics=useMemo(()=>Array.from(new Set(SENTENCES.filter(s=>s.level===level).map(s=>s.topic))),[level]);
 useEffect(()=>()=>{if(typeof window!=='undefined'&&window.speechSynthesis)window.speechSynthesis.cancel();},[]);
 const clearResponse=()=>{setTyped('');setPicked([]);setVerdict(null);setHint(false);setMessage('');setSpeaking(false);if(typeof window!=='undefined')window.speechSynthesis?.cancel();};
 const changeLevel=(value:Level)=>{setLevel(value);setStep(0);setTopic('all');clearResponse();};
 const changeLang=(value:TargetLang)=>{setLang(value);setStep(0);clearResponse();};
 const changeMode=(value:Mode)=>{setMode(value);setStep(0);clearResponse();};
 const next=()=>{setStep(s=>(s+1)%options.length);clearResponse();};
 const play=()=>{setMessage('');if(!speakSentence(target,lang,slow,setSpeaking))setMessage('No speech synthesis available in this browser. Try Chrome or Edge with language voices installed.');};
 const check=()=>{
  if(!actual.trim())return;
  const exact=normalize(actual,strict)===normalize(expected,strict);
  setVerdict(exact?'correct':'wrong');
  playUiSound(exact?'correct':'wrong',sounds);
 };
 const choose=(index:number)=>{if(verdict)return;playUiSound('select',sounds);setPicked(p=>[...p,index]);};
 const remove=(index:number)=>{if(verdict)return;playUiSound('select',sounds);setPicked(p=>p.filter((_,n)=>n!==index));};
 const already=picked.length===words.length;
 return <div className="ll-page container">
  <div className="ll-breadcrumb"><Link href="/"><ArrowLeft size={15}/> Home</Link><span>/</span><span>Listening Lab</span></div>
  <div className="ll-pagehead"><div><span className="eyebrow"><WandSparkles size={15}/> YOUR IMMERSIVE LANGUAGE STUDIO</span><h1>Listen. Type. <em>Understand.</em></h1><p>Real sentences, clear feedback, and four ways to sharpen your ear. No account, no saved scores, no paid AI.</p></div><div className="ll-sticker"><AudioLines size={24}/><span>270 listening exercises</span></div></div>
  <div className="ll-shell">
   <aside className="ll-settings">
    <div className="ll-settings-title"><Settings2 size={18}/><strong>Set up your session</strong></div>
    <label className="ll-caption">LEARNING LANGUAGE</label>
    <div className="ll-lang-switch" role="group" aria-label="Listening language">{LANGS.map(l=><button type="button" className={lang===l.id?'active':''} aria-pressed={lang===l.id} key={l.id} onClick={()=>changeLang(l.id)}><span>{l.flag}</span>{l.label}</button>)}</div>
    <label htmlFor="ll-level" className="ll-caption">SENTENCE DIFFICULTY</label>
    <div className="ll-select"><select id="ll-level" value={level} onChange={e=>changeLevel(e.target.value as Level)}>{LEVELS.map(l=><option key={l} value={l}>{l} — {({A1:'Beginner',A2:'Elementary',B1:'Intermediate',B2:'Upper intermediate',C1:'Advanced',C2:'Proficient'} as Record<Level,string>)[l]}</option>)}</select><ChevronDown size={16}/></div>
    <label htmlFor="ll-topic" className="ll-caption">SENTENCE TOPIC</label>
    <div className="ll-select"><select id="ll-topic" value={topic} onChange={e=>{setTopic(e.target.value);setStep(0);clearResponse();}}><option value="all">All topics</option>{availableTopics.map(t=><option key={t} value={t}>{topicLabels[t]??t}</option>)}</select><ChevronDown size={16}/></div>
    <label className="ll-caption">EXERCISE MODE</label>
    <div className="ll-mode-list">{MODES.map(m=><button type="button" key={m.id} className={mode===m.id?'active':''} aria-pressed={mode===m.id} onClick={()=>changeMode(m.id)}><m.Icon size={19}/><span><strong>{m.name}</strong><small>{m.description}</small></span>{mode===m.id&&<Check size={17}/>}</button>)}</div>
    <div className="ll-preferences"><label><input type="checkbox" checked={sounds} onChange={e=>setSounds(e.target.checked)}/><span>Keyboard & feedback sounds</span></label><label><input type="checkbox" checked={strict} onChange={e=>{setStrict(e.target.checked);setVerdict(null);}}/><span>Strict accent checking</span></label></div>
    <div className="ll-settings-note"><Lightbulb size={18}/><span>CEFR labels are teaching estimates. Browser voices and pronunciation may vary by device.</span></div>
   </aside>
   <section className="ll-exercise" aria-label="Listening exercise">
    <div className="ll-exercise-top"><div><span className="ll-live-dot"/> {LANGS.find(l=>l.id===lang)?.flag} {LANGS.find(l=>l.id===lang)?.label} <span className="ll-top-separator">·</span> {level}</div><div>Sentence {step+1} of {options.length}</div></div>
    <div className="ll-progressbar"><div style={{width:`${(step+1)/options.length*100}%`}}/></div>
    <div className="ll-center">
     <span className="ll-lesson-tag"><Headphones size={15}/> LISTENING LAB <span>·</span> {MODES.find(m=>m.id===mode)?.name}</span>
     <button type="button" className={'ll-audio-orb '+(speaking?'is-playing':'')} onClick={play} aria-label={speaking?'Replay sentence':'Play sentence'} title="Play sentence"><Volume2 size={42} strokeWidth={1.8}/><span className="ll-orb-ring"/></button>
     <h2>{mode==='translate'?'Listen and write its meaning':mode==='gap'?'Complete the missing word':mode==='order'?'Put the words in order':'Type what you hear'}</h2>
     <p>Listen as many times as you need. Then check your answer.</p>
     <div className="ll-play-controls"><button type="button" className="ll-pill" onClick={play}><RotateCcw size={15}/> Replay audio</button><button type="button" className={'ll-pill '+(slow?'active':'')} aria-pressed={slow} onClick={()=>{setSlow(s=>!s);setSpeaking(false);window.speechSynthesis?.cancel();}}><Pause size={15}/>{slow?'Slow 0.7×':'Speed 0.9×'}</button></div>
     {message&&<p className="ll-browser-message" role="status">{message}</p>}
    </div>
    <div className="ll-answer-block">
     {mode==='gap'&&<div className="ll-masked" aria-label="Sentence with a missing word">{gap.masked}</div>}
     {mode==='order'?<><span className="ll-fieldlabel">YOUR SENTENCE</span><div className="ll-ordered-box">{picked.length===0&&<span className="ll-placeholder">Tap words below to build the sentence</span>}{picked.map((w,i)=><button key={i} type="button" onClick={()=>remove(i)} disabled={!!verdict}>{words.find(a=>a.i===w)?.label}<X size={12}/></button>)}</div><span className="ll-fieldlabel">AVAILABLE WORDS</span><div className="ll-wordbank">{words.filter(t=>!picked.includes(t.i)).map(t=><button key={t.i} type="button" onClick={()=>choose(t.i)} disabled={!!verdict}>{t.label}</button>)}{already&&<span className="ll-bank-empty">All words selected</span>}</div></>:<><label htmlFor="ll-answer" className="ll-fieldlabel">{mode==='translate'?'YOUR ENGLISH TRANSLATION':mode==='gap'?'MISSING WORD':'YOUR ANSWER'}</label><div className="ll-textbox"><textarea ref={inputRef} id="ll-answer" rows={mode==='gap'?1:2} placeholder={mode==='translate'?'Write the English sentence here…':mode==='gap'?'Type the missing word…':'Start typing the sentence you hear…'} value={typed} disabled={!!verdict} onChange={e=>setTyped(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();if(verdict)next();else check();return;}if(e.key.length===1||e.key==='Backspace')playUiSound('key',sounds);}}/></div><div className="ll-input-meta"><Keyboard size={14}/> Press Enter to check <span>·</span> Punctuation is optional · English translations use a fixed answer</div></>}
     {hint&&!verdict&&<div className="ll-hint"><Lightbulb size={17}/>{mode==='translate'?`English answer begins: ${sentence.en.slice(0,Math.min(5,sentence.en.length))}…`:`Meaning: ${sentence.en}`}</div>}
     {verdict&&<div className={'ll-feedback '+(verdict==='correct'?'good':'bad')} role="status"><div className="ll-feedback-title">{verdict==='correct'?<CheckCheck size={21}/>:<RotateCcw size={20}/>}<strong>{verdict==='correct'?"Excellent! That is correct.":'Not quite — compare your answer.'}</strong></div><div><small>EXPECTED ANSWER</small><p lang={mode==='translate'?'en':lang}>{expected}</p></div>{mode!=='translate'&&<div className="ll-feedback-translation"><small>ENGLISH MEANING</small><p>{sentence.en}</p></div>}</div>}
     <div className="ll-actions"><button type="button" className="ll-hint-button" disabled={!!verdict} onClick={()=>setHint(h=>!h)}><Lightbulb size={17}/>{hint?'Hide hint':'Get a hint'}</button><div className="ll-action-right">{verdict==='wrong'&&<button type="button" className="ll-retry" onClick={()=>{setVerdict(null);setTyped('');setPicked([]);inputRef.current?.focus();}}>Try again</button>}<button type="button" className="ll-check" onClick={verdict?next:check} disabled={!verdict&&!actual.trim()}>{verdict?'Next sentence':'Check answer'}<ArrowRight size={18}/></button></div></div>
    </div>
   </section>
  </div>
  <div className="ll-footnote"><VolumeX size={16}/> Keyboard effects are optional. Sentences and correction checks run locally; speaking audio uses the device&apos;s built-in text-to-speech service.</div>
 </div>;
}
