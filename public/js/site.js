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

  // mobile nested groups inside mega menu
  document.querySelectorAll('.dropdown-group.has-sub>.dropdown-group-hd').forEach(function(a){
    a.addEventListener('click',function(e){
      if(window.innerWidth<=860){
        var group=a.parentElement;
        if(!group.classList.contains('gopen')){ e.stopImmediatePropagation(); e.preventDefault(); group.classList.add('gopen'); }
      }
    },true);
  });

  
  var heroSlides=document.querySelectorAll('.hero-slide');
  var heroOverlay=document.querySelector('.hero-overlay');
  var heroProductSlides=document.querySelectorAll('.hero-product-slide');
  if(heroSlides.length>1){
    var hsi=0;
    setInterval(function(){
      heroSlides[hsi].classList.remove('active');
      if(heroProductSlides.length){
        heroProductSlides[hsi % heroProductSlides.length].classList.remove('active');
      }
      hsi=(hsi+1)%heroSlides.length;
      heroSlides[hsi].classList.add('active');
      if(heroProductSlides.length){
        heroProductSlides[hsi % heroProductSlides.length].classList.add('active');
      }
      if(heroOverlay) heroOverlay.classList.toggle('light', hsi!==0);
    },5000);
  }

  document.querySelectorAll('[data-feature-reveal]').forEach(function(root){
    var items=root.querySelectorAll('.rapido-intro-features li');
    if(!items.length) return;
    var startAttr=root.getAttribute('data-feature-reveal');
    var startMs=startAttr==null||startAttr===''?0:Number(startAttr);
    if(isNaN(startMs)) startMs=0;
    var stepAttr=root.getAttribute('data-feature-step');
    var stepMs=stepAttr==null||stepAttr===''?500:Number(stepAttr);
    if(isNaN(stepMs)) stepMs=500;
    function run(){
      items.forEach(function(li,idx){
        if(li.classList.contains('reveal')) return;
        setTimeout(function(){li.classList.add('reveal');},idx*stepMs);
      });
    }
    if(startMs<=0) run();
    else setTimeout(run,startMs);
  });

  document.querySelectorAll('.pd-carousel').forEach(function(root){
    var slides=root.querySelectorAll('.pd-carousel-slide');
    if(slides.length<2) return;
    var ms=Number(root.getAttribute('data-interval'))||5200;
    var idx=0;
    setInterval(function(){
      slides[idx].classList.remove('active');
      idx=(idx+1)%slides.length;
      slides[idx].classList.add('active');
    },ms);
  });

  (function(){
    var root=document.getElementById('config-diagram');
    if(!root) return;
    var svg=root.querySelector('.config-diagram__svg');
    var paths=root.querySelector('.config-diagram__paths');
    function imgBox(el,box){
      var t=el.querySelector('img')||el;
      var r=t.getBoundingClientRect();
      return {
        left:r.left-box.left,
        right:r.right-box.left,
        top:r.top-box.top,
        bottom:r.bottom-box.top,
        midY:r.top+r.height/2-box.top,
      };
    }
    function snap(n){return Math.round(n*2)/2;}
    function addDot(x,y){
      var dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
      dot.setAttribute('cx',String(snap(x)));
      dot.setAttribute('cy',String(snap(y)));
      dot.setAttribute('r','3.5');
      paths.appendChild(dot);
    }
    function horiz(x1,x2,y){
      var ys=snap(y);
      var xa=snap(x1),xb=snap(x2);
      if(Math.abs(xb-xa)<0.5) return;
      addPath('M'+xa+' '+ys+' H'+xb);
      addDot(xa,ys);
      addDot(xb,ys);
    }
    function vert(x,y1,y2){
      var xs=snap(x);
      var ya=snap(y1),yb=snap(y2);
      if(Math.abs(yb-ya)<0.5) return;
      addPath('M'+xs+' '+ya+' V'+yb);
      addDot(xs,ya);
      addDot(xs,yb);
    }
    function addPath(d){
      var p=document.createElementNS('http://www.w3.org/2000/svg','path');
      p.setAttribute('d',d);
      paths.appendChild(p);
    }
    function draw(){
      if(!svg||!paths) return;
      var box=root.getBoundingClientRect();
      var w=root.offsetWidth,h=root.offsetHeight;
      svg.setAttribute('viewBox','0 0 '+w+' '+h);
      svg.setAttribute('width',String(w));
      svg.setAttribute('height',String(h));
      paths.innerHTML='';
      var control=root.querySelector('[data-config-node="control"]');
      if(!control) return;
      var reels=[].slice.call(root.querySelectorAll('[data-config-node^="reel-"]'));
      var heads=[].slice.call(root.querySelectorAll('[data-config-node^="head-"]'));
      if(!reels.length) return;
      var c=imgBox(control,box);
      var cX=snap(c.right+7);
      var reelsData=reels.map(function(reel){
        var b=imgBox(reel,box);
        return {left:snap(b.left),right:snap(b.right),y:snap(b.midY)};
      });
      var trunk1=snap(cX+Math.max(26,(reelsData[0].left-cX)*0.34));
      var reelYs=reelsData.map(function(d){return d.y;});
      var bus1Min=Math.min.apply(null,reelYs);
      var bus1Max=Math.max.apply(null,reelYs);
      var ctrlBranchY=reelsData.length>=2?reelsData[1].y:reelsData[0].y;
      horiz(cX,trunk1,ctrlBranchY);
      if(bus1Max-bus1Min>0.5) vert(trunk1,bus1Min,bus1Max);
      reelsData.forEach(function(d){horiz(trunk1,d.left,d.y);});
      if(!heads.length) return;
      var headsData=heads.map(function(head){
        var b=imgBox(head,box);
        return {left:snap(b.left),y:snap(b.midY)};
      });
      var trunk2=snap(reelsData[0].right+Math.max(24,(headsData[0].left-reelsData[0].right)*0.38));
      var headYs=headsData.map(function(d){return d.y;});
      var bus2Min=Math.min(Math.min.apply(null,reelYs),Math.min.apply(null,headYs));
      var bus2Max=Math.max(Math.max.apply(null,reelYs),Math.max.apply(null,headYs));
      if(bus2Max-bus2Min>0.5) vert(trunk2,bus2Min,bus2Max);
      reelsData.forEach(function(d){horiz(d.right,trunk2,d.y);});
      headsData.forEach(function(d){horiz(trunk2,d.left,d.y);});
    }
    draw();
    var t;
    addEventListener('resize',function(){
      clearTimeout(t);
      t=setTimeout(draw,120);
    });
    if(document.fonts&&document.fonts.ready) document.fonts.ready.then(draw);
    root.querySelectorAll('img').forEach(function(img){
      if(!img.complete) img.addEventListener('load',draw,{once:true});
    });
  })();

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
