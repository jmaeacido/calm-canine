const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries)=>{
  entries.forEach((entry, i)=>{
    if(entry.isIntersecting){
      setTimeout(()=>entry.target.classList.add("visible"), i*55);
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
reveals.forEach(el=>observer.observe(el));

const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const mobileLayout = window.matchMedia("(max-width: 1000px)");

const stage = document.querySelector("[data-tilt]");
if(stage && finePointer.matches){
  stage.addEventListener("mousemove", e=>{
    const r = stage.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5;
    const y = (e.clientY-r.top)/r.height-.5;
    stage.style.transform = `rotateY(${x*8}deg) rotateX(${-y*8}deg)`;
  });
  stage.addEventListener("mouseleave",()=>stage.style.transform="");
}

const glow = document.querySelector(".cursor-glow");
if(glow && finePointer.matches){
  window.addEventListener("pointermove", e=>{
    glow.style.left=e.clientX+"px";
    glow.style.top=e.clientY+"px";
  });
}

const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

const closeNav = ()=>{
  if(!header || !navToggle) return;
  header.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
};

if(navToggle && header){
  navToggle.addEventListener("click", ()=>{
    const open = header.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-open", open);
  });

  siteNav?.querySelectorAll("a").forEach(link=>{
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", e=>{
    if(e.key === "Escape") closeNav();
  });

  document.addEventListener("click", e=>{
    if(!header.classList.contains("nav-open")) return;
    if(!header.contains(e.target)) closeNav();
  });
}

const productStage = document.querySelector(".product-stage");
const productShowcase = document.querySelector(".product-showcase");
const videoOrbit = document.querySelector(".video-orbit");
const clips = productStage ? [...productStage.querySelectorAll(".dog-clip")] : [];
const widgets = productStage ? [...productStage.querySelectorAll(".dog-widget")] : [];

const playClips = ()=>clips.forEach(v=>v.play().catch(()=>{}));
const pauseClips = ()=>clips.forEach(v=>{v.pause();v.currentTime=0});

if(productStage){
  productStage.addEventListener("mouseenter", ()=>{ if(finePointer.matches) playClips(); });
  productStage.addEventListener("focusin", ()=>{ if(finePointer.matches) playClips(); });
  productStage.addEventListener("mouseleave", ()=>{ if(finePointer.matches) pauseClips(); });
  productStage.addEventListener("focusout", ()=>{ if(finePointer.matches) pauseClips(); });
}

if(productShowcase){
  productShowcase.addEventListener("click", ()=>{
    if(mobileLayout.matches) productStage.classList.toggle("journey-active");
  });
}

let carouselObserver;
const syncCarouselVideos = ()=>{
  widgets.forEach(widget=>widget.classList.remove("is-centered"));
  carouselObserver?.disconnect();

  if(!mobileLayout.matches || !videoOrbit){
    pauseClips();
    return;
  }

  productStage?.classList.remove("journey-active");

  carouselObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      const video = entry.target.querySelector(".dog-clip");
      if(!video) return;
      if(entry.isIntersecting && entry.intersectionRatio >= .72){
        entry.target.classList.add("is-centered");
        video.play().catch(()=>{});
      }else{
        entry.target.classList.remove("is-centered");
        video.pause();
        video.currentTime = 0;
      }
    });
  },{root:videoOrbit,threshold:[0,.72,1]});

  widgets.forEach(widget=>carouselObserver.observe(widget));

  const firstClip = widgets[0]?.querySelector(".dog-clip");
  if(firstClip){
    widgets[0].classList.add("is-centered");
    firstClip.play().catch(()=>{});
  }
};

syncCarouselVideos();
mobileLayout.addEventListener("change", ()=>{
  stage && (stage.style.transform = "");
  syncCarouselVideos();
});

videoOrbit?.addEventListener("scroll", ()=>{
  if(!mobileLayout.matches) return;
  window.requestAnimationFrame(()=>{
    let best = null;
    let bestRatio = 0;
    widgets.forEach(widget=>{
      const rect = widget.getBoundingClientRect();
      const orbitRect = videoOrbit.getBoundingClientRect();
      const visible = Math.max(0, Math.min(rect.right, orbitRect.right) - Math.max(rect.left, orbitRect.left));
      const ratio = visible / rect.width;
      if(ratio > bestRatio){
        bestRatio = ratio;
        best = widget;
      }
    });
    widgets.forEach(widget=>{
      const isCenter = widget === best && bestRatio > .7;
      widget.classList.toggle("is-centered", isCenter);
      const video = widget.querySelector(".dog-clip");
      if(!video) return;
      if(isCenter) video.play().catch(()=>{});
      else{
        video.pause();
        video.currentTime = 0;
      }
    });
  });
},{passive:true});

const ecsSection = document.querySelector(".ecs-section");
const ecsVideo = document.querySelector(".ecs-video");

if(ecsSection && ecsVideo){
  const ecsObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        ecsVideo.play().catch(()=>{});
      }else{
        ecsVideo.pause();
        ecsVideo.currentTime = 0;
      }
    });
  },{threshold: 0.35});

  ecsObserver.observe(ecsSection);
}
