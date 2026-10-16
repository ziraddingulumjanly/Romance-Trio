'use client';
import {Volume2} from 'lucide-react';
import {speak,type Lang} from '@/lib/languages';
import {hasTranslation} from '@/lib/vocabulary';
export default function SpeechButton({text,lang}:{text:string;lang:Lang}){
 if(!hasTranslation(text))return null;
 return <button className="speak-btn" aria-label={'Hear '+text+' pronounced'} title={'Listen in '+({en:'English',fr:'French',it:'Italian',es:'Spanish'}[lang])} onClick={()=>{if(!speak(text,lang))alert('Text-to-speech is unavailable in this browser.')}}><Volume2 size={18}/></button>;
}
