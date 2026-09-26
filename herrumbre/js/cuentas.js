import { cargar, esc, cr, chip, montarFx, pie, estadoFase, fasesEnCurso, movimientosHasta, dispuestoTramo } from './common.js';

const [plan, cuentas] = await Promise.all([cargar('data/plan.json'), cargar('data/cuentas.json')]);
const mes = plan.mesActual;
const M = cuentas.moneda;
const $ = (id) => document.getElementById(id);

montarFx();
pie(plan.ejemplo ? 'Cuentas de ejemplo. Edita data/cuentas.json.' : 'Contabilidad del Fondo de Reconstrucción');

const mov = movimientosHasta(cuentas, mes).map((m, i) => ({ ...m, i })).sort((a, b) => a.mes - b.mes || a.i - b.i);
const princ = mov.filter((m) => m.fondo === 'reconstruccion');
const suma = (a) => a.reduce((s, m) => s + m.importe, 0);
const saldoDe = (id) => suma(mov.filter((m) => m.fondo === id));
const tri = Math.floor(mes / 3);
const delTri = princ.filter((m) => Math.floor(m.mes / 3) === tri);
const entradas = suma(delTri.filter((m) => m.importe > 0));
const salidas = -suma(delTri.filter((m) => m.importe < 0));
const disp = (t) => dispuestoTramo(cuentas, t.id, mes);
const deuda = cuentas.tramos.filter((t) => t.deuda).reduce((s, t) => s + disp(t), 0);
const activas = fasesEnCurso(plan);

$('chips-cab').innerHTML = chip('FASE ' + activas.map((f) => f.romano).join(' · '), 'acc') + chip(`MES ${mes} DEL PLAN`, 'ok');

const kpis = [
  ['SALDO DEL FONDO', cr(suma(princ)), 'Fondo de Reconstrucción', 'ok'],
  ['ENTRADAS · TRIMESTRE', cr(entradas), `trimestre ${tri + 1} del plan`, ''],
  ['SALIDAS · TRIMESTRE', cr(salidas), 'obras, gastos y suministros', ''],
  ['DEUDA DISPUESTA', cr(deuda), 'tramos garantizados y diferidos', 'warn']
];
$('kpis').innerHTML = kpis.map(([l, v, s, c], i) => `
  <div class="kpi hud rise" style="animation-delay:${0.2 + i * 0.12}s">
    <div class="mono-l">${l}</div>
    <div class="kpi__v flick" style="animation-delay:${0.8 + i * 0.1}s">${v} <small>${esc(M)}</small></div>
    <div class="kpi__s${c ? ' c-' + c : ''}">${esc(s)}</div>
  </div>`).join('');

// Gráfico por trimestre
const nT = plan.duracionMeses / 3;
const ent = Array(nT).fill(0);
const sal = Array(nT).fill(0);
princ.forEach((m) => {
  const q = Math.min(nT - 1, Math.floor(m.mes / 3));
  if (m.importe > 0) ent[q] += m.importe; else sal[q] -= m.importe;
});
const pasoRedondo = (v) => { const p = Math.pow(10, Math.floor(Math.log10(v))); return [1, 1.5, 2, 2.5, 3, 5, 10].find((k) => k * p >= v) * p; };
const max = pasoRedondo(Math.max(...ent, ...sal, 1) / 4) * 4;
const fm = (v) => (max >= 1e6 ? (v / 1e6).toLocaleString('es-ES', { maximumFractionDigits: 1 }) + ' M' : v >= 1e3 ? Math.round(v / 1e3) + ' k' : String(v));
const X0 = 64, W = 920, Y0 = 250, H = 210, gw = W / nT;
let g = '';
for (let k = 0; k <= 4; k++) {
  const y = Y0 - (H * k) / 4;
  g += `<line x1="${X0}" y1="${y}" x2="${X0 + W}" y2="${y}" class="${k ? 'gl' : 'gl0'}"/><text x="${X0 - 8}" y="${y + 4}" text-anchor="end" class="gt">${fm((max * k) / 4)}</text>`;
}
g += `<rect x="${X0 + tri * gw}" y="30" width="${gw}" height="${Y0 - 30}" class="gnow"/>`;
for (let q = 0; q < nT; q++) {
  const x = X0 + q * gw + gw * 0.14;
  const bw = gw * 0.32;
  const he = (ent[q] / max) * H, hs = (sal[q] / max) * H;
  if (he) g += `<rect class="bar" style="animation-delay:${0.9 + q * 0.05}s" x="${x}" y="${Y0 - he}" width="${bw}" height="${he}" fill="#6fbfa5"/>`;
  if (hs) g += `<rect class="bar" style="animation-delay:${0.95 + q * 0.05}s" x="${x + bw + 3}" y="${Y0 - hs}" width="${bw}" height="${hs}" fill="#d4622b"/>`;
  if (q % 4 === 0) g += `<text x="${X0 + q * gw + 2}" y="${Y0 + 20}" class="gt">AÑO ${q / 4 + 1}</text>`;
}
$('chart').innerHTML = `<svg viewBox="0 0 1000 280" role="img" aria-label="Entradas y salidas del Fondo de Reconstrucción por trimestre"><text x="0" y="14" class="gt">${max >= 1e6 ? 'MILLONES' : 'MILES'} DE ${esc(M.toUpperCase())}</text>${g}</svg>`;

