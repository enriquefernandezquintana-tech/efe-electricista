(() => {
  const btn = document.getElementById('signupBtn');
  if (!btn) return;
  btn.onclick = async () => {
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const out = document.getElementById('authMsg');
    if (!email || !password) { out.textContent = 'Introduce email y contraseña.'; return; }
    if (password.length < 6) { out.textContent = 'La contraseña debe tener al menos 6 caracteres.'; return; }
    out.textContent = 'Creando cuenta…';
    try {
      const res = await fetch('https://whnqdzftjjowugmknzcd.supabase.co/auth/v1/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': 'sb_publishable_AL0ZIUPNHRw2HEyVn9uhdQ_9C1eQLeN' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (!res.ok) {
        out.textContent = json.msg || json.message || json.error_description || 'No se pudo crear la cuenta.';
        return;
      }
      out.textContent = json.access_token ? 'Cuenta creada. Entrando…' : 'Cuenta creada. Revisa tu email para confirmar la cuenta.';
      if (json.access_token) setTimeout(() => location.reload(), 300);
    } catch (e) {
      out.textContent = 'Error de conexión. Inténtalo de nuevo.';
    }
  };
})();
