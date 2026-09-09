let DATA = null;
let currentWorld = null;
let ITEM_REGISTRY = [];
let activeCatId = 'resumen';
let activeSubIndex = {};

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    DATA = data;
    initWorldPicker();
    initApp();
    initModal();
  });

function esc(s){
  if (s === null || s === undefined) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function registerItem(skin, item, catId){
  ITEM_REGISTRY.push({skin, item, catId});
  return ITEM_REGISTRY.length - 1;
}

/* ---------------- cálculo de precio y disponibilidad por mundo ---------------- */
function getPriceInfo(item, catId){
  const world = currentWorld;
  const tlBlocked = (item.tlNum !== null && item.tlNum !== undefined) && item.tlNum > world.tlNum;

  let multiplier = 1.0;
  if (catId === 'comercio'){
    const tipos = item.tipos || [];
    const tabla = (DATA.modificadoresTipo[world.id]) || {};
    if (tipos.length){
      const sum = tipos.reduce((s,t) => s + (tabla[t] !== undefined ? tabla[t] : 1.0), 0);
      multiplier = sum / tipos.length;
    }
  } else if (DATA.categoriasConPrecio.includes(catId)){
    const tabla = DATA.modificadoresCategoria[world.id] || {};
    multiplier = tabla[catId] !== undefined ? tabla[catId] : 1.0;
  }

  let displayCost = item.cost || '—';
  if (item.costValue !== null && item.costValue !== undefined && multiplier !== 1.0){
    const finalValue = Math.round(item.costValue * multiplier);
    displayCost = formatCr(finalValue) + (String(item.cost||'').includes('/ton') ? ' cr/ton' : ' cr');
  }

  return {
    available: !tlBlocked,
    displayCost,
    badge: tlBlocked ? `NO DISPONIBLE (requiere TL ${item.tlNum})` : null,
  };
}

function formatCr(n){
  return n.toLocaleString('es-ES');
}

/* ---------------- pantalla de entrada ---------------- */
function initWorldPicker(){
  const picker = document.getElementById('planetPicker');
  picker.innerHTML = DATA.mundos.map(m =>
    `<button data-world="${m.id}">${m.nombre.toUpperCase().replace(/ /g,'_')}.dat</button>`
  ).join('');
  picker.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => enterWorld(b.dataset.world));
  });
}

function enterWorld(worldId){
  currentWorld = DATA.mundos.find(m => m.id === worldId) || DATA.mundos[0];
  document.getElementById('subLine').textContent =
    `RED DE FACTORES · ${currentWorld.nombre.toUpperCase()} · CICLO ${DATA.meta.ciclo}`;
  document.querySelectorAll('#planetSelect button').forEach(b =>
    b.classList.toggle('on', b.dataset.world === worldId));
  rebuildContent();
  document.getElementById('bootScreen').classList.add('hidden');
  document.getElementById('app').classList.add('show');
}

/* ---------------- shell principal ---------------- */
function initApp(){
  const planetSelect = document.getElementById('planetSelect');
  planetSelect.innerHTML = DATA.mundos.map((m,i) =>
    `<button class="${i===0?'on':''}" data-world="${m.id}">${m.nombre.toUpperCase()}</button>`
  ).join('');
  planetSelect.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => enterWorld(b.dataset.world));
  });

  document.getElementById('changeWorldBtn').addEventListener('click', () => {
    document.getElementById('app').classList.remove('show');
    document.getElementById('bootScreen').classList.remove('hidden');
  });

  const catNav = document.getElementById('catNav');
  const catButtons = [{id:'resumen', label:'Resumen'}].concat(
    DATA.categorias.map(c => ({id:c.id, label:c.label}))
  );
  catNav.innerHTML = catButtons.map((c,i) =>
    `<button class="${i===0?'on':''}" data-cat="${c.id}">${c.label.toUpperCase()}</button>`
  ).join('');
  catNav.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => showCategory(b.dataset.cat));
  });

  const content = document.getElementById('catContent');
  content.addEventListener('click', (ev) => {
    const card = ev.target.closest('[data-ridx]');
    if (!card) return;
    openItemModal(parseInt(card.dataset.ridx, 10));
  });
}

function rebuildContent(){
  ITEM_REGISTRY = [];
  const content = document.getElementById('catContent');
  content.innerHTML = `<div class="cat-view ${activeCatId==='resumen'?'active':''}" id="cat-resumen"></div>` +
    DATA.categorias.map(cat => renderCategoryShell(cat)).join('');

  renderResumen();

  DATA.categorias.forEach(cat => {
    document.getElementById('cat-' + cat.id).classList.toggle('active', activeCatId === cat.id);
    if (cat.subcategorias && cat.subcategorias.length >= 1){
      const savedIdx = activeSubIndex[cat.id] || 0;
      const nav = document.getElementById('subnav-' + cat.id);
      if (nav){
        nav.querySelectorAll('button').forEach((b,i) => {
          b.classList.toggle('on', i === savedIdx);
          b.addEventListener('click', () => {
            activeSubIndex[cat.id] = i;
            nav.querySelectorAll('button').forEach(x => x.classList.remove('on'));
            b.classList.add('on');
            const container = document.getElementById('subviews-' + cat.id);
            container.querySelectorAll('.subcat-view').forEach(v => v.classList.remove('active'));
            document.getElementById(b.dataset.sub).classList.add('active');
          });
        });
      }
      const container = document.getElementById('subviews-' + cat.id);
      if (container){
        container.querySelectorAll('.subcat-view').forEach((v,i) => v.classList.toggle('active', i === savedIdx));
      }
    }
  });
  document.querySelectorAll('#catNav button').forEach(b => b.classList.toggle('on', b.dataset.cat === activeCatId));
}

