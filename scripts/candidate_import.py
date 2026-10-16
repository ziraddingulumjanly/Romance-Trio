"""Extract *candidates* from a user-supplied English Kaikki JSONL dump.

Requires no Python dependencies. Does NOT overwrite the reviewed site content.
The source Wiktionary text is CC BY-SA / GFDL. See DATA_SOURCES.md.

Example:
    python scripts/candidate_import.py path/to/kaikki.org-dictionary-English.jsonl.gz

The dump is streamed rather than loaded into memory. Only entries with translations
into all three target languages are exported. This is a convenience filter, NOT
semantic validation. Ambiguous words, dialects, parts of speech, and gender
require human review before publishing.
"""
from pathlib import Path
import sys, json, csv, gzip, bz2

def line_stream(path:Path):
    opener=gzip.open if path.suffix=='.gz' else bz2.open if path.suffix=='.bz2' else open
    with opener(path,'rt',encoding='utf-8') as file:
        yield from file

def main():
    if len(sys.argv)!=2:
        print('Usage: python scripts/candidate_import.py path/to/english-kaikki-dump.jsonl[.gz|.bz2]')
        raise SystemExit(2)
    src=Path(sys.argv[1]); dest=Path(__file__).resolve().parents[1]/'content'/'import_candidates.tsv'
    count=0
    with dest.open('w',encoding='utf-8',newline='') as out:
        writer=csv.writer(out,delimiter='\t')
        writer.writerow(['english','french_candidate','italian_candidate','spanish_candidate','part_of_speech','source'])
        for line in line_stream(src):
            try: entry=json.loads(line)
            except json.JSONDecodeError: continue
            if entry.get('lang_code') not in ('en',None): continue
            term=entry.get('word','')
            if not isinstance(term,str) or len(term)>90 or not term.strip():continue
            translations=list(entry.get('translations',[]))
            for sense in entry.get('senses',[]):
                if isinstance(sense,dict):translations+=sense.get('translations',[])
            langs={}
            for t in translations:
                if not isinstance(t,dict):continue
                code=t.get('lang_code');value=t.get('word')
                if code in ('fr','it','es') and isinstance(value,str) and value.strip() and code not in langs:
                    langs[code]=value.strip()
            if all(x in langs for x in ('fr','it','es')):
                writer.writerow([term,langs['fr'],langs['it'],langs['es'],entry.get('pos',''),f'Kaikki / Wiktionary — {src.name}']);count+=1
    print(f'Wrote {count} unreviewed candidates to {dest}. Do not publish without linguistic/license review.')
if __name__=='__main__':main()
