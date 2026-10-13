import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X, Plus, Minus, Eye, Brain, Timer, Crosshair } from 'lucide-react';
import './styles.css';
import './ocean-theme.css';

const photos = {
  hero: '/madaquecua-cover.png',
  detail: '/madaquecua-card-duo.png',
  hands: '/madaquecua-card-treasure.png',
  pieces: '/madaquecua-cover.png',
};
const gamesForSale = {
  madaquecua: { name: '¿Madaquecua?', price: 80000 },
  rampalago: { name: 'Rampalago', price: 25000 },
  meLePareci: { name: '¿Me le parecí?', price: 25000 },
};
const formatCOP = (amount) => `$${new Intl.NumberFormat('es-CO').format(amount)}`;

function PendingText({ children }) {
  return <span className="pending-text">PENDIENTE: {children}</span>;
}

function PendingImage({ title, detail }) {
  return <div className="image-placeholder" role="img" aria-label={`Imagen pendiente: ${title}`}>
    <span>IMAGEN PENDIENTE</span>
    <strong>{title}</strong>
    <small>{detail}</small>
  </div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [faq, setFaq] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('nequi');
  const [paymentDetailsOpen, setPaymentDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('madaquecua');
  const activeProduct = gamesForSale[selectedProduct];
  const whatsappBusinessNumber = '';
  const whatsappOrderMessage = encodeURIComponent(`Hola, quiero consultar disponibilidad de ${activeProduct.name} por ${formatCOP(activeProduct.price)} COP.`);

  return <>
    <div className="announcement">UNA AVENTURA EN LA ISLA · UN MISTERIO POR DESCUBRIR</div>
    <header className="header">
      <button className="menu-trigger" onClick={() => setMenuOpen(true)} aria-label="Abrir menú"><Menu size={18}/><span>MENÚ</span></button>
      <a className="wordmark" href="#inicio" aria-label="Daco Arts inicio">DACO<span>®</span></a>
      <nav className="desktop-nav"><a href="#juego">EL JUEGO</a><a href="#origen">NUESTRA MIRADA</a><a href="#donde">ENCUÉNTRANOS</a></nav>
      <a className="header-cta" href="#contacto">HABLEMOS <ArrowUpRight size={14}/></a>
    </header>

    <main id="inicio">
      <section className="hero">
        <video className="hero-video" autoPlay muted loop playsInline poster={photos.hero} aria-hidden="true">
          <source src="/video-pagina-web.mp4" type="video/mp4" />
        </video>
        <div className="hero-shade" />
        <div className="hero-meta"><span>DACO ARTS · JUEGO 001</span><span>DISEÑADO LOCALMENTE · HECHO ARTESANALMENTE</span></div>
        <div className="hero-copy">
          <p className="eyebrow light">EL PRIMER JUEGO DE DACO ARTS · HECHO LOCALMENTE</p>
          <h1>¿Madaquecua?</h1>
          <div className="hero-bottom"><p>Una aventura de observación y rapidez.<br/>Mira bien. Piensa rápido. ¡Encuéntralo!</p><a href="#juego" className="circle-link" aria-label="Descubrir Madaquecua"><ArrowDown/></a></div>
        </div>
        <div className="hero-index">01 <i/> 04</div>
      </section>

      <section className="intro section-pad" id="juego">
        <div className="section-label"><span>01 / EL JUEGO</span><span>OBSERVA · ASOCIA · REACCIONA</span></div>
        <div className="intro-grid"><div><p className="eyebrow">UNA AVENTURA DE OBSERVACIÓN</p><h2>Una isla.<br/><em>Un reto inesperado.</em></h2></div><div className="intro-text"><p>¿Madaquecua? es el primer juego de Daco Arts: una aventura de observación y reacción rápida con una identidad propia, inspirada en una isla llena de tesoros.</p><p>Sus personajes y objetos invitan a mirar con atención, relacionar pistas y encontrar la respuesta antes que los demás.</p><a className="text-link" href="#como-se-juega">ASÍ SE JUEGA <ArrowRight size={16}/></a></div></div>
      </section>

      <section className="feature-photo" id="piezas"><img src={photos.detail} alt="Carta original de ¿Madaquecua? con el ave y el mono de la isla"/><div className="photo-caption"><span>PERSONAJES · OBSERVACIÓN · RAPIDEZ</span><span>DA / 001</span></div></section>

      <section className="manifesto section-pad" id="origen"><div className="section-label"><span>02 / HECHO AQUÍ</span><span>DISEÑO LOCAL · OFICIO ARTESANAL</span></div><div className="manifesto-grid"><p className="manifesto-mark">D<span>A.</span></p><div><h2>Ideas locales.<br/>Hechas <em>a mano.</em></h2><p className="manifesto-body">Daco Arts crea juegos de pensar artesanales y locales en Colombia.</p><p className="pending-text">PENDIENTE: materiales, pasos reales de fabricación y quién los produce.</p><span className="signature">Diseño local · Producción artesanal</span></div></div></section>

      <section className="split-story"><div className="split-image"><img src={photos.hands} alt="Carta original de ¿Madaquecua? con el ave azul y el cofre del tesoro"/><span>PISTAS ILUSTRADAS PARA DESCUBRIR</span></div><div className="split-copy"><p className="eyebrow">HECHO PARA COMPARTIR</p><h2>Una partida.<br/>Todas las miradas <em>alertas.</em></h2><p>Los personajes y objetos de la isla ponen a todos alrededor de la mesa a observar, asociar pistas y reaccionar.</p><a className="text-link" href="#como-se-juega">DESCUBRE EL RETO <ArrowRight size={16}/></a><span className="large-index">01</span></div></section>

      <section className="how-to section-pad" id="como-se-juega">
        <div className="section-label"><span>03 / EL RETO</span><span>RAPIDEZ CON ATENCIÓN</span></div>
        <div className="how-heading"><p className="eyebrow">¿MADAQUECUA? · REGLAS POR CONFIRMAR</p><h2>REGLAS DEL<br/><em>JUEGO</em></h2><p className="pending-text">PENDIENTE: validar con las reglas definitivas la descripción pública de la mecánica.</p></div>
        <div className="example-placeholder"><PendingImage title="Ejemplo de una carta real" detail="Agregar carta, respuesta correcta y explicación del porqué." /></div>
        <div className="steps-grid">
          <article className="step-card"><span>01</span><Eye size={25}/><h3><PendingText>nombre del paso 1</PendingText></h3><p><PendingText>Instrucción exacta del primer paso.</PendingText></p></article>
          <article className="step-card"><span>02</span><Crosshair size={25}/><h3><PendingText>nombre del paso 2</PendingText></h3><p><PendingText>Cómo se resuelve una carta, según las reglas propias.</PendingText></p></article>
          <article className="step-card"><span>03</span><Timer size={25}/><h3><PendingText>nombre del paso 3</PendingText></h3><p><PendingText>Cómo se gana la ronda y qué pasa con una respuesta incorrecta.</PendingText></p></article>
        </div>
        <div className="skills-band"><div className="skills-title"><Brain size={25}/><div><span>HABILIDADES EN JUEGO</span><p className="pending-text">PENDIENTE: confirmar con la dinámica final.</p></div></div><div className="skill-tags"><span>AGILIDAD VISUAL</span><span>VELOCIDAD MENTAL</span><span className="pending-tag">PENDIENTE: otras habilidades por definir</span></div></div>
      </section>

      <section className="product section-pad"><div className="section-label"><span>04 / EL PRIMER CAPÍTULO</span><span>COLECCIÓN DACO ARTS</span></div><div className="product-grid"><div className="product-art"><img src={photos.pieces} alt="Ilustración original de la caja de ¿Madaquecua?"/><span className="art-stamp">DA<br/>001</span></div><div className="product-info"><p className="eyebrow">JUEGO ARTESANAL DE OBSERVACIÓN Y REACCIÓN</p><h2>¿Madaquecua?</h2><p>Un juego de pensar hecho localmente. Desarrolla habilidades de observación y agilidad visual mientras compartes una partida.</p><div className="product-divider"/><div className="product-facts"><span>01 / DISEÑO LOCAL</span><span>02 / HECHO ARTESANALMENTE</span><span>03 / RETO DE RAPIDEZ VISUAL</span></div><a className="dark-button" href="#comprar" onClick={()=>setSelectedProduct('madaquecua')}>VER OPCIONES DE PAGO · $80.000 COP <ArrowUpRight size={16}/></a><small>Nequi, Bre-B o transferencia bancaria.</small><a className="text-link" href="#coleccion">EXPLORA EL RESTO DEL CATÁLOGO <ArrowRight size={16}/></a></div></div></section>

      <section className="product-evidence section-pad" aria-labelledby="evidence-title">
        <div className="section-label"><span>FOTOS DEL PRODUCTO</span><span>CONTENIDO PARA COMPLETAR</span></div>
        <h2 id="evidence-title">FOTOS DEL<br/><em>JUEGO FÍSICO</em></h2>
        <p className="pending-text">PENDIENTE: reemplazar estos espacios con fotografías propias del producto físico.</p>
        <div className="evidence-grid">
          <PendingImage title="Caja y contenido" detail="Foto frontal de la caja y todo lo que incluye." />
          <PendingImage title="Piezas de madera" detail="Foto cercana de materiales, acabados y escala real." />
          <PendingImage title="Una partida" detail="Foto de personas jugando y del espacio de juego." />
        </div>
      </section>

      <section className="game-collection section-pad" id="coleccion">
        <div className="section-label"><span>05 / LA COLECCIÓN DACO ARTS</span><span>JUEGOS PARA PENSAR Y COMPARTIR</span></div>
        <div className="collection-heading"><p className="eyebrow">CADA JUEGO, SU PROPIO MUNDO</p><h2>Ideas para llevar<br/>a <em>la mesa.</em></h2><p>Una colección de juegos artesanales que invita a observar, pensar y jugar juntos.</p></div>
        <div className="collection-grid">
          <article className="collection-card"><PendingImage title="Rampalago" detail="Agregar fotos de este juego."/><div className="collection-card-copy"><span className="collection-status"><PendingText>estado de venta/disponibilidad</PendingText></span><h3>Rampalago</h3><strong className="collection-price">$25.000 <small>COP</small></strong><p><PendingText>Descripción real, objetivo, dinámica y qué incluye.</PendingText></p><span className="collection-buy pending-action">PEDIDOS: FALTA CONFIGURAR WHATSAPP</span></div></article>
          <article className="collection-card"><PendingImage title="¿Me le parecí?" detail="Agregar fotos de este juego."/><div className="collection-card-copy"><span className="collection-status"><PendingText>estado de venta/disponibilidad</PendingText></span><h3>¿Me le parecí?</h3><strong className="collection-price">$25.000 <small>COP</small></strong><p><PendingText>Descripción real, objetivo, dinámica y qué incluye.</PendingText></p><span className="collection-buy pending-action">PEDIDOS: FALTA CONFIGURAR WHATSAPP</span></div></article>
          <article className="collection-card"><PendingImage title="Stop" detail="Agregar arte o fotos cuando estén listos."/><div className="collection-card-copy"><span className="collection-status status-informative"><PendingText>estado y fecha de lanzamiento</PendingText></span><h3>Stop</h3><p><PendingText>Descripción y reglas cuando estén definidas.</PendingText></p></div></article>
        </div>
      </section>

      <section className="checkout section-pad" id="comprar">
        <div className="section-label"><span>06 / COMPRA DIRECTA</span><span>UN JUEGO PARA PENSAR · HECHO LOCALMENTE</span></div>
        <div className="checkout-layout">
          <div className="checkout-intro"><p className="eyebrow">{activeProduct.name.toUpperCase()} · DACO ARTS</p><h2>La próxima<br/><em>partida empieza aquí.</em></h2><p>Elige un medio de pago para revisar el proceso. No transfieras hasta confirmar los datos oficiales y la disponibilidad.</p><div className="checkout-price"><span>PRECIO DEL JUEGO</span><strong>{formatCOP(activeProduct.price)} <small>COP</small></strong><p className="pending-text">PENDIENTE: disponibilidad, zonas de envío, costo y tiempo de entrega.</p></div>{whatsappBusinessNumber?<a className="whatsapp-cta" href={`https://wa.me/${whatsappBusinessNumber}?text=${whatsappOrderMessage}`} target="_blank" rel="noreferrer">CONSULTAR Y PEDIR POR WHATSAPP · {activeProduct.name} · {formatCOP(activeProduct.price)} COP</a>:<div className="whatsapp-placeholder"><strong>INICIAR PEDIDO POR WHATSAPP</strong><PendingText>Número oficial de Daco Arts y mensaje de pedido.</PendingText></div>}</div>
          <div className="payment-card">
            <p className="eyebrow">ELIGE TU MEDIO DE PAGO</p>
            <div className="payment-options" role="radiogroup" aria-label="Medio de pago">
              {[['nequi','Nequi','Transferencia o QR'],['breb','Bre-B','Llave o código QR'],['transfer','Transferencia','Desde tu banco']].map(([id,label,hint])=><button key={id} type="button" role="radio" aria-checked={paymentMethod===id} className={`payment-option ${paymentMethod===id?'selected':''}`} onClick={()=>{setPaymentMethod(id);setPaymentDetailsOpen(true)}}><span className="payment-radio"/><span><strong>{label}</strong><small>{hint}</small></span><ArrowUpRight size={15}/></button>)}
            </div>
            {paymentDetailsOpen&&<div className="payment-guidance" aria-live="polite"><strong>{paymentMethod==='nequi'?'Paga con Nequi':paymentMethod==='breb'?'Paga con Bre-B':'Paga desde tu banco'}</strong><p>{paymentMethod==='nequi'?'Antes de transferir, confirma con Daco Arts el número o QR Nequi registrado a nombre del comercio.':paymentMethod==='breb'?'Solicita la llave Bre-B o el QR del comercio y verifica el nombre del destinatario en tu banco antes de confirmar.':'Solicita los datos bancarios del comercio y verifica el titular antes de realizar la transferencia.'}</p><span>Valor a transferir: <b>{formatCOP(activeProduct.price)} COP</b></span></div>}
            <div className="payment-safety"><span aria-hidden="true">✳</span><p><strong>Compra con cuidado.</strong> Nunca compartas claves, códigos de un solo uso ni datos de tarjeta. Verifica el titular antes de hacer una transferencia.</p></div>
            <div className="payment-readiness"><strong>DATOS DE PAGO PENDIENTES</strong><p><PendingText>Nequi: número o QR y titular registrado.</PendingText></p><p><PendingText>Bre-B: llave o QR y titular registrado.</PendingText></p><p><PendingText>Transferencia: banco, tipo y número de cuenta y titular.</PendingText></p><p><PendingText>Pasos para enviar comprobante y confirmar pedido.</PendingText></p></div>
            <small className="payment-note">Esta página solo muestra las opciones y el precio. No procesa pagos, no solicita información financiera y no confirma pedidos.</small>
          </div>
        </div>
      </section>

      <section className="stockists" id="donde"><div className="section-label"><span>07 / NUESTRO ALIADO</span><span>VENTA EN BOGOTÁ</span></div><div className="stockists-grid"><div><p className="eyebrow">UNA COLABORACIÓN LOCAL</p><h2>Del diseño<br/><em>local a tu mesa.</em></h2><p className="stock-intro">Entretenimiento Mental es actualmente el único aliado comercial de Daco Arts. Consulta allí qué juegos están disponibles.</p><p className="pending-text">PENDIENTE: confirmar inventario por sede, direcciones, horarios y contacto de cada tienda.</p><a className="dark-button partner-button" href="https://www.entretenimientomental.com/" target="_blank" rel="noreferrer">VISITA ENTRETENIMIENTO MENTAL <ArrowUpRight size={16}/></a></div><div className="locations"><div className="retailer-lockup"><span>ALIADO COMERCIAL</span><strong>ENTRETENIMIENTO<br/>MENTAL</strong><p>Juegos de mesa · madera · ingenio</p></div><div className="location-placeholder"><PendingText>Dirección confirmada de tienda 1.</PendingText></div><div className="location-placeholder"><PendingText>Dirección confirmada de tienda 2.</PendingText></div></div></div></section>

      <section className="faq section-pad"><div className="section-label"><span>NOTAS DE JUEGO</span><span>LO ESENCIAL</span></div><div className="faq-layout"><h2>Antes de<br/><em>empezar.</em></h2><div className="faq-list">{[
        ['¿Qué habilidades pone en juego?', 'PENDIENTE: validar las habilidades que realmente pone en juego la mecánica final.'],
        ['¿Dónde lo puedo encontrar?', 'Por ahora, Entretenimiento Mental es el único aliado comercial de Daco Arts. Consulta sus tiendas y pregunta por disponibilidad.'],
        ['¿Hay más juegos?', 'Además de ¿Madaquecua?, Daco Arts también tiene Rampalago y ¿Me le parecí?. Stop está planeado. PENDIENTE: añadir la descripción y disponibilidad confirmadas de cada juego.'],
      ].map(([q,a],i)=><div className={`faq-item ${faq===i?'open':''}`} key={q}><button onClick={()=>setFaq(faq===i?-1:i)}><span>{q}</span>{faq===i?<Minus size={16}/>:<Plus size={16}/>}</button>{faq===i&&<p className={i===0?'pending-text':''}>{a}</p>}</div>)}</div></div></section>

      <section className="newsletter" id="contacto"><div><p className="eyebrow light">UNA IDEA SIEMPRE PUEDE EMPEZAR</p><h2>Juguemos<br/><em>la siguiente.</em></h2><p className="pending-text">PENDIENTE: texto aprobado para presentar el canal de contacto.</p></div><div className="newsletter-contact"><PendingText>WhatsApp oficial, correo de contacto y canal de novedades por integrar.</PendingText><small>El formulario de suscripción se activa cuando se conecte un servicio que reciba los datos.</small></div><span className="newsletter-orbit">DA</span></section>
    </main>

    <footer className="footer"><a href="#inicio" className="footer-wordmark">DACO<span>®</span></a><div className="footer-note"><span>DISEÑADO EN BOGOTÁ</span><span>HECHO EN COLOMBIA</span><span>© DACO ARTS 2026</span></div><a className="instagram-link" href="#contacto">NOVEDADES <ArrowUpRight size={13}/></a></footer>

    {menuOpen&&<div className="menu-overlay"><button className="close-menu" onClick={()=>setMenuOpen(false)} aria-label="Cerrar menú"><X/></button><span className="menu-kicker">DACO ARTS · BOGOTÁ</span><nav>{[['EL JUEGO','juego'],['LA COLECCIÓN','coleccion'],['NUESTRA MIRADA','origen'],['COMPRAR','comprar'],['ENCUÉNTRANOS','donde'],['CONTACTO','contacto']].map(([label,id],i)=><a key={id} href={`#${id}`} onClick={()=>setMenuOpen(false)}><span>0{i+1}</span>{label}<ArrowUpRight/></a>)}</nav><p>OBJETOS PARA PENSAR<br/>JUEGOS PARA COMPARTIR</p></div>}
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
