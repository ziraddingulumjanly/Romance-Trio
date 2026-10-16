# Romance Trio v4 — Listening Lab + actual translated topic supplements

Responsive Next.js 15/TypeScript website based on the original Romance Trio home design. Light and dark themes. **No accounts or saved progress.** English is the reference language; French, Italian and Spanish are displayed independently and missing translations remain `—`.

## What's new in v4

- **Listening Lab** has a separate homepage feature and its own `/listening-lab/` route. It provides **90 original sentence sets across A1–C2** (15 per level), equivalent to **270 language-specific listening prompts** across French, Italian and Spanish. Modes: Listen & Type, Listen & Translate (hear target language, type English), Fill the Gaps and Word Order. Includes browser text-to-speech, repeat/slow audio, answer feedback, hints, optional keyboard taps/confirmation tones, and optional strict accent checking. All session state stays in memory; nothing is sent to a scoring server.
- **522 authored English–Spanish supplementary vocabulary pairs** across Travel (133), Daily Life (127), Idioms (114), Phrases (61), Science (40), Colors (20), Numbers (12), and Family (15). Source file: `content/editorial_supplements.tsv`; merger: `scripts/merge_editorial.py`. Entries have *real Spanish equivalents*; French and Italian stay `—` where no entry has been imported. These are editorial study drafts, not machine-generated claims of native review.
- The FreeDict/Kaikki pipeline now merges those additional translated entries **automatically at the end**. The manual supplement is retained on every re-import, and all existing FreeDict/Kaikki and starter translations take precedence.
- Validation/tests protect the A1–C2 listening bank, bilingual supplements, no duplicates, homepage navigation and topic coverage relative to the previous successful dictionary import report.

## What is actually in the downloadable ZIP?

- **6,267 English entries**, of which **1,045 have at least one non-dash translation** in the *offline ZIP*. These include the previous **523 starter four-language comparisons** plus the translated Spanish supplementary collection. Entries without translations are still English-only placeholders, clearly marked `—`.
- **Full, working listening-exercise source, 90 authored sentences (four languages), and local tone synthesis**. Pronunciation requires a browser with the appropriate French, Italian, or Spanish text-to-speech voice available; voice quality differs by browser/device.
- The **large FreeDict/Kaikki source dictionaries are not embedded in the ZIP** because downloading those sources isn't possible in this build environment. Your previously downloaded v3 sources or exported JSON can be reused, or run the import command below.

### Fastest way if you already ran v3 successfully

Open the **new v4** `romance-trio` folder in VS Code. If you still have the v3 folder that reported **4,780 entries with translations**, copy the enriched v3 file `src/data/vocabulary.json` into the same location in v4 (replace the bundled copy), and then run:

```powershell
python scripts/merge_editorial.py
python scripts/coverage_report.py
python scripts/check_content.py
npm install
npm run dev
```

**Important:** Run `merge_editorial.py` AFTER copying the v3 vocabulary file, or the copy will overwrite the new entries. This avoids downloading the three TEI dictionaries again. The editorial merge preserves your existing translations and fills Spanish only where it was missing.

### Fresh start, no existing imported JSON

Extract the ZIP, open its `romance-trio` folder in VS Code, and run:

```powershell
python scripts/sync_freedict.py
python scripts/coverage_report.py
python scripts/check_content.py
npm install
npm run dev
```

Open **http://localhost:3000**. The importer downloads genuine FreeDict English–French/Italian/Spanish TEI dictionaries and the small Kaikki/Simple English extract, then merges the editorial supplements. Expect network downloads to take time. The resulting coverage should clear the eight previously unmet topics **if the original dictionary import numbers can be reproduced**; check the live coverage output to confirm rather than assuming those targets are met.

To reuse cached dictionaries from a prior version, copy your `content/source_dictionaries/` directory into the new v4 project and run:

```powershell
python scripts/sync_freedict.py --offline
```

This additionally expects a cached Kaikki extract; if unavailable, run `python scripts/sync_freedict.py --offline --no-kaikki` or let it download normally without `--offline`.

