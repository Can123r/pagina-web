# Guía para ejecutar y publicar Daco Arts

## Qué hay en la carpeta

- `src/` contiene los componentes React y los estilos que se editan.
- `public/` contiene imágenes y archivos que usa la página.
- `package.json` y `package-lock.json` describen las herramientas del proyecto.
- `dist/` se genera al compilar. Esa es la carpeta lista para subir a un hosting estático.

La web es una página React + Vite. El selector Nequi / Bre-B / transferencia muestra una propuesta de pago y no procesa transacciones ni crea pedidos.

## Ver la web en tu computador

1. Instala Node.js LTS si todavía no está instalado. En PowerShell, comprueba con `node --version` y `npm --version`.
2. Abre PowerShell y entra a la carpeta del proyecto:

   ```powershell
   cd "C:\Users\chuqu\Videos\codex\GIT\PAGINA WEB\Daco Arts React"
   ```

3. La primera vez, descarga/instala las dependencias del proyecto:

   ```powershell
   npm ci
   ```

4. Inicia el modo de edición local:

   ```powershell
   npm run dev
   ```

5. Abre la dirección que indique Vite (normalmente `http://localhost:5173`). Guarda cambios en `src/` para verlos actualizarse. Para detener el servidor, pulsa `Ctrl+C` en PowerShell.

## Crear y revisar la versión publicada

1. En PowerShell, desde la carpeta del proyecto, ejecuta:

   ```powershell
   npm run build
   ```

2. Vite crea o actualiza `dist/` con HTML, CSS, JavaScript e imágenes optimizados.
3. Revisa la versión compilada localmente:

   ```powershell
   npm run preview
   ```

4. Abre `http://localhost:4173` y revisa escritorio, móvil, los enlaces, imágenes y precios. `preview` sirve para revisar la compilación en tu computador, no para alojar permanentemente el sitio.

## Publicarla gratis con Netlify Drop

1. Crea o abre tu cuenta en [Netlify](https://app.netlify.com/).
2. Entra a [Netlify Drop](https://app.netlify.com/drop).
3. Arrastra **la carpeta `dist`** desde `PAGINA WEB\Daco Arts React\dist` a la zona de publicación. No subas `node_modules` ni la carpeta fuente completa.
4. Espera la publicación y abre la dirección `*.netlify.app` que te entrega Netlify.
5. Guarda el proyecto en tu cuenta para administrar el sitio y compartir el enlace.
6. Para publicar cambios después, edita el proyecto fuente, vuelve a ejecutar `npm run build` y arrastra el nuevo `dist` a la sección de despliegues del mismo sitio.

Para automatizar futuras publicaciones, se puede conectar el proyecto fuente a un repositorio Git y Netlify. La configuración de compilación es `npm run build` y la carpeta de publicación es `dist`.

## Antes de vender desde la web

- Confirma que nombres, fotos, existencias, precio y condiciones de entrega estén correctos.
- Proporciona los datos receptores oficiales y autoriza si van a mostrarse públicamente.
- Conecta un sistema seguro de pedidos/pago o define un canal de contacto verificable. El sitio actual no notifica pedidos, no verifica transferencias y no debe mostrar un pago como confirmado.
- Completa y publica aviso de privacidad, entrega, cambios y devoluciones antes de recoger datos de clientes.
