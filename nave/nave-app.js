/* =========================================================
   CONFIGURACIÓN DE PERSONAJES
   ========================================================= */
// La clave técnica ("nave") puede no coincidir con el nombre que se
// muestra en pantalla ("Pálamo Yerrante") — así el resto del código
// (rutas de Firebase, vinculación de usuarios) no depende de decisiones
// de presentación.
const PERSONAJES = [
  { id: 'Hadria',  label: 'Hadria Von Drevan' },
  { id: 'Radjem',  label: 'Radjem' },
  { id: 'Antares', label: 'Antares Kharthian ("Orfeo")' },
  { id: 'Kael',    label: 'Kael "53" Vostok' },
  { id: 'Nikola',  label: 'Nikola / Thomas Marrow' },
  { id: 'Wulfram', label: 'Wulfram Eisgrund' },
  { id: 'nave',    label: 'Pálamo Yerrante (intendente de la nave)' },
];

// Mismas categorías que el catálogo de la tienda (build_data.py), para que
// el inventario se navegue igual — sin depender de cargar el data.json
// completo, que solo hace falta en la propia tienda.
const CATEGORIAS = [
  { id: 'melee',      label: 'Cuerpo a Cuerpo',    skin: 'melee' },
  { id: 'distancia',  label: 'A Distancia',        skin: 'scope' },
  { id: 'municion',   label: 'Munición',           skin: 'ammo' },
  { id: 'armadura',   label: 'Armaduras',          skin: 'armor' },
  { id: 'equipo',     label: 'Equipo General',     skin: 'pocket' },
  { id: 'comercio',   label: 'Bienes de Comercio', skin: 'showcase' },
  { id: 'naves',      label: 'Naves',              skin: 'ship' },
  { id: 'vehiculos',  label: 'Vehículos',          skin: 'cargo' },
  { id: 'cyberware',  label: 'Cyberware',          skin: 'cyber' },
  { id: 'ingenieria', label: 'Rincón de Ingeniería', skin: 'engineering' },
  { id: 'artefacto',  label: 'Artefactos Pretecnológicos', skin: 'cyber' },
];
const CATEGORIA_SIN_ID = 'otros';
const CATEGORIA_SIN_LABEL = 'Otros / Sin categoría';

function personajeLabel(id){
  if (!id) return id;
  if (String(id).toLowerCase() === 'admin') return 'El DJ';
  const p = PERSONAJES.find(p => p.id.toLowerCase() === String(id).toLowerCase());
  return p ? p.label : id;
}

function esc(s){
  if (s === null || s === undefined) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function formatCr(n){
  return Math.round(n).toLocaleString('es-ES');
}
function statsHtml(stats, cls){
  return (stats||[]).map(s => `<div class="${cls}">${esc(s.label)}: ${esc(s.value)}</div>`).join('');
}

function skinClass(skin){
  return {
    melee: 'melee-skin', scope: 'scope-skin', ammo: 'ammo-skin',
    armor: 'armor-skin', cyber: 'cyber-skin', pocket: 'equip-skin',
    ship: 'ship-skin', engineering: 'engineering-skin', cargo: 'cargo-skin',
    list: 'list-skin', comms: 'comms-skin', circuit: 'circuit-skin',
    pharma: 'pharma-skin', medical: 'medical-skin', electric: 'electric-skin',
    communist: 'communist-skin', showcase: 'showcase-skin',
  }[skin] || 'ammo-skin';
}
function skinInnerClass(skin){
  return {
    melee: 'melee-inner', scope: 'scope-inner', ammo: 'ammo-inner',
    armor: 'armor-inner', cyber: 'cyber-inner', pocket: 'equip-inner',
    ship: 'ship-inner', engineering: 'eng-inner', cargo: 'cargo-inner',
    list: 'list-inner', comms: 'comms-inner', circuit: 'circuit-inner',
    pharma: 'pharma-inner', medical: 'medical-inner', electric: 'electric-inner',
    communist: 'communist-inner', showcase: 'showcase-inner',
  }[skin] || 'ammo-inner';
}

/* =========================================================
   ÍNDICE DEL CATÁLOGO (para no duplicar datos en Firebase)
   ========================================================= */
// El inventario solo guarda {name, qty, catId}. Para poder pintarlo con las
// mismas tarjetas visuales que la tienda, cargamos data.json UNA vez y
// montamos un índice "catId|nombre" -> ítem completo (stats, tl, efecto...).
let catalogIndex = {};
let catalogReady = false;
let SUBCATS_BY_CAT = {}; // { melee: [{id,label}, ...], ... }

function catalogKey(catId, name){ return catId + '|' + name; }

function loadCatalogIndex(){
  fetch('../tienda/data.json')
    .then(res => res.json())
    .then(data => {
      (data.categorias || []).forEach(cat => {
        SUBCATS_BY_CAT[cat.id] = (cat.subcategorias || []).map(sub => ({ id: sub.id, label: sub.label }));
        (cat.subcategorias || []).forEach(sub => {
          const skin = sub.subskin || cat.skin;
          (sub.items || []).forEach(it => {
            catalogIndex[catalogKey(cat.id, it.name)] = { item: it, skin, subcatId: sub.id };
          });
        });
      });
      catalogReady = true;
      renderInventarioTab();
    })
    .catch(err => console.error('No se pudo cargar el catálogo para el inventario:', err));
}

function subcatKeyForItem(it){
  if (it.subcatId) return it.subcatId;
  const found = catalogIndex[catalogKey(it.catId, it.name)];
  return (found && found.subcatId) ? found.subcatId : 'sin-subcategoria';
}

/* Tarjeta de ítem en el inventario: mismo lenguaje visual que la tienda,
   pero sin precio — con un badge de cantidad (y de petición, si aplica). */
function buildInventoryCard(skin, it, qty, peticionHtml){
  const qtyBadge = `<div class="inv-qty-badge">×${esc(qty)}</div>`;
  const descHtml = it.effect ? `<div class="inv-effect">${esc(it.effect)}</div>` : '';

  switch(skin){
    case 'melee':
      return `<div class="rack-item">${qtyBadge}<div class="body"><div class="name">${esc(it.name)}</div>${statsHtml(it.stats,'stat')}${it.tl?`<div class="stat">${esc(it.tl)}</div>`:''}${descHtml}${peticionHtml}</div></div>`;
    case 'scope':
      return `<div class="scope-card">${qtyBadge}<div class="head"><span class="name">${esc(it.name)}</span><span class="tl">${esc(it.tl||'')}</span></div><div class="body">${statsHtml(it.stats,'stat-row')}${descHtml}${peticionHtml}</div></div>`;
    case 'ammo':
      return `<div class="dogtag">${qtyBadge}<h4>${esc(it.name)}</h4>${(it.stats||[]).map(s=>`<div class="row"><span>${esc(s.label).toUpperCase()}</span><span>${esc(s.value)}</span></div>`).join('')}${peticionHtml}</div>`;
    case 'armor':
      return `<div class="plate-card">${qtyBadge}<div class="rivets"><span class="rivet"></span><span class="rivet"></span></div><div class="body"><div class="name">${esc(it.name)}</div>${statsHtml(it.stats,'stat')}${it.ac?`<span class="ac-badge">CA ${esc(it.ac)}</span>`:''}${descHtml}${peticionHtml}</div></div>`;
    case 'cyber':
      return `<div class="cyber-card">${qtyBadge}<h4>${esc(it.name)}</h4>${statsHtml(it.stats,'stat')}${it.tl?`<div class="stat">${esc(it.tl)}</div>`:''}${descHtml}${peticionHtml}</div>`;
    case 'ship':
      return `<div class="dock-slot" style="grid-template-columns:1fr;">${qtyBadge}<div class="info"><h4>${esc(it.name)}</h4><div class="stats">${(it.stats||[]).map(s=>esc(s.label)+': '+esc(s.value)).join(' · ')}</div>${descHtml}${peticionHtml}</div></div>`;
    case 'cargo':
      return `<div class="crate" style="grid-template-columns:1fr;">${qtyBadge}<div class="info"><h4>${esc(it.name)}</h4><div class="stats">${(it.stats||[]).map(s=>esc(s.label)+': '+esc(s.value)).join(' · ')}${it.tl?' · '+esc(it.tl):''}</div>${peticionHtml}</div></div>`;
    case 'pocket':
      return `<div class="pocket-item">${qtyBadge}<div class="name">${esc(it.name)}</div>${statsHtml(it.stats,'stat')}${it.tl?`<div class="stat">${esc(it.tl)}</div>`:''}${descHtml}${peticionHtml}</div>`;
    case 'showcase':
      return `<div class="showcase-card">${qtyBadge}<div class="shelf-glass"></div><div class="lot-row"><span class="lot-name">${esc(it.name)}</span></div><div class="tipos-row">${(it.tipos||[]).map(t=>`<span class="tipo-chip">${esc(t)}</span>`).join('')}</div>${peticionHtml}</div>`;
    case 'engineering':
      return `<div class="eng-card">${qtyBadge}<div class="diagram">${esc(it.level||'')}</div><div class="body"><div class="name">${esc(it.name)}</div>${it.extra?`<div class="dims"><span>Adicional</span><span>${esc(it.extra)}</span></div>`:''}${descHtml}${peticionHtml}</div></div>`;
    case 'comms': case 'circuit': case 'pharma': case 'electric': case 'communist':
      return `<div class="${skin}-card">${qtyBadge}<div class="name">${esc(it.name)}</div>${statsHtml(it.stats,'stat')}${it.tl?`<div class="stat">${esc(it.tl)}</div>`:''}${descHtml}${peticionHtml}</div>`;
    case 'medical':
      return `<div class="medical-card">${qtyBadge}<div class="body"><div class="name">${esc(it.name)}</div>${statsHtml(it.stats,'stat')}${it.tl?`<div class="stat">${esc(it.tl)}</div>`:''}${descHtml}${peticionHtml}</div></div>`;
    case 'list':
      return `<div class="list-row" style="grid-template-columns:1fr;">${qtyBadge}<div><div class="name">${esc(it.name)}</div>${it.stats&&it.stats.length?`<div class="meta">${it.stats.map(s=>esc(s.label)+': '+esc(s.value)).join(' · ')}</div>`:''}${peticionHtml}</div></div>`;
    default:
      return `<div class="pi-row"><span class="pi-name">${esc(it.name)}</span>${qtyBadge}${peticionHtml}</div>`;
  }
}

let shipCredits = null;
let personajesData = {}; // { kael: {credits, inventario}, ... }
let ledgerData = [];     // [{key, personaje, tipo, cantidad, fecha}, ...]
let comprasData = [];    // [{key, comprador, pagadoCon, name, qty, unitPrice, total, ...}, ...]
let objetosLogData = []; // [{key, tipo, item, catId, qty, ...}, ...]
let currentUser = null;
let currentPersonaje = null;

/* =========================================================
   TOAST
   ========================================================= */
function showToast(msg){
  const toast = document.getElementById('toastBox');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2600);
}

