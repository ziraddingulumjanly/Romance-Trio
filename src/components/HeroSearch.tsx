'use client';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {Search,ArrowRight} from 'lucide-react';
export default function HeroSearch(){const router=useRouter();const [query,setQuery]=useState('');const submit=(word=query)=>{if(word.trim())router.push('/compare/?q='+encodeURIComponent(word.trim()))};return <>
 <form className="hero-search" onSubmit={e=>{e.preventDefault();submit()}}><Search size={23}/><input aria-label="Compare an English word" placeholder="Type an English word (e.g. house, eat, beautiful...)" value={query} onChange={e=>setQuery(e.target.value)}/><button className="btn btn-primary" type="submit">Compare <ArrowRight size={19}/></button></form>
 <div className="hero-suggestions"><span>Try:</span>{['house','water','family','travel','to speak','government'].map(word=><button key={word} onClick={()=>{setQuery(word);submit(word)}}>{word}</button>)}</div>
 </>}
