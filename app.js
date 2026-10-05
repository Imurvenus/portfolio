const grid=document.querySelector('#project-grid');
const dialog=document.querySelector('#case-dialog');
let activeProject=null, slide=0;
function renderGrid(filter='All'){
 grid.replaceChildren();
 projects.filter(p=>filter==='All'||p.category===filter).forEach(p=>{
  const button=document.createElement('button');button.className=`project-card project-${p.id}`;
  button.setAttribute('aria-label',`Read ${p.title} case study and view all ${p.slideCount} slides`);
  button.innerHTML=`<div class="project-image"><img src="${p.cover}" alt="${p.coverAlt}" loading="lazy"><span class="slide-badge">${p.slideCount} slides</span><span class="arrow" aria-hidden="true">↗</span></div><div class="project-meta"><span>${p.tag}</span><span>${p.type}</span></div><h3>${p.title}</h3><p>${p.subtitle}</p>`;
  button.addEventListener('click',()=>openProject(p));grid.append(button);
 });
}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
 document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});renderGrid(b.dataset.filter);
}));
function openProject(p){
 activeProject=p;slide=0;
 document.querySelector('#case-content').innerHTML=`<p class="eyebrow">${p.type} / ${p.category}</p><h2 id="case-title" class="case-heading">${p.title}</h2><p class="case-subtitle">${p.headline}</p><section class="gallery" aria-label="Complete project slide deck"><div class="gallery-heading"><h3>Complete presentation</h3><span>${p.slideCount} slides</span></div><img id="gallery-image" src="${p.images[0]}" alt="${p.title}: slide 1 of ${p.slideCount}"><div class="gallery-controls"><button id="previous-slide" aria-label="Previous project slide">← Previous</button><span id="slide-count" aria-live="polite"></span><button id="next-slide" aria-label="Next project slide">Next →</button></div><div class="slide-thumbnails" role="group" aria-label="Choose any slide">${p.images.map((src,i)=>`<button type="button" class="slide-thumbnail" data-slide="${i}" aria-label="View slide ${i+1}" aria-pressed="${i===0}"><img src="${src}" alt="" loading="lazy"><span>${String(i+1).padStart(2,'0')}</span></button>`).join('')}</div></section><div class="case-sections">${[['The brief',p.brief],['The audience',p.audience],['The insight',p.insight],['The strategy',p.strategy]].map(([h,t])=>`<section><h3>${h}</h3><p>${t}</p></section>`).join('')}<section><h3>Deliverables</h3><ul>${p.deliverables.map(t=>`<li>${t}</li>`).join('')}</ul></section><section><h3>Project status</h3><p>${p.status}</p></section></div><p class="case-lesson">${p.lesson}</p><div class="case-credit"><p><strong>Contribution & credit</strong><br>${p.credit}</p><p>Source: ${p.file}. All original project slides are shown above; portfolio summaries have been edited for clarity.</p></div>`;
 document.querySelector('#previous-slide').addEventListener('click',()=>changeSlide(-1));
 document.querySelector('#next-slide').addEventListener('click',()=>changeSlide(1));
 document.querySelectorAll('[data-slide]').forEach(b=>b.addEventListener('click',()=>{slide=Number(b.dataset.slide);changeSlide(0)}));
 changeSlide(0);dialog.showModal();document.body.classList.add('modal-open');dialog.scrollTop=0;
}
function changeSlide(step){
 slide=(slide+step+activeProject.images.length)%activeProject.images.length;
 const img=document.querySelector('#gallery-image');img.src=activeProject.images[slide];img.alt=`${activeProject.title}: slide ${slide+1} of ${activeProject.slideCount}`;
 document.querySelector('#slide-count').textContent=`Slide ${slide+1} of ${activeProject.slideCount}`;
 document.querySelectorAll('[data-slide]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.slide)===slide)));
}
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();changeSlide(1)}if(e.key==='ArrowLeft'){e.preventDefault();changeSlide(-1)}});
renderGrid();