### Verifying the full website

```powershell
python -m unittest discover -s tests -v
python scripts/check_content.py
python scripts/coverage_report.py
npm run build
```

`npm run build` creates a static site under `out/` that can be deployed to Cloudflare Pages or equivalent. The English catalogue is bundled and the Listening Lab operates even if you skip importing external dictionaries; dictionary re-import is needed for broad topic translation coverage.

## Important accuracy notes

- The supplementary Spanish entries are educational editorial drafts and do not make French or Italian appear where they have not been sourced. For idioms, equivalents represent meaning, not word-for-word translations; some vary by dialect and situation.
- CEFR labels are **heuristic learning labels**, not exam-certified language classifications. Listening sentence levels are illustrative. The voice output relies on device speech synthesis rather than a paid AI/TTS engine.
- `src/data/vocabulary.json` is generated/merged content; rerunning `scripts/build_vocabulary.py` or `scripts/enrich_vocab.py` alone overwrites your imported data with the starter set. For complete rebuilds run `scripts/sync_freedict.py`.
- Data provenance and third-party license obligations are explained in `DATA_SOURCES.md`. The legal policies in the footer are templates and require review before a public launch.

---

## Earlier v3 documentation (import formats and detailed instructions)

# Romance Trio v3 — partial translations + Kaikki/Wiktionary integration

English reference with French, Italian and Spanish side by side. Your original light/dark homepage design remains intact; **no login, user profiles, progress tracking, or payments**.

## What changed

- **All 32 English topic banks meet their requested entry minimums**, including School (200+), Politics (200+), Movies (150+), Food (250+), Travel (250+), Daily Life (300+), Science (250+), Idioms (150+), and at least 100 for each other topic.
- A missing French, Italian or Spanish translation is displayed as **—**. **At least one translation is sufficient** to keep a dictionary row.
- FreeDict now matches English headwords from the **union** of the three dictionaries rather than the three-way intersection: a word available only in English–Italian and English–Spanish is kept with `fr: "—"`.
- **Kaikki/Wiktionary is part of the normal FreeDict import flow.** It automatically downloads the *small* Simple English Wiktionary extract (around 4.5 MB compressed, if reachable). For much more coverage, supply the significantly larger English Wiktionary dump with `--kaikki PATH`.
- Kaikki's real Wiktextract `translations` structures are read from both the **top-level entry** and, if available, individual senses. Translation records are grouped by their `sense` label; unrelated senses are never combined to make a fabricated three-way match. Existing starter translations are not overwritten.
- A1–C2 filters continue to work. Practice flashcards, quizzes and speaking activities exclude rows lacking a translation in the selected language. No audio button appears next to —.
- The coverage report explicitly distinguishes **English entries**, French availability, Italian availability, Spanish availability, entries with *any* translation, and entries with *all three*. Your English topic targets being met does **not** prove multilingual translation coverage is complete.

## What is actually included in this ZIP?

**5,753 real English vocabulary headwords/expressions** across 32 categories, including the **523 previously bundled starter comparisons**. The other English headwords are tagged `seed-pending` and initially have `—` for missing translations. The initial ZIP contains **523 fully translated entries**. It does **not** contain the large FreeDict/Kaikki corpora; no dictionary downloads were possible in the environment that built this ZIP.

The import scripts are included and tested locally on miniature fixtures. **To populate actual additional translations, run the download/import command on your own Windows PC with internet access.** Your previous 2,703-entry import result is stored on your PC, not in this ZIP; this refreshed pipeline reimports from source dictionaries and may find substantially more partial-language matches.

These words are categorized using an authored English candidate list (not generated as automatic dictionary translations). The examples and grammar information remain uneven: not every word has a sentence or gender tag. Imported translations and CEFR labels are **draft/estimated** until reviewed.

## Windows + VS Code quick start

Requirements: Node.js 20+ (22 recommended), Python 3.10+, an internet connection for `npm install` and the dictionary imports.

