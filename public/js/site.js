var header=document.querySelector('header.site');
  addEventListener('scroll',function(){header.classList.toggle('scrolled',scrollY>10)});
  var menu=document.getElementById('menu'), burger=document.getElementById('burger');
  burger.addEventListener('click',function(){menu.classList.toggle('open')});

  

  // mobile dropdown toggle on family parent
  document.querySelectorAll('.menu>li.has>a').forEach(function(a){
    a.addEventListener('click',function(e){
      if(window.innerWidth<=860){
        var li=a.parentElement;
        if(!li.classList.contains('mopen')){ e.stopImmediatePropagation(); e.preventDefault(); li.classList.add('mopen'); }
      }
    },true);
  });

  
  var heroSlides=document.querySelectorAll('.hero-slide');
  var heroOverlay=document.querySelector('.hero-overlay');
  if(heroSlides.length>1){
    var hsi=0;
    setInterval(function(){
      heroSlides[hsi].classList.remove('active');
      hsi=(hsi+1)%heroSlides.length;
      heroSlides[hsi].classList.add('active');
      if(heroOverlay) heroOverlay.classList.toggle('light', hsi!==0);
    },5000);
  }

  // ---- i18n engine ----
  var TX=[], HX=[], PH=[];
  function snapshot(){
    HX=[].slice.call(document.querySelectorAll('[data-i18n-html]'));
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),n;
    while(n=w.nextNode()){
      var v=n.nodeValue, t=v.replace(/^\s+|\s+$/g,''); if(!t) continue;
      var p=n.parentElement; if(!p) continue;
      var tag=p.tagName; if(tag==='SCRIPT'||tag==='STYLE') continue;
      if(p.closest('[data-i18n-html]')) continue;
      TX.push({node:n,pre:(v.match(/^\s*/)||[''])[0],post:(v.match(/\s*$/)||[''])[0],orig:t});
    }
    PH=[].slice.call(document.querySelectorAll('[placeholder]')).map(function(el){return {el:el,orig:el.getAttribute('placeholder')};});
  }
  function tr(l,s){ return (l!=='en'&&DICT[l]&&DICT[l][s]!=null)?DICT[l][s]:s; }
  function setLang(l){
    for(var i=0;i<TX.length;i++){ TX[i].node.nodeValue=TX[i].pre+tr(l,TX[i].orig)+TX[i].post; }
    for(var j=0;j<PH.length;j++){ PH[j].el.setAttribute('placeholder',tr(l,PH[j].orig)); }
    for(var k=0;k<HX.length;k++){ var key=HX[k].getAttribute('data-i18n-html'), e=HTMLT[key]; if(e) HX[k].innerHTML=e[l]||e.en; }
    document.documentElement.lang=l;
    var sel=document.querySelectorAll('.langsel a'); for(var m=0;m<sel.length;m++){ sel[m].classList.toggle('on', sel[m].getAttribute('data-lang')===l); }
  }
  window.setLang=setLang;
  snapshot();

  document.querySelectorAll('.langsel a[data-lang]').forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      setLang(a.getAttribute('data-lang'));
    });
  });
