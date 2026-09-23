document.getElementById("year").textContent = new Date().getFullYear();
const menu=document.querySelector(".menu"), links=document.querySelector(".links");
menu?.addEventListener("click",()=>{links.style.display=links.style.display==="flex"?"none":"flex"; if(links.style.display==="flex"){links.style.position="absolute";links.style.top="78px";links.style.left="0";links.style.right="0";links.style.padding="20px";links.style.background="#080808";links.style.flexDirection="column";}});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",()=>{if(window.innerWidth<=850)links.style.display="none";}));
