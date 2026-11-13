# ThinkLab MSA Prep — Version 2

A responsive, standalone English revision website for Berlin MSA practice using the ThinkLab visual identity.

## Available practice
- Reading Part 1: matching people to activities, with three levels (6, 10 and 10 questions).
- Reading Part 2: short text multiple-choice tasks, with three levels (4, 6 and 6 questions).
- Guided Level 1 clues, independent Level 2 exam-style work, and a more demanding Level 3.
- Feedback after submission: scores, correct answers, supporting evidence and explanations.
- Writing, Listening and Reading Part 3 are planned but not yet active.

All practice materials are original and are not copied from the official MSA examination.

## Technical details
Static HTML/CSS/JavaScript. No install, backend or student account. Answers, drafts and results are stored in the browser using localStorage. Students can export and import progress JSON files. Progress does not automatically sync between devices; clearing browser data can remove it.

## GitHub Pages
In this repository select **Settings > Pages > Build and deployment > Deploy from a branch**, select **main** and **/(root)**, then Save. GitHub will publish at https://jakamani.github.io/thinklab-msa-prep/ once Pages deployment completes.

The root homepage is `index.html`; linked JS, CSS and assets must remain in their relative locations.
