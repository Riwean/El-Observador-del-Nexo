const lines = [
  "> iniciando núcleo de navegación...",
  "> cargando enlaces de red — OBSERVADOR / BOLSA / NEXO_TV / RUTAS / NAVE / DIARIO / LEGAJOS / CODICE / HERRUMBRE",
  "> verificando credenciales de tripulación... OK",
  "> sincronizando con la Mesa Fragmentada... enlace inestable, 2 alertas pendientes",
  "> ASTERIÓN — consola de mando lista",
  ""
];
const ids = ['l1','l2','l3','l4','l5','l6'];
ids.forEach((id, i) => {
  const el = document.getElementById(id);
  setTimeout(() => {
    el.classList.add('show');
    if (i < 5) el.textContent = lines[i];
    else el.innerHTML = lines[5] + '<span class="cursor"></span>';
  }, i * 130);
});

function tick() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString('es-ES');
}
tick(); setInterval(tick, 1000);

const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);
const stars = Array.from({length: 140}, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 1.3 + 0.2,
  a: Math.random(),
  speed: Math.random() * 0.4 + 0.05
}));
function draw() {
  ctx.fillStyle = '#04070c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (const s of stars) {
    s.a += 0.005 * s.speed;
    const alpha = 0.4 + Math.sin(s.a * 10) * 0.4;
    ctx.beginPath();
    ctx.fillStyle = `rgba(150,210,255,${Math.max(0.1, alpha)})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
draw();
