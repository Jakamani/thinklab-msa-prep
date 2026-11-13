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
  const allLevels = [...levels, ...part2Levels];
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
      <a href="#/progress" class="header-progress" aria-label="Review your saved progress"><span class="round-indicator">✓</span> ${progress} / ${allLevels.length} levels</a>
    </div></header><main id="main">${page}</main><footer class="site-footer"><div class="container footer-inner"><div><div class="brand-name">Think<span>Lab</span> · MSA Prep</div><div class="brand-tag">LEARN · CREATE · EXPLORE · GROW</div></div><p>Original practice tasks inspired by the Berlin MSA English format, not official exam questions. ${localSavingAvailable?'Progress is stored on this device only.':'Progress saving may be unavailable in this browser.'}</p></div></footer>`;
    document.title = 'ThinkLab MSA Prep — ' + ({home:'Home',reading:'Reading',writing:'Writing',listening:'Listening',progress:'My progress'}[active] || 'Practice');
  }
  function home() {
    const cards=[
      ['reading','Reading','3 parts','Read to find the meaning, identify evidence and match the right details.',['Match people to activities','Understand short texts','Read a longer article'],'✓','live'],
      ['writing','Writing','3 parts','Communicate clearly, organise ideas and respond for the right reader.',['Respond to a photo','Write a discussion response','Mediation: German → English'],'✎','planned'],
      ['listening','Listening','4 parts','Listen for meaning, follow speakers and recognise the important clues.',['Match messages to pictures','Match podcast intros to titles','Complete notes and tables','Understand a radio discussion'],'◉','planned']
    ];
    const html=`<section class="hero"><div class="container hero-grid"><div>
      <div class="eyebrow"><span class="accent-dot"></span>Grade 10 · English · MSA Prep</div><h1>Practise smarter.<span>Feel ready.</span></h1>
      <p class="hero-sub">A clear path from guided practice to exam-style challenges. Build confidence in Reading, Writing and Listening—one skill at a time.</p>
      <div class="hero-buttons"><a class="button primary" href="#/reading/part-1">Start Reading Part 1 <span aria-hidden="true">→</span></a><a class="button secondary" href="#/reading/part-2">Try Reading Part 2 →</a><a class="button subtle-btn" href="#/how">How it works</a></div>
      <div class="benefit"><strong>✓</strong> No logins, no pressure. Progress and feedback saved on this device.</div>
    </div><div class="journey-wrap"><div class="journey-card"><div class="eyebrow">Your learning journey</div><h3>Learn it. Try it. <em>Own it.</em></h3>
       ${['Learn with clues','Practise like the exam','Take the challenge'].map((s,i)=>`<div class="journey-step"><span class="num">0${i+1}</span><div><strong>${s}</strong><p>${['Short examples + helpful guidance','Fresh tasks with the real exam structure','More demanding practice'][i]}</p></div><span style="margin-left:auto;color:#bad2dd">›</span></div>`).join('')}
       <div class="bottom-note">✓ After each task, get a score, correct answers and an explanation of the evidence.</div>
    </div></div></div></section>
    <div class="metrics"><div class="container metric-grid"><div class="metric"><strong>3</strong> core skills</div><div class="metric"><strong>10</strong> planned exam parts</div><div class="metric"><strong>6</strong> Reading levels live</div></div></div>
    <section class="section"><div class="container">${titleBlock('Your practice hub','Choose where to begin','Explore the skills. Reading Parts 1 and 2 are ready now; the other sections will follow.')}
      <div class="skill-grid">${cards.map(([route,title,parts,desc,items,ico,st])=>`<a class="skill-card ${route==='reading'?'':route==='writing'?'orange':'navy'}" href="#/${route}"><div class="skill-icon">${ico}</div><div style="position:absolute;right:22px;top:21px"><span class="pill ${st==='live'?'ready':'planned'}">${st==='live'?'Start now':'In development'}</span></div><h3>${title}</h3><p>${desc}</p><ul>${items.map(x=>`<li>${x}</li>`).join('')}</ul><div class="skill-action">${route==='reading'?'Explore Reading':'View the plan'} <span aria-hidden="true">→</span></div></a>`).join('')}</div>
    </div></section><section class="section alt"><div class="container">${titleBlock('One simple route','Three levels. Real progress.','Every part follows the same learning path so you always know what comes next.')}
    <div class="path-grid">${levels.map((l,i)=>`<a class="level-card" href="#/reading/part-1/${l.id}"><div class="topline"><span class="level-number">0${i+1}</span><div><div class="tiny muted" style="font-weight:800">LEVEL ${i+1}</div><h3 style="margin:0">${stepTitle(i)}</h3></div></div><p>${e(l.description)}</p><div class="tiny"><span class="pill ${getAttempts(l.id).length?'ready':''}">${getAttempts(l.id).length?'Best '+scoreLabel(l):'Not completed'}</span></div></a>`).join('')}</div>
    <div class="feedback-ribbon"><strong>New · Reading Part 2:</strong> Six fresh exam-style texts in each of Levels 2 and 3, plus a guided Level 1. <a href="#/reading/part-2" style="font-weight:850;color:#0B2D56;text-decoration:underline">Explore Part 2 →</a></div>
    </div></section>`;
    shell(html,'home');
  }
  function howPage() {
    shell(pageHero([['Home','#/home'],['How it works','#/how']],'Your learning path','Learn. Practise. Improve.','Here is how ThinkLab guides you through MSA-style tasks.')+`<section class="section"><div class="container"><div class="path-grid">${levels.map((l,i)=>`<div class="panel"><span class="level-number">0${i+1}</span><h3 style="margin-top:15px">${stepTitle(i)}</h3><p class="muted">${e(l.description)}</p></div>`).join('')}</div><div class="panel" style="margin-top:20px"><h3>How marking works</h3><p>In Reading Part 1, you match activities to people. In Reading Part 2, you pick the one correct statement for each short text. Both earn one point per correct answer and include detailed feedback after submission.</p><p>No account is required. Your attempts stay in this browser; use <strong>My progress</strong> to download a backup if you want to keep a copy.</p><a class="button primary" href="#/reading/part-1">Start Reading Part 1 →</a></div></div></section>`,'home');
  }
  const skills = {
    reading: [['Reading Part 1','Match people to activities','Ready'],['Reading Part 2','Understand short texts','Ready'],['Reading Part 3','Longer reading comprehension','Planned']],
    writing: [['Writing Part 1','Photo response','Planned'],['Writing Part 2','Discussion / opinion response','Planned'],['Writing Part 3','Mediation: German → English','Planned']],
    listening: [['Listening Part 1','Voicemail and picture matching','Planned'],['Listening Part 2','Podcast intro matching','Planned'],['Listening Part 3','Information completion','Planned'],['Listening Part 4','Radio programme comprehension','Planned']]
  };
  function subjectPage(skill) {
    const title=skill[0].toUpperCase()+skill.slice(1);
    const helper={reading:'Choose your reading skill. Practise matching people to activities or understanding short messages and notices.',writing:'The Writing pathway will include task planning, independent writing and feedback against content and language criteria.',listening:'The Listening pathway will include original recordings, two play-throughs and evidence-based explanations.'}[skill];
    const ready=skill==='reading';
    const done=completedTotal();
    shell(pageHero([['Home','#/home'],[title,'#/'+skill]],'Your practice hub',title,helper)+`<section class="section"><div class="container work-layout"><div><div class="module-parts">${skills[skill].map((part,i)=>`<div class="module-part ${part[2]==='Ready'?'active':''}"><div class="module-part-left"><span class="mini-num">0${i+1}</span><div><h3>${e(part[0])}</h3><p>${e(part[1])}</p>${ready&&i<2?`<div class="tiny muted" style="margin-top:7px">${i===0?completedCount():completedPart2Count()} of 3 levels completed</div>`:''}</div></div>${part[2]==='Ready'?`<a class="button primary small" href="#/reading/part-${i+1}">Open →</a>`:'<span class="pill planned">In development</span>'}</div>`).join('')}</div></div><aside class="path-summary"><div class="label">Live content</div><strong>${ready?'Reading Parts 1 + 2 · 6 levels':'Modules being prepared'}</strong><p style="font-size:.85rem;margin-top:10px">${ready?'Start with clues, then complete an exam-style set and a harder challenge in each part.':'This section is part of the site plan; it is not yet an interactive practice module.'}</p>${ready?`<div class="small-progress"><span style="width:${Math.round(done/6*100)}%"></span></div><p class="tiny" style="margin-top:9px">${done} of 6 levels completed</p>`:''}</aside></div></section>` ,skill);
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
  function progressPage() {
    const done=completedTotal(),totalAttempts=allLevels.reduce((n,l)=>n+getAttempts(l.id).length,0);
    const avg=done?Math.round(allLevels.reduce((sum,l)=>sum+(getAttempts(l.id).length?bestScore(l.id)/l.questions.length:0),0)/done*100):0;
    const progressSection=(title,part,arr)=>`<div class="panel" style="margin-bottom:18px"><h2>${e(title)}</h2><p class="muted" style="font-size:.87rem">${part===2?'Short-text reading comprehension':'Matching people and activities'} · ${arr.filter(l=>getAttempts(l.id).length).length} of 3 levels completed</p>${arr.map((l,i)=>{
      const tries=getAttempts(l.id),last=latestAttempt(l.id),url=`#/reading/part-${part}/${l.id}`;
      return `<div class="attempt-row"><div><strong>Level ${i+1}: ${e(l.title)}</strong><div><span>${tries.length?`${tries.length} attempt${tries.length>1?'s':''} · Latest: ${last.score}/${l.questions.length} · Best: ${scoreLabel(l)}`:'Not started yet'}</span></div></div><div style="display:flex;gap:8px;flex-wrap:wrap">${last?`<a class="button small secondary" href="${url}/feedback">Feedback</a>`:''}<a class="button small primary" href="${url}">${tries.length?'Try again':'Start'} →</a></div></div>`;
    }).join('')}</div>`;
    shell(pageHero([['Home','#/home'],['My progress','#/progress']],'Saved on this device','My progress','Review Reading Parts 1 and 2, revisit feedback, or continue where you left off.')+
      `<section class="section"><div class="container work-layout"><div><div class="progress-stats"><div class="progress-card"><strong>${done}/${allLevels.length}</strong><span>Levels completed</span></div><div class="progress-card"><strong>${totalAttempts}</strong><span>Total attempts</span></div><div class="progress-card"><strong>${avg}%</strong><span>Average best score</span></div></div>${progressSection('Reading Part 1',1,levels)}${progressSection('Reading Part 2',2,part2Levels)}<div class="panel" style="margin-top:18px"><h3>Back up or clear your progress</h3><p class="muted" style="font-size:.87rem">Download a JSON backup of your scores and answers. You can import this on another device, or clear the progress saved here.</p><div style="display:flex;flex-wrap:wrap;gap:10px"><button id="export-progress" class="button secondary">Download progress</button><label class="button secondary" for="import-progress" style="cursor:pointer">Import progress</label><input type="file" id="import-progress" accept="application/json,.json" style="position:absolute;width:1px;height:1px;opacity:0"><button id="clear-progress" class="button subtle-btn">Clear saved progress</button></div><p id="progress-notice" class="tiny" aria-live="polite" style="margin:12px 0 0;color:#3d7281"></p></div></div><aside><div class="privacy-note"><strong>Privacy and saving</strong><p style="margin:9px 0 0">ThinkLab requires no student login. Your scores and answers are saved locally in this browser, not sent to a teacher or server. Clearing site data or switching browsers may remove them. Export a backup if needed.</p></div></aside></div></section>`,'progress');
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
          const allowedLetters=l.id.startsWith('r2-')?['A','B','C','D']:letters;
          const arr=imported.attempts[l.id];
          if(Array.isArray(arr))clean.attempts[l.id]=arr.filter(x=>typeof x.score==='number' && x.score>=0 && x.score<=l.questions.length && x.answers && typeof x.answers==='object').slice(-15).map(x=>({score:x.score,answers:Object.fromEntries(Object.entries(x.answers).filter(([k,v])=>/^\d+$/.test(k) && allowedLetters.includes(v))),at:typeof x.at==='string'?x.at:new Date().toISOString()}));
          const drafts=imported.drafts[l.id];if(drafts && typeof drafts==='object' && !Array.isArray(drafts)) clean.drafts[l.id]=Object.fromEntries(Object.entries(drafts).filter(([k,v])=>/^\d+$/.test(k) && allowedLetters.includes(v)));
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
    else if(p[0]==='reading'&&p[1]==='part-1'&&getLevel(p[2])&&p.length===3)levelPage(getLevel(p[2]));
    else if(p[0]==='reading'&&p[1]==='part-1'&&getLevel(p[2])&&p[3]==='feedback'&&p.length===4)feedbackPage(getLevel(p[2]));
    else if(p[0]==='reading'&&p[1]==='part-2'&&part2Levels.find(x=>x.id===p[2])&&p.length===3)r2LevelPage(part2Levels.find(x=>x.id===p[2]));
    else if(p[0]==='reading'&&p[1]==='part-2'&&part2Levels.find(x=>x.id===p[2])&&p[3]==='feedback'&&p.length===4)r2FeedbackPage(part2Levels.find(x=>x.id===p[2]));
    else if(p[0]==='progress')progressPage();
    else notFound();
    window.scrollTo({top:0,behavior:'instant'});
  }
  window.addEventListener('hashchange',render);
  if(!location.hash)location.hash='#/home'; else render();
})();
