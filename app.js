
/* ThinkLab MSA Prep — static, offline-friendly student app.
   All questions are original practice content. Progress remains on the user's device. */
(() => {
  'use strict';
  const APP = document.getElementById('app');
  const DATA = window.THINKLAB_DATA;
  const KEY = 'thinklab-msa-prep-progress-v1';
  const letters = 'ABCDEFG'.split('');
  const levels = DATA.levels; // Reading Part 1; keep original progress keys unchanged
  const part2Levels = window.THINKLAB_READING2?.levels || [];
  const part3Levels = window.THINKLAB_READING3?.levels || [];
  const allLevels = [...levels, ...part2Levels, ...part3Levels];
  let localSavingAvailable = true;
  let store = loadStore();

  function loadStore() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (value && value.version === 1 && value.attempts && value.drafts) return value;
    } catch (_) { localSavingAvailable = false; }
    return { version: 1, attempts: {}, drafts: {} };
  }
  function saveStore() {
    try { localStorage.setItem(KEY, JSON.stringify(store)); localSavingAvailable = true; }
    catch (_) { localSavingAvailable = false; }
  }
  function e(str) {
    return String(str ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  }
  function getLevel(id) { return levels.find(x => x.id === id); }
  function getAttempts(levelId) { return Array.isArray(store.attempts[levelId]) ? store.attempts[levelId] : []; }
  function latestAttempt(levelId) { return getAttempts(levelId).at(-1); }
  function bestScore(levelId) { return getAttempts(levelId).length ? Math.max(...getAttempts(levelId).map(a => a.score)) : 0; }
  function completedCount() { return levels.filter(l => getAttempts(l.id).length > 0).length; }
  function completedPart2Count() { return part2Levels.filter(l => getAttempts(l.id).length > 0).length; }
  function completedPart3Count() { return part3Levels.filter(l => getAttempts(l.id).length > 0).length; }
  function completedTotal() { return allLevels.filter(l => getAttempts(l.id).length > 0).length; }
  function scoreLabel(level) { return `${bestScore(level.id)}/${level.questions.length}`; }
  function currentHash() { return (location.hash || '#/home').replace(/^#/, '').replace(/\/+$/, '') || '/home'; }
  function normPath() { return currentHash().split('/').filter(Boolean); }
  function dateText(iso) { try {return new Date(iso).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'});} catch(_) {return 'Previous attempt';} }
  function routeTo(href) { if(location.hash === href) render(); else location.hash = href; }
  function stepTitle(i) { return ['Learn with clues','Practise like the exam','Take the challenge'][i]; }
  function titleBlock(label, title, desc='') {return `<div class="section-head"><div class="eyebrow">${e(label)}</div><h2>${e(title)}</h2>${desc?`<p>${e(desc)}</p>`:''}</div>`;}
  function crumbs(items) {
    return `<div class="breadcrumbs" aria-label="Breadcrumb">${items.map((v,i)=> i===items.length-1?`<span aria-current="page">${e(v[0])}</span>`:`<a href="${e(v[1])}">${e(v[0])}</a><span aria-hidden="true">›</span>`).join('')}</div>`;
  }
  function pageHero(bread, eyebrow, heading, desc) {
    return `<section class="page-hero"><div class="container">${crumbs(bread)}<div class="eyebrow">${e(eyebrow)}</div><h1>${e(heading)}</h1><p>${e(desc)}</p></div></section>`;
  }
  function shell(page, active) {
    const nav=[['Home','#/home','home'],['Reading','#/reading','reading'],['Writing','#/writing','writing'],['Listening','#/listening','listening'],['My progress','#/progress','progress']];
    const progress=completedTotal();
    APP.innerHTML = `<header class="site-header"><div class="container header-inner">
      <a class="brand" href="#/home" aria-label="ThinkLab MSA Prep home"><img src="assets/thinklab-bulb.png" alt=""><div><div class="brand-name">Think<span>Lab</span></div><div class="brand-tag">LEARN · CREATE · EXPLORE · GROW</div></div></a>
      <nav class="nav-links" aria-label="Main navigation">${nav.map(n=>`<a class="nav-link ${active===n[2]?'active':''}" ${active===n[2]?'aria-current="page"':''} href="${n[1]}">${n[0]}</a>`).join('')}</nav>
      <a href="#/progress" class="header-progress" aria-label="Review your saved progress"><span class="round-indicator">✓</span> ${progress} / ${allLevels.length} Reading levels</a>
    </div></header><main id="main">${page}</main><footer class="site-footer"><div class="container footer-inner"><div><div class="brand-name">Think<span>Lab</span> · MSA Prep</div><div class="brand-tag">LEARN · CREATE · EXPLORE · GROW</div></div><p>Original practice tasks inspired by the Berlin MSA English format, not official exam questions. ${localSavingAvailable?'Progress is stored on this device only.':'Progress saving may be unavailable in this browser.'}</p></div></footer>`;
    document.title = 'ThinkLab MSA Prep — ' + ({home:'Home',reading:'Reading',writing:'Writing',listening:'Listening',progress:'My progress'}[active] || 'Practice');
  }
  function home() {
    const cards=[
      ['reading','Reading','3 parts','Read to find the meaning, identify evidence and match the right details.',['Match people to activities','Understand short texts','Read a longer article'],'✓','live'],
      ['writing','Writing','3 parts','Communicate clearly, organise ideas and respond for the right reader.',['Respond to a photo · All 3 levels ready','Discussion replies · All 3 levels ready','Mediation · All 3 levels ready'],'✎','live'],
      ['listening','Listening','4 parts','Listen for meaning, follow speakers and recognise the important clues.',['Match messages to pictures','Match podcast intros to titles','Complete notes and tables','Understand a radio discussion'],'◉','planned']
    ];
    const html=`<section class="hero"><div class="container hero-grid"><div>
      <div class="eyebrow"><span class="accent-dot"></span>Grade 10 · English · MSA Prep</div><h1>Practise smarter.<span>Feel ready.</span></h1>
      <p class="hero-sub">A clear path from guided practice to exam-style challenges. Build confidence in Reading, Writing and Listening—one skill at a time.</p>
      <div class="hero-buttons"><a class="button primary" href="#/reading/part-1">Start Reading Part 1 <span aria-hidden="true">→</span></a><a class="button secondary" href="#/reading/part-2">Try Reading Part 2 →</a><a class="button subtle-btn" href="#/reading/part-3">Read Part 3 →</a><a class="button subtle-btn" href="#/how">How it works</a></div>
      <div class="benefit"><strong>✓</strong> No logins, no pressure. Progress and feedback saved on this device.</div>
    </div><div class="journey-wrap"><div class="journey-card"><div class="eyebrow">Your learning journey</div><h3>Learn it. Try it. <em>Own it.</em></h3>
       ${['Learn with clues','Practise like the exam','Take the challenge'].map((s,i)=>`<div class="journey-step"><span class="num">0${i+1}</span><div><strong>${s}</strong><p>${['Short examples + helpful guidance','Fresh tasks with the real exam structure','More demanding practice'][i]}</p></div><span style="margin-left:auto;color:#bad2dd">›</span></div>`).join('')}
       <div class="bottom-note">✓ Reading tasks give scores and evidence. Writing tasks give word-count checks and self-review.</div>
    </div></div></div></section>
    <div class="metrics"><div class="container metric-grid"><div class="metric"><strong>3</strong> core skills</div><div class="metric"><strong>10</strong> planned exam parts</div><div class="metric"><strong>9</strong> Reading levels · 9 Writing levels</div></div></div>
    <section class="section"><div class="container">${titleBlock('Your practice hub','Choose where to begin','Explore Reading Parts 1–3 and Writing Parts 1–3, with three levels in each.')}
      <div class="skill-grid">${cards.map(([route,title,parts,desc,items,ico,st])=>`<a class="skill-card ${route==='reading'?'':route==='writing'?'orange':'navy'}" href="#/${route}"><div class="skill-icon">${ico}</div><div style="position:absolute;right:22px;top:21px"><span class="pill ${st==='live'?'ready':'planned'}">${st==='live'?'Start now':'In development'}</span></div><h3>${title}</h3><p>${desc}</p><ul>${items.map(x=>`<li>${x}</li>`).join('')}</ul><div class="skill-action">${route==='reading'?'Explore Reading':route==='writing'?'Start Writing':'View the plan'} <span aria-hidden="true">→</span></div></a>`).join('')}</div>
    </div></section><section class="section alt"><div class="container">${titleBlock('One simple route','Three levels. Real progress.','Every part follows the same learning path so you always know what comes next.')}
    <div class="path-grid">${levels.map((l,i)=>`<a class="level-card" href="#/reading/part-1/${l.id}"><div class="topline"><span class="level-number">0${i+1}</span><div><div class="tiny muted" style="font-weight:800">LEVEL ${i+1}</div><h3 style="margin:0">${stepTitle(i)}</h3></div></div><p>${e(l.description)}</p><div class="tiny"><span class="pill ${getAttempts(l.id).length?'ready':''}">${getAttempts(l.id).length?'Best '+scoreLabel(l):'Not completed'}</span></div></a>`).join('')}</div>
    <div class="feedback-ribbon"><strong>Writing Part 1 · Three levels ready:</strong> Choose football, a park proposal or a mountain hike. Write 30–50 words and review your response against MSA criteria. <a href="#/writing/part-1" style="font-weight:850;color:#0B2D56;text-decoration:underline">Try the photo task →</a></div>
    </div></section>`;
    shell(html,'home');
  }
  function howPage() {
    shell(pageHero([['Home','#/home'],['How it works','#/how']],'Your learning path','Learn. Practise. Improve.','Here is how ThinkLab guides you through MSA-style tasks.')+`<section class="section"><div class="container"><div class="path-grid">${levels.map((l,i)=>`<div class="panel"><span class="level-number">0${i+1}</span><h3 style="margin-top:15px">${stepTitle(i)}</h3><p class="muted">${e(l.description)}</p></div>`).join('')}</div><div class="panel" style="margin-top:20px"><h3>How marking works</h3><p>For Reading, choose matching activities or correct statements and receive one point per correct answer, with evidence-based feedback. For Writing, write clear responses to photo, discussion and mediation tasks. Use the MSA content and language criteria to review your work. Open-ended writing does not receive an automatic exam mark.</p><p>No account is required. Your attempts stay in this browser; use <strong>My progress</strong> to download a backup if you want to keep a copy.</p><a class="button primary" href="#/reading/part-1">Start Reading Part 1 →</a></div></div></section>`,'home');
  }
  const skills = {
    reading: [['Reading Part 1','Match people to activities','Ready'],['Reading Part 2','Understand short texts','Ready'],['Reading Part 3','Longer reading comprehension','Ready']],
    writing: [['Writing Part 1','Photo response · Three levels','Ready'],['Writing Part 2','Discussion reply · Three levels','Ready'],['Writing Part 3','Mediation · Guided Level 1 available','Ready']],
    listening: [['Listening Part 1','Voicemail and picture matching','Planned'],['Listening Part 2','Podcast intro matching','Planned'],['Listening Part 3','Information completion','Planned'],['Listening Part 4','Radio programme comprehension','Planned']]
  };
  function subjectPage(skill) {
    if(skill==='writing')return writingSubjectPage();
    const title=skill[0].toUpperCase()+skill.slice(1);
    const helper={reading:'Choose any of the three Reading parts: matching, short texts or longer articles.',writing:'The Writing pathway will include task planning, independent writing and feedback against content and language criteria.',listening:'The Listening pathway will include original recordings, two play-throughs and evidence-based explanations.'}[skill];
    const ready=skill==='reading';
    const done=completedTotal();
    shell(pageHero([['Home','#/home'],[title,'#/'+skill]],'Your practice hub',title,helper)+`<section class="section"><div class="container work-layout"><div><div class="module-parts">${skills[skill].map((part,i)=>`<div class="module-part ${part[2]==='Ready'?'active':''}"><div class="module-part-left"><span class="mini-num">0${i+1}</span><div><h3>${e(part[0])}</h3><p>${e(part[1])}</p>${ready?`<div class="tiny muted" style="margin-top:7px">${[completedCount(),completedPart2Count(),completedPart3Count()][i]} of 3 levels completed</div>`:''}</div></div>${part[2]==='Ready'?`<a class="button primary small" href="#/reading/part-${i+1}">Open →</a>`:'<span class="pill planned">In development</span>'}</div>`).join('')}</div></div><aside class="path-summary"><div class="label">Live content</div><strong>${ready?'Reading Parts 1–3 · 9 levels':'Modules being prepared'}</strong><p style="font-size:.85rem;margin-top:10px">${ready?'Start with clues, then complete an exam-style set and a harder challenge in each part.':'This section is part of the site plan; it is not yet an interactive practice module.'}</p>${ready?`<div class="small-progress"><span style="width:${Math.round(done/9*100)}%"></span></div><p class="tiny" style="margin-top:9px">${done} of 9 levels completed</p>`:''}</aside></div></section>` ,skill);
  }
  function partPage() {
    shell(pageHero([['Home','#/home'],['Reading','#/reading'],['Part 1','#/reading/part-1']],'Reading · Part 1','Match people to activities','Read five people’s wishes and choose matching activities. Practise how to find the meaning behind the words.')+
      `<section class="section"><div class="container work-layout"><div><div class="level-list">${levels.map((l,i)=>{
        const last=latestAttempt(l.id);
        return `<div class="level-choice"><div class="level-number">0${i+1}</div><div class="level-desc"><div class="eyebrow" style="font-size:.65rem">LEVEL ${i+1} · ${e(l.tag)}</div><h3>${e(l.title)}</h3><p>${e(l.description)}</p><div class="meta"><span>${l.questions.length} matches · ${l.questions.length} marks</span><span>·</span><span>About ${l.estimatedMinutes} minutes</span>${last?`<span class="pill ready">Best: ${scoreLabel(l)}</span>`:''}</div><div class="actions" style="margin-top:16px"><a class="button ${i===0?'primary':'secondary'} small" href="#/reading/part-1/${l.id}">${last?'Practise again':'Start level'} →</a>${last?`<a class="button subtle-btn small" href="#/reading/part-1/${l.id}/feedback">Review feedback</a>`:''}</div></div></div>`;}).join('')}</div><div class="privacy-note"><strong>How to progress:</strong> Try Level 1 first to practise the method. Then move to Levels 2 and 3. You can return to any level whenever you like.</div></div>
      <aside><div class="path-summary"><div class="label">Your journey</div><strong>${completedCount()} / 3 levels completed</strong><p style="font-size:.84rem;margin-top:9px">The full pathway is available without creating an account.</p><div class="small-progress"><span style="width:${Math.round(completedCount()/3*100)}%"></span></div></div><div class="panel" style="margin-top:17px"><h3>Find the proof</h3><p class="muted" style="font-size:.9rem">The correct match must satisfy the <strong>whole wish</strong>, not merely contain one familiar word.</p><ol style="font-size:.86rem;padding-left:21px"><li>Identify the need.</li><li>Scan the activity.</li><li>Check your evidence.</li></ol></div></aside></div></section>`,'reading');
  }
  function modelExample() {
    return `<section class="model-example"><div class="eyebrow">Try one example first · Not scored</div><h3 style="margin-top:5px">Nora wants to make something herself.</h3><p style="font-size:.86rem;margin:0">She likes art, but looking at other people’s art is not enough. Which activity is better?</p><div class="model-choices"><button class="model-choice" type="button" data-model="X"><b>X</b> Art exhibition — look at paintings</button><button class="model-choice" type="button" data-model="Y"><b>Y</b> Art workshop — create your own picture</button></div><div id="model-result" aria-live="polite" class="tiny muted">Choose X or Y to see why one option fits better.</div></section>`;
  }
  function questionHtml(level) {
    const draft=store.drafts[level.id] || {};
    const groups=[];
    for(const q of level.questions){
      let last=groups.at(-1);
      if(!last || last.person!==q.person) groups.push(last={person:q.person,qs:[]});
      last.qs.push(q);
    }
    return groups.map(g=>`<section class="person-group" aria-label="${e(g.person)}'s wishes"><div class="person-title"><span class="person-avatar">${e(g.person[0])}</span><h3>${e(g.person)}</h3></div>${g.qs.map(q=>`<div class="question-row"><span class="qnum">${q.id}</span><div><div class="question-text">${e(q.statement)}</div>${level.id==='level-1'?`<button type="button" class="hint-button" data-hint="${q.id}" aria-expanded="false">Show a clue</button><div id="hint-${q.id}" class="hint-content" hidden>${e(level.hints[String(q.id)])}</div>`:''}</div><label><span class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)">Activity for question ${q.id}</span><select class="answer-select" aria-label="Activity letter for question ${q.id}" data-answer="${q.id}"><option value="">—</option>${level.activities.map(a=>`<option value="${a.letter}" ${draft[String(q.id)]===a.letter?'selected':''}>${a.letter}</option>`).join('')}</select></label></div>`).join('')}</section>`).join('');
  }
  function activityHtml(level) {
    const mobile=window.matchMedia && window.matchMedia('(max-width: 820px)').matches;
    return `<details class="activity-bank" id="activity-bank" ${mobile?'':'open'}><summary>Activity descriptions A–${level.activities.at(-1).letter} <span class="tiny muted" style="font-weight:500">(tap to open or close)</span></summary>${level.activities.map(a=>`<article class="activity"><div class="activity-header"><span class="letter">${e(a.letter)}</span><span class="activity-title">${e(a.title)}</span></div><p>${e(a.body)}</p></article>`).join('')}</details>`;
  }
  function levelPage(level) {
    const ans=store.drafts[level.id] || {};
    const answered=level.questions.filter(q=>ans[String(q.id)]).length;
    const attempt=latestAttempt(level.id);
    const number=levels.indexOf(level)+1;
    shell(pageHero([['Home','#/home'],['Reading','#/reading'],['Part 1','#/reading/part-1'],[`Level ${number}`,'#/reading/part-1/'+level.id]],`Reading Part 1 · Level ${number}`,level.title,level.description)+
      `<section class="section" style="padding-top:32px"><div class="container"><div class="task-topbar"><div><div class="eyebrow">${e(level.tag)} · ${level.questions.length} marks</div><h2>People and activities</h2></div><div style="display:flex;gap:9px;flex-wrap:wrap">${attempt?`<a class="button secondary small" href="#/reading/part-1/${level.id}/feedback">Previous feedback (${attempt.score}/${level.questions.length})</a>`:''}<a class="button secondary small" href="#/reading/part-1">All levels</a></div></div>
      ${level.id==='level-1'?`<div class="guided-intro"><div class="eyebrow">Your 3-step matching strategy</div><div class="steps"><div class="step"><b>1 · FIND THE NEED</b> What does the person really want to do?</div><div class="step"><b>2 · FIND THE PROOF</b> Which activity says the same thing in different words?</div><div class="step"><b>3 · CHECK THE MATCH</b> Does it meet the whole wish, including conditions?</div></div></div>${modelExample()}`:''}
      <div class="task-grid"><div class="questions-panel"><div class="task-instructions"><strong>Instructions</strong><br>Read each person’s two wishes. Use the activity descriptions to choose the <strong>one best letter</strong> for each wish. Some letters can be used more than once. ${level.id==='level-1'?'You may open a clue whenever you need it.':'Work independently without hints, as in the exam.'}</div>
      <form id="task-form" data-level="${level.id}" novalidate>${questionHtml(level)}<div class="task-actions"><p id="task-count" aria-live="polite"><strong>${answered} of ${level.questions.length}</strong> answered</p><button type="submit" class="button primary" id="submit-task" ${answered===0?'disabled':''}>Check my answers →</button></div></form></div>${activityHtml(level)}</div></div></section>`,'reading');
    bindTask(level);
  }
  function bindTask(level) {
    APP.querySelectorAll('[data-answer]').forEach(sel => {
      sel.addEventListener('change',()=> {
        const q=sel.dataset.answer;
        store.drafts[level.id] ||= {};
        if(sel.value) store.drafts[level.id][q]=sel.value;
        else delete store.drafts[level.id][q];
        saveStore();
        const count=level.questions.filter(x=>Boolean(store.drafts[level.id][String(x.id)])).length;
        const countEl=document.getElementById('task-count');
        if(countEl) countEl.innerHTML=`<strong>${count} of ${level.questions.length}</strong> answered`;
        document.getElementById('submit-task').disabled=count===0;
      });
    });
    APP.querySelectorAll('[data-hint]').forEach(btn => btn.addEventListener('click',()=> {
      const el=document.getElementById('hint-'+btn.dataset.hint);
      const expanded=btn.getAttribute('aria-expanded')==='true';
      btn.setAttribute('aria-expanded',String(!expanded));
      el.hidden=expanded;
      btn.textContent=expanded?'Show a clue':'Hide clue';
    }));
    APP.querySelectorAll('[data-model]').forEach(btn=>btn.addEventListener('click',()=> {
      APP.querySelectorAll('[data-model]').forEach(x=>x.classList.toggle('selected',x===btn));
      document.getElementById('model-result').className='model-feedback';
      document.getElementById('model-result').textContent=btn.dataset.model==='Y'?'Correct: Y is the workshop. The key is “make something herself”; both activities involve art, but only Y gives Nora the chance to create.':'X is tempting because it is about art. But Nora wants to MAKE something, not only LOOK at paintings. Try Y instead.';
    }));
    const form=document.getElementById('task-form');
    form.addEventListener('submit',(ev)=>{
      ev.preventDefault();
      const answers={...store.drafts[level.id]};
      const answered=level.questions.filter(q=>answers[String(q.id)]).length;
      if(answered<level.questions.length){
        if(!window.confirm(`You answered ${answered} of ${level.questions.length} questions. Unanswered questions score zero. Submit now?`)) return;
      }
      const score=level.questions.reduce((sum,q)=>sum+(answers[String(q.id)]===level.answers[String(q.id)]?1:0),0);
      store.attempts[level.id] ||= [];
      store.attempts[level.id].push({score,answers,at:new Date().toISOString()});
      store.attempts[level.id]=store.attempts[level.id].slice(-15);
      delete store.drafts[level.id];
      saveStore();
      routeTo(`#/reading/part-1/${level.id}/feedback`);
    });
  }
  function feedbackPage(level) {
    const attempt=latestAttempt(level.id);
    if(!attempt){routeTo(`#/reading/part-1/${level.id}`);return;}
    const correct=attempt.score,total=level.questions.length;
    const index=levels.indexOf(level);
    let feedback=correct===total?'All matches correct. Review the evidence to understand what made each one work.':correct>=Math.ceil(total*.7)?'Good progress. Look closely at the questions you missed: small conditions often change the best match.':'Use the explanations below to spot the differences between similar activities, then try the level again.';
    const next=levels[index+1];
    shell(pageHero([['Home','#/home'],['Reading','#/reading'],['Part 1','#/reading/part-1'],[`Level ${index+1}`,'#/reading/part-1/'+level.id],['Feedback','#/reading/part-1/'+level.id+'/feedback']],'Your feedback',`Level ${index+1} · Your results`,'Each correct match is worth one point. Compare your answer with the evidence and learn from the differences.')+
      `<section class="section" style="padding-top:32px"><div class="container work-layout"><div class="panel"><div class="feedback-header"><div><div class="eyebrow">Latest attempt · ${e(dateText(attempt.at))}</div><h2 style="margin-top:8px">${e(level.title)}</h2><p class="muted" style="margin:0;font-size:.89rem">${e(feedback)}</p></div><div><div class="score-big">${correct}<small> / ${total}</small></div><div class="tiny muted">${Math.round(correct/total*100)}% correct</div></div></div><div class="small-progress"><span style="width:${Math.round(correct/total*100)}%"></span></div>
      <h3 style="margin:26px 0 5px">Answer-by-answer explanations</h3><div class="tiny muted" style="margin-bottom:12px">One point for each correct answer. Incorrect or blank answers receive zero points.</div>
      ${level.questions.map(q=>{
        const id=String(q.id),chosen=attempt.answers?.[id],right=level.answers[id],ok=chosen===right;
        const activity=level.activities.find(a=>a.letter===right);
        return `<article class="feedback-item"><div class="mini-meta"><span class="qnum" style="min-width:26px;padding:5px">${q.id}</span><strong>${e(q.person)}</strong><span class="${ok?'answer-correct':'answer-incorrect'}">${ok?'✓ Correct':'✕ Not quite'}</span></div><div class="q-text">${e(q.statement)}</div><div style="font-size:.87rem;margin-top:9px">Your choice: <strong>${e(chosen||'—')}</strong> &nbsp; | &nbsp; Correct choice: <strong>${e(right)} · ${e(activity.title)}</strong></div><p class="evidence"><strong>Why:</strong> ${e(level.explanations[id])}</p></article>`;
      }).join('')}
      <div class="feedback-actions"><button class="button secondary" data-retry="${level.id}">Try this level again</button>${next?`<a class="button primary" href="#/reading/part-1/${next.id}">Continue to Level ${index+2} →</a>`:`<a class="button primary" href="#/progress">View my progress →</a>`}<a class="button subtle-btn" href="#/reading/part-1">Back to the levels</a></div></div>
      <aside><div class="path-summary"><div class="label">Your achievement</div><strong>${correct} / ${total} correct</strong><p style="font-size:.85rem;margin:12px 0">Best score for this level: ${scoreLabel(level)}. Number of attempts: ${getAttempts(level.id).length}.</p><div class="small-progress"><span style="width:${Math.round(bestScore(level.id)/total*100)}%"></span></div></div><div class="panel" style="margin-top:17px"><h3>Review strategy</h3><p class="muted" style="font-size:.89rem">For every incorrect item, underline the condition that rules out the wrong choice. Then find a phrase in the correct activity that proves the match.</p><div class="review-tip" style="margin-bottom:0">Remember: a familiar topic word is not enough. Match the person’s full need.</div></div></aside></div></section>`,'reading');
    APP.querySelectorAll('[data-retry]').forEach(btn=>btn.addEventListener('click',()=>retryLevel(btn.dataset.retry)));
  }
  function retryLevel(id) {
    delete store.drafts[id];
    saveStore();
    routeTo('#/reading/part-1/'+id);
  }
  // Reading Part 2: original short texts with one correct statement A–D.
  let r2CurrentIndex = 0;
  function part2Page() {
    shell(pageHero([['Home','#/home'],['Reading','#/reading'],['Part 2','#/reading/part-2']],'Reading · Part 2','Understand short texts','Read everyday messages, posters, notices and posts. Decide which ONE statement matches each text.')+
      `<section class="section"><div class="container work-layout"><div><div class="level-list">${part2Levels.map((l,i)=>{
        const last=latestAttempt(l.id);
        return `<div class="level-choice"><div class="level-number">0${i+1}</div><div class="level-desc"><div class="eyebrow" style="font-size:.65rem">LEVEL ${i+1} · ${e(l.tag)}</div><h3>${e(l.title)}</h3><p>${e(l.description)}</p><div class="meta"><span>${l.questions.length} texts · ${l.questions.length} marks</span><span>·</span><span>About ${l.estimatedMinutes} minutes</span>${last?`<span class="pill ready">Best: ${scoreLabel(l)}</span>`:''}</div><div class="actions" style="margin-top:16px"><a class="button ${i===0?'primary':'secondary'} small" href="#/reading/part-2/${l.id}">${last?'Practise again':'Start level'} →</a>${last?`<a class="button subtle-btn small" href="#/reading/part-2/${l.id}/feedback">Review feedback</a>`:''}</div></div></div>`;
      }).join('')}</div><div class="privacy-note"><strong>How to use this part:</strong> Each text has four statements, A–D. Only one agrees with the text. In Levels 2 and 3, the questions follow the MSA format, but all materials are original.</div></div><aside><div class="path-summary"><div class="label">Your Part 2 journey</div><strong>${completedPart2Count()} / 3 levels completed</strong><p style="font-size:.84rem;margin-top:9px">Your answers and results are saved in this browser.</p><div class="small-progress"><span style="width:${Math.round(completedPart2Count()/3*100)}%"></span></div></div><div class="panel" style="margin-top:17px"><h3>Think beyond key words</h3><p class="muted" style="font-size:.89rem">One answer must be fully supported. The other three might reuse words from the text but change what happened, who did it, or when it happens.</p><ol style="font-size:.84rem;padding-left:20px"><li>Read the question first.</li><li>Find the evidence in the text.</li><li>Check every part of the statement.</li></ol></div></aside></div></section>`,'reading');
  }
  function r2WorkedExample() {
    return `<div class="model-example r2-example"><div class="eyebrow">Guided example · Not marked</div><h3>What does the notice tell students?</h3><div class="r2-mini-source"><strong>SCHOOL CAFÉ</strong><p>On Friday the café will open at 10:00, one hour later than usual. Lunch service is unchanged.</p></div><div class="model-choices"><button type="button" class="model-choice" data-r2-model="A"><b>A</b> Lunch is one hour later on Friday.</button><button type="button" class="model-choice" data-r2-model="B"><b>B</b> The café opens later than normal on Friday.</button></div><div class="tiny muted" id="r2-example-feedback" aria-live="polite">Choose the best statement to see why it is correct.</div></div>`;
  }
  function r2LevelPage(level) {
    r2CurrentIndex=0;
    const idx=part2Levels.indexOf(level);
    const attempt=latestAttempt(level.id);
    shell(pageHero([['Home','#/home'],['Reading','#/reading'],['Part 2','#/reading/part-2'],[`Level ${idx+1}`,'#/reading/part-2/'+level.id]],`Reading Part 2 · Level ${idx+1}`,level.title,level.description)+
      `<section class="section" style="padding-top:30px"><div class="container"><div class="task-topbar"><div><div class="eyebrow">${e(level.tag)} · ${level.questions.length} marks</div><h2>Short texts · One correct statement</h2></div><div class="actions">${attempt?`<a class="button secondary small" href="#/reading/part-2/${level.id}/feedback">Previous feedback (${attempt.score}/${level.questions.length})</a>`:''}<a class="button secondary small" href="#/reading/part-2">All levels</a></div></div>
      ${idx===0?`<div class="guided-intro"><div class="eyebrow">Your 3-step short-text strategy</div><div class="steps"><div class="step"><b>1 · READ THE QUESTION</b> What do you need to find out?</div><div class="step"><b>2 · SPOT THE PROOF</b> Find the part of the message that answers it.</div><div class="step"><b>3 · CHECK ALL OPTIONS</b> Rule out statements with a wrong detail.</div></div></div>${r2WorkedExample()}`:''}
      <div class="r2-workspace"><div class="r2-progress-head"><div><strong id="r2-item-count">Text 1 of ${level.questions.length}</strong><div class="tiny muted" id="r2-answered-count">0 of ${level.questions.length} answered</div></div><div class="r2-item-jump" id="r2-jump" aria-label="Jump to text"></div></div><div class="small-progress r2-track"><span id="r2-track-fill" style="width:0%"></span></div><div id="r2-stage" aria-live="polite"></div></div>
      <div class="privacy-note r2-save-note"><strong>Your work is saved automatically.</strong> Use the numbered circles to return to a previous question. Feedback appears after you submit the level.</div></div></section>`,'reading');
    if(idx===0){APP.querySelectorAll('[data-r2-model]').forEach(btn=>btn.addEventListener('click',()=>{
      APP.querySelectorAll('[data-r2-model]').forEach(x=>x.classList.toggle('selected',x===btn));
      const n=document.getElementById('r2-example-feedback');n.className='model-feedback';
      n.textContent=btn.dataset.r2Model==='B'?'Correct. The opening time changes, but lunch stays the same. Match the whole meaning, not just “one hour later”.':'Look again: the notice says lunch service is unchanged. The café opens later, not lunch. Choose B.';
    }));}
    r2RenderQuestion(level,0);
  }
  function r2RenderQuestion(level,index) {
    r2CurrentIndex=Math.max(0,Math.min(index,level.questions.length-1));
    const q=level.questions[r2CurrentIndex];const draft=store.drafts[level.id] || {};
    const count=level.questions.filter(x=>Boolean(draft[String(x.id)])).length;
    const idx=part2Levels.indexOf(level);
    document.getElementById('r2-item-count').textContent=`Text ${r2CurrentIndex+1} of ${level.questions.length}`;
    document.getElementById('r2-answered-count').textContent=`${count} of ${level.questions.length} answered`;
    document.getElementById('r2-track-fill').style.width=`${Math.round(count/level.questions.length*100)}%`;
    document.getElementById('r2-jump').innerHTML=level.questions.map((x,i)=>`<button class="r2-jump-btn ${i===r2CurrentIndex?'current':''} ${draft[String(x.id)]?'done':''}" type="button" data-r2-jump="${i}" aria-label="Go to text ${i+1}${draft[String(x.id)]?', answered':''}" ${i===r2CurrentIndex?'aria-current="step"':''}>${i+1}</button>`).join('');
    const body=e(q.body).replace(/\n/g,'<br>');
    document.getElementById('r2-stage').innerHTML=`<div class="r2-reading-grid"><article class="r2-source-card kind-${e(q.kind)}"><div class="r2-source-bar"><span>${e(q.source)}</span><span class="r2-source-icon" aria-hidden="true">${({notice:'▤',chat:'●',poster:'✦',email:'✉',social:'♥',app:'▦',policy:'▣',info:'◆'})[q.kind]||'▤'}</span></div><div class="r2-source-content"><div class="r2-source-kind">${e(({notice:'NOTICE',chat:'MESSAGE',poster:'POSTER',email:'EMAIL',social:'COMMUNITY POST',app:'APP MESSAGE',policy:'POLICY',info:'INFORMATION'})[q.kind]||'SHORT TEXT')}</div><h3>${e(q.headline)}</h3><p>${body}</p></div><div class="r2-source-foot">Read carefully. Look for the exact meaning.</div></article>
       <section class="r2-question-panel"><div class="eyebrow">QUESTION ${q.id} · 1 MARK</div><h3 id="r2-q-title">${e(q.question)}</h3><fieldset class="r2-options" aria-labelledby="r2-q-title"><legend class="sr-only">Choose one statement</legend>${Object.entries(q.options).map(([letter,text])=>`<label class="r2-choice ${draft[String(q.id)]===letter?'is-checked':''}"><input type="radio" name="r2-answer" value="${letter}" ${draft[String(q.id)]===letter?'checked':''}><span class="r2-choice-letter">${letter}</span><span class="r2-choice-text">${e(text)}</span></label>`).join('')}</fieldset>${idx===0?`<button type="button" class="hint-button r2-hint-trigger" id="r2-show-hint" aria-expanded="false">Show a clue</button><div class="hint-content" id="r2-hint" hidden>${e(q.hint)}</div>`:''}<div class="r2-next-actions"><button class="button secondary" type="button" id="r2-prev" ${r2CurrentIndex===0?'disabled':''}>← Previous</button>${r2CurrentIndex<level.questions.length-1?'<button type="button" class="button primary" id="r2-next">Next text →</button>':`<button type="button" class="button primary" id="r2-submit">Submit for feedback →</button>`}</div></section></div>`;
    APP.querySelectorAll('input[name="r2-answer"]').forEach(el=>el.addEventListener('change',()=>{
      store.drafts[level.id] ||= {};store.drafts[level.id][String(q.id)]=el.value;saveStore();
      APP.querySelectorAll('.r2-choice').forEach(label=>label.classList.toggle('is-checked',label.querySelector('input').checked));
      const saved=store.drafts[level.id];
      document.getElementById('r2-answered-count').textContent=`${level.questions.filter(x=>saved[String(x.id)]).length} of ${level.questions.length} answered`;
      document.getElementById('r2-track-fill').style.width=`${Math.round(level.questions.filter(x=>saved[String(x.id)]).length/level.questions.length*100)}%`;
      APP.querySelectorAll('[data-r2-jump]').forEach(btn=>btn.classList.toggle('done',Boolean(saved[String(level.questions[Number(btn.dataset.r2Jump)].id)])));
    }));
    APP.querySelectorAll('[data-r2-jump]').forEach(btn=>btn.addEventListener('click',()=>r2RenderQuestion(level,Number(btn.dataset.r2Jump))));
    document.getElementById('r2-prev')?.addEventListener('click',()=>r2RenderQuestion(level,r2CurrentIndex-1));
    document.getElementById('r2-next')?.addEventListener('click',()=>r2RenderQuestion(level,r2CurrentIndex+1));
    document.getElementById('r2-submit')?.addEventListener('click',()=>r2Submit(level));
    document.getElementById('r2-show-hint')?.addEventListener('click',()=>{
      const hint=document.getElementById('r2-hint'),btn=document.getElementById('r2-show-hint');
      hint.hidden=!hint.hidden;btn.setAttribute('aria-expanded',String(!hint.hidden));btn.textContent=hint.hidden?'Show a clue':'Hide clue';
    });
  }
  function r2Submit(level) {
    const answers={...(store.drafts[level.id] || {})};
    const answered=level.questions.filter(q=>answers[String(q.id)]).length;
    if(answered===0){window.alert('Choose at least one answer before submitting.');return;}
    if(answered<level.questions.length && !window.confirm(`You answered ${answered} of ${level.questions.length} questions. Unanswered questions score zero. Submit now?`))return;
    const score=level.questions.reduce((sum,q)=>sum+(answers[String(q.id)]===q.answer?1:0),0);
    store.attempts[level.id] ||= [];
    store.attempts[level.id].push({score,answers,at:new Date().toISOString()});
    store.attempts[level.id]=store.attempts[level.id].slice(-15);
    delete store.drafts[level.id];saveStore();
    routeTo(`#/reading/part-2/${level.id}/feedback`);
  }
  function r2FeedbackPage(level) {
    const attempt=latestAttempt(level.id);
    if(!attempt){routeTo(`#/reading/part-2/${level.id}`);return;}
    const score=attempt.score,total=level.questions.length,idx=part2Levels.indexOf(level),next=part2Levels[idx+1];
    const msg=score===total?'Excellent work. You identified the meaning in all six texts.':score>=Math.ceil(total*.7)?'Good progress. Review the exceptions and details in the questions you missed.':'Keep practising. Look for the evidence that makes one choice right and rules out the others.';
    shell(pageHero([['Home','#/home'],['Reading','#/reading'],['Part 2','#/reading/part-2'],[`Level ${idx+1}`,'#/reading/part-2/'+level.id],['Feedback','#/reading/part-2/'+level.id+'/feedback']],'Reading Part 2 · Feedback',`Level ${idx+1} · Your results`,'One point per correct answer. Compare your choice with the supporting words and the tempting incorrect options.')+
      `<section class="section" style="padding-top:32px"><div class="container work-layout"><div class="panel"><div class="feedback-header"><div><div class="eyebrow">Latest attempt · ${e(dateText(attempt.at))}</div><h2>${e(level.title)}</h2><p class="muted" style="font-size:.89rem;margin:0">${e(msg)}</p></div><div><div class="score-big">${score}<small> / ${total}</small></div><div class="tiny muted">${Math.round(score/total*100)}% correct</div></div></div><div class="small-progress"><span style="width:${Math.round(score/total*100)}%"></span></div><h3 style="margin:25px 0 9px">Understand each answer</h3>${level.questions.map(q=>{
        const chosen=attempt.answers?.[String(q.id)]||'',correct=chosen===q.answer;
        return `<article class="feedback-item"><div class="mini-meta"><span class="qnum" style="min-width:26px;padding:5px">${q.id}</span><strong>${e(q.headline)}</strong><span class="${correct?'answer-correct':'answer-incorrect'}">${correct?'✓ Correct':'✕ Not quite'}</span></div><p class="q-text">${e(q.question)}</p><p class="r2-feedback-choices">Your answer: <strong>${e(chosen||'—')}</strong> &nbsp; | &nbsp; Correct: <strong>${e(q.answer)} — ${e(q.options[q.answer])}</strong></p><p class="evidence"><strong>Evidence from the text:</strong> “${e(q.evidence)}”</p><p class="r2-explain">${e(q.explanation)}</p><p class="r2-trap"><strong>Watch out:</strong> ${e(q.trap)}</p></article>`;
      }).join('')}<div class="feedback-actions"><button type="button" class="button secondary" id="r2-retry">Try this level again</button>${next?`<a class="button primary" href="#/reading/part-2/${next.id}">Continue to Level ${idx+2} →</a>`:`<a class="button primary" href="#/progress">See my progress →</a>`}<a class="button subtle-btn" href="#/reading/part-2">All Part 2 levels</a></div></div><aside><div class="path-summary"><div class="label">Your achievement</div><strong>${score} / ${total} correct</strong><p style="font-size:.85rem;margin:12px 0">Best: ${scoreLabel(level)} · ${getAttempts(level.id).length} attempt(s)</p><div class="small-progress"><span style="width:${Math.round(bestScore(level.id)/total*100)}%"></span></div></div><div class="panel" style="margin-top:17px"><h3>What to notice</h3><p class="muted" style="font-size:.88rem">A distractor may reuse the same topic but change the deadline, location, person, or condition. Correct answers often paraphrase rather than repeat the exact wording.</p></div></aside></div></section>`,'reading');
    document.getElementById('r2-retry')?.addEventListener('click',()=>{delete store.drafts[level.id];saveStore();routeTo(`#/reading/part-2/${level.id}`);});
  }
  // Reading Part 3 — long-form reading: one continuous text beside one question at a time.
  let r3CurrentIndex = 0;
  const r3Letters = ['A','B','C','D'];
  function r3PartPage(){
    shell(pageHero([['Home','#/home'],['Reading','#/reading'],['Part 3','#/reading/part-3']],'Reading · Part 3','Read longer texts','Read carefully, recognise ideas expressed in different words and choose the one answer fully supported by the article.')+
      `<section class="section"><div class="container work-layout"><div><div class="r3-part-intro"><span class="eyebrow">A complete three-level pathway</span><p>Begin with two short texts and helpful clues. Then practise with a longer article before taking on a more demanding newspaper text.</p></div><div class="level-list">${part3Levels.map((l,i)=>{
        const past=latestAttempt(l.id);
        const source = i===0?'Two original texts':i===1?'VOA-based health article':'Adapted Guardian article';
        return `<div class="level-choice r3-level-choice"><div class="level-number">0${i+1}</div><div class="level-desc"><div class="eyebrow" style="font-size:.65rem">LEVEL ${i+1} · ${e(l.tag)}</div><h3>${e(l.title)}</h3><p>${e(l.description)}</p><div class="meta"><span>${l.questions.length} questions · ${l.questions.length} marks</span><span>·</span><span>${e(source)}</span><span>·</span><span>About ${l.estimatedMinutes} minutes</span>${past?`<span class="pill ready">Best: ${scoreLabel(l)}</span>`:''}</div><div class="actions" style="margin-top:16px"><a class="button ${i===0?'primary':'secondary'} small" href="#/reading/part-3/${l.id}">${past?'Practise again':'Start level'} →</a>${past?`<a class="button subtle-btn small" href="#/reading/part-3/${l.id}/feedback">Review feedback</a>`:''}</div></div></div>`;
      }).join('')}</div><div class="privacy-note"><strong>Your learning journey:</strong> Every text is followed by questions. Feedback appears after you submit each level, with short evidence quotations and explanations. Your work stays on this device.</div></div><aside><div class="path-summary"><div class="label">Reading Part 3</div><strong>${completedPart3Count()} / 3 levels completed</strong><p class="tiny" style="margin:12px 0">Clues → independent practice → the challenge</p><div class="small-progress"><span style="width:${Math.round(completedPart3Count()/3*100)}%"></span></div></div><div class="panel" style="margin-top:17px"><h3>Read · Find · Check</h3><p class="muted" style="font-size:.89rem">The correct answer may express the article's meaning in different words. Check the exact evidence before you decide.</p></div></aside></div></section>`,'reading');
  }
  function r3ArticleHtml(level){
    const url=level.source.url;
    const citation=`${e(level.source.label)}${url?` <a href="${e(url)}" target="_blank" rel="noopener noreferrer">Original article ↗</a>`:''}`;
    return `<details class="r3-article" open id="r3-article"><summary><span><span class="r3-reader-label">READING TEXT</span><span class="r3-summary-title">${e(level.articleTitle)}</span></span><span class="r3-reader-toggle">Show / hide article</span></summary><div class="r3-article-scroll" id="r3-article-scroll"><div class="r3-paper"><div class="r3-paper-eyebrow">THINKLAB · READING PART 3</div><h2>${e(level.articleTitle)}</h2><div class="r3-article-subtitle">${e(level.articleSubtitle)}</div>${level.passages.map((p,i)=>`${p.heading?`<h3 class="r3-passage-heading" id="r3-para-${i}">${e(p.heading)}</h3>`:''}<p class="r3-paragraph">${e(p.text)}</p>`).join('')}<p class="r3-citation">${citation}</p></div></div></details>`;
  }
  function r3Example(){
    return `<div class="model-example r3-model"><div class="eyebrow">Worked example · Not scored</div><h3>Find what the message really means</h3><div class="r2-mini-source"><strong>AFTER-SCHOOL CLUB</strong><p>The art club normally meets on Wednesdays. This week, however, it will meet on Thursday because the room is being repaired.</p></div><div class="tiny muted" style="margin:12px 0">Which statement is correct?</div><div class="model-choices"><button class="model-choice" type="button" data-r3-model="A"><b>A</b> The art club is cancelled this week.</button><button class="model-choice" type="button" data-r3-model="B"><b>B</b> The art club is meeting on a different day this week.</button></div><div class="tiny muted" id="r3-model-feedback" aria-live="polite">Choose one statement to see how the clue works.</div></div>`;
  }
  function r3LevelPage(level){
    const idx=part3Levels.indexOf(level);
    r3CurrentIndex=0;
    const last=latestAttempt(level.id);
    shell(pageHero([['Home','#/home'],['Reading','#/reading'],['Part 3','#/reading/part-3'],[`Level ${idx+1}`,'#/reading/part-3/'+level.id]],`Reading Part 3 · Level ${idx+1}`,level.title,level.description)+
      `<section class="section r3-section"><div class="container"><div class="task-topbar"><div><div class="eyebrow">${e(level.tag)} · ${level.questions.length} marks</div><h2>Longer reading comprehension</h2></div><div class="actions">${last?`<a class="button small secondary" href="#/reading/part-3/${level.id}/feedback">Last feedback (${last.score}/${level.questions.length})</a>`:''}<a class="button small secondary" href="#/reading/part-3">All levels</a></div></div>
      ${idx===0?`<div class="guided-intro r3-strategy"><div class="eyebrow">READ · FIND · CHECK</div><div class="steps"><div class="step"><b>1 · READ</b> Understand what the question is asking.</div><div class="step"><b>2 · FIND</b> Look for evidence in the article.</div><div class="step"><b>3 · CHECK</b> Test all four answers before choosing.</div></div></div>${r3Example()}`:''}
      <div class="r3-workspace"><div class="r3-topline"><div><span class="eyebrow">${e(level.articleSubtitle)}</span><strong>One correct answer per question</strong><p>${idx===0?'Clues are available if you need them.':'Work independently. The answers and explanations appear after you submit.'}</p></div><div class="r3-score-tag">${level.questions.length} marks</div></div><div class="r3-columns">${r3ArticleHtml(level)}<div class="r3-task-column"><div class="r3-question-head"><div><div class="r3-question-counter" id="r3-counter">Question 1 of ${level.questions.length}</div><div class="tiny muted" id="r3-answered-count">0 of ${level.questions.length} answered</div></div><div class="r3-jumps" id="r3-jumps" aria-label="Question navigation"></div></div><div class="small-progress r3-track"><span id="r3-track-fill" style="width:0%"></span></div><div id="r3-stage" aria-live="polite"></div></div></div></div><div class="privacy-note r3-privacy"><strong>Your answers save automatically</strong> in this browser. You may return to the reading text and change answers until you submit.</div></div></section>`,'reading');
    if(idx===0){
      APP.querySelectorAll('[data-r3-model]').forEach(btn=>btn.addEventListener('click',()=>{
        APP.querySelectorAll('[data-r3-model]').forEach(x=>x.classList.toggle('selected',x===btn));
        const el=document.getElementById('r3-model-feedback');
        el.className='model-feedback';
        el.textContent=btn.dataset.r3Model==='B'?'Correct. “However” introduces an exception: the club still meets, but on Thursday instead of Wednesday.':'This is a tempting mistake. The club is NOT cancelled; the day has changed. Look for “however”.';
      }));
    }
    r3RenderQuestion(level,0);
  }
  function r3RefreshIndicators(level){
    const draft=store.drafts[level.id]||{};
    const count=level.questions.filter(q=>draft[String(q.id)]).length;
    document.getElementById('r3-counter').textContent=`Question ${r3CurrentIndex+1} of ${level.questions.length}`;
    document.getElementById('r3-answered-count').textContent=`${count} of ${level.questions.length} answered`;
    document.getElementById('r3-track-fill').style.width=`${Math.round(count/level.questions.length*100)}%`;
    const buttons=level.questions.map((q,i)=>`<button type="button" class="r2-jump-btn ${draft[String(q.id)]?'done':''} ${i===r3CurrentIndex?'current':''}" data-r3-jump="${i}" aria-label="Go to question ${i+1}${draft[String(q.id)]?', answered':''}" ${i===r3CurrentIndex?'aria-current="step"':''}>${i+1}</button>`).join('');
    document.getElementById('r3-jumps').innerHTML=buttons;
    APP.querySelectorAll('[data-r3-jump]').forEach(btn=>btn.addEventListener('click',()=>r3RenderQuestion(level,Number(btn.dataset.r3Jump))));
  }
  function r3RenderQuestion(level,index){
    r3CurrentIndex=Math.min(Math.max(index,0),level.questions.length-1);
    const q=level.questions[r3CurrentIndex];
    const val=(store.drafts[level.id]||{})[String(q.id)]||'';
    const idx=part3Levels.indexOf(level);
    document.getElementById('r3-stage').innerHTML=`<div class="r3-question-content"><div class="r3-question-tag">QUESTION ${q.id} · ${e(q.skill)}</div><h3 id="r3-current-question">${e(q.question)}</h3><fieldset class="r2-options r3-options" aria-labelledby="r3-current-question"><legend class="sr-only">Choose one statement</legend>${r3Letters.map(letter=>`<label class="r2-choice ${val===letter?'is-checked':''}"><input type="radio" name="r3-choice" value="${letter}" ${val===letter?'checked':''}><span class="r2-choice-letter">${letter}</span><span class="r2-choice-text">${e(q.options[letter])}</span></label>`).join('')}</fieldset>
      ${idx===0?`<div class="r3-hint-wrap"><button type="button" class="button secondary small" id="r3-hint-btn" aria-expanded="false">✦ Need a clue?</button><div class="r3-hint" id="r3-hint" hidden>${e(q.hint)}</div></div>`:''}</div><div class="r3-bottom-actions"><button type="button" class="button secondary" id="r3-prev" ${r3CurrentIndex===0?'disabled':''}>← Previous</button>${r3CurrentIndex===level.questions.length-1?`<button type="button" class="button primary" id="r3-submit">Submit for feedback →</button>`:`<button type="button" class="button primary" id="r3-next">Next question →</button>`}</div><p class="r3-navigation-tip">You can also use the numbered buttons above to revisit a question.</p>`;
    APP.querySelectorAll('input[name="r3-choice"]').forEach(el=>el.addEventListener('change',()=>{
      store.drafts[level.id] ||= {};
      store.drafts[level.id][String(q.id)]=el.value;
      saveStore();
      APP.querySelectorAll('.r3-options .r2-choice').forEach(item=>item.classList.toggle('is-checked',item.querySelector('input').checked));
      r3RefreshIndicators(level);
    }));
    document.getElementById('r3-prev')?.addEventListener('click',()=>r3RenderQuestion(level,r3CurrentIndex-1));
    document.getElementById('r3-next')?.addEventListener('click',()=>r3RenderQuestion(level,r3CurrentIndex+1));
    document.getElementById('r3-submit')?.addEventListener('click',()=>r3Submit(level));
    document.getElementById('r3-hint-btn')?.addEventListener('click',()=>{
      const hint=document.getElementById('r3-hint'),btn=document.getElementById('r3-hint-btn');
      hint.hidden=!hint.hidden;btn.setAttribute('aria-expanded',String(!hint.hidden));btn.textContent=hint.hidden?'✦ Need a clue?':'✦ Hide clue';
    });
    r3RefreshIndicators(level);
  }
  function r3Submit(level){
    const answers={...(store.drafts[level.id]||{})};
    const answered=level.questions.filter(q=>answers[String(q.id)]).length;
    if(answered<level.questions.length && !window.confirm(`You answered ${answered} of ${level.questions.length} questions. Blank answers receive zero points. Submit now?`))return;
    const score=level.questions.reduce((n,q)=>n+(answers[String(q.id)]===q.answer?1:0),0);
    store.attempts[level.id] ||= [];
    store.attempts[level.id].push({score,answers,at:new Date().toISOString()});
    store.attempts[level.id]=store.attempts[level.id].slice(-15);
    delete store.drafts[level.id];saveStore();
    routeTo(`#/reading/part-3/${level.id}/feedback`);
  }
  function r3FeedbackPage(level){
    const attempt=latestAttempt(level.id);
    if(!attempt){routeTo(`#/reading/part-3/${level.id}`);return;}
    const idx=part3Levels.indexOf(level),next=part3Levels[idx+1],correct=attempt.score,total=level.questions.length;
    const assessment=correct===total?'Excellent. You found the precise meaning behind every answer.':correct>=Math.ceil(total*.7)?'Good work. Check the explanations of the questions you missed.':'You have useful evidence to learn from. Look for the words that change the meaning of tempting incorrect answers.';
    shell(pageHero([['Home','#/home'],['Reading','#/reading'],['Part 3','#/reading/part-3'],[`Level ${idx+1}`,'#/reading/part-3/'+level.id],['Feedback','#/reading/part-3/'+level.id+'/feedback']],'Reading Part 3 · Feedback',`Level ${idx+1} · Your results`,'Review your choices, the textual evidence and why the tempting alternatives are not supported.')+
      `<section class="section" style="padding-top:32px"><div class="container work-layout"><div class="panel"><div class="feedback-header"><div><div class="eyebrow">Latest attempt · ${e(dateText(attempt.at))}</div><h2 style="margin-top:8px">${e(level.title)}</h2><p class="muted" style="font-size:.9rem">${e(assessment)}</p></div><div><div class="score-big">${correct}<small> / ${total}</small></div><div class="tiny muted">${Math.round(correct/total*100)}% correct</div></div></div><div class="small-progress"><span style="width:${Math.round(correct/total*100)}%"></span></div><h3 style="margin:25px 0 12px">Question-by-question feedback</h3>${level.questions.map(q=>{
        const your=attempt.answers?.[String(q.id)]||'',ok=your===q.answer;
        return `<article class="feedback-item r3-feedback-item"><div class="mini-meta"><span class="qnum" style="min-width:26px;padding:5px">${q.id}</span><span class="r3-skill-chip">${e(q.skill)}</span><span class="${ok?'answer-correct':'answer-incorrect'}">${ok?'✓ Correct':'✕ Review'}</span></div><p class="q-text"><strong>${e(q.question)}</strong></p><p class="r2-feedback-choices">Your answer: <strong>${e(your||'Not answered')}</strong> &nbsp; | &nbsp; Correct: <strong>${e(q.answer)} · ${e(q.options[q.answer])}</strong></p><p class="evidence"><strong>Textual evidence:</strong> ${e(q.evidence)}</p><p class="r2-explain">${e(q.explanation)}</p><p class="r2-trap"><strong>Watch out:</strong> ${e(q.trap)}</p></article>`;
      }).join('')}<div class="feedback-actions"><button class="button secondary" id="r3-retry">Try this level again</button>${next?`<a class="button primary" href="#/reading/part-3/${next.id}">Continue to Level ${idx+2} →</a>`:`<a class="button primary" href="#/progress">See my progress →</a>`}<a class="button subtle-btn" href="#/reading/part-3">All Part 3 levels</a></div></div><aside><div class="path-summary"><div class="label">Your achievement</div><strong>${correct} / ${total} correct</strong><p style="font-size:.85rem;margin:12px 0">Best: ${scoreLabel(level)} · ${getAttempts(level.id).length} attempt(s)</p><div class="small-progress"><span style="width:${Math.round(bestScore(level.id)/total*100)}%"></span></div></div><div class="panel" style="margin-top:17px"><h3>Three things to check</h3><ol class="r3-feedback-guide"><li>Does the answer express the same meaning as the text?</li><li>Is there a condition, exception or qualifying word?</li><li>Have you confused a person's opinion with a fact?</li></ol><p class="tiny muted">One point for each correct response. This is practice feedback, not an official MSA grade.</p></div></aside></div></section>`,'reading');
    document.getElementById('r3-retry')?.addEventListener('click',()=>{delete store.drafts[level.id];saveStore();routeTo(`#/reading/part-3/${level.id}`);});
  }

  // Writing Part 1, Level 1: student-led photo response practice.
  // Deliberately no automatic numerical mark: clarity and relevance require human judgement.
  const W1_ID = 'writing-photo-1';
  const W1_L2_ID = 'writing-photo-2';
  const W1_L3_ID = 'writing-photo-3';
  const W1_ALL_IDS = [W1_ID, W1_L2_ID, W1_L3_ID];
  const w1ExamPhotos = {
    2: {
      id: W1_L2_ID, title: 'A Surprise in the Park', label: 'Practise like the exam',
      photo: 'assets/park-proposal-chatgpt.jpg',
      alt: 'A man kneels on one knee in a leafy park holding a ring box towards a surprised woman.',
      model: "I took this photo in the park near my aunt's house last Sunday. That's my brother Daniel proposing to his girlfriend, Maya. He planned the surprise for weeks and finally asked her to marry him. She looks completely shocked, but very happy.",
      modelNote: 'The writer identifies a believable location, names the people and clearly explains the proposal. The extra background adds interest without replacing the three required points.'
    },
    3: {
      id: W1_L3_ID, title: 'Up in the Clouds', label: 'Take the challenge',
      photo: 'assets/mountain-hike-chatgpt.jpg',
      alt: 'Four young hikers in jackets with backpacks walk along a rocky mountain trail beneath thick grey clouds.',
      model: 'We took this photo while hiking in the mountains during our holiday. The four hikers are my classmates Nia, Felix, Sara and Ben. Dark clouds were gathering above us, but we continued carefully along the rocky path. We were tired, excited and determined to reach the viewpoint.',
      modelNote: 'The writer makes the location and the four people clear, describes the hiking and includes believable detail about the cloudy weather without exceeding 50 words.'
    }
  };
  function w1AnyAttempts(id){ return Array.isArray(store.attempts[id]) ? store.attempts[id] : []; }
  function w1AnyLast(id){ return w1AnyAttempts(id).at(-1); }
  function w1AnyDraft(id){ const d=store.drafts[id];return (d&&typeof d==='object'&&!Array.isArray(d))?d:{}; }
  function w1Attempts() { return Array.isArray(store.attempts[W1_ID]) ? store.attempts[W1_ID] : []; }
  function w1Last() { return w1Attempts().at(-1); }
  function w1Draft() {
    const d = store.drafts[W1_ID];
    return (d && typeof d === 'object' && !Array.isArray(d)) ? d : {};
  }
  function w1WordCount(text) { return (String(text||'').match(/[\p{L}\p{N}]+(?:[’'\-][\p{L}\p{N}]+)*/gu) || []).length; }
  function w1PhotoCaption() {
    return '<figcaption>Image credit: AI-generated image created with <strong>ChatGPT (OpenAI), 2026</strong>, for ThinkLab MSA Prep. Not taken from an examination paper or a third-party website.</figcaption>';
  }
  function w1PhotoHtml() {
    return `<figure class="w1-photo"><img src="assets/neighbourhood-football-chatgpt.jpg" loading="eager" alt="Three teenagers playing football on a grassy neighbourhood field, with goalposts, trees and houses behind them.">${w1PhotoCaption()}</figure>`;
  }
  function writingPartPage() {
    const cards=[
      {n:1,id:W1_ID,title:'Learn with clues',tag:'Guided practice',desc:'Notice details, create believable names and use the optional writing frame.',photo:'assets/neighbourhood-football-chatgpt.jpg',alt:'Three teenagers playing football in a neighbourhood field.'},
      {n:2,id:W1_L2_ID,title:'Practise like the exam',tag:'Independent photo response',desc:'Answer James in 30–50 words, independently, without writing clues.',photo:w1ExamPhotos[2].photo,alt:w1ExamPhotos[2].alt},
      {n:3,id:W1_L3_ID,title:'Take the challenge',tag:'Independent challenge',desc:'Invent a coherent story and explain the scene clearly in the same 30–50-word exam format.',photo:w1ExamPhotos[3].photo,alt:w1ExamPhotos[3].alt}
    ];
    shell(pageHero([['Home','#/home'],['Writing','#/writing'],['Part 1','#/writing/part-1']],'Writing · Part 1','Your Photo','Three photos. Three levels. One MSA goal: explain where, who and what in 30–50 clear words.')+
      `<section class="section w1-section"><div class="container"><div class="w1-part-intro"><div><div class="eyebrow">Writing Part 1 · all three levels</div><h2>Look at the photo. Tell James the story.</h2><p>You can invent names, relationships and a believable explanation of the scene. The real MSA assesses the three content points and how clearly you communicate—not whether you guessed a photo's true story.</p><div class="w1-criteria-note" style="margin-top:16px"><strong>Exam reminder:</strong> Where was it taken? Who are the people? What's going on? · <strong>30–50 words · /5 points</strong></div></div>${w1PhotoHtml()}</div>
      <div class="w1-showcase">${cards.map(c=>{const attempts=w1AnyAttempts(c.id),last=w1AnyLast(c.id); const url='#/writing/part-1/level-'+c.n;return `<article class="w1-showcase-card"><figure class="w1-photo"><img loading="lazy" src="${c.photo}" alt="${e(c.alt)}"><figcaption>${w1PhotoCaption().replace(/<\/?figcaption>/g,'')}</figcaption></figure><div class="w1-showcase-body"><div class="eyebrow">LEVEL ${c.n} · ${e(c.tag)}</div><h3>${e(c.title)}</h3><p>${e(c.desc)}</p><div class="w1-card-meta"><span>30–50 words</span><span>5 marks (exam)</span>${attempts.length?`<span class="pill ready">${attempts.length} review${attempts.length===1?'':'s'}</span>`:''}</div><div class="actions"><a href="${url}" class="button primary small">${attempts.length?'Try again':'Open level'} →</a>${last?`<a href="${url}/feedback" class="button secondary small">View feedback</a>`:''}</div></div></article>`;}).join('')}</div></div></section>`,'writing');
  }
  function w1Options(options, selected) {
    return options.map(o=>`<option value="${e(o[0])}" ${o[0]===selected?'selected':''}>${e(o[1])}</option>`).join('');
  }
  function writingLevelPage() {
    const d=w1Draft();
    const checks=(d.checks && typeof d.checks==='object') ? d.checks : {};
    const previous=w1Last();
    const relationOpts=[['my cousins','My cousins'],['my friends','My friends'],['my classmates','My classmates'],['my neighbours','My neighbours'],['my brothers','My brothers'],['some teenagers from our neighbourhood','People from our neighbourhood']];
    const timeOpts=[['last Saturday','Last Saturday'],['yesterday afternoon','Yesterday afternoon'],['after school','After school'],['last weekend','Last weekend'],['during the school holidays','During the school holidays']];
    shell(pageHero([['Home','#/home'],['Writing','#/writing'],['Part 1','#/writing/part-1'],['Level 1','#/writing/part-1/level-1']],'Writing Part 1 · Level 1','Your Photo: Football at the Field','Learn with clues · Imagine believable details · Write a clear 30–50-word response.')+
      `<section class="section w1-section"><div class="container"><div class="w1-intro-bar"><div><div class="eyebrow">YOUR GOAL</div><strong>Explain the photo to James in 30–50 words.</strong><p>All three points matter: where · who · what is happening. You can be creative!</p></div><div class="w1-mark-pill">/ 5 marks</div></div>
      <div class="w1-grid"><aside class="w1-visual-col"><div class="w1-sticky">${w1PhotoHtml()}<div class="w1-chat"><div class="w1-chat-head"><span class="w1-avatar">J</span><div><strong>James</strong><small>Your friend · Messaging you</small></div></div><div class="w1-post">You posted this photo. James wants to know more!</div><div class="w1-bubble">Wow, where did you take that photo?<br><br>Who are they?<br><br>What's going on?</div></div><div class="w1-photo-tip"><strong>Remember:</strong> Nobody knows the real story behind this imagined scene. Make up a sensible one!</div></div></aside>
      <div class="w1-main-col">
      <section class="w1-step" id="w1-observe"><div class="w1-step-top"><span class="w1-step-num">01</span><div><div class="eyebrow">LOOK AND NOTICE</div><h2>What can you see?</h2></div></div><p>Look for real clues in the image before you invent details.</p><div class="w1-observations"><div><b>Where?</b><span>A grassy field, houses and a goal</span></div><div><b>Who?</b><span>Three teenagers</span></div><div><b>What?</b><span>Playing football and moving towards the ball</span></div></div><p class="w1-annotation">A photo shows us <strong>what is visible</strong>. You can decide the names, relationships, time and occasion.</p></section>
      <section class="w1-step" id="w1-create"><div class="w1-step-top"><span class="w1-step-num">02</span><div><div class="eyebrow">MAKE THE PHOTO YOUR STORY</div><h2>Invent believable details</h2></div></div><p>Pick some ideas below, or write something completely different. There is no single correct story.</p><div class="w1-fields"><label>Your relationship to the players<select id="w1-relation">${w1Options(relationOpts,d.relation||'my cousins')}</select></label><label>When did it happen?<select id="w1-time">${w1Options(timeOpts,d.time||'last Saturday')}</select></label><label>Give the players names (optional)<input id="w1-names" type="text" maxlength="80" value="${e(d.names||'')}" placeholder="e.g. Vinie, Matti and Alex"></label><label>Give the place a name (optional)<input id="w1-place" type="text" maxlength="80" value="${e(d.place||'')}" placeholder="e.g. our neighbourhood field"></label></div><div class="w1-builder-bottom"><button type="button" class="button secondary" id="w1-starter">Build an editable starter →</button><span class="tiny muted">You can change or ignore every suggestion.</span></div></section>
      <section class="w1-step" id="w1-write"><div class="w1-step-top"><span class="w1-step-num">03</span><div><div class="eyebrow">WRITE YOUR RESPONSE</div><h2>Tell James about the picture</h2></div></div><p>Write a short, connected reply. Answer <strong>where, who and what</strong> in your own words. Adding a name or a reason can make your answer more natural.</p><div class="w1-starters"><strong>Need a sentence starter?</strong><details><summary>Show writing clues</summary><ul><li>I took this photo at …</li><li>Those are my …</li><li>The boy in the blue hoodie is …</li><li>They are playing … because …</li></ul><small>These are suggestions, not sentences you must copy.</small></details></div><label class="w1-textarea-label" for="w1-response">Your message to James</label><textarea id="w1-response" rows="8" spellcheck="true" placeholder="I took this photo at our neighbourhood field …">${e(d.text||'')}</textarea><div class="w1-wordrow"><span id="w1-count" aria-live="polite">0 words</span><span class="w1-range" id="w1-range">Aim for 30–50 words</span></div><div class="w1-word-track"><span id="w1-meter"></span></div><p class="w1-autosave">${localSavingAvailable?'Your writing is saved automatically in this browser.':'Browser storage is unavailable here. Copy your writing somewhere safe before closing.'}</p></section>
      <section class="w1-step" id="w1-check"><div class="w1-step-top"><span class="w1-step-num">04</span><div><div class="eyebrow">SELF-CHECK</div><h2>Have you answered James?</h2></div></div><p>Read your writing once more. Tick only what is <em>actually in your response</em>.</p><div class="w1-checks">${[['where','I explained where the photo was taken.'],['who','I said who the people are.'],['what','I described what is happening.'],['clear','My sentences are understandable and connected.']].map(([k,label])=>`<label class="w1-check"><input type="checkbox" data-w1-check="${k}" ${checks[k]?'checked':''}><span>${e(label)}</span></label>`).join('')}</div><div class="w1-criteria-note"><strong>How the exam awards 5 marks:</strong> The three content points and clear English matter. The official task asks for 30–50 words. Creativity is encouraged, but names and extra details do not earn separate marks.</div><div class="w1-cta"><button type="button" class="button primary" id="w1-review">Review my writing →</button>${previous?'<a class="button secondary" href="#/writing/part-1/level-1/feedback">See previous review</a>':''}<p id="w1-warning" class="tiny" role="alert"></p></div></section>
      </div></div></div></section>`,'writing');
    const response=APP.querySelector('#w1-response');
    const saveField=()=>{
      store.drafts[W1_ID] ||= {};
      const p=store.drafts[W1_ID];
      p.text=response.value;
      p.relation=APP.querySelector('#w1-relation').value;
      p.time=APP.querySelector('#w1-time').value;
      p.names=APP.querySelector('#w1-names').value;
      p.place=APP.querySelector('#w1-place').value;
      p.checks={};
      APP.querySelectorAll('[data-w1-check]').forEach(c=>p.checks[c.dataset.w1Check]=c.checked);
      saveStore();
    };
    const updateWords=()=>{
      const n=w1WordCount(response.value);
      APP.querySelector('#w1-count').textContent=n+' word'+(n===1?'':'s');
      const label=APP.querySelector('#w1-range');
      const meter=APP.querySelector('#w1-meter');
      label.className='w1-range '+(n>=30&&n<=50?'good':n?'needs-work':'');
      label.textContent=n===0?'Aim for 30–50 words':n<20?'Too short: under 20 words':n<30?'Add '+(30-n)+' more word'+(30-n===1?'':'s'):n<=50?'Within the exam word range':(n-50)+' word'+(n-50===1?'':'s')+' over the limit';
      meter.style.width=Math.min(n/50*100,100)+'%';
      meter.classList.toggle('good',n>=30&&n<=50);
      meter.classList.toggle('over',n>50);
    };
    APP.querySelectorAll('#w1-names,#w1-place,#w1-time,#w1-relation').forEach(el=>el.addEventListener('input',saveField));
    response.addEventListener('input',()=>{saveField();updateWords();});
    APP.querySelectorAll('[data-w1-check]').forEach(el=>el.addEventListener('change',saveField));
    updateWords();
    APP.querySelector('#w1-starter').addEventListener('click',()=>{
      if(response.value.trim() && !window.confirm('Replace your current writing with an editable starter? Your existing draft will be overwritten.'))return;
      const who=APP.querySelector('#w1-relation').value;
      const name=APP.querySelector('#w1-names').value.trim().replace(/[.!?]+$/,'');
      const where=APP.querySelector('#w1-place').value.trim() || 'our neighbourhood field';
      const when=APP.querySelector('#w1-time').value;
      response.value=`I took this photo ${when} at ${where}. Those are ${who}${name?' '+name:''}. They are playing a friendly football match. One boy is trying to score while the others are stopping him. We often play here together.`;
      saveField();updateWords();response.focus();response.scrollIntoView({behavior:'smooth',block:'center'});
    });
    APP.querySelector('#w1-review').addEventListener('click',()=>{
      const text=response.value.trim();
      if(!text){APP.querySelector('#w1-warning').textContent='Please write your reply first. Then you can review it.';response.focus();return;}
      saveField();
      const p=w1Draft();
      const attempt={at:new Date().toISOString(),text,wordCount:w1WordCount(text),checks:{...p.checks}};
      store.attempts[W1_ID] ||= [];
      store.attempts[W1_ID].push(attempt);
      saveStore();
      routeTo('#/writing/part-1/level-1/feedback');
    });
  }
  function writingFeedbackPage(){
    const attempt=w1Last();
    if(!attempt){routeTo('#/writing/part-1/level-1');return;}
    const n=attempt.wordCount,checks=attempt.checks||{};
    const wordMessage=n<20?'Your response is under 20 words. The official rubric includes a 1-mark descriptor for very short writing.':n<30?'Your response is under 30 words. The official rubric includes a 2-mark descriptor for writing shorter than 30 words.':n>50?'Your response is longer than the exam request. Edit it to stay within 30–50 words.':'Your response meets the requested 30–50-word length.';
    const missing=[['where','where you took the photo'],['who','who the people are'],['what','what is happening']].filter(([k])=>!checks[k]);
    shell(pageHero([['Home','#/home'],['Writing','#/writing'],['Part 1','#/writing/part-1'],['Level 1','#/writing/part-1/level-1'],['Feedback','#/writing/part-1/level-1/feedback']],'Writing Part 1 · Feedback','Your writing review','Use your own checklist and the official exam expectations to improve your reply before the next attempt.')+
      `<section class="section w1-section"><div class="container w1-results-layout"><div>
      <div class="panel w1-result-panel"><div class="eyebrow">YOUR MOST RECENT RESPONSE · ${e(dateText(attempt.at))}</div><div class="w1-result-head"><h2>My message to James</h2><div class="w1-count-pill ${n>=30&&n<=50?'good':''}">${n} words</div></div><blockquote>${e(attempt.text)}</blockquote><div class="w1-word-feedback ${n>=30&&n<=50?'good':'needs-work'}">${e(wordMessage)}</div><p class="w1-teacher-note"><strong>To receive a score out of 5, share your writing with your teacher.</strong> This website provides practice feedback only.</p></div>
      <div class="panel w1-result-panel"><div class="eyebrow">SELF-REFLECTION</div><h2>Did you cover all three points?</h2><p class="muted">This feedback is based on <strong>your own ticks</strong>. It does not automatically understand or grade your writing.</p><div class="w1-check-summary">${[['where','Where was the photo taken?'],['who','Who are the people?'],['what','What is happening?'],['clear','Is the language understandable?']].map(([k,label])=>`<div class="w1-check-result"><span class="w1-mini-icon ${checks[k]?'good':''}">${checks[k]?'✓':'!'}</span><span>${e(label)}</span><strong>${checks[k]?'You ticked yes':'Review this'}</strong></div>`).join('')}</div>${missing.length?`<div class="w1-suggestion"><strong>What to add:</strong> Your self-check suggests you may need to explain ${e(missing.map(x=>x[1]).join(', '))}. Return to your draft and add this information.</div>`:`<div class="w1-suggestion"><strong>Next improvement:</strong> You marked all three content points as present. Read your answer again and make each one clear and specific.</div>`}${!checks.clear?'<div class="w1-suggestion"><strong>Clarity tip:</strong> Use short, complete sentences. Present simple and present continuous are both useful: “Those are my cousins. They are playing football.”</div>':''}</div>
      <div class="panel w1-result-panel"><div class="eyebrow">WHAT A GOOD RESPONSE COULD LOOK LIKE</div><h2>One possible model</h2><p class="w1-model-text">I took this photo last Saturday at our neighbourhood field. Those are my cousins Vinie and Matti, and their friend Alex. They are playing a friendly football match. Vinie is trying to score while Matti is blocking him. We often meet here after school.</p><p class="tiny muted">This is just one believable story. Your names, setting and details can be different.</p></div>
      <div class="w1-review-actions"><a href="#/writing/part-1/level-1" class="button primary">Improve my response →</a><button type="button" class="button secondary" id="w1-copy">Copy my response</button><a class="button subtle-btn" href="#/writing/part-1">Writing Part 1 overview</a></div><p id="w1-copy-note" class="tiny muted" aria-live="polite"></p>
      </div><aside><div class="path-summary"><div class="label">Your writing practice</div><strong>${w1Attempts().length} review${w1Attempts().length===1?'':'s'} completed</strong><p class="tiny" style="margin:12px 0">This is formative feedback, not an official exam mark.</p></div><div class="panel w1-rubric"><h3>The 2026 MSA rubric · /5 points</h3><p class="muted">Examiners look for all three required points <strong>and</strong> clarity of expression. The official rubric allows any coherent interpretation of the photo.</p><div class="w1-rubric-row"><b>5</b><span>All three points handled particularly well; consistently clear language.</span></div><div class="w1-rubric-row"><b>4</b><span>All three covered successfully; mostly clear language.</span></div><div class="w1-rubric-row"><b>3</b><span>All three covered but language not always clear; or two points with clear language.</span></div><div class="w1-rubric-row"><b>2</b><span>Two points with mostly unclear language; or text under 30 words.</span></div><div class="w1-rubric-row"><b>1</b><span>One point with unclear language; or text under 20 words.</span></div><div class="w1-rubric-row"><b>0</b><span>No recognisable connection to the task.</span></div><p class="tiny muted" style="margin:13px 0 0">Paraphrased from the Berlin 2026 MSA English marking scheme (Writing Part 1). This panel is guidance, not an automatic score.</p></div></aside></div></section>`,'writing');
    const btn=document.querySelector('#w1-copy');
    btn?.addEventListener('click',async()=>{
      try{await navigator.clipboard.writeText(attempt.text);APP.querySelector('#w1-copy-note').textContent='Your response was copied.';}
      catch(_){APP.querySelector('#w1-copy-note').textContent='Copy is not available here. Select the writing above and copy it manually.';}
    });
  }

  function w1ExamPrompt() {
    return `<div class="w1-exam-instructions"><h2>Writing Part 1: Your Photo</h2><ul><li>You have posted this photo.</li><li>Your friend James wants to know more.</li><li>Answer his questions.</li><li>Write <strong>30–50 words.</strong></li></ul></div>`;
  }
  function w1ExamPhoto(level) {
    return `<figure class="w1-photo"><img src="${level.photo}" alt="${e(level.alt)}" loading="eager">${w1PhotoCaption()}</figure>`;
  }
  function w1ExamLevelPage(n) {
    const level=w1ExamPhotos[n],draft=w1AnyDraft(level.id),last=w1AnyLast(level.id);
    if(!level)return notFound();
    const url=`#/writing/part-1/level-${n}`;
    shell(pageHero([['Home','#/home'],['Writing','#/writing'],['Part 1','#/writing/part-1'],[`Level ${n}`,url]],`Writing Part 1 · Level ${n}`,level.title,`${level.label} · One photo · 30–50 words · 5 marks`)+
      `<section class="section w1-section"><div class="container"><div class="w1-intro-bar"><div><div class="eyebrow">LEVEL ${n} · ${e(level.label).toUpperCase()}</div><strong>Write your own response. No sentence starters.</strong><p>The challenge is to make a believable story, not to write more than the exam requires.</p></div><div class="w1-mark-pill">/ 5 marks</div></div>
      <div class="w1-grid"><aside class="w1-visual-col"><div class="w1-sticky">${w1ExamPhoto(level)}<div class="w1-chat"><div class="w1-chat-head"><span class="w1-avatar">J</span><div><strong>James</strong><small>Your friend · Messaging you</small></div></div><div class="w1-post">You posted this photo. James wants to know more.</div><div class="w1-bubble">Wow, where did you take that photo?<br><br>Who are they?<br><br>What's going on?</div></div></div></aside>
      <div class="w1-main-col"><div class="w1-exam-sheet">${w1ExamPrompt()}<div class="w1-exam-writing"><label class="w1-textarea-label" for="w1-exam-response">Your reply to James</label><textarea id="w1-exam-response" spellcheck="true" rows="10" placeholder="Write your 30–50-word response here …">${e(draft.text||'')}</textarea><div class="w1-wordrow"><span id="w1-exam-count" aria-live="polite">0 words</span><span class="w1-range" id="w1-exam-range">Aim for 30–50 words</span></div><div class="w1-word-track"><span id="w1-exam-meter"></span></div><p class="w1-autosave">${localSavingAvailable?'Draft saved on this device as you write.':'Storage is unavailable. Copy your response before closing the tab.'}</p></div><div class="w1-exam-footer"><button type="button" class="button primary" id="w1-exam-submit">Submit and review →</button>${last?`<a href="${url}/feedback" class="button secondary">Previous feedback</a>`:''}<span class="w1-mark-pill">/ 5 P</span></div><p id="w1-exam-warning" class="tiny" role="alert" aria-live="polite"></p></div><div class="w1-photo-tip w1-exam-tip"><strong>After submission:</strong> Compare your answer with the marking criteria and one possible model. The site does not award an automatic writing mark.</div></div></div></div></section>`,'writing');
    const textarea=APP.querySelector('#w1-exam-response');
    const save=()=>{store.drafts[level.id]={text:textarea.value};saveStore();};
    const count=()=>{
      const n=w1WordCount(textarea.value),meter=APP.querySelector('#w1-exam-meter'),lab=APP.querySelector('#w1-exam-range');
      APP.querySelector('#w1-exam-count').textContent=`${n} word${n===1?'':'s'}`;
      meter.style.width=Math.min(100,n/50*100)+'%';meter.className=n>=30&&n<=50?'good':n>50?'over':'';
      lab.className='w1-range '+(n>=30&&n<=50?'good':'needs-work');
      lab.textContent=n<30?`${30-n} more word${30-n===1?'':'s'} to reach 30`:n>50?`${n-50} word${n-50===1?'':'s'} over the limit`:'Within the 30–50-word range';
    };
    textarea.addEventListener('input',()=>{save();count();});count();
    APP.querySelector('#w1-exam-submit').addEventListener('click',()=>{
      const text=textarea.value.trim();
      if(!text){APP.querySelector('#w1-exam-warning').textContent='Write a reply before submitting.';textarea.focus();return;}
      save();const attempt={at:new Date().toISOString(),text,wordCount:w1WordCount(text),checks:{where:false,who:false,what:false,clear:false}};
      store.attempts[level.id] ||= [];store.attempts[level.id].push(attempt);saveStore();routeTo(url+'/feedback');
    });
  }
  function w1ExamFeedback(n) {
    const level=w1ExamPhotos[n],attempt=w1AnyLast(level.id),url=`#/writing/part-1/level-${n}`;
    if(!attempt){routeTo(url);return;}
    const wordCount=attempt.wordCount;
    const words=wordCount<20?'Your answer is under 20 words. The official rubric gives a very-short-response descriptor at this length.':wordCount<30?'Your answer is under 30 words. The official rubric includes a lower-band descriptor for answers shorter than 30 words.':wordCount>50?'Your answer is over the 50-word limit. Edit it down to the requested length.':'Your answer is within the exam’s 30–50-word range.';
    const marks=[[5,'All three points especially well covered; consistently clear English.'],[4,'All three points covered well; language mostly clear.'],[3,'All three points covered but meaning sometimes unclear; OR two points clearly covered.'],[2,'Two points covered but language mostly unclear; OR shorter than 30 words.'],[1,'One point covered and unclear; OR much too short (under 20 words).'],[0,'No recognisable link to the task.']];
    shell(pageHero([['Home','#/home'],['Writing','#/writing'],['Part 1','#/writing/part-1'],[`Level ${n}`,url],['Feedback',url+'/feedback']],`Writing Part 1 · Level ${n}`,'Review your writing','First check your three content points. Then compare your response with a model and the five-point rubric.')+
      `<section class="section w1-section"><div class="container w1-results-layout"><div>
        <div class="panel w1-result-panel"><div class="eyebrow">YOUR RESPONSE · ${e(dateText(attempt.at))}</div><div class="w1-result-head"><h2>My message to James</h2><span class="w1-count-pill ${wordCount>=30&&wordCount<=50?'good':''}">${wordCount} words</span></div><blockquote>${e(attempt.text)}</blockquote><div class="w1-word-feedback ${wordCount>=30&&wordCount<=50?'good':'needs-work'}">${e(words)}</div><p class="w1-teacher-note"><strong>To receive a score out of 5, share your writing with your teacher.</strong> This website provides practice feedback only.</p></div>
        <div class="panel w1-result-panel"><div class="eyebrow">REFLECT AFTER WRITING</div><h2>How well did you answer James?</h2><p class="muted">Tick a point only if you actually included it. Your answers are not assessed automatically.</p><div class="w1-checks">${[['where','I explained where the photo was taken or where it comes from.'],['who','I identified who the people are.'],['what','I described what is happening in the scene.'],['clear','My English is clear and my details are believable.']].map(([k,label])=>`<label class="w1-check"><input type="checkbox" data-w1-exam-check="${k}" ${attempt.checks?.[k]?'checked':''}><span>${e(label)}</span></label>`).join('')}</div><div id="w1-exam-reflection" class="w1-suggestion" aria-live="polite"></div></div>
        <div class="panel w1-result-panel"><div class="eyebrow">MODEL RESPONSE</div><h2>One believable version</h2><p class="muted">There is no single correct story. Check your own answer before opening the model.</p><details class="w1-model-disclosure"><summary>Show an example response</summary><div class="w1-model-text">${e(level.model)}</div><p class="tiny muted" style="margin:11px 0 0">${e(level.modelNote)} · ${w1WordCount(level.model)} words</p></details></div>
        <div class="w1-review-actions"><a href="${url}" class="button primary">Improve my response →</a>${n<3?`<a href="#/writing/part-1/level-${n+1}" class="button secondary">Try Level ${n+1} →</a>`:''}<a href="#/writing/part-1" class="button subtle-btn">All writing levels</a></div>
        </div><aside><div class="path-summary"><div class="label">Your writing practice</div><strong>${w1AnyAttempts(level.id).length} review${w1AnyAttempts(level.id).length===1?'':'s'} completed</strong><p class="tiny" style="margin:12px 0">This is formative feedback, not an official or AI-generated exam grade.</p></div><div class="panel w1-rubric"><h3>The official 2026 MSA rubric · /5</h3><p class="muted">The three assessed details are <strong>where, who and what</strong>. Any coherent interpretation of a photo is acceptable.</p>${marks.map(([mark,desc])=>`<div class="w1-rubric-row"><b>${mark}</b><span>${e(desc)}</span></div>`).join('')}<p class="tiny muted" style="margin:13px 0 0">Based on Berlin MSA English 2026, Writing Part 1. This rubric requires a human judgement of content and clarity. Word count and self-ticks are not a numerical grade.</p></div></aside></div></section>`,'writing');
    const feedback=APP.querySelector('#w1-exam-reflection');
    const updateReflection=()=>{
      const chk=attempt.checks||{},missing=[['where','where the photo was taken'],['who','who the people are'],['what','what is happening']].filter(([k])=>!chk[k]).map(x=>x[1]);
      feedback.textContent=missing.length?`To strengthen your response, check whether you explained ${missing.join(', ')}. If a point is already there, tick it above.`:'You have marked all three content points. Now read your answer aloud: is each point clear and believable?';
    };
    APP.querySelectorAll('[data-w1-exam-check]').forEach(box=>box.addEventListener('change',()=>{attempt.checks[box.dataset.w1ExamCheck]=box.checked;saveStore();updateReflection();}));
    updateReflection();
  }
  // Writing Part 2 — guided + two independent exam-style discussion replies; browser-local saving.
  const W2_ID = 'w2-creative-afternoon-level-1';
  const W2_GROUPS = [
    {key:'activity', label:'1 · Your activity', prompt:'What would students do?', options:[
      {id:'drama', label:'Drama', plan:'Drama: rehearse and perform short scenes', starter:'I would choose a drama workshop where students could rehearse and perform short scenes.'},
      {id:'photography', label:'Photography', plan:'Photography: make a school exhibition', starter:'I would suggest photography, so students could take pictures and organise a school exhibition.'},
      {id:'music', label:'Music', plan:'Music: write and record songs', starter:'I would choose a music workshop where students could write songs and record them together.'},
      {id:'garden', label:'School garden', plan:'Gardening: grow plants together', starter:'Our school could offer gardening, and students could grow plants and look after them together.'}
    ]},
    {key:'personal', label:'2 · Your benefit', prompt:'How could it help you?', options:[
      {id:'confidence', label:'Confidence', plan:'Become more confident when speaking or performing', starter:'Personally, it could make me more confident because I would practise sharing my ideas.'},
      {id:'skills', label:'Useful skills', plan:'Learn skills for projects outside school', starter:'For me, the main advantage is learning practical skills that I can use outside school.'},
      {id:'friends', label:'New friends', plan:'Meet students from other classes', starter:'I could get to know students from other classes and make new friends by working with them.'},
      {id:'relax', label:'Less stress', plan:'Relax and enjoy a different activity', starter:'It would give me a chance to relax after difficult lessons and try something enjoyable.'}
    ]},
    {key:'community', label:'3 · School benefit', prompt:'Why could this help others?', options:[
      {id:'teamwork', label:'Teamwork', plan:'Students from different classes work together', starter:'For the school community, it could improve teamwork because students from different classes would cooperate.'},
      {id:'showcase', label:'School events', plan:'Invite families to see work and performances', starter:'The whole school could benefit from events where families see the students’ projects and performances.'},
      {id:'belonging', label:'Belonging', plan:'Quieter students can show their talents', starter:'It could help quieter students feel included and give everyone a chance to show their talents.'},
      {id:'schoolspace', label:'Better school', plan:'Create a more welcoming school environment', starter:'Students might make the school a more welcoming place by creating or improving something together.'}
    ]},
    {key:'problem', label:'4 · Possible problem', prompt:'What might go wrong?', options:[
      {id:'time', label:'Lesson time', plan:'Regular lessons might be missed', starter:'However, losing time for regular subjects could be a problem, so the school would need a careful timetable.'},
      {id:'cost', label:'Costs', plan:'Materials and equipment may be expensive', starter:'One problem is the cost of materials, but we could begin with simple activities and donated equipment.'},
      {id:'places', label:'Limited places', plan:'Some clubs may fill up quickly', starter:'A difficulty might be that popular clubs have limited places, so students could take turns.'},
      {id:'staff', label:'Not enough adults', plan:'Activities need enough adults to supervise', starter:'There might not be enough teachers to supervise every activity, so planning would be important.'}
    ]}
  ];
  const W2_MODEL = 'Hi schooltalker, I think a Creative Afternoon could be a great idea. I would choose drama, because students could practise short scenes and perform them for their classmates. I sometimes get nervous when speaking in public, so this could help me become more confident. It might also bring students from different classes together and improve teamwork across the school. However, we could lose time for important subjects. The school should organise the timetable carefully and perhaps try the idea for one term first. Overall, I would support it because learning is not only about textbooks. It could also help students discover talents they did not know they had.';
  const W2_EXAMS = {
    2: {
      id:'w2-later-start-level-2',
      title:'A Later Start for School?',
      label:'Practise like the exam',
      forum:'Student Voices', category:'School Life · Discussion',
      author:'clockwatcher',
      post:'Our school council is discussing whether lessons should start at 9 a.m. instead of 8 a.m. Supporters say teenagers might be less tired, but some parents think changing the timetable would cause problems. What is your opinion?',
      questions:[
        'Would you support starting school one hour later? Why or why not?',
        'How might a later start affect your own morning routine?',
        'What advantages could a later start have for learning at school?',
        'What practical problem could the change cause for students or families?'
      ],
      review:[
        'I gave my opinion about a later starting time and explained why.',
        'I explained how it would affect my own morning routine.',
        'I explained at least one benefit for learning at school.',
        'I explained a practical problem for students or families.'
      ],
      model:'Hi clockwatcher, I would support starting school at nine rather than eight because many students arrive tired. At the moment, I have to get up before six thirty to catch the bus, so an extra hour would make my mornings less stressful. I could eat breakfast properly and arrive ready to concentrate. I also think teachers might benefit because students would be more alert, especially in the first lesson. However, some parents leave for work early and might find it difficult to organise transport or care for younger children. The school would also need to decide whether lessons should finish later. I would suggest testing the new timetable for one month and asking students and families for feedback before making a final decision.'
    },
    3: {
      id:'w2-ai-homework-level-3',
      title:'AI and Homework: Help or Shortcut?',
      label:'Take the challenge',
      forum:'Student Voices', category:'Learning & Technology · Discussion',
      author:'nextgenstudent',
      post:'More students are using AI tools to explain ideas, plan essays or check their writing. Some teachers think these tools support independent learning. Others worry that students could submit work they do not understand. Our school is considering rules for AI-assisted homework. What should those rules be?',
      questions:[
        'Describe one way students could use AI responsibly for homework.',
        'How might this help students learn more independently?',
        'What is one important concern teachers might have about AI-assisted work?',
        'Suggest a fair school rule for AI use and explain why it would help.'
      ],
      review:[
        'I described a specific, responsible way to use AI for homework.',
        'I explained how this could help students learn independently.',
        'I explained a concern teachers might have.',
        'I suggested a fair rule and explained why it could work.'
      ],
      model:'Hi nextgenstudent, I think students should be allowed to use AI to understand difficult homework, but not to have whole assignments written for them. For example, if I do not understand a science topic, I could ask for a simpler explanation and then answer the questions myself. This might help learners who are shy about asking for help, especially when they study at home. However, teachers could find it difficult to know whether a student’s work shows their own understanding. Some students might also trust incorrect information. My suggested rule is that students must write their own final answers and mention when they have used an AI tool. Teachers could sometimes ask students to explain their reasoning in class. That would make the rules fair and keep learning important.'
    }
  };
  const W2_ALL_IDS = [W2_ID, W2_EXAMS[2].id, W2_EXAMS[3].id];
  function w2AnyDraft(id) {
    const d=store.drafts[id];
    return (d && typeof d==='object' && !Array.isArray(d))?d:{text:''};
  }
  function w2AnyAttempts(id) { return Array.isArray(store.attempts[id])?store.attempts[id]:[]; }
  function w2AnyLatest(id) { return w2AnyAttempts(id).at(-1); }
  function w2Count(text) { return String(text||'').trim().split(/\s+/).filter(Boolean).length; }
  function w2Draft(){
    const d=store.drafts[W2_ID];
    return (d && typeof d==='object' && !Array.isArray(d))?d:{ideas:{},text:''};
  }
  function w2Attempts(){ return Array.isArray(store.attempts[W2_ID])?store.attempts[W2_ID]:[]; }
  function w2Latest(){ return w2Attempts().at(-1); }
  function w2Selected(ideas,g) {return g.options.find(o=>o.id===ideas?.[g.key]);}
  function w2PartPage(){
    const latest=w2Latest(), draft=w2Draft();
    shell(pageHero([['Home','#/home'],['Writing','#/writing'],['Part 2','#/writing/part-2']],'Writing · Part 2','Reply to a discussion','Read a post, give reasons and respond to four questions. The exam asks for at least 100 words.')+
     `<section class="section w2-section"><div class="container"><div class="w2-level-grid">
      <article class="w2-level-card w2-level-ready"><span class="w2-level-index">01</span><div class="eyebrow">LEARN WITH CLUES</div><h2>A Creative Afternoon at School?</h2><p>Choose ideas, build a short draft and finish it in your own words.</p><div class="w2-card-bottom"><span class="w2-tag">Guided · 100+ words</span><a class="button primary small" href="#/writing/part-2/level-1">${latest?'Try again':draft.text?'Continue draft':'Start writing'} →</a></div></article>
      ${[2,3].map(n=>{const task=W2_EXAMS[n],a=w2AnyLatest(task.id),d=w2AnyDraft(task.id);return `<article class="w2-level-card w2-level-ready ${n===3?'w2-level-challenge':''}"><span class="w2-level-index">0${n}</span><div class="eyebrow">${n===2?'PRACTISE LIKE THE EXAM':'TAKE THE CHALLENGE'}</div><h2>${e(task.title)}</h2><p>${n===2?'Independent response. No idea bank or sentence starters.':'Explain different viewpoints and propose a reasoned solution.'}</p><div class="w2-card-bottom"><span class="w2-tag">100+ words · /10 marks</span><a class="button ${n===3?'secondary':'primary'} small" href="#/writing/part-2/level-${n}">${d.text?'Continue draft':a?'Try again':'Start writing'} →</a></div></article>`;}).join('')}
      </div><div class="w2-short-note"><strong>MSA format:</strong> Answer all four questions · at least 100 words · 5 marks for content + 5 for language · teacher assessed</div>
     </div></section>`,'writing');
  }
  function w2LevelPage(){
    const draft=w2Draft(), ideas=draft.ideas||{}, chosen=W2_GROUPS.filter(g=>w2Selected(ideas,g)).length;
    shell(pageHero([['Home','#/home'],['Writing','#/writing'],['Part 2','#/writing/part-2'],['Level 1','#/writing/part-2/level-1']],'Writing Part 2 · Level 1','A Creative Afternoon at School?','Choose ideas, put them together and write a reply of at least 100 words.')+
      `<section class="section w2-section"><div class="container"><div class="w2-headline"><span><strong>YOUR TASK</strong> · Online discussion reply</span><span>100+ words &nbsp;·&nbsp; /10 marks</span></div>
      <div class="w2-page-grid">
       <div class="w2-left">
        <article class="w2-chat"><div class="w2-chat-top"><span class="w2-forum-icon">✎</span><div><strong>Student Voices</strong><small>School Life · Discussion</small></div></div><div class="w2-author"><span class="w2-forum-avatar">S</span> <strong>schooltalker</strong></div><p>Our school might introduce a <strong>Creative Afternoon</strong> every week. Students could choose drama, music, photography, gardening or other activities. Some teachers like the idea, but others worry about lesson time. What do you think?</p><ol class="w2-questions"><li>What activity would you choose, and what would students do?</li><li>How could it benefit you personally?</li><li>Why could it be good for the school community?</li><li>What might be one problem?</li></ol><div class="w2-post-foot">Reply to all four questions · Write at least 100 words</div></article>
        <aside class="w2-exam-tip"><strong>Exam tip</strong><p>Give a reason or an example for each point. A list of four short answers is not enough.</p></aside>
       </div>
       <div class="w2-right">
        <section class="w2-plan-card"><div class="w2-panel-title"><div><span class="w2-step-pill">01</span><h2>Pick your ideas</h2></div><span class="w2-subtle" id="w2-selection-count">${chosen}/4 selected</span></div>
         <div class="w2-choice-grid">${W2_GROUPS.map(g=>`<div class="w2-choice-box"><div class="w2-choice-title">${e(g.label)}</div><div class="w2-choice-sub">${e(g.prompt)}</div><div class="w2-chips">${g.options.map(o=>`<button type="button" class="w2-chip ${ideas[g.key]===o.id?'selected':''}" data-w2-group="${e(g.key)}" data-w2-pick="${e(o.id)}" aria-pressed="${ideas[g.key]===o.id?'true':'false'}">${e(o.label)}</button>`).join('')}</div></div>`).join('')}</div>
         <div class="w2-plan-bottom"><button type="button" class="button primary small" id="w2-build" ${chosen!==4?'disabled':''}>Use my ideas ↓</button><p id="w2-plan-status" aria-live="polite">Choose one idea for each question.</p></div>
        </section>
        <section class="w2-compose-card" id="w2-composer"><div class="w2-panel-title"><div><span class="w2-step-pill">02</span><h2>Write your reply</h2></div><span class="w2-word-status" id="w2-word-badge">${w2Count(draft.text||'')} words</span></div>
        <p class="w2-compose-lead">Use the ideas as a starting point. <strong>Add your own example and write naturally.</strong></p>
        <label class="w2-editor-label" for="w2-editor">Your message to schooltalker</label><textarea id="w2-editor" class="w2-editor" spellcheck="true" placeholder="Hi schooltalker, I think ...">${e(draft.text||'')}</textarea>
        <div class="w2-length"><div class="w2-length-line"><span id="w2-length-label">Minimum: 100 words</span><span id="w2-length-number">${w2Count(draft.text||'')} / 100</span></div><div class="w2-track"><span id="w2-meter" style="width:${Math.min(100,w2Count(draft.text||''))}%"></span></div></div>
        <div class="w2-editor-actions"><div class="w2-autosave">Saved in this browser</div><button type="button" id="w2-submit" class="button primary" ${w2Count(draft.text||'')<100?'disabled':''}>Review my writing →</button></div>
        </section>
       </div>
      </div></div></section>`,'writing');
    APP.querySelectorAll('[data-w2-group]').forEach(button=>button.addEventListener('click',()=>{
      const group=button.dataset.w2Group,id=button.dataset.w2Pick;
      const d=w2Draft(), next={...d,ideas:{...(d.ideas||{}),[group]:id}};
      store.drafts[W2_ID]=next;saveStore();
      APP.querySelectorAll(`[data-w2-group="${group}"]`).forEach(btn=>{
        const yes=btn.dataset.w2Pick===id;btn.classList.toggle('selected',yes);btn.setAttribute('aria-pressed',String(yes));
      });
      const n=W2_GROUPS.filter(g=>w2Selected(next.ideas,g)).length;
      document.getElementById('w2-selection-count').textContent=`${n}/4 selected`;
      document.getElementById('w2-build').disabled=n<4;
      document.getElementById('w2-plan-status').textContent=n===4?'Ready! Add the ideas to your reply.':'Choose one idea for each question.';
    }));
    const editor=document.getElementById('w2-editor');
    const updateCounter=()=>{
      const n=w2Count(editor.value),ready=n>=100;
      const badge=document.getElementById('w2-word-badge');badge.textContent=`${n} words`;badge.classList.toggle('good',ready);
      document.getElementById('w2-length-number').textContent=`${n} / 100`;
      document.getElementById('w2-meter').style.width=Math.min(100,n)+'%';
      document.getElementById('w2-length-label').textContent=ready?'Minimum reached — review your ideas':'Minimum: 100 words';
      document.getElementById('w2-submit').disabled=!ready;
    };
    editor.addEventListener('input',()=>{const d=w2Draft();d.text=editor.value.slice(0,9000);store.drafts[W2_ID]=d;saveStore();updateCounter();});
    updateCounter();
    document.getElementById('w2-build').addEventListener('click',()=>{
      const d=w2Draft(),parts=W2_GROUPS.map(g=>w2Selected(d.ideas,g));if(parts.some(x=>!x))return;
      if(editor.value.trim()&&!window.confirm('Replace your current text with the selected ideas?'))return;
      const text=['Hi schooltalker,',parts[0].starter,parts[1].starter,parts[2].starter,parts[3].starter,'I also think ... because ...','Overall, my opinion is ...'].join('\n\n');
      editor.value=text;d.text=text;store.drafts[W2_ID]=d;saveStore();updateCounter();
      document.getElementById('w2-plan-status').textContent='Ideas added. Replace the dots and give your own reasons.';
      editor.focus();
    });
    document.getElementById('w2-submit').addEventListener('click',()=>{
      const text=editor.value.trim(),n=w2Count(text);
      if(n<100){editor.focus();return;}
      const attempt={at:new Date().toISOString(),text:text.slice(0,9000),wordCount:n,ideas:{...(w2Draft().ideas||{})},checks:{}};
      store.attempts[W2_ID]||=[];store.attempts[W2_ID].push(attempt);store.attempts[W2_ID]=store.attempts[W2_ID].slice(-15);
      delete store.drafts[W2_ID];saveStore();routeTo('#/writing/part-2/level-1/feedback');
    });
  }
  function w2FeedbackPage(){
    const a=w2Latest();if(!a){routeTo('#/writing/part-2/level-1');return;}
    const checks=[['activity','I described an activity and what students would do.'],['personal','I explained how the activity could help me.'],['community','I explained a benefit for the school community.'],['problem','I explained a possible problem.']];
    shell(pageHero([['Home','#/home'],['Writing','#/writing'],['Part 2','#/writing/part-2'],['Level 1','#/writing/part-2/level-1'],['Feedback','#/writing/part-2/level-1/feedback']],'Writing Part 2 · Feedback','Your writing review','Check all four points, then give your teacher your response for an official score.')+
    `<section class="section w2-section"><div class="container w2-feedback-layout"><div class="w2-review-main"><article class="panel w2-review-panel"><div class="w2-panel-title"><div><span class="w2-step-pill">✓</span><h2>Your reply</h2></div><span class="w2-word-status good">${a.wordCount} words</span></div><div class="w2-student-text">${e(a.text)}</div><p class="w2-review-note"><strong>For a score out of 10, share this writing with your teacher.</strong> This website checks your word count and your own review, not your grammar or mark.</p><div class="w2-feedback-actions"><button type="button" id="w2-copy" class="button secondary small">Copy for teacher</button><a class="button primary small" href="#/writing/part-2/level-1">Try again →</a><a class="button subtle-btn small" href="#/writing/part-2">All levels</a></div><span class="w2-copied" id="w2-copied" role="status"></span></article>
     <article class="panel w2-review-panel"><h2>Check the four points</h2><p class="w2-small">Tick what you included. If something is missing, try again and add it.</p>${checks.map(([k,lab])=>`<label class="w2-check-row"><input type="checkbox" data-w2-review="${k}" ${a.checks?.[k]?'checked':''}/><span>${e(lab)}</span></label>`).join('')}<p class="w2-check-result" id="w2-check-result"></p></article></div>
     <aside class="w2-feedback-aside"><div class="w2-marking"><h3>How it is marked</h3><div class="w2-mark-grid"><div><strong>5</strong><span>Content</span></div><div><strong>5</strong><span>Language</span></div></div><p>Relevant answers to all four questions; clear explanations, organisation and appropriate English.</p><p class="w2-fineprint">The official task asks for at least 100 words. Very short writing can limit your mark.</p></div><details class="w2-model"><summary>See a model reply</summary><p>${e(W2_MODEL)}</p><p class="w2-small">Example only — many different answers are possible.</p></details></aside>
     </div></section>`,'writing');
    const update=()=>{const n=checks.filter(([k])=>a.checks?.[k]).length;document.getElementById('w2-check-result').textContent=`${n} of 4 content points checked. ${n===4?'Read it aloud and check your language.':'Review your response and include the missing points.'}`;};
    APP.querySelectorAll('[data-w2-review]').forEach(box=>box.addEventListener('change',()=>{a.checks[box.dataset.w2Review]=box.checked;saveStore();update();}));update();
    document.getElementById('w2-copy').addEventListener('click',async()=>{
      const msg=document.getElementById('w2-copied');
      try { await navigator.clipboard.writeText(a.text);msg.textContent='Copied! Paste it into a message to your teacher.';}
      catch(_){msg.textContent='Select the response above and copy it to share with your teacher.';}
    });
  }

  function w2ExamPage(level) {
    const task=W2_EXAMS[level]; if(!task)return;
    const draft=w2AnyDraft(task.id), wordCount=w2Count(draft.text||'');
    const path=`#/writing/part-2/level-${level}`;
    shell(pageHero([['Home','#/home'],['Writing','#/writing'],['Part 2','#/writing/part-2'],[`Level ${level}`,path]],`Writing Part 2 · Level ${level}`,task.title,level===2?'Read the discussion and write your own response.':'Think critically, give reasons and offer a workable suggestion.')+
      `<section class="section w2-section"><div class="container"><div class="w2-headline"><span><strong>${level===2?'EXAM-STYLE PRACTICE':'TAKE THE CHALLENGE'}</strong> · Online discussion</span><span>At least 100 words · /10 marks</span></div>
        <div class="w2-page-grid w2-exam-layout">
        <div class="w2-left"><article class="w2-chat"><div class="w2-chat-top"><span class="w2-forum-icon">✎</span><div><strong>${e(task.forum)}</strong><small>${e(task.category)}</small></div></div>
          <div class="w2-author"><span class="w2-forum-avatar">${e(task.author.charAt(0).toUpperCase())}</span> <strong>${e(task.author)}</strong></div>
          <p>${e(task.post)}</p><ol class="w2-questions">${task.questions.map(q=>`<li>${e(q)}</li>`).join('')}</ol>
          <div class="w2-post-foot">Reply to all four questions · Write at least 100 words</div></article></div>
        <div class="w2-right"><section class="w2-compose-card"><div class="w2-panel-title"><div><span class="w2-step-pill">✎</span><h2>Your response</h2></div><span id="w2e-count" class="w2-word-status ${wordCount>=100?'good':''}">${wordCount} words</span></div>
          <p class="w2-compose-lead">Write a connected reply with reasons and examples. All four questions should be answered.</p>
          <label class="w2-editor-label" for="w2e-editor">Reply to ${e(task.author)}</label><textarea class="w2-editor w2-exam-editor" id="w2e-editor" maxlength="9000" spellcheck="true" placeholder="Write your response here...">${e(draft.text||'')}</textarea>
          <div class="w2-length"><div class="w2-length-line"><span id="w2e-length-label">${wordCount>=100?'Minimum reached — check all four points':'Minimum: 100 words'}</span><span id="w2e-length-number">${wordCount} / 100</span></div><div class="w2-track"><span id="w2e-meter" style="width:${Math.min(wordCount,100)}%"></span></div></div>
          <div class="w2-editor-actions"><span class="w2-autosave">Draft saved in this browser</span><button type="button" id="w2e-submit" class="button primary" ${wordCount<1?'disabled':''}>Submit for self-review →</button></div><p class="w2-exam-notice" role="status" id="w2e-warning" aria-live="polite"></p></section></div>
        </div></div></section>`,'writing');
    const input=document.getElementById('w2e-editor'),submit=document.getElementById('w2e-submit');
    const refresh=()=>{
      const n=w2Count(input.value),good=n>=100;
      const badge=document.getElementById('w2e-count');badge.textContent=`${n} words`;badge.classList.toggle('good',good);
      document.getElementById('w2e-length-number').textContent=`${n} / 100`;
      document.getElementById('w2e-meter').style.width=Math.min(100,n)+'%';
      document.getElementById('w2e-length-label').textContent=good?'Minimum reached — check all four points':`Minimum: 100 words (${Math.max(0,100-n)} more to go)`;
      submit.disabled=n===0;
      document.getElementById('w2e-warning').textContent='';
    };
    input.addEventListener('input',()=>{
      store.drafts[task.id]={text:input.value.slice(0,9000)};saveStore();refresh();
    });
    submit.addEventListener('click',()=>{
      const text=input.value.trim(),count=w2Count(text);
      if(count===0)return;
      if(count<100 && !window.confirm(`You have written ${count} words. The MSA task requires at least 100. Submit anyway to see feedback?`)){
        document.getElementById('w2e-warning').textContent='Add more detail to meet the 100-word minimum.';input.focus();return;
      }
      const a={at:new Date().toISOString(),text:text.slice(0,9000),wordCount:count,checks:{}};
      store.attempts[task.id]||=[];store.attempts[task.id].push(a);store.attempts[task.id]=store.attempts[task.id].slice(-15);
      delete store.drafts[task.id];saveStore();routeTo(path+'/feedback');
    });
  }
  function w2ExamFeedback(level) {
    const task=W2_EXAMS[level];if(!task)return;
    const a=w2AnyLatest(task.id);const path=`#/writing/part-2/level-${level}`;
    if(!a){routeTo(path);return;}
    a.checks=a.checks||{};
    const checks=task.review.map((label,i)=>[String(i),label]);
    const shortNote=a.wordCount<100?`<p class="w2-review-length-warning">Your answer has ${a.wordCount} words. The MSA task asks for at least 100. Add more detail before giving it to your teacher.</p>`:'';
    shell(pageHero([['Home','#/home'],['Writing','#/writing'],['Part 2','#/writing/part-2'],[`Level ${level}`,path],['Feedback',path+'/feedback']],'Writing Part 2 · Feedback','Review your response','Check the four points. Your teacher assesses the content and language.')+
      `<section class="section w2-section"><div class="container w2-feedback-layout"><div class="w2-review-main">
        <article class="panel w2-review-panel"><div class="w2-panel-title"><div><span class="w2-step-pill">✓</span><h2>Your reply</h2></div><span class="w2-word-status ${a.wordCount>=100?'good':''}">${a.wordCount} words</span></div>
          <div class="w2-student-text">${e(a.text)}</div>${shortNote}<p class="w2-review-note"><strong>Share your writing with your teacher for a score out of 10.</strong> This website offers self-review only; it does not check grammar or award marks.</p>
          <div class="w2-feedback-actions"><button type="button" id="w2e-copy" class="button secondary small">Copy for teacher</button><a href="${path}" class="button primary small">Try again →</a><a href="#/writing/part-2" class="button subtle-btn small">All levels</a></div><span class="w2-copied" id="w2e-copied" role="status"></span></article>
        <article class="panel w2-review-panel"><h2>Check the four content points</h2><p class="w2-small">Tick only the points you explained in your reply.</p>${checks.map(([k,label])=>`<label class="w2-check-row"><input type="checkbox" data-w2e-review="${k}" ${a.checks[k]?'checked':''}><span>${e(label)}</span></label>`).join('')}<p class="w2-check-result" id="w2e-check-result"></p></article>
        </div><aside class="w2-feedback-aside"><div class="w2-marking"><h3>MSA marking</h3><div class="w2-mark-grid"><div><strong>5</strong><span>Content</span></div><div><strong>5</strong><span>Language</span></div></div><p>Answer all four questions, develop your points, and use clear, organised English appropriate for a discussion reply.</p><p class="w2-fineprint">In the official scheme, fewer than 80 words limits content to 2 marks; fewer than 50 words limits content to 1 and language to 2.</p></div>
        <details class="w2-model"><summary>Compare with a model reply</summary><p>${e(task.model)}</p><p class="w2-small">One possible answer — yours can be different.</p></details></aside>
        </div></section>`,'writing');
    const result=document.getElementById('w2e-check-result');
    const update=()=>{const count=checks.filter(([k])=>a.checks[k]).length;result.textContent=`${count}/4 content points checked. ${count===4?'Now check whether your reasons and examples are clear.':'Review the missing points and improve your reply.'}`;};
    APP.querySelectorAll('[data-w2e-review]').forEach(el=>el.addEventListener('change',()=>{a.checks[el.dataset.w2eReview]=el.checked;saveStore();update();})); update();
    document.getElementById('w2e-copy').addEventListener('click',async()=>{
      try{await navigator.clipboard.writeText(a.text);document.getElementById('w2e-copied').textContent='Copied! You can share this with your teacher.';}
      catch(_){document.getElementById('w2e-copied').textContent='Select your reply above and copy it for your teacher.';}
    });
  }

  // Writing Part 3 — Level 1: guided mediation using an original German source.
  // Content selection supports planning only: learners produce their own English email.
  const W3_ID = 'w3-first-job-level-1';
  const W3_EXAMS = window.THINKLAB_MEDIATION_EXAMS?.levels || {};

  const W3_POINTS = [
    {id:'holidays',note:'Three weeks in the summer holidays, mostly afternoons',anchor:'drei Wochen lang, meistens nachmittags'},
    {id:'tasks',note:'Took orders, served ice cream and cleaned tables',anchor:'Bestellungen auf, gab Eis aus und machte die Tische sauber'},
    {id:'mistake',note:'Felt nervous and served the wrong flavour once',anchor:'sehr nervös ... die falsche Sorte'},
    {id:'boss',note:'Her boss was friendly and explained things again',anchor:'meine Chefin freundlich und erklärte mir alles'},
    {id:'busy',note:'Hot days were busy; she needed to be quick and polite',anchor:'an heißen Tagen ... schnell arbeiten ... höflich'},
    {id:'pay',note:'Earned €8 an hour and saved for a bicycle',anchor:'acht Euro pro Stunde ... neues Fahrrad'},
    {id:'learning',note:'Became more confident and learned responsibility',anchor:'wurde ich sicherer ... Verantwortung zu übernehmen'}
  ];
  // Optional introductions link the source text to Kim's real communication purpose.
  // Students can choose one, adapt it, or write an opening entirely on their own.
  const W3_OPENINGS = [
    {
      label: 'Option A · Your topic',
      text: "Your topic about first jobs is really interesting. I recently read an article about Lena's summer job that I think could help with your presentation."
    },
    {
      label: 'Option B · I remember',
      text: "I remember you are preparing a presentation about people's first jobs. I came across an article about a girl who worked in an ice cream shop and thought of you."
    },
    {
      label: 'Option C · I found something',
      text: "You asked for ideas for your presentation, so I wanted to share an article I found about a teenager's first job."
    }
  ];
  const W3_MODEL = `Hi Kim,\n\nYour topic about first jobs sounds interesting! I recently read an article about Lena's summer job that I think could help your presentation. Lena was 16 when she worked at an ice cream shop during her summer holidays. She stayed there for three weeks and usually worked in the afternoons. Her duties included serving customers and cleaning tables. At first, she was nervous and once gave someone the wrong flavour, but her boss helped her. The shop was especially busy when it was hot, so Lena learned to work quickly and stay friendly. She earned eight euros an hour and saved for a bicycle. She says the job taught her to be responsible.\n\nHope this helps!`;
  function w3Draft() {
    const v=store.drafts[W3_ID];
    return (v && typeof v==='object' && !Array.isArray(v))?v:{points:[],text:''};
  }
  function w3Attempts() {return Array.isArray(store.attempts[W3_ID])?store.attempts[W3_ID]:[];}
  function w3Latest() {return w3Attempts().at(-1);}
  function w3ValidPoints(p) {return Array.isArray(p)?[...new Set(p.filter(v=>W3_POINTS.some(x=>x.id===v)))]:[];}
  function w3WordCount(s) {return String(s||'').trim().split(/\s+/).filter(Boolean).length;}
  function w3GermanText() {
    return `<article class="w3-source-card"><div class="w3-source-head"><span class="w3-lang">DE · German source</span><span class="w3-source-original">Original practice text</span></div>
      <h2>Lena: Mein erster Ferienjob in einer Eisdiele</h2>
      <p>Letzten Sommer habe ich mit 16 Jahren zum ersten Mal Geld verdient. Eine kleine Eisdiele in unserem Viertel suchte Hilfe für die Ferien. Ich arbeitete dort drei Wochen lang, meistens nachmittags.</p>
      <p>Meine Aufgaben waren einfach: Ich nahm Bestellungen auf, gab Eis aus und machte die Tische sauber. Am ersten Tag war ich sehr nervös, weil ich die vielen Eissorten noch nicht kannte. Einmal habe ich einem Kunden sogar die falsche Sorte gegeben. Zum Glück blieb meine Chefin freundlich und erklärte mir alles noch einmal.</p>
      <p>Besonders an heißen Tagen gab es lange Schlangen. Dann musste ich schnell arbeiten und trotzdem höflich bleiben. Nach einigen Tagen wurde ich sicherer und verstand mich gut mit meinen Kollegen.</p>
      <p>Ich bekam acht Euro pro Stunde und sparte das Geld für ein neues Fahrrad. Der Job war anstrengender als erwartet, aber ich habe gelernt, Verantwortung zu übernehmen und mit unterschiedlichen Menschen umzugehen.</p>
      <div class="w3-source-credit">Source: Original German practice text written for ThinkLab MSA Prep, 2026.</div>
      </article>`;
  }
  function w3PartPage() {
    const first=w3Latest(),d=w3Draft(),firstCount=w3ValidPoints(d.points).length;
    const other=[2,3].map(level=>{
      const task=W3_EXAMS[level],last=w3ExamLatest(level),draft=w3ExamDraft(level);
      return `<article class="w3-level-card current ${level===3?'w3-level-challenge':''}"><span class="w3-level-num">0${level}</span><div class="eyebrow">${level===2?'PRACTISE LIKE THE EXAM':'TAKE THE CHALLENGE'}</div><h2>${e(task.title)}</h2><p>Choose one of two German articles. Write an email without clues.</p><div class="w3-level-foot"><span class="w2-tag">2 articles · /10 marks</span><a class="button primary small" href="#/writing/part-3/level-${level}">${draft.choice?'Continue':last?'Try again':'Start level'} →</a></div></article>`;
    }).join('');
    shell(pageHero([['Home','#/home'],['Writing','#/writing'],['Part 3','#/writing/part-3']],'Writing · Part 3','Mediation: German → English','Choose the important information and communicate it naturally to an English-speaking reader.')+
     `<section class="section w3-section"><div class="container"><div class="w3-level-cards">
       <article class="w3-level-card current"><span class="w3-level-num">01</span><div class="eyebrow">LEARN WITH CLUES</div><h2>Lena’s first job</h2><p>Select details, then write an email to Kim with optional support.</p><div class="w3-level-foot"><span class="w2-tag">Guided email · /10 marks</span><a class="button primary small" href="#/writing/part-3/level-1">${d.text?'Continue my draft':first?'Try again':'Start level'} →</a></div></article>
       ${other}
     </div><div class="w3-endnote">${first?`Your latest guided email has ${Number(first.wordCount)} words.`:firstCount?`You selected ${firstCount} details in Level 1.`:'Choose a level to begin.'} The two later levels let you choose one article and work independently. Your drafts are saved on this device.</div></div></section>`,'writing');
  }
  function w3LevelPage() {
    const d=w3Draft(),selected=w3ValidPoints(d.points),prev=w3Latest();
    shell(pageHero([['Home','#/home'],['Writing','#/writing'],['Part 3','#/writing/part-3'],['Level 1','#/writing/part-3/level-1']],'Writing Part 3 · Level 1','Lena’s first job','Read the German story, select important facts, and explain them in your own English email.')+
      `<section class="section w3-section"><div class="container"><div class="w3-task-header"><span class="w3-task-pill">1 · Select details</span><span class="w3-task-pill">2 · Write an email</span><span class="w3-task-pill">3 · Check</span><span class="w3-exam-mark">Content /5 · Language /5</span></div>
      <div class="w3-layout"><div class="w3-left"><div class="w3-sticky">${w3GermanText()}<div class="w3-translation-note"><strong>Same meaning, natural English</strong><div><span>DE</span> Besonders an heißen Tagen gab es lange Schlangen.</div><div><span>EN</span> The shop was especially busy on hot days.</div></div></div></div>
      <div class="w3-right">
       <div class="w3-brief"><div class="w3-brief-top"><span class="w3-icon">✉</span><div><div class="eyebrow">Your task</div><h2>Send Kim an idea</h2></div></div><p>Your Irish friend Kim is preparing a presentation about people’s first jobs. You have found Lena’s story.</p><p><strong>Write an email</strong> explaining what Lena’s job was and mentioning <strong>at least four other important details</strong>. Do not translate word for word. Write complete sentences.</p></div>
       <section class="w3-card" aria-label="Step 1: Choose important information"><div class="w3-card-title"><span class="w3-step">01</span><div><h2>Pick the important details</h2><p>Kim needs to know about the job and at least four other facts.</p></div></div><div class="w3-job"><span aria-hidden="true">✓</span><div><small>What was the job?</small><strong>Lena worked in an ice cream shop during the summer.</strong></div></div><div class="w3-facts" id="w3-facts">${W3_POINTS.map(p=>`<label class="w3-fact ${selected.includes(p.id)?'chosen':''}"><input type="checkbox" data-w3-fact="${e(p.id)}" ${selected.includes(p.id)?'checked':''}><span class="w3-fact-check" aria-hidden="true">${selected.includes(p.id)?'✓':'+'}</span><span>${e(p.note)}</span></label>`).join('')}</div><div class="w3-facts-footer"><span id="w3-fact-count" aria-live="polite">${selected.length} selected · minimum 4</span><span class="w3-tag" id="w3-ready">${selected.length>=4?'Your plan is ready':'Choose four or more'}</span></div></section>
       <section class="w3-card" aria-label="Step 2: Write your email"><div class="w3-card-title"><span class="w3-step">02</span><div><h2>Write your email to Kim</h2><p>Use your selected notes as a plan. Explain the information in your own words.</p></div></div><div class="w3-email-meta"><span>TO:</span><strong>Kim</strong><span>SUBJECT:</span><strong>An idea for your presentation</strong></div><details class="w3-writing-help" id="w3-starters"><summary>Need help starting your email?</summary><div class="w3-help-body"><p class="w3-help-intro">Start by referring to Kim’s presentation and why this article might help. Pick an opening or write your own.</p><fieldset class="w3-opening-list" aria-label="Choose an email opening">${W3_OPENINGS.map((o,i)=>`<label class="w3-opening-choice"><input type="radio" name="w3-opening" value="${i}"><span class="w3-opening-copy"><strong>${e(o.label)}</strong><span>Hi Kim,</span><span>${e(o.text)}</span></span></label>`).join('')}</fieldset><div class="w3-opening-toolbar"><button type="button" class="button secondary small" id="w3-use-opening">Use this opening</button><span id="w3-opening-message" class="w3-opening-status" role="status" aria-live="polite"></span></div><p class="w3-follow-on"><strong>Then tell Kim about Lena:</strong> One thing she had to do was… / At first, she felt… / She also…</p><p class="w3-help-foot">Make the opening your own. Keep it brief so you have room for the job and four important details.</p></div></details><div class="w3-plan-preview" id="w3-selected-plan">${selected.length?`<strong>My key points:</strong> ${selected.map(id=>e(W3_POINTS.find(p=>p.id===id).note)).join(' · ')}`:'<strong>Your notes will appear here</strong> when you select them above.'}</div><label for="w3-editor" class="w3-editor-label">Your email</label><textarea id="w3-editor" class="w3-editor" maxlength="6000" spellcheck="true" placeholder="Hi Kim,&#10;&#10;I found an interesting first-job story...">${e(d.text||'')}</textarea><div class="w3-compose-footer"><span id="w3-count" aria-live="polite">${w3WordCount(d.text)} words · no fixed minimum</span><span class="w3-save">Draft saved on this device</span></div><div class="w3-actions"><button type="button" class="button primary" id="w3-submit">Check my email →</button>${prev?'<a class="button secondary small" href="#/writing/part-3/level-1/feedback">Previous feedback</a>':''}</div><div id="w3-warning" role="status" class="w3-warning"></div></section>
      </div></div></div></section>`,'writing');
    const input=document.getElementById('w3-editor');
    const saveD=()=>{const old=w3Draft();store.drafts[W3_ID]={points:w3ValidPoints(old.points),text:input.value.slice(0,6000)};saveStore();};
    const useOpening=document.getElementById('w3-use-opening');
    useOpening.addEventListener('click',()=>{
      const chosen=APP.querySelector('input[name="w3-opening"]:checked');
      const note=document.getElementById('w3-opening-message');
      if(!chosen){note.textContent='Choose an opening first, or write your own.';return;}
      const selectedOpening=W3_OPENINGS[Number(chosen.value)];
      if(!selectedOpening)return;
      // Remove only an earlier suggested opening, never any student's own sentences.
      let existing=input.value.trim();
      const previous=W3_OPENINGS.find(o=>existing.startsWith(`Hi Kim,\n\n${o.text}`));
      if(previous){existing=existing.slice(`Hi Kim,\n\n${previous.text}`.length).trimStart();}
      else if(/^Hi Kim,\s*/i.test(existing)){existing=existing.replace(/^Hi Kim,\s*/i,'').trimStart();}
      const beginning=`Hi Kim,\n\n${selectedOpening.text}`;
      const combined=beginning+(existing?'\n\n'+existing:'\n\n');
      if(combined.length>6000){note.textContent='Your draft is too long to insert an opening. Edit it manually.';return;}
      input.value=combined;
      input.dispatchEvent(new Event('input',{bubbles:true}));
      input.focus();input.setSelectionRange(beginning.length,beginning.length);
      note.textContent=existing?'Opening added; your existing writing is kept. Check for repetition.':'Opening added. Now describe Lena’s job and four more details.';
    });
    APP.querySelectorAll('[data-w3-fact]').forEach(box=>box.addEventListener('change',()=>{
      const chosen=[...APP.querySelectorAll('[data-w3-fact]:checked')].map(el=>el.dataset.w3Fact);
      APP.querySelectorAll('.w3-fact').forEach(label=>{const cb=label.querySelector('input');label.classList.toggle('chosen',cb.checked);label.querySelector('.w3-fact-check').textContent=cb.checked?'✓':'+';});
      store.drafts[W3_ID]={points:chosen,text:input.value.slice(0,6000)};saveStore();
      document.getElementById('w3-fact-count').textContent=`${chosen.length} selected · minimum 4`;
      document.getElementById('w3-ready').textContent=chosen.length>=4?'Your plan is ready':'Choose four or more';
      document.getElementById('w3-selected-plan').innerHTML=chosen.length?`<strong>My key points:</strong> ${chosen.map(id=>e(W3_POINTS.find(p=>p.id===id).note)).join(' · ')}`:'<strong>Your notes will appear here</strong> when you select them above.';
    }));
    input.addEventListener('input',()=>{saveD();document.getElementById('w3-count').textContent=`${w3WordCount(input.value)} words · no fixed minimum`;});
    document.getElementById('w3-submit').addEventListener('click',()=>{
      saveD();const text=input.value.trim(),words=w3WordCount(text),pointCount=w3ValidPoints(w3Draft().points).length;
      if(!text){document.getElementById('w3-warning').textContent='Write your email to Kim before checking it.';input.focus();return;}
      if(words<35 || pointCount<4){
        const msg=pointCount<4?'Your plan has fewer than four selected details. You can still submit if your email contains at least four details of your own.':'Your reply is quite short. Check whether you included Lena’s job and four additional details.';
        if(!window.confirm(msg+' Submit anyway?'))return;
      }
      store.attempts[W3_ID]||=[];
      store.attempts[W3_ID].push({at:new Date().toISOString(),text:text.slice(0,6000),wordCount:words,points:w3ValidPoints(w3Draft().points),checks:{}});
      store.attempts[W3_ID]=store.attempts[W3_ID].slice(-15);
      delete store.drafts[W3_ID];saveStore();routeTo('#/writing/part-3/level-1/feedback');
    });
  }
  function w3FeedbackPage() {
    const a=w3Latest();if(!a){routeTo('#/writing/part-3/level-1');return;}
    a.checks||={};
    const checklist=[
      ['job','I clearly explained that Lena worked in an ice cream shop.'],
      ['details','I included at least four other accurate details from Lena’s story.'],
      ['purpose','I selected information useful to Kim’s presentation.'],
      ['email','I wrote a personal email with complete sentences.'],
      ['mediation','I expressed the ideas naturally in English, not word for word.']
    ];
    shell(pageHero([['Home','#/home'],['Writing','#/writing'],['Part 3','#/writing/part-3'],['Level 1','#/writing/part-3/level-1'],['Feedback','#/writing/part-3/level-1/feedback']],'Writing Part 3 · Feedback','Review your email','Check whether your message gives Kim the information needed for the presentation.')+
     `<section class="section w3-section"><div class="container w3-review-layout"><div><section class="panel w3-review-panel"><div class="w3-feedback-top"><div><div class="eyebrow">Your response · ${e(dateText(a.at))}</div><h2>My email to Kim</h2></div><span class="w3-word-pill">${Number(a.wordCount)||0} words</span></div><div class="w3-student-text">${e(a.text)}</div><p class="w3-teacher-alert"><strong>For a score out of 10, share this email with your teacher.</strong> The self-check below is practice feedback, not a grade.</p><div class="w3-review-actions"><button class="button secondary small" id="w3-copy" type="button">Copy my email</button><a class="button primary small" href="#/writing/part-3/level-1">Try again →</a><a class="button subtle-btn small" href="#/writing/part-3">All levels</a></div><p id="w3-copy-status" class="w3-mini" aria-live="polite"></p></section>
     <section class="panel w3-review-panel"><div class="eyebrow">STEP 3 · CHECK</div><h2>Did you mediate the information?</h2><p class="w3-muted">Tick each point only if you can find it in your email. You can return and improve your response.</p>${checklist.map(([id,txt])=>`<label class="w3-check"><input type="checkbox" data-w3-check="${id}" ${a.checks[id]?'checked':''}><span>${e(txt)}</span></label>`).join('')}<p class="w3-check-result" id="w3-check-result" aria-live="polite"></p></section></div>
     <aside><div class="w2-marking w3-marking"><h3>How your teacher marks it</h3><div class="w2-mark-grid"><div><strong>5</strong><span>Content</span></div><div><strong>5</strong><span>Language</span></div></div><p>Content: clearly identify the job and at least four other relevant details. Language: a clear, natural English email suited to Kim.</p><p class="w2-fineprint">There is no fixed word-count minimum for this MSA mediation task. Accuracy and relevance matter.</p></div><details class="w2-model w3-model"><summary>Compare with a model email</summary><div class="w3-model-text">${e(W3_MODEL)}</div><p>One possible answer. Other accurate and clear emails are equally acceptable.</p></details></aside>
     </div></section>`,'writing');
    const update=()=>{const n=checklist.filter(([id])=>a.checks[id]).length;document.getElementById('w3-check-result').textContent=`${n} of ${checklist.length} points checked.${n===5?' Read your email once more for clarity.':' Review any missing points before giving it to your teacher.'}`;};
    APP.querySelectorAll('[data-w3-check]').forEach(cb=>cb.addEventListener('change',()=>{a.checks[cb.dataset.w3Check]=cb.checked;saveStore();update();}));update();
    document.getElementById('w3-copy').addEventListener('click',async()=>{
      try{await navigator.clipboard.writeText(a.text);document.getElementById('w3-copy-status').textContent='Copied. You can paste the email into a message to your teacher.';}
      catch(_){document.getElementById('w3-copy-status').textContent='Select your response above and copy it to share with your teacher.';}
    });
  }
  // Writing Part 3 — independent Levels 2 and 3. The German passages have no internal subheadings.
  function w3ExamTask(level) {return W3_EXAMS[level];}
  function w3ExamDraft(level) {
    const id=w3ExamTask(level).id;
    const raw=store.drafts[id]||{};
    return {choice:['A','B'].includes(raw.choice)?raw.choice:'',texts:{A:String(raw.texts?.A||''),B:String(raw.texts?.B||'')}};
  }
  function w3ExamAttempts(level) {return getAttempts(w3ExamTask(level).id);}
  function w3ExamLatest(level) {return latestAttempt(w3ExamTask(level).id);}
  function w3ExamPage(level) {
    const task=w3ExamTask(level),draft=w3ExamDraft(level),choice=draft.choice;
    const article=choice?task.articles[choice]:null,previous=w3ExamLatest(level);
    const source=article?`<article class="w3-source-card w3-exam-article"><div class="w3-source-head"><span class="w3-lang">TEXT ${choice} · DE</span><span class="w3-source-original">German source text</span></div>
        <h2>${e(article.title)}</h2>${article.paragraphs.map(p=>`<p>${e(p)}</p>`).join('')}
        <div class="w3-source-credit">Quelle: ${e(article.credit)} <a href="${e(article.url)}" target="_blank" rel="noopener noreferrer">Originalquelle ↗</a></div></article>`:
        `<div class="w3-source-card w3-no-choice"><span class="w3-lang">TEXT A ODER B</span><h2>Choose a text to read</h2><p>Read one of the two articles and use it to help Kim. You only need to write about one text.</p></div>`;
    shell(pageHero([['Home','#/home'],['Writing','#/writing'],['Part 3','#/writing/part-3'],[`Level ${level}`,`#/writing/part-3/level-${level}`]],`Writing · Part 3 · Level ${level}`,task.title,`${task.subtitle} · Read one German article and mediate the useful information.`)+
      `<section class="section w3-section"><div class="container"><div class="w3-task-header"><span class="w3-task-pill">1 · Choose a text</span><span class="w3-task-pill">2 · Write your email</span><span class="w3-task-pill">3 · Review</span><span class="w3-exam-mark">Content /5 · Language /5</span></div>
      <div class="w3-layout w3-exam-layout"><div class="w3-left"><div class="w3-sticky"><div class="w3-article-selector" role="group" aria-label="Choose one German article"><p>Choose Text A or Text B</p><div class="w3-article-tabs">${['A','B'].map(k=>`<button type="button" class="w3-article-tab ${choice===k?'selected':''}" data-w3-exam-choice="${k}" aria-pressed="${choice===k}"><span>Text ${k}</span><strong>${e(task.articles[k].title)}</strong></button>`).join('')}</div></div>${source}</div></div>
      <div class="w3-right"><div class="w3-brief"><div class="w3-brief-top"><span class="w3-icon" aria-hidden="true">✉</span><div><div class="eyebrow">Your task</div><h2>Write to Kim</h2></div></div><p>${e(task.scenario)}</p><ul class="w3-exam-instructions"><li>Read the two German articles. <strong>Choose one.</strong></li><li>Write an email to Kim explaining ${e(task.mainLabel)}.</li><li>Include ${e(task.detailsLabel)}.</li><li>Do not translate word for word. Write complete sentences.</li></ul></div>
      <section class="w3-card w3-exam-compose" aria-label="Write an exam-style mediation email"><div class="w3-card-title"><span class="w3-step">✎</span><div><h2>Your email</h2><p>${choice?`Using Text ${choice}`:'Choose Text A or B to begin'} · No writing clues at this level.</p></div></div><div class="w3-email-meta"><span>TO:</span><strong>Kim</strong><span>SUBJECT:</span><strong>${e(task.subject)}</strong></div>
      <label class="w3-editor-label" for="w3-exam-editor">Write your message in English</label><textarea id="w3-exam-editor" class="w3-editor w3-exam-editor" maxlength="9000" spellcheck="true" ${!choice?'disabled':''} placeholder="${choice?'Write your own email to Kim here.':'Choose Text A or B to activate the editor.'}">${choice?e(draft.texts[choice]):''}</textarea>
      <div class="w3-compose-footer"><span id="w3-exam-count" aria-live="polite">${choice?w3WordCount(draft.texts[choice]):0} words · no official minimum</span><span class="w3-save">Saved on this device</span></div>
      <div class="w3-actions"><button type="button" id="w3-exam-submit" class="button primary" ${!choice?'disabled':''}>Check my email →</button>${previous?`<a class="button secondary small" href="#/writing/part-3/level-${level}/feedback">Previous feedback</a>`:''}</div><p id="w3-exam-warning" class="w3-warning" role="status" aria-live="polite"></p></section></div></div></div></section>`,'writing');
    APP.querySelectorAll('[data-w3-exam-choice]').forEach(btn=>btn.addEventListener('click',()=>{
      const next=btn.dataset.w3ExamChoice;
      if(choice && document.getElementById('w3-exam-editor')) draft.texts[choice]=document.getElementById('w3-exam-editor').value.slice(0,9000);
      draft.choice=next;store.drafts[task.id]=draft;saveStore();render();
    }));
    if(!choice)return;
    const field=document.getElementById('w3-exam-editor');
    field.addEventListener('input',()=>{
      draft.texts[choice]=field.value.slice(0,9000);store.drafts[task.id]=draft;saveStore();
      document.getElementById('w3-exam-count').textContent=`${w3WordCount(field.value)} words · no official minimum`;
    });
    document.getElementById('w3-exam-submit').addEventListener('click',()=>{
      const text=field.value.trim(),warning=document.getElementById('w3-exam-warning');
      if(!text){warning.textContent='Write your email before asking for feedback.';field.focus();return;}
      draft.texts[choice]=text.slice(0,9000);
      const at={at:new Date().toISOString(),choice,text:draft.texts[choice],wordCount:w3WordCount(text),checks:{}};
      store.attempts[task.id] ||= [];store.attempts[task.id].push(at);store.attempts[task.id]=store.attempts[task.id].slice(-15);
      delete store.drafts[task.id];saveStore();routeTo(`#/writing/part-3/level-${level}/feedback`);
    });
  }
  function w3ExamFeedback(level) {
    const task=w3ExamTask(level),at=w3ExamLatest(level);
    if(!at){routeTo(`#/writing/part-3/level-${level}`);return;}
    const article=task.articles[at.choice];if(!article){routeTo('#/writing/part-3');return;}
    at.checks ||= {};
    const checks=[
      ['main',`I explained ${task.mainLabel} clearly.`],
      ['details','I included at least four accurate details from my chosen German article.'],
      ['relevant','I selected details that would genuinely help Kim.'],
      ['english','I expressed the meaning naturally in my own English sentences.'],
      ['email','My response reads like a personal email to Kim.']
    ];
    shell(pageHero([['Home','#/home'],['Writing','#/writing'],['Part 3','#/writing/part-3'],[`Level ${level}`,`#/writing/part-3/level-${level}`],['Feedback',`#/writing/part-3/level-${level}/feedback`]],'Writing · Part 3','Check your mediation','Look at the information you communicated. Your teacher will assess the actual writing.')+
      `<section class="section w3-section"><div class="container w3-review-layout"><div><section class="panel w3-review-panel"><div class="w3-feedback-top"><div><div class="eyebrow">LEVEL ${level} · TEXT ${e(at.choice)} · ${e(dateText(at.at))}</div><h2>My email to Kim</h2><p class="w3-muted">${e(article.title)}</p></div><span class="w3-word-pill">${Number(at.wordCount)||0} words</span></div><div class="w3-student-text">${e(at.text)}</div><p class="w3-teacher-alert"><strong>Share your writing with your teacher for a score out of 10.</strong> This site provides self-review, not a writing grade.</p><div class="w3-review-actions"><button type="button" id="w3-exam-copy" class="button secondary small">Copy my email</button><a class="button primary small" href="#/writing/part-3/level-${level}">Try again →</a><a class="button subtle-btn small" href="#/writing/part-3">All levels</a></div><p class="w3-mini" id="w3-exam-copy-status" role="status"></p></section>
      <section class="panel w3-review-panel"><div class="eyebrow">SELF-CHECK</div><h2>Did I communicate what Kim needs?</h2><p class="w3-muted">Tick only what your email actually includes.</p>${checks.map(([key,text])=>`<label class="w3-check"><input type="checkbox" data-w3-exam-check="${key}" ${at.checks[key]?'checked':''}><span>${e(text)}</span></label>`).join('')}<p class="w3-check-result" id="w3-exam-check-result" aria-live="polite"></p></section></div>
      <aside class="w3-feedback-aside"><div class="w2-marking w3-marking"><h3>Official MSA assessment</h3><div class="w2-mark-grid"><div><strong>5</strong><span>Content</span></div><div><strong>5</strong><span>Language</span></div></div><p>Content: explain the main idea and at least four relevant details. Language: write clearly and naturally to Kim in a suitable email.</p><p class="w2-fineprint">There is no specified minimum word count for this mediation task.</p></div>
      <details class="w2-model w3-model"><summary>Possible information from Text ${e(at.choice)}</summary><div class="w3-points-list"><p><strong>Main idea</strong><br>${e(article.main)}</p><p><strong>Other useful details (choose at least four)</strong></p><ul>${article.points.map(p=>`<li>${e(p)}</li>`).join('')}</ul></div><p>These are examples, not exact phrases students must copy.</p></details>
      <details class="w2-model w3-model"><summary>Compare with a model email</summary><div class="w3-model-text">${e(article.model)}</div><p>One possible response. Other accurate and well-organised emails are equally acceptable.</p></details></aside></div></section>`,'writing');
    const update=()=>{const n=checks.filter(([key])=>at.checks[key]).length;document.getElementById('w3-exam-check-result').textContent=`${n} of ${checks.length} self-checks completed. This is not a score.`;};
    APP.querySelectorAll('[data-w3-exam-check]').forEach(cb=>cb.addEventListener('change',()=>{at.checks[cb.dataset.w3ExamCheck]=cb.checked;saveStore();update();}));update();
    document.getElementById('w3-exam-copy').addEventListener('click',async()=>{
      try{await navigator.clipboard.writeText(at.text);document.getElementById('w3-exam-copy-status').textContent='Copied. You can share it with your teacher.';}
      catch(_){document.getElementById('w3-exam-copy-status').textContent='Select the email above to copy it manually.';}
    });
  }
  function writing3ProgressBlock() {
    const tasks=[{level:1,id:W3_ID,title:'Lena’s first job'},...[2,3].map(level=>({level,id:W3_EXAMS[level].id,title:W3_EXAMS[level].title}))];
    return `<div class="panel" style="margin-bottom:18px"><h2>Writing Part 3</h2><p class="muted" style="font-size:.87rem">Mediation · Three levels · One or two German source texts</p>${tasks.map(t=>{
      const attempts=getAttempts(t.id),last=latestAttempt(t.id),draft=t.level===1?w3Draft():w3ExamDraft(t.level);
      const inProgress=t.level===1?!!draft.text:!!draft.choice,words=t.level===1?w3WordCount(draft.text):w3WordCount(draft.texts?.[draft.choice]||'');
      const href=`#/writing/part-3/level-${t.level}`;
      return `<div class="attempt-row"><div><strong>Level ${t.level}: ${e(t.title)}</strong><div><span>${last?`${attempts.length} review${attempts.length===1?'':'s'} · Last: ${Number(last.wordCount)} words${last.choice?' · Text '+e(last.choice):''}`:inProgress?`Draft saved · ${words} words`:'Not started yet'}</span></div></div><div style="display:flex;gap:8px;flex-wrap:wrap">${last?`<a class="button small secondary" href="${href}/feedback">Feedback</a>`:''}<a class="button small primary" href="${href}">${inProgress?'Continue':last?'Try again':'Start'} →</a></div></div>`;
    }).join('')}<p class="tiny muted">Show your teacher each completed email to receive a score out of 10.</p></div>`;
  }

  function writingSubjectPage(){
    const reviews=W1_ALL_IDS.reduce((n,id)=>n+w1AnyAttempts(id).length,0);
    const w2Reviews=W2_ALL_IDS.reduce((n,id)=>n+w2AnyAttempts(id).length,0);
    const w3Reviews=[W3_ID,W3_EXAMS[2].id,W3_EXAMS[3].id].reduce((n,id)=>n+getAttempts(id).length,0);
    shell(pageHero([['Home','#/home'],['Writing','#/writing']],'Your practice hub','Writing','Practise photo responses, online discussions and German-to-English mediation.')+
      `<section class="section"><div class="container work-layout"><div class="module-parts">
      <div class="module-part active"><div class="module-part-left"><span class="mini-num">01</span><div><h3>Writing Part 1</h3><p>Your Photo · Three levels · 30–50 words · 5 marks</p></div></div><a class="button primary small" href="#/writing/part-1">Open →</a></div>
      <div class="module-part active"><div class="module-part-left"><span class="mini-num">02</span><div><h3>Writing Part 2</h3><p>Online discussion · Three levels · 100+ words · 10 marks</p></div></div><a class="button primary small" href="#/writing/part-2">Open →</a></div>
      <div class="module-part active"><div class="module-part-left"><span class="mini-num">03</span><div><h3>Writing Part 3</h3><p>Mediation · Three levels · Two-text choices</p></div></div><a class="button primary small" href="#/writing/part-3">Open →</a></div>
      </div><aside><div class="path-summary"><div class="label">Writing practice available</div><strong>3 photo + 3 discussion + 3 mediation levels</strong><p style="font-size:.86rem;margin-top:10px">${reviews+w2Reviews+w3Reviews?`${reviews+w2Reviews+w3Reviews} writing review${reviews+w2Reviews+w3Reviews===1?'':'s'} saved`:'Your drafts and writing feedback are saved on this device.'}</p><a class="button primary small" style="margin-top:12px" href="#/writing/part-2/level-1">Try Writing Part 2 →</a></div></aside></div></section>`,'writing');
  }
  function writingProgressBlock(){
    const names=['Learn with clues · Football','Practise like the exam · Park proposal','Take the challenge · Mountain hike'];
    return `<div class="panel" style="margin-bottom:18px"><h2>Writing Part 1</h2><p class="muted" style="font-size:.87rem">Your Photo · Three levels · 30–50 words</p>${W1_ALL_IDS.map((id,i)=>{
      const tries=w1AnyAttempts(id),draft=w1AnyDraft(id),last=w1AnyLast(id),url=`#/writing/part-1/level-${i+1}`;
      return `<div class="attempt-row"><div><strong>Level ${i+1}: ${e(names[i])}</strong><div><span>${tries.length?`${tries.length} review${tries.length===1?'':'s'} · Latest: ${last.wordCount} words`:draft.text?`Draft saved · ${w1WordCount(draft.text)} words`:'Not started yet'}</span></div></div><div style="display:flex;gap:8px;flex-wrap:wrap">${last?`<a class="button small secondary" href="${url}/feedback">Feedback</a>`:''}<a class="button small primary" href="${url}">${tries.length?'Try again':draft.text?'Continue':'Start'} →</a></div></div>`;
    }).join('')}<p class="tiny muted">Open-ended writing is not given an automatic mark. Your drafts and reflections stay on your device.</p></div>`;
  }
  function writing2ProgressBlock(){
    const tasks=[{id:W2_ID,title:'A Creative Afternoon at School?'},W2_EXAMS[2],W2_EXAMS[3]];
    return `<div class="panel" style="margin-bottom:18px"><h2>Writing Part 2</h2><p class="muted" style="font-size:.87rem">Discussion reply · Three levels · 100+ words</p>
      ${tasks.map((task,i)=>{const tries=w2AnyAttempts(task.id),last=w2AnyLatest(task.id),draft=w2AnyDraft(task.id),url=`#/writing/part-2/level-${i+1}`;
      return `<div class="attempt-row"><div><strong>Level ${i+1}: ${e(task.title)}</strong><div><span>${tries.length?`${tries.length} review${tries.length===1?'':'s'} · Latest: ${last.wordCount} words`:draft.text?`Draft saved · ${w2Count(draft.text)} words`:'Not started yet'}</span></div></div><div style="display:flex;gap:8px;flex-wrap:wrap">${last?`<a class="button small secondary" href="${url}/feedback">Feedback</a>`:''}<a class="button small primary" href="${url}">${draft.text?'Continue':tries.length?'Try again':'Start'} →</a></div></div>`;
      }).join('')}<p class="tiny muted">Give your writing to your teacher for a score out of 10.</p></div>`;
  }
  function progressPage() {
    const done=completedTotal(),totalAttempts=allLevels.reduce((n,l)=>n+getAttempts(l.id).length,0);
    const avg=done?Math.round(allLevels.reduce((sum,l)=>sum+(getAttempts(l.id).length?bestScore(l.id)/l.questions.length:0),0)/done*100):0;
    const progressSection=(title,part,arr)=>`<div class="panel" style="margin-bottom:18px"><h2>${e(title)}</h2><p class="muted" style="font-size:.87rem">${part===3?'Longer-text reading comprehension':part===2?'Short-text reading comprehension':'Matching people and activities'} · ${arr.filter(l=>getAttempts(l.id).length).length} of 3 levels completed</p>${arr.map((l,i)=>{
      const tries=getAttempts(l.id),last=latestAttempt(l.id),url=`#/reading/part-${part}/${l.id}`;
      return `<div class="attempt-row"><div><strong>Level ${i+1}: ${e(l.title)}</strong><div><span>${tries.length?`${tries.length} attempt${tries.length>1?'s':''} · Latest: ${last.score}/${l.questions.length} · Best: ${scoreLabel(l)}`:'Not started yet'}</span></div></div><div style="display:flex;gap:8px;flex-wrap:wrap">${last?`<a class="button small secondary" href="${url}/feedback">Feedback</a>`:''}<a class="button small primary" href="${url}">${tries.length?'Try again':'Start'} →</a></div></div>`;
    }).join('')}</div>`;
    shell(pageHero([['Home','#/home'],['My progress','#/progress']],'Saved on this device','My progress','Review Reading Parts 1–3 and Writing Parts 1–3, or continue where you left off.')+
      `<section class="section"><div class="container work-layout"><div><div class="progress-stats"><div class="progress-card"><strong>${done}/${allLevels.length}</strong><span>Reading levels completed</span></div><div class="progress-card"><strong>${totalAttempts}</strong><span>Total attempts</span></div><div class="progress-card"><strong>${avg}%</strong><span>Average best score</span></div></div>${progressSection('Reading Part 1',1,levels)}${progressSection('Reading Part 2',2,part2Levels)}${progressSection('Reading Part 3',3,part3Levels)}${writingProgressBlock()}${writing2ProgressBlock()}${writing3ProgressBlock()}<div class="panel" style="margin-top:18px"><h3>Back up or clear your progress</h3><p class="muted" style="font-size:.87rem">Download a JSON backup of your scores and answers. You can import this on another device, or clear the progress saved here.</p><div style="display:flex;flex-wrap:wrap;gap:10px"><button id="export-progress" class="button secondary">Download progress</button><label class="button secondary" for="import-progress" style="cursor:pointer">Import progress</label><input type="file" id="import-progress" accept="application/json,.json" style="position:absolute;width:1px;height:1px;opacity:0"><button id="clear-progress" class="button subtle-btn">Clear saved progress</button></div><p id="progress-notice" class="tiny" aria-live="polite" style="margin:12px 0 0;color:#3d7281"></p></div></div><aside><div class="privacy-note"><strong>Privacy and saving</strong><p style="margin:9px 0 0">ThinkLab requires no student login. Your scores and answers are saved locally in this browser, not sent to a teacher or server. Clearing site data or switching browsers may remove them. Export a backup if needed.</p></div></aside></div></section>`,'progress');
    bindProgress();
  }
  function bindProgress() {
    document.getElementById('export-progress')?.addEventListener('click',()=>{
      const blob=new Blob([JSON.stringify({...store,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'});
      const url=URL.createObjectURL(blob),link=document.createElement('a');
      link.href=url;link.download='thinklab-msa-progress.json';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
    document.getElementById('import-progress')?.addEventListener('change',async ev=>{
      const file=ev.target.files?.[0];if(!file)return;
      try {
        const imported=JSON.parse(await file.text());
        if(imported.version!==1 || !imported.attempts || !imported.drafts || typeof imported.attempts!=='object')throw new Error('wrong format');
        const clean={version:1,attempts:{},drafts:{}};
        for(const l of allLevels){
          const allowedLetters=l.id.startsWith('r2-')||l.id.startsWith('r3-')?['A','B','C','D']:letters;
          const arr=imported.attempts[l.id];
          if(Array.isArray(arr))clean.attempts[l.id]=arr.filter(x=>typeof x.score==='number' && x.score>=0 && x.score<=l.questions.length && x.answers && typeof x.answers==='object').slice(-15).map(x=>({score:x.score,answers:Object.fromEntries(Object.entries(x.answers).filter(([k,v])=>/^\d+$/.test(k) && allowedLetters.includes(v))),at:typeof x.at==='string'?x.at:new Date().toISOString()}));
          const drafts=imported.drafts[l.id];if(drafts && typeof drafts==='object' && !Array.isArray(drafts)) clean.drafts[l.id]=Object.fromEntries(Object.entries(drafts).filter(([k,v])=>/^\d+$/.test(k) && allowedLetters.includes(v)));
        }
        const importedW1Attempts=imported.attempts?.[W1_ID];
        if(Array.isArray(importedW1Attempts)) clean.attempts[W1_ID]=importedW1Attempts.slice(-15).filter(x=>x && typeof x.text==='string').map(x=>({
          at:typeof x.at==='string'?x.at:new Date().toISOString(),
          text:x.text.slice(0,3000),wordCount:w1WordCount(x.text.slice(0,3000)),
          checks:Object.fromEntries(['where','who','what','clear'].map(k=>[k,x.checks?.[k]===true]))
        }));
        const importedW1Draft=imported.drafts?.[W1_ID];
        if(importedW1Draft && typeof importedW1Draft==='object' && !Array.isArray(importedW1Draft)) clean.drafts[W1_ID]={
          text:String(importedW1Draft.text||'').slice(0,3000),
          relation:String(importedW1Draft.relation||'my cousins').slice(0,80),
          names:String(importedW1Draft.names||'').slice(0,80),
          time:String(importedW1Draft.time||'last Saturday').slice(0,80),
          place:String(importedW1Draft.place||'').slice(0,80),
          checks:Object.fromEntries(['where','who','what','clear'].map(k=>[k,importedW1Draft.checks?.[k]===true]))
        };
        for (const id of [W1_L2_ID,W1_L3_ID]) {
          const arr=imported.attempts?.[id];
          if(Array.isArray(arr)) clean.attempts[id]=arr.slice(-15).filter(x=>x && typeof x.text==='string').map(x=>({
            at:typeof x.at==='string'?x.at:new Date().toISOString(),
            text:x.text.slice(0,3000),wordCount:w1WordCount(x.text.slice(0,3000)),
            checks:Object.fromEntries(['where','who','what','clear'].map(k=>[k,x.checks?.[k]===true]))
          }));
          const draft=imported.drafts?.[id];
          if(draft && typeof draft==='object' && !Array.isArray(draft)) clean.drafts[id]={text:String(draft.text||'').slice(0,3000)};
        }
        const w2Arr=imported.attempts?.[W2_ID];
        if(Array.isArray(w2Arr))clean.attempts[W2_ID]=w2Arr.slice(-15).filter(x=>x && typeof x.text==='string').map(x=>({
          at:typeof x.at==='string'?x.at:new Date().toISOString(),text:x.text.slice(0,9000),wordCount:w2Count(x.text.slice(0,9000)),
          ideas:Object.fromEntries(W2_GROUPS.map(g=>[g.key,g.options.some(o=>o.id===x.ideas?.[g.key])?x.ideas[g.key]:''])),
          checks:Object.fromEntries(W2_GROUPS.map(g=>[g.key,x.checks?.[g.key]===true]))
        }));
        const w2D=imported.drafts?.[W2_ID];
        if(w2D && typeof w2D==='object' && !Array.isArray(w2D))clean.drafts[W2_ID]={
          text:String(w2D.text||'').slice(0,9000),
          ideas:Object.fromEntries(W2_GROUPS.map(g=>[g.key,g.options.some(o=>o.id===w2D.ideas?.[g.key])?w2D.ideas[g.key]:'']))
        };
        for(const level of [2,3]) {
          const id=W2_EXAMS[level].id, attempts=imported.attempts?.[id], draft=imported.drafts?.[id];
          if(Array.isArray(attempts))clean.attempts[id]=attempts.slice(-15).filter(x=>x && typeof x.text==='string').map(x=>({
            at:typeof x.at==='string'?x.at:new Date().toISOString(),
            text:x.text.slice(0,9000),wordCount:w2Count(x.text.slice(0,9000)),
            checks:Object.fromEntries(['0','1','2','3'].map(k=>[k,x.checks?.[k]===true]))
          }));
          if(draft && typeof draft==='object' && !Array.isArray(draft))
            clean.drafts[id]={text:String(draft.text||'').slice(0,9000)};
        }
        const w3Arr=imported.attempts?.[W3_ID];
        if(Array.isArray(w3Arr)) clean.attempts[W3_ID]=w3Arr.slice(-15).filter(x=>x && typeof x.text==='string').map(x=>({
          at:typeof x.at==='string'?x.at:new Date().toISOString(),
          text:x.text.slice(0,6000),wordCount:w3WordCount(x.text.slice(0,6000)),
          points:w3ValidPoints(x.points),
          checks:Object.fromEntries(['job','details','purpose','email','mediation'].map(k=>[k,x.checks?.[k]===true]))
        }));
        const w3D=imported.drafts?.[W3_ID];
        if(w3D && typeof w3D==='object' && !Array.isArray(w3D)) clean.drafts[W3_ID]={
          text:String(w3D.text||'').slice(0,6000),points:w3ValidPoints(w3D.points)
        };
        for(const level of [2,3]) {
          const task=W3_EXAMS[level],id=task.id,arr=imported.attempts?.[id],d=imported.drafts?.[id];
          if(Array.isArray(arr))clean.attempts[id]=arr.slice(-15).filter(x=>x && typeof x.text==='string' && ['A','B'].includes(x.choice)).map(x=>({
            at:typeof x.at==='string'?x.at:new Date().toISOString(),choice:x.choice,
            text:x.text.slice(0,9000),wordCount:w3WordCount(x.text.slice(0,9000)),
            checks:Object.fromEntries(['main','details','relevant','english','email'].map(k=>[k,x.checks?.[k]===true]))
          }));
          if(d && typeof d==='object' && !Array.isArray(d))clean.drafts[id]={
            choice:['A','B'].includes(d.choice)?d.choice:'',
            texts:{A:String(d.texts?.A||'').slice(0,9000),B:String(d.texts?.B||'').slice(0,9000)}
          };
        }
        if(!window.confirm('Import this file? It will replace progress currently saved in this browser.')) return;
        store=clean;saveStore();progressPage();
      } catch(_) {document.getElementById('progress-notice').textContent='That file is not a valid ThinkLab progress backup.';}
      ev.target.value='';
    });
    document.getElementById('clear-progress')?.addEventListener('click',()=>{
      if(!window.confirm('Delete all saved answers and scores from this browser? This cannot be undone unless you exported a backup.'))return;
      store={version:1,attempts:{},drafts:{}};saveStore();progressPage();
    });
  }
  function notFound(){ shell(pageHero([['Home','#/home'],['Page not found','#/home']],'ThinkLab','Page not found','The page you requested is not available.')+`<section class="section"><div class="container"><a href="#/home" class="button primary">Go home →</a></div></section>`,'home');}
  function render(){
    if(!DATA?.levels){APP.innerHTML='<p>Learning materials are unavailable. Please check that data.js is installed.</p>';return;}
    const p=normPath();
    if(p[0]==='home'||!p[0]) home();
    else if(p[0]==='how') howPage();
    else if(['reading','writing','listening'].includes(p[0]) && p.length===1)subjectPage(p[0]);
    else if(p[0]==='reading'&&p[1]==='part-1'&&p.length===2)partPage();
    else if(p[0]==='reading'&&p[1]==='part-2'&&p.length===2)part2Page();
    else if(p[0]==='reading'&&p[1]==='part-3'&&p.length===2)r3PartPage();
    else if(p[0]==='reading'&&p[1]==='part-1'&&getLevel(p[2])&&p.length===3)levelPage(getLevel(p[2]));
    else if(p[0]==='reading'&&p[1]==='part-1'&&getLevel(p[2])&&p[3]==='feedback'&&p.length===4)feedbackPage(getLevel(p[2]));
    else if(p[0]==='reading'&&p[1]==='part-2'&&part2Levels.find(x=>x.id===p[2])&&p.length===3)r2LevelPage(part2Levels.find(x=>x.id===p[2]));
    else if(p[0]==='reading'&&p[1]==='part-2'&&part2Levels.find(x=>x.id===p[2])&&p[3]==='feedback'&&p.length===4)r2FeedbackPage(part2Levels.find(x=>x.id===p[2]));
    else if(p[0]==='reading'&&p[1]==='part-3'&&part3Levels.find(x=>x.id===p[2])&&p.length===3)r3LevelPage(part3Levels.find(x=>x.id===p[2]));
    else if(p[0]==='reading'&&p[1]==='part-3'&&part3Levels.find(x=>x.id===p[2])&&p[3]==='feedback'&&p.length===4)r3FeedbackPage(part3Levels.find(x=>x.id===p[2]));
    else if(p[0]==='writing'&&p[1]==='part-1'&&p.length===2)writingPartPage();
    else if(p[0]==='writing'&&p[1]==='part-1'&&p[2]==='level-1'&&p.length===3)writingLevelPage();
    else if(p[0]==='writing'&&p[1]==='part-1'&&p[2]==='level-1'&&p[3]==='feedback'&&p.length===4)writingFeedbackPage();
    else if(p[0]==='writing'&&p[1]==='part-1'&&['level-2','level-3'].includes(p[2])&&p.length===3)w1ExamLevelPage(Number(p[2].slice(-1)));
    else if(p[0]==='writing'&&p[1]==='part-1'&&['level-2','level-3'].includes(p[2])&&p[3]==='feedback'&&p.length===4)w1ExamFeedback(Number(p[2].slice(-1)));
    else if(p[0]==='writing'&&p[1]==='part-2'&&p.length===2)w2PartPage();
    else if(p[0]==='writing'&&p[1]==='part-2'&&p[2]==='level-1'&&p.length===3)w2LevelPage();
    else if(p[0]==='writing'&&p[1]==='part-2'&&p[2]==='level-1'&&p[3]==='feedback'&&p.length===4)w2FeedbackPage();
    else if(p[0]==='writing'&&p[1]==='part-2'&&['level-2','level-3'].includes(p[2])&&p.length===3)w2ExamPage(Number(p[2].slice(-1)));
    else if(p[0]==='writing'&&p[1]==='part-2'&&['level-2','level-3'].includes(p[2])&&p[3]==='feedback'&&p.length===4)w2ExamFeedback(Number(p[2].slice(-1)));
    else if(p[0]==='writing'&&p[1]==='part-3'&&p.length===2)w3PartPage();
    else if(p[0]==='writing'&&p[1]==='part-3'&&p[2]==='level-1'&&p.length===3)w3LevelPage();
    else if(p[0]==='writing'&&p[1]==='part-3'&&p[2]==='level-1'&&p[3]==='feedback'&&p.length===4)w3FeedbackPage();
    else if(p[0]==='writing'&&p[1]==='part-3'&&['level-2','level-3'].includes(p[2])&&p.length===3)w3ExamPage(Number(p[2].slice(-1)));
    else if(p[0]==='writing'&&p[1]==='part-3'&&['level-2','level-3'].includes(p[2])&&p[3]==='feedback'&&p.length===4)w3ExamFeedback(Number(p[2].slice(-1)));
    else if(p[0]==='progress')progressPage();
    else notFound();
    window.scrollTo({top:0,behavior:'instant'});
  }
  window.addEventListener('hashchange',render);
  if(!location.hash)location.hash='#/home'; else render();
})();

