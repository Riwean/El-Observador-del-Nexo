let TRIPULANTES = [];
let SECCIONES = [];
let currentCapitulos = [];
let glitchInterval = null;

function stopGlitch(){
  if(glitchInterval){ clearInterval(glitchInterval); glitchInterval = null; }
}

function wrapWordsForGlitch(root){
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  const textNodes = [];
  let node;
  while(node = walker.nextNode()){ if(node.nodeValue.trim()) textNodes.push(node); }
  textNodes.forEach(tn => {
    const frag = document.createDocumentFragment();
    const parts = tn.nodeValue.split(/(\s+)/);
    parts.forEach(part => {
      if(part.trim() === ''){
        frag.appendChild(document.createTextNode(part));
      } else {
        const span = document.createElement('span');
        span.className = 'gw';
        span.textContent = part;
        span.dataset.orig = part;
        frag.appendChild(span);
      }
    });
    tn.parentNode.replaceChild(frag, tn);
  });
}

const GLITCH_CHARS = '█▓▒░▚▞#%&$@01■◆×÷≠∆¤§';
function randomGlitchString(len){
  let s = '';
  for(let i = 0; i < len; i++) s += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
  return s;
}

function startGlitch(root){
  stopGlitch();
  const spans = root.querySelectorAll('.gw');
  if(!spans.length) return;
  glitchInterval = setInterval(() => {
    const count = 1 + Math.floor(Math.random() * 2);
    for(let i = 0; i < count; i++){
      const span = spans[Math.floor(Math.random() * spans.length)];
      if(!span || span.dataset.busy === '1') continue;
      span.dataset.busy = '1';
      const isRedact = Math.random() < 0.1;
      if(isRedact){
        span.textContent = 'CENSURADO';
        span.classList.add('gw-redacted');
        setTimeout(() => {
          span.textContent = span.dataset.orig;
          span.classList.remove('gw-redacted');
          span.dataset.busy = '0';
        }, 900 + Math.random() * 700);
      } else {
        const orig = span.dataset.orig;
        span.textContent = randomGlitchString(orig.length);
        span.classList.add('gw-scramble');
        setTimeout(() => {
          span.textContent = orig;
          span.classList.remove('gw-scramble');
          span.dataset.busy = '0';
        }, 120 + Math.random() * 180);
      }
    }
  }, 160);
}

function applyEffectIfAny(t){
  const detailContent = document.querySelector('.detail-content');
  const historiaEl = document.getElementById('dHistoria');
  const existingBanner = historiaEl.parentElement.querySelector('.corrupt-banner');
  if(existingBanner) existingBanner.remove();
  const existingStamp = detailContent.querySelector('.redacted-stamp');
  if(existingStamp) existingStamp.remove();
  stopGlitch();
  if(t.efecto === 'clasificado'){
    detailContent.classList.add('classified');
    const banner = document.createElement('div');
    banner.className = 'corrupt-banner';
    banner.textContent = '⚠ Archivo parcialmente corrupto — nivel de acceso insuficiente';
    historiaEl.parentElement.insertBefore(banner, historiaEl);
    wrapWordsForGlitch(historiaEl);
    startGlitch(historiaEl);
    const stamp = document.createElement('div');
    stamp.className = 'redacted-stamp';
    stamp.textContent = 'CENSURADO';
    detailContent.appendChild(stamp);
  } else {
    detailContent.classList.remove('classified');
  }
}

async function cargar(){
  try{
    const res = await fetch('legajos.json');
    const data = await res.json();
    SECCIONES = data.secciones || [];
    TRIPULANTES = SECCIONES.flatMap(s => s.tripulantes || []);
    render();
  }catch(e){
    document.getElementById('sections').innerHTML = '<div class="empty">No se pudieron cargar los legajos.</div>';
  }
}

function cardHtml(t, idx){
  return `
    <div class="card" data-idx="${idx}" style="${t.retrato ? `background-image:url('${t.retrato}')` : ''}">
      ${t.retrato ? '' : '<div class="no-portrait">Sin retrato</div>'}
      <div class="scrim"></div>
      ${t.tag ? `<span class="tag-corner">${t.tag}</span>` : ''}
      <div class="card-info">
        <h3>${t.nombre}</h3>
        <div class="rango">${t.rango}</div>
      </div>
    </div>
  `;
}

function render(){
  const container = document.getElementById('sections');
  if(!TRIPULANTES.length){
    container.innerHTML = '<div class="empty">Sin registros.</div>';
    return;
  }
  let globalIdx = 0;
  container.innerHTML = SECCIONES.map(seccion => {
    const cards = (seccion.tripulantes || []).map(t => cardHtml(t, globalIdx++)).join('');
    return `
      <div class="section">
        <div class="section-title">${seccion.titulo}</div>
        <div class="grid">${cards}</div>
      </div>
    `;
  }).join('');
  container.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => abrirDetalle(TRIPULANTES[+card.dataset.idx], card));
  });
}

