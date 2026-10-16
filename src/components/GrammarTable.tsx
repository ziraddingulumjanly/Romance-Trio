'use client';
import type {GrammarRow} from '@/data/grammar';
import SpeechButton from './SpeechButton';
export default function GrammarTable({rows}:{rows:GrammarRow[]}){return <div className="table-scroll"><table className="word-table grammar-table"><thead><tr><th>🇬🇧 English</th><th>🇫🇷 French</th><th>🇮🇹 Italian</th><th>🇪🇸 Spanish</th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}><td className="en-cell">{r.en}</td>{(['fr','it','es'] as const).map(lang=><td key={lang}><div className="table-word">{r[lang]}<SpeechButton text={r[lang]} lang={lang}/></div></td>)}</tr>)}</tbody></table></div>}
