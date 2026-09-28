/*
 * VisiónLab v1.0.0 — motor de la aplicación
 * Pantallas: bienvenida → perfil → examen inicial → camino de unidades → lecciones → examen final → resultados
 * Extras: diccionario, logros, perfil, voz de Pixi, sonidos, confeti, modo docente.
 */
const VERSION = 'v1.0.0';
const CLAVE_GUARDADO = 'visionlab_progreso_v1';
const app = document.getElementById('app');
const nav = document.getElementById('nav');

/* =====================================================================
 * 1. ESTADO Y GUARDADO (localStorage, solo en este dispositivo)
 * ===================================================================== */
function estadoInicial() {
  return {
    nombre: '', edad: null, experiencia: null, ocupacion: null,
    codigo: 'VL-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
    xp: 0, lecciones: {}, medallas: [], pre: null, post: null,
    inicio: Date.now(), voz: false, sonido: true, docente: false, onboarding: false,
  };
}
let E = cargarEstado();

function cargarEstado() {
  try {
    const raw = localStorage.getItem(CLAVE_GUARDADO);
    if (raw) return { ...estadoInicial(), ...JSON.parse(raw) };
  } catch (e) { /* almacenamiento no disponible: se usa memoria */ }
  return estadoInicial();
}
function guardar() {
  try { localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(E)); } catch (e) { /* sin almacenamiento */ }
}

/* =====================================================================
 * 2. UTILIDADES
 * ===================================================================== */
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const md = (s = '') => String(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[\s(])_([^_]+?)_/g, '$1<i>$2</i>');
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const mezclar = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const todasLecciones = () => UNIDADES.flatMap((u) => u.lecciones.map((l) => ({ ...l, unidad: u })));
const leccionesHechas = () => Object.keys(E.lecciones).length;
const totalEstrellas = () => Object.values(E.lecciones).reduce((s, l) => s + (l.estrellas || 0), 0);

function limpiar() { app.innerHTML = ''; window.scrollTo(0, 0); detenerCamara(); window.speechSynthesis && speechSynthesis.cancel(); }
function mostrarNav(activo) {
  nav.hidden = !activo;
  nav.querySelectorAll('button').forEach((b) => b.classList.toggle('activo', b.dataset.ir === activo));
}

/* ---------- Sonidos (Web Audio, sin archivos) ---------- */
let audioCtx = null;
function sonar(tipo) {
  if (!E.sonido) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const notas = { bien: [660, 880], mal: [220, 180], fin: [523, 659, 784, 1047], clic: [440] }[tipo] || [440];
    notas.forEach((f, i) => {
      const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
      o.type = tipo === 'mal' ? 'sawtooth' : 'sine'; o.frequency.value = f;
      const t = audioCtx.currentTime + i * 0.11;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.connect(g).connect(audioCtx.destination); o.start(t); o.stop(t + 0.18);
    });
  } catch (e) { /* sin audio */ }
}

/* ---------- Voz de Pixi (lectura en voz alta) ---------- */
function hablar(texto, pixiEl) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const limpio = texto.replace(/<[^>]+>/g, '').replace(/[*_]/g, '').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '');
  const u = new SpeechSynthesisUtterance(limpio);
  u.lang = 'es-MX'; u.rate = 1; u.pitch = 1.25;
  const voz = speechSynthesis.getVoices().find((v) => v.lang && v.lang.startsWith('es'));
  if (voz) u.voice = voz;
  if (pixiEl) { Pixi.estado(pixiEl, 'hablando'); u.onend = () => Pixi.estado(pixiEl, 'normal'); }
  speechSynthesis.speak(u);
}

/* ---------- Confeti ---------- */
function confeti() {
  const capa = h('<div class="confeti" aria-hidden="true"></div>');
  const colores = ['#2F80ED', '#F2994A', '#27AE60', '#F2C94C', '#9B51E0', '#EB5757'];
  for (let i = 0; i < 70; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + '%';
    p.style.background = colores[i % colores.length];
    p.style.animationDelay = Math.random() * 0.5 + 's';
    p.style.animationDuration = 1.6 + Math.random() * 1.2 + 's';
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    capa.appendChild(p);
  }
  document.body.appendChild(capa);
  setTimeout(() => capa.remove(), 3200);
}

/* ---------- Medallas y XP ---------- */
function darMedalla(id) {
  if (E.medallas.includes(id)) return false;
  E.medallas.push(id); guardar();
  const m = MEDALLAS.find((x) => x.id === id);
  if (m) aviso(`${m.icono} ¡Nueva medalla! <b>${m.nombre}</b>`);
  return true;
}
function sumarXP(n) {
  E.xp += n; guardar();
  if (E.xp >= 200) darMedalla('xp200');
}
function aviso(html) {
  const t = h(`<div class="toast">${html}</div>`);
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('fuera'), 2600);
  setTimeout(() => t.remove(), 3100);
}

/* ---------- Burbuja de Pixi ---------- */
function burbujaPixi(texto, { tamano = 96, estado = 'normal', clase = '' } = {}) {
  const cont = h(`<div class="pixi-habla ${clase}"><div class="pixi-hueco"></div><div class="burbuja"><p>${md(texto)}</p><button class="btn-voz" aria-label="Escuchar a Pixi" title="Escuchar">🔊</button></div></div>`);
  const px = Pixi.crear(tamano, estado);
  cont.querySelector('.pixi-hueco').appendChild(px);
  cont.querySelector('.btn-voz').onclick = () => hablar(texto, px);
  if (E.voz) setTimeout(() => hablar(texto, px), 250);
  cont.pixi = px;
  return cont;
}

/* =====================================================================
 * 3. BIENVENIDA Y PERFIL
 * ===================================================================== */
function pantallaBienvenida() {
  limpiar(); mostrarNav(null);
  const s = h(`
    <section class="pantalla centro bienvenida">
      <div class="logo">Visión<span>Lab</span></div>
      <div class="hueco-pixi"></div>
      <h1>Aprende cómo <span class="resalta">ven</span> las computadoras</h1>
      <p class="sub">Lecciones cortas, juegos y un modelo de inteligencia artificial real. No necesitas saber nada de computación.</p>
      <button class="btn btn-primario btn-grande" id="empezar">¡Empezar!</button>
      ${E.onboarding ? '<button class="btn btn-texto" id="continuar">Ya tengo progreso · Continuar</button>' : ''}
      <p class="privacidad">🔒 Sin cuentas ni contraseñas. Tu progreso y tus fotos se quedan en este dispositivo.</p>
    </section>`);
  const px = Pixi.crear(170, 'saludo');
  s.querySelector('.hueco-pixi').appendChild(px);
  s.querySelector('#empezar').onclick = () => { sonar('clic'); if (E.onboarding) { if (confirm('¿Empezar de nuevo? Se borrará tu progreso en este dispositivo.')) { E = estadoInicial(); guardar(); pasoPerfil(0); } } else pasoPerfil(0); };
  const c = s.querySelector('#continuar'); if (c) c.onclick = () => pantallaCamino();
  app.appendChild(s);
}

