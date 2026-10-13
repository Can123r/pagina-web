# Daco Arts: propuesta de seguridad para pagos

## Estado

La web actual es una interfaz React/Vite estática. El selector Nequi / Bre-B / transferencia y el precio de $80.000 COP son informativos. No hay API de pedidos, pago integrado, validación de abono ni confirmación automática. Los datos oficiales de recaudo, disponibilidad y entrega todavía deben configurarse. No presentar este prototipo como un checkout operativo.

## Flujo propuesto: Daco Pago Verificado

1. El cliente elige Madaquecua y un medio disponible. El servidor crea una referencia de pedido única y calcula el precio en el servidor; nunca acepta como confiable un total enviado por el navegador.
2. El servidor valida disponibilidad y devuelve los datos de recaudo publicados y verificados por Daco Arts. Para Bre-B, presentar la llave o QR del comercio y pedir al cliente que compruebe el nombre del titular en su entidad financiera antes de autorizar. Para Nequi y transferencia, mostrar únicamente el destino oficial confirmado por Daco Arts.
3. El pedido queda `pendiente_de_pago`. El cliente no introduce claves, códigos de un solo uso, número de tarjeta, CVV ni credenciales bancarias en la web de Daco Arts. No pedir ni confiar en una captura como prueba de abono.
4. Daco Arts verifica el ingreso en el canal oficial de la entidad receptora y marca el pedido `pagado`. Hasta entonces, nunca anunciar el pago como confirmado ni despachar el producto.
5. La página muestra la referencia y el siguiente paso, sin exponer datos financieros ni declarar éxito por haber pulsado un botón.

Estados mínimos: `creado` → `pendiente_de_pago` → `en_verificacion` → `pagado`; salidas controladas: `cancelado` o `vencido`. Solo el backend o un webhook autenticado puede cambiar un pedido a `pagado`.

## Salvaguardas de implementación

- **Mínimo de datos:** recoger solo contacto y datos de entrega necesarios, después de confirmar stock; mostrar aviso de privacidad, finalidad, plazo de conservación y canal de contacto. No almacenar información de tarjetas o credenciales financieras.
- **Servidor como autoridad:** lista permitida de métodos, precio, disponibilidad, destinatario y estado se validan en backend. Nunca confiar en campos ocultos, parámetros del navegador, almacenamiento local ni texto del cliente como prueba de pago.
- **Pedidos y duplicados:** referencias aleatorias no secuenciales, operaciones idempotentes, expiración de cotización y límites de solicitudes para evitar pedidos duplicados o abuso automatizado.
- **Integridad del navegador:** HTTPS, política CSP restrictiva, `frame-ancestors`, `Referrer-Policy`, `X-Content-Type-Options`, cookies `Secure` / `HttpOnly` / `SameSite` si se incorpora sesión; protección CSRF para acciones autenticadas y validación de origen.
- **Secretos y recaudo:** nunca incluir tokens, claves privadas ni contraseñas en el bundle React o repositorio. Mantener datos de configuración sensibles en el servidor; restringir administración y activar MFA. Las llaves/QR de recaudo se publican solo tras aprobación explícita de Daco Arts.
- **Verificación manual:** conciliación en la app/web oficial del banco; comprobar monto, titular y referencia. No confiar en comprobantes aportados por quien paga. Registrar quién hizo el cambio a `pagado`, cuándo y con qué referencia, minimizando datos personales en logs.
- **Proveedor futuro:** si se agrega una pasarela, usar su checkout alojado o tokenización; verificar firma de webhooks en servidor, timestamp/idempotencia y conciliación antes de confirmar. No manipular datos de tarjeta en React.
- **Operación:** HTTPS en producción, copias de seguridad protegidas, acceso administrativo con MFA y plan de respuesta ante cobros incorrectos, filtración o transacción duplicada.

## Antes de activar ventas directas

- Confirmar titular y destino de Nequi, llave/QR Bre-B y cuenta bancaria; autorizar qué datos pueden mostrarse públicamente.
- Acordar canal de contacto, zonas/costo de envío, plazo de entrega, disponibilidad, cancelaciones/devoluciones y aviso de privacidad.
- Construir backend de pedidos con permisos administrativos y conciliación; la web estática actual no puede recibir ni verificar pedidos con seguridad.
- Revisar legalmente el aviso de privacidad y condiciones de venta aplicables en Colombia.

## Revisión realizada

La revisión del frontend no encontró un sistema servidor de pagos dentro de este proyecto: solo React/Vite. El formulario de novedades existente también es una demostración local y no envía datos a un servicio. Mantener mensajes claros de prototipo hasta conectar destinos oficiales y backend.
