/*
 * VisiónLab — contenido educativo
 * Aquí están todas las lecciones, ejercicios, exámenes, diccionario y medallas.
 * Para cambiar un texto de la app, normalmente solo hay que editar este archivo.
 */

// Liga de tu Google Form (pégala entre las comillas). Si queda vacía, el botón no aparece.
const FORM_URL = '';

/* ------------------------------------------------------------------
 * TIPOS DE PASO dentro de una lección
 *  explica  → Pixi explica algo sencillo; opcional "clave" (término exacto + definición formal) y "visual" (HTML)
 *  opcion   → pregunta de opción múltiple (correcta = índice de la opción correcta)
 *  vf       → verdadero o falso
 *  ordena   → ordenar pasos (items en el ORDEN CORRECTO; la app los revuelve)
 *  empareja → unir cada término con su significado
 *  pixeles  → actividad interactiva: una imagen es una tabla de números
 *  filtro   → actividad interactiva: así ve la primera capa de una CNN (bordes)
 *  prueba   → actividad con el modelo real MobileNet
 *  entrena  → actividad: entrenar un clasificador propio con la cámara
 * ------------------------------------------------------------------ */

const UNIDADES = [
  {
    id: 'u0', num: 0, icono: '💡', color: '#2F80ED',
    titulo: 'Lo básico', subtitulo: 'Qué es la IA y qué es una imagen para una computadora',
    lecciones: [
      {
        id: 'u0l1', titulo: '¿Qué es la inteligencia artificial?',
        pasos: [
          { tipo: 'explica', pixi: '¡Hola! Empecemos desde cero. No necesitas saber nada de computación.',
            texto: 'Todos los días usas **inteligencia artificial** sin darte cuenta: cuando tu celular se desbloquea con tu cara, cuando una app traduce un texto o cuando te recomiendan un video.',
            visual: '<div class="emojis-fila">📱🙂 · 🌐🔤 · 🎬👍</div>' },
          { tipo: 'explica', pixi: 'O sea: la IA son programas que hacen tareas que antes solo podía hacer una persona.',
            clave: { termino: 'Inteligencia artificial (IA)', def: 'Área de la computación que desarrolla sistemas capaces de realizar tareas que normalmente requieren inteligencia humana, como reconocer imágenes, entender lenguaje o tomar decisiones.' } },
          { tipo: 'opcion', pregunta: '¿Cuál de estas cosas usa inteligencia artificial?',
            opciones: ['🔦 Una lámpara que se prende con un interruptor', '📱 Un celular que se desbloquea al reconocer tu cara', '🧮 Una calculadora que suma 2 + 2', '⏰ Un despertador que suena a las 7:00'],
            correcta: 1, explica: 'Reconocer una cara es algo que antes solo podía hacer una persona. Las otras cosas siguen reglas fijas y sencillas.' },
          { tipo: 'explica', pixi: 'Toda IA funciona con instrucciones. A esas instrucciones se les llama algoritmo. Es como una receta de cocina 🍳.',
            clave: { termino: 'Algoritmo', def: 'Conjunto ordenado y finito de pasos o instrucciones que permite resolver un problema o realizar una tarea.' } },
          { tipo: 'ordena', pregunta: 'Un algoritmo es como una receta. Ordena los pasos para preparar un sándwich 🥪:',
            items: ['Tomar dos panes', 'Poner jamón y queso en un pan', 'Tapar con el otro pan', 'Servir en un plato'],
            explica: 'Igual que un algoritmo: los pasos tienen un orden y cada uno depende del anterior.' },
          { tipo: 'vf', afirmacion: 'La inteligencia artificial piensa y siente igual que una persona.', correcta: false,
            explica: 'Falso. La IA no tiene sentimientos ni conciencia: hace cálculos con datos para dar una respuesta. Puede parecer "lista", pero no piensa como nosotros.' },
        ],
      },
      {
        id: 'u0l2', titulo: '¿Cómo es una imagen para la computadora?',
        pasos: [
          { tipo: 'explica', pixi: 'Tú ves una foto. La computadora ve... ¡puros números! 🔢',
            texto: 'Si haces zoom a una foto muchas veces, verás que está hecha de cuadritos de color. Cada cuadrito se llama **píxel**.',
            clave: { termino: 'Píxel', def: 'Unidad mínima de una imagen digital. Cada píxel almacena un valor numérico que representa su color o intensidad de luz.' } },
          { tipo: 'pixeles' },
          { tipo: 'explica', pixi: 'En las fotos a color, cada píxel tiene 3 números: cuánto rojo, cuánto verde y cuánto azul tiene.',
            visual: '<div class="rgb"><span style="background:#e53935">R 229</span><span style="background:#43a047">G 67</span><span style="background:#1e88e5">B 53</span><b>= 🟥</b></div>',
            clave: { termino: 'Modelo de color RGB', def: 'Forma de representar colores combinando tres canales: rojo (Red), verde (Green) y azul (Blue), cada uno con un valor de 0 a 255.' } },
          { tipo: 'opcion', pregunta: 'Para una computadora, una imagen digital es...',
            opciones: ['Un dibujo que entiende igual que nosotros', 'Una tabla de números (píxeles)', 'Un sonido', 'Un texto con palabras'],
            correcta: 1, explica: 'Exacto: una imagen es una cuadrícula de píxeles y cada píxel es un número (o tres, si es a color).' },
          { tipo: 'vf', afirmacion: 'Una foto de celular puede tener millones de píxeles.', correcta: true,
            explica: 'Verdadero. Una cámara de 12 megapíxeles toma fotos de unos 12 millones de píxeles. ¡Muchos números!' },
        ],
      },
    ],
  },
  {
    id: 'u1', num: 1, icono: '🔍', color: '#F2994A',
    titulo: 'Patrones', subtitulo: 'Lo que se repite y nos ayuda a reconocer',
    lecciones: [
      {
        id: 'u1l1', titulo: '¿Qué es un patrón?',
        pasos: [
          { tipo: 'explica', pixi: '¿Cómo sabes que algo es una manzana 🍎, aunque nunca hayas visto esa manzana?',
            texto: 'Porque reconoces **lo que se repite**: forma redonda, un tallito, colores rojo o verde. Eso es un **patrón**.',
            clave: { termino: 'Patrón', def: 'Regularidad o estructura que se repite en los datos (formas, colores, texturas, bordes) y que permite asignar un elemento a una categoría.' } },
          { tipo: 'opcion', pregunta: '¿Qué patrón comparten estos? 🍎 🍓 🍒 🌶️',
            opciones: ['Todos son dulces', 'Todos son de color rojo', 'Todos son redondos', 'Todos son verduras'],
            correcta: 1, explica: 'El color rojo es el patrón que se repite. ¡Acabas de reconocer un patrón visual!' },
          { tipo: 'opcion', pregunta: '¿Cuál NO sigue el patrón? 🚗 🚕 🚙 🍌 🚓',
            opciones: ['🚕', '🍌', '🚓', '🚙'],
            correcta: 1, explica: 'Los demás son vehículos con ruedas y ventanas; el plátano no comparte esas características.' },
          { tipo: 'vf', afirmacion: 'Un patrón puede ser una forma, un color o una textura que se repite.', correcta: true,
            explica: 'Verdadero. Formas, colores, texturas y bordes son patrones visuales.' },
        ],
      },
      {
        id: 'u1l2', titulo: 'Reconocer patrones',
        pasos: [
          { tipo: 'explica', pixi: 'Las pistas que usamos para reconocer algo se llaman características.',
            texto: 'Un gato 🐱 tiene orejas puntiagudas, bigotes y ojos grandes. Esas son sus **características**. Una computadora también busca características para saber qué hay en una imagen.',
            clave: { termino: 'Características (features)', def: 'Atributos medibles de un dato —en imágenes: bordes, texturas, formas o colores— que un sistema utiliza para distinguir entre categorías.' } },
          { tipo: 'empareja', pregunta: 'Une cada cosa con una característica que la distingue:',
            pares: [['🦒 Jirafa', 'Cuello muy largo'], ['🦓 Cebra', 'Rayas blancas y negras'], ['🐘 Elefante', 'Trompa larga'], ['🐧 Pingüino', 'Blanco y negro, camina parado']],
            explica: '¡Muy bien! Así funciona el reconocimiento de patrones: buscar las características que distinguen a cada cosa.' },
          { tipo: 'explica', pixi: 'Cuando una computadora hace esto con imágenes, se llama visión por computadora 👁️.',
            clave: { termino: 'Visión por computadora', def: 'Campo de la inteligencia artificial que permite a los sistemas obtener información a partir de imágenes o videos, como identificar objetos, personas o escenas.' } },
          { tipo: 'opcion', pregunta: '¿Qué es el reconocimiento de patrones?',
            opciones: ['Dibujar patrones bonitos', 'Identificar regularidades en los datos para asignarlos a una categoría', 'Copiar imágenes de internet', 'Tomar fotos con buena luz'],
            correcta: 1, explica: 'Reconocer patrones es encontrar lo que se repite y usarlo para decidir a qué categoría pertenece algo.',
            clave: { termino: 'Reconocimiento de patrones', def: 'Proceso mediante el cual un sistema identifica regularidades en los datos y las utiliza para clasificarlos en categorías.' } },
        ],
      },
    ],
  },
  {
    id: 'u2', num: 2, icono: '🧠', color: '#27AE60',
    titulo: '¿Cómo aprende una máquina?', subtitulo: 'Aprender con ejemplos',
    lecciones: [
      {
        id: 'u2l1', titulo: 'Aprender con ejemplos',
        pasos: [
          { tipo: 'explica', pixi: 'Hay dos formas de enseñarle algo a una computadora.',
            visual: '<div class="comparar"><div><b>📝 Programación tradicional</b><br>Tú escribes las reglas:<br><i>"si es rojo y redondo → manzana"</i></div><div><b>🧠 Machine learning</b><br>Le das muchos ejemplos y <u>ella descubre</u> las reglas sola.</div></div>' },
          { tipo: 'explica', pixi: 'O sea: en machine learning la computadora aprende viendo ejemplos, como un niño que ve muchos perros hasta que los reconoce.',
            clave: { termino: 'Aprendizaje automático (machine learning)', def: 'Rama de la inteligencia artificial que desarrolla algoritmos capaces de aprender patrones a partir de datos y mejorar su desempeño en una tarea sin ser programados explícitamente para cada caso.' } },
          { tipo: 'explica', pixi: 'Los ejemplos que usa se llaman datos, y cada ejemplo lleva su respuesta correcta: la etiqueta 🏷️.',
            visual: '<div class="etiquetas"><span>🐶 → "perro"</span><span>🐱 → "gato"</span><span>🐶 → "perro"</span><span>🐱 → "gato"</span></div>',
            clave: { termino: 'Conjunto de datos (dataset) y etiqueta', def: 'Un dataset es una colección de ejemplos utilizados para entrenar o evaluar un modelo. La etiqueta es la respuesta correcta asociada a cada ejemplo (por ejemplo, "gato").' } },
          { tipo: 'opcion', pregunta: '¿Cuál es la principal diferencia del machine learning?',
            opciones: ['No necesita datos', 'La computadora descubre las reglas a partir de ejemplos', 'Siempre acierta al 100 %', 'Solo funciona con internet'],
            correcta: 1, explica: 'En lugar de programar cada regla, le damos ejemplos y el sistema aprende los patrones.' },
          { tipo: 'vf', afirmacion: 'Para aprender a reconocer gatos, un modelo necesita ver muchas fotos de gatos con su etiqueta.', correcta: true,
            explica: 'Verdadero. Entre más ejemplos variados vea, mejor aprende.' },
        ],
      },
      {
        id: 'u2l2', titulo: 'Entrenar y equivocarse',
        pasos: [
          { tipo: 'explica', pixi: 'Aprender es equivocarse y corregir. ¡A la computadora le pasa igual!',
            texto: 'El **entrenamiento** es un ciclo: el modelo ve un ejemplo, adivina, compara con la respuesta correcta y se ajusta un poquito. Esto se repite miles de veces.',
            clave: { termino: 'Entrenamiento', def: 'Proceso en el que un modelo ajusta sus parámetros internos (pesos) comparando sus predicciones con las respuestas correctas para reducir su error.' } },
          { tipo: 'ordena', pregunta: 'Ordena el ciclo de entrenamiento:',
            items: ['El modelo ve un ejemplo', 'Adivina qué es', 'Compara con la respuesta correcta', 'Se corrige un poquito', 'Repite con otro ejemplo'],
            explica: 'Este ciclo se repite miles o millones de veces. Así el modelo se equivoca cada vez menos.' },
          { tipo: 'explica', pixi: 'Lo que resulta de entrenar se llama modelo. Es como el "cerebro" ya entrenado.',
            clave: { termino: 'Modelo', def: 'Resultado del entrenamiento: una estructura matemática con parámetros ajustados que recibe un dato nuevo y produce una predicción.' } },
          { tipo: 'opcion', pregunta: 'Si un modelo solo vio gatos naranjas 🐈, ¿qué puede pasar con un gato negro 🐈‍⬛?',
            opciones: ['Lo reconoce perfecto', 'Podría equivocarse, porque no vio ejemplos parecidos', 'Se descompone', 'Aprende solo en ese momento'],
            correcta: 1, explica: 'Por eso los datos deben ser variados. Cuando los datos no representan bien la realidad, se dice que tienen sesgo.',
            clave: { termino: 'Sesgo en los datos', def: 'Situación en la que los datos de entrenamiento no representan adecuadamente la variedad del mundo real, lo que provoca errores sistemáticos en el modelo.' } },
        ],
      },
    ],
  },
  {
    id: 'u3', num: 3, icono: '🧩', color: '#9B51E0',
    titulo: 'El cerebro por capas', subtitulo: 'Redes neuronales convolucionales (CNN)',
    lecciones: [
      {
        id: 'u3l1', titulo: 'Las redes neuronales',
        pasos: [
          { tipo: 'explica', pixi: 'Muchos modelos de IA usan redes neuronales, inspiradas (de lejitos) en el cerebro 🧠.',
            texto: 'Una red neuronal está hecha de muchas "neuronas" pequeñitas. Cada una hace una cuenta sencilla y le pasa el resultado a las siguientes. Se organizan en **capas**.',
            visual: '<div class="red"><div><i></i><i></i><i></i></div><div><i></i><i></i><i></i><i></i></div><div><i></i><i></i></div></div><p class="nota-visual">Entrada → capas ocultas → salida</p>',
            clave: { termino: 'Red neuronal artificial', def: 'Modelo computacional formado por unidades (neuronas) organizadas en capas y conectadas entre sí; cada conexión tiene un peso que se ajusta durante el entrenamiento.' } },
          { tipo: 'vf', afirmacion: 'Una red neuronal artificial es un cerebro de verdad dentro de la computadora.', correcta: false,
            explica: 'Falso. Solo se inspira en la idea de neuronas conectadas; en realidad son operaciones matemáticas.' },
          { tipo: 'opcion', pregunta: 'En una red neuronal, las neuronas se organizan en...',
            opciones: ['Carpetas', 'Capas', 'Colores', 'Píxeles'],
            correcta: 1, explica: 'Correcto: capas. La información pasa de una capa a la siguiente.' },
        ],
      },
      {
        id: 'u3l2', titulo: 'Las capas de una CNN',
        pasos: [
          { tipo: 'explica', pixi: 'Para imágenes se usa un tipo especial: la CNN. Revisa la imagen por partes, como con lupas 🔎.',
            visual: '<div class="capas-cnn"><span>🖼️<small>Imagen</small></span>→<span>〰️<small>Bordes</small></span>→<span>⭕<small>Formas</small></span>→<span>🐱<small>Objeto</small></span></div>',
            texto: 'Las primeras capas encuentran **bordes y líneas**; las del medio los combinan en **formas** (ojos, orejas, ruedas) y las últimas deciden **qué objeto** es.',
            clave: { termino: 'Red neuronal convolucional (CNN)', def: 'Tipo de red neuronal profunda especializada en imágenes que aplica filtros de convolución para extraer características jerárquicas, de bajo nivel (bordes) a alto nivel (objetos).' } },
          { tipo: 'explica', pixi: 'Cada "lupa" es un filtro que recorre la imagen buscando algo específico. A esa operación se le llama convolución.',
            clave: { termino: 'Convolución (filtro)', def: 'Operación que desliza una pequeña matriz de números (filtro o kernel) sobre la imagen y combina los píxeles vecinos para resaltar una característica, como los bordes.' } },
          { tipo: 'filtro' },
          { tipo: 'ordena', pregunta: 'Ordena lo que va encontrando una CNN, de la primera capa a la última:',
            items: ['Bordes y líneas', 'Formas (círculos, esquinas)', 'Partes (ojos, orejas)', 'El objeto completo: ¡gato!'],
            explica: 'De lo simple a lo complejo. Por eso se dice que las CNN aprenden características jerárquicas.' },
          { tipo: 'opcion', pregunta: '¿Qué suelen detectar las primeras capas de una CNN?',
            opciones: ['Objetos completos', 'Bordes y líneas simples', 'Nombres de las cosas', 'El tamaño del archivo'],
            correcta: 1, explica: '¡Exacto! Justo lo que viste con el filtro: bordes.' },
        ],
      },
    ],
  },
  {
    id: 'u4', num: 4, icono: '📷', color: '#EB5757',
    titulo: '¡Pruébalo!', subtitulo: 'Un modelo real reconoce tus fotos',
    lecciones: [
      {
        id: 'u4l1', titulo: 'La confianza de la IA',
        pasos: [
          { tipo: 'explica', pixi: 'Cuando la IA responde, no dice "es un gato" y ya. Dice qué tan segura está.',
            visual: '<div class="barras-demo"><div><span>gato</span><i style="width:82%"></i><b>82 %</b></div><div><span>zorro</span><i style="width:11%"></i><b>11 %</b></div><div><span>perro</span><i style="width:4%"></i><b>4 %</b></div></div>',
            clave: { termino: 'Predicción y confianza', def: 'La predicción es la categoría que el modelo asigna a un dato. La confianza (probabilidad) es un valor entre 0 y 1 (o 0 % y 100 %) que indica qué tan probable considera el modelo cada categoría.' } },
          { tipo: 'opcion', pregunta: 'Si la IA dice "gato: 62 %", significa que...',
            opciones: ['Es un gato con total seguridad', 'El 62 % de la foto es gato', 'Cree que lo más probable es "gato", con confianza de 62 %', 'Se equivocó'],
            correcta: 2, explica: 'El porcentaje es la confianza del modelo, no una garantía. Puede equivocarse aun con 90 %.' },
          { tipo: 'vf', afirmacion: 'Si la confianza es baja en todas las opciones, probablemente la imagen no se parece a nada de lo que el modelo conoce.', correcta: true,
            explica: 'Verdadero. Un modelo solo puede reconocer las categorías con las que fue entrenado.' },
        ],
      },
      {
        id: 'u4l2', titulo: 'Prueba un modelo real',
        pasos: [
          { tipo: 'explica', pixi: 'Vamos a usar un modelo de verdad: MobileNet. Ya fue entrenado por Google con más de un millón de fotos.',
            texto: 'Como ya viene entrenado, se llama **modelo preentrenado**. Conoce 1,000 categorías de un conjunto de datos llamado **ImageNet** (animales, objetos, comida, vehículos...).',
            clave: { termino: 'Modelo preentrenado', def: 'Modelo que ya fue entrenado con un conjunto de datos grande (como ImageNet) y puede reutilizarse directamente o adaptarse a otras tareas.' } },
          { tipo: 'prueba' },
          { tipo: 'opcion', pregunta: 'Si le muestras a MobileNet algo que no está entre sus 1,000 categorías, lo más probable es que...',
            opciones: ['Lo reconozca perfecto', 'Elija la categoría que más se le parece, con poca confianza', 'Aprenda la nueva categoría solo', 'Muestre un error'],
            correcta: 1, explica: 'Siempre elige entre lo que conoce. Por eso a veces da respuestas curiosas.' },
        ],
      },
    ],
  },
  {
    id: 'u5', num: 5, icono: '🏋️', color: '#F2C94C',
    titulo: '¡Entrénalo tú!', subtitulo: 'Crea tu propio modelo con tu cámara',
    lecciones: [
      {
        id: 'u5l1', titulo: 'Reutilizar lo aprendido',
        pasos: [
          { tipo: 'explica', pixi: 'Entrenar un modelo desde cero necesita millones de fotos. ¡Pero hay un truco!',
            texto: 'Podemos tomar un modelo que ya sabe ver (MobileNet) y enseñarle algo nuevo con **pocos ejemplos**. Es como alguien que ya sabe andar en bici y aprende rápido a usar una moto 🛵.',
            clave: { termino: 'Aprendizaje por transferencia', def: 'Técnica que reutiliza el conocimiento de un modelo preentrenado en una tarea general para resolver una tarea nueva con pocos datos.' } },
          { tipo: 'opcion', pregunta: '¿Por qué el aprendizaje por transferencia necesita pocos ejemplos?',
            opciones: ['Porque adivina al azar', 'Porque reutiliza lo que el modelo ya aprendió antes', 'Porque no usa datos', 'Porque solo funciona con gatos'],
            correcta: 1, explica: 'El modelo ya sabe detectar bordes, formas y partes; solo aprende a combinar eso para tus nuevas clases.' },
          { tipo: 'vf', afirmacion: 'Para enseñarle una categoría nueva hay que entrenar todo desde cero.', correcta: false,
            explica: 'Falso. Con aprendizaje por transferencia solo se entrena la parte final, con pocos ejemplos.' },
        ],
      },
      {
        id: 'u5l2', titulo: 'Entrena a Pixi',
        pasos: [
          { tipo: 'explica', pixi: '¡Ahora tú serás quien entrena! Vas a enseñarme a distinguir dos cosas con tu cámara.',
            texto: 'Por ejemplo: ✋ **mano abierta** vs ✊ **puño**. Toma varios ejemplos de cada una, con distintas posiciones. Después lo probamos en vivo.' },
          { tipo: 'entrena' },
          { tipo: 'vf', afirmacion: 'Si tomas ejemplos variados (distintas posiciones y fondos), tu modelo suele funcionar mejor.', correcta: true,
            explica: 'Verdadero. Datos variados = menos sesgo = mejor modelo. ¡Justo lo que aprendiste en la Unidad 2!' },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------
 * EXAMEN (el mismo al inicio y al final) — instrumento del Anexo D
 * ------------------------------------------------------------------ */
const EXAMEN = [
  { pregunta: 'En reconocimiento de imágenes, un "patrón visual" es:', opciones: ['Un filtro de color que se aplica a una foto', 'Una regularidad (forma, textura, borde) que permite distinguir una categoría', 'El formato del archivo de imagen', 'La resolución de la cámara'], correcta: 1 },
  { pregunta: 'La principal diferencia entre programar reglas y usar machine learning es que en machine learning:', opciones: ['El programa no necesita datos', 'El sistema aprende las reglas a partir de ejemplos', 'Siempre se obtiene 100 % de precisión', 'No se usa una computadora'], correcta: 1 },
  { pregunta: 'Las primeras capas de una red neuronal convolucional suelen detectar:', opciones: ['Objetos completos', 'Nombres de las categorías', 'Bordes y líneas simples', 'El tamaño del archivo'], correcta: 2 },
  { pregunta: '"Entrenar" un modelo significa:', opciones: ['Instalarlo en el navegador', 'Ajustar sus parámetros comparando sus predicciones con respuestas correctas', 'Tomar muchas fotos con la cámara', 'Traducir las etiquetas'], correcta: 1 },
  { pregunta: 'Si un modelo responde "gato: 62 %", esto significa que:', opciones: ['La imagen es un gato con total seguridad', 'El 62 % de la imagen contiene un gato', 'El modelo estima que "gato" es la categoría más probable, con una confianza de 0.62', 'El modelo se equivocó'], correcta: 2 },
  { pregunta: 'Un modelo entrenado solo con fotos de perros y gatos recibe la foto de un coche. Lo más probable es que:', opciones: ['Responda "coche"', 'Lo clasifique como perro o gato, porque solo conoce esas categorías', 'Se niegue a responder', 'Aprenda automáticamente qué es un coche'], correcta: 1 },
  { pregunta: 'Un conjunto de datos (dataset) de entrenamiento es:', opciones: ['Una colección de ejemplos etiquetados', 'El código fuente del modelo', 'La interfaz de la aplicación', 'Un tipo de red neuronal'], correcta: 0 },
  { pregunta: 'El aprendizaje por transferencia consiste en:', opciones: ['Copiar un modelo de otra computadora', 'Reutilizar un modelo ya entrenado para una tarea nueva con pocos ejemplos', 'Enviar imágenes a un servidor', 'Entrenar un modelo desde cero'], correcta: 1 },
  { pregunta: '¿Cuál de las siguientes situaciones puede provocar que un modelo de visión se equivoque?', opciones: ['Imágenes muy distintas a las usadas en su entrenamiento', 'Poca iluminación o fondos confusos', 'Pocos ejemplos durante el entrenamiento', 'Todas las anteriores'], correcta: 3 },
  { pregunta: 'MobileNet es:', opciones: ['Una aplicación de mensajería', 'Una red neuronal convolucional ligera diseñada para dispositivos móviles y navegadores', 'Un conjunto de datos de imágenes', 'Un lenguaje de programación'], correcta: 1 },
];

/* Preguntas de perfil (sección A del instrumento) */
const PERFIL_EDADES = ['Menos de 15', '15 a 17', '18 a 24', '25 a 39', '40 a 59', '60 o más'];
const PERFIL_EXPERIENCIA = [
  { id: 'nada', texto: '🌱 Nada, soy nuevo en esto' },
  { id: 'poco', texto: '🌿 Un poco, he oído del tema' },
  { id: 'curso', texto: '🌳 Ya llevé una materia o curso de IA' },
];
const PERFIL_OCUPACION = [
  { id: 'isc', texto: '💻 Estudiante de Sistemas / Informática' },
  { id: 'est', texto: '🎒 Estudiante de otra carrera o nivel' },
  { id: 'otro', texto: '👤 Otro' },
];

/* ------------------------------------------------------------------
 * MEDALLAS
 * ------------------------------------------------------------------ */
const MEDALLAS = [
  { id: 'bienvenida', icono: '👋', nombre: 'Primer paso', desc: 'Empezaste tu aventura en VisiónLab' },
  { id: 'primera', icono: '🎯', nombre: 'Primera lección', desc: 'Completaste tu primera lección' },
  { id: 'perfecta', icono: '💎', nombre: 'Lección perfecta', desc: 'Terminaste una lección sin errores' },
  { id: 'u0', icono: '💡', nombre: 'Buenas bases', desc: 'Completaste la Unidad 0: Lo básico' },
  { id: 'u1', icono: '🔍', nombre: 'Ojo de detective', desc: 'Completaste la Unidad 1: Patrones' },
  { id: 'u2', icono: '🧠', nombre: 'Mente que aprende', desc: 'Completaste la Unidad 2: Aprendizaje automático' },
  { id: 'u3', icono: '🧩', nombre: 'Arquitecto de capas', desc: 'Completaste la Unidad 3: CNN' },
  { id: 'fotografo', icono: '📸', nombre: 'Fotógrafo IA', desc: 'Probaste el modelo real con una imagen' },
  { id: 'entrenador', icono: '🏋️', nombre: 'Entrenador', desc: 'Entrenaste tu propio modelo' },
  { id: 'xp200', icono: '⚡', nombre: '200 XP', desc: 'Juntaste 200 puntos de experiencia' },
  { id: 'graduado', icono: '🎓', nombre: 'Graduado VisiónLab', desc: 'Terminaste el examen final' },
  { id: 'mejora', icono: '📈', nombre: '¡Mejoraste!', desc: 'Sacaste más en el examen final que en el inicial' },
];

/* ------------------------------------------------------------------
 * DICCIONARIO DE PIXI (se arma solo con las palabras clave de las lecciones)
 * ------------------------------------------------------------------ */
/* Explicación sencilla ("O sea…") de cada palabra clave para el diccionario */
const SENCILLO = {
  'Inteligencia artificial (IA)': 'Programas que hacen tareas que antes solo podía hacer una persona, como reconocer caras o traducir.',
  'Algoritmo': 'Una lista de pasos en orden para resolver algo, como una receta de cocina.',
  'Píxel': 'Cada cuadrito de color que forma una imagen. Para la computadora, cada cuadrito es un número.',
  'Modelo de color RGB': 'Cada color se hace mezclando tres luces: rojo, verde y azul. Cada una va de 0 (nada) a 255 (máximo).',
  'Patrón': 'Algo que se repite y te ayuda a reconocer una cosa, como la forma redonda de una manzana.',
  'Características (features)': 'Las pistas que usas para reconocer algo: orejas, bigotes, color, forma…',
  'Visión por computadora': 'Enseñarle a una computadora a "entender" lo que hay en fotos y videos.',
  'Reconocimiento de patrones': 'Encontrar lo que se repite en algo y usarlo para decidir qué es.',
  'Aprendizaje automático (machine learning)': 'La computadora aprende viendo muchos ejemplos, en lugar de que alguien le escriba cada regla.',
  'Conjunto de datos (dataset) y etiqueta': 'Muchos ejemplos (fotos) con su respuesta correcta pegada, como "esto es un gato".',
  'Entrenamiento': 'El modelo practica: adivina, revisa si acertó y se corrige, miles de veces.',
  'Modelo': 'El "cerebro" que queda después de entrenar; recibe una foto nueva y da una respuesta.',
  'Sesgo en los datos': 'Cuando los ejemplos no se parecen a la realidad (por ejemplo, solo gatos naranjas) y el modelo aprende mal.',
  'Red neuronal artificial': 'Muchas "calculadoras" pequeñitas conectadas en capas que se pasan información.',
  'Red neuronal convolucional (CNN)': 'Una red especial para imágenes que las revisa por partes: primero bordes, luego formas y al final el objeto.',
  'Convolución (filtro)': 'Una "lupa" que recorre la imagen cuadrito por cuadrito buscando algo, como los bordes.',
  'Predicción y confianza': 'La respuesta de la IA y qué tan segura está de ella, en porcentaje.',
  'Modelo preentrenado': 'Un modelo que alguien ya entrenó con muchísimas fotos y que podemos usar directamente.',
  'Aprendizaje por transferencia': 'Aprovechar lo que un modelo ya sabe para enseñarle algo nuevo con pocos ejemplos.',
};

function construirDiccionario() {
  const vistos = new Map();
  UNIDADES.forEach((u) => u.lecciones.forEach((l) => l.pasos.forEach((p) => {
    if (p.clave && !vistos.has(p.clave.termino)) {
      vistos.set(p.clave.termino, { ...p.clave, sencillo: SENCILLO[p.clave.termino] || p.pixi || '', unidad: u.num, leccion: l.id });
    }
  })));
  return [...vistos.values()];
}

/* Traducciones de etiquetas frecuentes de ImageNet (el resto se muestra en inglés) */
const TRADUCCIONES = {
  'coffee mug': 'taza de café', 'cup': 'taza', 'water bottle': 'botella de agua', 'pop bottle': 'botella de refresco', 'beer bottle': 'botella de cerveza',
  'wine bottle': 'botella de vino', 'computer keyboard': 'teclado', 'mouse': 'mouse (ratón)', 'laptop': 'laptop', 'notebook': 'laptop', 'desktop computer': 'computadora de escritorio',
  'monitor': 'monitor', 'screen': 'pantalla', 'television': 'televisión', 'cellular telephone': 'celular', 'remote control': 'control remoto', 'iPod': 'reproductor de música',
  'tabby': 'gato atigrado', 'tiger cat': 'gato atigrado', 'Egyptian cat': 'gato egipcio', 'Persian cat': 'gato persa', 'Siamese cat': 'gato siamés',
  'golden retriever': 'perro golden retriever', 'Labrador retriever': 'perro labrador', 'Chihuahua': 'perro chihuahua', 'pug': 'perro pug', 'German shepherd': 'perro pastor alemán',
  'banana': 'plátano', 'orange': 'naranja', 'lemon': 'limón', 'Granny Smith': 'manzana verde', 'strawberry': 'fresa', 'pineapple': 'piña', 'pomegranate': 'granada',
  'broccoli': 'brócoli', 'cucumber': 'pepino', 'bell pepper': 'pimiento', 'mushroom': 'hongo', 'pizza': 'pizza', 'hotdog': 'hot dog', 'cheeseburger': 'hamburguesa',
  'ice cream': 'helado', 'burrito': 'burrito', 'guacamole': 'guacamole', 'plate': 'plato', 'spoon': 'cuchara', 'wooden spoon': 'cuchara de madera', 'frying pan': 'sartén',
  'backpack': 'mochila', 'purse': 'bolso', 'wallet': 'cartera', 'sunglasses': 'lentes de sol', 'sunglass': 'lentes de sol', 'jean': 'pantalón de mezclilla', 'jersey': 'playera',
  'running shoe': 'tenis', 'sandal': 'sandalia', 'sock': 'calcetín', 'hat': 'sombrero', 'cowboy hat': 'sombrero vaquero', 'sombrero': 'sombrero',
  'pencil box': 'lapicera', 'ballpoint': 'pluma', 'fountain pen': 'pluma fuente', 'rubber eraser': 'goma de borrar', 'book jacket': 'portada de libro', 'binder': 'carpeta',
  'envelope': 'sobre', 'scissors': 'tijeras', 'digital clock': 'reloj digital', 'wall clock': 'reloj de pared', 'analog clock': 'reloj', 'digital watch': 'reloj digital',
  'lampshade': 'lámpara', 'table lamp': 'lámpara de mesa', 'desk': 'escritorio', 'dining table': 'mesa', 'folding chair': 'silla plegable', 'rocking chair': 'mecedora',
  'studio couch': 'sofá', 'pillow': 'almohada', 'quilt': 'cobija', 'window shade': 'persiana', 'shower curtain': 'cortina', 'refrigerator': 'refrigerador', 'microwave': 'microondas',
  'washbasin': 'lavabo', 'toilet tissue': 'papel de baño', 'soap dispenser': 'jabonera', 'toothbrush': 'cepillo de dientes', 'hair dryer': 'secadora de pelo',
  'pot': 'maceta', 'daisy': 'margarita', 'vase': 'florero', 'sports car': 'auto deportivo', 'car wheel': 'rueda de auto', 'minivan': 'camioneta', 'cab': 'taxi',
  'mountain bike': 'bicicleta de montaña', 'motor scooter': 'motoneta', 'school bus': 'autobús escolar', 'airliner': 'avión', 'teddy': 'oso de peluche',
  'soccer ball': 'balón de fútbol', 'basketball': 'balón de básquetbol', 'tennis ball': 'pelota de tenis', 'goldfish': 'pez dorado', 'hen': 'gallina', 'parrot': 'loro',
  'macaw': 'guacamaya', 'bee': 'abeja', 'ladybug': 'catarina', 'butterfly': 'mariposa', 'monarch': 'mariposa monarca', 'iguana': 'iguana', 'rabbit': 'conejo', 'hamster': 'hámster',
  'jigsaw puzzle': 'rompecabezas', 'comic book': 'cómic', 'menu': 'menú', 'web site': 'página web', 'joystick': 'control de videojuego', 'loudspeaker': 'bocina',
  'microphone': 'micrófono', 'headphone': 'audífonos', 'guitar': 'guitarra', 'acoustic guitar': 'guitarra acústica', 'electric guitar': 'guitarra eléctrica', 'piano': 'piano',
};
