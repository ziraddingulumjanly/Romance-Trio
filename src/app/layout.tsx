import type {Metadata} from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {ThemeProvider} from '@/components/ThemeProvider';
import './globals.css';
export const metadata:Metadata={title:{default:'Romance Trio | French, Italian & Spanish Side by Side',template:'%s | Romance Trio'},description:'Learn French, Italian and Spanish together with English as your reference. Compare vocabulary, grammar, cognates, idioms, and essential phrases.',icons:{icon:'/favicon.png'},robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body><ThemeProvider><Header/><main id="main-content">{children}</main><Footer/></ThemeProvider></body></html>}
