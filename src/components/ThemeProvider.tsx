'use client';
import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
type Theme='light'|'dark';
const Context=createContext<{theme:Theme,toggle:()=>void}>({theme:'light',toggle:()=>{}});
export function ThemeProvider({children}:{children:ReactNode}){
 const [theme,setTheme]=useState<Theme>('light');
 useEffect(()=>{
  const saved=window.localStorage.getItem('rt-theme');
  setTheme(saved==='dark'?'dark':'light');
 },[]);
 useEffect(()=>{document.documentElement.dataset.theme=theme;window.localStorage.setItem('rt-theme',theme)},[theme]);
 return <Context.Provider value={{theme,toggle:()=>setTheme(t=>t==='dark'?'light':'dark')}}>{children}</Context.Provider>;
}
export const useTheme=()=>useContext(Context);
