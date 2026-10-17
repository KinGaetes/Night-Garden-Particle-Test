[Español](#espanol) · [Inglés](#english)

<a id="espanol"></a>

# Jardín nocturno · v7

Un pequeño experimento visual de portafolio: flores de líneas, anillos, chispas y estelas que aparecen sobre un fondo nocturno. Parte de una animación de floraciones efímeras y añade herramientas para explorar colores, formas, ritmos y composiciones. No pretende simular el crecimiento de plantas ni fenómenos físicos.

## Abrir

**Descarga la carpeta y abre `index.html`.** No requiere instalación, cuentas ni servidor. También puede publicarse directamente en GitHub Pages.

## Crear

- Toca o haz clic en el lienzo para crear una floración. Abre **Controles** para modificarla.
- Elige un estilo: Nocturno, Fuegos, Luz de luna, Ámbar o Herbario.
- Ajusta cantidad, tamaño, pétalos, dispersión, grosor y duración de las flores. La duración es un multiplicador de su vida original, no un número exacto de segundos.
- Activa o desactiva flores, anillos, chispas, estelas y destello central.
- Ajusta seis colores y su frecuencia relativa. Los pesos no necesitan sumar 100; al menos uno debe ser mayor que cero. Los efectos pueden tener colores propios o vincularse a la paleta.
- Usa emisión manual, automática o por pulsación sostenida y arrastre. El intervalo regula la emisión continua.
- Pausa para observar o exportar un instante. **Nuevo lienzo** borra la composición y reinicia el reloj; conserva los ajustes y el modo de emisión.

Los cambios de forma y color se aplican a las próximas floraciones; el fondo cambia inmediatamente. **Restablecer ajustes** recupera el estilo inicial sin borrar las flores existentes.

**Teclado:** espacio pausa o continúa; H abre o cierra los controles; Intro, con el lienzo enfocado, crea una floración central. Los controles también se pueden recorrer con Tab. Si el sistema solicita movimiento reducido, la aplicación comienza con una vista pausada. Al ocultar la pestaña, se suspende la simulación.

## Guardar y compartir

- **Guardar preset:** descarga los ajustes en JSON y, cuando el navegador lo permite, los recuerda para la próxima visita. Solo se recuerda el último preset guardado; los archivos descargados permiten conservar otros.
- **Guardar escena:** descarga un JSON con las posiciones, los tiempos, las semillas y los ajustes de cada floración. Usa **Importar JSON** para recuperar una escena o un preset.
- **Reproducir:** vuelve a ejecutar la composición desde el principio y se pausa al llegar al final registrado. **Deshacer floración** elimina la última y reconstruye el lienzo.
- **PNG:** captura el lienzo actual, sin controles, con el fondo incluido.
- **WebM:** graba los próximos seis segundos del lienzo, sin audio ni controles. Puede detenerse antes. La grabación requiere un navegador compatible con MediaRecorder y WebM; al ocultar la pestaña, termina.
- **HTML autónomo:** descarga una reproducción en bucle que funciona por sí sola, sin los archivos del editor. Se pausa o continúa con un clic o espacio; respeta la preferencia de movimiento reducido.

Cada composición admite hasta **60 segundos y 600 floraciones**, con un intervalo mínimo de ocho pasos de simulación entre floraciones. La simulación utiliza pasos fijos de 1/60 s y semillas independientes. Los elementos activos se limitan a 1400 y los grupos a 36; al alcanzar estos límites, se retiran primero los grupos más antiguos.

La repetición conserva la secuencia y los ajustes. El encuadre se adapta a la pantalla: las posiciones son relativas y la escala depende de su lado menor. Una pantalla con otra proporción cambia la distribución visual; las floraciones próximas al borde pueden quedar recortadas. El renderizado puede variar ligeramente entre navegadores. Bajo carga alta, el reloj visual puede avanzar más despacio que el tiempo real.

## Archivos

```text
index.html
css/styles.css
js/
  config.js       Ajustes, estilos y validación
  effects.js      Las cinco familias de efectos
  engine.js       Lienzo, pasos fijos y límites de carga
  i18n.js         Lectura del CSV y traducción
  exports.js      PNG, WebM, JSON y HTML autónomo
  app.js          Controles, entrada y composición
locales/
  translations.csv
  translations.generated.js
tools/
  translations.html
README.md
```

## Idiomas

La interfaz admite español, inglés, chino y japonés. Detecta el idioma del navegador y permite elegir otro. Los textos están identificados en `locales/translations.csv`: la primera columna es `text_id`, seguida de `es`, `zh`, `en` y `ja`. Conserva el archivo en UTF-8 y mantén los identificadores y los marcadores como `{seconds}`.

GitHub Pages lee el CSV directamente. Para abrir `index.html` desde el disco se incluye `translations.generated.js`, una copia codificada del mismo CSV que evita las restricciones del navegador al leer archivos locales.

Después de editar el CSV, abre **`tools/translations.html`**, selecciona el CSV actualizado y reemplaza `locales/translations.generated.js` por el archivo descargado. No hace falta usar una terminal. Conserva ambos archivos al subir el proyecto.

## Alcance

Hecho con HTML, CSS, JavaScript y Canvas 2D, sin bibliotecas externas ni backend. Los archivos importados se procesan en el navegador. Los presets y la preferencia de idioma usan almacenamiento local cuando está disponible; las escenas se conservan mediante los JSON descargados.

La v7 mantiene las formas visuales de la v6 y añade edición, persistencia y exportación. Herbario prolonga las flores; no las vuelve permanentes. Es un proyecto experimental: composiciones densas, muchos pétalos o grabaciones pueden exigir más recursos, especialmente en móviles.

---

<a id="english"></a>

# Night Garden · v7

A small visual portfolio experiment: line-drawn flowers, rings, sparks and curled trails against a nocturnal background. It expands an animation of fleeting blooms with tools for exploring colors, shapes, rhythms and compositions. It does not attempt to simulate plant growth or physical phenomena.

## Open

**Download the folder and open `index.html`.** No installation, accounts or server required. It can also be published directly on GitHub Pages.

## Create

- Tap or click the canvas to create a bloom. Open **Controls** to adjust it.
- Choose a style: Nocturne, Fireworks, Moonlight, Amber or Herbarium.
- Adjust flower count, size, petals, spread, line width and lifetime. Lifetime multiplies the original lifespan; it is not an exact number of seconds.
- Enable or disable flowers, rings, sparks, trails and the central flash.
- Adjust six colors and their relative frequencies. Weights need not add up to 100; at least one must be greater than zero. Effects can use their own colors or follow the palette.
- Use manual, automatic or hold-and-drag emission. The interval controls continuous emission.
- Pause to inspect or export a frame. **New canvas** clears the composition and resets its clock while keeping the settings and emission mode.

Shape and color changes affect the next blooms; the background updates immediately. **Reset settings** restores the initial style without clearing existing flowers.

**Keyboard:** Space pauses or resumes; H opens or closes the controls; Enter creates a centered bloom when the canvas has focus. Controls also support Tab navigation. If the system requests reduced motion, the application starts with a paused preview. Hiding the tab suspends the simulation.

## Save and share

- **Save preset:** downloads settings as JSON and remembers them for the next visit when browser storage is available. Only the last saved preset is remembered; downloaded files let you keep others.
- **Save scene:** downloads JSON containing each bloom’s position, time, seed and settings. Use **Import JSON** to restore a scene or preset.
- **Replay:** runs the composition from the beginning and pauses at its recorded endpoint. **Undo bloom** removes the last bloom and rebuilds the canvas.
- **PNG:** captures the current canvas without controls, including the background.
- **WebM:** records the next six seconds of the canvas without audio or controls. Stop early if desired. Recording requires a browser supporting MediaRecorder and WebM; hiding the tab ends it.
- **Standalone HTML:** downloads a looping playback that works independently of the editor files. Click or press Space to pause or resume; it respects the reduced-motion preference.

Each composition supports up to **60 seconds and 600 blooms**, with at least eight simulation steps between blooms. The simulation uses fixed 1/60 s steps and independent seeds. Active elements are limited to 1400 and groups to 36; the oldest groups are removed first when these limits are reached.

Replay preserves the sequence and settings. Framing adapts to the screen: positions are relative and scale follows the shorter side. A different aspect ratio changes the visual layout; blooms near an edge may be cropped. Rendering may vary slightly between browsers. Under heavy load, the visual clock may advance more slowly than real time.

## Files

```text
index.html
css/styles.css
js/
  config.js       Settings, styles and validation
  effects.js      The five effect families
  engine.js       Canvas, fixed steps and load limits
  i18n.js         CSV loading and translation
  exports.js      PNG, WebM, JSON and standalone HTML
  app.js          Controls, input and composition
locales/
  translations.csv
  translations.generated.js
tools/
  translations.html
README.md
```

## Languages

The interface supports Spanish, English, Chinese and Japanese. It detects the browser language and lets you choose another. Text lives in `locales/translations.csv`: the first column is `text_id`, followed by `es`, `zh`, `en` and `ja`. Keep the file in UTF-8 and preserve identifiers and placeholders such as `{seconds}`.

GitHub Pages reads the CSV directly. Opening `index.html` from disk uses `translations.generated.js`, an encoded copy of that CSV which avoids browser restrictions on reading local files.

After editing the CSV, open **`tools/translations.html`**, select the updated CSV and replace `locales/translations.generated.js` with the downloaded file. No terminal is needed. Keep both files when uploading the project.

## Scope

Built with HTML, CSS, JavaScript and Canvas 2D, without external libraries or a backend. Imported files are processed in the browser. Presets and language preferences use local storage when available; scenes are kept through downloaded JSON files.

Version 7 retains the visual forms of v6 and adds editing, persistence and export. Herbarium extends flower lifetimes without making them permanent. This is an experimental project: dense compositions, many petals or recordings can require more resources, especially on mobile devices.