function showCategory(catId){
  activeCatId = catId;
  document.querySelectorAll('#catNav button').forEach(b => b.classList.toggle('on', b.dataset.cat === catId));
  document.querySelectorAll('.cat-view').forEach(v => v.classList.remove('active'));
  document.getElementById('cat-' + catId).classList.add('active');
}

/* ---------------- resumen ---------------- */
function renderResumen(){
  const totalItems = DATA.categorias.reduce((sum, c) =>
    sum + c.subcategorias.reduce((s2, sc) => s2 + sc.items.length, 0), 0);
  const el = document.getElementById('cat-resumen');
  el.innerHTML = `
    <div class="panel">
      <div class="panel-label"><span>Panorama general de la ruta</span><span class="tag">${esc(currentWorld.nombre.toUpperCase())}</span></div>
      <div class="stat-grid-mini">
        <div class="stat-mini"><div class="v">${totalItems}</div><div class="l">REFERENCIAS TOTALES</div></div>
        <div class="stat-mini"><div class="v">TL ${esc(currentWorld.tlNum)}</div><div class="l">NIVEL TECNOLÓGICO</div></div>
        <div class="stat-mini"><div class="v">${DATA.categorias.length}</div><div class="l">CATEGORÍAS</div></div>
        <div class="stat-mini"><div class="v">3</div><div class="l">MUNDOS EN LA RED</div></div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-label"><span>Facción dominante</span><span class="tag">CONTROL DE RUTA</span></div>
      <div class="goods-list">
        <div class="good-row"><span class="idx">▸</span><div><div class="name">${esc(currentWorld.faccion)}</div><div class="meta">Facción con mayor influencia sobre el comercio local</div></div><div class="cr">TL ${esc(currentWorld.tlNum)}</div></div>
      </div>
    </div>
  `;
}

