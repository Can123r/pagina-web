# Información pendiente para terminar la web de Daco Arts

Los espacios rojos de la página señalan datos que aún debe confirmar Daco Arts. No publicar esos textos como contenido definitivo. Los precios de ¿Madaquecua? ($80.000 COP), Rampalago ($25.000 COP) y ¿Me le parecí? ($25.000 COP), los medios de pago previstos (Nequi, Bre-B y transferencia) y la colaboración exclusiva actual con Entretenimiento Mental se conservaron según lo indicado por el fundador.

## Qué información va en cada sección

1. **`#piezas` y “FOTOS DEL JUEGO FÍSICO”**
   - Foto frontal de la caja de ¿Madaquecua? y foto de todo lo que incluye.
   - Primeros planos de las piezas, materiales, acabados y tamaño real.
   - Foto de una partida en mesa, con autorización de las personas fotografiadas.
   - Las ilustraciones actuales pueden quedarse como arte de marca; no sustituyen las fotos del producto real.

2. **`#como-se-juega` y las preguntas frecuentes**
   - Texto definitivo de cada paso, copiado o validado contra el reglamento.
   - Una carta de ejemplo, la respuesta correcta y una explicación breve.
   - Qué sucede cuando se acierta o se responde mal, cómo se gana y cuántas personas pueden jugar.
   - Habilidades que el juego realmente reta, validadas contra su dinámica.

3. **`#coleccion`**
   - Para Rampalago y ¿Me le parecí?: fotos, objetivo, dinámica, contenido de la caja y descripción aprobada.
   - Estado confirmado para cada título: disponible, preventa, próximo o en desarrollo.
   - Confirmar si los dos precios registrados siguen vigentes al momento de publicar.
   - Para Stop: arte, descripción, reglas, fecha y estado de lanzamiento.

4. **`#comprar` — WhatsApp y pedidos**
   - Número oficial de WhatsApp en formato internacional, sin `+` ni espacios, para activar el enlace de pedido.
   - Mensaje inicial aprobado y datos mínimos para confirmar un pedido.
   - Proceso para validar inventario, confirmar el pedido y avisar que el pago fue recibido.

5. **`#comprar` — pagos**
   - Para Nequi: número o QR oficial y titular.
   - Para Bre-B: llave o QR oficial y titular.
   - Para transferencia: banco, tipo y número de cuenta y titular.
   - Instrucciones seguras para enviar comprobante, sin pedir claves ni códigos de seguridad.

6. **`#comprar` — entrega**
   - Ciudades o zonas atendidas, costo de envío, transportadora o modalidad de entrega y plazo estimado.
   - Si hay recogida en tienda, dirección y condiciones.
   - Política para cancelaciones, cambios y novedades con los envíos.

7. **`#origen` — producción artesanal**
   - Quién fabrica los juegos, materiales usados y cuáles son los pasos artesanales reales.
   - Lugar de producción que se quiera publicar y fotos del proceso o taller, si se desean mostrar.

8. **`#donde` — Entretenimiento Mental**
   - Confirmar sucursales, direcciones, horarios y contacto.
   - Confirmar qué juegos hay en cada sede y cómo verificar inventario antes de ir.

9. **`#contacto`**
   - WhatsApp y correo oficial.
   - Decidir si se usará boletín por correo; si sí, escoger el servicio que almacenará y gestionará suscripciones y aprobar el aviso de privacidad.

## Antes de publicar

- Reemplazar cada bloque rojo por el dato, texto o foto confirmados y revisar el sitio en celular.
- Activar WhatsApp solo después de registrar el número oficial.
- Mantener el pago como instrucciones informativas hasta que el proceso de pedido, recaudo y confirmación esté definido.
- Generar una compilación nueva con `npm run build` y publicar el contenido de `dist`.

10. **DACO Arts Arcade**
   - La PWA en `madaquecua-app/` agrupa Madaquecua y Penta bajo la marca DACO Arts. Para Seenode como Static Site, usa root `madaquecua-app`, build `npm install && npm run build` y output `dist`.
   - Revisar las tarjetas de Penta reconocidas desde `PENTA 3.pdf` contra el documento antes de dar por validada toda la colección.
   - Validar que los valores predeterminados de monedas de Madaquecua coincidan con las cartas físicas disponibles. Los valores son editables en la app.
