# DACO Arts Arcade

PWA instalable hecha con React y Vite. DACO Arts Arcade reúne Madaquecua y Penta en una interfaz arcade inspirada en Tetris y juegos de bloques. La aplicación no usa cuentas ni backend: guarda perfiles, partidas, retos completados y mejores tiempos en `localStorage` del teléfono o navegador actual. Al borrar los datos del navegador, se borran esos registros.

## Desarrollo en Visual Studio Code

1. Abre esta carpeta en VS Code.
2. Usa Node.js 20.19+ o 22.12+.
3. En el terminal integrado ejecuta `npm install`.
4. Ejecuta `npm run dev` y abre la dirección local que muestra Vite.
5. Para producir los archivos estáticos, ejecuta `npm run build`; Vite crea `dist/`.

## Publicación en Seenode como Static Site

Conecta el repositorio Git cuando esté publicado y crea un servicio **Static Site** con estos valores:

- **Root directory:** `madaquecua-app`
- **Build command:** `npm install && npm run build`
- **Publish/output directory:** `dist`
- **Runtime:** no necesita servidor ni variables de entorno.

El sitio debe publicarse bajo la raíz de un dominio (o configurar `base` en Vite si se sirve bajo una subruta). El service worker y la instalación PWA requieren HTTPS, que debe servir el dominio de Seenode. La app se puede instalar desde el menú del navegador; los permisos de notificación varían por navegador. La alarma dentro de la pantalla se genera con Web Audio.

## Modos

- **Un jugador:** reto visual de 60 segundos basado en las cinco figuras indicadas en el reglamento, con cuenta regresiva, alarma al terminar y pantalla roja. Los ejercicios generados son práctica de observación; no replican cartas físicas.
- **Multijugador:** perfiles locales, registro del ganador y monedas de cada carta, editor de valores, historial de rondas y ranking con posiciones empatadas.
- **Penta:** al entrar, abre el primer reto con instrucciones y tablero visible. Desde el juego se accede a los niveles. La bandeja de fichas aparece debajo de la cuadrícula; puedes arrastrar una ficha o tocarla y luego tocar su destino. Incluye controles para girar y voltear, cronómetro y mejor tiempo local. Los tableros usan el número de fichas leído en cada tarjeta; algunas detecciones desde el PDF deben cotejarse visualmente con el manual.

Los valores predeterminados 1–4 son ejemplos editables, no una transcripción completa de las cartas. El reglamento físico indica que el valor está en la esquina de cada carta. Las reglas clásicas también nombran una excepción de robo para cartas de cuatro monedas; esta app registra ganador y valor, sin automatizar esa excepción porque se resuelve sobre las cartas físicas.

## Material reutilizado

`public/madaquecua-cover.png`, `public/madaquecua-personajes.png` y `public/madaquecua-monedas-referencia.png` provienen de los recursos existentes de Daco Arts. No se copia el contenido de otros repositorios ni se modifica la web corporativa.
\n\n## App complementaria\n\nLa PWA de acompañamiento está en [madaquecua-app/](./madaquecua-app/). Se construye y publica por separado como sitio estático; consulta su README para los valores de Seenode.\n
