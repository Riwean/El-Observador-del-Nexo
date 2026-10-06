let ENTRADAS = [];
let activeTag = null;

async function cargar(){
  try{
    const res = await fetch('diario.json');
    const data = await res.json();
    ENTRADAS = (data.entradas || []).sort((a,b)=> b.id.localeCompare(a.id));
    renderFiltros();
    render();
  }catch(e){
    document.getElementById('timeline').innerHTML = '<div class="empty">No se pudo cargar el diario.</div>';
  }
}

function renderFiltros(){
  const tags = new Set();
  ENTRADAS.forEach(e => (e.etiquetas||[]).forEach(t => tags.add(t)));
  const el = document.getElementById('filters');
  el.innerHTML = '';
  const allBtn = document.createElement('button');
  allBtn.className = 'filter-btn' + (activeTag===null ? ' active':'');
  allBtn.textContent = 'Todas';
  allBtn.onclick = () => { activeTag = null; renderFiltros(); render(); };
  el.appendChild(allBtn);
  [...tags].sort().forEach(t => {
    const b = document.createElement('button');
    b.className = 'filter-btn' + (activeTag===t ? ' active':'');
    b.textContent = t;
    b.onclick = () => { activeTag = t; renderFiltros(); render(); };
    el.appendChild(b);
  });
}

function render(){
  const list = activeTag ? ENTRADAS.filter(e => (e.etiquetas||[]).includes(activeTag)) : ENTRADAS;
  const el = document.getElementById('timeline');
  if(!list.length){
    el.innerHTML = '<div class="empty">Sin entradas para este filtro.</div>';
    return;
  }
  el.innerHTML = list.map(e => `
    <div class="entry">
      <div class="entry-meta">
        <span class="entry-id">REGISTRO #${e.id}</span>
        <span>${e.fecha_relato}</span>
      </div>
      <h2>${e.titulo}</h2>
      ${e.imagen ? `<img src="${e.imagen}" alt="${e.titulo}">` : ''}
      <p>${e.cuerpo}</p>
      <div class="tags">
        ${(e.etiquetas||[]).map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

cargar();
