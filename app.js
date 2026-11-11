(function(){
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var mb=document.querySelector('.menu-btn'),nl=document.querySelector('.nav ul');
  if(mb&&nl){mb.addEventListener('click',function(){var o=nl.classList.toggle('open');mb.setAttribute('aria-expanded',o)})}

  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15}):null;
  document.querySelectorAll('.reveal').forEach(function(el){io?io.observe(el):el.classList.add('in')});


  /* about: count-up numbers */
  var cs=document.querySelectorAll('[data-count]');
  if(cs.length&&!reduce&&'IntersectionObserver' in window){
    var co=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;co.unobserve(e.target);var el=e.target,to=+el.getAttribute('data-count'),t0=null;
      function step(t){if(!t0)t0=t;var p=Math.min((t-t0)/1100,1);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step)}
      el.textContent='0';requestAnimationFrame(step)})},{threshold:.6});
    cs.forEach(function(el){co.observe(el)});
  }

  /* hero: interactive app window */
  var win=document.getElementById('dpwin');
  if(win){
    var all=[].slice.call(win.querySelectorAll('.dprow[data-i]'));
    var master=[].slice.call(win.querySelectorAll('#pg-tasks .dprow[data-i]'));
    var cnts=[].slice.call(win.querySelectorAll('.cnt')),bars=[].slice.call(win.querySelectorAll('.bar'));
    var sub=document.getElementById('dpsubmit'),rep=document.getElementById('dpreplay'),hint=document.getElementById('dphint');
    var navs=[].slice.call(win.querySelectorAll('.nv')),tabs=[].slice.call(win.querySelectorAll('.stabs button'));
    var tp=document.getElementById('pg-tasks'),total=master.length;
    function done(){return master.filter(function(r){return r.classList.contains('fin')}).length}
    var tourOn=false;
    function say(){
      if(tourOn){hint.textContent='Watch it run, then try it yourself.';return}
      var pg=win.getAttribute('data-pg'),closed=win.classList.contains('closed');
      var dl=document.getElementById('pg-dash').getAttribute('data-lvl');var t={dash:dl==='all'?'Company first, then department, then person. Tap a department to open it.':'Each person in the department, with their own numbers.',
        plan:'Try it: tap Pending to complete a task, explore the sidebar, then press Submit day.'};
      var sb=tp.getAttribute('data-sub');
      var ts={my:'Tap Pending to mark a task completed.',team:'A manager sees every task in their team.',appr:'Completed work waits here. Tap Approve to mark it Done.'};
      var m=pg==='tasks'?ts[sb]:t[pg];
      if(closed&&(pg==='plan'||(pg==='tasks'&&sb==='my')))m=done()===total?'The day is closed and every entry is now read-only.':'The day is closed. Tasks left pending stay pending, and nothing can be edited.';
      hint.textContent=m;
    }
    function set(){var n=done();cnts.forEach(function(c){c.textContent=n+' of '+total+' completed'});bars.forEach(function(b){b.style.width=Math.round(n/total*100)+'%'});
      all.forEach(function(r){var f=master[r.getAttribute('data-i')].classList.contains('fin');r.classList.toggle('fin',f)})}
    function go(pg){win.setAttribute('data-pg',pg);navs.forEach(function(n){n.classList.toggle('on',n.getAttribute('data-go')===pg)});say()}
    function sb2(k){tp.setAttribute('data-sub',k);tabs.forEach(function(t){t.classList.toggle('on',t.getAttribute('data-sub')===k)});say()}
    function closeDay(){win.classList.add('sent');setTimeout(function(){win.classList.add('closed');say()},400)}
    function reset(){win.classList.remove('sent','closed');master.forEach(function(r){r.classList.remove('fin')});set();
      win.querySelectorAll('.ap').forEach(function(r){r.classList.remove('ok')});
      dlv('all');
      sb2('my');go('plan')}
    var dpg=document.getElementById('pg-dash');
    function dlv(k){dpg.setAttribute('data-lvl',k==='all'?'all':'dep');dpg.querySelectorAll('.ddet').forEach(function(x){x.classList.toggle('show',x.getAttribute('data-d')===k)});say()}
    dpg.querySelectorAll('.dc[data-d]').forEach(function(c){c.addEventListener('click',function(){dlv(c.getAttribute('data-d'))})});
    dpg.querySelectorAll('.back').forEach(function(c){c.addEventListener('click',function(){dlv('all')})});
    all.forEach(function(r){
      r.querySelector('.cp').addEventListener('click',function(){
        if(win.classList.contains('closed'))return;
        master[r.getAttribute('data-i')].classList.add('fin');set();
      });
    });
    navs.forEach(function(n){
      function f(){go(n.getAttribute('data-go'))}
      n.addEventListener('click',f);
      n.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();f()}});
    });
    tabs.forEach(function(t){t.addEventListener('click',function(){sb2(t.getAttribute('data-sub'))})});
    win.querySelectorAll('.apbtn').forEach(function(b){b.addEventListener('click',function(){b.closest('.ap').classList.add('ok')})});
        sub.addEventListener('click',function(){if(win.classList.contains('closed'))return;closeDay()});
    rep.addEventListener('click',reset);
    reset();
    var tt=[];
    function tstop(){tt.forEach(clearTimeout);tt=[];if(tourOn){tourOn=false;say()}}
    function tat(f,ms){tt.push(setTimeout(f,ms))}
    ['pointerdown','keydown','focusin'].forEach(function(ev){win.addEventListener(ev,tstop)});
    if(!reduce){
      tourOn=true;say();
      [0,1,2].forEach(function(i){tat(function(){master[i].classList.add('fin');set()},1100+i*700)});
      tat(function(){go('dash')},3600);
      tat(function(){dlv('0')},5000);
      tat(function(){dlv('all');go('tasks');sb2('appr')},6600);
      tat(function(){win.querySelector('.ap').classList.add('ok')},7800);
      tat(function(){tourOn=false;reset()},9400);
    }
  }

  /* who it helps */
  var ben=document.getElementById('ben');
  if(ben){
    var bts=[].slice.call(ben.querySelectorAll('.bt button'));
    function sel(k){ben.setAttribute('data-sel',k);bts.forEach(function(b){b.setAttribute('aria-selected',b.getAttribute('data-b')===k?'true':'false')})}
    bts.forEach(function(b){b.addEventListener('click',function(){sel(b.getAttribute('data-b'))})});
    sel('o');
  }

  /* who it's for */
  var fit=document.getElementById('fit');
  if(fit){
    var items=[].slice.call(fit.querySelectorAll('.fi')),res=document.getElementById('fitres'),rt=res.querySelector('p');
    function upd(){
      var on=items.filter(function(i){return i.getAttribute('aria-pressed')==='true'});
      res.classList.toggle('ok',on.length>=1);
      rt.textContent=on.length===0?'Tap any that sound familiar.':'This is exactly what Efiva was built for. A 15-minute demo will show you how.';
      try{sessionStorage.setItem('efiva_issues',JSON.stringify(on.map(function(i){return i.textContent.trim()})))}catch(e){}
    }
    items.forEach(function(i){i.addEventListener('click',function(){i.setAttribute('aria-pressed',i.getAttribute('aria-pressed')==='true'?'false':'true');upd()})});
    upd();
  }

  /* pricing selector */
  var data={
    s30:{Standard:6000,Tailored:8000,Custom:11000},
    s60:{Standard:9000,Tailored:11000,Custom:14000},
    s100:{Standard:13000,Tailored:15000,Custom:18000},
    s100p:null
  };
  var radios=document.querySelectorAll('input[name=size]');
  function fmt(n){return '₹'+n.toLocaleString('en-IN')}
  function render(key){
    document.querySelectorAll('[data-plan]').forEach(function(card){
      var plan=card.getAttribute('data-plan'),pe=card.querySelector('.price'),per=card.querySelector('.per');
      if(data[key]){pe.textContent=fmt(data[key][plan]);per.style.visibility='visible'}
      else{pe.textContent='Talk to us';per.style.visibility='hidden'}
    });
  }
  radios.forEach(function(r){r.addEventListener('change',function(){render(r.value)})});
  var chk=document.querySelector('input[name=size]:checked');if(chk)render(chk.value);

  /* contact: tabs, day and time pickers, problems, Web3Forms */
  var wfs=[].slice.call(document.querySelectorAll('form.wf'));
  if(wfs.length){
    var chal=document.getElementById('chal');
    try{var saved=JSON.parse(sessionStorage.getItem('efiva_issues')||'[]');if(chal&&saved.length)chal.value=saved.join('; ')}catch(e){}
    wfs.forEach(function(f){
      f.addEventListener('submit',function(e){
        e.preventDefault();
        var msg=f.querySelector('.fmsg'),btn=f.querySelector('button[type=submit]');
        btn.disabled=true;msg.textContent='Sending…';
        fetch('https://api.web3forms.com/submit',{method:'POST',body:new FormData(f)})
          .then(function(r){return r.json()})
          .then(function(j){
            if(j.success){msg.textContent='Thanks. We will reach out within one working day to agree a time.';f.reset()}
            else{msg.textContent='That did not send. Message us on WhatsApp instead.'}
            btn.disabled=false;
          })
          .catch(function(){msg.textContent='That did not send. Message us on WhatsApp instead.';btn.disabled=false});
      });
    });
  }
})();
