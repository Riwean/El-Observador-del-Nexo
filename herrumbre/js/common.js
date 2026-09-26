const base = new URL('../', import.meta.url);

export const ruta = (p) => new URL(p, base).href;

export async function cargar(p) {
  const r = await fetch(ruta(p));
  if (!r.ok) throw new Error('No se pudo cargar ' + p);
  return r.json();
}

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const cr = (n) => {
  const t = String(Math.abs(Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
  return (n < 0 ? '−' : '') + t;
};

export const ESTADOS = {
  planificada: { txt: 'En planificación', clase: 'info' },
  'en-obra': { txt: 'En obra', clase: 'warn' },
  operativa: { txt: 'Operativa', clase: 'ok' }
};

export const ESTADO_FASE = {
  pendiente: { txt: 'Pendiente', clase: 'mute' },
  'en-curso': { txt: 'En curso', clase: 'acc' },
  completada: { txt: 'Completada', clase: 'ok' }
};

export function estadoFase(f, mes) {
  if (mes < f.desde) return 'pendiente';
  if (mes >= f.hasta) return 'completada';
  return 'en-curso';
}

export function progresoFase(f, mes) {
  return Math.max(0, Math.min(1, (mes - f.desde) / (f.hasta - f.desde)));
}

export function estadoZona(z, fases, mes) {
  if (z.estado) return z.estado;
  const e = estadoFase(fases[z.desde], mes);
  return e === 'pendiente' ? 'planificada' : e === 'en-curso' ? 'en-obra' : 'operativa';
}

// Fases que están en curso; si no hay ninguna, la última completada o la primera pendiente.
export function fasesEnCurso(plan) {
  const ec = plan.fases.filter((f) => estadoFase(f, plan.mesActual) === 'en-curso');
  if (ec.length) return ec;
  const hechas = plan.fases.filter((f) => estadoFase(f, plan.mesActual) === 'completada');
  return hechas.length ? [hechas[hechas.length - 1]] : [plan.fases[0]];
}

export function nombreEn(z, fase) {
  let n = z.nombre;
  if (z.nombres) {
    Object.keys(z.nombres).map(Number).sort((a, b) => a - b).forEach((k) => { if (k <= fase) n = z.nombres[k]; });
  }
  return n;
}

export function poligono(z) {
  if (z.poly) return z.poly;
  const [x0, y0, x1, y1] = z.rect;
  return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
}

export const visibleEn = (z, fase) => z.desde <= fase && (z.hasta == null || fase <= z.hasta);

export const movimientosHasta = (cuentas, mes) => cuentas.movimientos.filter((m) => m.mes <= mes);

export const saldoFondo = (cuentas, id, mes = Infinity) => movimientosHasta(cuentas, mes).filter((m) => m.fondo === id).reduce((s, m) => s + m.importe, 0);

export const dispuestoTramo = (cuentas, id, mes = Infinity) => movimientosHasta(cuentas, mes).filter((m) => m.tramo === id).reduce((s, m) => s + m.importe, 0);

export function montarFx() {
  const r = document.getElementById('root');
  r.insertAdjacentHTML('afterbegin', '<div class="fx-stars"></div><div class="fx-sweep"></div><div class="fx-crt"></div>');
}

export function pie(texto) {
  document.getElementById('pie').innerHTML = `<span>Herrumbre Unlimited</span><span>${esc(texto)}</span>`;
}

export const chip = (txt, clase) => `<span class="chip chip--${clase}">${esc(txt)}</span>`;
