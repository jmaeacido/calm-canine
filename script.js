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

const stage = document.querySelector("[data-tilt]");
if(stage){
  stage.addEventListener("mousemove", e=>{
    const r = stage.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5;
    const y = (e.clientY-r.top)/r.height-.5;
    stage.style.transform = `rotateY(${x*8}deg) rotateX(${-y*8}deg)`;
  });
  stage.addEventListener("mouseleave",()=>stage.style.transform="");
}

const glow = document.querySelector(".cursor-glow");
window.addEventListener("pointermove", e=>{
  glow.style.left=e.clientX+"px";
  glow.style.top=e.clientY+"px";
});
