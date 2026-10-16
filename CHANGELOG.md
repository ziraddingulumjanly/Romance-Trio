# v4 — Listening Lab and supplemental translated vocabulary

- Added a dedicated immersive Listening Lab page and homepage card. Four interactive audio/writing modes, 3 target languages, six study levels, optional keyboard sound/feedback and strict-accent mode. 90 authored four-language sentence sets.
- Added 522 authored English–Spanish supplementary pairs across eight underfilled topics, with missing French/Italian clearly displayed as `—`.
- Added idempotent `merge_editorial.py` and wired into FreeDict + Kaikki synchronization.
- Updated quality checks, tests, sources and setup documentation.

---

# v3 — partial-language vocabulary and Kaikki integration

- English topic catalogue expanded to **5,753** headword records, reaching all 32 topic minimums (with honest `—` placeholders).
- FreeDict TEI pipeline changed from 3-way *intersection* to **union**: one, two or three known translations are accepted, while starter translations are preserved.
- Kaikki imported automatically from a small Simple English Wiktionary `.gz`, or from a user-supplied full English Wiktextract JSONL(.gz). Handles real entry-level `translations`, plus per-sense translation lists, and groups by sense.
- Available pronunciation only; flashcards/quiz/speaking skip missing translations for selected language. Search, comparison and topic pages handle `—` gracefully.
- All 32 English word targets check as met; coverage report also shows true number of FR/IT/ES translations and 3-way matches, avoiding inflated claims.
- Added partial-translation and multi-sense regression tests, consistent unique word IDs, and updated licensing/source notes.
- No accounts or progress tracking; light/dark modes retained.

**Important:** this build includes **523 translated starter comparisons**. The remaining entries are English-only until actual dictionary imports are run on your computer. Targets refer to *English headword catalogue* coverage, not verified multilingual translation coverage.
