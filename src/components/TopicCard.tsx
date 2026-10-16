import Link from 'next/link';
import {ChevronRight} from 'lucide-react';
import {type Topic,byTopic,filterByLevel,hasTranslation} from '@/lib/vocabulary';
import {TopicIcon} from './Icon';
import { sitePath } from '@/lib/site-path';
export default function TopicCard({topic,featured=false,level='all'}:{topic:Topic;featured?:boolean;level?:string}){
 const listed=filterByLevel(byTopic(topic.slug),level);const translated=listed.filter(w=>hasTranslation(w.fr)||hasTranslation(w.it)||hasTranslation(w.es)).length;
 return <Link href={'/vocabulary/'+topic.slug+'/'+(level==='all'?'':'?level='+level)} className={'topic-card tone-'+topic.color+(featured?' featured-topic':'')}>
   {featured && 'photo' in topic && topic.photo && <div className="topic-photo" style={{backgroundImage:`url(${sitePath(topic.photo)})`}}/>}
   <div className="topic-bottom"><span className="topic-icon"><TopicIcon name={topic.icon} size={22}/></span><div className="topic-details"><strong>{topic.title}</strong>{!featured&&<small>{topic.subtitle}</small>}{<small>{listed.length} English terms · {translated} translated</small>}</div><ChevronRight size={19}/></div>
  </Link>;
}
