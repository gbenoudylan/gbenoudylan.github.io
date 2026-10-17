(function(){
  'use strict';
  var doc=document, root=doc.documentElement;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s,c){return (c||doc).querySelector(s)}
  function $$(s,c){return Array.prototype.slice.call((c||doc).querySelectorAll(s))}

  /* En-tête : filet au scroll + menu mobile */
  var header=$('.site-header');
  function onScroll(){ if(header) header.classList.toggle('scrolled',window.scrollY>8); tlProgress(); }
  var menuBtn=$('.menu-btn'), nav=$('#nav');
  if(menuBtn&&nav){
    menuBtn.addEventListener('click',function(){
      var open=nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded',open?'true':'false');
      menuBtn.querySelector('span').textContent=open?'Fermer':'Menu';
    });
    doc.addEventListener('keydown',function(e){ if(e.key==='Escape'&&nav.classList.contains('open')){menuBtn.click();menuBtn.focus();} });
  }

  /* Apparition douce des cartes */
  var rv=$$('.rv');
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
    },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    rv.forEach(function(el,i){ el.style.setProperty('--d',((i%3)*70)+'ms'); io.observe(el); });
    setTimeout(function(){ root.classList.add('reveal-all'); },4000);
  } else { root.classList.add('reveal-all'); }

  /* Compteurs : le texte final est déjà dans la page, on l'anime depuis zéro */
  function count(el){
    var final=el.getAttribute('data-count'); var target=parseFloat(final); if(isNaN(target)) return;
    var txt=el.textContent; var prefix=el.getAttribute('data-prefix')||''; var suffix=el.getAttribute('data-suffix')||'';
    var dur=1300, t0=null;
    function fmt(n){ return prefix+Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,' ')+suffix; }
    function step(ts){ if(!t0) t0=ts; var p=Math.min(1,(ts-t0)/dur); var e=1-Math.pow(1-p,3); el.textContent=fmt(target*e); if(p<1) requestAnimationFrame(step); else el.textContent=txt; }
    requestAnimationFrame(step);
  }
  var counters=$$('[data-count]');
  if(counters.length){
    if('IntersectionObserver' in window && !reduce){
      var co=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ count(e.target); co.unobserve(e.target);} }); },{threshold:.6});
      counters.forEach(function(c){co.observe(c)});
    }
  }
  /* Barres avant/après */
  var bars=$$('.bars,.route');
  if(bars.length){
    if('IntersectionObserver' in window && !reduce){
      var bo=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); bo.unobserve(e.target);} }); },{threshold:.25});
      bars.forEach(function(b){bo.observe(b)});
    } else bars.forEach(function(b){b.classList.add('in')});
  }

  /* Halo qui suit le pointeur sur les cartes */
  if(!reduce){
    $$('.card').forEach(function(c){
      c.addEventListener('pointermove',function(e){
        var r=c.getBoundingClientRect();
        c.style.setProperty('--mx',(e.clientX-r.left)+'px'); c.style.setProperty('--my',(e.clientY-r.top)+'px');
      });
    });
    /* Léger décalage de la photo et des pastilles */
    var hero=$('.hero');
    if(hero && window.matchMedia('(pointer:fine)').matches){
      var img=$('.portrait__img',hero), floats=$$('.float',hero);
      hero.addEventListener('pointermove',function(e){
        var r=hero.getBoundingClientRect(); var x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        if(img) img.style.transform='translate3d(calc(-50% + '+(x*-14)+'px),'+(y*-8)+'px,0)';
        floats.forEach(function(f,i){ f.style.translate=(x*(i%2?-22:22))+'px '+(y*16)+'px'; });
      });
    }
  }

  /* Filtre des projets */
  var fbar=$('.filters');
  if(fbar){
    var cards=$$('.card[data-cat]'), cnt=$('.count');
    function apply(f){
      var n=0; cards.forEach(function(c){ var show=(f==='all'||c.getAttribute('data-cat')===f); c.hidden=!show; if(show){ if(c.getAttribute('data-cat')!=='more') n++; c.classList.add('in'); } });
      $$('button',fbar).forEach(function(b){ b.setAttribute('aria-pressed',b.getAttribute('data-f')===f?'true':'false'); });
      if(cnt) cnt.textContent=n+(n>1?' projets':' projet');
    }
    fbar.addEventListener('click',function(e){ var b=e.target.closest('button[data-f]'); if(b) apply(b.getAttribute('data-f')); });
    function fromHash(){ var h=(location.hash||'').replace('#',''); apply(['cyber','dev','net'].indexOf(h)>-1?h:'all'); }
    fromHash(); window.addEventListener('hashchange',fromHash);
  }

  /* Copier l'adresse */
  $$('[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){
      var text=b.getAttribute('data-copy'), label=b.querySelector('span'), old=label?label.textContent:'';
      function ok(){ if(label){ label.textContent='Copié'; setTimeout(function(){label.textContent=old},1800);} }
      function fallback(){ var code=b.parentNode.querySelector('code'); if(code&&window.getSelection){ var r=doc.createRange(); r.selectNodeContents(code); var s=window.getSelection(); s.removeAllRanges(); s.addRange(r);} if(label){ label.textContent='Sélectionné'; setTimeout(function(){label.textContent=old},1800);} }
      try{ if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(ok,fallback); } else fallback(); }catch(e){ fallback(); }
    });
  });

  /* Visionneuse d'images */
  var lb=$('#lb');
  if(lb && typeof lb.showModal==='function'){
    var shots=$$('.shot button'), idx=0, im=$('img',lb), cap=$('.lb__cap',lb);
    function show(i){ idx=(i+shots.length)%shots.length; var b=shots[idx]; im.src=b.getAttribute('data-full'); im.alt=b.getAttribute('data-alt')||''; cap.textContent=b.getAttribute('data-cap')||''; }
    shots.forEach(function(b,i){ b.addEventListener('click',function(){ show(i); lb.showModal(); }); });
    $('.lb__x',lb).addEventListener('click',function(){lb.close()});
    $('.lb__prev',lb).addEventListener('click',function(){show(idx-1)});
    $('.lb__next',lb).addEventListener('click',function(){show(idx+1)});
    lb.addEventListener('click',function(e){ if(e.target===lb||e.target.classList.contains('lb__in')) lb.close(); });
    lb.addEventListener('keydown',function(e){ if(e.key==='ArrowRight') show(idx+1); if(e.key==='ArrowLeft') show(idx-1); });
    if(shots.length<2){ $$('.lb__prev,.lb__next',lb).forEach(function(b){b.hidden=true}); }
  }

  /* Ligne de progression de la frise */
  var tl=$('.tl');
  function tlProgress(){
    if(!tl) return; var r=tl.getBoundingClientRect(), vh=window.innerHeight;
    var p=(vh*.6-r.top)/r.height; p=Math.max(0,Math.min(1,p)); tl.style.setProperty('--p',reduce?1:p.toFixed(3));
  }
  window.addEventListener('scroll',onScroll,{passive:true}); window.addEventListener('resize',tlProgress);
  onScroll();
})();
