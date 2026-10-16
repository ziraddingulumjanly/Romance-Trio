# Vocabulary provenance and licensing — Romance Trio v4

## V4 supplementary vocabulary and listening content

The project additionally ships an **original English–Spanish educational supplement** of 522 source rows in `content/editorial_supplements.tsv`, included for genuine one-target-language topic coverage. This is a manually authored study list (not an external dictionary or an accredited native-speaker validation). Where French and Italian are not sourced, the display is `—`. The original sentence bank, `src/data/listening-sentences.json`, contains 90 English/French/Italian/Spanish authored practice sets for local use. Browser voices are synthesized on demand; no audio dataset is distributed.

## Included, versus imported later

- **Bundled:** 523 starter four-language comparisons, curated for demonstration, A1–C2 estimated levels, limited gender and example sentences.
- **Bundled:** another 5,230 categorized **English entries** (some now receive original Spanish translations) plus 514 genuinely additional English study expressions. Unavailable FR/IT/ES translations are explicitly shown as `—`. Their presence meets the **English entry-count** targets, not the full-translations targets. The English topic vocabulary was drafted for this site; its inclusion is not evidence of a dictionary translation.
- **Not bundled:** full FreeDict, Kaikki/Wiktionary or Tatoeba dataset archives. Import scripts must be run on a computer with internet access or on local downloaded files. This build was prepared without access to live external dictionary downloads; the importer is provided and the user can rerun it locally.

## Real data sources

1. **FreeDict**, https://freedict.org/downloads/ — English–French, English–Italian and English–Spanish TEI. The scripts extract actual English headwords and the first plausible translation in each available bilingual dictionary, never requiring a three-way match. Every **individual dictionary** carries its own licensing and attribution/redistribution requirements. Review accompanying `COPYING` notices before publishing.
2. **Kaikki / Wiktionary**, https://kaikki.org/dictionary/rawdata.html — English Wiktextract JSONL or JSONL.gz. The automatic small fallback is https://kaikki.org/dictionary/downloads/simple/simple-extract.jsonl.gz (Simple English Wiktionary, roughly 4.5 MB compressed at writing). The *full* English Wiktionary raw extract is several GB compressed. The importer groups top-level and nested translations by **sense label**, uses one group at a time, records provenance and accepts one-language or two-language results. Wiktionary is typically **CC BY-SA / GFDL**. Review attribution/share-alike obligations before distributing derivative dictionary data.
3. **Tatoeba**, https://tatoeba.org/downloads — optional aligned example translations and attribution IDs; sentence-specific licenses apply. Do not assume all audio is licensed like text.

## Never silently fabricated

- Missing foreign-language cells are the literal em dash `—` and have **no text-to-speech button**.
- A dictionary translation in just Italian is enough to retain a row; French and Spanish stay as `—` if absent.
- `seed-pending` means zero imported translations. `imported-draft` means at least one unreviewed dictionary translation. `starter` describes the original learner-built list, not accredited native-speaker validation.
- `levelSource: "estimated"` means a heuristic study level, not an official CEFR vocabulary classification. Optional wordfreq affects frequency ranking *only when installed*; it does not certify CEFR levels.
- `coverage_report.py` prints both English thresholds **and actual** language-availability counts. Never describe the English topic count as the number of verified French–Italian–Spanish equivalents.
- Root-level Wiktionary translation records may still have broad/uninformative sense labels (e.g. "Translations"), so our grouping cannot guarantee semantic correctness. All dictionary entries still require review for accuracy, dialect, gender, and sense.

## Prepublication checklist

Review dictionary COPYING files and license compatibility; keep source attribution; check word senses; identify ambiguous homonyms; check gender and grammatical forms; validate CEFR study labels for a curriculum; retain Tatoeba attribution IDs; and adapt Privacy/Cookie/Terms/Contact footer text to your hosting setup and jurisdiction.
