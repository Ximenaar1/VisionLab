/*
 * VisiónLab — módulo de inteligencia artificial
 *  - Carga de MobileNet v2 (TensorFlow.js)
 *  - Clasificación de imágenes (Pruébalo)
 *  - Clasificador propio por aprendizaje por transferencia + k vecinos más cercanos (Entrénalo)
 *  - Filtro de bordes (Sobel) para mostrar "cómo ve" la primera capa de una CNN
 * Todo se ejecuta en el navegador; ninguna imagen se envía a un servidor.
 */
const IA = (() => {
  let modelo = null;
  let promesa = null;

  function disponible() {
    return typeof tf !== 'undefined' && typeof mobilenet !== 'undefined';
  }

  /** Carga el modelo una sola vez y reutiliza la promesa. */
  function cargar() {
    if (modelo) return Promise.resolve(modelo);
    if (promesa) return promesa;
    if (!disponible()) return Promise.reject(new Error('Sin librerías de TensorFlow.js'));
    const t0 = performance.now();
    promesa = mobilenet.load({ version: 2, alpha: 1.0 }).then((m) => {
      modelo = m;
      console.info(`[VisiónLab] MobileNet cargado en ${((performance.now() - t0) / 1000).toFixed(1)} s (${tf.getBackend()})`);
      return m;
    }).catch((e) => { promesa = null; throw e; });
    return promesa;
  }

  /** Top-k predicciones con traducción al español cuando existe. */
  async function clasificar(img, k = 3) {
    const m = await cargar();
    const t0 = performance.now();
    const pred = await m.classify(img, k);
    const ms = Math.round(performance.now() - t0);
    return {
      ms,
      resultados: pred.map((p) => {
        const ingles = p.className.split(',')[0].trim();
        return { ingles, espanol: TRADUCCIONES[ingles] || null, prob: p.probability };
      }),
    };
  }

  /* ---------------- Clasificador propio (k-NN sobre embeddings) ---------------- */
  const ejemplos = [];          // { clase: 0|1, v: Float32Array normalizado }

  async function embedding(img) {
    const m = await cargar();
    const v = tf.tidy(() => {
      const e = m.infer(img, true);              // vector de características (embedding)
      const norma = e.norm();
      return e.div(norma).dataSync();
    });
    return Float32Array.from(v);
  }

  async function agregarEjemplo(img, clase) {
    ejemplos.push({ clase, v: await embedding(img) });
    return contar();
  }

  function contar() {
    return [0, 1].map((c) => ejemplos.filter((e) => e.clase === c).length);
  }

  function reiniciar() { ejemplos.length = 0; }

  async function predecirPropio(img, k = 5) {
    if (!ejemplos.length) return null;
    const v = await embedding(img);
    const sims = ejemplos.map((e) => {
      let s = 0;
      for (let i = 0; i < v.length; i++) s += v[i] * e.v[i];
      return { clase: e.clase, s };
    }).sort((a, b) => b.s - a.s).slice(0, Math.min(k, ejemplos.length));
    const votos = [0, 0];
    sims.forEach((x) => { votos[x.clase] += 1; });
    const total = votos[0] + votos[1];
    return votos.map((n) => n / total);
  }

  /* ---------------- Filtro de bordes (Sobel) ---------------- */
  function bordes(canvasOrigen, canvasDestino) {
    const w = canvasOrigen.width, h = canvasOrigen.height;
    const src = canvasOrigen.getContext('2d').getImageData(0, 0, w, h).data;
    const gris = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) gris[i] = 0.299 * src[i * 4] + 0.587 * src[i * 4 + 1] + 0.114 * src[i * 4 + 2];
    canvasDestino.width = w; canvasDestino.height = h;
    const ctx = canvasDestino.getContext('2d');
    const out = ctx.createImageData(w, h);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const p = (yy, xx) => gris[yy * w + xx];
        const gx = -p(y - 1, x - 1) - 2 * p(y, x - 1) - p(y + 1, x - 1) + p(y - 1, x + 1) + 2 * p(y, x + 1) + p(y + 1, x + 1);
        const gy = -p(y - 1, x - 1) - 2 * p(y - 1, x) - p(y - 1, x + 1) + p(y + 1, x - 1) + 2 * p(y + 1, x) + p(y + 1, x + 1);
        const mag = Math.min(255, Math.hypot(gx, gy));
        const i = (y * w + x) * 4;
        out.data[i] = out.data[i + 1] = out.data[i + 2] = mag;
        out.data[i + 3] = 255;
      }
    }
    return { ctx, out, w, h };
  }

  return { cargar, clasificar, agregarEjemplo, predecirPropio, contar, reiniciar, bordes, disponible, listo: () => !!modelo };
})();
