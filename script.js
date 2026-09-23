document.getElementById("year").textContent = new Date().getFullYear();
const menu=document.querySelector(".menu"), links=document.querySelector(".links");
menu?.addEventListener("click",()=>{const open=links.classList.toggle("mobile-open");menu.setAttribute("aria-expanded",String(open));});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",()=>{if(window.innerWidth<=850){links.classList.remove("mobile-open");menu?.setAttribute("aria-expanded","false");}}));
window.addEventListener("resize",()=>{if(window.innerWidth>850){links.classList.remove("mobile-open");menu?.setAttribute("aria-expanded","false");}});
