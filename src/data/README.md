# Compiled learning catalogue (v3)

`vocabulary.json` includes **5,753 English topic records** covering all 32 topic targets. This does **not** mean 5,753 French/Italian/Spanish translations: the bundled offline build contains 523 starter records with all three translations; the remaining English entries explicitly show `—`.

When you run `python scripts/sync_freedict.py`, the program downloads real FreeDict dictionaries and a small Kaikki English Wiktionary extract, then fills available translations independently. Use `--kaikki PATH` to supply the much larger Kaikki English Wiktionary JSONL(.gz) instead. The script reruns from the originals, so the import is repeatable. Tatoeba sentence import remains optional.

Use `python scripts/coverage_report.py` to view both English-topic target completion **and actual per-language coverage**. All imported candidates are labeled draft; A1–C2 levels are estimates. See `README.md` and `DATA_SOURCES.md`.
