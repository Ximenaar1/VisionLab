/*
 * Pixi — personaje guía de VisiónLab (SVG animado con CSS)
 * Estados: normal · feliz · triste · pensando · hablando · saludo
 */
const Pixi = (() => {
  const SVG = `
  <svg class="pixi-svg" viewBox="0 0 120 150" role="img" aria-label="Pixi, el robot guía">
    <g class="pixi-cuerpo-todo">
      <!-- antena -->
      <g class="pixi-antena">
        <line x1="60" y1="24" x2="60" y2="10" stroke="#1F4E79" stroke-width="3" stroke-linecap="round"/>
        <circle class="pixi-foco" cx="60" cy="8" r="5.5" fill="#F2994A"/>
      </g>
      <!-- brazos -->
      <g class="pixi-brazo pixi-brazo-izq"><path d="M34 100 Q20 106 18 118" stroke="#2F80ED" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="18" cy="119" r="5" fill="#F2994A"/></g>
      <g class="pixi-brazo pixi-brazo-der"><path d="M86 100 Q100 106 102 118" stroke="#2F80ED" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="102" cy="119" r="5" fill="#F2994A"/></g>
      <!-- cuerpo -->
      <rect x="34" y="88" width="52" height="40" rx="14" fill="#2F80ED"/>
      <rect x="44" y="98" width="32" height="18" rx="6" fill="#1F4E79"/>
      <circle class="pixi-luz" cx="53" cy="107" r="3.5" fill="#6FCF97"/>
      <circle class="pixi-luz pixi-luz2" cx="60" cy="107" r="3.5" fill="#F2C94C"/>
      <circle class="pixi-luz pixi-luz3" cx="67" cy="107" r="3.5" fill="#EB5757"/>
      <!-- ruedas -->
      <ellipse cx="46" cy="134" rx="9" ry="6" fill="#1F4E79"/>
      <ellipse cx="74" cy="134" rx="9" ry="6" fill="#1F4E79"/>
      <!-- cabeza -->
      <rect x="18" y="22" width="84" height="68" rx="28" fill="#EAF2FB" stroke="#2F80ED" stroke-width="3"/>
      <circle cx="30" cy="72" r="5" fill="#F9C9A7" opacity=".8"/>
      <circle cx="90" cy="72" r="5" fill="#F9C9A7" opacity=".8"/>
      <!-- ojo-cámara -->
      <circle cx="60" cy="52" r="23" fill="#1F2A44"/>
      <circle cx="60" cy="52" r="17" fill="#2F80ED"/>
      <g class="pixi-iris">
        <circle cx="60" cy="52" r="10" fill="#0B1530"/>
        <circle cx="60" cy="52" r="4" fill="#2F80ED" opacity=".55"/>
        <circle cx="55" cy="47" r="3.6" fill="#fff"/>
        <circle cx="64" cy="56" r="1.6" fill="#fff" opacity=".8"/>
      </g>
      <rect class="pixi-parpado" x="35" y="27" width="50" height="50" rx="25" fill="#EAF2FB"/>
      <!-- bocas -->
      <path class="pixi-boca boca-normal" d="M52 80 Q60 85 68 80" stroke="#1F4E79" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path class="pixi-boca boca-feliz" d="M49 78 Q60 90 71 78 Z" fill="#1F4E79"/>
      <path class="pixi-boca boca-triste" d="M52 84 Q60 78 68 84" stroke="#1F4E79" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse class="pixi-boca boca-o" cx="60" cy="81" rx="4.5" ry="3.5" fill="#1F4E79"/>
    </g>
  </svg>`;

  const ESTADOS = ['normal', 'feliz', 'triste', 'pensando', 'hablando', 'saludo'];

  function crear(tamano = 120, estado = 'normal') {
    const div = document.createElement('div');
    div.className = `pixi pixi--${estado}`;
    div.style.width = `${tamano}px`;
    div.innerHTML = SVG;
    return div;
  }

  function estado(el, nuevo, duracionMs = 0) {
    if (!el) return;
    ESTADOS.forEach((e) => el.classList.remove(`pixi--${e}`));
    el.classList.add(`pixi--${nuevo}`);
    clearTimeout(el._t);
    if (duracionMs > 0) el._t = setTimeout(() => estado(el, 'normal'), duracionMs);
  }

  return { crear, estado };
})();
