(()=>{
  const escW=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const moneyW=n=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(Number(n)||0);
  const wait=fn=>{let n=0;const t=setInterval(()=>{try{if(window.business&&window.data&&window.db){clearInterval(t);fn()}}catch(e){}if(++n>100)clearInterval(t)},100)};
  async function ensureClient(r){
    const phone=(r.phone||'').trim(),email=(r.email||'').trim().toLowerCase();
    let c=(data.clients||[]).find(x=>(phone&&x.phone===phone)||(email&&String(x.email||'').toLowerCase()===email));
    if(c)return c;
    const ins=await db.from('clients').insert({business_id:business.id,name:r.name.trim(),phone:phone||null,email:email||null,address:(r.address||'').trim()||null,notes:'Creado desde solicitud web.'}).select().single();
    if(ins.error)throw ins.error;
    data.clients.push(ins.data); return ins.data;
  }
  async function convertClient(id){
    const r=data.requests.find(x=>x.id===id); if(!r)return;
    try{const c=await ensureClient(r); await db.from('service_requests').update({status:r.status==='new'?'contacted':r.status}).eq('id',r.id); alert('Cliente creado/encontrado: '+c.name); await reloadW();}
    catch(e){alert(e.message||'No se pudo crear el cliente.')} 
  }
  async function createJob(id){
    const r=data.requests.find(x=>x.id===id); if(!r)return;
    try{
      const c=await ensureClient(r);
      const starts=r.preferred_date?new Date(r.preferred_date+'T09:00:00').toISOString():null;
      const ins=await db.from('jobs').insert({business_id:business.id,client_id:c.id,title:r.request_type==='quote'?'Trabajo presupuestado':'Solicitud web',description:r.description,status:starts?'scheduled':'requested',starts_at:starts,address:r.address||null,notes:'Origen: solicitud web.'}).select().single();
      if(ins.error)throw ins.error;
      await db.from('service_requests').update({status:starts?'scheduled':'contacted'}).eq('id',r.id); alert('Servicio creado en tu agenda.'); await reloadW();
    }catch(e){alert(e.message||'No se pudo crear el servicio.')} 
  }
  async function prepareQuote(id){
    const r=data.requests.find(x=>x.id===id); if(!r)return;
    try{
      const c=await ensureClient(r);
      if(window.renderQuotes) window.renderQuotes();
      const m=document.getElementById('quoteModal');
      if(!m){alert('Abre Presupuestos para crear el presupuesto.');return;}
      const sel=document.getElementById('qClient'); if(sel){sel.value=c.id;}
      const concept=document.getElementById('qConcept'); if(concept)concept.value=r.description||'Trabajo eléctrico';
      const notes=document.getElementById('qNotes'); if(notes)notes.value='Solicitud web · '+(r.phone||'')+(r.address?' · '+r.address:'');
      m.classList.add('show');
      await db.from('service_requests').update({status:'contacted'}).eq('id',r.id);
    }catch(e){alert(e.message||'No se pudo preparar el presupuesto.')} 
  }
  async function reloadW(){
    const q=async t=>{const r=await db.from(t).select('*').eq('business_id',business.id);return r.data||[]};
    data.clients=await q('clients');data.jobs=await q('jobs');data.requests=await q('service_requests');
    if(window.render)window.render();
  }
  function renderRequestsW(){
    const box=document.getElementById('requestList');if(!box||!window.data)return;
    const rows=(data.requests||[]).slice().sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at)));
    box.innerHTML=rows.map(x=>`<div class="item" data-request-id="${x.id}"><div class="item-row"><div><b>${escW(x.name)}</b><br><small>${escW(x.phone||'')} · ${escW(x.address||'')}</small></div><span class="badge">${escW(x.status)}</span></div><p>${escW(x.description)}</p><small>${x.request_type==='quote'?'💬 Solicitud de presupuesto':'🔧 Solicitud de trabajo'} · Fecha preferida: ${escW(x.preferred_date||'No indicada')}</small><div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:6px"><button class="secondary inline" data-w-action="client">👤 Cliente</button><button class="secondary inline" data-w-action="job">📅 Crear servicio</button>${x.request_type==='quote'?'<button class="secondary inline" data-w-action="quote">💬 Presupuesto</button>':''}</div></div>`).join('')||'<div class="empty">No hay solicitudes nuevas.</div>';
    box.querySelectorAll('[data-w-action]').forEach(b=>b.onclick=()=>{const id=b.closest('[data-request-id]').dataset.requestId;const a=b.dataset.wAction;if(a==='client')convertClient(id);if(a==='job')createJob(id);if(a==='quote')prepareQuote(id)});
  }
  function renderQuotesW(){
    const box=document.getElementById('quoteList');if(!box)return;
    box.querySelectorAll('[data-quote-job]').forEach(b=>b.onclick=async()=>{
      const q=dataQuoteById(b.dataset.quoteJob); if(!q)return;
      try{
        const c=(data.clients||[]).find(x=>x.id===q.client_id); if(!c)throw new Error('El cliente del presupuesto no existe.');
        const ins=await db.from('jobs').insert({business_id:business.id,client_id:c.id,title:'Trabajo · '+q.number,description:q.notes||'Trabajo presupuestado',status:'requested',notes:'Creado desde presupuesto aceptado.'}).select().single();
        if(ins.error)throw ins.error;
        alert('Servicio creado. Ya puedes programarlo desde Servicios.');
        await reloadW();
      }catch(e){alert(e.message||'No se pudo crear el servicio.')} 
    });
  }
  function dataQuoteById(id){return (window.__efeQuotes||[]).find(q=>q.id===id)}
  function patchQuotes(){
    if(!window.renderQuotes||window.renderQuotes.__w)return;
    const orig=window.renderQuotes;
    const wrapped=async function(){await orig();const r=await db.from('quotes').select('*').eq('business_id',business.id).order('created_at',{ascending:false});window.__efeQuotes=r.data||[];const box=document.getElementById('quoteList');if(!box)return;box.querySelectorAll('.item').forEach((el,i)=>{const q=window.__efeQuotes[i];if(q&&q.status==='accepted'){const btn=document.createElement('button');btn.className='secondary inline';btn.dataset.quoteJob=q.id;btn.textContent='📅 Crear servicio';el.appendChild(btn)}});renderQuotesW()};wrapped.__w=true;window.renderQuotes=wrapped;
  }
  function init(){
    if(!window.data||!window.business)return;
    window.renderRequests=renderRequestsW;
    renderRequestsW();patchQuotes();
  }
  wait(init); window.addEventListener('load',()=>setTimeout(init,500));
})();