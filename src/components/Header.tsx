'use client';
import {usePathname,useRouter} from 'next/navigation';
import Link from 'next/link';
import {Menu,X,Search,Moon,Sun,ArrowRight} from 'lucide-react';
import {useState} from 'react';
import Brand from './Brand';
import {useTheme} from './ThemeProvider';
const nav=[{href:'/',label:'Home'},{href:'/grammar/',label:'Grammar'},{href:'/vocabulary/',label:'Vocabulary'},{href:'/practice/',label:'Practice'},{href:'/listening-lab/',label:'Listening Lab'},{href:'/resources/',label:'Resources'}];
export default function Header(){
 const path=usePathname();const router=useRouter();const [menu,setMenu]=useState(false);const [search,setSearch]=useState(false);const [query,setQuery]=useState('');const {theme,toggle}=useTheme();
 const go=()=>{if(!query.trim())return;setSearch(false);setMenu(false);router.push('/compare/?q='+encodeURIComponent(query.trim()))};
 return <header className="site-header"><div className="container nav-inner">
  <Brand/>
  <nav className={'main-nav '+(menu?'open':'')} aria-label="Main navigation">{nav.map(n=><Link onClick={()=>setMenu(false)} href={n.href} key={n.href} className={path===n.href||(n.href!=='/'&&path.startsWith(n.href))?'active':''}>{n.label}</Link>)}</nav>
  <div className="nav-actions">
   <button className="icon-btn nav-search" title="Search translations" aria-label="Open search" onClick={()=>setSearch(v=>!v)}><Search size={21}/></button>
   <button className="theme-toggle" title={'Switch to '+(theme==='light'?'dark':'light')+' mode'} aria-label="Toggle dark and light mode" onClick={toggle}><Sun size={17} className={theme==='light'?'selected':''}/><span className="theme-knob"/><Moon size={16} className={theme==='dark'?'selected':''}/></button>
   <Link className="nav-cta" href="/vocabulary/">Start learning <ArrowRight size={15}/></Link>
   <button className="icon-btn menu-btn" aria-label={menu?'Close navigation':'Open navigation'} onClick={()=>setMenu(!menu)}>{menu?<X size={25}/>:<Menu size={25}/>}</button>
  </div>
  {search&&<form className="nav-search-popover" onSubmit={e=>{e.preventDefault();go()}}><Search size={19}/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search an English word..." aria-label="Search word"/><button type="submit" aria-label="Search"><ArrowRight size={20}/></button></form>}
 </div></header>;
}