function escapeHtml(s){
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderChapterText(texto){
  const blocks = texto.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
  return blocks.map(block => {
    if(block.startsWith('### ')){
      const cleaned = block.slice(4).replace(/^Parte\s+[IVXLC]+:\s*/i, '');
      return `<h4>${escapeHtml(cleaned)}</h4>`;
    }
    if(block.startsWith('## ')){
      return `<h3>${escapeHtml(block.slice(3))}</h3>`;
    }
    const isDialogue = block.startsWith('—') || block.startsWith('-');
    let html = escapeHtml(block)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/"([^"]+)"/g, '<span class="quote">&ldquo;$1&rdquo;</span>')
      .replace(/\n/g, '<br>');
    return `<p${isDialogue ? ' class="dialogue"' : ''}>${html}</p>`;
  }).join('');
}

function abrirDetalle(t, cardEl){
  const detail = document.getElementById('detail');
  const detailPortrait = document.getElementById('detailPortrait');
  const detailContent = document.querySelector('.detail-content');
  const sections = document.getElementById('sections');

  const cardRect = cardEl.getBoundingClientRect();

  detailPortrait.style.backgroundImage = t.retrato ? `url('${t.retrato}')` : '';
  document.getElementById('dNoPortrait').style.display = t.retrato ? 'none' : 'flex';
  document.getElementById('dTagCorner').textContent = t.tag || '';
  document.getElementById('dTagCorner').style.display = t.tag ? 'block' : 'none';
  document.getElementById('dNombre').textContent = t.nombre;
  document.getElementById('dRango').textContent = t.rango;

  currentCapitulos = (t.capitulos && t.capitulos.length) ? t.capitulos : [{titulo:'Historia', texto: t.historia || 'Sin información registrada.'}];
  const tabsEl = document.getElementById('chapterTabs');
  tabsEl.innerHTML = currentCapitulos.map((c, i) => `<button class="chapter-tab${i===0?' active':''}" data-ci="${i}">${c.titulo}</button>`).join('');
  tabsEl.querySelectorAll('.chapter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      tabsEl.querySelectorAll('.chapter-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('dHistoria').innerHTML = renderChapterText(currentCapitulos[+btn.dataset.ci].texto);
      applyEffectIfAny(t);
      window.scrollTo({top: 0, behavior:'smooth'});
    });
  });
  document.getElementById('dHistoria').innerHTML = renderChapterText(currentCapitulos[0].texto);
  applyEffectIfAny(t);

  sections.style.display = 'none';
  detail.classList.add('active');
  window.scrollTo(0, 0);

  detailContent.style.transition = 'none';
  detailContent.style.opacity = '0';
  detailContent.style.transform = 'translateY(10px)';

  const isMobile = window.innerWidth <= 820;
  if(!isMobile){
    const targetRect = detailPortrait.getBoundingClientRect();
    const dx = cardRect.left - targetRect.left;
    const dy = cardRect.top - targetRect.top;
    const scaleX = cardRect.width / targetRect.width;
    const scaleY = cardRect.height / targetRect.height;
    detailPortrait.style.transition = 'none';
    detailPortrait.style.transformOrigin = 'top left';
    detailPortrait.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        detailPortrait.style.transition = 'transform .55s cubic-bezier(.2,.8,.2,1)';
        detailPortrait.style.transform = 'translate(0px, 0px) scale(1, 1)';
        detailContent.style.transition = 'opacity .5s ease .2s, transform .5s ease .2s';
        detailContent.style.opacity = '1';
        detailContent.style.transform = 'translateY(0)';
      });
    });
  } else {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        detailContent.style.transition = 'opacity .4s ease';
        detailContent.style.opacity = '1';
        detailContent.style.transform = 'translateY(0)';
      });
    });
  }
}

document.getElementById('backBtn').addEventListener('click', () => {
  stopGlitch();
  const detail = document.getElementById('detail');
  const sections = document.getElementById('sections');
  const detailContent = document.querySelector('.detail-content');

  detailContent.style.transition = 'opacity .28s ease, transform .28s ease';
  detailContent.style.opacity = '0';
  detailContent.style.transform = 'translateY(-8px)';

  setTimeout(() => {
    detail.classList.remove('active');
    sections.style.display = '';
    sections.style.opacity = '0';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        sections.style.transition = 'opacity .4s ease';
        sections.style.opacity = '1';
      });
    });
  }, 260);
});

cargar();
