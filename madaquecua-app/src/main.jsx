import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowRight, Bell, Check, ChevronDown, CircleHelp, Clock3, Coins, Crown, Plus, RotateCcw, Settings2, Shuffle, Trophy, Users, X, Blocks, Timer, RotateCw, FlipHorizontal2, Eraser } from 'lucide-react';
import pentaLevels from './penta-levels.json';
import './styles.css';

const STORE = 'madaquecua-app-v1';
const FIGURES = [
  { id: 'penguin', name: 'Pingüino azul', shape: 'pingüino', color: 'azul', emoji: '🐧' },
  { id: 'monkey', name: 'Mono café', shape: 'mono', color: 'café', emoji: '🐒' },
  { id: 'key', name: 'Llave roja', shape: 'llave', color: 'roja', emoji: '🗝️' },
  { id: 'chest', name: 'Cofre verde', shape: 'cofre', color: 'verde', emoji: '🧰' },
  { id: 'anchor', name: 'Ancla gris', shape: 'ancla', color: 'gris', emoji: '⚓' },
];
const freshData = () => ({ profiles: [], sessions: [], cardValues: { '1': 1, '2': 2, '3': 3, '4': 4 } });
const readStore = () => { try { return { ...freshData(), ...JSON.parse(localStorage.getItem(STORE) || '{}') }; } catch { return freshData(); } };
const money = n => new Intl.NumberFormat('es-CO').format(n);
const randomPick = list => list[Math.floor(Math.random() * list.length)];
const makeChallenge = () => {
  const target = randomPick(FIGURES);
  const missing = randomPick(FIGURES.filter(item => item.id !== target.id));
  const distractors = FIGURES.filter(item => item.id !== target.id && item.id !== missing.id).sort(() => Math.random() - .5).slice(0, 2);
  return { target, missing, options: [missing, ...distractors].sort(() => Math.random() - .5) };
};

