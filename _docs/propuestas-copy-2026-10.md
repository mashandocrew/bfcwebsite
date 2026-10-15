# Propuestas de copy para aplicar a mano

Fecha: 15/10/2026. Estado del sitio: rama `claude/charming-dirac-uyv86k` (PR #3, Fase 1 de la auditoría).

## Cómo usar este documento

- Cada fila trae el texto **tal como está hoy**. Se busca con Ctrl+F en el archivo de cada página. No hay números de línea porque cambian.
- **Casi todo el texto está dos veces**: en el HTML y en `assets/js/i18n.js` (bloque `es:`). **El cambio va en los dos lugares**; si solo se cambia el HTML, el JS lo pisa al cargar. Si se quiere, también en los bloques `en:` y `pt:`.
- **[CONFIRMAR]**: dato no verificado. Si no es cierto, se borra; no se publica tal cual.
- **⚠️ FAQ**: si se cambia una pregunta o respuesta del FAQ, hay que cambiar también el `FAQPage` del JSON-LD en el `<head>` de `index.html`, con el texto idéntico.
- **Ya aplicado en la Fase 1** (no repetir): title y meta description de la home y de Tapa Team; numeración de secciones (Contacto pasó a 10); © 2026; «¿Sin horario?» con signo de apertura; títulos de Tonga, línea de tiempo y bullets de profesores ahora también en el HTML.
- **Ya aplicado el 15/10/2026** (datos confirmados por el club; no repetir): 2 clases de prueba gratis (FAQ y Tapa Team); horario de Tapa Team (lun, mié y vie de 20:00 a 21:30) en la home, en Tapa Team y en el FAQ; tres preguntas nuevas del FAQ (cuota, edad mínima, qué llevar); «4,9 ★ en Google · 112 reseñas»; el párrafo de la pandemia, reescrito con la fuente real (nota de El Sol, 16/08/2020) y su link. Las filas de este documento sobre esos puntos ya no hacen falta.
- Trato: el sitio vosea («Elegí», «Escribinos», «Reservá»). Todas las propuestas mantienen el voseo.

---

## 1. Una descripción fija por disciplina

Usar siempre la misma en las tarjetas de la home, en Tapa Team, en el Perfil de Google y en redes.

| Disciplina | Descripción fija |
|---|---|
| K1 Kickboxing | Golpes de puño, patadas y rodillas con reglas K1. Clases con Walter Bonati y Gastón «Tonga» Silva, de lunes a viernes, de 08:30 a 22:00. |
| Muay Thai | Boxeo tailandés: puños, codos, rodillas, patadas y clinch. Mismos profesores y mismos horarios que K1. |
| MMA | Artes marciales mixtas con Tapa Team: golpes, derribos, control y suelo. Para iniciantes y competidores, desde los 12 años. [CONFIRMAR horario] |
| Wrestling | Lucha olímpica y grappling con Tapa Team: derribos y control en el suelo. Base para MMA. [CONFIRMAR horario] |

## 2. Una sola promesa de prueba y de respuesta [CONFIRMAR]

Hoy el sitio promete:
- Home, contacto: «Reservá 2 clases de prueba gratuitas.»
- Tapa Team: «Clase de prueba / Gratis» (una sola).
- Tapa Team: «Nos mandás un mensaje y arreglamos tu primera clase hoy mismo.»
- Horarios: «¿Sin horario? Escribinos y armamos uno.»

Propuesta (elegir el número real de clases):
- **Corta (botones y stats):** «Primera clase gratis» o «2 clases de prueba gratis».
- **Larga (FAQ y contacto):** «La primera clase [o las dos primeras] es gratis. Escribinos por WhatsApp y te respondemos el mismo día para coordinar el horario.» [CONFIRMAR que responden en el día]

## 3. Párrafo de entidad

Va en la sección Historia, en lugar del primer párrafo («Walter Bonati fundó el club desde la pasión…»), o como primer párrafo de Contacto. Es la oración que las IA citan textual.

> Bonati Fight Club es una academia de deportes de combate en Godoy Cruz, Mendoza, fundada en 2010 por Walter Bonati. Está en Balcarce 230 y da clases de lunes a viernes, con turnos de mañana, tarde y noche. Enseña K1 Kickboxing y Muay Thai con Walter Bonati y Gastón «Tonga» Silva, campeón sudamericano FFG en 2025, y MMA y Wrestling con Tapa Team, el equipo que funciona en el club desde 2025. Recibe desde principiantes hasta competidores, y la primera clase se coordina por WhatsApp.

## 4. Cambios por página

### Home (`index.html` + `assets/js/i18n.js`)

| Texto actual (buscalo con Ctrl+F) | Propuesta | Por qué |
|---|---|---|
| `Donde se forjan los campeones del kickboxing sudamericano.` (subtítulo del hero, clave `hero.sub`) | `Kickboxing K1, Muay Thai y MMA en Godoy Cruz, Mendoza. Desde 2010.` | El H1 es solo la marca: Google y las IA no ven qué hace el club ni dónde en el primer pliegue. El eslogan sigue en la cinta animada y en og:title. |
| H1 `Bonati` / `Fight` / `Club` | Mantener el diseño. Opción: agregar una cuarta línea chica dentro del H1: `Kickboxing en Godoy Cruz` | H1 sin keyword (🔴 en la auditoría). Si se prefiere no tocar el H1, alcanza con el cambio de la fila anterior. |
| `15` + `Años formando atletas` (contador, `counters.years`) | `2010` + `Año de fundación` (cambiar también `data-target="15"` a `data-target="2010"`) | Dato que envejece: en 2026 ya son 16 años. |
| `300` + `Alumnos activos` | [CONFIRMAR la cifra real]. Si no se puede sostener, cambiar por `5` + `Títulos de Tonga`. | Cifra redonda sin fuente. |
| `Cuatro disciplinas, una sola filosofía: disciplina, respeto y voluntad para competir al más alto nivel.` | `K1, Muay Thai, MMA y Wrestling. Grupos para quien empieza y para quien compite.` | Tríada y frase de póster; no dice nada que ayude a decidir. |
| `Técnica de golpeo japonés que combina boxeo con patadas. Ritmo, explosividad y precisión.` | Descripción fija de K1 (§1). | Tríada de cierre. |
| `Boxeo tailandés: puños, codos, rodillas y patadas. La disciplina más completa de pie.` | Descripción fija de Muay Thai (§1). | «La más completa» es una opinión que molesta a quien hace K1 en el mismo club. |
| `Artes marciales mixtas y lucha. El futuro del combate completo en Mendoza.` | `Artes marciales mixtas y lucha con Tapa Team, en el club desde 2025.` | Grandilocuencia. |
| `Quince años <b>forjando leyendas</b> en Cuyo.` | `Desde 2010 <b>en Godoy Cruz.</b>` | Dato que envejece; «leyendas» es grandilocuencia. |
| `Walter Bonati fundó el club desde la pasión, con un objetivo claro…` (reemplaza todo el párrafo) | Párrafo de entidad (§3). | «Pasión», «una de las academias más reconocidas de Argentina» sin fuente. |
| `Durante la pandemia (2020–2021) fue reconocida entre las academias destacadas de Mendoza…` (reemplaza todo el párrafo) | [CONFIRMAR quién la reconoció]. Si hay nota o institución: `En 2021, [medio o institución] la destacó por seguir dando clases durante la pandemia.` con link. Si no, borrar la primera oración y dejar: `Hoy enseña K1 y Muay Thai, y a través de Tapa Team, MMA y Wrestling.` | Afirmación sin fuente. |
| `Aquí en Bonati prevalece la decisión de hacer las cosas.` (aparece 2 veces: cita de Historia y tarjeta de Walter) | Dejarla en una sola (la tarjeta de Walter). En Historia, usar otra cita real de Walter o quitar el bloque. | Repetición. |
| `Más de 15 años de coaching profesional` | `Entrena peleadores desde 2010` | Dato que envejece. |
| `El equipo de MMA y Wrestling que opera dentro de BFC. Fundado hace aproximadamente un año y ya compite en eventos locales y nacionales — el futuro de las artes marciales mixtas mendocinas.` | `El equipo de MMA y Wrestling de Bonati Fight Club. Nació en 2025 y ya compite en [nombres de eventos, CONFIRMAR].` | Dato que envejece, raya, grandilocuencia. |
| `Lo que dice <b>nuestra comunidad.</b>` | `Reseñas de <b>alumnos.</b>` + debajo: `[nota] ★ en Google ([N] reseñas)` [CONFIRMAR] | Título genérico; la cifra de Google es la prueba social que convence. |
| `Estamos en el corazón de Godoy Cruz. Reservá 2 clases de prueba gratuitas.` | `Balcarce 230, Godoy Cruz, a [referencia conocida, CONFIRMAR]. [Promesa unificada de §2].` | «El corazón de» es vago; una referencia sirve para llegar. |
| `Desde 2010 formando atletas de élite en el corazón de Godoy Cruz, Mendoza.` (footer, `footer.tag`) | `Academia de K1, Muay Thai, MMA y Wrestling en Balcarce 230, Godoy Cruz, Mendoza. Desde 2010.` | «Atletas de élite»; el footer es buen lugar para el NAP completo. |
| `Síguenos` (footer, `footer.h3`; también en `tapa-team/index.html` y `store/index.html`) | `Seguinos` | Tuteo en un sitio que vosea. |
| `Desliza para descubrir` (`hero.scroll` en i18n) | `Deslizá para ver más` | Tuteo. |
| `Sé el primero en subir una foto de la comunidad.` (`comm.empty` en i18n) | `Subí la primera foto de la comunidad.` | Tuteo. |

**FAQ (⚠️ cambiar también el `FAQPage`).** Agregar estas preguntas, que hoy ninguna IA puede responder sobre el club:

| Pregunta nueva | Respuesta propuesta |
|---|---|
| ¿Cuánto cuesta la cuota? | `[Desde $… por mes / Consultá por WhatsApp; el precio depende de cuántas veces por semana entrenes.]` [CONFIRMAR] |
| ¿Desde qué edad se puede entrenar? | `Desde los 12 años en MMA y Wrestling. En K1 y Muay Thai, desde los [N] años.` [CONFIRMAR] |
| ¿Qué tengo que llevar a la primera clase? | `Ropa cómoda, agua y toalla. [Los guantes te los prestamos la primera vez / Necesitás vendas y guantes.]` [CONFIRMAR] |
| ¿La clase de prueba es gratis? | Promesa unificada de §2. |

### Tapa Team (`tapa-team/index.html`)

Esta página no usa i18n para el contenido: el cambio va solo en el HTML.

| Texto actual (buscalo con Ctrl+F) | Propuesta | Por qué |
|---|---|---|
| `<h1>MMA. <br>Wrestling. <b>Sin filtros.</b></h1>` | `<h1>MMA y Wrestling <br>en Godoy Cruz. <b>Sin filtros.</b></h1>` | H1 sin zona; se mantiene el remate. |
| `El equipo de MMA y Wrestling que opera dentro de Bonati Fight Club. Fundado hace aproximadamente un año, ya compite en eventos locales y nacionales. El futuro de las artes marciales mixtas mendocinas.` | `El equipo de MMA y Wrestling de Bonati Fight Club, en Balcarce 230, Godoy Cruz. Nació en 2025 y ya compite en [eventos, CONFIRMAR].` | Dato que envejece, grandilocuencia. |
| `Desde locales hasta nacionales. Tapa Team prepara atletas que ya suben a octágonos en todo el país — y apuntamos a Sudamérica.` | `Nuestros peleadores compiten en [evento 1] y [evento 2] [CONFIRMAR]. El objetivo para 2027: [objetivo concreto].` | «Todo el país» sin datos; raya. |
| `Podés empezar sin experiencia previa. Tenemos clases escalonadas para iniciantes, intermedios y competidores. Lo único que pedimos es disciplina y compromiso.` | `Podés empezar sin experiencia previa. Hay grupos para iniciantes, intermedios y competidores. Traé ropa cómoda y agua [CONFIRMAR qué más].` | «Disciplina y compromiso» es fórmula; mejor decir qué hace falta llevar. |
| Stat `Entrenamientos` / `Semanales` | Días reales: p. ej. `LUN · MIÉ · VIE` / `Días` [CONFIRMAR] | Stat vacío. **Además, falta el horario de MMA en todo el sitio**: agregar una tarjeta de horarios como la de la home. |
| `Contamos con turnos especiales para niños a partir de 12 años.` | `Turnos para chicos desde los 12 años: [días y horario, CONFIRMAR].` | «Niños» con 12 años suena raro; falta el horario. |
| `Nos mandás un mensaje y arreglamos tu primera clase hoy mismo.` | Promesa unificada de §2. | Promesa distinta a la de la home. |
| `© 2026 Bonati Fight Club · Tapa Team · Godoy Cruz, Mendoza` | Sin cambios. | Ya corregido. |

### Tienda (`store/index.html`), para cuando se reactive

| Texto actual | Propuesta | Por qué |
|---|---|---|
| `Shorts, camisetas, abrigos y equipamiento oficial. Hecho por luchadores, para luchadores. Hacé tap en un producto y te lo reservamos por WhatsApp.` | `Shorts, remeras, buzos y equipamiento de Bonati Fight Club. Elegí el producto y te lo reservamos por WhatsApp. Retiro en Balcarce 230, Godoy Cruz [CONFIRMAR envíos].` | «Hecho por luchadores, para luchadores» es fórmula; falta cómo se entrega. |
| «📷 CARGAR» y precio «Consultar» en los 14 productos | Fotos reales y precio en `admin/products.json` antes de quitar el `noindex`. | Texto interno visible. |

## 5. Datos para confirmar con el club

**Home**
- [ ] ¿1 o 2 clases de prueba gratis? ¿En todas las disciplinas?
- [ ] Cantidad real de alumnos activos.
- [ ] Quién reconoció al club durante la pandemia (medio, municipio, federación) y el link.
- [ ] Nota y cantidad de reseñas en el Perfil de Google.
- [ ] Referencia conocida cerca de Balcarce 230.
- [ ] Cuota mensual o precio orientativo; edad mínima en K1 y Muay Thai; qué llevar; si prestan guantes.

**Tapa Team**
- [ ] Días y horarios de MMA, Wrestling y del turno para chicos desde 12 años.
- [ ] Eventos en los que compitieron (nombre, ciudad, año) y resultados.
- [ ] Objetivo concreto del equipo (circuito, torneo, fecha).

**Tienda**
- [ ] Fotos y precios de los 14 productos; si hacen envíos.
