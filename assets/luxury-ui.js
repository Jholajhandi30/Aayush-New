(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;

  document.body.classList.add('lux-page-enter');
  requestAnimationFrame(()=>document.body.classList.add('lux-loaded'));

  const main=document.querySelector('main');
  if(main){
    if(!main.id)main.id='main-content';
    if(!document.querySelector('.lux-skip-link')){
      const skip=document.createElement('a');
      skip.className='lux-skip-link';
      skip.href='#'+main.id;
      skip.textContent='Skip to main content';
      document.body.prepend(skip);
      if(!document.getElementById('lux-skip-style')){
        const style=document.createElement('style');
        style.id='lux-skip-style';
        style.textContent='.lux-skip-link{position:fixed;z-index:9999;left:16px;top:12px;transform:translateY(-160%);padding:10px 14px;border:1px solid #d8b27488;border-radius:999px;background:#0b0907;color:#f3d49b;font:600 13px/1.2 system-ui,sans-serif;letter-spacing:.04em;text-decoration:none;box-shadow:0 12px 34px #0008;transition:transform .18s ease}.lux-skip-link:focus{transform:translateY(0);outline:2px solid #f3d49b;outline-offset:3px}@media(prefers-reduced-motion:reduce){.lux-skip-link{transition:none}}';
        document.head.appendChild(style);
      }
    }
  }

  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  document.querySelectorAll('nav a[href],.nav a[href],.top a[href]').forEach(a=>{
    const raw=(a.getAttribute('href')||'').split('?')[0].split('#')[0];
    if(!raw||raw.startsWith('http')||raw.startsWith('mailto:')||raw.startsWith('tel:'))return;
    const target=(raw.split('/').pop()||'index.html').toLowerCase();
    if(target===path)a.setAttribute('aria-current','page');
  });

  document.querySelectorAll('a[target="_blank"]').forEach(a=>{
    const rel=new Set((a.getAttribute('rel')||'').split(/\s+/).filter(Boolean));
    rel.add('noopener');
    rel.add('noreferrer');
    a.setAttribute('rel',[...rel].join(' '));
  });

  document.querySelectorAll('img').forEach(img=>{
    if(img.getAttribute('loading')==='lazy'){
      if(!img.hasAttribute('decoding'))img.decoding='async';
      if(!img.hasAttribute('fetchpriority'))img.setAttribute('fetchpriority','low');
    }
    const fail=()=>{
      if(img.dataset.luxFailed==='1')return;
      img.dataset.luxFailed='1';
      img.classList.add('lux-img-broken');
      const host=img.closest('.pic,.photo,.shot,.card,.room-card,.look,.reel,.palace-visual,figure')||img.parentElement;
      if(!host)return;
      host.classList.add('lux-image-failed');
      if(!host.querySelector('.lux-image-note')){
        const note=document.createElement('span');
        note.className='lux-image-note';
        note.textContent='Image temporarily unavailable';
        note.setAttribute('aria-hidden','true');
        host.appendChild(note);
      }
    };
    img.addEventListener('error',fail,{once:true});
    if(img.complete&&img.naturalWidth===0)fail();
  });

  let menuButton=document.querySelector('#menu,.menu,[data-menu-toggle]');
  const menuPanel=document.querySelector('#navlinks,.navlinks,[data-menu-panel]');
  let syntheticMenu=false;

  if(!menuButton&&menuPanel){
    const nav=menuPanel.closest('nav,.nav,.top');
    if(nav){
      syntheticMenu=true;
      nav.classList.add('lux-mobile-nav');
      menuPanel.classList.add('lux-mobile-panel');
      menuButton=document.createElement('button');
      menuButton.type='button';
      menuButton.className='lux-menu-button';
      menuButton.setAttribute('aria-label','Open navigation');
      menuButton.innerHTML='<span></span><span></span><span></span>';
      nav.insertBefore(menuButton,menuPanel);

      if(!document.getElementById('lux-mobile-nav-style')){
        const style=document.createElement('style');
        style.id='lux-mobile-nav-style';
        style.textContent=`
          .lux-menu-button{display:none;border:1px solid #d8b27455;background:#ffffff08;color:inherit;width:44px;height:44px;border-radius:999px;padding:0;cursor:pointer;place-items:center;align-content:center;gap:4px;flex:0 0 auto}
          .lux-menu-button span{display:block;width:17px;height:1px;background:currentColor;transition:transform .24s ease,opacity .2s ease}
          .lux-menu-button[aria-expanded="true"] span:nth-child(1){transform:translateY(5px) rotate(45deg)}
          .lux-menu-button[aria-expanded="true"] span:nth-child(2){opacity:0}
          .lux-menu-button[aria-expanded="true"] span:nth-child(3){transform:translateY(-5px) rotate(-45deg)}
          @media(max-width:980px){
            .lux-mobile-nav{position:sticky!important;top:0!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:space-between!important;gap:14px!important;padding:12px 16px!important;overflow:visible!important}
            .lux-mobile-nav .lux-menu-button{display:grid}
            .lux-mobile-nav .lux-mobile-panel{display:none!important;position:absolute!important;z-index:60!important;left:12px!important;right:12px!important;top:calc(100% + 8px)!important;width:auto!important;max-height:calc(100svh - 86px)!important;overflow:auto!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;gap:4px!important;padding:10px!important;border:1px solid #d8b27438!important;border-radius:18px!important;background:#0b0907f7!important;box-shadow:0 24px 70px #0008!important;backdrop-filter:blur(22px)!important;white-space:normal!important}
            .lux-mobile-nav .lux-mobile-panel.open{display:flex!important}
            .lux-mobile-nav .lux-mobile-panel a{display:flex!important;align-items:center!important;min-height:44px!important;width:100%!important;padding:11px 13px!important;border:0!important;border-radius:11px!important;color:#f2eee8!important;letter-spacing:.08em!important}
            .lux-mobile-nav .lux-mobile-panel a[aria-current="page"]{background:#d8b27416!important;color:#e8c98f!important}
            .lux-mobile-nav .lux-mobile-panel a:last-child{justify-content:center!important;margin-top:4px!important;border:1px solid #d8b27455!important;color:#e8c98f!important}
          }
          @media(prefers-reduced-motion:reduce){.lux-menu-button span{transition:none}}
        `;
        document.head.appendChild(style);
      }
    }
  }

  let menuOpen=false,bodyOverflow='',bodyPadding='';
  const isMobileNav=()=>matchMedia('(max-width: 980px)').matches;
  const lockBody=()=>{
    if(menuOpen||!isMobileNav())return;
    bodyOverflow=document.body.style.overflow;
    bodyPadding=document.body.style.paddingRight;
    const gap=Math.max(0,innerWidth-document.documentElement.clientWidth);
    document.body.style.overflow='hidden';
    if(gap)document.body.style.paddingRight=gap+'px';
  };
  const unlockBody=()=>{
    document.body.style.overflow=bodyOverflow;
    document.body.style.paddingRight=bodyPadding;
  };

  if(menuButton&&menuPanel){
    if(!menuPanel.id)menuPanel.id='lux-mobile-navigation';
    menuButton.setAttribute('aria-controls',menuPanel.id);
    if(!menuButton.hasAttribute('aria-expanded'))menuButton.setAttribute('aria-expanded','false');

    if(syntheticMenu){
      menuButton.addEventListener('click',()=>menuPanel.classList.toggle('open'));
    }

    let wasOpen=false;
    const syncMenu=()=>{
      const open=menuPanel.classList.contains('open')||menuPanel.classList.contains('active')||menuPanel.getAttribute('data-open')==='true';
      const mobile=isMobileNav();
      menuButton.setAttribute('aria-expanded',String(open));
      menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');
      if(mobile&&!open){
        menuPanel.setAttribute('aria-hidden','true');
        menuPanel.inert=true;
      }else{
        menuPanel.removeAttribute('aria-hidden');
        menuPanel.inert=false;
      }
      if(open&&!wasOpen){
        lockBody();
        const first=menuPanel.querySelector('a[href],button:not([disabled])');
        if(first&&mobile)requestAnimationFrame(()=>first.focus({preventScroll:true}));
      }else if(!open&&wasOpen){
        unlockBody();
      }
      menuOpen=open;
      wasOpen=open;
    };

    menuButton.addEventListener('click',()=>requestAnimationFrame(syncMenu));
    menuPanel.querySelectorAll('a[href]').forEach(link=>link.addEventListener('click',()=>{
      if(syntheticMenu&&isMobileNav())menuPanel.classList.remove('open');
      requestAnimationFrame(syncMenu);
    }));
    new MutationObserver(syncMenu).observe(menuPanel,{attributes:true,attributeFilter:['class','data-open']});

    document.addEventListener('pointerdown',e=>{
      if(!menuOpen||menuPanel.contains(e.target)||menuButton.contains(e.target))return;
      if(syntheticMenu)menuPanel.classList.remove('open');
      else menuButton.click();
      requestAnimationFrame(syncMenu);
    },{passive:true});

    document.addEventListener('keydown',e=>{
      if(e.key!=='Tab'||!menuOpen||!isMobileNav())return;
      const focusable=[...menuPanel.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>!el.hidden&&el.getClientRects().length);
      if(!focusable.length)return;
      const first=focusable[0],last=focusable[focusable.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    });
    syncMenu();
  }

  const reveal=[...document.querySelectorAll('section,.card,.production,.shot,.room-card,.look,.reel,.step')].filter(el=>!el.hidden);
  reveal.forEach(el=>el.classList.add('lux-reveal'));
  if(!reduce&&'IntersectionObserver'in window){
    const io=new IntersectionObserver(es=>es.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('lux-in');io.unobserve(e.target);}
    }),{threshold:.1,rootMargin:'0px 0px -5%'});
    reveal.forEach(el=>io.observe(el));
  }else reveal.forEach(el=>el.classList.add('lux-in'));

  const tilt=[...document.querySelectorAll('.production,.card,.shot,.room-card,.look,.reel')];
  tilt.forEach(el=>{
    el.classList.add('lux-tilt','lux-depth');
    if(reduce||!fine)return;
    let raf=0,lastX=0,lastY=0;
    el.addEventListener('pointermove',e=>{
      lastX=e.clientX;lastY=e.clientY;
      if(raf)return;
      raf=requestAnimationFrame(()=>{
        const r=el.getBoundingClientRect(),x=(lastX-r.left)/r.width-.5,y=(lastY-r.top)/r.height-.5;
        el.style.transform=`perspective(950px) rotateX(${(-y*3.6).toFixed(2)}deg) rotateY(${(x*4.6).toFixed(2)}deg) translateY(-3px)`;
        raf=0;
      });
    },{passive:true});
    el.addEventListener('pointerleave',()=>{
      if(raf){cancelAnimationFrame(raf);raf=0;}
      el.style.transform='';
    });
  });

  document.querySelectorAll('.btn,.navcta,.tab,.back').forEach(btn=>{
    btn.classList.add('lux-magnetic');
    if(reduce||!fine)return;
    let raf=0,lastX=0,lastY=0;
    btn.addEventListener('pointermove',e=>{
      lastX=e.clientX;lastY=e.clientY;
      if(raf)return;
      raf=requestAnimationFrame(()=>{
        const r=btn.getBoundingClientRect(),x=(lastX-r.left-r.width/2)*.1,y=(lastY-r.top-r.height/2)*.1;
        btn.style.transform=`translate(${x}px,${y}px)`;
        raf=0;
      });
    },{passive:true});
    btn.addEventListener('pointerleave',()=>{
      if(raf){cancelAnimationFrame(raf);raf=0;}
      btn.style.transform='';
    });
  });

  if(!reduce&&fine){
    const glow=document.createElement('div');
    glow.className='lux-cursor-glow';
    glow.setAttribute('aria-hidden','true');
    document.body.appendChild(glow);
    let glowRaf=0,lastX=0,lastY=0;
    window.addEventListener('pointermove',e=>{
      lastX=e.clientX;lastY=e.clientY;
      if(glowRaf)return;
      glowRaf=requestAnimationFrame(()=>{
        glow.style.left=lastX+'px';glow.style.top=lastY+'px';glow.classList.add('on');glowRaf=0;
      });
    },{passive:true});
    document.documentElement.addEventListener('mouseleave',()=>glow.classList.remove('on'));
    document.addEventListener('visibilitychange',()=>{if(document.hidden)glow.classList.remove('on');});
  }

  const nav=document.querySelector('.nav,.top'),heroBg=document.querySelector('.hero-bg');
  let scrollRaf=0;
  function onScroll(){
    if(scrollRaf)return;
    scrollRaf=requestAnimationFrame(()=>{
      if(nav)nav.classList.toggle('lux-scrolled',scrollY>18);
      if(!reduce&&heroBg instanceof HTMLElement&&innerWidth>700){
        const y=Math.min(scrollY*.045,20);
        heroBg.style.transform=`translateY(${y}px) scale(1.03)`;
      }
      scrollRaf=0;
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',()=>{
    if(innerWidth<=700&&heroBg instanceof HTMLElement)heroBg.style.transform='';
    if(menuButton&&menuPanel){
      if(innerWidth>980&&(menuPanel.classList.contains('open')||menuPanel.classList.contains('active'))){
        menuPanel.classList.remove('open','active');
        menuPanel.removeAttribute('data-open');
        menuButton.setAttribute('aria-expanded','false');
        menuButton.setAttribute('aria-label','Open navigation');
        menuOpen=false;
        unlockBody();
      }
      if(isMobileNav()&&!menuOpen){
        menuPanel.setAttribute('aria-hidden','true');
        menuPanel.inert=true;
      }else{
        menuPanel.removeAttribute('aria-hidden');
        menuPanel.inert=false;
      }
    }
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&menuButton&&menuPanel&&menuButton.getAttribute('aria-expanded')==='true'){
      if(syntheticMenu)menuPanel.classList.remove('open');
      else menuButton.click();
      requestAnimationFrame(()=>{
        menuButton.setAttribute('aria-expanded','false');
        menuButton.setAttribute('aria-label','Open navigation');
        menuButton.focus({preventScroll:true});
      });
    }
  });
  onScroll();
})();