// Presupuesto por fase
$('presupuesto').innerHTML = plan.fases.map((f) => {
  const b = cuentas.presupuestoFases.find((p) => p.fase === f.id)?.presupuesto ?? 0;
  const gastado = -suma(princ.filter((m) => m.fase === f.id && m.importe < 0));
  const e = estadoFase(f, mes);
  const p = b ? Math.min(100, (gastado / b) * 100) : 0;
  return `<div class="pres">
    <div class="pres__t"><span class="${e === 'pendiente' ? 'c-mute' : ''}">Fase ${f.romano} · ${esc(f.nombre)}</span><span class="mono-v">${cr(gastado)} / ${cr(b)}</span></div>
    <div class="prog prog--l"><i class="${e === 'en-curso' ? 'is-stripes' : ''} is-${e}" style="width:${p}%"></i></div>
  </div>`;
}).join('');

// Fondos y reparto
const otros = cuentas.fondos.filter((f) => !f.principal);
const partes = [{ n: 'Recuperador', p: cuentas.reparto.recuperador, c: 'c1' }, ...otros.map((f, i) => ({ n: f.nombre, p: f.porcentaje, c: 'c' + (i + 2) }))];
$('reparto').innerHTML = `
  <div class="reparto__b">${partes.map((x) => `<i class="${x.c}" style="width:${x.p}%">${x.p} %</i>`).join('')}</div>
  <div class="reparto__l">${partes.map((x) => `<span><i class="${x.c}"></i>${esc(x.n)}</span>`).join('')}</div>`;
$('fondos').innerHTML = cuentas.fondos.map((f, i) => `
  <div class="fondo hud rise${f.principal ? ' is-main' : ''}" style="animation-delay:${0.3 + i * 0.1}s">
    <div class="mono-l">${f.principal ? 'FONDO PRINCIPAL' : f.porcentaje + ' % DE LA RECUPERACIÓN'}</div>
    <h3>${esc(f.nombre)}</h3>
    <div class="fondo__v">${cr(saldoDe(f.id))} <small>${esc(M)}</small></div>
    <p>${esc(f.descripcion)}</p>
  </div>`).join('');

// Tramos
const inv = cuentas.inversores ?? [];
const EFECTIVO = ['prestamo', 'compra', 'capital'];
const rango = (a, b) => (a === b ? cr(a) : `${cr(a)} – ${cr(b)}`);
const sumaCampo = (xs, k) => xs.reduce((s, x) => s + x[k], 0);
$('tramos').innerHTML = cuentas.tramos.map((t) => {
  const xs = inv.filter((x) => x.tramo === t.id);
  const ef = xs.filter((x) => EFECTIVO.includes(x.tipo));
  const det = [xs.map((x) => x.nombre).join(', '), ef.length ? `comprometido ${rango(sumaCampo(ef, 'min'), sumaCampo(ef, 'max'))} ${M}` : ''].filter(Boolean).join(' · ');
  return `<div class="tramo">
    <b>${t.id}</b>
    <span>${esc(t.nombre)}${det ? `<em>${esc(det)}</em>` : ''}</span>
    ${chip(t.deuda ? 'DEUDA' : 'CAPITAL PROPIO', t.deuda ? 'warn' : 'ok')}
    <span class="mono-v">${cr(disp(t))} ${esc(M)}</span>
  </div>`;
}).join('');

// Inversores
const TIPO = {
  prestamo: ['PRÉSTAMO', 'warn'],
  compra: ['COMPRA ANTICIPADA', 'warn'],
  capital: ['CAPITAL', 'ok'],
  especie: ['EN ESPECIE', 'info'],
  intencion: ['CARTA DE INTENCIÓN', 'mute']
};
const importeInv = (x) => (x.tipo === 'intencion' ? '—' : `${x.tipo === 'especie' ? 'prima ' : ''}${rango(x.min, x.max)}`);
const efTot = inv.filter((x) => EFECTIVO.includes(x.tipo));
const dispTot = cuentas.tramos.reduce((s, t) => s + disp(t), 0);
$('inv-resumen').textContent = `Efectivo comprometido: ${rango(sumaCampo(efTot, 'min'), sumaCampo(efTot, 'max'))} ${M}. Dispuesto hasta el mes ${mes}: ${cr(dispTot)} ${M}.`;
$('inversores').innerHTML = inv.map((x) => `
  <div class="tramo">
    <b>${x.tramo ?? '—'}</b>
    <span>${esc(x.nombre)}<em>${esc(x.via)}</em></span>
    ${chip(...(TIPO[x.tipo] ?? [x.tipo, 'mute']))}
    <span class="mono-v">${esc(importeInv(x))}</span>
  </div>`).join('');

// Registro
const CAT = { Financiación: 'info', Aporte: 'info', Obra: 'warn', Gasto: 'acc', Suministros: 'acc', Ingreso: 'ok' };
const nf = Object.fromEntries(cuentas.fondos.map((f) => [f.id, f.nombre]));
const acum = {};
const filas = mov.map((m) => { acum[m.fondo] = (acum[m.fondo] ?? 0) + m.importe; return { ...m, saldo: acum[m.fondo] }; }).reverse();
$('registro').innerHTML = filas.length ? filas.map((m, i) => `
  <div class="trow rise" style="animation-delay:${0.4 + i * 0.07}s">
    <span class="mono-v c-mute">Mes ${m.mes}</span>
    <span>${esc(m.concepto)}<em>${esc(nf[m.fondo] ?? m.fondo)}</em></span>
    <span>${chip(m.categoria, CAT[m.categoria] ?? 'mute')}</span>
    <span class="mono-v ${m.importe > 0 ? 'c-ok' : ''} tr">${m.importe > 0 ? '+' : ''}${cr(m.importe)}</span>
    <span class="mono-v c-mute tr">${cr(m.saldo)}</span>
  </div>`).join('') : '<p class="vacio">Sin movimientos todavía.</p>';