function pasoPerfil(n) {
  limpiar(); mostrarNav(null);
  const pasos = [
    { pixi: '¡Hola! Soy **Pixi** 🤖. Mi ojo es una cámara y te voy a enseñar cómo ven las computadoras. ¿Cómo te llamas?', tipo: 'nombre' },
    { pixi: `¡Mucho gusto${E.nombre ? ', ' + esc(E.nombre) : ''}! ¿Cuántos años tienes?`, tipo: 'edad' },
    { pixi: '¿Cuánto sabes de inteligencia artificial?', tipo: 'experiencia' },
    { pixi: '¿A qué te dedicas?', tipo: 'ocupacion' },
  ];
  const p = pasos[n];
  const s = h(`<section class="pantalla perfil">
      <div class="barra-progreso"><i style="width:${(n + 1) / (pasos.length + 1) * 100}%"></i></div>
      <div class="zona-pixi"></div><div class="zona-opciones"></div>
      <div class="pie-accion"><button class="btn btn-primario" id="sig" disabled>Continuar</button></div></section>`);
  s.querySelector('.zona-pixi').appendChild(burbujaPixi(p.pixi, { estado: n === 0 ? 'saludo' : 'normal' }));
  const zona = s.querySelector('.zona-opciones');
  const sig = s.querySelector('#sig');
  let valor = null;
  if (p.tipo === 'nombre') {
    zona.innerHTML = '<input class="campo" id="nom" maxlength="30" placeholder="Tu nombre o apodo" autocomplete="off"><p class="nota">Solo se usa para saludarte. Puedes usar un apodo.</p>';
    const inp = zona.querySelector('#nom'); inp.value = E.nombre || '';
    const val = () => { valor = inp.value.trim(); sig.disabled = !valor; };
    inp.oninput = val; val();
    inp.onkeydown = (e) => { if (e.key === 'Enter' && valor) sig.click(); };
    setTimeout(() => inp.focus(), 100);
  } else {
    const lista = p.tipo === 'edad' ? PERFIL_EDADES.map((t, i) => ({ id: i, texto: t })) : p.tipo === 'experiencia' ? PERFIL_EXPERIENCIA : PERFIL_OCUPACION;
    zona.className = 'zona-opciones opciones';
    lista.forEach((op) => {
      const b = h(`<button class="opcion">${esc(op.texto)}</button>`);
      b.onclick = () => { zona.querySelectorAll('.opcion').forEach((x) => x.classList.remove('elegida')); b.classList.add('elegida'); valor = op.id; sig.disabled = false; sonar('clic'); };
      zona.appendChild(b);
    });
  }
  sig.onclick = () => {
    if (p.tipo === 'nombre') E.nombre = valor;
    if (p.tipo === 'edad') E.edad = valor;
    if (p.tipo === 'experiencia') E.experiencia = valor;
    if (p.tipo === 'ocupacion') E.ocupacion = valor;
    guardar();
    if (n < pasos.length - 1) pasoPerfil(n + 1); else antesDelExamen();
  };
  app.appendChild(s);
}

function antesDelExamen() {
  limpiar(); mostrarNav(null);
  E.onboarding = true; guardar(); darMedalla('bienvenida');
  const s = h(`<section class="pantalla centro">
      <div class="zona-pixi"></div>
      <div class="tarjeta-info"><b>📝 Examen inicial · 10 preguntas · ~5 min</b><br>No cuenta para ninguna calificación. Sirve para saber desde dónde empiezas y, al final, ver cuánto aprendiste. Si no sabes una respuesta, ¡está bien! Elige la que te parezca.</div>
      <button class="btn btn-primario btn-grande" id="ex">Hacer el examen inicial</button>
      <button class="btn btn-texto" id="saltar">Saltar por ahora</button></section>`);
  s.querySelector('.zona-pixi').appendChild(burbujaPixi(`¡Listo, ${esc(E.nombre)}! Antes de empezar, quiero saber qué tanto sabes. Es rapidito y sin presión 😊`, { estado: 'feliz' }));
  s.querySelector('#ex').onclick = () => pantallaExamen('pre');
  s.querySelector('#saltar').onclick = () => pantallaCamino();
  app.appendChild(s);
}

/* =====================================================================
 * 4. EXAMEN INICIAL / FINAL (sin retroalimentación durante el examen)
 * ===================================================================== */
function pantallaExamen(tipo) {
  const respuestas = [];
  const t0 = Date.now();
  const preguntar = (i) => {
    limpiar(); mostrarNav(null);
    const q = EXAMEN[i];
    const s = h(`<section class="pantalla leccion">
        <div class="cabecera-leccion"><button class="cerrar" aria-label="Salir">✕</button><div class="barra-progreso"><i style="width:${i / EXAMEN.length * 100}%"></i></div><span class="contador">${i + 1}/${EXAMEN.length}</span></div>
        <p class="etiqueta-ex">${tipo === 'pre' ? 'Examen inicial' : 'Examen final'}</p>
        <h2 class="pregunta">${esc(q.pregunta)}</h2>
        <div class="opciones"></div>
        <div class="pie-accion"><button class="btn btn-primario" id="sig" disabled>${i === EXAMEN.length - 1 ? 'Terminar' : 'Siguiente'}</button></div></section>`);
    let elegida = null;
    const cont = s.querySelector('.opciones');
    q.opciones.forEach((op, j) => {
      const b = h(`<button class="opcion"><span class="letra">${'ABCD'[j]}</span>${esc(op)}</button>`);
      b.onclick = () => { cont.querySelectorAll('.opcion').forEach((x) => x.classList.remove('elegida')); b.classList.add('elegida'); elegida = j; s.querySelector('#sig').disabled = false; sonar('clic'); };
      cont.appendChild(b);
    });
    s.querySelector('.cerrar').onclick = () => { if (confirm('¿Salir del examen? Tus respuestas no se guardarán.')) pantallaCamino(); };
    s.querySelector('#sig').onclick = () => {
      respuestas.push(elegida);
      if (i < EXAMEN.length - 1) preguntar(i + 1); else terminarExamen();
    };
    app.appendChild(s);
  };
  const terminarExamen = () => {
    const puntaje = respuestas.reduce((s, r, i) => s + (r === EXAMEN[i].correcta ? 1 : 0), 0);
    E[tipo] = { puntaje, respuestas, fecha: new Date().toISOString(), minutos: Math.round((Date.now() - t0) / 60000) };
    guardar();
    if (tipo === 'pre') {
      limpiar();
      const s = h(`<section class="pantalla centro"><div class="zona-pixi"></div>
        <div class="marcador-grande">${puntaje}<small>/10</small></div>
        <p class="sub">Este es tu punto de partida. Al final harás el mismo examen para ver cuánto aprendiste.</p>
        <button class="btn btn-primario btn-grande" id="go">¡Vamos a aprender!</button></section>`);
      s.querySelector('.zona-pixi').appendChild(burbujaPixi(puntaje >= 7 ? '¡Wow, ya sabes bastante! Igual vas a descubrir cosas nuevas 🤩' : '¡Gracias! No importa el resultado: para eso estoy aquí. Vamos paso a paso 💪', { estado: 'feliz' }));
      s.querySelector('#go').onclick = () => pantallaCamino();
      app.appendChild(s);
    } else {
      darMedalla('graduado');
      if (E.pre && E.post.puntaje > E.pre.puntaje) darMedalla('mejora');
      sonar('fin'); confeti();
      pantallaResultados();
    }
  };
  preguntar(0);
}

/* =====================================================================
 * 5. CAMINO DE UNIDADES
 * ===================================================================== */
function estaDesbloqueada(idx) {
  if (E.docente) return true;
  const lista = todasLecciones();
  return idx === 0 || !!E.lecciones[lista[idx - 1].id];
}

