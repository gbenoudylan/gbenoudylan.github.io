/* Labo : démonstrations interactives (revue d'accès, panne réseau).
   Chargé uniquement sur les pages qui en ont besoin.
   Toutes les données sont fictives. */
(function(){
  'use strict';
  var doc=document;
  var reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EN=doc.documentElement.lang==='en';
  var DICT={"Finance": "Finance", "RH": "HR", "Ventes": "Sales", "IT": "IT", "Support": "Support", "Achats": "Purchasing", "Marketing": "Marketing", "—": "—", "Personnel": "Personal", "Service": "Service", "Générique": "Generic", "Actif": "Active", "Parti": "Left", "ERP": "ERP", "Office 365": "Office 365", "SIRH": "HRIS", "CRM": "CRM", "Active Directory": "Active Directory", "VPN": "VPN", "Ticketing": "Ticketing", "Serveurs": "Servers", "Saisir une facture": "Enter an invoice", "Créer un fournisseur": "Create a supplier", "Valider un paiement": "Approve a payment", "Consulter les dossiers RH": "View HR records", "Modifier un client": "Edit a customer", "Administrateur du domaine": "Domain administrator", "Traiter un ticket": "Handle a ticket", "Créer un bon de commande": "Create a purchase order", "Lecture des sauvegardes": "Read backups", "Exporter les clients": "Export customers", "Réinitialiser un mot de passe": "Reset a password", "Modifier les salaires": "Edit salaries", "Accès VPN": "VPN access", "Créer un compte": "Create an account", "Approuver un accès": "Approve access", "Publier sur le site": "Publish on the website"};
  function t(fr,en){ return EN?(en!==undefined?en:(DICT[fr]||fr)):fr; }
  function el(tag,attrs,html){ var e=doc.createElement(tag); if(attrs) for(var k in attrs){ if(k==='class') e.className=attrs[k]; else e.setAttribute(k,attrs[k]); } if(html!=null) e.innerHTML=html; return e; }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  /* =====================================================================
     1. REVUE D'ACCÈS (données fictives)
     ===================================================================== */
  var ACCOUNTS=[
    {id:'U01',login:'user.01',dept:'Finance',type:'Personnel',hr:'Actif',days:3,sys:['ERP','Office 365'],rights:['Saisir une facture']},
    {id:'U02',login:'user.02',dept:'Finance',type:'Personnel',hr:'Actif',days:1,sys:['ERP'],rights:['Créer un fournisseur','Valider un paiement']},
    {id:'U03',login:'user.03',dept:'RH',type:'Personnel',hr:'Actif',days:8,sys:['SIRH','Office 365'],rights:['Consulter les dossiers RH']},
    {id:'U04',login:'user.04',dept:'Ventes',type:'Personnel',hr:'Actif',days:142,sys:['CRM'],rights:['Modifier un client']},
    {id:'U05',login:'user.05',dept:'IT',type:'Personnel',hr:'Actif',days:0,sys:['Active Directory','VPN'],rights:['Administrateur du domaine']},
    {id:'U06',login:'user.06',dept:'Support',type:'Personnel',hr:'Actif',days:5,sys:['Ticketing'],rights:['Traiter un ticket']},
    {id:'U07',login:'user.07',dept:'Achats',type:'Personnel',hr:'Parti',days:61,sys:['ERP','VPN'],rights:['Créer un bon de commande']},
    {id:'U08',login:'user.08',dept:'Ventes',type:'Personnel',hr:'Actif',days:2,sys:['CRM','Office 365'],rights:['Modifier un client']},
    {id:'U09',login:'svc.backup',dept:'IT',type:'Service',hr:'—',days:0,sys:['Serveurs'],rights:['Lecture des sauvegardes']},
    {id:'U10',login:'user.10',dept:'Finance',type:'Personnel',hr:'Actif',days:12,sys:['ERP'],rights:['Créer un fournisseur','Valider un paiement','Saisir une facture']},
    {id:'U11',login:'user.11',dept:'RH',type:'Personnel',hr:'Actif',days:4,sys:['SIRH'],rights:['Consulter les dossiers RH']},
    {id:'U12',login:'admin.test',dept:'—',type:'Générique',hr:'—',days:310,sys:['Active Directory'],rights:['Administrateur du domaine']},
    {id:'U13',login:'user.13',dept:'Ventes',type:'Personnel',hr:'Actif',days:6,sys:['CRM'],rights:['Exporter les clients']},
    {id:'U14',login:'user.14',dept:'Support',type:'Personnel',hr:'Actif',days:97,sys:['Ticketing','VPN'],rights:['Traiter un ticket']},
    {id:'U15',login:'user.15',dept:'Marketing',type:'Personnel',hr:'Actif',days:9,sys:['Office 365'],rights:['Administrateur du domaine']},
    {id:'U16',login:'user.16',dept:'IT',type:'Personnel',hr:'Actif',days:1,sys:['Active Directory'],rights:['Réinitialiser un mot de passe']},
    {id:'U17',login:'user.17',dept:'Finance',type:'Personnel',hr:'Parti',days:203,sys:['ERP','Office 365'],rights:['Valider un paiement']},
    {id:'U18',login:'user.18',dept:'Achats',type:'Personnel',hr:'Actif',days:3,sys:['ERP'],rights:['Créer un bon de commande']},
    {id:'U19',login:'user.19',dept:'RH',type:'Personnel',hr:'Actif',days:118,sys:['SIRH'],rights:['Modifier les salaires']},
    {id:'U20',login:'stagiaire.tmp',dept:'—',type:'Générique',hr:'—',days:45,sys:['Office 365','VPN'],rights:['Accès VPN']},
    {id:'U21',login:'user.21',dept:'IT',type:'Personnel',hr:'Actif',days:2,sys:['Active Directory','VPN'],rights:['Créer un compte','Approuver un accès']},
    {id:'U22',login:'user.22',dept:'Ventes',type:'Personnel',hr:'Actif',days:7,sys:['CRM'],rights:['Modifier un client']},
    {id:'U23',login:'user.23',dept:'Support',type:'Personnel',hr:'Parti',days:15,sys:['Ticketing'],rights:['Traiter un ticket']},
    {id:'U24',login:'user.24',dept:'Marketing',type:'Personnel',hr:'Actif',days:11,sys:['Office 365'],rights:['Publier sur le site']}
  ];
  var SOD=[['Créer un fournisseur','Valider un paiement'],['Créer un compte','Approuver un accès']];
  var RULES=[
    {k:'dorm',label:t('Comptes dormants (plus de 90 jours)','Dormant accounts (over 90 days)'),w:30,test:function(a){ return a.days>90; },msg:function(a){ return EN?'No sign-in for '+a.days+' days':'Aucune connexion depuis '+a.days+' jours'; }},
    {k:'gone',label:t('Départs encore actifs','Leavers still active'),w:65,test:function(a){ return a.hr==='Parti'; },msg:function(){ return t('Le collaborateur a quitté l’entreprise, le compte est toujours actif','The employee has left the company but the account is still active'); }},
    {k:'sod',label:t('Conflits de séparation des tâches','Segregation-of-duties conflicts'),w:60,test:function(a){ return SOD.some(function(p){ return a.rights.indexOf(p[0])>-1 && a.rights.indexOf(p[1])>-1; }); },msg:function(a){ var p=SOD.filter(function(p){ return a.rights.indexOf(p[0])>-1 && a.rights.indexOf(p[1])>-1; })[0]; return (EN?'Dangerous combination: ':'Cumul dangereux : ')+t(p[0]).toLowerCase()+' + '+t(p[1]).toLowerCase(); }},
    {k:'orph',label:t('Comptes génériques sans propriétaire','Generic accounts with no owner'),w:25,test:function(a){ return a.type==='Générique'; },msg:function(){ return t('Compte générique : personne n’en est responsable','Generic account: nobody is responsible for it'); }},
    {k:'adm',label:t('Droits d’administration hors IT','Admin rights outside IT'),w:30,test:function(a){ return a.rights.indexOf('Administrateur du domaine')>-1 && a.dept!=='IT'; },msg:function(){ return t('Droits d’administration pour un compte hors équipe IT','Admin rights on an account outside the IT team'); }}
  ];
  function level(s){ return s>=80?'crit':s>=60?'high':s>=30?'med':s>0?'low':'ok'; }
  var LVL=EN?{crit:'Critical',high:'High',med:'Medium',low:'Low',ok:'Compliant'}:{crit:'Critique',high:'Élevé',med:'Moyen',low:'Faible',ok:'Conforme'};
  function action(a,lv,hits){
    if(lv==='ok') return [t('Conserver','Keep'),'a-ok'];
    if(hits.indexOf('gone')>-1) return [t('Révoquer immédiatement','Revoke immediately'),'a-rev'];
    if(hits.indexOf('sod')>-1) return [t('Retirer un des deux droits en conflit','Remove one of the two conflicting rights'),'a-rev'];
    if(lv==='crit'||lv==='high') return [t('Désactiver puis confirmer avec le manager','Disable, then confirm with the manager'),'a-rev'];
    return [t('Vérifier avec le manager','Check with the manager'),'a-chk'];
  }

  function initIAM(root){
    var active={dorm:true,gone:true,sod:true,orph:true,adm:true};
    var results=null, running=false, selected=null, onlyAnom=false;
    var body=el('div',{class:'demo__body'});
    var main=el('div',{class:'demo__main'}), side=el('div',{class:'demo__side'});
    var ctrl=el('div',{class:'demo__ctrl'});
    var run=el('button',{type:'button',class:'btn'},'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 5l12 7-12 7z"/></svg><span>'+t('Lancer la revue','Run the review')+'</span>');
    var reset=el('button',{type:'button',class:'btn btn--ghost btn--sm'},t('Réinitialiser','Reset'));
    var only=el('button',{type:'button',class:'btn btn--ghost btn--sm','aria-pressed':'false'},t('Anomalies seulement','Anomalies only'));
    ctrl.appendChild(run); ctrl.appendChild(reset); ctrl.appendChild(only);
    var rules=el('fieldset',{class:'rules'}); rules.style.border='0'; rules.style.padding='0'; rules.style.margin='0 0 16px';
    rules.appendChild(el('legend',{class:'micro',style:'color:var(--mute);margin-bottom:8px;padding:0'},t('Contrôles appliqués','Controls applied')));
    RULES.forEach(function(r){
      var lab=el('label',{class:'rule rule--'+r.k},'<input type="checkbox" checked value="'+r.k+'"><i aria-hidden="true"></i>'+esc(r.label));
      lab.querySelector('input').addEventListener('change',function(e){ active[r.k]=e.target.checked; if(results) compute(true); });
      rules.appendChild(lab);
    });
    var grid=el('div',{class:'acc-grid',role:'list','aria-label':t('Comptes à examiner','Accounts to review')});
    var cells={};
    ACCOUNTS.forEach(function(a){
      var b=el('button',{type:'button',class:'acc',role:'listitem','aria-pressed':'false','aria-label':a.login+', '+t(a.dept)+t('. Cliquez pour voir la fiche.','. Select to see the record.')},'<b>'+a.id+'</b><span>'+esc(a.login)+'</span><span>'+esc(t(a.dept))+'</span><span class="acc__score"></span><span class="acc__tags"></span>');
      b.addEventListener('click',function(){ select(a.id); });
      cells[a.id]=b; grid.appendChild(b);
    });
    var log=el('p',{class:'demo__log',role:'status','aria-live':'polite'},t('24 comptes chargés depuis un export fictif. Choisissez les contrôles, puis lancez la revue.','24 accounts loaded from a fictional export. Choose the controls, then run the review.'));
    var legend=el('div',{class:'legend-sc'},'<span><i style="background:var(--green-t)"></i>'+LVL.low+'</span><span><i style="background:var(--yellow)"></i>'+LVL.med+'</span><span><i style="background:var(--red-t);border-color:var(--red)"></i>'+LVL.high+'</span><span><i style="background:var(--red);border-color:var(--red)"></i>'+LVL.crit+'</span><span><i style="background:#fff;border:2px dashed var(--red)"></i>'+t('Conflit de tâches','Duties conflict')+'</span>');
    main.appendChild(ctrl); main.appendChild(rules); main.appendChild(grid); main.appendChild(legend); main.appendChild(log);
    var res=el('div',{class:'res'}), detail=el('div',{class:'detail'});
    side.appendChild(el('p',{class:'micro',style:'margin:0;color:var(--mute)'},t('Résultat de la revue','Review result')));
    side.appendChild(res); side.appendChild(detail);
    body.appendChild(main); body.appendChild(side); root.appendChild(body);

    function score(a){
      var hits=[], s=0, msgs=[];
      RULES.forEach(function(r){ if(active[r.k] && r.test(a)){ hits.push(r.k); s+=r.w; msgs.push(r.msg(a)); } });
      s=Math.min(100,s); var lv=level(s);
      return {s:s,lv:lv,hits:hits,msgs:msgs,act:action(a,lv,hits)};
    }
    function paint(a,r){
      var c=cells[a.id];
      c.className='acc scanned f-'+r.lv+(r.hits.indexOf('sod')>-1?' f-sod':'')+(onlyAnom && r.lv==='ok'?' dim':'')+(selected===a.id?'':'');
      c.querySelector('.acc__score').textContent=r.s;
      c.querySelector('.acc__tags').innerHTML=r.hits.map(function(h){ return '<i class="t-'+h+'"></i>'; }).join('');
      c.setAttribute('aria-label',a.login+', '+t(a.dept)+'. Score '+r.s+(EN?' out of 100, ':' sur 100, ')+LVL[r.lv]+t('. Cliquez pour voir la fiche.','. Select to see the record.'));
    }
    function summary(){
      if(!results){ res.innerHTML=EN?'<div><b>24</b><span>accounts to review</span></div><div><b>—</b><span>anomalies</span></div><div><b>—</b><span>to revoke</span></div><div><b>—</b><span>compliant</span></div>':'<div><b>24</b><span>comptes à examiner</span></div><div><b>—</b><span>anomalies</span></div><div><b>—</b><span>à révoquer</span></div><div><b>—</b><span>conformes</span></div>'; return; }
      var n=0,rev=0,chk=0,ok=0,sod=0;
      ACCOUNTS.forEach(function(a){ var r=results[a.id]; if(r.lv!=='ok') n++; if(r.act[1]==='a-rev') rev++; else if(r.act[1]==='a-chk') chk++; else ok++; if(r.hits.indexOf('sod')>-1) sod++; });
      res.innerHTML='<div class="r-red"><b>'+rev+'</b><span>'+t('à révoquer ou corriger','to revoke or fix')+'</span></div><div class="r-y"><b>'+chk+'</b><span>'+t('à vérifier avec le manager','to check with the manager')+'</span></div><div class="r-g"><b>'+ok+'</b><span>'+t('conformes','compliant')+'</span></div><div><b>'+sod+'</b><span>'+t('conflits de séparation des tâches','segregation-of-duties conflicts')+'</span></div>';
      log.textContent=EN?'Review complete: '+n+' of 24 accounts show at least one anomaly. Select an account to see why.':'Revue terminée : '+n+' comptes sur 24 présentent au moins une anomalie. Cliquez sur un compte pour voir pourquoi.';
    }
    function showDetail(id){
      var a=ACCOUNTS.filter(function(x){ return x.id===id; })[0]; if(!a){ detail.innerHTML='<p style="margin:0;color:var(--mute)">'+t('Cliquez sur un compte pour afficher sa fiche : système, droits, dernière connexion, statut RH et décision proposée.','Select an account to see its record: systems, rights, last sign-in, HR status and proposed decision.')+'</p>'; return; }
      var r=results?results[id]:null;
      var html='<span class="micro" style="color:var(--mute)">'+t('Fiche','Record')+' '+a.id+(r?' · score '+r.s+'/100 · '+LVL[r.lv]:'')+'</span><h3>'+esc(a.login)+'</h3><dl><dt>'+t('Service','Department')+'</dt><dd>'+esc(t(a.dept))+'</dd><dt>Type</dt><dd>'+esc(t(a.type))+'</dd><dt>'+t('Statut RH','HR status')+'</dt><dd>'+esc(t(a.hr))+'</dd><dt>'+t('Dernière connexion','Last sign-in')+'</dt><dd>'+(EN?a.days+' days ago':'il y a '+a.days+' j')+'</dd><dt>'+t('Systèmes','Systems')+'</dt><dd>'+esc(a.sys.map(function(x){return t(x);}).join(', '))+'</dd><dt>'+t('Droits','Rights')+'</dt><dd>'+esc(a.rights.map(function(x){return t(x);}).join(', '))+'</dd></dl>';
      if(r){
        html+= r.msgs.length ? '<ul>'+r.msgs.map(function(m){ return '<li><span class="anom" aria-hidden="true"></span>'+esc(m)+'</li>'; }).join('')+'</ul>' : '<ul><li><span class="ok-dot" aria-hidden="true" style="margin-top:.4em"></span>'+t('Aucune anomalie pour les contrôles choisis','No anomaly for the selected controls')+'</li></ul>';
        html+='<p class="detail__act '+r.act[1]+'">'+t('Décision proposée : ','Proposed decision: ')+r.act[0]+'</p>';
      } else html+='<p style="margin:10px 0 0;color:var(--mute);font-size:.85rem">'+t('Lancez la revue pour calculer le score de ce compte.','Run the review to compute this account\u2019s score.')+'</p>';
      detail.innerHTML=html;
    }
    function select(id){
      selected=id;
      Object.keys(cells).forEach(function(k){ cells[k].setAttribute('aria-pressed',k===id?'true':'false'); });
      showDetail(id);
    }
    function compute(instant){
      results={};
      ACCOUNTS.forEach(function(a){ results[a.id]=score(a); });
      if(instant || reduce){ ACCOUNTS.forEach(function(a){ paint(a,results[a.id]); }); summary(); if(selected) showDetail(selected); return; }
      running=true; run.disabled=true; log.textContent=t('Lecture de l’export, application des contrôles…','Reading the export, applying the controls…');
      var i=0;
      (function next(){
        if(i>0){ var p=ACCOUNTS[i-1]; cells[p.id].classList.remove('scan'); paint(p,results[p.id]); }
        if(i>=ACCOUNTS.length){ running=false; run.disabled=false; run.querySelector('span').textContent=t('Relancer la revue','Run the review again'); summary(); if(selected) showDetail(selected); return; }
        cells[ACCOUNTS[i].id].classList.add('scan'); i++; setTimeout(next,70);
      })();
    }
    run.addEventListener('click',function(){ if(!running) compute(false); });
    reset.addEventListener('click',function(){
      results=null; selected=null; onlyAnom=false; only.setAttribute('aria-pressed','false');
      Object.keys(cells).forEach(function(k){ var c=cells[k]; c.className='acc'; c.setAttribute('aria-pressed','false'); c.querySelector('.acc__score').textContent=''; c.querySelector('.acc__tags').innerHTML=''; });
      run.querySelector('span').textContent=t('Lancer la revue','Run the review');
      log.textContent=t('24 comptes chargés depuis un export fictif. Choisissez les contrôles, puis lancez la revue.','24 accounts loaded from a fictional export. Choose the controls, then run the review.');
      summary(); showDetail(null);
    });
    only.addEventListener('click',function(){
      onlyAnom=!onlyAnom; only.setAttribute('aria-pressed',onlyAnom?'true':'false');
      if(results) ACCOUNTS.forEach(function(a){ paint(a,results[a.id]); });
    });
    summary(); showDetail(null);
  }

  /* =====================================================================
     2. SIMULATEUR DE PANNE (double attachement)
     ===================================================================== */
  function initSim(root){
    var NS='http://www.w3.org/2000/svg';
    var N={
      inet:{x:400,y:34,w:130,label:'Internet'},
      r1:{x:270,y:104,w:120,label:t('Routeur C8200L','C8200L router')}, r2:{x:530,y:104,w:120,label:t('Routeur C8200L','C8200L router')},
      core:{x:400,y:178,w:170,label:t('Cœur · pile C9300X','Core · C9300X stack')},
      d1:{x:290,y:254,w:150,label:'Distribution 1'}, d2:{x:510,y:254,w:150,label:'Distribution 2'}
    };
    for(var i=1;i<=9;i++) N['a'+i]={x:60+(i-1)*85,y:360,w:66,label:'C9200 · '+i,acc:true};
    var L=[['inet','r1'],['inet','r2'],['r1','core'],['r2','core'],['core','d1'],['core','d2']];
    for(i=1;i<=9;i++){ L.push(['d1','a'+i]); L.push(['d2','a'+i]); }
    var cut={}, src='a5', down={};
    function key(l){ return l[0]+'-'+l[1]; }

    var svg=doc.createElementNS(NS,'svg'); svg.setAttribute('viewBox','0 0 800 400'); svg.setAttribute('role','group'); svg.setAttribute('aria-label',t('Architecture réseau interactive : cliquez un lien pour le couper, un switch d’accès pour en faire la source du trafic','Interactive network architecture: select a link to cut it, or an access switch to make it the traffic source'));
    function s(tag,attrs){ var e=doc.createElementNS(NS,tag); for(var k in attrs) e.setAttribute(k,attrs[k]); return e; }
    [[t('BORDURE','EDGE'),108],[t('CŒUR','CORE'),182],['DISTRIBUTION',258],[t('ACCÈS','ACCESS'),320]].forEach(function(t){ var tx=s('text',{x:8,y:t[1],class:'layer-t'}); tx.textContent=t[0]; svg.appendChild(tx); });
    var gl=s('g',{}), gn=s('g',{}); svg.appendChild(gl); svg.appendChild(gn);
    var linkEls={};
    L.forEach(function(l){
      var a=N[l[0]], b=N[l[1]];
      var y1=a.y+14, y2=b.y-14;
      var hit=s('line',{x1:a.x,y1:y1,x2:b.x,y2:y2,class:'lk-hit',tabindex:'0',role:'button','aria-label':(EN?'Link from ':'Lien ')+a.label+(EN?' to ':' vers ')+b.label+t('. Appuyez pour le couper ou le rétablir.','. Press to cut or restore it.')});
      var ln=s('line',{x1:a.x,y1:y1,x2:b.x,y2:y2,class:'lk'});
      function toggle(){ cut[key(l)]=!cut[key(l)]; hit.setAttribute('aria-pressed',cut[key(l)]?'true':'false'); update(); }
      hit.addEventListener('click',toggle);
      hit.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggle(); } });
      gl.appendChild(hit); gl.appendChild(ln); linkEls[key(l)]=ln;
    });
    var nodeEls={};
    Object.keys(N).forEach(function(k){
      var n=N[k], g=s('g',{class:'dev'}), h=28;
      g.appendChild(s('rect',{x:n.x-n.w/2,y:n.y-h/2,width:n.w,height:h,rx:6}));
      var tl=s('text',{x:n.x,y:n.y+4,'text-anchor':'middle'}); tl.textContent=n.acc?String(k.slice(1)):n.label; g.appendChild(tl);
      if(n.acc){
        g.setAttribute('tabindex','0'); g.setAttribute('role','button'); g.setAttribute('aria-label',(EN?'Access switch ':'Switch d’accès ')+k.slice(1)+t('. Appuyez pour en faire la source du trafic.','. Press to make it the traffic source.')); g.style.cursor='pointer';
        var pick=function(){ src=k; update(); };
        g.addEventListener('click',pick); g.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); pick(); } });
      }
      gn.appendChild(g); nodeEls[k]=g;
    });
    var accLab=s('text',{x:400,y:396,'text-anchor':'middle',class:'layer-t'}); accLab.textContent=t('9 SWITCHES D’ACCÈS C9200 · CLIQUEZ POUR CHOISIR LA SOURCE','9 C9200 ACCESS SWITCHES · SELECT ONE TO CHOOSE THE SOURCE'); svg.appendChild(accLab);
    var pkt=s('circle',{r:6,class:'pkt',cx:-20,cy:-20}); svg.appendChild(pkt);

    var stage=el('div',{class:'sim__stage'}); stage.appendChild(svg);
    var info=el('div',{class:'sim__info'});
    var status=el('p',{role:'status','aria-live':'polite'});
    var btns=el('div',{class:'sim__btns'});
    var bD1=el('button',{type:'button',class:'btn btn--line-light btn--sm'},t('Panne de la distribution 1','Distribution 1 failure'));
    var bR1=el('button',{type:'button',class:'btn btn--line-light btn--sm'},t('Panne du routeur 1','Router 1 failure'));
    var bRst=el('button',{type:'button',class:'btn btn--sun btn--sm'},t('Tout rétablir','Restore everything'));
    btns.appendChild(bD1); btns.appendChild(bR1); btns.appendChild(bRst);
    info.appendChild(status); info.appendChild(btns);
    root.appendChild(stage); root.appendChild(info);

    function linkUp(l){ return !cut[key(l)] && !down[l[0]] && !down[l[1]]; }
    function path(){
      var prev={}; prev[src]=null; var q=[src];
      while(q.length){
        var u=q.shift(); if(u==='inet') break;
        L.forEach(function(l){
          if(!linkUp(l)) return;
          var v=l[0]===u?l[1]:l[1]===u?l[0]:null;
          if(v && !(v in prev) && !(N[v].acc && v!==src)){ prev[v]=u; q.push(v); }
        });
      }
      if(!('inet' in prev)) return null;
      var p=[], c='inet'; while(c){ p.unshift(c); c=prev[c]; } return p;
    }
    function name(k){ return N[k].acc?'switch '+k.slice(1):k==='inet'?'Internet':k==='core'?t('cœur','core'):k==='d1'?'distribution 1':k==='d2'?'distribution 2':k==='r1'?t('routeur 1','router 1'):t('routeur 2','router 2'); }
    var cur=null;
    function update(){
      Object.keys(nodeEls).forEach(function(k){ var g=nodeEls[k]; g.setAttribute('class','dev'+(k===src?' src':'')+(down[k]?' down':'')); });
      var p=path(); cur=p;
      L.forEach(function(l){
        var on=false;
        if(p) for(var i=0;i<p.length-1;i++){ if((p[i]===l[0]&&p[i+1]===l[1])||(p[i]===l[1]&&p[i+1]===l[0])) on=true; }
        linkEls[key(l)].setAttribute('class','lk'+(on?' active':'')+(!linkUp(l)?' cut':''));
      });
      var nCut=Object.keys(cut).filter(function(k){ return cut[k]; }).length+Object.keys(down).filter(function(k){ return down[k]; }).length;
      if(p){
        status.innerHTML=EN?'<span class="sim__status ok">Traffic routed.</span> Active path: '+p.map(name).join(' → ')+'.'+(nCut?' Despite '+nCut+' failure'+(nCut>1?'s':'')+', dual-homing found another path.':' Cut a link to see the traffic switch over.'):'<span class="sim__status ok">Trafic acheminé.</span> Chemin actif : '+p.map(name).join(' → ')+'.'+(nCut?' Malgré '+nCut+' panne'+(nCut>1?'s':'')+', le double attachement a trouvé un autre chemin.':' Coupez un lien pour voir le trafic basculer.');
      } else {
        status.innerHTML=EN?'<span class="sim__status ko">Switch '+src.slice(1)+' isolated.</span> No path left to the Internet: it would have needed a third link, or one of the two to hold.':'<span class="sim__status ko">Switch '+src.slice(1)+' isolé.</span> Plus aucun chemin vers Internet : il aurait fallu un troisième lien, ou qu’un des deux tienne.';
      }
      restartPkt();
    }
    /* Paquet animé le long du chemin, seulement quand le simulateur est visible */
    var raf=null, t0=0, visible=false;
    function pos(p,t){
      var pts=p.map(function(k){ return N[k]; }); var seg=pts.length-1; var f=t*seg; var i=Math.min(seg-1,Math.floor(f)); var r=f-i;
      var a=pts[i], b=pts[i+1]; return [a.x+(b.x-a.x)*r, (a.y-14)+((b.y+14)-(a.y-14))*r];
    }
    function frame(ts){
      if(!cur||!visible){ pkt.setAttribute('cx',-20); raf=null; return; }
      if(!t0) t0=ts; var ph=((ts-t0)/1800)%1; var xy=pos(cur,ph);
      pkt.setAttribute('cx',xy[0]); pkt.setAttribute('cy',xy[1]); raf=requestAnimationFrame(frame);
    }
    function restartPkt(){
      if(reduce){ pkt.setAttribute('cx',-20); return; }
      t0=0; if(!raf && visible) raf=requestAnimationFrame(frame);
    }
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){ es.forEach(function(e){ visible=e.isIntersecting; if(visible) restartPkt(); }); },{threshold:.2}).observe(root);
    }
    bD1.addEventListener('click',function(){ down.d1=!down.d1; bD1.setAttribute('aria-pressed',down.d1?'true':'false'); update(); });
    bR1.addEventListener('click',function(){ down.r1=!down.r1; bR1.setAttribute('aria-pressed',down.r1?'true':'false'); update(); });
    bRst.addEventListener('click',function(){ cut={}; down={}; bD1.setAttribute('aria-pressed','false'); bR1.setAttribute('aria-pressed','false'); $$hits(); update(); });
    function $$hits(){ Array.prototype.forEach.call(svg.querySelectorAll('.lk-hit'),function(h){ h.setAttribute('aria-pressed','false'); }); }
    update();
  }

  Array.prototype.forEach.call(doc.querySelectorAll('[data-demo="iam"]'),initIAM);
  Array.prototype.forEach.call(doc.querySelectorAll('[data-sim="net"]'),initSim);
})();
