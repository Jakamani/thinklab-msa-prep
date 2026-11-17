# ThinkLab MSA Prep — Reading and Writing Complete

ThinkLab MSA Prep is an English-practice website for Berlin MSA students. The site uses original and adapted practice materials guided by official MSA formats and marking schemes.

## Available modules

- **Reading Parts 1–3:** three levels in each part; automatic answer checks with explanations.
- **Writing Part 1 — Your Photo:** three levels with AI-generated photos and guided or independent short writing.
- **Writing Part 2 — Online Discussion:** three levels; at least 100 words, guided Level 1 and independent Levels 2–3.
- **Writing Part 3 — Mediation:** three levels.
  - **Level 1:** Lena's first job; one original German text; choose key details and an optional email opening.
  - **Level 2:** social projects; choose between two German articles adapted from Der Tagesspiegel.
  - **Level 3:** environmentally friendly businesses; choose between two more demanding German articles adapted from Der Tagesspiegel.

For Levels 2 and 3 in mediation, the German passages have no internal subheadings. The original articles are cited with links and an access date of **17 November 2026**. No newspaper photos are used.

For mediation, students write a personal English email conveying the main idea and at least four further relevant details. They should **not translate word for word**. The MSA content and language criteria are worth 5 points each. There is **no official minimum word count** for this task. The site offers formative feedback and a model answer; only a teacher can assign a writing score.

## Student privacy and progress

The site is entirely static and requires no accounts or backend. Progress is saved locally using browser `localStorage` under the unchanged key `thinklab-msa-prep-progress-v1`. Students can export and import their progress. Updating the website at the same domain ordinarily preserves their work in the same browser.

## Attribution

- German mediation practice texts for Levels 2 and 3 are educational adaptations of credited *Der Tagesspiegel* reporting; see the source links beneath each text.
- Writing Part 1 images were AI-generated with ChatGPT (OpenAI), 2026, for ThinkLab MSA Prep.

## Deployment

GitHub Pages: Settings → Pages → Deploy from a branch → `main` → `/(root)`.

Website: https://jakamani.github.io/thinklab-msa-prep/

The current static bundle contains `index.html`, `styles.css`, `app.js`, `mediation-data.js`, the three reading data files and reusable assets. **Listening Parts 1–4 are still in development.**
