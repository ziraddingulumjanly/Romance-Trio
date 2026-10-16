import type {Metadata} from 'next';
import ListeningLab from '@/components/listening-lab/ListeningLab';
export const metadata:Metadata={title:'Listening Lab — Hear, Type & Learn',description:'Listen to French, Italian and Spanish sentences, type what you hear, translate, fill blanks and arrange words from A1 to C2.'};
export default function ListeningLabPage(){return <ListeningLab/>;}
