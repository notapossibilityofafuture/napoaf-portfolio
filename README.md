# Pixter Portfolio (React + Vite)

Migración de tu portafolio de HTML/CSS/JS puro a **React + Vite**, manteniendo
todas las animaciones (anime.js), el modal de The Undergrove, el copy-to-clipboard
de Discord, el fondo de píxeles animado, y el selector de idioma (English / Español).

## Estructura

```
pixter-portfolio/
├── index.html              ← punto de entrada de Vite
├── package.json
├── vite.config.js
├── public/                 ← ⚠️ PON AQUÍ TUS IMÁGENES (ver abajo)
│   ├── pixter.png
│   ├── favicon.png
│   ├── undrtownnight.png
│   └── undrlogoextended.png
└── src/
    ├── main.jsx             ← rutas /en y /es con react-router
    ├── App.jsx               ← orquesta toda la página
    ├── data/content.js       ← TODO el texto en inglés y español, en un solo lugar
    ├── components/
    │   ├── Header.jsx
    │   ├── Hero.jsx
    │   ├── ExperienceMenu.jsx
    │   ├── AboutSection.jsx
    │   ├── ProjectsSection.jsx
    │   ├── ProjectModal.jsx
    │   ├── Footer.jsx
    │   └── PixelField.jsx    ← el canvas de fondo animado
    ├── hooks/
    │   └── useMotionLayer.js ← toda la animación de anime.js
    └── styles/index.css      ← CSS idéntico al original
```

## ⚠️ Antes de correrlo: sube tus imágenes

Copia estos 4 archivos dentro de la carpeta `public/` (con esos nombres exactos):

- `pixter.png`
- `favicon.png`
- `undrtownnight.png`
- `undrlogoextended.png`

## Cómo correrlo localmente

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` — te redirige automáticamente a `/en`.
Cambia a español visitando `/es` o usando el botón "Español" del sitio.

## Cómo generar el build de producción

```bash
npm run build
```

Esto genera la carpeta `dist/` lista para subir a cualquier hosting estático.

## Desplegar en Cloudflare Pages

1. Sube este proyecto a un repositorio de GitHub (o GitLab).
2. En **dash.cloudflare.com** → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Selecciona el repositorio.
4. Configuración de build:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Deploy. Cloudflare te da una URL tipo `tuproyecto.pages.dev`.
6. Para usar tu dominio propio: en el proyecto de Pages → **Custom domains** → agrega tu dominio (debe estar ya en tu cuenta de Cloudflare con el DNS gestionado ahí).

### Nota sobre las rutas /en y /es

Como usamos `react-router-dom` con rutas del lado del cliente, en Cloudflare Pages
necesitas asegurarte de que las rutas que no son archivos redirijan a `index.html`.
Crea un archivo `public/_redirects` con esta línea:

```
/*    /index.html   200
```

Esto ya evita errores 404 al entrar directo a `tuweb.com/es`.

## Qué se mantuvo igual

- Todas las animaciones de anime.js: entrada del hero, texto "pixter" animado,
  reveals al hacer scroll, contadores animados, botones magnéticos, badges con
  hover, y el efecto scramble en "The Undergrove SMP".
- El fondo de canvas con píxeles ambientales y el rastro de píxeles del cursor.
- El modal de The Undergrove con el tráiler embebido de YouTube.
- Los colores por proyecto (azul, morado, negro) y la etiqueta "Former Project" / "Proyecto anterior".
- El botón de copiar usuario de Discord.

## Qué cambió (mejoras de la migración)

- El contenido en inglés y español ahora vive en **un solo archivo** (`src/data/content.js`),
  así que ya no hay que mantener dos HTMLs sincronizados a mano — cambias el texto
  una vez y aplica a ambos.
- Cada sección es un componente independiente, más fácil de editar o reordenar.
- El cambio de idioma ahora es una ruta real (`/en`, `/es`) en vez de dos archivos separados.
