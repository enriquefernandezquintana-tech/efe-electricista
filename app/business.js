(()=>{
 const wait=fn=>{let n=0;const t=setInterval(()=>{try{if(window.business&&window.db){clearInterval(t);fn()}}catch(e){}if(++n>100)clearInterval(t)},100)};
 async function saveBusiness(){
  const row={name:document.getElementById('businessName').value.trim()||'Enrique Fernández Electricista',nif:document.getElementById('businessNif').value.trim()||null,address:document.getElementById('businessAddress').value.trim()||null,phone:document.getElementById('businessPhone').value.trim()||null,email:document.getElementById('businessEmail').value.trim()||null};
  const r=await db.from('businesses').update(row).eq('id',business.id).select().single();
  if(r.error)return alert(r.error.message); window.business=r.data; business=r.data; alert('Datos del negocio guardados.');
 }
 function init(){const b=document.getElementById('saveBusiness');if(b)b.onclick=saveBusiness; if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});}
 wait(init);window.addEventListener('load',init);
})();