/* =========================================================
   PESTAÑAS
   ========================================================= */
function initTabs(){
  document.querySelectorAll('#tabNav button').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('#tabNav button').forEach(b => b.classList.toggle('on', b === btn));
      document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));
      document.getElementById('tab-' + tab).classList.add('active');
    });
  });
}

/* =========================================================
   SESIÓN / LOGIN (mismo patrón que la tienda)
   ========================================================= */
function openLoginModal(){
  document.getElementById('loginError').textContent = '';
  document.getElementById('loginOverlay').classList.add('open');
}
function closeLoginModal(){
  document.getElementById('loginOverlay').classList.remove('open');
}

function updateSessionUI(){
  const dot = document.getElementById('sessionDot');
  const label = document.getElementById('sessionLabel');
  if (currentUser){
    dot.style.background = '#2de6c0';
    label.textContent = currentPersonaje
      ? `CONECTADO: ${currentPersonaje.toUpperCase()} (salir)`
      : 'CONECTADO (sin vincular) — salir';
  } else {
    dot.style.background = '#c94a2a';
    label.textContent = 'INICIAR SESIÓN';
  }

  const adminBtn = document.getElementById('tabBtnAdmin');
  if (isAdminUser()){
    adminBtn.classList.remove('hidden');
    renderAdminTab();
  } else {
    adminBtn.classList.add('hidden');
    // si estaba en la pestaña admin y pierde el permiso, vuelve a Registro
    if (adminBtn.classList.contains('on')){
      document.querySelector('#tabNav button[data-tab="registro"]').click();
    }
  }

  renderMoveForm();
  renderInventarioTab();
  renderCraftTab();
}

function initAuth(){
  if (!window.fb){
    window.addEventListener('fb-ready', initAuth, { once:true });
    return;
  }
  const { auth, onAuthStateChanged, db, ref, get } = window.fb;

  onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    currentPersonaje = null;
    if (user){
      try {
        const snap = await get(ref(db, 'tienda/usuarios/' + user.uid));
        currentPersonaje = snap.exists() ? snap.val() : null;
      } catch(e){ console.error('Error resolviendo personaje:', e); }
    }
    updateSessionUI();
  });

  document.getElementById('sessionChip').addEventListener('click', () => {
    if (currentUser){
      window.fb.signOut(auth);
    } else {
      openLoginModal();
    }
  });
  document.getElementById('loginCloseBtn').addEventListener('click', closeLoginModal);
  document.getElementById('loginOverlay').addEventListener('click', (ev) => {
    if (ev.target.id === 'loginOverlay') closeLoginModal();
  });

  const doLogin = () => {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errEl = document.getElementById('loginError');
    errEl.textContent = '';
    if (!email || !password){
      errEl.textContent = 'Rellena correo y contraseña.';
      return;
    }
    window.fb.signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        closeLoginModal();
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
      })
      .catch((err) => {
        errEl.textContent = 'Credenciales incorrectas o cuenta no encontrada.';
        console.error(err);
      });
  };
  document.getElementById('loginSubmitBtn').addEventListener('click', doLogin);
  document.getElementById('loginPassword').addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') doLogin();
  });
}

/* =========================================================
   LECTURA EN TIEMPO REAL: shipCredits, personajes, ledger
   ========================================================= */
function initDataListeners(){
  if (!window.fb){
    window.addEventListener('fb-ready', initDataListeners, { once:true });
    return;
  }
  const { db, ref, onValue } = window.fb;

  onValue(ref(db, 'tienda/shipCredits'), (snap) => {
    const val = snap.val();
    shipCredits = (typeof val === 'number') ? val : 0;
    document.getElementById('shipBalance').textContent = formatCr(shipCredits) + ' cr';
    renderAdminCreditsInfo();
    renderAdminItemTargetInfo();
  });

  onValue(ref(db, 'tienda/personajes'), (snap) => {
    personajesData = snap.val() || {};
    renderInventarioTab();
    renderMoveForm();
    renderAdminCreditsInfo();
    renderAdminItemTargetInfo();
  });

  onValue(ref(db, 'tienda/ledger'), (snap) => {
    const val = snap.val() || {};
    ledgerData = Object.keys(val).map(key => ({ key, ...val[key] }))
      .sort((a,b) => (b.ts || 0) - (a.ts || 0));
    renderLedger();
  });

  onValue(ref(db, 'tienda/compras'), (snap) => {
    const val = snap.val() || {};
    comprasData = Object.keys(val).map(key => ({ key, ...val[key] }))
      .sort((a,b) => (b.ts || 0) - (a.ts || 0));
    renderCompras();
  });

  onValue(ref(db, 'tienda/objetosLog'), (snap) => {
    const val = snap.val() || {};
    objetosLogData = Object.keys(val).map(key => ({ key, ...val[key] }))
      .sort((a,b) => (b.ts || 0) - (a.ts || 0));
    renderObjetosLog();
  });
}

function renderObjetosLog(){
  const list = document.getElementById('objetosList');
  const empty = document.getElementById('objetosEmpty');
  const countEl = document.getElementById('objetosCount');
  const searchTerm = (document.getElementById('objetosSearch').value || '').trim().toLowerCase();
  const tipoFilter = document.getElementById('objetosFilterTipo').value;

  const filtered = objetosLogData.filter(l => {
    if (tipoFilter && l.tipo !== tipoFilter) return false;
    if (searchTerm){
      const haystack = `${l.item} ${personajeLabel(l.personaje)}`.toLowerCase();
      if (!haystack.includes(searchTerm)) return false;
    }
    return true;
  });

  countEl.textContent = filtered.length + (filtered.length === 1 ? ' REGISTRO' : ' REGISTROS') +
    (filtered.length !== objetosLogData.length ? ` (de ${objetosLogData.length})` : '');

  if (!filtered.length){
    list.innerHTML = '';
    empty.style.display = 'block';
    empty.textContent = objetosLogData.length ? 'Sin resultados para ese filtro.' : 'Todavía no se ha registrado ningún movimiento de objetos.';
    return;
  }
  empty.style.display = 'none';

  list.innerHTML = filtered.map(l => {
    const who = personajeLabel(l.personaje);
    let desc, cls;
    if (l.tipo === 'transferencia'){
      const deLabel = l.de === 'nave' ? 'la nave' : personajeLabel(l.de);
      const aLabel = l.a === 'nave' ? 'la nave' : personajeLabel(l.a);
      desc = `movió de ${deLabel} a ${aLabel}`; cls = 'transferencia';
    } else if (l.tipo === 'creacion'){
      const propietarioTxt = l.propietario ? ` → ${l.propietario === 'nave' ? 'la nave' : personajeLabel(l.propietario)}` : '';
      desc = `creó${propietarioTxt}`; cls = 'deposito';
    } else { // consumo
      desc = `consumió (de ${l.propietario === 'nave' ? 'la nave' : personajeLabel(l.propietario)})`; cls = 'retirada';
    }
    return `
      <div class="ledger-row">
        <div>
          <span class="ledger-who">${esc(who)}</span>
          <div class="ledger-meta">${desc} · ${esc(l.qty)}× ${esc(l.item)} · ${esc(l.fecha || '')}</div>
        </div>
        <div class="ledger-amount ${cls}">×${esc(l.qty)}</div>
      </div>
    `;
  }).join('');
}

function renderCompras(){
  const list = document.getElementById('comprasList');
  const empty = document.getElementById('comprasEmpty');
  const countEl = document.getElementById('comprasCount');
  const searchTerm = (document.getElementById('comprasSearch').value || '').trim().toLowerCase();
  const pagoFilter = document.getElementById('comprasFilterPago').value;

  const filtered = comprasData.filter(c => {
    if (pagoFilter && (c.pagadoCon || 'nave') !== pagoFilter) return false;
    if (searchTerm){
      const haystack = `${c.name} ${personajeLabel(c.comprador)}`.toLowerCase();
      if (!haystack.includes(searchTerm)) return false;
    }
    return true;
  });

  countEl.textContent = filtered.length + (filtered.length === 1 ? ' REGISTRO' : ' REGISTROS') +
    (filtered.length !== comprasData.length ? ` (de ${comprasData.length})` : '');

  if (!filtered.length){
    list.innerHTML = '';
    empty.style.display = 'block';
    empty.textContent = comprasData.length ? 'Sin resultados para ese filtro.' : 'Todavía no se ha registrado ninguna compra.';
    return;
  }
  empty.style.display = 'none';

  list.innerHTML = filtered.map(c => {
    const who = c.pagadoCon === 'personal'
      ? personajeLabel(c.comprador)
      : `Pálamo Yerrante (a petición de ${personajeLabel(c.comprador)})`;
    const sourceLabel = c.pagadoCon === 'personal' ? 'PERSONAL' : 'NAVE';
    return `
      <div class="ledger-row">
        <div>
          <span class="ledger-who">${esc(who)}</span>
          <span class="compra-source-badge ${esc(c.pagadoCon || 'nave')}">${sourceLabel}</span>
          <div class="ledger-meta">${esc(c.qty)}× ${esc(c.name)} · ${esc(c.origen || '—')} · ${esc(c.fecha || '')}</div>
        </div>
        <div class="ledger-amount deposito">${formatCr(c.total)} cr</div>
      </div>
    `;
  }).join('');
}

/* =========================================================
   PESTAÑA REGISTRO: saldo + mover créditos + histórico
   ========================================================= */
function renderMoveForm(){
  const locked = document.getElementById('moveLocked');
  const controls = document.getElementById('moveControls');

  if (!currentUser || !currentPersonaje){
    locked.classList.remove('hidden');
    controls.classList.add('hidden');
    return;
  }
  locked.classList.add('hidden');
  controls.classList.remove('hidden');

  document.getElementById('movePersonajeLabel').textContent = personajeLabel(currentPersonaje);
  const personal = (personajesData[currentPersonaje] && personajesData[currentPersonaje].credits) || 0;
  document.getElementById('movePersonalCredits').textContent = formatCr(personal);

  const targetSelect = document.getElementById('moveTargetSelect');
  const others = PERSONAJES.filter(p => p.id !== currentPersonaje && p.id !== 'nave');
  targetSelect.innerHTML = others.map(p => `<option value="${p.id}">${esc(p.label)}</option>`).join('');
}