Extract the zip and open the **romance-trio** folder in VS Code, then run:

```powershell
# Recommended: download real FreeDict AND the small Kaikki extract,
# fill missing translations, and rebuild local vocabulary.json
python scripts/sync_freedict.py
python scripts/coverage_report.py
python scripts/check_content.py
npm install
npm run dev
```

Open http://localhost:3000.

The English catalogue is already bundled, so you can preview the website even before the imports:

```powershell
npm install
npm run dev
```

### More Kaikki/Wiktionary coverage (optional, large download)

The default import downloads a small Kaikki **Simple English Wiktionary** extract. This subset is *not* the main English Wiktionary; many terms will still be missing. The full extraction can be multiple gigabytes. Download it **yourself** from https://kaikki.org/dictionary/rawdata.html (compressed JSONL), and then run:

```powershell
python scripts/sync_freedict.py --kaikki "C:\Users\YOU\Downloads\raw-wiktextract-data.jsonl.gz"
python scripts/coverage_report.py
```

To merge a larger Kaikki extract into the **already imported** local JSON without repeating FreeDict downloads:

```powershell
python scripts/merge_kaikki.py "C:\Users\YOU\Downloads\raw-wiktextract-data.jsonl.gz"
python scripts/coverage_report.py
```

The extractor streams `.jsonl`, `.jsonl.gz`, and `.jsonl.bz2` files without loading the whole corpus into RAM. Each translation comes from a single sense group if available, but sense matching still needs human review; the UI marks these entries as **Draft**. We do not invent missing language translations.

### Reuse locally downloaded FreeDict files

The scripts keep TEI downloads in `content/source_dictionaries/` (not committed to the ZIP). To repeat an import with cached sources:

```powershell
python scripts/sync_freedict.py --offline
```

If you have separately downloaded `.tei` dictionaries:

```powershell
python scripts/sync_freedict.py --local-dir "C:\path\to\dictionaries"
```

Files must be named `eng-fra.tei`, `eng-ita.tei`, and `eng-spa.tei`. Use `--no-kaikki` to skip the Kaikki automatic download. The script always regenerates the starter data before merging real dictionaries to avoid duplicate growth when run repeatedly.

### Adding Tatoeba translated sentence examples

Optional: download appropriately licensed aligned English→French, English→Italian, English→Spanish pairs from https://tatoeba.org/downloads. Prepare TSV files (`English sentence<TAB>Translation<TAB>Optional ID`) and run:

```powershell
python scripts/merge_tatoeba.py --fr content/example_pairs/eng-fr.tsv --it content/example_pairs/eng-it.tsv --es content/example_pairs/eng-es.tsv
```

These are candidate examples; they are not presented as manually checked sense matches. Preserve sentence IDs and comply with each item’s licensing.

## Useful commands

```powershell
python scripts/coverage_report.py       # Honest per-topic + per-language coverage
python scripts/check_content.py         # All 32 English thresholds + integrity
python -m unittest discover -s tests -v
npm run build                          # Production static export to out/
```

Host the static `out/` folder on Cloudflare Pages or another static host. This Next.js 15 + TypeScript + React 19 project uses handcrafted CSS, no runtime backend. Restart the dev server after editing the vocabulary JSON if it doesn't auto-refresh.

`npm run data:starter` restores only the original 523 translated comparisons; run `python scripts/seed_catalog.py` after that to restore the full English catalogue, or rerun the importer to restore translations.

## Accuracy and licensing

A blank/dash means **not available**, not zero grammatical gender or an impossible translation. Dictionaries may disagree about a polysemous English headword. FreeDict initial suggestions and Kaikki sense-grouped translations are marked **draft**; review before public redistribution. CEFR study levels are **heuristic A1–C2 estimates** based on English/headword features, *not certified language exams*. Read `DATA_SOURCES.md` for FreeDict per-file license obligations, Wiktionary CC BY-SA/GFDL, Tatoeba rights and source attribution. The legal-footer content is a template and must be reviewed before publishing.
