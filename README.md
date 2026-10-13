# Daco Arts — propuesta web

Prototipo responsive en React + Vite para Daco Arts. La composición editorial toma como referencia la portada cinematográfica, navegación minimalista, imágenes protagonistas y bloques de catálogo de Balenciaga; la dirección visual ahora se basa en el universo submarino de **¿Madaquecua?**.

## Ejecutar

```bash
npm install
npm run dev
```

## Alcance de esta propuesta

- El contexto del catálogo y el material visual de referencia están registrados en [`CATALOGO.md`](./CATALOGO.md), a partir del documento base de Daco Arts, la carpeta `PAGINA WEB` y las confirmaciones del fundador.
- El primer título publicado se escribe **¿Madaquecua?**. La imagen submarina compartida se conserva como arte editorial de la página.
- El catálogo también contempla Rampalago, juego viajero confirmado por el fundador; **¿Me le parecí?**, nombre confirmado por el fundador; y Stop, en desarrollo avanzado según el documento base. Sus mecánicas, imágenes, disponibilidad y detalles de venta se muestran solo cuando están respaldados por material confirmado.
- Las ubicaciones son puntos mencionados para Entretenimiento Mental; no se les atribuye horario ni disponibilidad.
- `public/madaquecua-world.png` es la imagen de referencia compartida por el fundador y se usa en la portada y secciones editoriales.
- La narrativa visual interpreta los objetos visibles en esa imagen: una llave, un búho, un mono, un ancla y un cofre bajo el agua. Las reglas y mecánicas del juego siguen pendientes de confirmar.
- La sección de cómo se juega es una adaptación inicial de la dinámica de observación y reacción descrita por el fundador como semejante a *Ghost Blitz*. Confirmar el reglamento, las cartas, la puntuación, el número de jugadores y la edad recomendada contra el juego físico antes de publicar.
- La colaboración de venta se presenta como exclusiva por ahora porque así lo indicó el fundador. Las tiendas Palatino 222 y Bulevar 245 aparecen en el sitio de Entretenimiento Mental; confirmar inventario antes de promocionar disponibilidad.
- El formulario de novedades es solo una interacción de demostración; no guarda ni envía datos. Debe conectarse a un proveedor antes de publicarse.
- El precio indicado para ¿Madaquecua? es $80.000 COP, confirmado por el fundador. La sección de pago sigue siendo informativa hasta conectar destinos oficiales, disponibilidad, entrega y un backend seguro.

## Referencias consultadas

- [Tienda en línea de Entretenimiento Mental](https://www.entretenimientomental.com/)
- [Geistesblitz / Ghost Blitz — Zoch Verlag](https://www.zoch-verlag.com/zoch_en/brands/geistesblitz/geistesblitz-601129800-en.html)
- [Reglamento de Ghost Blitz — Asmodee](https://cdn.svc.asmodee.net/production-asmodeeca/uploads/2025/10/601129800_Geistesblitz_Rules-online_DE-EN-FR-IT.pdf)

## App complementaria

La PWA instalable **DACO Arts Arcade**, que reúne Madaquecua y Penta, está en [`madaquecua-app/`](./madaquecua-app/). Se publica por separado como Static Site; consulta su README para compilarla en Seenode.