/* ---------------- shell de categoría + subcategorías ---------------- */
function renderCategoryShell(cat){
  const subs = cat.subcategorias || [];
  const hasMultiple = subs.length > 1;
  const navHtml = hasMultiple ? `
    <div class="subcat-nav" id="subnav-${cat.id}">
      ${subs.map((s,i) => `<button data-sub="subcat-${cat.id}-${i}">${esc(s.label)}</button>`).join('')}
    </div>` : '';

  if (cat.skin === 'cargo'){
    const viewsHtml = subs.map((s,i) => {
      const body = renderItemsForSkin(cat.skin, s.items, cat.id);
      return `<div class="subcat-view" id="subcat-${cat.id}-${i}"><h3 class="skin-title">${esc(s.label)}</h3>${body}</div>`;
    }).join('');
    return `
      <div class="cat-view" id="cat-${cat.id}">
        ${navHtml}
        <div class="panel">
          <div class="skin cargo-skin">
            <div class="cargo-hazard"></div>
            <div class="cargo-body">
              <div class="cargo-inner" id="subviews-${cat.id}">
                ${viewsHtml || '<p class="empty-note">Sin referencias registradas para esta categoría.</p>'}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (subs.some(s => s.subskin)){
    const mixedViews = subs.map((s,i) => {
      const effectiveSkin = s.subskin || cat.skin;
      const body = renderItemsForSkin(effectiveSkin, s.items, cat.id);
      return `<div class="subcat-view" id="subcat-${cat.id}-${i}">
        <div class="panel" style="padding:0;border:none;background:none;">
          <div class="skin ${skinClass(effectiveSkin)}" style="margin:0;">
            <div class="${skinInnerClass(effectiveSkin)}"><h3 class="skin-title">${esc(s.label)}</h3>${body}</div>
          </div>
        </div>
      </div>`;
    }).join('');
    return `
      <div class="cat-view" id="cat-${cat.id}">
        ${navHtml}
        <div id="subviews-${cat.id}">${mixedViews}</div>
      </div>
    `;
  }

  const viewsHtml = subs.map((s,i) => {
    const body = renderItemsForSkin(cat.skin, s.items, cat.id);
    return `<div class="subcat-view" id="subcat-${cat.id}-${i}"><h3 class="skin-title">${esc(s.label)}</h3>${body}</div>`;
  }).join('');

  return `
    <div class="cat-view" id="cat-${cat.id}">
      ${navHtml}
      <div class="panel">
        <div class="skin ${skinClass(cat.skin)}">
          ${cat.skin === 'engineering' ? '<div class="eng-grid-bg"></div>' : ''}
          <div class="${skinInnerClass(cat.skin)}" id="subviews-${cat.id}">
            ${viewsHtml || '<p class="empty-note">Sin referencias registradas para esta categoría.</p>'}
          </div>
        </div>
      </div>
    </div>
  `;
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

/* ---------------- renderizado de items según skin ---------------- */
function renderItemsForSkin(skin, items, catId){
  if (!items || !items.length) return '<p class="empty-note">Sin referencias registradas.</p>';

  const allUnavailable = (DATA.categoriasConPrecio.includes(catId) || catId === 'comercio')
    ? items.every(it => !getPriceInfo(it, catId).available)
    : false;
  const banner = allUnavailable
    ? `<div class="category-empty-note">SIN OFERTA DISPONIBLE EN ESTE MUNDO — nivel tecnológico insuficiente</div>`
    : '';

  let body;
  switch(skin){
    case 'melee': body = renderMeleeGrid(items, catId); break;
    case 'scope': body = renderScopeGrid(items, catId); break;
    case 'ammo': body = renderAmmoGrid(items, catId); break;
    case 'armor': body = renderArmorGrid(items, catId); break;
    case 'cyber': body = renderCyberGrid(items, catId); break;
    case 'pocket': body = renderPocketGrid(items, catId); break;
    case 'ship': body = renderShipRows(items, catId); break;
    case 'cargo': body = renderCargoRows(items, catId); break;
    case 'engineering': body = renderEngineering(items, catId); break;
    case 'list': body = renderListRows(items, catId); break;
    case 'showcase': body = renderShowcaseGrid(items, catId); break;
    case 'comms': body = renderSimpleCardGrid(items, 'comms-card', catId); break;
    case 'circuit': body = renderSimpleCardGrid(items, 'circuit-card', catId); break;
    case 'pharma': body = renderSimpleCardGrid(items, 'pharma-card', catId); break;
    case 'medical': body = renderMedicalGrid(items, catId); break;
    case 'electric': body = renderSimpleCardGrid(items, 'electric-card', catId); break;
    case 'communist': body = renderSimpleCardGrid(items, 'communist-card', catId); break;
    default: body = '';
  }
  return banner + body;
}

function statsHtml(stats, cls){
  return (stats||[]).map(s => `<div class="${cls}">${esc(s.label)}: ${esc(s.value)}</div>`).join('');
}

function unavailAttrs(pinfo){
  return pinfo.available ? '' : ' data-unavailable="true"';
}
function badgeHtml(pinfo){
  return pinfo.badge ? `<div class="unavailable-badge">${esc(pinfo.badge)}</div>` : '';
}

const MELEE_BLADE_ICONS = [
  '<path d="M4 22 L46 18 M40 8 L64 20 L40 32 M46 18 L46 26"/>',
  '<path d="M6 20 L70 20 M20 10 L20 30 M50 10 L50 30"/>',
  '<path d="M6 20 L60 20 M55 10 L74 20 L55 30 M35 12 L35 28"/>',
  '<path d="M8 20 L50 20 M45 6 L45 34 M50 20 L68 20"/>',
  '<path d="M6 20 L40 20 M35 8 L58 20 L35 32"/>',
];

function meleeTag(it){
  const cost = it.costValue || 0;
  if (cost <= 20) return 'CASERO';
  if (cost >= 100) return 'RARO';
  return null;
}

function renderMeleeGrid(items, catId){
  return `<div class="grid">` + items.map((it,i) => {
    const idx = registerItem('melee', it, catId);
    const pinfo = getPriceInfo(it, catId);
    const tag = meleeTag(it);
    const icon = MELEE_BLADE_ICONS[i % MELEE_BLADE_ICONS.length];
    return `
    <div class="rack-item" data-ridx="${idx}"${unavailAttrs(pinfo)}>
      ${tag ? `<span class="tape">${tag}</span>` : ''}
      <div class="blade"><svg viewBox="0 0 80 40">${icon}</svg></div>
      <div class="body">
        <div class="name">${esc(it.name)}</div>
        ${statsHtml(it.stats,'stat')}
        ${it.tl ? `<div class="stat">${esc(it.tl)}</div>` : ''}
        <div class="cr">${esc(pinfo.displayCost)}</div>
        ${badgeHtml(pinfo)}
      </div>
    </div>`; }).join('') + `</div>`;
}

function renderScopeGrid(items, catId){
  return `<div class="grid">` + items.map(it => {
    const idx = registerItem('scope', it, catId);
    const pinfo = getPriceInfo(it, catId);
    return `
    <div class="scope-card" data-ridx="${idx}"${unavailAttrs(pinfo)}>
      <div class="reticle-bg"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/><circle cx="50" cy="50" r="26"/><line x1="50" y1="4" x2="50" y2="96"/><line x1="4" y1="50" x2="96" y2="50"/></svg></div>
      <div class="head"><span class="name">${esc(it.name)}</span><span class="tl">${esc(it.tl || '')}</span></div>
      <div class="body">
        ${statsHtml(it.stats,'stat-row')}
        <div class="cr">${esc(pinfo.displayCost)}</div>
        ${badgeHtml(pinfo)}
      </div>
    </div>`; }).join('') + `</div>`;
}

function renderAmmoGrid(items, catId){
  return `<div class="grid">` + items.map(it => {
    const idx = registerItem('ammo', it, catId);
    const pinfo = getPriceInfo(it, catId);
    return `
    <div class="dogtag" data-ridx="${idx}"${unavailAttrs(pinfo)}>
      <h4>${esc(it.name)}</h4>
      ${(it.stats||[]).map(s=>`<div class="row"><span>${esc(s.label).toUpperCase()}</span><span>${esc(s.value)}</span></div>`).join('')}
      <div class="cr">${esc(pinfo.displayCost)}</div>
      ${badgeHtml(pinfo)}
    </div>`; }).join('') + `</div>`;
}

function renderArmorGrid(items, catId){
  return `<div class="grid">` + items.map(it => {
    const idx = registerItem('armor', it, catId);
    const pinfo = getPriceInfo(it, catId);
    return `
    <div class="plate-card" data-ridx="${idx}"${unavailAttrs(pinfo)}>
      <div class="rivets"><span class="rivet"></span><span class="rivet"></span></div>
      <div class="body">
        <div class="name">${esc(it.name)}</div>
        ${statsHtml(it.stats,'stat')}
        ${it.ac ? `<span class="ac-badge">CA ${esc(it.ac)}</span>` : ''}
        <span class="cr">${esc(pinfo.displayCost)}</span>
        ${badgeHtml(pinfo)}
      </div>
    </div>`; }).join('') + `</div>`;
}

function renderCyberGrid(items, catId){
  return `<div class="grid">` + items.map(it => {
    const idx = registerItem('cyber', it, catId);
    const pinfo = getPriceInfo(it, catId);
    return `
    <div class="cyber-card" data-ridx="${idx}"${unavailAttrs(pinfo)}>
      <h4>${esc(it.name)}</h4>
      ${statsHtml(it.stats,'stat')}
      ${it.tl ? `<div class="stat">${esc(it.tl)}</div>` : ''}
      ${it.effect ? `<div class="effect">${esc(it.effect)}</div>` : ''}
      <div class="cr">${esc(pinfo.displayCost)}</div>
      ${badgeHtml(pinfo)}
    </div>`; }).join('') + `</div>`;
}

function renderPocketGrid(items, catId){
  return `<div class="grid">` + items.map(it => {
    const idx = registerItem('pocket', it, catId);
    const pinfo = getPriceInfo(it, catId);
    return `
    <div class="pocket-item" data-ridx="${idx}"${unavailAttrs(pinfo)}>
      <div class="name">${esc(it.name)}</div>
      ${statsHtml(it.stats,'stat')}
      ${it.tl ? `<div class="stat">${esc(it.tl)}</div>` : ''}
      <div class="cr">${esc(pinfo.displayCost)}</div>
      ${badgeHtml(pinfo)}
    </div>`; }).join('') + `</div>`;
}

function renderShipRows(items, catId){
  return `<div class="rows">` + items.map(it => {
    const idx = registerItem('ship', it, catId);
    const pinfo = getPriceInfo(it, catId);
    return `
    <div class="dock-slot" data-ridx="${idx}"${unavailAttrs(pinfo)}>
      <div class="info">
        <h4>${esc(it.name)}</h4>
        <div class="stats">${(it.stats||[]).map(s=>esc(s.label)+': '+esc(s.value)).join(' · ')}</div>
        ${it.effect ? `<div class="effect">${esc(it.effect)}</div>` : ''}
        ${badgeHtml(pinfo)}
      </div>
      <div class="price">
        <div class="cr">${esc(pinfo.displayCost)}</div>
        <div class="tl">${esc(it.tl || '')}</div>
      </div>
    </div>`; }).join('') + `</div>`;
}

function containerCode(index){
  const num = String((index % 30) + 1).padStart(2, '0');
  const letter = String.fromCharCode(65 + (index % 20));
  return `${num}-${letter}`;
}

function renderCargoRows(items, catId){
  return `<div class="rows">` + items.map((it, i) => {
    const idx = registerItem('cargo', it, catId);
    const pinfo = getPriceInfo(it, catId);
    return `
    <div class="crate" data-ridx="${idx}"${unavailAttrs(pinfo)}>
      <div class="stencil-block">CONT.<b>${containerCode(i)}</b></div>
      <div class="info">
        <h4>${esc(it.name)}</h4>
        <div class="stats">${(it.stats||[]).map(s=>esc(s.label)+': '+esc(s.value)).join(' · ')}${it.tl ? ' · '+esc(it.tl) : ''}</div>
        ${badgeHtml(pinfo)}
      </div>
      <div class="price-block">
        <div class="cr">${esc(pinfo.displayCost)}</div>
        <div class="tl">${esc(it.tl || '')}</div>
      </div>
    </div>`; }).join('') + `</div>`;
}

function renderEngineering(items, catId){
  return `<div class="eng-grid">` + items.map(it => { const idx = registerItem('engineering', it, catId); return `
    <div class="eng-card" data-ridx="${idx}">
      <div class="diagram">${esc(it.level)}</div>
      <div class="body">
        <div class="name">${esc(it.name)}</div>
        <div class="dims"><span>Coste</span><span>${esc(it.cost)}</span></div>
        ${it.extra ? `<div class="dims"><span>Adicional</span><span>${esc(it.extra)}</span></div>` : ''}
        <div class="desc">${esc(it.effect || '')}</div>
      </div>
    </div>`; }).join('') + `</div>`;
}

/* ---------------- listado simple ---------------- */
function renderListRows(items, catId){
  return `<div class="rows">` + items.map(it => {
    const idx = registerItem('list', it, catId);
    const pinfo = getPriceInfo(it, catId);
    return `
    <div class="list-row" data-ridx="${idx}"${unavailAttrs(pinfo)}>
      <div><div class="name">${esc(it.name)}</div>
        ${it.stats && it.stats.length ? `<div class="meta">${it.stats.map(s=>esc(s.label)+': '+esc(s.value)).join(' · ')}</div>` : ''}
        ${badgeHtml(pinfo)}
      </div>
      <div class="tl">${esc(it.tl || '')}</div>
      <div class="cr">${esc(pinfo.displayCost)}</div>
    </div>`; }).join('') + `</div>`;
}

/* ---------------- expositor de comercio ---------------- */
function renderShowcaseGrid(items, catId){
  return `<div class="grid">` + items.map((it,i) => {
    const idx = registerItem('showcase', it, catId);
    const pinfo = getPriceInfo(it, catId);
    const tiposChips = (it.tipos||[]).map(t => `<span class="tipo-chip">${esc(t)}</span>`).join('');
    return `
    <div class="showcase-card" data-ridx="${idx}"${unavailAttrs(pinfo)}>
      <div class="shelf-glass"></div>
      <div class="lot-row">
        <span class="lot-name">${esc(it.name)}</span>
        <span class="lot-badge">LOTE ${String(i+1).padStart(3,'0')}</span>
      </div>
      <div class="tipos-row">${tiposChips}</div>
      <div class="price-row">
        <span class="cr">${esc(pinfo.displayCost)}</span>
        <span class="unit">POR TONELADA</span>
      </div>
      ${badgeHtml(pinfo)}
    </div>`; }).join('') + `</div>`;
}

/* ---------------- instrumental médico: medbay con latido animado ---------------- */
function buildEcgPath(amp){
  const cycle = (offset) => [
    [offset+0, 17], [offset+20, 17], [offset+28, 17-amp*0.3], [offset+34, 17+amp*0.4],
    [offset+40, 17-amp], [offset+46, 17+amp*0.6], [offset+52, 17],
    [offset+70, 17], [offset+140, 17]
  ];
  const pts = [...cycle(0), ...cycle(140)];
  return pts.map(p => p.join(',')).join(' ');
}

function renderMedicalGrid(items, catId){
  return `<div class="grid">` + items.map(it => {
    const idx = registerItem('medical', it, catId);
    const pinfo = getPriceInfo(it, catId);
    return `
    <div class="medical-card" data-ridx="${idx}"${unavailAttrs(pinfo)}>
      <div class="ecg-box"><svg viewBox="0 0 280 34" preserveAspectRatio="none"><polyline class="ecg-line" points="${buildEcgPath(11)}"/></svg></div>
      <div class="body">
        <div class="name">${esc(it.name)}</div>
        ${statsHtml(it.stats,'stat')}
        ${it.tl ? `<div class="stat">${esc(it.tl)}</div>` : ''}
        <div class="cr">${esc(pinfo.displayCost)}</div>
        ${badgeHtml(pinfo)}
      </div>
    </div>`; }).join('') + `</div>`;
}

/* ---------------- tarjeta simple genérica ---------------- */
function renderSimpleCardGrid(items, cardClass, catId){
  const skinKey = cardClass.replace('-card','');
  return `<div class="grid">` + items.map(it => {
    const idx = registerItem(skinKey, it, catId);
    const pinfo = getPriceInfo(it, catId);
    return `
    <div class="${cardClass}" data-ridx="${idx}"${unavailAttrs(pinfo)}>
      <div class="name">${esc(it.name)}</div>
      ${statsHtml(it.stats,'stat')}
      ${it.tl ? `<div class="stat">${esc(it.tl)}</div>` : ''}
      <div class="cr">${esc(pinfo.displayCost)}</div>
      ${badgeHtml(pinfo)}
    </div>`; }).join('') + `</div>`;
}

/* ---------------- modal de detalle ---------------- */
function initModal(){
  const overlay = document.getElementById('itemModalOverlay');
  overlay.addEventListener('click', (ev) => {
    if (ev.target === overlay) closeItemModal();
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeItemModal();
  });
  document.getElementById('itemModalCard').addEventListener('click', (ev) => {
    if (ev.target.closest('.modal-close')) closeItemModal();
  });
}

function closeItemModal(){
  document.getElementById('itemModalOverlay').classList.remove('open');
}

function openItemModal(idx){
  const entry = ITEM_REGISTRY[idx];
  if (!entry) return;
  const {skin, item, catId} = entry;
  const container = document.getElementById('itemModalCard');
  container.innerHTML = `<button class="modal-close">✕</button>` + renderModalCard(skin, item, catId);

  const addBtn = container.querySelector('.modal-add-cart');
  const qtyInput = container.querySelector('.mq-input');
  if (qtyInput){
    container.querySelectorAll('.mq-btn').forEach(b => {
      b.addEventListener('click', () => {
        const dir = parseInt(b.dataset.dir, 10);
        const next = Math.max(1, (parseInt(qtyInput.value, 10) || 1) + dir);
        qtyInput.value = next;
      });
    });
    qtyInput.addEventListener('change', () => {
      const v = Math.max(1, parseInt(qtyInput.value, 10) || 1);
      qtyInput.value = v;
    });
  }
  if (addBtn){
    addBtn.addEventListener('click', () => {
      const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value, 10) || 1) : 1;
      const ok = addToCart(item, catId, qty);
      if (ok){
        showCartToast(`${qty}× ${item.name} añadido al manifiesto`);
        closeItemModal();
      }
    });
  }

  document.getElementById('itemModalOverlay').classList.add('open');
}

function renderModalCard(skin, it, catId){
  const pinfo = catId ? getPriceInfo(it, catId) : {available:true, displayCost: it.cost || '—', badge:null};
  const descHtml = it.effect
    ? `<div class="modal-desc">${esc(it.effect)}</div>`
    : `<div class="modal-desc placeholder">Sin descripción adicional registrada todavía.</div>`;
  const badge = badgeHtml(pinfo);

  const numericPrice = catId ? getNumericPrice(it, catId) : null;
  const addCartBtn = numericPrice !== null
    ? `<div class="modal-add-row">
         <div class="modal-qty-ctrl">
           <button class="mq-btn" data-dir="-1" type="button">−</button>
           <input class="mq-input" type="number" min="1" value="1">
           <button class="mq-btn" data-dir="1" type="button">+</button>
         </div>
         <button class="modal-add-cart">🛒 AÑADIR</button>
       </div>`
    : `<button class="modal-add-cart" disabled>SIN PRECIO FIJO — NO DISPONIBLE EN CARRITO</button>`;

  const wrapClass = skinClass(skin);
  const innerClass = skinInnerClass(skin);
  let inner = '';

  switch(skin){
    case 'melee':
      inner = `<div class="rack-item" style="cursor:default;"><div class="name" style="font-size:19px;">${esc(it.name)}</div>${statsHtml(it.stats,'stat')}${it.tl?`<div class="stat">${esc(it.tl)}</div>`:''}<div class="cr" style="font-size:23px;">${esc(pinfo.displayCost)}</div>${badge}${descHtml}</div>`;
      break;
    case 'scope':
      inner = `<div class="scope-card" style="cursor:default;"><div class="head"><span class="name">${esc(it.name)}</span><span class="tl">${esc(it.tl||'')}</span></div><div class="body">${statsHtml(it.stats,'stat-row')}<div class="cr" style="font-size:20px;">${esc(pinfo.displayCost)}</div>${badge}${descHtml}</div></div>`;
      break;
    case 'ammo':
      inner = `<div class="dogtag" style="cursor:default;"><h4 style="font-size:17px;">${esc(it.name)}</h4>${(it.stats||[]).map(s=>`<div class="row"><span>${esc(s.label).toUpperCase()}</span><span>${esc(s.value)}</span></div>`).join('')}<div class="cr" style="font-size:18px;">${esc(pinfo.displayCost)}</div>${badge}<div class="modal-desc" style="color:#333;">${it.effect?esc(it.effect):'Sin descripción adicional registrada todavía.'}</div></div>`;
      break;
    case 'armor':
      inner = `<div class="plate-card" style="cursor:default;"><div class="rivets"><span class="rivet"></span><span class="rivet"></span></div><div class="body"><div class="name" style="font-size:17px;">${esc(it.name)}</div>${statsHtml(it.stats,'stat')}${it.ac?`<span class="ac-badge">CA ${esc(it.ac)}</span>`:''}<span class="cr" style="font-size:17px;">${esc(pinfo.displayCost)}</span>${badge}${descHtml}</div></div>`;
      break;
    case 'cyber':
      inner = `<div class="cyber-card" style="cursor:default;"><h4 style="font-size:17px;">${esc(it.name)}</h4>${statsHtml(it.stats,'stat')}${it.tl?`<div class="stat">${esc(it.tl)}</div>`:''}${it.effect?`<div class="effect">${esc(it.effect)}</div>`:''}<div class="cr" style="font-size:18px;">${esc(pinfo.displayCost)}</div>${badge}</div>`;
      break;
    case 'ship':
      inner = `<div class="dock-slot" style="cursor:default;grid-template-columns:1fr;"><div class="info"><h4 style="font-size:17px;">${esc(it.name)}</h4><div class="stats">${(it.stats||[]).map(s=>esc(s.label)+': '+esc(s.value)).join(' · ')}</div>${it.effect?`<div class="effect">${esc(it.effect)}</div>`:''}${badge}</div><div class="price" style="text-align:left;margin-top:10px;"><div class="cr" style="font-size:18px;">${esc(pinfo.displayCost)}</div><div class="tl">${esc(it.tl||'')}</div></div></div>`;
      break;
    case 'cargo':
      inner = `<div class="crate" style="cursor:default;grid-template-columns:1fr;"><div class="info"><h4 style="font-size:17px;">${esc(it.name)}</h4><div class="stats">${(it.stats||[]).map(s=>esc(s.label)+': '+esc(s.value)).join(' · ')}${it.tl?' · '+esc(it.tl):''}</div>${badge}</div><div class="price-block" style="border-left:none;text-align:left;padding-top:0;"><div class="cr" style="font-size:18px;">${esc(pinfo.displayCost)}</div></div></div>`;
      break;
    case 'pocket':
      inner = `<div class="pocket-item" style="cursor:default;"><div class="name" style="font-size:17px;">${esc(it.name)}</div>${statsHtml(it.stats,'stat')}${it.tl?`<div class="stat">${esc(it.tl)}</div>`:''}<div class="cr" style="font-size:17px;">${esc(pinfo.displayCost)}</div>${badge}${descHtml}</div>`;
      break;
    case 'list':
      inner = `<div class="list-row" style="cursor:default;grid-template-columns:1fr;background:#20241f;"><div><div class="name" style="font-size:17px;">${esc(it.name)}</div>${it.stats&&it.stats.length?`<div class="meta">${it.stats.map(s=>esc(s.label)+': '+esc(s.value)).join(' · ')}</div>`:''}<div class="cr" style="font-size:17px;margin-top:8px;">${esc(pinfo.displayCost)}</div>${badge}${descHtml}</div></div>`;
      break;
    case 'showcase':
      inner = `<div class="showcase-card" style="cursor:default;"><div class="shelf-glass"></div><div class="lot-row"><span class="lot-name" style="font-size:17px;">${esc(it.name)}</span></div><div class="tipos-row">${(it.tipos||[]).map(t=>`<span class="tipo-chip">${esc(t)}</span>`).join('')}</div><div class="price-row"><span class="cr" style="font-size:20px;">${esc(pinfo.displayCost)}</span><span class="unit">POR TONELADA</span></div>${badge}${descHtml}</div>`;
      break;
    case 'comms': case 'circuit': case 'pharma': case 'electric': case 'communist':
      inner = `<div class="${skin}-card" style="cursor:default;"><div class="name" style="font-size:17px;">${esc(it.name)}</div>${statsHtml(it.stats,'stat')}${it.tl?`<div class="stat">${esc(it.tl)}</div>`:''}<div class="cr" style="font-size:17px;">${esc(pinfo.displayCost)}</div>${badge}${descHtml}</div>`;
      break;
    case 'medical':
      inner = `<div class="medical-card" style="cursor:default;"><div class="ecg-box"><svg viewBox="0 0 280 34" preserveAspectRatio="none"><polyline class="ecg-line" points="${buildEcgPath(11)}"/></svg></div><div class="body"><div class="name" style="font-size:17px;">${esc(it.name)}</div>${statsHtml(it.stats,'stat')}${it.tl?`<div class="stat">${esc(it.tl)}</div>`:''}<div class="cr" style="font-size:17px;">${esc(pinfo.displayCost)}</div>${badge}${descHtml}</div></div>`;
      break;
    case 'engineering':
      inner = `<div class="eng-card" style="cursor:default;"><div class="diagram">${esc(it.level||'')}</div><div class="body"><div class="name" style="font-size:17px;">${esc(it.name)}</div><div class="dims"><span>Coste</span><span>${esc(it.cost||'')}</span></div>${it.extra?`<div class="dims"><span>Adicional</span><span>${esc(it.extra)}</span></div>`:''}<div class="modal-desc" style="color:#a8c9dd;">${esc(it.effect||'Sin descripción adicional registrada todavía.')}</div></div></div>`;
      break;
    default:
      inner = `<div>${esc(it.name)}</div>`;
  }

  return `<div class="skin ${wrapClass}" style="margin:0;"><div class="${innerClass}">${inner}</div></div>${addCartBtn}`;
}

/* =========================================================
   CARRITO DE COMPRA
   ========================================================= */
const CART_STORAGE_KEY = 'vorago_cart_v1';
let cart = loadCart();
let shipCredits = null; // se rellena en cuanto Firebase responde
let personalCredits = null;
let payWith = 'nave'; // 'nave' | 'personal'

function loadCart(){
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e){ return []; }
}

function saveCart(){
  try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)); } catch(e){}
}

/* Precio numérico final (con multiplicador de mundo aplicado), o null si
   el ítem no tiene un precio fijo interpretable (rangos, "Special", etc.)
   o si está bloqueado por nivel tecnológico. */
function getNumericPrice(item, catId){
  const pinfo = catId ? getPriceInfo(item, catId) : {available:true};
  if (!pinfo.available) return null;
  if (item.costValue === null || item.costValue === undefined) return null;

  const world = currentWorld;
  let multiplier = 1.0;
  if (catId === 'comercio'){
    const tipos = item.tipos || [];
    const tabla = (DATA.modificadoresTipo[world.id]) || {};
    if (tipos.length){
      const sum = tipos.reduce((s,t) => s + (tabla[t] !== undefined ? tabla[t] : 1.0), 0);
      multiplier = sum / tipos.length;
    }
  } else if (DATA.categoriasConPrecio.includes(catId)){
    const tabla = DATA.modificadoresCategoria[world.id] || {};
    multiplier = tabla[catId] !== undefined ? tabla[catId] : 1.0;
  }
  return Math.round(item.costValue * multiplier);
}

function cartKey(name, catId){ return catId + '|' + name; }

function addToCart(item, catId, qty=1){
  qty = Math.max(1, Math.floor(qty) || 1);
  const price = getNumericPrice(item, catId);
  if (price === null) return false;

  const key = cartKey(item.name, catId);
  const existing = cart.find(l => l.key === key);
  if (existing){
    existing.qty += qty;
  } else {
    cart.push({ key, name: item.name, catId, unitPrice: price, qty });
  }
  saveCart();
  renderCart();
  return true;
}

function changeCartQty(key, delta){
  const line = cart.find(l => l.key === key);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0){
    cart = cart.filter(l => l.key !== key);
  }
  saveCart();
  renderCart();
}

function removeCartLine(key){
  cart = cart.filter(l => l.key !== key);
  saveCart();
  renderCart();
}

function cartTotal(){
  return cart.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
}

function cartCount(){
  return cart.reduce((sum, l) => sum + l.qty, 0);
}

function renderCart(){
  const linesEl = document.getElementById('cartLines');
  const emptyNote = document.getElementById('cartEmptyNote');
  const totalEl = document.getElementById('cartTotal');
  const buyBtn = document.getElementById('cartBuyBtn');
  const countEl = document.getElementById('cartCount');
  const creditsEl = document.getElementById('cartShipCredits');

  if (!cart.length){
    linesEl.innerHTML = '';
    linesEl.classList.add('empty');
    emptyNote.style.display = 'block';
  } else {
    linesEl.classList.remove('empty');
    emptyNote.style.display = 'none';
    linesEl.innerHTML = cart.map(l => `
      <div class="cart-line" data-key="${esc(l.key)}">
        <div class="cl-name">${esc(l.name)}</div>
        <button class="cl-remove" data-action="remove" data-key="${esc(l.key)}" title="Quitar">✕</button>
        <div class="cl-unit">${formatCr(l.unitPrice)} cr / ud.</div>
        <div class="cl-qty-row">
          <div class="cl-qty-ctrl">
            <button data-action="dec" data-key="${esc(l.key)}">−</button>
            <span class="cl-qty-val">${l.qty}</span>
            <button data-action="inc" data-key="${esc(l.key)}">+</button>
          </div>
          <div class="cl-subtotal">${formatCr(l.unitPrice * l.qty)} cr</div>
        </div>
      </div>
    `).join('');
  }

  const total = cartTotal();
  totalEl.textContent = formatCr(total) + ' cr';

  const count = cartCount();
  if (count > 0){
    countEl.textContent = count;
    countEl.classList.remove('hidden');
  } else {
    countEl.classList.add('hidden');
  }

  const payToggleRow = document.getElementById('payToggleRow');
  const creditsLabel = document.getElementById('cartCreditsLabel');
  const canUsePersonal = !!(currentUser && currentPersonaje);
  payToggleRow.classList.toggle('hidden', !canUsePersonal);
  if (!canUsePersonal) payWith = 'nave';

  document.querySelectorAll('.pay-toggle-btn').forEach(b => {
    b.classList.toggle('on', b.dataset.pay === payWith);
  });

  const relevantBalance = payWith === 'personal' ? personalCredits : shipCredits;
  creditsLabel.textContent = payWith === 'personal' ? 'TUS CRÉDITOS PERSONALES' : 'CRÉDITOS DE LA NAVE';

  if (creditsEl){
    if (relevantBalance === null){
      creditsEl.textContent = 'CARGANDO...';
      creditsEl.classList.remove('insufficient');
    } else {
      creditsEl.textContent = formatCr(relevantBalance) + ' cr';
      creditsEl.classList.toggle('insufficient', total > relevantBalance);
    }
  }

  const canBuy = cart.length > 0 && relevantBalance !== null && total <= relevantBalance && !!currentUser;
  buyBtn.disabled = !canBuy;
  if (!currentUser){
    buyBtn.textContent = 'INICIA SESIÓN PARA COMPRAR';
  } else if (relevantBalance !== null && total > relevantBalance){
    buyBtn.textContent = 'CRÉDITOS INSUFICIENTES';
  } else {
    buyBtn.textContent = 'CONFIRMAR COMPRA';
  }
}

function showCartToast(msg){
  const toast = document.getElementById('cartToast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2200);
}

function confirmPurchase(){
  if (!cart.length || !currentUser) return;
  const total = cartTotal();
  const relevantBalance = payWith === 'personal' ? personalCredits : shipCredits;
  if (relevantBalance === null || total > relevantBalance) return;
  if (payWith === 'personal' && !currentPersonaje) return;

  const buyBtn = document.getElementById('cartBuyBtn');
  buyBtn.disabled = true;
  buyBtn.textContent = 'PROCESANDO...';

  const { db, ref, runTransaction, push, update, get } = window.fb;
  const sourceRef = payWith === 'personal'
    ? ref(db, `tienda/personajes/${currentPersonaje}/credits`)
    : ref(db, 'tienda/shipCredits');
  const inventarioBase = payWith === 'personal'
    ? `tienda/personajes/${currentPersonaje}/inventario`
    : 'tienda/personajes/nave/inventario';

  runTransaction(sourceRef, (current) => {
    const currentVal = (typeof current === 'number') ? current : 0;
    if (currentVal < total) return; // aborta la transacción, no hay saldo suficiente
    return currentVal - total;
  }).then(async (result) => {
    if (!result.committed){
      showCartToast('CRÉDITOS INSUFICIENTES — operación cancelada');
      renderCart();
      return;
    }

    // Leemos el inventario actual para poder FUSIONAR cantidades en vez de
    // crear una entrada nueva por cada compra del mismo ítem.
    const invSnap = await get(ref(db, inventarioBase));
    const invData = invSnap.exists() ? invSnap.val() : {};
    const invIndex = {}; // "catId|nombre" -> { key, qty }
    Object.entries(invData).forEach(([k, v]) => {
      invIndex[`${v.catId}|${v.name}`] = { key: k, qty: v.qty || 0 };
    });

    const updates = {};
    const fecha = new Date().toLocaleString('es-ES', {
      day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'
    });
    const mundoNombre = currentWorld ? currentWorld.nombre : null;

    cart.forEach(l => {
      const mk = `${l.catId}|${l.name}`;
      if (invIndex[mk]){
        const nuevaQty = invIndex[mk].qty + l.qty;
        updates[`${inventarioBase}/${invIndex[mk].key}/qty`] = nuevaQty;
        updates[`${inventarioBase}/${invIndex[mk].key}/fecha`] = fecha;
        invIndex[mk].qty = nuevaQty;
      } else {
        const newInvKey = push(ref(db, inventarioBase)).key;
        updates[`${inventarioBase}/${newInvKey}`] = {
          name: l.name, qty: l.qty, catId: l.catId, origen: mundoNombre, fecha
        };
        invIndex[mk] = { key: newInvKey, qty: l.qty };
      }

      // El histórico de compras SÍ registra cada línea por separado,
      // aunque en el inventario se fusionen — es un libro de auditoría.
      const newCompraKey = push(ref(db, 'tienda/compras')).key;
      updates[`tienda/compras/${newCompraKey}`] = {
        comprador: currentPersonaje || null,
        pagadoCon: payWith,
        name: l.name, qty: l.qty, catId: l.catId,
        unitPrice: l.unitPrice, total: l.unitPrice * l.qty,
        origen: mundoNombre, fecha, ts: Date.now()
      };
    });

    await update(ref(db), updates);
    const summary = cart.map(l => `${l.qty}× ${l.name}`).join(', ');
    showCartToast(`COMPRA REGISTRADA — ${formatCr(total)} cr (${summary})`);
    cart = [];
    saveCart();
  }).catch((err) => {
    console.error('Error al confirmar compra:', err);
    showCartToast('ERROR AL CONECTAR CON LA NAVE — inténtalo de nuevo');
  }).finally(() => {
    renderCart();
  });
}

function initShipCreditsListener(){
  if (!window.fb){
    window.addEventListener('fb-ready', initShipCreditsListener, { once:true });
    return;
  }
  const { db, ref, onValue } = window.fb;
  onValue(ref(db, 'tienda/shipCredits'), (snap) => {
    const val = snap.val();
    shipCredits = (typeof val === 'number') ? val : 0;
    renderCart();
  });
}

/* =========================================================
   SESIÓN / LOGIN
   ========================================================= */
let currentUser = null;      // objeto de Firebase Auth, o null
let currentPersonaje = null; // "kael", "hadria", etc. — o null si no está vinculado

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
  renderCart();
}

function initAuth(){
  if (!window.fb){
    window.addEventListener('fb-ready', initAuth, { once:true });
    return;
  }
  const { auth, onAuthStateChanged, db, ref, get, onValue } = window.fb;
  let personalCreditsUnsub = null;

  onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    currentPersonaje = null;
    personalCredits = null;
    if (personalCreditsUnsub){ personalCreditsUnsub(); personalCreditsUnsub = null; }

    if (user){
      try {
        const snap = await get(ref(db, 'tienda/usuarios/' + user.uid));
        currentPersonaje = snap.exists() ? snap.val() : null;
      } catch(e){ console.error('Error resolviendo personaje:', e); }

      if (currentPersonaje){
        personalCreditsUnsub = onValue(ref(db, `tienda/personajes/${currentPersonaje}/credits`), (snap2) => {
          const val = snap2.val();
          personalCredits = (typeof val === 'number') ? val : 0;
          renderCart();
        });
      }
    }
    updateSessionUI();
  });

  document.querySelectorAll('.pay-toggle-btn').forEach(b => {
    b.addEventListener('click', () => {
      payWith = b.dataset.pay;
      renderCart();
    });
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

function initCart(){
  renderCart();
  initShipCreditsListener();
  initAuth();

  document.getElementById('cartFab').addEventListener('click', () => {
    document.getElementById('cartOverlay').classList.add('open');
  });
  document.getElementById('cartCloseBtn').addEventListener('click', () => {
    document.getElementById('cartOverlay').classList.remove('open');
  });
  document.getElementById('cartOverlay').addEventListener('click', (ev) => {
    if (ev.target.id === 'cartOverlay') document.getElementById('cartOverlay').classList.remove('open');
  });
  document.getElementById('cartBuyBtn').addEventListener('click', confirmPurchase);

  document.getElementById('cartLines').addEventListener('click', (ev) => {
    const btn = ev.target.closest('button[data-action]');
    if (!btn) return;
    const key = btn.dataset.key;
    if (btn.dataset.action === 'inc') changeCartQty(key, 1);
    else if (btn.dataset.action === 'dec') changeCartQty(key, -1);
    else if (btn.dataset.action === 'remove') removeCartLine(key);
  });
}

initCart();