function App() {
  const [data, setData] = useState(readStore);
  const [mode, setMode] = useState('darkQuartz');
  const [page, setPage] = useState('play');
  const [challenge, setChallenge] = useState(makeChallenge);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerState, setTimerState] = useState('idle');
  const [soundOn, setSoundOn] = useState(true);
  const [rounds, setRounds] = useState([]);
  const [selectedWinner, setSelectedWinner] = useState('');
  const [cardValue, setCardValue] = useState('1');
  const [cardPoints, setCardPoints] = useState(data.cardValues?.['1'] ?? 1);
  const [profileName, setProfileName] = useState('');
  const [sessionTitle, setSessionTitle] = useState('Partida de hoy');
  const [newValueKey, setNewValueKey] = useState('');
  const [newValuePoints, setNewValuePoints] = useState('');
  const [notice, setNotice] = useState('');
  const [savedSessionId, setSavedSessionId] = useState('');
  const [pentaLevel, setPentaLevel] = useState(3);
  const [pentaCard, setPentaCard] = useState(1);
  const [pentaProgress, setPentaProgress] = useState(() => { try { return JSON.parse(localStorage.getItem('dark-quartz-penta-progress') || '{}'); } catch { return {}; } });
  const [pentaPlaced, setPentaPlaced] = useState([]);
  const [pentaSelected, setPentaSelected] = useState(null);
  const [pentaRotation, setPentaRotation] = useState(0);
  const [pentaFlip, setPentaFlip] = useState(false);
  const [pentaStarted, setPentaStarted] = useState(null);
  const [pentaSeconds, setPentaSeconds] = useState(0);
  const [pentaNotice, setPentaNotice] = useState('');
  const [pentaInstructionsOpen, setPentaInstructionsOpen] = useState(true);

  useEffect(() => { localStorage.setItem(STORE, JSON.stringify(data)); }, [data]);
  useEffect(() => { localStorage.setItem('dark-quartz-penta-progress', JSON.stringify(pentaProgress)); }, [pentaProgress]);
  useEffect(() => {
    if (!pentaStarted || mode !== 'penta') return;
    const interval = window.setInterval(() => setPentaSeconds(Math.floor((Date.now() - pentaStarted) / 1000)), 250);
    return () => window.clearInterval(interval);
  }, [pentaStarted, mode]);
  useEffect(() => {
    if (timerState !== 'running') return;
    const id = window.setInterval(() => setTimeLeft(t => {
      if (t <= 1) { setTimerState('finished'); return 0; }
      return t - 1;
    }), 1000);
    return () => window.clearInterval(id);
  }, [timerState]);
  useEffect(() => {
    if (timerState !== 'finished' || !soundOn) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      const ctx = new Audio();
      [0, .28, .56].forEach((delay, i) => {
        const oscillator = ctx.createOscillator(); const gain = ctx.createGain();
        oscillator.type = 'sine'; oscillator.frequency.value = i === 1 ? 740 : 560;
        gain.gain.setValueAtTime(.0001, ctx.currentTime + delay); gain.gain.exponentialRampToValueAtTime(.23, ctx.currentTime + delay + .03); gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + delay + .2);
        oscillator.connect(gain); gain.connect(ctx.destination); oscillator.start(ctx.currentTime + delay); oscillator.stop(ctx.currentTime + delay + .22);
      });
      window.setTimeout(() => ctx.close(), 1200);
    } catch { /* El cambio de pantalla sigue funcionando aunque el navegador bloquee audio. */ }
  }, [timerState, soundOn]);

  const leaderboard = useMemo(() => {
    const totals = data.profiles.map(player => ({ ...player, points: rounds.filter(round => round.winnerId === player.id).reduce((sum, round) => sum + Number(round.points || 0), 0), wins: rounds.filter(round => round.winnerId === player.id).length }));
    const ranked = [...totals].sort((a, b) => b.points - a.points || b.wins - a.wins || a.name.localeCompare(b.name));
    return ranked.map((player, i) => ({ ...player, rank: i === 0 || player.points !== ranked[i - 1].points ? i + 1 : ranked[i - 1].rank }));
  }, [data.profiles, rounds]);
  const topScore = leaderboard[0]?.points ?? 0;

  const startSolo = async () => {
    setTimeLeft(60); setChallenge(makeChallenge()); setTimerState('running'); setMode('solo');
    if ('Notification' in window && Notification.permission === 'default') {
      try { await Notification.requestPermission(); } catch { /* El sonido local no depende del permiso de notificaciones. */ }
    }
  };
  const startGroup = () => { setRounds([]); setSelectedWinner(''); setSavedSessionId(''); setMode('group'); setPage(data.profiles.length ? 'play' : 'players'); };
  const addProfile = () => {
    const name = profileName.trim();
    if (!name) return;
    if (data.profiles.some(player => player.name.toLocaleLowerCase() === name.toLocaleLowerCase())) { setNotice('Ya existe un perfil con ese nombre.'); return; }
    const profile = { id: crypto.randomUUID(), name };
    setData(current => ({ ...current, profiles: [...current.profiles, profile] })); setProfileName(''); setNotice('Perfil creado.');
  };
  const changePlayerCount = (id, delta) => setData(current => ({ ...current, profiles: delta > 0 ? [...current.profiles, { id: crypto.randomUUID(), name: `Jugador ${current.profiles.length + 1}` }] : current.profiles.filter(player => player.id !== id) }));
  const addRound = () => {
    if (!selectedWinner) { setNotice('Selecciona quién ganó esta ronda.'); return; }
    setRounds(current => [...current, { id: crypto.randomUUID(), winnerId: selectedWinner, cardValue, points: Number(cardPoints) || 0 }]);
    setSelectedWinner(''); setNotice('Ronda registrada.');
  };
  const saveSession = () => {
    if (savedSessionId) { setPage('ranking'); return; }
    if (!rounds.length) { setPage('ranking'); return; }
    const session = { id: crypto.randomUUID(), title: sessionTitle.trim() || 'Partida de hoy', date: new Date().toISOString(), rounds, players: data.profiles };
    setData(current => ({ ...current, sessions: [session, ...current.sessions].slice(0, 30) })); setSavedSessionId(session.id); setPage('ranking');
  };
  const saveCardValue = () => {
    const key = newValueKey.trim(); const points = Math.max(0, Number(newValuePoints));
    if (!key || !Number.isFinite(points)) return;
    setData(current => ({ ...current, cardValues: { ...current.cardValues, [key]: points } })); setCardValue(key); setCardPoints(points); setNewValueKey(''); setNewValuePoints('');
  };
  const selectCard = key => { setCardValue(key); setCardPoints(data.cardValues[key] ?? 0); };
  const addGuest = () => changePlayerCount('', 1);

  const goHub = () => { setMode('darkQuartz'); setTimerState('idle'); };
  const activePentaPieces = pentaLevels[String(pentaLevel)]?.[String(pentaCard)] || [];
  const pentaCols = activePentaPieces.length;
  const shapeCells = (id, rotation = pentaRotation, flip = pentaFlip) => {
    const shapes = {
      1:[[0,0],[1,0],[2,0],[3,0],[4,0]],2:[[0,0],[1,0],[2,0],[3,0],[3,1]],3:[[0,0],[0,1],[0,2],[0,3],[1,2]],
      4:[[0,0],[0,1],[1,1],[1,2],[1,3]],5:[[0,0],[1,0],[2,0],[2,1],[2,2]],6:[[0,0],[0,1],[0,2],[1,0],[1,1]],
      7:[[0,0],[0,2],[1,0],[1,1],[1,2]],8:[[0,0],[0,1],[1,1],[2,1],[2,2]],9:[[0,0],[0,1],[1,1],[1,2],[2,1]],
      10:[[0,1],[1,1],[2,0],[2,1],[2,2]],11:[[0,1],[0,2],[1,0],[1,1],[2,0]],12:[[0,1],[1,0],[1,1],[1,2],[2,1]],
    };
    let cells = shapes[id].map(([x,y]) => [flip ? -x : x, y]);
    for (let r=0;r<rotation;r++) cells=cells.map(([x,y])=>[-y,x]);
    const minX=Math.min(...cells.map(c=>c[0])),minY=Math.min(...cells.map(c=>c[1]));
    return cells.map(([x,y])=>[x-minX,y-minY]);
  };
  const pieceFits = (pieceId,col,row,rotation=pentaRotation,flip=pentaFlip) => {
    const cells=shapeCells(pieceId,rotation,flip);
    const occupied=new Set(pentaPlaced.filter(p=>p.id!==pieceId).flatMap(p=>p.cells.map(c=>`${p.col+c[0]},${p.row+c[1]}`)));
    const candidate=cells.map(([x,y])=>`${col+x},${row+y}`);
    return candidate.every(key=>{const [x,y]=key.split(',').map(Number);return x>=0&&x<pentaCols&&y>=0&&y<5&&!occupied.has(key)});
  };
  const placePentaPiece = (pieceId,col,row,rotation=pentaRotation,flip=pentaFlip) => {
    if(!pieceFits(pieceId,col,row,rotation,flip)){setPentaNotice('Esa ficha se sale del tablero o se cruza con otra.');window.setTimeout(()=>setPentaNotice(''),1800);return;}
    setPentaPlaced(current=>[...current.filter(p=>p.id!==pieceId),{id:pieceId,col,row,cells:shapeCells(pieceId,rotation,flip)}]);
    setPentaSelected(null);setPentaNotice('');if(!pentaStarted)setPentaStarted(Date.now());
  };
  const beginPenta = (level,card) => {setPentaLevel(Number(level));setPentaCard(Number(card));setPentaPlaced([]);setPentaSelected(null);setPentaRotation(0);setPentaFlip(false);setPentaStarted(Date.now());setPentaSeconds(0);setPentaInstructionsOpen(true);setMode('penta');};
  const boardComplete = activePentaPieces.length>0&&pentaPlaced.length===activePentaPieces.length&&pentaPlaced.flatMap(piece=>piece.cells).length===pentaCols*5;
  useEffect(()=>{
    if(!boardComplete||!pentaStarted)return;
    const elapsed=Math.floor((Date.now()-pentaStarted)/1000),key=`${pentaLevel}-${pentaCard}`;
    setPentaProgress(current=>{const previous=current[key];return {...current,[key]:{complete:true,best:Math.min(previous?.best??Number.MAX_SAFE_INTEGER,elapsed),last:elapsed}};});
    setPentaStarted(null);setPentaNotice('¡Nivel superado! El tiempo y tu mejor marca se guardaron en este teléfono.');
  },[boardComplete,pentaStarted,pentaLevel,pentaCard]);
  const formatDuration = seconds => `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;

  return <div className={`app ${mode === 'darkQuartz' ? 'dark-quartz-app' : ''} ${['penta','pentaSelect'].includes(mode) ? 'penta-island-app' : ''} ${timerState === 'finished' && mode === 'solo' ? 'time-up' : ''}`}>
    <header className={`topbar ${mode === 'darkQuartz' ? 'quartz-topbar' : ''}`}><a className="brand" href="#" onClick={e => { e.preventDefault(); goHub(); }}><span className="brand-mark">{mode === 'darkQuartz' ? 'DQ' : 'DA'}</span><span>{mode === 'darkQuartz' ? 'DARK QUARTZ' : 'DACO ARTS'}<small>{mode === 'darkQuartz' ? 'JUEGOS PARA COMPARTIR' : mode === 'penta' ? 'JUEGO 002 · PENTA' : 'JUEGO 001 · MADAQUECUA'}</small></span></a><span className="offline-chip"><i/> SE GUARDA EN ESTE TELÉFONO</span></header>
    {mode === 'darkQuartz' && <main className="quartz-home"><section className="quartz-hero"><div className="quartz-copy"><div className="quartz-eyebrow"><span/> DACO ARTS PRESENTA</div><h1>Dark<br/><em>Quartz.</em></h1><p>Un espacio para reunirse, jugar y descubrir. Elige un juego y continúa cuando quieras.</p><div className="quartz-meta"><span>JUEGOS ARTESANALES</span><b>·</b><span>PROGRESO LOCAL</span></div></div><div className="quartz-crystal" aria-hidden="true"><div className="crystal-orbit orbit-a"/><div className="crystal-orbit orbit-b"/><div className="crystal-shard"><i/><b/><span/></div><span className="crystal-caption">PLAY / EXPLORE / REPEAT</span></div></section><section className="quartz-games"><div className="quartz-section-title"><span>CATÁLOGO DE JUEGOS</span><span>02 EXPERIENCIAS</span></div><div className="game-catalog"><button className="game-tile mada-tile" onClick={()=>setMode('madaHome')}><div className="tile-image"><img src="/madaquecua-cover.png" alt="Portada del juego Madaquecua"/><span className="tile-number">01</span></div><div className="tile-info"><span>OBSERVACIÓN · MESA</span><h2>¿Madaquecua?</h2><p>Retos contrarreloj y partidas multijugador con monedas.</p><b>ABRIR JUEGO <ArrowRight size={16}/></b></div></button><button className="game-tile penta-tile" onClick={()=>beginPenta(3,1)}><div className="tile-art-penta"><div className="pentomino pentomino-one">▪▪▪<br/>▪<br/>▪</div><div className="pentomino pentomino-two">▪▪<br/>▪▪<br/>▪</div><div className="tile-number">02</div><span className="tile-art-label">ISLA DE RETOS</span></div><div className="tile-info"><span>PUZLE · NIVELES</span><h2>Penta</h2><p>Entra a jugar, acomoda las fichas y supera tu mejor tiempo.</p><b>JUGAR AHORA <ArrowRight size={16}/></b></div></button></div></section><footer className="quartz-foot"><span>UNA COLECCIÓN DE DACO ARTS</span><span>HECHO PARA JUGAR JUNTOS ✳</span></footer></main>}
    {mode === 'madaHome' && <main className="home-layout">
      <section className="welcome"><div className="welcome-art"><img src="/madaquecua-cover.png" alt="La isla de ¿Madaquecua?"/><span className="art-stamp">OBSERVA<br/>Y ATRÁPALO</span></div><div className="welcome-copy"><div className="eyebrow"><span/> COMPAÑERA DE JUEGO ARTESANAL</div><h1>¿Mada<br/><em>quecua?</em></h1><p>Mira bien. Piensa rápido. Lleva la cuenta de cada partida alrededor de la mesa.</p><div className="home-stats"><span><b>01</b> RETO CONTRARRELOJ</span><span><b>02</b> MODO MULTIJUGADOR</span></div></div></section>
      <section className="mode-grid"><button className="mode-card solo-card" onClick={startSolo}><div className="mode-icon"><Clock3/></div><span className="mode-kicker">01 · CONTRARRELOJ</span><h2>Un jugador</h2><p>Encadena retos de observación durante 60 segundos.</p><span className="mode-action">EMPEZAR RETO <ArrowRight size={16}/></span><span className="mode-deco">60</span></button><button className="mode-card group-card" onClick={startGroup}><div className="mode-icon"><Users/></div><span className="mode-kicker">02 · JUEGUEN EN MESA</span><h2>Multijugador</h2><p>Registra perfiles, ganadores y monedas carta por carta.</p><span className="mode-action">ARMAR PARTIDA <ArrowRight size={16}/></span><span className="mode-deco group-deco">✳</span></button></section>
      <section className="home-bottom"><div className="hint"><CircleHelp size={19}/><p><strong>Inspirado en las reglas impresas.</strong><br/>El juego físico propone cinco figuras y que cada carta tiene un valor en monedas.</p></div><button className="text-button" onClick={() => setMode('profiles')}>PERFILES GUARDADOS <ArrowRight size={14}/></button></section>
    </main>}

    {mode === 'pentaSelect' && <main className="penta-shell"><div className="penta-heading"><button className="back-button" onClick={()=>{setPentaStarted(Date.now()-pentaSeconds*1000);setMode('penta');}}><ArrowLeft size={16}/> VOLVER A JUGAR</button><div className="penta-title-line"><div><span className="penta-overline">JUEGO 002 · PUZLE DE FICHAS</span><h1>Penta</h1><p>Elige una dificultad y acomoda las fichas que aparecen en cada tarjeta.</p></div><div className="penta-best-summary"><Trophy/><span>{Object.values(pentaProgress).filter(item=>item.complete).length}<small> retos resueltos</small></span></div></div></div><section className="penta-level-list"><div className="penta-section-label"><span>NIVELES DEL MANUAL</span><span>ORDENADOS POR DIFICULTAD</span></div><div className="level-grid">{Object.entries(pentaLevels).sort((a,b)=>Number(a[0])-Number(b[0])).map(([level,cards])=><article className="level-card" key={level}><div className="level-card-head"><span className="level-gem"><Blocks size={17}/></span><div><h2>Penta {level}</h2><small>{Object.keys(cards).length} retos · fichas de cada tarjeta</small></div><span className="level-complete">{Object.keys(cards).filter(card=>pentaProgress[`${level}-${card}`]?.complete).length}/{Object.keys(cards).length}</span></div><div className="sublevel-list">{Object.keys(cards).sort((a,b)=>Number(a)-Number(b)).map(card=>{const done=pentaProgress[`${level}-${card}`];return <button key={card} className={`sublevel-button ${done?'is-done':''}`} onClick={()=>beginPenta(level,card)}><span>TARJETA {card}</span>{done?<small>MEJOR {formatDuration(done.best)}</small>:<small>{cards[card].length} FICHAS</small>}<ArrowRight size={14}/></button>})}</div></article>)}</div><p className="penta-source-note">Retos reconocidos en PENTA 3.pdf. La cantidad de casillas de cada tablero corresponde a las fichas registradas en esa tarjeta.</p></section></main>}

      {mode === 'penta' && <main className="penta-shell penta-play"><div className="penta-play-top"><button className="back-button" onClick={()=>{setPentaStarted(null);setMode('pentaSelect');}}><ArrowLeft size={16}/> NIVELES</button><button className="penta-help" onClick={()=>setPentaInstructionsOpen(true)}><CircleHelp size={15}/> AYUDA</button><div className="penta-timer"><Timer size={16}/><span>{formatDuration(pentaSeconds)}</span></div><button className="penta-reset" onClick={()=>{setPentaPlaced([]);setPentaSelected(null);setPentaRotation(0);setPentaFlip(false);setPentaStarted(Date.now());setPentaSeconds(0);setPentaNotice('');}}><RotateCcw size={15}/> REINICIAR</button></div>{pentaInstructionsOpen&&<section className="penta-instructions"><span className="instruction-sun">☀</span><div><strong>Cómo jugar</strong><p>Arrastra una ficha a la cuadrícula o tócala y luego toca dónde quieres ponerla. Usa Girar y Voltear para acomodarla. Llena todas las casillas sin dejar huecos.</p></div><button onClick={()=>setPentaInstructionsOpen(false)} aria-label="Ocultar instrucciones">ENTENDIDO <X size={15}/></button></section>}<div className="penta-island-scene" aria-hidden="true"/><div className="penta-play-title"><span>PENTA {pentaLevel} · TARJETA {pentaCard}</span><h1>Completa el tablero</h1><p>Coloca todas las fichas en el área iluminada. Puedes girarlas y voltearlas.</p></div><div className="penta-layout"><section className="penta-board-panel"><div className="board-meta"><span>ÁREA DE JUEGO</span><span>5 × {pentaCols} · {activePentaPieces.length} FICHAS</span></div><div className="penta-board" style={{'--penta-cols':pentaCols}}>{Array.from({length:5},(_,row)=>Array.from({length:pentaCols},(_,col)=>{const placed=pentaPlaced.find(piece=>piece.cells.some(c=>piece.col+c[0]===col&&piece.row+c[1]===row));const selectedCells=pentaSelected?shapeCells(pentaSelected.id,pentaRotation,pentaFlip):[];const isPreview=pentaSelected&&selectedCells.some(c=>pentaSelected.col+c[0]===col&&pentaSelected.row+c[1]===row);const pieceColor=placed?`piece-color-${placed.id}`:pentaSelected&&isPreview?`piece-color-${pentaSelected.id}`:'';return <button key={`${row}-${col}`} className={`board-cell ${pieceColor} ${isPreview?'cell-preview':''}`} aria-label={`Fila ${row+1}, columna ${col+1}`} onPointerEnter={()=>{if(pentaSelected)setPentaSelected({...pentaSelected,col,row});}} onDragOver={e=>{e.preventDefault();if(pentaSelected)setPentaSelected({...pentaSelected,col,row});}} onDrop={e=>{e.preventDefault();const id=Number(e.dataTransfer.getData('text/plain'));const rot=Number(e.dataTransfer.getData('rotation')||pentaRotation);const flip=e.dataTransfer.getData('flip')==='true';placePentaPiece(id,col,row,rot,flip);}} onClick={()=>{if(pentaSelected)placePentaPiece(pentaSelected.id,col,row);else if(placed)removePentaPiece(placed.id);}}>{placed&&<span>{placed.id}</span>}</button>}))}</div><div className="board-help"><span>TOCA UNA FICHA Y LUEGO UNA CASILLA, O ARRASTRA PARA COLOCARLA</span><span>{pentaPlaced.length}/{activePentaPieces.length} COLOCADAS</span></div></section><aside className="penta-pieces-panel"><div className="pieces-header"><div><span>FICHAS DEL RETO</span><h2>Elige y acomoda</h2></div><span>{activePentaPieces.length}</span></div><div className="penta-pieces">{activePentaPieces.map(id=>{const placed=pentaPlaced.some(p=>p.id===id);const cells=shapeCells(id,pentaSelected?.id===id?pentaRotation:0,pentaSelected?.id===id?pentaFlip:false);const maxX=Math.max(...cells.map(c=>c[0]))+1,maxY=Math.max(...cells.map(c=>c[1]))+1;return <button key={id} draggable={true} className={`penta-piece ${pentaSelected?.id===id?'piece-selected':''} ${placed?'piece-placed':''}`} onClick={()=>{if(placed){removePentaPiece(id);setPentaSelected({id,col:0,row:0});setPentaRotation(0);setPentaFlip(false);return;}setPentaSelected({id,col:0,row:0});setPentaRotation(0);setPentaFlip(false);}} onDragStart={e=>{setPentaSelected({id,col:0,row:0});e.dataTransfer.setData('text/plain',String(id));e.dataTransfer.setData('rotation',String(pentaRotation));e.dataTransfer.setData('flip',String(pentaFlip));}}><span className="piece-label">{placed?'✓':`FICHA ${id}`}</span><span className="piece-mini" style={{'--shape-cols':maxX,'--shape-rows':maxY}}>{Array.from({length:maxX*maxY},(_,i)=>{const x=i%maxX,y=Math.floor(i/maxX);return <i key={i} className={cells.some(c=>c[0]===x&&c[1]===y)?`mini-cell piece-color-${id}`:''}/>})}</span></button>})}</div><div className="piece-controls"><button disabled={!pentaSelected} onClick={()=>setPentaRotation(r=>(r+1)%4)}><RotateCw size={16}/> GIRAR</button><button disabled={!pentaSelected} onClick={()=>setPentaFlip(value=>!value)}><FlipHorizontal2 size={16}/> VOLTEAR</button><button disabled={!pentaPlaced.length} onClick={()=>setPentaPlaced([])}><Eraser size={16}/> VACIAR</button></div><div className="penta-record"><span>TIEMPO ACTUAL</span><strong>{formatDuration(pentaSeconds)}</strong><small>La mejor marca queda guardada en este dispositivo.</small></div></aside></div>{pentaNotice&&<div className={`penta-toast ${boardComplete?'success':''}`}>{pentaNotice}{boardComplete&&<button onClick={()=>beginPenta(pentaLevel,pentaCard)}>VOLVER A INTENTAR <RotateCcw size={14}/></button>}</div>}</main>}

    {mode === 'solo' && <main className={`solo-screen ${timerState === 'finished' ? 'expired' : ''}`}>
      <div className="play-top"><button className="back-button" onClick={() => { setMode('madaHome'); setTimerState('idle'); }}><ArrowLeft size={16}/> VOLVER</button><div className="timer-wrap"><span className="timer-label">TIEMPO DE RETO</span><span className="timer-digits">00:{String(timeLeft).padStart(2, '0')}</span></div><button className={`sound-button ${soundOn ? 'sound-on' : ''}`} onClick={() => setSoundOn(!soundOn)} aria-label={soundOn ? 'Silenciar alarma' : 'Activar alarma'}><Bell size={17}/><span>{soundOn ? 'ALARMA ACTIVA' : 'ALARMA SILENCIADA'}</span></button></div>
      {timerState === 'finished' ? <section className="timeup-card" role="alert"><div className="timeup-symbol">!</div><span className="mode-kicker">EL TIEMPO SE ACABÓ</span><h1>¡Tiempo!</h1><p>Respira un momento. ¿Listo para una nueva ronda?</p><button className="light-cta" onClick={() => { setTimeLeft(60); setChallenge(makeChallenge()); setTimerState('running'); }}>OTRA RONDA <RotateCcw size={16}/></button><button className="secondary-light" onClick={() => { setMode('madaHome'); setTimerState('idle'); }}>VOLVER AL INICIO</button></section> : <>
        <div className="solo-heading"><span>RETO {Math.floor((60 - timeLeft) / 8) + 1} · OBSERVA ANTES DE ELEGIR</span><h1>¿Qué figura falta?</h1><p>Encuentra la figura que no aparece por su forma <em>ni</em> por su color.</p></div>
        <section className="challenge-card"><div className="challenge-top"><span>LA ISLA CAMBIA SUS PISTAS</span><Shuffle size={15}/></div><div className="scene-figures">{FIGURES.filter(item => item.id !== challenge.target.id).map((item, index) => <div className={`scene-figure figure-${index}`} key={item.id}><span className={`figure-emoji ${item.id}`}>{item.emoji}</span><b>{item.name}</b></div>)}</div><div className="scene-question"><span>LA CARTA PISTA DICE</span><strong>{challenge.target.shape.toUpperCase()} {challenge.target.color.toUpperCase()}</strong></div></section>
        <div className="answer-title">¿CUÁL NO ESTÁ EN LA ISLA?</div><div className="answer-grid">{challenge.options.map(item => <button key={item.id} className="answer-button" onClick={() => { if (item.id === challenge.missing.id) setNotice('¡Correcto! Sigue observando.'); else setNotice('Casi. Mira otra vez la forma y el color.'); setChallenge(makeChallenge()); window.setTimeout(() => setNotice(''), 1000); }}><span>{item.emoji}</span><strong>{item.name}</strong><ArrowRight size={15}/></button>)}</div><div className="solo-footer"><span><i className="pulse"/> EL RETO SIGUE CORRIENDO</span><span>APUNTA A LA FIGURA · RESPONDE EN VOZ ALTA</span></div>{notice && <div className="toast">{notice}</div>}</>}
    </main>}

    {mode === 'group' && <main className="group-layout">
      <div className="group-top"><button className="back-button" onClick={() => setMode('madaHome')}><ArrowLeft size={16}/> INICIO</button><div><span className="mode-kicker">MODO MULTIJUGADOR</span><h1>{page === 'players' ? 'La mesa' : page === 'ranking' ? 'Resultados' : 'A jugar'}</h1></div><div className="round-count"><span>RONDA</span><strong>{String(rounds.length + 1).padStart(2, '0')}</strong></div></div>
      <nav className="step-tabs"><button className={page === 'players' ? 'active' : ''} onClick={() => setPage('players')}><Users size={15}/> JUGADORES</button><button className={page === 'play' ? 'active' : ''} onClick={() => setPage('play')}><Coins size={15}/> RONDAS <span>{rounds.length || ''}</span></button><button className={page === 'ranking' ? 'active' : ''} onClick={() => setPage('ranking')}><Trophy size={15}/> RANKING</button></nav>
      {page === 'players' && <section className="panel players-panel"><div className="panel-heading"><span className="eyebrow">PREPARACIÓN · PERFÍLES LOCALES</span><h2>¿Quiénes juegan?</h2><p>Los nombres quedan guardados en este teléfono para próximas partidas.</p></div><form className="add-profile" onSubmit={e => { e.preventDefault(); addProfile(); }}><label className="sr-only" htmlFor="profile-name">Nombre del jugador</label><input id="profile-name" value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="Escribe un nombre"/><button className="primary-cta" type="submit"><Plus size={17}/> AÑADIR</button></form><div className="player-list">{data.profiles.map((player, index) => <div className="player-row" key={player.id}><span className={`avatar avatar-${index % 5}`}>{player.name.slice(0, 1).toUpperCase()}</span><strong>{player.name}</strong><span className="saved-label">PERFIL GUARDADO</span><button className="remove-player" onClick={() => setData(current => ({ ...current, profiles: current.profiles.filter(item => item.id !== player.id) }))} aria-label={`Eliminar ${player.name}`}><X size={16}/></button></div>)}{!data.profiles.length && <div className="empty-state">Aún no hay perfiles. Añade a la primera persona para empezar.</div>}</div><button className="primary-cta wide-cta" disabled={!data.profiles.length} onClick={() => setPage('play')}>IR A LA PARTIDA <ArrowRight size={17}/></button>{notice && <p className="inline-notice">{notice}</p>}</section>}
      {page === 'play' && <section className="group-columns"><div className="panel round-panel"><div className="panel-heading"><span className="eyebrow">REGISTRO DE RONDA</span><h2>¿Quién atrapó la carta?</h2><p>Elige a quien ganó físicamente la ronda.</p></div><div className="winner-grid">{data.profiles.map((player, index) => <button key={player.id} className={`winner-option ${selectedWinner === player.id ? 'selected' : ''}`} onClick={() => setSelectedWinner(player.id)}><span className={`avatar avatar-${index % 5}`}>{player.name.slice(0, 1).toUpperCase()}</span><strong>{player.name}</strong>{selectedWinner === player.id && <Check size={17}/>}</button>)}{!data.profiles.length && <button className="add-inline-player" onClick={() => setPage('players')}><Plus size={17}/> CREA PERFILES PARA JUGAR</button>}</div><div className="card-points"><div className="points-head"><div><span className="eyebrow">LA CARTA OBTENIDA</span><p>Valor de la esquina de la carta</p></div><button className="settings-button" onClick={() => setPage('settings')}><Settings2 size={16}/><span>EDITAR VALORES</span></button></div><div className="card-value-row"><label>Carta<select value={cardValue} onChange={e => selectCard(e.target.value)}>{Object.keys(data.cardValues).sort((a, b) => Number(a) - Number(b)).map(key => <option key={key} value={key}>{key} moneda{key === '1' ? '' : 's'}</option>)}</select><ChevronDown size={14}/></label><span className="value-equals">=</span><label className="points-input">Monedas<input type="number" min="0" value={cardPoints} onChange={e => setCardPoints(e.target.value)}/><Coins size={15}/></label></div></div><button className="primary-cta wide-cta" disabled={!selectedWinner} onClick={addRound}>GUARDAR ESTA RONDA <Check size={17}/></button>{notice && <p className="inline-notice">{notice}</p>}</div>
        <aside className="panel rounds-panel"><div className="points-summary"><span className="eyebrow">ESTA PARTIDA</span><strong>{rounds.length}<small> rondas</small></strong><span>{rounds.reduce((sum, round) => sum + Number(round.points), 0)} monedas registradas</span></div><div className="round-history"><div className="history-heading"><span>ÚLTIMAS RONDAS</span><span>CARTA</span></div>{[...rounds].reverse().slice(0, 8).map((round, index) => <div className="history-row" key={round.id}><span className="history-number">{String(rounds.length - index).padStart(2, '0')}</span><strong>{data.profiles.find(player => player.id === round.winnerId)?.name || 'Perfil eliminado'}</strong><span className="history-points">+{round.points}<small> 🪙</small></span></div>)}{!rounds.length && <div className="history-empty">Las rondas que registres aparecerán aquí.</div>}</div><button className="finish-button" disabled={!rounds.length} onClick={saveSession}>VER RANKING FINAL <Trophy size={16}/></button><button className="end-link" onClick={saveSession}>Terminar y ver resultados</button></aside></section>}
      {page === 'ranking' && <section className="panel ranking-panel"><div className="ranking-header"><div><span className="eyebrow">PARTIDA · {rounds.length} RONDAS</span><h2>El tesoro queda así.</h2><p>Los empates comparten posición. Se ordena por monedas acumuladas.</p></div><div className="trophy-stamp"><Trophy size={24}/></div></div><div className="leaderboard">{leaderboard.map((player, index) => <div className={`leader-row ${index === 0 && player.points > 0 ? 'leader-first' : ''}`} key={player.id}><span className="rank-number">{String(player.rank).padStart(2, '0')}</span><span className={`avatar avatar-${index % 5}`}>{player.name.slice(0, 1).toUpperCase()}</span><strong>{player.name}{player.rank === 1 && player.points === topScore && <small>{player.points > 0 ? ' · LÍDER' : ' · EMPATE'}</small>}</strong><span className="win-count">{player.wins} carta{player.wins === 1 ? '' : 's'}</span><span className="score">{player.points}<small> 🪙</small></span></div>)}{!leaderboard.length && <div className="empty-state">Crea perfiles y registra rondas para ver resultados.</div>}</div><label className="session-title">Nombre de la partida<input value={sessionTitle} onChange={e => setSessionTitle(e.target.value)}/></label><div className="ranking-actions"><button className="secondary-cta" onClick={() => setPage('play')}><ArrowLeft size={16}/> VOLVER A RONDAS</button><button className="primary-cta" onClick={saveSession}>GUARDAR PARTIDA <Check size={16}/></button></div><div className="saved-sessions"><span>PARTIDAS GUARDADAS EN ESTE TELÉFONO</span>{data.sessions.length ? data.sessions.slice(0, 5).map(session => <div key={session.id}><strong>{session.title}</strong><small>{new Date(session.date).toLocaleDateString('es-CO')} · {session.rounds.length} rondas</small></div>) : <p>La partida aparecerá aquí cuando la guardes.</p>}</div></section>}
      {page === 'settings' && <section className="panel settings-panel"><div className="panel-heading"><span className="eyebrow">PUNTUACIÓN · EDITABLE</span><h2>Valor de cada carta</h2><p>El reglamento indica el valor en la esquina. Ajusta los valores según las cartas que tienes.</p></div><div className="value-list">{Object.entries(data.cardValues).sort((a, b) => Number(a[0]) - Number(b[0])).map(([key, points]) => <div key={key}><span>Carta de {key} moneda{key === '1' ? '' : 's'}</span><input type="number" min="0" value={points} onChange={e => setData(current => ({ ...current, cardValues: { ...current.cardValues, [key]: Math.max(0, Number(e.target.value)) } }))}/><Coins size={16}/></div>)}</div><form className="new-value" onSubmit={e => { e.preventDefault(); saveCardValue(); }}><input aria-label="Nueva categoría de carta" placeholder="Otra carta, ej. 5" value={newValueKey} onChange={e => setNewValueKey(e.target.value)}/><input aria-label="Monedas de la categoría" type="number" min="0" placeholder="Monedas" value={newValuePoints} onChange={e => setNewValuePoints(e.target.value)}/><button className="primary-cta"><Plus size={15}/> AÑADIR</button></form><button className="secondary-cta" onClick={() => setPage('play')}><ArrowLeft size={16}/> VOLVER A LA RONDA</button></section>}
    </main>}

    {mode === 'profiles' && <main className="group-layout"><div className="group-top"><button className="back-button" onClick={() => setMode('madaHome')}><ArrowLeft size={16}/> INICIO</button><div><span className="mode-kicker">DATOS LOCALES</span><h1>Perfiles guardados</h1></div></div><section className="panel players-panel"><div className="panel-heading"><span className="eyebrow">SOLO EN ESTE TELÉFONO</span><h2>Jugadores</h2><p>Los perfiles y el historial no se suben a ningún servidor.</p></div><form className="add-profile" onSubmit={e => { e.preventDefault(); addProfile(); }}><input value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="Nombre del jugador"/><button className="primary-cta"><Plus size={17}/> AÑADIR</button></form><div className="player-list">{data.profiles.map((player, index) => <div className="player-row" key={player.id}><span className={`avatar avatar-${index % 5}`}>{player.name.slice(0, 1).toUpperCase()}</span><strong>{player.name}</strong><span className="saved-label">PERFIL GUARDADO</span><button className="remove-player" onClick={() => setData(current => ({ ...current, profiles: current.profiles.filter(item => item.id !== player.id) }))} aria-label={`Eliminar ${player.name}`}><X size={16}/></button></div>)}{!data.profiles.length && <div className="empty-state">Aún no hay perfiles guardados.</div>}</div><h3 className="session-section-title">Partidas recientes</h3><div className="saved-sessions full-sessions">{data.sessions.length ? data.sessions.map(session => <div key={session.id}><strong>{session.title}</strong><small>{new Date(session.date).toLocaleDateString('es-CO')} · {session.rounds.length} rondas · {session.players.length} jugadores</small></div>) : <p>Las partidas terminadas aparecerán aquí.</p>}</div></section></main>}
    {mode !== 'darkQuartz' && mode !== 'pentaSelect' && mode !== 'penta' && <footer className="footer"><span>DACO ARTS <i>·</i> DARK QUARTZ</span><span>HECHO PARA JUGAR JUNTOS <b>✳</b></span></footer>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);

if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
