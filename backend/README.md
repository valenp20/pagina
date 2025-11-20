# Backend (carpeta `backend`)

Este backend sirve los assets estáticos de la carpeta padre (la raíz del proyecto) y expone la API de productos.

Instrucciones (PowerShell):

```powershell
cd "C:\Users\Valentina\Desktop\pagina\backend"

# Instalar dependencias
npm install

# Arrancar el backend
npm run start

# Probar la API desde otro PowerShell
Invoke-RestMethod -Uri http://localhost:3000/api/products

# Abrir la página en el navegador
# http://localhost:3000/pagina.html
```
