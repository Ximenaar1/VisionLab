# VisiónLab

Recurso educativo web para aprender, paso a paso y jugando, cómo funciona el reconocimiento de patrones visuales con *machine learning*. Lo guía **Pixi**, un robot con ojo de cámara.

Proyecto de Taller de Investigación II — Ingeniería en Sistemas Computacionales, Instituto Tecnológico de Colima.
Título: *Reconocimiento de patrones visuales y aprendizaje automático para la interpretación de imágenes*.

## Versión actual: v1.0.0

| Módulo | Descripción |
|---|---|
| Bienvenida y perfil | Nombre o apodo, rango de edad, experiencia previa y ocupación (sin cuentas) |
| Examen inicial (pre-test) | 10 preguntas, sin retroalimentación, para medir la línea base |
| Camino de aprendizaje | 6 unidades, 12 lecciones que se desbloquean en orden |
| Unidad 0 · Lo básico | Qué es la IA, algoritmo, píxel, RGB (actividad interactiva de píxeles) |
| Unidad 1 · Patrones | Patrón, características, visión por computadora, reconocimiento de patrones |
| Unidad 2 · Aprendizaje automático | Datos, etiquetas, entrenamiento, modelo, sesgo |
| Unidad 3 · CNN | Redes neuronales, capas, convolución (actividad: filtro de bordes Sobel) |
| Unidad 4 · Pruébalo | Predicción y confianza; clasificación real con MobileNet v2 (foto o cámara) |
| Unidad 5 · Entrénalo | Aprendizaje por transferencia; clasificador propio de 2 clases con la cámara (k-NN sobre embeddings de MobileNet) |
| Examen final (post-test) | Mismas 10 preguntas; gráfica antes/después y código de resultados para Google Forms |
| Diccionario de Pixi | Cada término con explicación sencilla (“O sea…”) y definición formal |
| Logros | XP, estrellas por lección y 12 medallas |
| Perfil | Voz de Pixi (lectura en voz alta), sonidos, modo docente (desbloquea todo) y borrado de progreso |

Tipos de ejercicio: explicación con palabra clave, opción múltiple, verdadero/falso, ordenar pasos, emparejar y actividades interactivas.

## Tecnologías

- HTML5, CSS3 y JavaScript (sin frameworks)
- TensorFlow.js 4.22.0 y @tensorflow-models/mobilenet 2.1.1 (MobileNet v2, ImageNet)
- Web Speech API (voz), Web Audio API (sonidos), Canvas (filtro de bordes)
- PWA: `manifest.json` + `sw.js` (se puede instalar en el celular)
- GitHub Pages para la publicación

## Cómo ejecutar

- **En la computadora:** abrir la carpeta en VS Code y usar la extensión *Live Server* (botón “Go Live”).
- **Publicada:** subir el contenido de esta carpeta a un repositorio y activar GitHub Pages.
- **En el celular:** abrir la liga de GitHub Pages en Chrome → menú ⋮ → “Agregar a la pantalla principal”.

Se necesita internet la primera vez para descargar TensorFlow.js y el modelo. La cámara requiere `https` o `localhost`.

## Configurar el formulario de resultados

En `js/datos.js`, pegar la liga del Google Form en `const FORM_URL = '';`. El formulario solo necesita una pregunta de respuesta corta: “Pega tu código de resultados”.

Formato del código: `VL-XXXX | Edad | Exp (N/P/C) | Ocup (ISC/EST/OTR) | Inicial x/10 | Final x/10 | Lecciones | XP | Min`.

## Privacidad

Sin servidor ni base de datos. El progreso se guarda solo en el navegador del dispositivo (localStorage) y las imágenes nunca salen del navegador.

## Estructura

```
index.html          Estructura base y menú
css/estilos.css     Estilos y animaciones (incluye a Pixi)
js/datos.js         Contenido: lecciones, examen, diccionario, medallas, traducciones
js/pixi.js          Personaje Pixi (SVG animado)
js/ia.js            Modelo MobileNet, clasificador propio y filtro de bordes
js/app.js           Pantallas, motor de lecciones, progreso y resultados
manifest.json, sw.js, img/   Aplicación instalable (PWA)
```

## Limitaciones conocidas

- Las etiquetas de MobileNet vienen en inglés; se traducen más de 120 categorías frecuentes.
- MobileNet solo reconoce las 1,000 categorías de ImageNet.
- El progreso no se sincroniza entre dispositivos.