function renderLedger(){
  const list = document.getElementById('ledgerList');
  const empty = document.getElementById('ledgerEmpty');
  const countEl = document.getElementById('ledgerCount');

  countEl.textContent = ledgerData.length + (ledgerData.length === 1 ? ' REGISTRO' : ' REGISTROS');

  if (!ledgerData.length){
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  list.innerHTML = ledgerData.map(l => {
    const who = personajeLabel(l.personaje);
    let accionTxt, sign, cls;
    if (l.tipo === 'deposito'){
      accionTxt = 'metió al bote'; sign = '+'; cls = 'deposito';
    } else if (l.tipo === 'retirada'){
      accionTxt = 'sacó del bote'; sign = '−'; cls = 'retirada';
    } else if (l.tipo === 'ajusteDJ'){
      const destinoTxt = l.hacia === 'nave' ? 'la nave' : personajeLabel(l.hacia);
      accionTxt = `${l.signo > 0 ? 'dio créditos a' : 'quitó créditos a'} ${destinoTxt}`;
      sign = l.signo > 0 ? '+' : '−'; cls = l.signo > 0 ? 'deposito' : 'retirada';
    } else { // transferencia
      accionTxt = `envió a ${esc(personajeLabel(l.hacia))}`; sign = '→'; cls = 'transferencia';
    }
    return `
      <div class="ledger-row">
        <div>
          <span class="ledger-who">${esc(who)}</span>
          <div class="ledger-meta">${accionTxt} · ${esc(l.fecha || '')}</div>
        </div>
        <div class="ledger-amount ${cls}">${sign}${formatCr(l.cantidad)} cr</div>
      </div>
    `;
  }).join('');
}

/* mover créditos: personaje -> bote (deposito) o bote -> personaje (retirada) */
function moveCredits(tipo){
  const errEl = document.getElementById('moveError');
  errEl.textContent = '';

  if (!currentUser || !currentPersonaje){
    errEl.textContent = 'Debes iniciar sesión con un personaje vinculado.';
    return;
  }
  const amountInput = document.getElementById('moveAmount');
  const amount = Math.floor(Number(amountInput.value));
  if (!amount || amount <= 0){
    errEl.textContent = 'Introduce una cantidad válida.';
    return;
  }

  const { db, ref, runTransaction, push, update } = window.fb;
  const personalRef = ref(db, `tienda/personajes/${currentPersonaje}/credits`);
  const shipRef = ref(db, 'tienda/shipCredits');

  const sourceRef = tipo === 'deposito' ? personalRef : shipRef;
  const targetRef = tipo === 'deposito' ? shipRef : personalRef;

  document.getElementById('moveDepositBtn').disabled = true;
  document.getElementById('moveWithdrawBtn').disabled = true;

  runTransaction(sourceRef, (current) => {
    const currentVal = (typeof current === 'number') ? current : 0;
    if (currentVal < amount) return; // fondos insuficientes, aborta
    return currentVal - amount;
  }).then((result) => {
    if (!result.committed){
      errEl.textContent = 'Fondos insuficientes en el origen.';
      return Promise.reject('insufficient');
    }
    return runTransaction(targetRef, (current) => {
      const currentVal = (typeof current === 'number') ? current : 0;
      return currentVal + amount;
    });
  }).then(() => {
    const fecha = new Date().toLocaleString('es-ES', {
      day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'
    });
    const newKey = push(ref(db, 'tienda/ledger')).key;
    return update(ref(db), {
      [`tienda/ledger/${newKey}`]: {
        personaje: currentPersonaje, tipo, cantidad: amount, fecha, ts: Date.now()
      }
    });
  }).then(() => {
    showToast(tipo === 'deposito' ? 'Créditos depositados en el bote común.' : 'Créditos retirados del bote común.');
    amountInput.value = '';
  }).catch((err) => {
    if (err !== 'insufficient'){
      console.error('Error moviendo créditos:', err);
      errEl.textContent = 'Error de conexión — inténtalo de nuevo.';
    }
  }).finally(() => {
    document.getElementById('moveDepositBtn').disabled = false;
    document.getElementById('moveWithdrawBtn').disabled = false;
  });
}

/* transferir créditos personales de currentPersonaje a otro personaje */
function transferCredits(){
  const errEl = document.getElementById('moveTransferError');
  errEl.textContent = '';

  if (!currentUser || !currentPersonaje){
    errEl.textContent = 'Debes iniciar sesión con un personaje vinculado.';
    return;
  }
  const targetId = document.getElementById('moveTargetSelect').value;
  const amountInput = document.getElementById('moveTransferAmount');
  const amount = Math.floor(Number(amountInput.value));
  if (!targetId){
    errEl.textContent = 'Elige un destinatario.';
    return;
  }
  if (!amount || amount <= 0){
    errEl.textContent = 'Introduce una cantidad válida.';
    return;
  }

  const { db, ref, runTransaction, push, update } = window.fb;
  const sourceRef = ref(db, `tienda/personajes/${currentPersonaje}/credits`);
  const targetRef = ref(db, `tienda/personajes/${targetId}/credits`);

  document.getElementById('moveTransferBtn').disabled = true;

  runTransaction(sourceRef, (current) => {
    const currentVal = (typeof current === 'number') ? current : 0;
    if (currentVal < amount) return; // fondos insuficientes, aborta
    return currentVal - amount;
  }).then((result) => {
    if (!result.committed){
      errEl.textContent = 'No tienes suficientes créditos personales.';
      return Promise.reject('insufficient');
    }
    return runTransaction(targetRef, (current) => {
      const currentVal = (typeof current === 'number') ? current : 0;
      return currentVal + amount;
    });
  }).then(() => {
    const fecha = new Date().toLocaleString('es-ES', {
      day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'
    });
    const newKey = push(ref(db, 'tienda/ledger')).key;
    return update(ref(db), {
      [`tienda/ledger/${newKey}`]: {
        personaje: currentPersonaje, tipo: 'transferencia', hacia: targetId,
        cantidad: amount, fecha, ts: Date.now()
      }
    });
  }).then(() => {
    showToast(`Créditos enviados a ${personajeLabel(targetId)}.`);
    amountInput.value = '';
  }).catch((err) => {
    if (err !== 'insufficient'){
      console.error('Error transfiriendo créditos:', err);
      errEl.textContent = 'Error de conexión — inténtalo de nuevo.';
    }
  }).finally(() => {
    document.getElementById('moveTransferBtn').disabled = false;
  });
}

/* =========================================================
   MODAL DE DETALLE (mismo patrón que la tienda, sin precio)
   ========================================================= */
let invItemRegistry = [];
function registerInvItem(skin, item, qty, ctx){
  invItemRegistry.push({ skin, item, qty, ctx }); // ctx = { ownerId, invKey, catId, name }
  return invItemRegistry.length - 1;
}

function initItemModal(){
  const overlay = document.getElementById('itemModalOverlay');
  overlay.addEventListener('click', (ev) => { if (ev.target === overlay) closeItemModal(); });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') closeItemModal(); });
  document.getElementById('itemModalCard').addEventListener('click', (ev) => {
    if (ev.target.closest('.modal-close')) closeItemModal();
  });

  document.body.addEventListener('click', (ev) => {
    const wrap = ev.target.closest('.inv-card-click');
    if (!wrap) return;
    openItemModal(parseInt(wrap.dataset.iidx, 10));
  });
}

function closeItemModal(){
  document.getElementById('itemModalOverlay').classList.remove('open');
}

function openItemModal(idx){
  const entry = invItemRegistry[idx];
  if (!entry) return;
  const { skin, item, qty, ctx } = entry;
  const container = document.getElementById('itemModalCard');
  const cardHtml = skin
    ? buildInventoryModalCard(skin, item, qty)
    : `<div class="skin ammo-skin" style="margin:0;"><div class="ammo-inner"><div class="dogtag"><h4>${esc(item.name)}</h4></div></div></div>`;
  container.innerHTML = `<button class="modal-close">✕</button>` + cardHtml + buildInvActionsPanel(ctx, qty);
  document.getElementById('itemModalOverlay').classList.add('open');
  attachInvActionListeners(ctx);
}

/* =========================================================
   ACCIONES: sacar de la nave / meter a la nave / consumir
   ========================================================= */
function buildInvActionsPanel(ctx, qty){
  if (!currentUser){
    return `<div class="inv-actions"><div class="move-locked">Inicia sesión para gestionar este objeto.</div></div>`;
  }
  const canTakeFromNave = ctx.ownerId === 'nave' && !!currentPersonaje;
  const canGiveToNave = ctx.ownerId === currentPersonaje;
  const canSendToPlayer = ctx.ownerId === currentPersonaje;

  let buttons = '';
  if (canTakeFromNave){
    buttons += `<button class="cyber-btn" id="invActTake">SACAR A MI INVENTARIO →</button>`;
  }
  if (canGiveToNave){
    buttons += `<button class="cyber-btn" id="invActGive">→ METER A LA NAVE</button>`;
  }
  buttons += `<button class="cyber-btn pink" id="invActConsume">ELIMINAR (CONSUMIDO)</button>`;

  let sendRow = '';
  if (canSendToPlayer){
    const others = PERSONAJES.filter(p => p.id !== currentPersonaje && p.id !== 'nave');
    const options = others.map(p => `<option value="${p.id}">${esc(p.label)}</option>`).join('');
    sendRow = `
      <div class="move-row">
        <select id="invActTargetSelect">${options}</select>
        <button class="cyber-btn" id="invActSend">ENVIAR OBJETO →</button>
      </div>
    `;
  }

  return `
    <div class="inv-actions">
      <div class="move-row">
        <input type="number" id="invActQty" min="1" max="${esc(qty)}" value="1">
        <span class="inv-actions-max">de ${esc(qty)} disponibles</span>
      </div>
      ${sendRow}
      <div class="move-row">${buttons}</div>
      <div id="invActError" class="move-error"></div>
    </div>
  `;
}

function attachInvActionListeners(ctx){
  const qtyInput = document.getElementById('invActQty');
  const errEl = document.getElementById('invActError');
  const getAmount = () => Math.max(1, Math.floor(Number(qtyInput.value)) || 1);

  const takeBtn = document.getElementById('invActTake');
  const giveBtn = document.getElementById('invActGive');
  const consumeBtn = document.getElementById('invActConsume');
  const sendBtn = document.getElementById('invActSend');

  if (takeBtn) takeBtn.addEventListener('click', () => runInvAction(takeBtn, errEl, () => transferItem(ctx, getAmount(), 'nave', currentPersonaje)));
  if (giveBtn) giveBtn.addEventListener('click', () => runInvAction(giveBtn, errEl, () => transferItem(ctx, getAmount(), currentPersonaje, 'nave')));
  if (consumeBtn) consumeBtn.addEventListener('click', () => runInvAction(consumeBtn, errEl, () => consumeItem(ctx, getAmount())));
  if (sendBtn) sendBtn.addEventListener('click', () => {
    const targetId = document.getElementById('invActTargetSelect').value;
    runInvAction(sendBtn, errEl, () => transferItem(ctx, getAmount(), currentPersonaje, targetId));
  });
}

function runInvAction(btn, errEl, fn){
  errEl.textContent = '';
  btn.disabled = true;
  fn().then(() => {
    closeItemModal();
    showToast('Movimiento registrado.');
  }).catch((err) => {
    if (err && err.message) errEl.textContent = err.message;
    else { errEl.textContent = 'Error de conexión — inténtalo de nuevo.'; console.error(err); }
  }).finally(() => {
    btn.disabled = false;
  });
}

function nowFecha(){
  return new Date().toLocaleString('es-ES', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

/* resta `amount` del stack en origen (elimina la entrada si llega a 0), y
   lo fusiona (o crea) en el inventario destino. */
async function transferItem(ctx, amount, fromId, toId){
  const { db, ref, runTransaction, get, push, update } = window.fb;
  const qtyRef = ref(db, `tienda/personajes/${fromId}/inventario/${ctx.invKey}/qty`);

  const result = await runTransaction(qtyRef, (current) => {
    const cur = (typeof current === 'number') ? current : 0;
    if (cur < amount) return; // aborta, no hay suficientes
    return cur - amount;
  });
  if (!result.committed){
    throw new Error('No hay suficientes unidades para mover.');
  }
  if (result.snapshot.val() === 0){
    await update(ref(db), { [`tienda/personajes/${fromId}/inventario/${ctx.invKey}`]: null });
  }

  // fusionar en destino
  const targetInvRef = ref(db, `tienda/personajes/${toId}/inventario`);
  const snap = await get(targetInvRef);
  const data = snap.exists() ? snap.val() : {};
  const existingKey = Object.keys(data).find(k => data[k].catId === ctx.catId && data[k].name === ctx.name);
  const fecha = nowFecha();

  if (existingKey){
    await update(ref(db), {
      [`tienda/personajes/${toId}/inventario/${existingKey}/qty`]: (data[existingKey].qty || 0) + amount,
      [`tienda/personajes/${toId}/inventario/${existingKey}/fecha`]: fecha,
    });
  } else {
    const newKey = push(targetInvRef).key;
    await update(ref(db), {
      [`tienda/personajes/${toId}/inventario/${newKey}`]: { name: ctx.name, qty: amount, catId: ctx.catId, origen: null, fecha }
    });
  }

  const logKey = push(ref(db, 'tienda/objetosLog')).key;
  await update(ref(db), {
    [`tienda/objetosLog/${logKey}`]: {
      tipo: 'transferencia', item: ctx.name, catId: ctx.catId, qty: amount,
      de: fromId, a: toId, personaje: currentPersonaje, fecha, ts: Date.now()
    }
  });
}

async function consumeItem(ctx, amount){
  const { db, ref, runTransaction, update, push } = window.fb;
  const qtyRef = ref(db, `tienda/personajes/${ctx.ownerId}/inventario/${ctx.invKey}/qty`);

  const result = await runTransaction(qtyRef, (current) => {
    const cur = (typeof current === 'number') ? current : 0;
    if (cur < amount) return;
    return cur - amount;
  });
  if (!result.committed){
    throw new Error('No hay suficientes unidades para eliminar.');
  }
  if (result.snapshot.val() === 0){
    await update(ref(db), { [`tienda/personajes/${ctx.ownerId}/inventario/${ctx.invKey}`]: null });
  }

  const fecha = nowFecha();
  const logKey = push(ref(db, 'tienda/objetosLog')).key;
  await update(ref(db), {
    [`tienda/objetosLog/${logKey}`]: {
      tipo: 'consumo', item: ctx.name, catId: ctx.catId, qty: amount,
      propietario: ctx.ownerId, personaje: currentPersonaje, fecha, ts: Date.now()
    }
  });
}

/* Igual que buildInventoryCard pero a tamaño de modal, con descripción
   completa SIEMPRE presente (aunque no exista, muestra el placeholder),
   ya que en las tarjetas pequeñas del grid no siempre cabe. */
function buildInventoryModalCard(skin, it, qty){
  const qtyBadge = `<div class="inv-qty-badge" style="position:static;display:inline-block;margin-top:10px;">×${esc(qty)} en posesión</div>`;
  const descHtml = it.effect
    ? `<div class="modal-desc">${esc(it.effect)}</div>`
    : `<div class="modal-desc placeholder">Sin descripción adicional registrada todavía.</div>`;

  const wrapClass = skinClass(skin);
  const innerClass = skinInnerClass(skin);
  let inner = '';

  switch(skin){
    case 'melee':
      inner = `<div class="rack-item" style="cursor:default;"><div class="name" style="font-size:19px;">${esc(it.name)}</div>${statsHtml(it.stats,'stat')}${it.tl?`<div class="stat">${esc(it.tl)}</div>`:''}${qtyBadge}${descHtml}</div>`;
      break;
    case 'scope':
      inner = `<div class="scope-card" style="cursor:default;"><div class="head"><span class="name">${esc(it.name)}</span><span class="tl">${esc(it.tl||'')}</span></div><div class="body">${statsHtml(it.stats,'stat-row')}${qtyBadge}${descHtml}</div></div>`;
      break;
    case 'ammo':
      inner = `<div class="dogtag" style="cursor:default;"><h4 style="font-size:17px;">${esc(it.name)}</h4>${(it.stats||[]).map(s=>`<div class="row"><span>${esc(s.label).toUpperCase()}</span><span>${esc(s.value)}</span></div>`).join('')}${qtyBadge}<div class="modal-desc" style="color:#333;">${it.effect?esc(it.effect):'Sin descripción adicional registrada todavía.'}</div></div>`;
      break;
    case 'armor':
      inner = `<div class="plate-card" style="cursor:default;"><div class="rivets"><span class="rivet"></span><span class="rivet"></span></div><div class="body"><div class="name" style="font-size:17px;">${esc(it.name)}</div>${statsHtml(it.stats,'stat')}${it.ac?`<span class="ac-badge">CA ${esc(it.ac)}</span>`:''}${qtyBadge}${descHtml}</div></div>`;
      break;
    case 'cyber':
      inner = `<div class="cyber-card" style="cursor:default;"><h4 style="font-size:17px;">${esc(it.name)}</h4>${statsHtml(it.stats,'stat')}${it.tl?`<div class="stat">${esc(it.tl)}</div>`:''}${qtyBadge}${descHtml}</div>`;
      break;
    case 'ship':
      inner = `<div class="dock-slot" style="cursor:default;grid-template-columns:1fr;"><div class="info"><h4 style="font-size:17px;">${esc(it.name)}</h4><div class="stats">${(it.stats||[]).map(s=>esc(s.label)+': '+esc(s.value)).join(' · ')}</div>${qtyBadge}${descHtml}</div></div>`;
      break;
    case 'cargo':
      inner = `<div class="crate" style="cursor:default;grid-template-columns:1fr;"><div class="info"><h4 style="font-size:17px;">${esc(it.name)}</h4><div class="stats">${(it.stats||[]).map(s=>esc(s.label)+': '+esc(s.value)).join(' · ')}${it.tl?' · '+esc(it.tl):''}</div>${qtyBadge}${descHtml}</div></div>`;
      break;
    case 'pocket':
      inner = `<div class="pocket-item" style="cursor:default;"><div class="name" style="font-size:17px;">${esc(it.name)}</div>${statsHtml(it.stats,'stat')}${it.tl?`<div class="stat">${esc(it.tl)}</div>`:''}${qtyBadge}${descHtml}</div>`;
      break;
    case 'showcase':
      inner = `<div class="showcase-card" style="cursor:default;"><div class="shelf-glass"></div><div class="lot-row"><span class="lot-name" style="font-size:17px;">${esc(it.name)}</span></div><div class="tipos-row">${(it.tipos||[]).map(t=>`<span class="tipo-chip">${esc(t)}</span>`).join('')}</div>${qtyBadge}${descHtml}</div>`;
      break;
    case 'engineering':
      inner = `<div class="eng-card" style="cursor:default;"><div class="diagram">${esc(it.level||'')}</div><div class="body"><div class="name" style="font-size:17px;">${esc(it.name)}</div>${it.extra?`<div class="dims"><span>Adicional</span><span>${esc(it.extra)}</span></div>`:''}${qtyBadge}${descHtml}</div></div>`;
      break;
    case 'comms': case 'circuit': case 'pharma': case 'electric': case 'communist':
      inner = `<div class="${skin}-card" style="cursor:default;"><div class="name" style="font-size:17px;">${esc(it.name)}</div>${statsHtml(it.stats,'stat')}${it.tl?`<div class="stat">${esc(it.tl)}</div>`:''}${qtyBadge}${descHtml}</div>`;
      break;
    case 'medical':
      inner = `<div class="medical-card" style="cursor:default;"><div class="body"><div class="name" style="font-size:17px;">${esc(it.name)}</div>${statsHtml(it.stats,'stat')}${it.tl?`<div class="stat">${esc(it.tl)}</div>`:''}${qtyBadge}${descHtml}</div></div>`;
      break;
    case 'list':
      inner = `<div class="list-row" style="cursor:default;grid-template-columns:1fr;background:#20241f;"><div><div class="name" style="font-size:17px;">${esc(it.name)}</div>${it.stats&&it.stats.length?`<div class="meta">${it.stats.map(s=>esc(s.label)+': '+esc(s.value)).join(' · ')}</div>`:''}${qtyBadge}${descHtml}</div></div>`;
      break;
    default:
      inner = `<div>${esc(it.name)}${qtyBadge}</div>`;
  }

  return `<div class="skin ${wrapClass}" style="margin:0;"><div class="${innerClass}">${inner}</div></div>`;
}

/* =========================================================
   PANEL DE DIRECCIÓN (DJ)
   ========================================================= */
function isAdminUser(){
  return (currentPersonaje || '').trim().toLowerCase() === 'admin';
}

const adminItemState = { stats: [] };

function targetOptionsHtml(){
  const naveOpt = `<option value="nave">Nave (Pálamo Yerrante)</option>`;
  const pjOpts = PERSONAJES.filter(p => p.id !== 'nave')
    .map(p => `<option value="${p.id}">${esc(p.label)}</option>`).join('');
  return naveOpt + pjOpts;
}

function renderAdminTab(){
  // --- ajustar créditos ---
  const targetSelect = document.getElementById('adminCreditsTarget');
  targetSelect.innerHTML = targetOptionsHtml();
  targetSelect.addEventListener('change', renderAdminCreditsInfo);
  renderAdminCreditsInfo();

  document.getElementById('adminCreditsAdd').onclick = () => adminAdjustCredits(1);
  document.getElementById('adminCreditsSub').onclick = () => adminAdjustCredits(-1);

  // --- dar / crear objeto ---
  document.getElementById('adminItemForm').innerHTML = buildAdminItemForm();
  wireAdminItemForm();

  // --- artefactos ---
  document.getElementById('adminArtifactForm').innerHTML = buildArtifactForm();
  wireArtifactForm();

  // --- notas privadas ---
  const notesTarget = document.getElementById('adminNotesTarget');
  notesTarget.innerHTML = PERSONAJES.map(p => `<option value="${p.id}">${esc(p.label)}</option>`).join('');
  notesTarget.addEventListener('change', loadAdminNote);
  document.getElementById('adminNotesSave').addEventListener('click', saveAdminNote);
  loadAdminNote();
}

async function loadAdminNote(){
  const id = document.getElementById('adminNotesTarget').value;
  const statusEl = document.getElementById('adminNotesStatus');
  statusEl.textContent = 'Cargando...';
  try {
    const { db, ref, get } = window.fb;
    const snap = await get(ref(db, `tienda/djNotes/${id}`));
    document.getElementById('adminNotesText').value = snap.exists() ? snap.val() : '';
    statusEl.textContent = '';
  } catch(err){
    console.error(err);
    statusEl.textContent = 'Error al cargar la nota.';
  }
}

async function saveAdminNote(){
  const id = document.getElementById('adminNotesTarget').value;
  const text = document.getElementById('adminNotesText').value;
  const statusEl = document.getElementById('adminNotesStatus');
  try {
    const { db, ref, update } = window.fb;
    await update(ref(db), { [`tienda/djNotes/${id}`]: text });
    statusEl.textContent = 'Guardado.';
    setTimeout(() => { statusEl.textContent = ''; }, 1800);
  } catch(err){
    console.error(err);
    statusEl.textContent = 'Error al guardar.';
  }
}

function targetSummary(targetId){
  const data = personajesData[targetId] || {};
  const credits = targetId === 'nave' ? (shipCredits ?? 0) : (data.credits || 0);
  const items = data.inventario ? Object.entries(data.inventario).map(([k, v]) => ({ ...v, _key: k })) : [];
  return { credits, items };
}

function invSummaryHtml(items, targetId){
  if (!items.length) return `<div class="admin-inv-empty">Sin objetos en su inventario.</div>`;
  return `<div class="admin-inv-list">` + items.slice()
    .sort((a,b) => (a.name||'').localeCompare(b.name||''))
    .map(it => `
      <div class="admin-inv-row">
        <span class="admin-inv-name">${esc(it.name)}</span>
        <div class="admin-inv-qty-ctrl">
          <button data-role="qdec" data-target="${targetId}" data-key="${it._key}">−</button>
          <span>${esc(it.qty)}</span>
          <button data-role="qinc" data-target="${targetId}" data-key="${it._key}">+</button>
        </div>
        <button class="admin-inv-remove" data-target="${targetId}" data-key="${it._key}" data-name="${esc(it.name)}" title="Eliminar del inventario">✕</button>
      </div>
    `).join('') + `</div>`;
}

async function adminAdjustItemQty(targetId, key, delta){
  const { db, ref, runTransaction, update } = window.fb;
  const qtyRef = ref(db, `tienda/personajes/${targetId}/inventario/${key}/qty`);
  const result = await runTransaction(qtyRef, (current) => {
    const cur = (typeof current === 'number') ? current : 0;
    const next = cur + delta;
    return next < 0 ? undefined : next;
  });
  if (result.committed && result.snapshot.val() === 0){
    await update(ref(db), { [`tienda/personajes/${targetId}/inventario/${key}`]: null });
  }
}

async function adminRemoveInvItem(targetId, key, name){
  if (!confirm(`¿Eliminar "${name}" del inventario de ${targetId === 'nave' ? 'la nave' : personajeLabel(targetId)}?`)) return;
  const { db, ref, get, update, push } = window.fb;
  const itemRef = ref(db, `tienda/personajes/${targetId}/inventario/${key}`);
  const snap = await get(itemRef);
  const qty = snap.exists() ? (snap.val().qty || 0) : 0;
  await update(ref(db), { [`tienda/personajes/${targetId}/inventario/${key}`]: null });

  const fecha = nowFecha();
  const logKey = push(ref(db, 'tienda/objetosLog')).key;
  await update(ref(db), {
    [`tienda/objetosLog/${logKey}`]: {
      tipo: 'consumo', item: name, catId: null, qty,
      propietario: targetId, personaje: 'admin', fecha, ts: Date.now()
    }
  });
  showToast(`${name} eliminado del inventario de ${targetId === 'nave' ? 'la nave' : personajeLabel(targetId)}.`);
}

function renderAdminCreditsInfo(){
  const el = document.getElementById('adminCreditsInfo');
  if (!el) return;
  const targetId = document.getElementById('adminCreditsTarget').value;
  const { credits, items } = targetSummary(targetId);
  el.innerHTML = `<div class="admin-target-credits">Créditos actuales: <b>${formatCr(credits)}</b> cr</div>${invSummaryHtml(items, targetId)}`;
}

function renderAdminItemTargetInfo(){
  const el = document.getElementById('admin-item-targetInfo');
  if (!el) return;
  const targetId = document.getElementById('admin-item-target').value;
  const { credits, items } = targetSummary(targetId);
  el.innerHTML = `<div class="admin-target-credits">Créditos: <b>${formatCr(credits)}</b> cr</div>${invSummaryHtml(items, targetId)}`;
}

async function adminAdjustCredits(sign){
  const errEl = document.getElementById('adminCreditsError');
  errEl.textContent = '';
  if (!isAdminUser()) return;

  const targetId = document.getElementById('adminCreditsTarget').value;
  const amount = Math.max(1, Math.floor(Number(document.getElementById('adminCreditsAmount').value)) || 0);
  if (!amount){
    errEl.textContent = 'Introduce una cantidad válida.';
    return;
  }

  const { db, ref, runTransaction, push, update } = window.fb;
  const path = targetId === 'nave' ? 'tienda/shipCredits' : `tienda/personajes/${targetId}/credits`;

  try {
    await runTransaction(ref(db, path), (current) => {
      const cur = (typeof current === 'number') ? current : 0;
      return Math.max(0, cur + sign * amount);
    });
    const fecha = nowFecha();
    const logKey = push(ref(db, 'tienda/ledger')).key;
    await update(ref(db), {
      [`tienda/ledger/${logKey}`]: {
        personaje: 'admin', tipo: 'ajusteDJ', hacia: targetId,
        cantidad: amount, signo: sign, fecha, ts: Date.now()
      }
    });
    document.getElementById('adminCreditsAmount').value = '';
    showToast(`Créditos ${sign>0?'sumados a':'restados de'} ${targetId === 'nave' ? 'la nave' : personajeLabel(targetId)}.`);
  } catch(err){
    console.error(err);
    errEl.textContent = 'Error de conexión — inténtalo de nuevo.';
  }
}

function buildAdminItemForm(){
  const catOptions = CATEGORIAS.map(c => `<option value="${c.id}">${esc(c.label)}</option>`).join('');
  return `
    <div class="craft-field">
      <label>Destino</label>
      <select id="admin-item-target">${targetOptionsHtml()}</select>
    </div>
    <div id="admin-item-targetInfo" class="admin-target-info"></div>
    <div class="craft-field">
      <label>Nombre del objeto</label>
      <input type="text" id="admin-item-name" placeholder="Ej. Artefacto pre-Escisión">
    </div>
    <div class="craft-field">
      <label>Categoría</label>
      <select id="admin-item-cat">${catOptions}</select>
    </div>
    <div class="craft-field hidden" id="admin-item-subcatField">
      <label>Subcategoría</label>
      <select id="admin-item-subcat"></select>
    </div>
    <div class="craft-field">
      <label>Descripción / efecto (opcional)</label>
      <textarea id="admin-item-desc"></textarea>
    </div>
    <div class="craft-field">
      <label>Cantidad</label>
      <input type="number" id="admin-item-qty" min="1" value="1">
    </div>
    <div class="craft-field">
      <label>Características (opcional)</label>
      <div id="admin-item-stats" class="craft-materials"></div>
      <button type="button" class="craft-add-material" id="admin-item-addStat">+ AÑADIR CARACTERÍSTICA</button>
    </div>
    <div id="admin-item-error" class="move-error"></div>
    <button class="cyber-btn craft-submit-btn" id="admin-item-submit">DAR OBJETO</button>
  `;
}

function renderAdminStatRows(){
  const box = document.getElementById('admin-item-stats');
  const rows = adminItemState.stats;
  box.innerHTML = rows.map((row, i) => `
    <div class="craft-material-row" data-idx="${i}">
      <input type="text" placeholder="Nombre (ej. Daño)" value="${esc(row.label)}" data-role="stat-label">
      <input type="text" placeholder="Valor" value="${esc(row.value)}" data-role="stat-value">
      <button type="button" data-role="stat-remove">✕</button>
    </div>
  `).join('');
  box.querySelectorAll('.craft-material-row').forEach(rowEl => {
    const idx = parseInt(rowEl.dataset.idx, 10);
    rowEl.querySelector('[data-role="stat-label"]').addEventListener('input', (ev) => { adminItemState.stats[idx].label = ev.target.value; });
    rowEl.querySelector('[data-role="stat-value"]').addEventListener('input', (ev) => { adminItemState.stats[idx].value = ev.target.value; });
    rowEl.querySelector('[data-role="stat-remove"]').addEventListener('click', () => { adminItemState.stats.splice(idx,1); renderAdminStatRows(); });
  });
}

function wireAdminItemForm(){
  const catSelect = document.getElementById('admin-item-cat');
  const targetSelect = document.getElementById('admin-item-target');

  targetSelect.addEventListener('change', renderAdminItemTargetInfo);
  renderAdminItemTargetInfo();

  const applyCat = (catId) => {
    const subs = SUBCATS_BY_CAT[catId] || [];
    const fieldWrap = document.getElementById('admin-item-subcatField');
    const subSelect = document.getElementById('admin-item-subcat');
    if (subs.length > 1){
      subSelect.innerHTML = subs.map(s => `<option value="${s.id}">${esc(s.label)}</option>`).join('');
      fieldWrap.classList.remove('hidden');
    } else {
      subSelect.innerHTML = '';
      fieldWrap.classList.add('hidden');
    }
    adminItemState.stats = (CATEGORIA_STAT_PRESETS[catId] || []).map(label => ({ label, value: '' }));
    renderAdminStatRows();
  };

  applyCat(catSelect.value);
  catSelect.addEventListener('change', () => applyCat(catSelect.value));

  document.getElementById('admin-item-addStat').addEventListener('click', () => {
    adminItemState.stats.push({ label: '', value: '' });
    renderAdminStatRows();
  });

  document.getElementById('admin-item-submit').addEventListener('click', submitAdminItem);
}

async function submitAdminItem(){
  const errEl = document.getElementById('admin-item-error');
  errEl.textContent = '';
  if (!isAdminUser()) return;

  const targetId = document.getElementById('admin-item-target').value;
  const name = document.getElementById('admin-item-name').value.trim();
  const catId = document.getElementById('admin-item-cat').value;
  const subcatField = document.getElementById('admin-item-subcatField');
  const subcatId = subcatField.classList.contains('hidden') ? null : document.getElementById('admin-item-subcat').value;
  const desc = document.getElementById('admin-item-desc').value.trim();
  const qty = Math.max(1, Math.floor(Number(document.getElementById('admin-item-qty').value)) || 1);
  const stats = adminItemState.stats
    .filter(s => s.label.trim() && s.value.trim())
    .map(s => ({ label: s.label.trim(), value: s.value.trim() }));

  if (!name){
    errEl.textContent = 'Ponle un nombre al objeto.';
    return;
  }

  const submitBtn = document.getElementById('admin-item-submit');
  submitBtn.disabled = true;

  try {
    const { db, ref, get, push, update } = window.fb;
    const invRef = ref(db, `tienda/personajes/${targetId}/inventario`);
    const snap = await get(invRef);
    const data = snap.exists() ? snap.val() : {};
    const existingKey = Object.keys(data).find(k => data[k].catId === catId && data[k].name === name);
    const fecha = nowFecha();

    if (existingKey){
      await update(ref(db), {
        [`tienda/personajes/${targetId}/inventario/${existingKey}/qty`]: (data[existingKey].qty || 0) + qty,
        [`tienda/personajes/${targetId}/inventario/${existingKey}/fecha`]: fecha,
      });
    } else {
      const newKey = push(invRef).key;
      await update(ref(db), {
        [`tienda/personajes/${targetId}/inventario/${newKey}`]: {
          name, qty, catId, origen: 'Dirección (DJ)', fecha, custom: true,
          effect: desc || null, subcatId: subcatId || null,
          stats: stats.length ? stats : null
        }
      });
    }

    const logKey = push(ref(db, 'tienda/objetosLog')).key;
    await update(ref(db), {
      [`tienda/objetosLog/${logKey}`]: {
        tipo: 'creacion', item: name, catId, qty, personaje: 'admin',
        facility: 'Dirección (DJ)', propietario: targetId, fecha, ts: Date.now()
      }
    });

    showToast(`${name} entregado a ${targetId === 'nave' ? 'la nave' : personajeLabel(targetId)}.`);
    document.getElementById('admin-item-name').value = '';
    document.getElementById('admin-item-desc').value = '';
    document.getElementById('admin-item-qty').value = '1';
  } catch(err){
    console.error(err);
    errEl.textContent = 'Error de conexión — inténtalo de nuevo.';
  } finally {
    submitBtn.disabled = false;
  }
}

/* =========================================================
   ARTEFACTOS PRETECNOLÓGICOS
   ========================================================= */
const artifactState = { stats: [{ label: 'Bonificador', value: '' }, { label: 'Coste de Tensión de Sistema', value: '' }] };

function buildArtifactForm(){
  return `
    <div class="craft-field">
      <label>Destino</label>
      <select id="artifact-target">${targetOptionsHtml()}</select>
    </div>
    <div class="craft-field">
      <label>Nombre del artefacto</label>
      <input type="text" id="artifact-name" placeholder="Ej. Manto Fantasma">
    </div>
    <div class="craft-field">
      <label>Tipo</label>
      <select id="artifact-tipo">
        <option value="Armadura">Armadura</option>
        <option value="Arma">Arma</option>
        <option value="Equipo">Equipo</option>
      </select>
    </div>
    <div class="craft-field">
      <label>Procedencia / fabricante (opcional)</label>
      <input type="text" id="artifact-procedencia" placeholder="Ej. Mandato, fabricante desconocido...">
    </div>
    <div class="craft-field">
      <label>Descripción y reglas completas</label>
      <textarea id="artifact-desc" style="min-height:110px;" placeholder="Qué hace, cómo se activa, restricciones..."></textarea>
    </div>
    <div class="craft-field">
      <label>Características (bonificadores, CA, tiradas de salvación...)</label>
      <div id="artifact-stats" class="craft-materials"></div>
      <button type="button" class="craft-add-material" id="artifact-addStat">+ AÑADIR CARACTERÍSTICA</button>
    </div>
    <div id="artifact-error" class="move-error"></div>
    <button class="cyber-btn craft-submit-btn" id="artifact-submit">OTORGAR ARTEFACTO</button>
  `;
}

function renderArtifactStatRows(){
  const box = document.getElementById('artifact-stats');
  box.innerHTML = artifactState.stats.map((row, i) => `
    <div class="craft-material-row" data-idx="${i}">
      <input type="text" placeholder="Nombre" value="${esc(row.label)}" data-role="stat-label">
      <input type="text" placeholder="Valor" value="${esc(row.value)}" data-role="stat-value">
      <button type="button" data-role="stat-remove">✕</button>
    </div>
  `).join('');
  box.querySelectorAll('.craft-material-row').forEach(rowEl => {
    const idx = parseInt(rowEl.dataset.idx, 10);
    rowEl.querySelector('[data-role="stat-label"]').addEventListener('input', (ev) => { artifactState.stats[idx].label = ev.target.value; });
    rowEl.querySelector('[data-role="stat-value"]').addEventListener('input', (ev) => { artifactState.stats[idx].value = ev.target.value; });
    rowEl.querySelector('[data-role="stat-remove"]').addEventListener('click', () => { artifactState.stats.splice(idx,1); renderArtifactStatRows(); });
  });
}

function wireArtifactForm(){
  renderArtifactStatRows();
  document.getElementById('artifact-addStat').addEventListener('click', () => {
    artifactState.stats.push({ label: '', value: '' });
    renderArtifactStatRows();
  });
  document.getElementById('artifact-submit').addEventListener('click', submitArtifact);
}

async function submitArtifact(){
  const errEl = document.getElementById('artifact-error');
  errEl.textContent = '';
  if (!isAdminUser()) return;

  const targetId = document.getElementById('artifact-target').value;
  const name = document.getElementById('artifact-name').value.trim();
  const tipo = document.getElementById('artifact-tipo').value;
  const procedencia = document.getElementById('artifact-procedencia').value.trim();
  const desc = document.getElementById('artifact-desc').value.trim();

  if (!name){
    errEl.textContent = 'Ponle un nombre al artefacto.';
    return;
  }

  const stats = [];
  stats.push({ label: 'Tipo', value: tipo });
  if (procedencia) stats.push({ label: 'Procedencia', value: procedencia });
  artifactState.stats
    .filter(s => s.label.trim() && s.value.trim())
    .forEach(s => stats.push({ label: s.label.trim(), value: s.value.trim() }));

  const submitBtn = document.getElementById('artifact-submit');
  submitBtn.disabled = true;

  try {
    const { db, ref, get, push, update } = window.fb;
    const invRef = ref(db, `tienda/personajes/${targetId}/inventario`);
    const snap = await get(invRef);
    const data = snap.exists() ? snap.val() : {};
    const existingKey = Object.keys(data).find(k => data[k].catId === 'artefacto' && data[k].name === name);
    const fecha = nowFecha();

    if (existingKey){
      await update(ref(db), {
        [`tienda/personajes/${targetId}/inventario/${existingKey}/qty`]: (data[existingKey].qty || 0) + 1,
        [`tienda/personajes/${targetId}/inventario/${existingKey}/fecha`]: fecha,
      });
    } else {
      const newKey = push(invRef).key;
      await update(ref(db), {
        [`tienda/personajes/${targetId}/inventario/${newKey}`]: {
          name, qty: 1, catId: 'artefacto', origen: 'Artefacto pretecnológico', fecha,
          custom: true, effect: desc || null, stats
        }
      });
    }

    const logKey = push(ref(db, 'tienda/objetosLog')).key;
    await update(ref(db), {
      [`tienda/objetosLog/${logKey}`]: {
        tipo: 'creacion', item: name, catId: 'artefacto', qty: 1, personaje: 'admin',
        facility: 'Artefacto pretecnológico', propietario: targetId, fecha, ts: Date.now()
      }
    });

    showToast(`${name} otorgado a ${targetId === 'nave' ? 'la nave' : personajeLabel(targetId)}.`);
    document.getElementById('artifact-name').value = '';
    document.getElementById('artifact-procedencia').value = '';
    document.getElementById('artifact-desc').value = '';
    artifactState.stats = [{ label: 'Bonificador', value: '' }, { label: 'Coste de Tensión de Sistema', value: '' }];
    renderArtifactStatRows();
  } catch(err){
    console.error(err);
    errEl.textContent = 'Error de conexión — inténtalo de nuevo.';
  } finally {
    submitBtn.disabled = false;
  }
}

/* =========================================================
   PESTAÑA CREAR: TALLER / LABORATORIO
   ========================================================= */
const FACILITIES = {
  taller:      { label: 'Taller',      allowed: ['kael', 'wulfram'], bodyId: 'tallerBody' },
  laboratorio: { label: 'Laboratorio', allowed: ['nikola'],          bodyId: 'labBody' },
};
const craftState = {
  taller:      { materials: [], stats: [] }, // materials: [{invKey,amount}], stats: [{label,value}]
  laboratorio: { materials: [], stats: [] },
};

// Sugerencias de partida según categoría — no son un esquema fijo, el
// jugador puede añadir, quitar o renombrar libremente cada línea.
const CATEGORIA_STAT_PRESETS = {
  melee:      ['Daño', 'Choque', 'Atributo'],
  distancia:  ['Daño', 'Alcance', 'Peso', 'Munición'],
  municion:   ['Compatible con', 'Cantidad por carga'],
  armadura:   ['CA', 'Peso'],
  equipo:     [],
  comercio:   ['Tipo de bien'],
  naves:      ['Velocidad', 'Blindaje', 'Tripulación'],
  vehiculos:  ['Velocidad', 'Capacidad de carga'],
  cyberware:  ['Slot', 'Efecto'],
  ingenieria: ['Nivel', 'Adicional'],
};

function skinForCatId(catId){
  const c = CATEGORIAS.find(c => c.id === catId);
  return c ? c.skin : null;
}

function renderCraftTab(){
  const cp = (currentPersonaje || '').trim().toLowerCase();
  console.log('[CREAR] currentPersonaje crudo:', JSON.stringify(currentPersonaje), '→ normalizado:', JSON.stringify(cp));
  Object.entries(FACILITIES).forEach(([facId, fac]) => {
    const body = document.getElementById(fac.bodyId);
    const allowed = currentUser && cp && fac.allowed.includes(cp);
    if (!allowed){
      body.innerHTML = `<div class="move-locked">Solo ${fac.allowed.map(id => personajeLabel(id)).join(' o ')} ${fac.allowed.length>1?'pueden':'puede'} crear aquí. Cualquiera puede ver esta sección.</div>`;
      return;
    }
    body.innerHTML = buildCraftForm(facId);
    wireCraftForm(facId);
  });
}

function buildCraftForm(facId){
  const catOptions = CATEGORIAS.map(c => `<option value="${c.id}">${esc(c.label)}</option>`).join('');
  return `
    <div class="craft-field">
      <label>Nombre del objeto</label>
      <input type="text" id="craft-${facId}-name" placeholder="Ej. Pieza reparada">
    </div>
    <div class="craft-field">
      <label>Categoría</label>
      <select id="craft-${facId}-cat">${catOptions}</select>
    </div>
    <div class="craft-field hidden" id="craft-${facId}-subcatField">
      <label>Subcategoría</label>
      <select id="craft-${facId}-subcat"></select>
    </div>
    <div class="craft-field">
      <label>Descripción / efecto (opcional)</label>
      <textarea id="craft-${facId}-desc" placeholder="Qué hace, cómo se usa..."></textarea>
    </div>
    <div class="craft-field">
      <label>Cantidad a crear</label>
      <input type="number" id="craft-${facId}-qty" min="1" value="1">
    </div>

    <div class="craft-field">
      <label>Características (opcional — ajusta según lo que necesite este objeto)</label>
      <div id="craft-${facId}-stats" class="craft-materials"></div>
      <button type="button" class="craft-add-material" id="craft-${facId}-addStat">+ AÑADIR CARACTERÍSTICA</button>
    </div>

    <label class="craft-checkbox">
      <input type="checkbox" id="craft-${facId}-consume">
      Consumir materiales del inventario de la nave
    </label>
    <div id="craft-${facId}-materialsBox" class="hidden">
      <div id="craft-${facId}-materials" class="craft-materials"></div>
      <button type="button" class="craft-add-material" id="craft-${facId}-addMat">+ AÑADIR MATERIAL</button>
    </div>
    <div id="craft-${facId}-error" class="move-error"></div>
    <button class="cyber-btn craft-submit-btn" id="craft-${facId}-submit">CREAR OBJETO</button>
  `;
}

function naveInventoryOptions(selectedKey){
  const inv = (personajesData.nave && personajesData.nave.inventario) || {};
  return Object.entries(inv).map(([key, it]) => {
    const sel = key === selectedKey ? 'selected' : '';
    return `<option value="${key}" ${sel}>${esc(it.name)} (${esc(it.qty)} disp.)</option>`;
  }).join('');
}

function renderMaterialRows(facId){
  const box = document.getElementById(`craft-${facId}-materials`);
  const rows = craftState[facId].materials;
  box.innerHTML = rows.map((row, i) => `
    <div class="craft-material-row" data-idx="${i}">
      <select data-role="mat-select">${naveInventoryOptions(row.invKey)}</select>
      <input type="number" min="1" value="${row.amount}" data-role="mat-amount">
      <button type="button" data-role="mat-remove">✕</button>
    </div>
  `).join('');

  box.querySelectorAll('.craft-material-row').forEach(rowEl => {
    const idx = parseInt(rowEl.dataset.idx, 10);
    rowEl.querySelector('[data-role="mat-select"]').addEventListener('change', (ev) => {
      craftState[facId].materials[idx].invKey = ev.target.value;
    });
    rowEl.querySelector('[data-role="mat-amount"]').addEventListener('change', (ev) => {
      craftState[facId].materials[idx].amount = Math.max(1, Math.floor(Number(ev.target.value)) || 1);
    });
    rowEl.querySelector('[data-role="mat-remove"]').addEventListener('click', () => {
      craftState[facId].materials.splice(idx, 1);
      renderMaterialRows(facId);
    });
  });
}

function renderStatRows(facId){
  const box = document.getElementById(`craft-${facId}-stats`);
  const rows = craftState[facId].stats;
  box.innerHTML = rows.map((row, i) => `
    <div class="craft-material-row" data-idx="${i}">
      <input type="text" placeholder="Nombre (ej. Daño)" value="${esc(row.label)}" data-role="stat-label">
      <input type="text" placeholder="Valor (ej. 1d6+1)" value="${esc(row.value)}" data-role="stat-value">
      <button type="button" data-role="stat-remove">✕</button>
    </div>
  `).join('');

  box.querySelectorAll('.craft-material-row').forEach(rowEl => {
    const idx = parseInt(rowEl.dataset.idx, 10);
    rowEl.querySelector('[data-role="stat-label"]').addEventListener('input', (ev) => {
      craftState[facId].stats[idx].label = ev.target.value;
    });
    rowEl.querySelector('[data-role="stat-value"]').addEventListener('input', (ev) => {
      craftState[facId].stats[idx].value = ev.target.value;
    });
    rowEl.querySelector('[data-role="stat-remove"]').addEventListener('click', () => {
      craftState[facId].stats.splice(idx, 1);
      renderStatRows(facId);
    });
  });
}

function applyStatPresets(facId, catId){
  const presets = CATEGORIA_STAT_PRESETS[catId] || [];
  craftState[facId].stats = presets.map(label => ({ label, value: '' }));
  renderStatRows(facId);
}

function updateSubcatOptions(facId, catId){
  const fieldWrap = document.getElementById(`craft-${facId}-subcatField`);
  const select = document.getElementById(`craft-${facId}-subcat`);
  const subs = SUBCATS_BY_CAT[catId] || [];
  if (subs.length > 1){
    select.innerHTML = subs.map(s => `<option value="${s.id}">${esc(s.label)}</option>`).join('');
    fieldWrap.classList.remove('hidden');
  } else {
    select.innerHTML = '';
    fieldWrap.classList.add('hidden');
  }
}

function wireCraftForm(facId){
  const consumeChk = document.getElementById(`craft-${facId}-consume`);
  const materialsBox = document.getElementById(`craft-${facId}-materialsBox`);
  const catSelect = document.getElementById(`craft-${facId}-cat`);

  // estado inicial para la categoría por defecto (la primera del select)
  updateSubcatOptions(facId, catSelect.value);
  applyStatPresets(facId, catSelect.value);

  catSelect.addEventListener('change', () => {
    updateSubcatOptions(facId, catSelect.value);
    applyStatPresets(facId, catSelect.value);
  });

  document.getElementById(`craft-${facId}-addStat`).addEventListener('click', () => {
    craftState[facId].stats.push({ label: '', value: '' });
    renderStatRows(facId);
  });

  consumeChk.addEventListener('change', () => {
    materialsBox.classList.toggle('hidden', !consumeChk.checked);
    if (consumeChk.checked && !craftState[facId].materials.length){
      addMaterialRow(facId);
    }
  });

  document.getElementById(`craft-${facId}-addMat`).addEventListener('click', () => addMaterialRow(facId));
  document.getElementById(`craft-${facId}-submit`).addEventListener('click', () => submitCraft(facId));
}

function addMaterialRow(facId){
  const inv = (personajesData.nave && personajesData.nave.inventario) || {};
  const firstKey = Object.keys(inv)[0] || null;
  craftState[facId].materials.push({ invKey: firstKey, amount: 1 });
  renderMaterialRows(facId);
}

async function submitCraft(facId){
  const errEl = document.getElementById(`craft-${facId}-error`);
  errEl.textContent = '';

  const fac = FACILITIES[facId];
  const cp = (currentPersonaje || '').trim().toLowerCase();
  if (!currentUser || !cp || !fac.allowed.includes(cp)){
    errEl.textContent = 'No tienes permiso para crear aquí.';
    return;
  }

  const name = document.getElementById(`craft-${facId}-name`).value.trim();
  const catId = document.getElementById(`craft-${facId}-cat`).value;
  const subcatField = document.getElementById(`craft-${facId}-subcatField`);
  const subcatId = subcatField.classList.contains('hidden') ? null : document.getElementById(`craft-${facId}-subcat`).value;
  const desc = document.getElementById(`craft-${facId}-desc`).value.trim();
  const qty = Math.max(1, Math.floor(Number(document.getElementById(`craft-${facId}-qty`).value)) || 1);
  const consume = document.getElementById(`craft-${facId}-consume`).checked;
  const stats = craftState[facId].stats
    .filter(s => s.label.trim() && s.value.trim())
    .map(s => ({ label: s.label.trim(), value: s.value.trim() }));

  if (!name){
    errEl.textContent = 'Ponle un nombre al objeto.';
    return;
  }

  const materials = consume
    ? craftState[facId].materials.filter(m => m.invKey && m.amount > 0)
    : [];

  const submitBtn = document.getElementById(`craft-${facId}-submit`);
  submitBtn.disabled = true;

  try {
    const { db, ref, runTransaction, get, push, update } = window.fb;

    // consumir materiales (secuencial; si alguno falla a mitad, los
    // anteriores ya se habrán descontado — aceptable para una mesa de confianza)
    const materialNames = [];
    for (const m of materials){
      const invSnapBefore = (personajesData.nave.inventario || {})[m.invKey];
      if (!invSnapBefore) continue;
      const qtyRef = ref(db, `tienda/personajes/nave/inventario/${m.invKey}/qty`);
      const result = await runTransaction(qtyRef, (current) => {
        const cur = (typeof current === 'number') ? current : 0;
        if (cur < m.amount) return;
        return cur - m.amount;
      });
      if (!result.committed){
        throw new Error(`No hay suficiente "${invSnapBefore.name}" para consumir.`);
      }
      if (result.snapshot.val() === 0){
        await update(ref(db), { [`tienda/personajes/nave/inventario/${m.invKey}`]: null });
      }
      materialNames.push(`${m.amount}× ${invSnapBefore.name}`);
    }

    // crear el objeto en el inventario de la nave (fusiona si ya existe)
    const invRef = ref(db, 'tienda/personajes/nave/inventario');
    const snap = await get(invRef);
    const data = snap.exists() ? snap.val() : {};
    const existingKey = Object.keys(data).find(k => data[k].catId === catId && data[k].name === name);
    const fecha = nowFecha();

    if (existingKey){
      await update(ref(db), {
        [`tienda/personajes/nave/inventario/${existingKey}/qty`]: (data[existingKey].qty || 0) + qty,
        [`tienda/personajes/nave/inventario/${existingKey}/fecha`]: fecha,
      });
    } else {
      const newKey = push(invRef).key;
      await update(ref(db), {
        [`tienda/personajes/nave/inventario/${newKey}`]: {
          name, qty, catId, origen: fac.label, fecha, custom: true,
          effect: desc || null, subcatId: subcatId || null,
          stats: stats.length ? stats : null
        }
      });
    }

    const logKey = push(ref(db, 'tienda/objetosLog')).key;
    await update(ref(db), {
      [`tienda/objetosLog/${logKey}`]: {
        tipo: 'creacion', item: name, catId, qty, personaje: currentPersonaje,
        facility: fac.label, materiales: materialNames.join(', ') || null,
        fecha, ts: Date.now()
      }
    });

    showToast(`${name} creado en ${fac.label}.`);
    document.getElementById(`craft-${facId}-name`).value = '';
    document.getElementById(`craft-${facId}-desc`).value = '';
    document.getElementById(`craft-${facId}-qty`).value = '1';
    document.getElementById(`craft-${facId}-consume`).checked = false;
    document.getElementById(`craft-${facId}-materialsBox`).classList.add('hidden');
    craftState[facId].materials = [];
    applyStatPresets(facId, catId);
  } catch(err){
    errEl.textContent = err.message || 'Error de conexión — inténtalo de nuevo.';
    console.error(err);
  } finally {
    submitBtn.disabled = false;
  }
}

/* =========================================================
   PESTAÑA INVENTARIO (por categorías, estilo tienda)
   ========================================================= */
const invSectionState = { personal: { cat: null, sub: null }, nave: { cat: null, sub: null } };

function groupInventoryByCat(inventario){
  const groups = {};
  Object.entries(inventario || {}).forEach(([key, it]) => {
    const cat = it.catId || CATEGORIA_SIN_ID;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push({ ...it, _key: key });
  });
  return groups;
}

function renderInventorySection(stateKey, inventario, navId, contentId, ownerId){
  const state = invSectionState[stateKey];
  const groups = groupInventoryByCat(inventario);
  let cats = CATEGORIAS.slice();
  if (groups[CATEGORIA_SIN_ID] && groups[CATEGORIA_SIN_ID].length){
    cats = cats.concat([{ id: CATEGORIA_SIN_ID, label: CATEGORIA_SIN_LABEL }]);
  }

  let active = state.cat;
  const activeHasItems = active && groups[active] && groups[active].length;
  if (!activeHasItems){
    const firstWithItems = cats.find(c => groups[c.id] && groups[c.id].length);
    active = firstWithItems ? firstWithItems.id : null;
    state.cat = active;
    state.sub = null;
  }

  const navEl = document.getElementById(navId);
  const contentEl = document.getElementById(contentId);

  navEl.innerHTML = cats.map(c => {
    const items = groups[c.id] || [];
    const empty = items.length === 0;
    const isOn = !empty && c.id === active;
    return `<button data-cat="${c.id}" class="${isOn?'on':''}${empty?' empty':''}" ${empty?'disabled':''}>${esc(c.label)}${empty?'':' ('+items.length+')'}</button>`;
  }).join('');

  navEl.querySelectorAll('button:not(.empty)').forEach(b => {
    b.addEventListener('click', () => {
      if (state.cat !== b.dataset.cat){ state.cat = b.dataset.cat; state.sub = null; }
      renderInventarioTab();
    });
  });

  if (!active){
    contentEl.innerHTML = `<div class="personaje-empty">Sin objetos registrados todavía.</div>`;
    return;
  }
  if (!catalogReady){
    contentEl.innerHTML = `<div class="personaje-empty">Cargando catálogo de referencia...</div>`;
    return;
  }

  const catItems = groups[active] || [];
  const subcatsDef = (active === CATEGORIA_SIN_ID) ? [] : (SUBCATS_BY_CAT[active] || []);

  let subNavHtml = '';
  let itemsToRender = catItems;

  if (subcatsDef.length > 1){
    const subGroups = {};
    catItems.forEach(it => {
      const sk = subcatKeyForItem(it);
      if (!subGroups[sk]) subGroups[sk] = [];
      subGroups[sk].push(it);
    });

    let subList = subcatsDef.slice();
    if (subGroups['sin-subcategoria'] && subGroups['sin-subcategoria'].length){
      subList = subList.concat([{ id: 'sin-subcategoria', label: 'Otros' }]);
    }

    let activeSub = state.sub;
    const activeSubHasItems = activeSub && subGroups[activeSub] && subGroups[activeSub].length;
    if (!activeSubHasItems){
      const firstSub = subList.find(s => subGroups[s.id] && subGroups[s.id].length);
      activeSub = firstSub ? firstSub.id : null;
      state.sub = activeSub;
    }

    subNavHtml = `<div class="subcat-nav inv-subcat-nav">` + subList.map(s => {
      const items = subGroups[s.id] || [];
      const empty = items.length === 0;
      const isOn = !empty && s.id === activeSub;
      return `<button data-sub="${s.id}" class="${isOn?'on':''}${empty?' empty':''}" ${empty?'disabled':''}>${esc(s.label)}${empty?'':' ('+items.length+')'}</button>`;
    }).join('') + `</div>`;

    itemsToRender = activeSub ? (subGroups[activeSub] || []) : [];
  } else {
    state.sub = null;
  }

  const sortedItems = itemsToRender.slice().sort((a,b) => (a.name||'').localeCompare(b.name||''));

  const bodyHtml = sortedItems.length
    ? `<div class="inv-grid">` + sortedItems.map(it => {
        const found = catalogIndex[catalogKey(it.catId, it.name)];
        const ctx = { ownerId, invKey: it._key, catId: it.catId, name: it.name };
        if (found){
          const idx = registerInvItem(found.skin, found.item, it.qty, ctx);
          return `<div class="inv-card-click" data-iidx="${idx}">${buildInventoryCard(found.skin, found.item, it.qty, '')}</div>`;
        }
        if (it.custom){
          const skin = skinForCatId(it.catId) || 'list';
          const customItem = { name: it.name, effect: it.effect, stats: it.stats || [] };
          const idx = registerInvItem(skin, customItem, it.qty, ctx);
          return `<div class="inv-card-click" data-iidx="${idx}">${buildInventoryCard(skin, customItem, it.qty, '')}</div>`;
        }
        const idx = registerInvItem(null, { name: it.name }, it.qty, ctx);
        return `<div class="inv-card-click" data-iidx="${idx}"><div class="pi-row"><span class="pi-name">${esc(it.name)}</span><span class="pi-qty">×${esc(it.qty)}</span></div></div>`;
      }).join('') + `</div>`
    : `<div class="personaje-empty">Sin objetos en esta categoría.</div>`;

  contentEl.innerHTML = subNavHtml + bodyHtml;

  contentEl.querySelectorAll('.inv-subcat-nav button:not(.empty)').forEach(b => {
    b.addEventListener('click', () => {
      state.sub = b.dataset.sub;
      renderInventarioTab();
    });
  });
}

function renderInventarioTab(){
  invItemRegistry = [];

  // --- sección personal ---
  const locked = document.getElementById('invPersonalLocked');
  const body = document.getElementById('invPersonalBody');
  const whoTag = document.getElementById('invPersonalWho');

  if (!currentUser || !currentPersonaje){
    locked.classList.remove('hidden');
    body.classList.add('hidden');
  } else {
    locked.classList.add('hidden');
    body.classList.remove('hidden');
    whoTag.textContent = personajeLabel(currentPersonaje).toUpperCase();
    const personalInv = (personajesData[currentPersonaje] && personajesData[currentPersonaje].inventario) || {};
    renderInventorySection('personal', personalInv, 'invPersonalCatNav', 'invPersonalContent', currentPersonaje);
  }

  // --- sección nave (Pálamo Yerrante) ---
  const naveInv = (personajesData.nave && personajesData.nave.inventario) || {};
  renderInventorySection('nave', naveInv, 'invNaveCatNav', 'invNaveContent', 'nave');
}

/* =========================================================
   INIT
   ========================================================= */
function init(){
  initTabs();
  initAuth();
  initDataListeners();
  loadCatalogIndex();
  initItemModal();

  document.getElementById('moveDepositBtn').addEventListener('click', () => moveCredits('deposito'));
  document.getElementById('moveWithdrawBtn').addEventListener('click', () => moveCredits('retirada'));
  document.getElementById('moveTransferBtn').addEventListener('click', transferCredits);

  document.getElementById('comprasSearch').addEventListener('input', renderCompras);
  document.getElementById('comprasFilterPago').addEventListener('change', renderCompras);
  document.getElementById('objetosSearch').addEventListener('input', renderObjetosLog);
  document.getElementById('objetosFilterTipo').addEventListener('change', renderObjetosLog);

  document.body.addEventListener('click', (ev) => {
    const removeBtn = ev.target.closest('.admin-inv-remove');
    if (removeBtn){
      adminRemoveInvItem(removeBtn.dataset.target, removeBtn.dataset.key, removeBtn.dataset.name);
      return;
    }
    const qtyBtn = ev.target.closest('[data-role="qinc"], [data-role="qdec"]');
    if (qtyBtn){
      const delta = qtyBtn.dataset.role === 'qinc' ? 1 : -1;
      adminAdjustItemQty(qtyBtn.dataset.target, qtyBtn.dataset.key, delta);
    }
  });
}

init();
