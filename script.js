const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();
const menu=document.querySelector(".menu"),links=document.querySelector(".links");
menu?.addEventListener("click",()=>{const open=links?.classList.toggle("mobile-open");menu.setAttribute("aria-expanded",String(!!open));});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",()=>{if(window.innerWidth<=850){links?.classList.remove("mobile-open");menu?.setAttribute("aria-expanded","false");}}));
window.addEventListener("resize",()=>{if(window.innerWidth>850){links?.classList.remove("mobile-open");menu?.setAttribute("aria-expanded","false");}});
(function(){if(location.pathname.endsWith('/app/solicitar.html'))return;const a=document.createElement('a');a.href='/app/solicitar.html';a.textContent='⚡ Solicitar trabajo / presupuesto';a.setAttribute('aria-label','Solicitar trabajo o presupuesto');a.style.cssText='position:fixed;right:16px;bottom:16px;z-index:9999;background:#111827;color:#fff;padding:13px 16px;border-radius:999px;text-decoration:none;font-weight:800;box-shadow:0 8px 25px #11182733;font-size:14px';document.body.appendChild(a)})();
