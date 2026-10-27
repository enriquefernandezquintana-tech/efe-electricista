const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();
const menu=document.querySelector(".menu"),links=document.querySelector(".links");
menu?.addEventListener("click",()=>{const open=links?.classList.toggle("mobile-open");menu.setAttribute("aria-expanded",String(!!open));});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",()=>{if(window.innerWidth<=850){links?.classList.remove("mobile-open");menu?.setAttribute("aria-expanded","false");}}));
window.addEventListener("resize",()=>{if(window.innerWidth>850){links?.classList.remove("mobile-open");menu?.setAttribute("aria-expanded","false");}});
(function(){if(location.pathname.endsWith('/app/solicitar.html'))return;const a=document.createElement('a');a.href='/app/solicitar.html';a.textContent='⚡ Solicitar trabajo / presupuesto';a.setAttribute('aria-label','Solicitar trabajo o presupuesto');a.style.cssText='position:fixed;right:16px;bottom:16px;z-index:9999;background:#111827;color:#fff;padding:13px 16px;border-radius:999px;text-decoration:none;font-weight:800;box-shadow:0 8px 25px #11182733;font-size:14px';document.body.appendChild(a)})();

/* Google Ads: solo cargar la etiqueta tras consentimiento publicitario */
(function(){
  const ADS_ID = "AW-18351079243";
  const FORM_CONVERSION = "AW-18351079243/67yHCK6esasdEMv-vK5E";
  const CONSENT_KEY = "efe_ads_consent_v1";
  let tagLoaded = false;

  function loadAdsTag(){
    if(tagLoaded || localStorage.getItem(CONSENT_KEY) !== "accepted") return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      wait_for_update: 500
    });
    window.gtag("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "denied"
    });
    window.gtag("js", new Date());
    window.gtag("config", ADS_ID);
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + ADS_ID;
    document.head.appendChild(s);
    tagLoaded = true;
  }

  window.trackGoogleAdsFormConversion = function(){
    if(localStorage.getItem(CONSENT_KEY) !== "accepted" || typeof window.gtag !== "function") return;
    window.gtag("event", "conversion", {send_to: FORM_CONVERSION});
  };

  function showBanner(){
    if(document.getElementById("efe-cookie-banner")) return;
    const banner = document.createElement("section");
    banner.id = "efe-cookie-banner";
    banner.setAttribute("aria-label", "Preferencias de cookies publicitarias");
    banner.style.cssText = "position:fixed;left:16px;right:16px;bottom:16px;z-index:100000;max-width:760px;margin:0 auto;padding:18px;background:#fff;color:#111827;border:1px solid #d1d5db;border-radius:16px;box-shadow:0 10px 35px #0002;font:14px/1.5 system-ui,-apple-system,sans-serif";
    banner.innerHTML = '<strong style="display:block;font-size:16px;margin-bottom:6px">Preferencias de cookies</strong><p style="margin:0 0 12px">Usamos la etiqueta publicitaria de Google únicamente si aceptas. Puedes aceptar o rechazar las cookies publicitarias. <a href="/privacidad.html" style="color:#1d4ed8;text-decoration:underline">Política de privacidad</a>.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" id="efe-cookie-accept" style="border:0;border-radius:9px;padding:10px 14px;background:#111827;color:#fff;font-weight:700;cursor:pointer">Aceptar</button><button type="button" id="efe-cookie-reject" style="border:1px solid #9ca3af;border-radius:9px;padding:10px 14px;background:#fff;color:#111827;font-weight:700;cursor:pointer">Rechazar</button></div>';
    document.body.appendChild(banner);
    document.getElementById("efe-cookie-accept").addEventListener("click",function(){
      localStorage.setItem(CONSENT_KEY,"accepted");
      banner.remove();
      loadAdsTag();
    });
    document.getElementById("efe-cookie-reject").addEventListener("click",function(){
      localStorage.setItem(CONSENT_KEY,"rejected");
      banner.remove();
    });
  }

  function init(){
    const choice = localStorage.getItem(CONSENT_KEY);
    if(choice === "accepted") loadAdsTag();
    else if(!choice) showBanner();

    const prefs = document.createElement("button");
    prefs.type = "button";
    prefs.textContent = "Cookies";
    prefs.setAttribute("aria-label","Cambiar preferencias de cookies");
    prefs.style.cssText = "position:fixed;left:12px;bottom:12px;z-index:9998;border:1px solid #9ca3af;border-radius:999px;padding:7px 11px;background:#fff;color:#111827;font:12px system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 8px #0001";
    prefs.addEventListener("click",function(){
      localStorage.removeItem(CONSENT_KEY);
      showBanner();
    });
    document.body.appendChild(prefs);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",init);
  else init();
})();

