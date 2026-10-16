import raw from '@/data/vocabulary.json';
import { fold } from './languages';
export type CefrLevel = 'A1'|'A2'|'B1'|'B2'|'C1'|'C2';
export const CEFR_LEVELS: CefrLevel[]=['A1','A2','B1','B2','C1','C2'];
export interface Word {
 id: string; topic: string; en: string; fr: string; it: string; es: string;
 level?: CefrLevel; levelSource?: 'estimated'|'verified';
 gender?: Partial<Record<'fr'|'it'|'es','m'|'f'|'n'>>;
 partOfSpeech?: string; example?: Partial<Record<'en'|'fr'|'it'|'es',string>>;
 source?: string; exampleStatus?: string; exampleAttribution?: string; reviewStatus?: 'starter'|'imported-draft'|'reviewed'|'seed-pending'; senseHint?: string;
}
export const filterByLevel=(items:Word[], level:string):Word[] => level==='all'?items:items.filter(w=>w.level===level);
export const hasTranslation=(value:string|undefined|null):boolean=>Boolean(value&&value.trim()&&!['—','-','–'].includes(value.trim()));
export const WORDS: Word[] = raw as Word[];
export const TOPICS = [
  {slug:'travel',title:'Travel',subtitle:'Explore the world',icon:'Plane',photo:'/images/travel.jpg',color:'blue',group:'Everyday life'},
  {slug:'food',title:'Food & Dining',subtitle:'From breakfast to dinner',icon:'Utensils',photo:'/images/food.jpg',color:'orange',group:'Everyday life'},
  {slug:'family',title:'Family',subtitle:'People close to you',icon:'Users',photo:'/images/family.jpg',color:'rose',group:'People & society'},
  {slug:'school',title:'School & Education',subtitle:'Learn, study and teach',icon:'GraduationCap',photo:'/images/school.jpg',color:'blue',group:'Study & work'},
  {slug:'shopping',title:'Shopping',subtitle:'Stores, money and style',icon:'ShoppingBag',photo:'/images/shopping.jpg',color:'orange',group:'Everyday life'},
  {slug:'daily',title:'Daily Life',subtitle:'Useful everyday words',icon:'Coffee',photo:'/images/daily.jpg',color:'violet',group:'Everyday life'},
  {slug:'politics',title:'Politics',subtitle:'Government and society',icon:'Landmark',color:'rose',group:'People & society'},
  {slug:'movies',title:'Movies & Cinema',subtitle:'Films, shows and stories',icon:'Clapperboard',color:'violet',group:'Arts & culture'},
  {slug:'technology',title:'Technology & AI',subtitle:'Digital world and innovation',icon:'Laptop',color:'blue',group:'Study & work'},
  {slug:'science',title:'Science',subtitle:'Discover how things work',icon:'Atom',color:'green',group:'Study & work'},
  {slug:'health',title:'Health & Medicine',subtitle:'Care and wellbeing',icon:'HeartPulse',color:'rose',group:'Everyday life'},
  {slug:'sports',title:'Sports',subtitle:'Play, compete, improve',icon:'Trophy',color:'orange',group:'Culture & leisure'},
  {slug:'nature',title:'Nature',subtitle:'Our beautiful planet',icon:'Trees',color:'green',group:'Nature & places'},
  {slug:'home',title:'Home & Furniture',subtitle:'The spaces we live in',icon:'House',color:'blue',group:'Everyday life'},
  {slug:'work',title:'Work & Career',subtitle:'Office and professional life',icon:'BriefcaseBusiness',color:'violet',group:'Study & work'},
  {slug:'emotions',title:'Emotions',subtitle:'Express how you feel',icon:'Heart',color:'rose',group:'People & society'},
  {slug:'colors',title:'Colors',subtitle:'Describe the world',icon:'Palette',color:'violet',group:'Foundations'},
  {slug:'numbers',title:'Numbers',subtitle:'Count with confidence',icon:'Hash',color:'green',group:'Foundations'},
  {slug:'adjectives',title:'Everyday Adjectives',subtitle:'Describe people and things',icon:'Palette',color:'rose',group:'Foundations'},
  {slug:'verbs',title:'Common Verbs',subtitle:'Essential everyday actions',icon:'BookOpenCheck',color:'orange',group:'Foundations'},
  {slug:'body',title:'The Human Body',subtitle:'Head, hands and more',icon:'Accessibility',color:'rose',group:'Everyday life'},
  {slug:'city',title:'City & Transport',subtitle:'Find your way around',icon:'Building2',color:'blue',group:'Nature & places'},
  {slug:'music',title:'Music',subtitle:'Sounds and instruments',icon:'Music2',color:'violet',group:'Arts & culture'},
  {slug:'art',title:'Art & Culture',subtitle:'Creative expressions',icon:'Brush',color:'orange',group:'Arts & culture'},
  {slug:'history',title:'History',subtitle:'People and the past',icon:'LibraryBig',color:'rose',group:'Arts & culture'},
  {slug:'weather',title:'Weather & Seasons',subtitle:'Talk about the forecast',icon:'CloudSun',color:'blue',group:'Nature & places'},
  {slug:'animals',title:'Animals',subtitle:'Creatures big and small',icon:'PawPrint',color:'green',group:'Nature & places'},
  {slug:'relationships',title:'Relationships',subtitle:'Connection and friendship',icon:'MessagesSquare',color:'rose',group:'People & society'},
  {slug:'business',title:'Business & Economy',subtitle:'Money, markets and trade',icon:'ChartNoAxesCombined',color:'green',group:'Study & work'},
  {slug:'law',title:'Law & Justice',subtitle:'Rights and institutions',icon:'Scale',color:'blue',group:'People & society'},
  {slug:'phrases',title:'Essential Phrases',subtitle:'Say something useful today',icon:'MessageCircleMore',color:'orange',group:'Foundations'},
  {slug:'idioms',title:'Idioms & Expressions',subtitle:'Meaning beyond the words',icon:'Lightbulb',color:'violet',group:'Arts & culture'}
] as const;
export type Topic = (typeof TOPICS)[number];
export function byTopic(topic:string):Word[] { return WORDS.filter(w=>w.topic===topic); }
export function findWord(query:string):Word|undefined {const q=fold(query);if(!q)return undefined;return WORDS.find(w=>fold(w.en)===q) ?? WORDS.find(w=>fold(w.en)==='to '+q) ?? WORDS.find(w=>[w.fr,w.it,w.es].some(v=>hasTranslation(v)&&fold(v)===q)) ?? WORDS.find(w=>fold(w.en).startsWith(q))}
export function searchWords(query:string):Word[]{const q=fold(query);if(!q)return [];return WORDS.filter(w=>[w.en,w.fr,w.it,w.es].some(v=>hasTranslation(v)&&fold(v).includes(q))).slice(0,40)}
