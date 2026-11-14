# ThinkLab MSA Prep — Version 3

A static, responsive English examination preparation site for the Berlin MSA, using the ThinkLab identity.

## Available practice

- **Reading Part 1:** Three levels (6, 10 and 10 matching questions).
- **Reading Part 2:** Three levels (4, 6 and 6 short-text multiple-choice questions).
- **Reading Part 3:** Three levels (6, 10 and 10 reading comprehension questions).
  - Level 1: Two original short texts, a model answer, a reading strategy and optional clues.
  - Level 2: An original educational adaptation about daylight saving time and health.
  - Level 3: The teacher-supplied adapted Guardian article about restricting social media for under-16s, without the original photograph.

After completing a level, students receive their marks, correct answers, textual evidence and explanations. Materials are exam-style practice, not official examination papers.

## Reading Part 3 source credits

- Level 1: Original ThinkLab practice texts, 2026.
- Level 2: Based on VOA Learning English, *How Daylight Saving Time Affects Health*, 6 March 2025. Original AP reporting by Lauran Neergaard; adapted for VOA by John Russell. https://learningenglish.voanews.com/a/how-daylight-savings-time-affects-health/8001173.html
- Level 3: Adapted from Nicola Slawson and Jane Clinton, *The Guardian*, 29 January 2026. https://www.theguardian.com/media/2026/jan/29/social-media-ban-under-16s-uk-australia-views

Both source credits show the requested date accessed: **14 November 2026**. The Guardian passage reflects the supplied January 2026 article, not a statement about current legislation.

## Student data

No logins or server-side storage. Results and unfinished answers are saved on the device in browser localStorage. The key `thinklab-msa-prep-progress-v1` is unchanged from Version 2, so existing progress normally remains available in the same browser at the same website address. Backup export/import is provided. Clearing browser data can erase saved work.

## Publish

GitHub Pages: Settings → Pages → Deploy from a branch → `main` → `/(root)`.

Homepage: `index.html`. Dependencies: `styles.css`, `data.js`, `reading2-data.js`, `reading3-data.js`, `app.js`, and `assets/`.

Site: https://jakamani.github.io/thinklab-msa-prep/

Only Reading Parts 1–3 are live; Writing and Listening are planned.
