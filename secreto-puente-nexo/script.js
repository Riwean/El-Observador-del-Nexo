function iniciarParticulas() {
  const container = document.getElementById('particles');
  if (!container) return;
  container.innerHTML = '';
  const count = 22;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 2 + Math.random() * 3;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
    const duration = 6 + Math.random() * 6;
    p.style.animationDuration = duration + 's';
    p.style.animationDelay = (Math.random() * duration) + 's';
    container.appendChild(p);
  }
}