function pantallaCamino() {
  limpiar(); mostrarNav('camino');
  const lista = todasLecciones();
  const actual = lista.findIndex((l) => !E.lecciones[l.id]);
  const s = h(`<section class="pantalla camino">
      <header class="barra-estado"><span class="saludo">Hola, <b>${esc(E.nombre || 'explorador')}</b></span><span class="chip">⭐ ${totalEstrellas()}</span><span class="chip chip-xp">⚡ ${E.xp} XP</span></header>
      <div class="unidades"></div></section>`);
  const cont = s.querySelector('.unidades');
  let idx = 0;
  UNIDADES.forEach((u) => {
    const hechas = u.lecciones.filter((l) => E.lecciones[l.id]).length;
    const bloque = h(`<div class="unidad" style="--c:${u.color}">
        <div class="unidad-banner"><div><p class="unidad-num">UNIDAD ${u.num}</p><h2>${u.icono} ${esc(u.titulo)}</h2><p>${esc(u.subtitulo)}</p></div><span class="unidad-avance">${hechas}/${u.lecciones.length}</span></div>
        <div class="nodos"></div></div>`);
    const nodos = bloque.querySelector('.nodos');
    u.lecciones.forEach((l, j) => {
      const miIdx = idx++;
      const hecha = E.lecciones[l.id];
      const abierta = estaDesbloqueada(miIdx);
      const esActual = miIdx === actual;
      const desplaz = [0, 60, 0, -60][miIdx % 4];
      const n = h(`<div class="nodo-fila" style="transform:translateX(${desplaz}px)">
          <button class="nodo ${hecha ? 'hecho' : ''} ${abierta ? '' : 'bloqueado'} ${esActual ? 'actual' : ''}" aria-label="${esc(l.titulo)}">
            <span>${hecha ? '✓' : abierta ? u.icono : '🔒'}</span></button>
          <div class="nodo-texto"><b>${esc(l.titulo)}</b>${hecha ? `<span class="estrellas">${'★'.repeat(hecha.estrellas)}${'☆'.repeat(3 - hecha.estrellas)}</span>` : ''}</div></div>`);
      if (esActual) {
        const px = Pixi.crear(58, 'normal'); px.classList.add('pixi-guia');
        n.appendChild(px);
        n.querySelector('.nodo-texto').insertAdjacentHTML('beforeend', '<span class="empieza">¡Empieza aquí!</span>');
      }
      n.querySelector('.nodo').onclick = () => {
        if (!abierta) { aviso('🔒 Termina la lección anterior para desbloquear esta.'); return; }
        sonar('clic'); iniciarLeccion(l, u);
      };
      nodos.appendChild(n);
    });
    cont.appendChild(bloque);
  });
  // Examen final y resultados
  const todas = leccionesHechas() === lista.length;
  const finalAbierto = todas || E.docente;
  const fin = h(`<div class="unidad final" style="--c:#1F4E79">
      <div class="unidad-banner"><div><p class="unidad-num">META</p><h2>🎓 Examen final</h2><p>Descubre cuánto aprendiste</p></div></div>
      <div class="nodos"><div class="nodo-fila"><button class="nodo nodo-trofeo ${finalAbierto ? (E.post ? 'hecho' : 'actual') : 'bloqueado'}"><span>${E.post ? '📊' : finalAbierto ? '🏆' : '🔒'}</span></button>
      <div class="nodo-texto"><b>${E.post ? 'Ver mis resultados' : 'Examen final'}</b>${finalAbierto ? '' : '<span class="nota">Se desbloquea al terminar todas las lecciones</span>'}</div></div></div></div>`);
  fin.querySelector('.nodo').onclick = () => {
    if (!finalAbierto) { aviso('🔒 Completa todas las lecciones primero.'); return; }
    if (E.post) pantallaResultados();
    else introExamenFinal();
  };
  cont.appendChild(fin);
  app.appendChild(s);
  const act = s.querySelector('.nodo.actual');
  if (act) setTimeout(() => act.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
}

function introExamenFinal() {
  limpiar(); mostrarNav(null);
  const s = h(`<section class="pantalla centro"><div class="zona-pixi"></div>
      <div class="tarjeta-info"><b>🎓 Examen final · 10 preguntas</b><br>Son las mismas preguntas del inicio. Así podremos comparar cuánto aprendiste.</div>
      <button class="btn btn-primario btn-grande" id="ex">Empezar examen final</button>
      <button class="btn btn-texto" id="volver">Volver al camino</button></section>`);
  s.querySelector('.zona-pixi').appendChild(burbujaPixi('¡Llegaste a la meta! Estoy muy orgulloso de ti. Demuestra todo lo que aprendiste 🚀', { estado: 'feliz' }));
  s.querySelector('#ex').onclick = () => pantallaExamen('post');
  s.querySelector('#volver').onclick = () => pantallaCamino();
  app.appendChild(s);
}

/* =====================================================================
 * 6. MOTOR DE LECCIONES
 * ===================================================================== */
function iniciarLeccion(leccion, unidad) {
  const ses = { leccion, unidad, paso: 0, errores: 0, aciertos: 0, xp: 0 };
  mostrarPaso(ses);
}

function mostrarPaso(ses) {
  limpiar(); mostrarNav(null);
  const { leccion, unidad } = ses;
  const paso = leccion.pasos[ses.paso];
  const s = h(`<section class="pantalla leccion" style="--c:${unidad.color}">
      <div class="cabecera-leccion"><button class="cerrar" aria-label="Salir de la lección">✕</button>
      <div class="barra-progreso"><i style="width:${ses.paso / leccion.pasos.length * 100}%"></i></div></div>
      <div class="contenido"></div>
      <div class="pie-accion"><button class="btn btn-primario" id="accion" disabled>Comprobar</button></div></section>`);
  s.querySelector('.cerrar').onclick = () => { if (confirm('¿Salir de la lección? Perderás el avance de esta lección.')) pantallaCamino(); };
  const contenido = s.querySelector('.contenido');
  const boton = s.querySelector('#accion');
  app.appendChild(s);

  const siguiente = () => {
    ses.paso++;
    if (ses.paso < leccion.pasos.length) mostrarPaso(ses); else finLeccion(ses);
  };
  const ctx = { ses, contenido, boton, siguiente, pantalla: s };
  const render = { explica: pasoExplica, opcion: pasoOpcion, vf: pasoVF, ordena: pasoOrdena, empareja: pasoEmpareja, pixeles: pasoPixeles, filtro: pasoFiltro, prueba: pasoPrueba, entrena: pasoEntrena }[paso.tipo];
  render(paso, ctx);
}

/* ---------- Hoja de retroalimentación (verde / roja) ---------- */
function retro(ctx, correcto, explicacion, clave) {
  const { pantalla, boton, ses } = ctx;
  if (correcto) { ses.aciertos++; ses.xp += 10; sonar('bien'); } else { ses.errores++; sonar('mal'); }
  const px = pantalla.querySelector('.pixi');
  if (px) Pixi.estado(px, correcto ? 'feliz' : 'triste', 1800);
  const frasesBien = ['¡Muy bien!', '¡Excelente!', '¡Correcto!', '¡Así se hace!', '¡Lo tienes!'];
  const frasesMal = ['Casi, pero no', '¡Ups! No pasa nada', 'No es esa, pero aprendemos', 'Esa no era'];
  const titulo = correcto ? frasesBien[Math.floor(Math.random() * frasesBien.length)] : frasesMal[Math.floor(Math.random() * frasesMal.length)];
  const hoja = h(`<div class="retro ${correcto ? 'bien' : 'mal'}">
      <div class="retro-cab"><span class="retro-icono">${correcto ? '✔' : '✖'}</span><b>${titulo}</b></div>
      <p>${md(explicacion || '')}</p>
      ${clave ? `<div class="clave clave-mini"><span>📌 Palabra clave</span><b>${esc(clave.termino)}</b><p>${esc(clave.def)}</p></div>` : ''}</div>`);
  pantalla.querySelector('.pie-accion').prepend(hoja);
  pantalla.querySelector('.pie-accion').classList.add(correcto ? 'bien' : 'mal');
  boton.textContent = 'Continuar'; boton.disabled = false;
  boton.onclick = () => ctx.siguiente();
}

/* ---------- Tarjeta de palabra clave ---------- */
function tarjetaClave(clave) {
  return `<div class="clave"><span>📌 Palabra clave</span><b>${esc(clave.termino)}</b><p>${esc(clave.def)}</p></div>`;
}

/* ---------- EXPLICA ---------- */
function pasoExplica(p, ctx) {
  ctx.contenido.appendChild(burbujaPixi(p.pixi, { tamano: 88 }));
  if (p.texto) ctx.contenido.insertAdjacentHTML('beforeend', `<p class="texto">${md(p.texto)}</p>`);
  if (p.visual) ctx.contenido.insertAdjacentHTML('beforeend', `<div class="visual">${p.visual}</div>`);
  if (p.clave) ctx.contenido.insertAdjacentHTML('beforeend', tarjetaClave(p.clave));
  ctx.boton.textContent = 'Continuar'; ctx.boton.disabled = false;
  ctx.boton.onclick = () => { sonar('clic'); ctx.siguiente(); };
}

/* ---------- OPCIÓN MÚLTIPLE ---------- */
function pasoOpcion(p, ctx) {
  ctx.contenido.innerHTML = `<p class="instruccion">Elige la respuesta correcta</p><h2 class="pregunta">${md(esc(p.pregunta))}</h2><div class="opciones"></div>`;
  const cont = ctx.contenido.querySelector('.opciones');
  let elegida = null;
  const orden = mezclar(p.opciones.map((t, i) => ({ t, i })));
  orden.forEach(({ t, i }) => {
    const b = h(`<button class="opcion">${esc(t)}</button>`);
    b.onclick = () => { if (ctx.boton.textContent === 'Continuar') return; cont.querySelectorAll('.opcion').forEach((x) => x.classList.remove('elegida')); b.classList.add('elegida'); elegida = i; ctx.boton.disabled = false; sonar('clic'); };
    b.dataset.i = i;
    cont.appendChild(b);
  });
  ctx.boton.onclick = () => {
    const ok = elegida === p.correcta;
    cont.querySelectorAll('.opcion').forEach((b) => {
      b.disabled = true;
      if (+b.dataset.i === p.correcta) b.classList.add('correcta');
      else if (+b.dataset.i === elegida) b.classList.add('incorrecta');
    });
    retro(ctx, ok, p.explica, p.clave);
  };
}

/* ---------- VERDADERO / FALSO ---------- */
function pasoVF(p, ctx) {
  ctx.contenido.innerHTML = `<p class="instruccion">¿Verdadero o falso?</p><h2 class="pregunta afirmacion">“${md(esc(p.afirmacion))}”</h2>
    <div class="vf"><button class="opcion vf-btn" data-v="1">✅<span>Verdadero</span></button><button class="opcion vf-btn" data-v="0">❌<span>Falso</span></button></div>`;
  let elegida = null;
  const btns = ctx.contenido.querySelectorAll('.vf-btn');
  btns.forEach((b) => b.onclick = () => { if (ctx.boton.textContent === 'Continuar') return; btns.forEach((x) => x.classList.remove('elegida')); b.classList.add('elegida'); elegida = b.dataset.v === '1'; ctx.boton.disabled = false; sonar('clic'); });
  ctx.boton.onclick = () => {
    const ok = elegida === p.correcta;
    btns.forEach((b) => { b.disabled = true; const v = b.dataset.v === '1'; if (v === p.correcta) b.classList.add('correcta'); else if (v === elegida) b.classList.add('incorrecta'); });
    retro(ctx, ok, p.explica);
  };
}

/* ---------- ORDENAR ---------- */
function pasoOrdena(p, ctx) {
  ctx.contenido.innerHTML = `<p class="instruccion">Toca los pasos en el orden correcto</p><h2 class="pregunta">${esc(p.pregunta)}</h2>
    <ol class="orden-respuesta"></ol><div class="orden-banco"></div>`;
  const resp = ctx.contenido.querySelector('.orden-respuesta');
  const banco = ctx.contenido.querySelector('.orden-banco');
  const elegidos = [];
  let revuelto = mezclar(p.items);
  if (revuelto.every((x, i) => x === p.items[i])) revuelto = [...p.items].reverse();
  const pintar = () => {
    resp.innerHTML = ''; banco.innerHTML = '';
    elegidos.forEach((t, i) => {
      const li = h(`<li class="ficha en-respuesta">${esc(t)}</li>`);
      li.onclick = () => { if (ctx.boton.textContent === 'Continuar') return; elegidos.splice(i, 1); sonar('clic'); pintar(); };
      resp.appendChild(li);
    });
    for (let i = elegidos.length; i < p.items.length; i++) resp.appendChild(h('<li class="ficha vacia"> </li>'));
    revuelto.filter((t) => !elegidos.includes(t)).forEach((t) => {
      const b = h(`<button class="ficha">${esc(t)}</button>`);
      b.onclick = () => { elegidos.push(t); sonar('clic'); pintar(); };
      banco.appendChild(b);
    });
    ctx.boton.disabled = elegidos.length !== p.items.length;
  };
  pintar();
  ctx.boton.onclick = () => {
    const ok = elegidos.every((t, i) => t === p.items[i]);
    resp.querySelectorAll('.ficha').forEach((li, i) => li.classList.add(elegidos[i] === p.items[i] ? 'correcta' : 'incorrecta'));
    const orden = ok ? '' : `<br><b>Orden correcto:</b> ${p.items.map((t, i) => `${i + 1}. ${esc(t)}`).join(' → ')}`;
    retro(ctx, ok, (p.explica || '') + orden);
  };
}

/* ---------- EMPAREJAR ---------- */
function pasoEmpareja(p, ctx) {
  ctx.contenido.innerHTML = `<p class="instruccion">Toca un elemento de cada columna para unirlos</p><h2 class="pregunta">${esc(p.pregunta)}</h2>
    <div class="parejas"><div class="col izq"></div><div class="col der"></div></div>`;
  const izq = ctx.contenido.querySelector('.izq'); const der = ctx.contenido.querySelector('.der');
  let selI = null, selD = null, hechos = 0, fallos = 0;
  const probar = () => {
    if (selI === null || selD === null) return;
    const bI = izq.querySelector(`[data-i="${selI}"]`); const bD = der.querySelector(`[data-i="${selD}"]`);
    if (selI === selD) {
      [bI, bD].forEach((b) => { b.classList.remove('elegida'); b.classList.add('correcta'); b.disabled = true; });
      hechos++; sonar('bien');
      if (hechos === p.pares.length) {
        const ok = fallos === 0;
        if (!ok) { ctx.ses.errores++; } else { ctx.ses.aciertos++; ctx.ses.xp += 10; }
        const px = ctx.pantalla.querySelector('.pixi'); if (px) Pixi.estado(px, 'feliz', 1500);
        const hoja = h(`<div class="retro bien"><div class="retro-cab"><span class="retro-icono">✔</span><b>${ok ? '¡Perfecto!' : '¡Completado!'}</b></div><p>${md(p.explica || '')}${ok ? '' : ` (tuviste ${fallos} intento${fallos > 1 ? 's' : ''} fallido${fallos > 1 ? 's' : ''})`}</p></div>`);
        ctx.pantalla.querySelector('.pie-accion').prepend(hoja); ctx.pantalla.querySelector('.pie-accion').classList.add('bien');
        ctx.boton.textContent = 'Continuar'; ctx.boton.disabled = false; ctx.boton.onclick = () => ctx.siguiente();
      }
    } else {
      fallos++; sonar('mal');
      [bI, bD].forEach((b) => { b.classList.add('incorrecta'); setTimeout(() => b.classList.remove('incorrecta', 'elegida'), 600); });
    }
    selI = selD = null;
  };
  p.pares.forEach(([a], i) => { const b = h(`<button class="opcion par" data-i="${i}">${esc(a)}</button>`); b.onclick = () => { izq.querySelectorAll('.par').forEach((x) => x.classList.remove('elegida')); b.classList.add('elegida'); selI = i; probar(); }; izq.appendChild(b); });
  mezclar(p.pares.map((x, i) => ({ t: x[1], i }))).forEach(({ t, i }) => { const b = h(`<button class="opcion par" data-i="${i}">${esc(t)}</button>`); b.onclick = () => { der.querySelectorAll('.par').forEach((x) => x.classList.remove('elegida')); b.classList.add('elegida'); selD = i; probar(); }; der.appendChild(b); });
  ctx.boton.textContent = 'Une todas las parejas'; ctx.boton.disabled = true;
}

/* ---------- ACTIVIDAD: PÍXELES ---------- */
function pasoPixeles(p, ctx) {
  const dibujo = [
    '0011111100', '0100000010', '1001001001', '1000000001', '1000000001',
    '1010000101', '1001111001', '0100000010', '0011111100', '0000000000'];
  const valor = (c, y, x) => (c === '1' ? 30 + ((x + y) % 3) * 12 : 235 - ((x * 7 + y * 3) % 4) * 6);
  ctx.contenido.innerHTML = `<p class="instruccion">Actividad</p><h2 class="pregunta">Así ve una imagen la computadora</h2>
    <div class="pixeles"></div>
    <div class="alternar"><button class="btn btn-sec" id="ver">👁️ Ver como computadora</button></div>
    <p class="nota centro-txt">Cada cuadrito es un píxel. El número indica qué tan claro es: <b>0 = negro</b>, <b>255 = blanco</b>.</p>`;
  const g = ctx.contenido.querySelector('.pixeles');
  dibujo.forEach((fila, y) => [...fila].forEach((c, x) => {
    const v = valor(c, y, x);
    g.insertAdjacentHTML('beforeend', `<div class="px" style="--v:${v};background:rgb(${v},${v},${v})"><span>${v}</span></div>`);
  }));
  const ver = ctx.contenido.querySelector('#ver');
  let visto = false;
  ver.onclick = () => {
    g.classList.toggle('numeros');
    const on = g.classList.contains('numeros');
    ver.textContent = on ? '🙂 Ver como persona' : '👁️ Ver como computadora';
    sonar('clic');
    if (!visto) { visto = true; ctx.ses.xp += 10; ctx.boton.disabled = false; }
  };
  ctx.boton.textContent = 'Continuar'; ctx.boton.onclick = () => ctx.siguiente();
}

/* ---------- ACTIVIDAD: FILTRO DE BORDES ---------- */
function dibujarEjemplo(canvas) {
  canvas.width = 240; canvas.height = 180;
  const c = canvas.getContext('2d');
  c.fillStyle = '#9fd3f5'; c.fillRect(0, 0, 240, 180);
  c.fillStyle = '#7bc47f'; c.fillRect(0, 140, 240, 40);
  c.fillStyle = '#f5d76e'; c.beginPath(); c.arc(200, 35, 20, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#e9a15b'; c.fillRect(50, 80, 90, 65);
  c.fillStyle = '#b5523b'; c.beginPath(); c.moveTo(40, 82); c.lineTo(95, 35); c.lineTo(150, 82); c.fill();
  c.fillStyle = '#6b3e26'; c.fillRect(85, 105, 22, 40);
  c.fillStyle = '#ffffff'; c.fillRect(58, 92, 18, 16); c.fillRect(115, 92, 18, 16);
  c.fillStyle = '#3d7a3f'; c.beginPath(); c.arc(185, 110, 22, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#6b3e26'; c.fillRect(181, 128, 8, 16);
}
function pasoFiltro(p, ctx) {
  ctx.contenido.innerHTML = `<p class="instruccion">Actividad</p><h2 class="pregunta">Mira lo que “ve” la primera capa de una CNN</h2>
    <div class="filtro-cont"><figure><canvas id="orig"></canvas><figcaption>Imagen original</figcaption></figure>
    <figure><canvas id="bord"></canvas><figcaption>Después del filtro de bordes</figcaption></figure></div>
    <div class="acciones-fila"><button class="btn btn-primario" id="aplicar">🔎 Aplicar filtro</button>
    <label class="btn btn-sec">📁 Usar mi foto<input type="file" accept="image/*" hidden id="foto"></label></div>
    <p class="nota centro-txt">El filtro (o <i>kernel</i>) recorre la imagen cuadrito por cuadrito y resalta donde el color cambia de golpe: <b>los bordes</b>.</p>`;
  const orig = ctx.contenido.querySelector('#orig'); const bord = ctx.contenido.querySelector('#bord');
  dibujarEjemplo(orig);
  bord.width = orig.width; bord.height = orig.height;
  const cb = bord.getContext('2d'); cb.fillStyle = '#111'; cb.fillRect(0, 0, bord.width, bord.height);
  let hecho = false;
  const aplicar = () => {
    const { ctx: c2, out, w, h: alto } = IA.bordes(orig, bord);
    c2.fillStyle = '#111'; c2.fillRect(0, 0, w, alto);
    let fila = 0;
    const paso = () => {   // animación: el filtro "barre" la imagen
      fila = Math.min(alto, fila + 6);
      c2.putImageData(out, 0, 0, 0, 0, w, fila);
      c2.fillStyle = 'rgba(242,153,74,.9)'; c2.fillRect(0, fila, w, 2);
      if (fila < alto) requestAnimationFrame(paso); else c2.putImageData(out, 0, 0);
    };
    paso(); sonar('bien');
    if (!hecho) { hecho = true; ctx.ses.xp += 15; ctx.boton.disabled = false; }
  };
  ctx.contenido.querySelector('#aplicar').onclick = aplicar;
  ctx.contenido.querySelector('#foto').onchange = (e) => {
    const f = e.target.files[0]; if (!f || !f.type.startsWith('image/')) return;
    const img = new Image();
    img.onload = () => {
      const esc2 = 240 / Math.max(img.width, img.height);
      orig.width = Math.round(img.width * esc2); orig.height = Math.round(img.height * esc2);
      orig.getContext('2d').drawImage(img, 0, 0, orig.width, orig.height);
      URL.revokeObjectURL(img.src); aplicar();
    };
    img.src = URL.createObjectURL(f);
  };
  ctx.boton.textContent = 'Continuar'; ctx.boton.onclick = () => ctx.siguiente();
}

/* ---------- Cámara compartida ---------- */
let flujo = null;
async function abrirCamara(video, frontal = false) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('sin cámara');
  detenerCamara();
  flujo = await navigator.mediaDevices.getUserMedia({ video: { facingMode: frontal ? 'user' : 'environment', width: { ideal: 640 } }, audio: false });
  video.srcObject = flujo; await video.play();
}
function detenerCamara() { if (flujo) flujo.getTracks().forEach((t) => t.stop()); flujo = null; }

function estadoModelo(el) {
  el.className = 'estado cargando'; el.innerHTML = '<span class="spinner"></span> Pixi está despertando su cerebro (cargando MobileNet)…';
  return IA.cargar().then(() => { el.className = 'estado listo'; el.textContent = '✅ Modelo MobileNet listo'; })
    .catch(() => { el.className = 'estado error'; el.textContent = '⚠️ No se pudo cargar el modelo. Revisa tu conexión a internet y recarga la página.'; throw new Error('modelo'); });
}

/* ---------- ACTIVIDAD: PRUÉBALO (modelo real) ---------- */
function pasoPrueba(p, ctx) {
  ctx.contenido.innerHTML = `<p class="instruccion">Actividad con IA real</p><h2 class="pregunta">Muéstrale algo a Pixi</h2>
    <div class="estado" id="est"></div>
    <div class="acciones-fila"><label class="btn btn-sec">📁 Subir foto<input type="file" accept="image/*" hidden id="foto"></label>
    <button class="btn btn-sec" id="cam">📷 Usar cámara</button><button class="btn btn-primario" id="tomar" hidden>Tomar foto</button></div>
    <video id="vid" playsinline muted hidden></video><img id="img" alt="Imagen para analizar" hidden>
    <div id="res"></div>`;
  const $ = (id) => ctx.contenido.querySelector('#' + id);
  const est = $('est'), img = $('img'), vid = $('vid'), res = $('res');
  let usado = false;
  estadoModelo(est).catch(() => { ctx.boton.disabled = false; ctx.boton.textContent = 'Continuar sin probar'; });
  ctx.boton.textContent = 'Continuar'; ctx.boton.onclick = () => ctx.siguiente();

  const analizar = async () => {
    res.innerHTML = '<div class="pixi-pensando"></div>';
    const pp = Pixi.crear(70, 'pensando'); res.firstChild.appendChild(pp);
    res.firstChild.insertAdjacentHTML('beforeend', '<p>Mmm… déjame ver 🤔</p>');
    try {
      const { ms, resultados } = await IA.clasificar(img, 3);
      const mejor = resultados[0];
      const nombre = (r) => r.espanol ? `${esc(r.espanol)} <small>(${esc(r.ingles)})</small>` : esc(r.ingles);
      res.innerHTML = `<div class="resultado-ia">
          <div class="zona-pixi-res"></div>
          ${resultados.map((r, i) => `<div class="pred ${i === 0 ? 'top' : ''}"><div class="pred-fila"><span>${nombre(r)}</span><b>${(r.prob * 100).toFixed(1)} %</b></div><div class="barra-prob"><i style="width:${r.prob * 100}%"></i></div></div>`).join('')}
          <p class="nota">Tiempo de análisis: ${ms} ms · Las etiquetas vienen de ImageNet (en inglés).</p>
          <p class="pregunta-acerto">¿Acertó Pixi?</p>
          <div class="acciones-fila"><button class="btn btn-sec" data-a="si">👍 Sí</button><button class="btn btn-sec" data-a="no">👎 No</button></div></div>`;
      const frase = mejor.prob >= 0.5 ? `¡Creo que es ${mejor.espanol || mejor.ingles}! Estoy bastante seguro.` : `Mmm… no estoy muy seguro. Quizá es ${mejor.espanol || mejor.ingles}, pero mi confianza es baja.`;
      const b = burbujaPixi(frase, { tamano: 70, estado: mejor.prob >= 0.5 ? 'feliz' : 'pensando' });
      res.querySelector('.zona-pixi-res').appendChild(b);
      res.querySelectorAll('[data-a]').forEach((x) => x.onclick = () => {
        const si = x.dataset.a === 'si';
        Pixi.estado(b.pixi, si ? 'feliz' : 'triste', 1800);
        b.querySelector('p').innerHTML = si ? '¡Yei! 🎉 Reconocí los patrones de tu imagen.' : '¡Ups! Me equivoqué. Quizá no está entre mis 1,000 categorías o la foto no se parece a las que vi al entrenar. ¡Así aprendes mis límites!';
        sonar(si ? 'bien' : 'clic');
      });
      if (!usado) { usado = true; ctx.ses.xp += 20; darMedalla('fotografo'); ctx.boton.disabled = false; }
    } catch (e) {
      res.innerHTML = '<p class="error">No pude analizar la imagen. Revisa tu conexión y vuelve a intentarlo.</p>';
      ctx.boton.disabled = false;
    }
  };
  const mostrarImg = (src) => { img.onload = analizar; img.src = src; img.hidden = false; };
  $('foto').onchange = (e) => {
    const f = e.target.files[0];
    if (!f || !f.type.startsWith('image/')) { res.innerHTML = '<p class="error">Ese archivo no es una imagen. Usa JPG o PNG.</p>'; return; }
    detenerCamara(); vid.hidden = true; $('tomar').hidden = true; $('cam').hidden = false;
    mostrarImg(URL.createObjectURL(f));
  };
  $('cam').onclick = async () => {
    try { await abrirCamara(vid); vid.hidden = false; img.hidden = true; $('tomar').hidden = false; $('cam').hidden = true; }
    catch (e) { res.innerHTML = '<p class="error">No pude usar la cámara. Revisa el permiso del navegador o sube una foto.</p>'; }
  };
  $('tomar').onclick = () => {
    const c = document.createElement('canvas'); c.width = vid.videoWidth; c.height = vid.videoHeight;
    c.getContext('2d').drawImage(vid, 0, 0);
    detenerCamara(); vid.hidden = true; $('tomar').hidden = true; $('cam').hidden = false;
    mostrarImg(c.toDataURL('image/jpeg', 0.9));
  };
}

/* ---------- ACTIVIDAD: ENTRÉNALO (aprendizaje por transferencia) ---------- */
function pasoEntrena(p, ctx) {
  IA.reiniciar();
  ctx.contenido.innerHTML = `<p class="instruccion">Actividad con IA real</p><h2 class="pregunta">Entrena tu propio modelo</h2>
    <div class="estado" id="est"></div>
    <div class="entrena-cam"><video id="vid" playsinline muted></video><div class="sin-cam" id="sincam" hidden>📷 Cámara no disponible. Puedes subir fotos para cada clase.</div></div>
    <div class="clases">
      ${[0, 1].map((c) => `<div class="clase c${c}"><input class="nombre-clase" value="${c === 0 ? '✋ Mano abierta' : '✊ Puño'}" maxlength="24" aria-label="Nombre de la clase ${c + 1}">
        <button class="btn btn-primario captura" data-c="${c}">Mantén para capturar</button>
        <label class="btn btn-texto subir">o sube fotos<input type="file" accept="image/*" multiple hidden data-c="${c}"></label>
        <span class="cuenta" id="n${c}">0 ejemplos</span></div>`).join('')}
    </div>
    <div class="paso-entrena" id="fase"><p>1️⃣ Toma al menos <b>8 ejemplos</b> de cada clase (mueve un poco la mano entre fotos).</p></div>
    <button class="btn btn-grande btn-primario" id="probar" disabled>2️⃣ ¡Probar mi modelo!</button>
    <div id="vivo"></div>`;
  const $ = (id) => ctx.contenido.querySelector('#' + id);
  const vid = $('vid');
  let listoModelo = false, bucle = null, probo = false;
  ctx.boton.textContent = 'Continuar'; ctx.boton.onclick = () => { cancelAnimationFrame(bucle); ctx.siguiente(); };
  estadoModelo($('est')).then(() => { listoModelo = true; }).catch(() => { ctx.boton.disabled = false; ctx.boton.textContent = 'Continuar sin entrenar'; });
  abrirCamara(vid, true).catch(() => { vid.hidden = true; $('sincam').hidden = false; });

  const actualizar = () => {
    const n = IA.contar();
    n.forEach((k, c) => { $('n' + c).textContent = `${k} ejemplo${k === 1 ? '' : 's'}`; });
    $('probar').disabled = !(n[0] >= 8 && n[1] >= 8);
    if (!$('probar').disabled) $('fase').innerHTML = '<p>✅ ¡Listo! Ya tienes suficientes ejemplos. Ahora pruébalo.</p>';
  };
  const capturar = async (c) => {
    if (!listoModelo || !flujo) return;
    await IA.agregarEjemplo(vid, c); actualizar();
  };
  ctx.contenido.querySelectorAll('.captura').forEach((b) => {
    let intervalo = null;
    const inicio = (e) => { e.preventDefault(); if (!listoModelo) { aviso('Espera a que cargue el modelo…'); return; } if (!flujo) { aviso('Usa “o sube fotos”: no hay cámara disponible.'); return; } b.classList.add('grabando'); capturar(+b.dataset.c); intervalo = setInterval(() => capturar(+b.dataset.c), 180); };
    const fin = () => { clearInterval(intervalo); b.classList.remove('grabando'); };
    b.addEventListener('pointerdown', inicio); b.addEventListener('pointerup', fin); b.addEventListener('pointerleave', fin); b.addEventListener('pointercancel', fin);
  });
  ctx.contenido.querySelectorAll('input[type=file]').forEach((inp) => inp.onchange = async (e) => {
    if (!listoModelo) { aviso('Espera a que cargue el modelo…'); return; }
    for (const f of e.target.files) {
      if (!f.type.startsWith('image/')) continue;
      const im = new Image(); im.src = URL.createObjectURL(f); await im.decode();
      await IA.agregarEjemplo(im, +inp.dataset.c); URL.revokeObjectURL(im.src);
    }
    actualizar();
  });
  $('probar').onclick = async () => {
    darMedalla('entrenador'); sonar('fin');
    const nombres = [...ctx.contenido.querySelectorAll('.nombre-clase')].map((i) => esc(i.value || 'Clase'));
    $('vivo').innerHTML = `<div class="resultado-ia"><div class="zona-pixi-res"></div>
      ${[0, 1].map((c) => `<div class="pred c${c}"><div class="pred-fila"><span>${nombres[c]}</span><b id="p${c}">0 %</b></div><div class="barra-prob"><i id="b${c}"></i></div></div>`).join('')}
      <p class="nota">Cambia entre una clase y otra frente a la cámara y observa cómo cambian los porcentajes.</p></div>`;
    const b = burbujaPixi('¡Ya aprendí! Muéstrame una de tus clases 👀', { tamano: 70, estado: 'feliz' });
    $('vivo').querySelector('.zona-pixi-res').appendChild(b);
    if (!probo) { probo = true; ctx.ses.xp += 25; ctx.boton.disabled = false; }
    const predecir = async () => {
      if (!flujo) return;
      const pr = await IA.predecirPropio(vid);
      if (pr) pr.forEach((v, c) => { const el = $('p' + c); if (el) { el.textContent = Math.round(v * 100) + ' %'; $('b' + c).style.width = v * 100 + '%'; } });
      bucle = requestAnimationFrame(() => setTimeout(predecir, 120));
    };
    if (flujo) predecir();
    else $('vivo').insertAdjacentHTML('beforeend', '<p class="nota">Sin cámara: sube una foto de prueba para ver qué clase elige tu modelo.</p><label class="btn btn-sec">📁 Probar con una foto<input type="file" accept="image/*" hidden id="fprueba"></label>');
    const fp = $('fprueba');
    if (fp) fp.onchange = async (e) => { const f = e.target.files[0]; if (!f) return; const im = new Image(); im.src = URL.createObjectURL(f); await im.decode(); const pr = await IA.predecirPropio(im); pr.forEach((v, c) => { $('p' + c).textContent = Math.round(v * 100) + ' %'; $('b' + c).style.width = v * 100 + '%'; }); };
  };
}

/* ---------- FIN DE LECCIÓN ---------- */
function finLeccion(ses) {
  limpiar(); mostrarNav(null);
  const estrellas = ses.errores === 0 ? 3 : ses.errores <= 2 ? 2 : 1;
  const bono = 20;
  const xp = ses.xp + bono;
  const previa = E.lecciones[ses.leccion.id];
  E.lecciones[ses.leccion.id] = { estrellas: Math.max(estrellas, previa ? previa.estrellas : 0), fecha: new Date().toISOString() };
  sumarXP(xp);
  darMedalla('primera');
  if (ses.errores === 0) darMedalla('perfecta');
  const u = ses.unidad;
  if (u.lecciones.every((l) => E.lecciones[l.id]) && MEDALLAS.some((m) => m.id === u.id)) darMedalla(u.id);
  guardar();
  sonar('fin'); confeti();
  const s = h(`<section class="pantalla centro fin-leccion" style="--c:${u.color}">
      <div class="zona-pixi"></div>
      <h1>¡Lección completada!</h1>
      <div class="estrellas-grandes">${[1, 2, 3].map((i) => `<span class="${i <= estrellas ? 'on' : ''}" style="animation-delay:${i * 0.2}s">★</span>`).join('')}</div>
      <div class="stats"><div><b>+${xp}</b><span>XP</span></div><div><b>${ses.aciertos}</b><span>aciertos</span></div><div><b>${ses.errores}</b><span>errores</span></div></div>
      <button class="btn btn-primario btn-grande" id="cont">Continuar</button></section>`);
  const frase = estrellas === 3 ? `¡Perfecto, ${esc(E.nombre)}! Sin un solo error 🤩` : estrellas === 2 ? '¡Muy bien! Vas aprendiendo súper rápido 💪' : '¡Lo lograste! Equivocarse también es aprender 🌱';
  s.querySelector('.zona-pixi').appendChild(burbujaPixi(frase, { tamano: 120, estado: 'feliz' }));
  s.querySelector('#cont').onclick = () => pantallaCamino();
  app.appendChild(s);
}

/* =====================================================================
 * 7. RESULTADOS (pre vs post) Y CÓDIGO PARA GOOGLE FORMS
 * ===================================================================== */
function codigoResultados() {
  const exp = { nada: 'N', poco: 'P', curso: 'C' }[E.experiencia] || '-';
  const ocu = { isc: 'ISC', est: 'EST', otro: 'OTR' }[E.ocupacion] || '-';
  const edad = E.edad !== null && E.edad !== undefined ? PERFIL_EDADES[E.edad] : '-';
  const min = Math.round((Date.now() - E.inicio) / 60000);
  return `${E.codigo} | Edad: ${edad} | Exp: ${exp} | Ocup: ${ocu} | Inicial: ${E.pre ? E.pre.puntaje : '-'}/10 | Final: ${E.post ? E.post.puntaje : '-'}/10 | Lecciones: ${leccionesHechas()}/${todasLecciones().length} | XP: ${E.xp} | Min: ${min}`;
}

function pantallaResultados() {
  limpiar(); mostrarNav(null);
  const pre = E.pre ? E.pre.puntaje : null; const post = E.post ? E.post.puntaje : null;
  const dif = pre !== null && post !== null ? post - pre : null;
  const frase = dif === null ? '¡Terminaste! Aquí están tus resultados.' : dif > 0 ? `¡Subiste ${dif} punto${dif > 1 ? 's' : ''}! Aprendiste un montón 🎉` : dif === 0 ? '¡Mantuviste tu puntaje! Ya tenías buenas bases 👏' : 'Este examen fue retador, ¡pero recorriste todo el camino! 💪';
  const codigo = codigoResultados();
  const s = h(`<section class="pantalla resultados">
      <div class="zona-pixi"></div>
      <h1>Tus resultados</h1>
      <div class="grafica">
        <div class="col-g"><div class="barra-g pre" style="height:${(pre || 0) * 10}%"><b>${pre ?? '–'}</b></div></div>
        <div class="col-g"><div class="barra-g post" style="height:${(post || 0) * 10}%"><b>${post ?? '–'}</b></div></div>
      </div>
      <div class="etiquetas-g"><span>Inicial</span><span>Final</span></div>
      <p class="nota centro-txt">Puntaje sobre 10 preguntas</p>
      <div class="codigo-caja"><p><b>📋 Tu código de resultados</b><br>Cópialo y pégalo en el formulario para participar en el estudio (es anónimo).</p>
        <code id="cod">${esc(codigo)}</code>
        <div class="acciones-fila"><button class="btn btn-primario" id="copiar">Copiar código</button>
        ${FORM_URL ? `<a class="btn btn-sec" href="${esc(FORM_URL)}" target="_blank" rel="noopener">Abrir formulario ↗</a>` : ''}</div></div>
      <button class="btn btn-texto" id="volver">Volver al camino</button></section>`);
  s.querySelector('.zona-pixi').appendChild(burbujaPixi(frase, { tamano: 110, estado: 'feliz' }));
  s.querySelector('#copiar').onclick = async () => {
    try { await navigator.clipboard.writeText(codigo); aviso('✅ Código copiado'); }
    catch (e) { const r = document.createRange(); r.selectNode(s.querySelector('#cod')); getSelection().removeAllRanges(); getSelection().addRange(r); aviso('Selecciona y copia el código'); }
  };
  s.querySelector('#volver').onclick = () => pantallaCamino();
  app.appendChild(s);
}

/* =====================================================================
 * 8. DICCIONARIO, LOGROS Y PERFIL
 * ===================================================================== */
function pantallaDiccionario() {
  limpiar(); mostrarNav('diccionario');
  const terminos = construirDiccionario();
  const s = h(`<section class="pantalla diccionario"><div class="cab-seccion"><h1>📖 Diccionario de Pixi</h1><p>Cada palabra difícil, explicada fácil… y con su definición exacta.</p></div>
      <input class="campo buscar" placeholder="🔍 Buscar una palabra…" aria-label="Buscar"><div class="lista-terminos"></div></section>`);
  const lista = s.querySelector('.lista-terminos');
  const pintar = (filtro = '') => {
    lista.innerHTML = '';
    terminos.filter((t) => (t.termino + t.def).toLowerCase().includes(filtro.toLowerCase())).forEach((t) => {
      const u = UNIDADES.find((x) => x.num === t.unidad);
      const aprendida = !!E.lecciones[t.leccion];
      lista.appendChild(h(`<details class="termino" style="--c:${u.color}"><summary><span>${esc(t.termino)}</span>${aprendida ? '<em>✓ aprendida</em>' : `<small>Unidad ${t.unidad}</small>`}</summary>
        ${t.sencillo ? `<p class="sencillo"><b>O sea…</b> ${md(esc(t.sencillo))}</p>` : ''}<p class="formal"><b>Definición:</b> ${esc(t.def)}</p></details>`));
    });
    if (!lista.children.length) lista.innerHTML = '<p class="nota centro-txt">No encontré esa palabra 🤔</p>';
  };
  s.querySelector('.buscar').oninput = (e) => pintar(e.target.value);
  pintar();
  app.appendChild(s);
}

function pantallaLogros() {
  limpiar(); mostrarNav('logros');
  const s = h(`<section class="pantalla logros"><div class="cab-seccion"><h1>🏅 Logros</h1><p>${E.medallas.length} de ${MEDALLAS.length} medallas</p></div>
      <div class="resumen-xp"><div><b>⚡ ${E.xp}</b><span>XP total</span></div><div><b>⭐ ${totalEstrellas()}</b><span>estrellas</span></div><div><b>📚 ${leccionesHechas()}/${todasLecciones().length}</b><span>lecciones</span></div></div>
      <div class="medallas"></div></section>`);
  const g = s.querySelector('.medallas');
  MEDALLAS.forEach((m) => {
    const tiene = E.medallas.includes(m.id);
    g.appendChild(h(`<div class="medalla ${tiene ? 'tiene' : ''}"><span>${tiene ? m.icono : '🔒'}</span><b>${esc(m.nombre)}</b><small>${esc(m.desc)}</small></div>`));
  });
  app.appendChild(s);
}

function pantallaPerfil() {
  limpiar(); mostrarNav('perfil');
  const s = h(`<section class="pantalla perfil-pant"><div class="cab-seccion"><div class="hueco-pixi"></div><h1>${esc(E.nombre || 'Explorador')}</h1><p>Código de participante: <b>${esc(E.codigo)}</b></p></div>
      <div class="ajustes">
        <label class="ajuste"><span>🔊 Pixi lee en voz alta automáticamente</span><input type="checkbox" id="voz" ${E.voz ? 'checked' : ''}></label>
        <label class="ajuste"><span>🎵 Sonidos</span><input type="checkbox" id="son" ${E.sonido ? 'checked' : ''}></label>
        <label class="ajuste"><span>👩‍🏫 Modo docente (desbloquear todo)</span><input type="checkbox" id="doc" ${E.docente ? 'checked' : ''}></label>
      </div>
      <div class="acciones-col">
        ${E.post ? '<button class="btn btn-sec" id="res">📊 Ver mis resultados</button>' : ''}
        ${!E.pre ? '<button class="btn btn-sec" id="pre">📝 Hacer examen inicial</button>' : ''}
        <button class="btn btn-texto peligro" id="reset">Borrar mi progreso</button>
      </div>
      <p class="nota centro-txt">VisiónLab ${VERSION} · Instituto Tecnológico de Colima<br>Proyecto: <i>Reconocimiento de patrones visuales y aprendizaje automático para la interpretación de imágenes</i><br>🔒 Tu progreso se guarda solo en este dispositivo. Las fotos nunca salen de tu navegador.</p></section>`);
  s.querySelector('.hueco-pixi').appendChild(Pixi.crear(90, 'saludo'));
  s.querySelector('#voz').onchange = (e) => { E.voz = e.target.checked; guardar(); if (E.voz) hablar('¡Hola! Ahora leeré en voz alta.'); };
  s.querySelector('#son').onchange = (e) => { E.sonido = e.target.checked; guardar(); sonar('clic'); };
  s.querySelector('#doc').onchange = (e) => { E.docente = e.target.checked; guardar(); aviso(E.docente ? '👩‍🏫 Todo desbloqueado' : 'Modo docente desactivado'); };
  const r = s.querySelector('#res'); if (r) r.onclick = () => pantallaResultados();
  const pr = s.querySelector('#pre'); if (pr) pr.onclick = () => pantallaExamen('pre');
  s.querySelector('#reset').onclick = () => { if (confirm('¿Seguro? Se borrará todo tu progreso en este dispositivo.')) { E = estadoInicial(); guardar(); pantallaBienvenida(); } };
  app.appendChild(s);
}

/* =====================================================================
 * 9. ARRANQUE
 * ===================================================================== */
nav.querySelectorAll('button').forEach((b) => b.onclick = () => {
  sonar('clic');
  ({ camino: pantallaCamino, diccionario: pantallaDiccionario, logros: pantallaLogros, perfil: pantallaPerfil })[b.dataset.ir]();
});
if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => {};
if (E.onboarding) pantallaCamino(); else pantallaBienvenida();

// Aplicación instalable (PWA)
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
