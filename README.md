# Proyecto `pagina`

El backend fue movido a la carpeta `backend/` para separar frontend y backend.

# Proyecto `pagina`

Pequeña página web con un backend en Node/Express que sirve una API de productos.

Contenido
- Frontend: `pagina.html`, `estilos.css` y las imágenes en la raíz del proyecto.
- Backend: la carpeta `backend/` contiene `server.js` y los datos en `backend/data/products.json`.

Requisitos
- Node.js 14+ (recomendado 16+)

Instalación y ejecución

1) Frontend (local, sin servidor web)
- Simplemente abre `pagina.html` en tu navegador: haz doble clic o usa "Abrir con".

2) Backend (sirve la API y puede servir los archivos estáticos relativos)
- Abre una terminal y ve a la carpeta `backend`:

```powershell
cd 'C:\Users\Valentina\Downloads\pagina\backend'
```

- Instala dependencias:

```powershell
npm install
```

- Ejecuta el servidor (script definido en `package.json`):

```powershell
npm run start
# o para desarrollo con reinicio automático si instalaste dependencias dev:
npm run dev
```

- Por defecto el servidor arranca en http://localhost:3000 y expone la API y (si lo configuras) archivos estáticos. Puedes acceder desde el navegador a:

- http://localhost:3000/api/products  → lista de productos
- http://localhost:3000/api/products/:id  → detalle de producto (reemplaza :id)

Estructura del proyecto

```
pagina/
├─ backend/
│  ├─ server.js
│  ├─ package.json
│  └─ data/products.json
├─ pagina.html
├─ estilos.css
├─ IMG1.jfif
└─ README.md
```

Notas y recomendaciones
- Hay un `.gitignore` incluido para evitar subir `node_modules` y archivos grandes.
- Si deseas publicar sólo el frontend, puedes usar GitHub Pages (sitio estático). Para usar el backend en producción considera una plataforma como Heroku, Render o Vercel (con configuración para Node).
- Si necesitas manejar imágenes grandes en Git, considera Git LFS.

Licencia
- MIT (revisa `backend/package.json` que tiene `license: MIT`).

Contacto
- Si necesitas que añada instrucciones adicionales (deploy, CI/CD o detalles de API), dime y lo añado.
