/* Dylan Gbenou — portfolio. JavaScript sans dépendance.
   Tout le contenu reste lisible sans JS : ce fichier ajoute
   seulement le menu mobile, les apparitions, la visionneuse et la copie. */
(function(){
  'use strict';
  var doc=document, root=doc.documentElement;
  var reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s,c){return (c||doc).querySelector(s)}
  function $$(s,c){return Array.prototype.slice.call((c||doc).querySelectorAll(s))}

  /* En-tête : filet au défilement et barre de progression */
  var header=$('.site-header'), bar=$('.progress');
  var ticking=false;
  function onScroll(){
    if(ticking) return; ticking=true;
    requestAnimationFrame(function(){
      var y=window.scrollY||0;
      if(header) header.classList.toggle('scrolled',y>8);
      if(bar){
        var h=root.scrollHeight-window.innerHeight;
        bar.style.setProperty('--p',h>0?Math.min(1,y/h).toFixed(4):0);
      }
      ticking=false;
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  onScroll();

  /* Menu mobile */
  var btn=$('.menu-btn'), nav=$('#nav');
  if(btn && nav){
    var label=$('.menu-btn__t',btn);
    function setMenu(open){
      nav.classList.toggle('open',open);
      btn.setAttribute('aria-expanded',open?'true':'false');
      doc.body.classList.toggle('menu-open',open);
      if(label) label.textContent=open?'Fermer':'Menu';
    }
    btn.addEventListener('click',function(){ setMenu(!nav.classList.contains('open')); });
    doc.addEventListener('keydown',function(e){
      if(e.key==='Escape' && nav.classList.contains('open')){ setMenu(false); btn.focus(); }
    });
    $$('a',nav).forEach(function(a){ a.addEventListener('click',function(){ setMenu(false); }); });
    window.addEventListener('resize',function(){ if(window.innerWidth>960 && nav.classList.contains('open')) setMenu(false); });
  }

  /* Apparitions au défilement (une seule fois) */
  var targets=$$('.rv,.measure,.ba,.map,.draw');
  $$('.draw').forEach(function(svg){
    $$('path,line',svg).forEach(function(p){
      try{ var l=Math.ceil(p.getTotalLength()); p.style.setProperty('--len',l); }catch(e){}
    });
  });
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    },{threshold:.15,rootMargin:'0px 0px -5% 0px'});
    $$('.rv').forEach(function(el){
      var sib=el.parentNode?Array.prototype.indexOf.call(el.parentNode.children,el):0;
      el.style.setProperty('--d',((sib%4)*70)+'ms');
    });
    targets.forEach(function(el){ io.observe(el); });
    /* Filet de sécurité : tout est visible après 3,5 s */
    setTimeout(function(){ root.classList.add('reveal-all'); targets.forEach(function(el){ el.classList.add('in'); }); },3500);
  } else {
    root.classList.add('reveal-all');
    targets.forEach(function(el){ el.classList.add('in'); });
  }

  /* Illustrations : jouées quand elles entrent à l'écran sur tactile, au survol sinon */
  if(!reduce && 'IntersectionObserver' in window && !window.matchMedia('(hover:hover)').matches){
    var po=new IntersectionObserver(function(es){
      es.forEach(function(e){ e.target.classList.toggle('play',e.isIntersecting); });
    },{threshold:.6});
    $$('.anim-on').forEach(function(el){ po.observe(el); });
  }

  /* Hero : parallaxe légère au curseur (souris uniquement) */
  var fig=$('.fig');
  if(fig && !reduce && window.matchMedia('(pointer:fine)').matches){
    var heroEl=$('.hero'), img=$('.fig__img',fig), net=$('.fig__net',fig), calls=$$('.call',fig), raf2=null, mx=0, my=0;
    heroEl.addEventListener('pointermove',function(e){
      var r=heroEl.getBoundingClientRect(); mx=(e.clientX-r.left)/r.width-.5; my=(e.clientY-r.top)/r.height-.5;
      if(raf2) return;
      raf2=requestAnimationFrame(function(){
        raf2=null;
        if(img) img.style.transform='translateX(-46%) translate3d('+(mx*-12)+'px,'+(my*-6)+'px,0)';
        if(net) net.style.transform='translate3d('+(mx*10)+'px,'+(my*8)+'px,0)';
        calls.forEach(function(c,i){ c.style.translate=(mx*(i%2?-8:8))+'px '+(my*6)+'px'; });
      });
    });
    heroEl.addEventListener('pointerleave',function(){
      if(img) img.style.transform=''; if(net) net.style.transform=''; calls.forEach(function(c){ c.style.translate=''; });
    });
  }

  /* Copier l'adresse e-mail */
  $$('[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){
      var text=b.getAttribute('data-copy'), lab=$('span',b), old=lab?lab.textContent:'';
      function done(msg){ if(lab){ lab.textContent=msg; setTimeout(function(){ lab.textContent=old; },1800); } }
      function fallback(){
        var code=b.parentNode && $('code',b.parentNode);
        if(code && window.getSelection){ var r=doc.createRange(); r.selectNodeContents(code); var s=window.getSelection(); s.removeAllRanges(); s.addRange(r); }
        done('Sélectionnée');
      }
      try{
        if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(function(){ done('Adresse copiée'); },fallback); }
        else fallback();
      }catch(e){ fallback(); }
    });
  });

  /* Visionneuse de captures */
  var lb=$('#lb');
  if(lb && typeof lb.showModal==='function'){
    var shots=$$('.shot button'), idx=0, im=$('img',lb), cap=$('.lb__cap',lb), opener=null;
    function show(i){
      idx=(i+shots.length)%shots.length; var b=shots[idx];
      im.src=b.getAttribute('data-full'); im.alt=b.getAttribute('data-alt')||''; cap.textContent=b.getAttribute('data-cap')||'';
    }
    shots.forEach(function(b,i){ b.addEventListener('click',function(){ opener=b; show(i); lb.showModal(); }); });
    $('.lb__x',lb).addEventListener('click',function(){ lb.close(); });
    $('.lb__prev',lb).addEventListener('click',function(){ show(idx-1); });
    $('.lb__next',lb).addEventListener('click',function(){ show(idx+1); });
    lb.addEventListener('click',function(e){ if(e.target===lb || e.target.classList.contains('lb__in')) lb.close(); });
    lb.addEventListener('keydown',function(e){ if(e.key==='ArrowRight') show(idx+1); if(e.key==='ArrowLeft') show(idx-1); });
    lb.addEventListener('close',function(){ if(opener) opener.focus(); });
    if(shots.length<2) $$('.lb__prev,.lb__next',lb).forEach(function(b){ b.hidden=true; });
  } else if(lb){
    /* Navigateur sans <dialog> : les boutons ouvrent l'image dans un nouvel onglet */
    $$('.shot button').forEach(function(b){ b.addEventListener('click',function(){ window.open(b.getAttribute('data-full'),'_blank','noopener'); }); });
  }

  /* Sommaire d'étude de cas : chapitre courant */
  var toc=$$('.toc a');
  if(toc.length && 'IntersectionObserver' in window){
    var map={}; toc.forEach(function(a){ map[a.getAttribute('href').slice(1)]=a; });
    var so=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){ toc.forEach(function(a){ a.classList.remove('on'); a.removeAttribute('aria-current'); }); var a=map[e.target.id]; if(a){ a.classList.add('on'); a.setAttribute('aria-current','true'); } }
      });
    },{rootMargin:'-30% 0px -60% 0px'});
    Object.keys(map).forEach(function(id){ var s=doc.getElementById(id); if(s) so.observe(s); });
  }
})();
