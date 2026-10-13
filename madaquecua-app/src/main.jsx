import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowRight, Bell, Check, ChevronDown, CircleHelp, Clock3, Coins, Crown, Plus, RotateCcw, Settings2, Shuffle, Trophy, Users, X } from 'lucide-react';
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
  const [mode, setMode] = useState('home');
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

  useEffect(() => { localStorage.setItem(STORE, JSON.stringify(data)); }, [data]);
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

  return <div className={`app ${timerState === 'finished' && mode === 'solo' ? 'time-up' : ''}`}>
    <header className="topbar"><a className="brand" href="#" onClick={e => { e.preventDefault(); setMode('home'); setTimerState('idle'); }}><span className="brand-mark">DA</span><span>DACO ARTS<small>JUEGO 001 · BOGOTÁ</small></span></a><span className="offline-chip"><i/> SE GUARDA EN ESTE TELÉFONO</span></header>
    {mode === 'home' && <main className="home-layout">
      <section className="welcome"><div className="welcome-art"><img src="/madaquecua-cover.png" alt="La isla de ¿Madaquecua?"/><span className="art-stamp">OBSERVA<br/>Y ATRÁPALO</span></div><div className="welcome-copy"><div className="eyebrow"><span/> COMPAÑERA DE JUEGO ARTESANAL</div><h1>¿Mada<br/><em>quecua?</em></h1><p>Mira bien. Piensa rápido. Lleva la cuenta de cada partida alrededor de la mesa.</p><div className="home-stats"><span><b>01</b> RETO CONTRARRELOJ</span><span><b>02</b> MODO MULTIJUGADOR</span></div></div></section>
      <section className="mode-grid"><button className="mode-card solo-card" onClick={startSolo}><div className="mode-icon"><Clock3/></div><span className="mode-kicker">01 · CONTRARRELOJ</span><h2>Un jugador</h2><p>Encadena retos de observación durante 60 segundos.</p><span className="mode-action">EMPEZAR RETO <ArrowRight size={16}/></span><span className="mode-deco">60</span></button><button className="mode-card group-card" onClick={startGroup}><div className="mode-icon"><Users/></div><span className="mode-kicker">02 · JUEGUEN EN MESA</span><h2>Multijugador</h2><p>Registra perfiles, ganadores y monedas carta por carta.</p><span className="mode-action">ARMAR PARTIDA <ArrowRight size={16}/></span><span className="mode-deco group-deco">✳</span></button></section>
      <section className="home-bottom"><div className="hint"><CircleHelp size={19}/><p><strong>Inspirado en las reglas impresas.</strong><br/>El juego físico propone cinco figuras y que cada carta tiene un valor en monedas.</p></div><button className="text-button" onClick={() => setMode('profiles')}>PERFILES GUARDADOS <ArrowRight size={14}/></button></section>
    </main>}

    {mode === 'solo' && <main className={`solo-screen ${timerState === 'finished' ? 'expired' : ''}`}>
      <div className="play-top"><button className="back-button" onClick={() => { setMode('home'); setTimerState('idle'); }}><ArrowLeft size={16}/> VOLVER</button><div className="timer-wrap"><span className="timer-label">TIEMPO DE RETO</span><span className="timer-digits">00:{String(timeLeft).padStart(2, '0')}</span></div><button className={`sound-button ${soundOn ? 'sound-on' : ''}`} onClick={() => setSoundOn(!soundOn)} aria-label={soundOn ? 'Silenciar alarma' : 'Activar alarma'}><Bell size={17}/><span>{soundOn ? 'ALARMA ACTIVA' : 'ALARMA SILENCIADA'}</span></button></div>
      {timerState === 'finished' ? <section className="timeup-card" role="alert"><div className="timeup-symbol">!</div><span className="mode-kicker">EL TIEMPO SE ACABÓ</span><h1>¡Tiempo!</h1><p>Respira un momento. ¿Listo para una nueva ronda?</p><button className="light-cta" onClick={() => { setTimeLeft(60); setChallenge(makeChallenge()); setTimerState('running'); }}>OTRA RONDA <RotateCcw size={16}/></button><button className="secondary-light" onClick={() => { setMode('home'); setTimerState('idle'); }}>VOLVER AL INICIO</button></section> : <>
        <div className="solo-heading"><span>RETO {Math.floor((60 - timeLeft) / 8) + 1} · OBSERVA ANTES DE ELEGIR</span><h1>¿Qué figura falta?</h1><p>Encuentra la figura que no aparece por su forma <em>ni</em> por su color.</p></div>
        <section className="challenge-card"><div className="challenge-top"><span>LA ISLA CAMBIA SUS PISTAS</span><Shuffle size={15}/></div><div className="scene-figures">{FIGURES.filter(item => item.id !== challenge.target.id).map((item, index) => <div className={`scene-figure figure-${index}`} key={item.id}><span className={`figure-emoji ${item.id}`}>{item.emoji}</span><b>{item.name}</b></div>)}</div><div className="scene-question"><span>LA CARTA PISTA DICE</span><strong>{challenge.target.shape.toUpperCase()} {challenge.target.color.toUpperCase()}</strong></div></section>
        <div className="answer-title">¿CUÁL NO ESTÁ EN LA ISLA?</div><div className="answer-grid">{challenge.options.map(item => <button key={item.id} className="answer-button" onClick={() => { if (item.id === challenge.missing.id) setNotice('¡Correcto! Sigue observando.'); else setNotice('Casi. Mira otra vez la forma y el color.'); setChallenge(makeChallenge()); window.setTimeout(() => setNotice(''), 1000); }}><span>{item.emoji}</span><strong>{item.name}</strong><ArrowRight size={15}/></button>)}</div><div className="solo-footer"><span><i className="pulse"/> EL RETO SIGUE CORRIENDO</span><span>APUNTA A LA FIGURA · RESPONDE EN VOZ ALTA</span></div>{notice && <div className="toast">{notice}</div>}</>}
    </main>}

    {mode === 'group' && <main className="group-layout">
      <div className="group-top"><button className="back-button" onClick={() => setMode('home')}><ArrowLeft size={16}/> INICIO</button><div><span className="mode-kicker">MODO MULTIJUGADOR</span><h1>{page === 'players' ? 'La mesa' : page === 'ranking' ? 'Resultados' : 'A jugar'}</h1></div><div className="round-count"><span>RONDA</span><strong>{String(rounds.length + 1).padStart(2, '0')}</strong></div></div>
      <nav className="step-tabs"><button className={page === 'players' ? 'active' : ''} onClick={() => setPage('players')}><Users size={15}/> JUGADORES</button><button className={page === 'play' ? 'active' : ''} onClick={() => setPage('play')}><Coins size={15}/> RONDAS <span>{rounds.length || ''}</span></button><button className={page === 'ranking' ? 'active' : ''} onClick={() => setPage('ranking')}><Trophy size={15}/> RANKING</button></nav>
      {page === 'players' && <section className="panel players-panel"><div className="panel-heading"><span className="eyebrow">PREPARACIÓN · PERFÍLES LOCALES</span><h2>¿Quiénes juegan?</h2><p>Los nombres quedan guardados en este teléfono para próximas partidas.</p></div><form className="add-profile" onSubmit={e => { e.preventDefault(); addProfile(); }}><label className="sr-only" htmlFor="profile-name">Nombre del jugador</label><input id="profile-name" value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="Escribe un nombre"/><button className="primary-cta" type="submit"><Plus size={17}/> AÑADIR</button></form><div className="player-list">{data.profiles.map((player, index) => <div className="player-row" key={player.id}><span className={`avatar avatar-${index % 5}`}>{player.name.slice(0, 1).toUpperCase()}</span><strong>{player.name}</strong><span className="saved-label">PERFIL GUARDADO</span><button className="remove-player" onClick={() => setData(current => ({ ...current, profiles: current.profiles.filter(item => item.id !== player.id) }))} aria-label={`Eliminar ${player.name}`}><X size={16}/></button></div>)}{!data.profiles.length && <div className="empty-state">Aún no hay perfiles. Añade a la primera persona para empezar.</div>}</div><button className="primary-cta wide-cta" disabled={!data.profiles.length} onClick={() => setPage('play')}>IR A LA PARTIDA <ArrowRight size={17}/></button>{notice && <p className="inline-notice">{notice}</p>}</section>}
      {page === 'play' && <section className="group-columns"><div className="panel round-panel"><div className="panel-heading"><span className="eyebrow">REGISTRO DE RONDA</span><h2>¿Quién atrapó la carta?</h2><p>Elige a quien ganó físicamente la ronda.</p></div><div className="winner-grid">{data.profiles.map((player, index) => <button key={player.id} className={`winner-option ${selectedWinner === player.id ? 'selected' : ''}`} onClick={() => setSelectedWinner(player.id)}><span className={`avatar avatar-${index % 5}`}>{player.name.slice(0, 1).toUpperCase()}</span><strong>{player.name}</strong>{selectedWinner === player.id && <Check size={17}/>}</button>)}{!data.profiles.length && <button className="add-inline-player" onClick={() => setPage('players')}><Plus size={17}/> CREA PERFILES PARA JUGAR</button>}</div><div className="card-points"><div className="points-head"><div><span className="eyebrow">LA CARTA OBTENIDA</span><p>Valor de la esquina de la carta</p></div><button className="settings-button" onClick={() => setPage('settings')}><Settings2 size={16}/><span>EDITAR VALORES</span></button></div><div className="card-value-row"><label>Carta<select value={cardValue} onChange={e => selectCard(e.target.value)}>{Object.keys(data.cardValues).sort((a, b) => Number(a) - Number(b)).map(key => <option key={key} value={key}>{key} moneda{key === '1' ? '' : 's'}</option>)}</select><ChevronDown size={14}/></label><span className="value-equals">=</span><label className="points-input">Monedas<input type="number" min="0" value={cardPoints} onChange={e => setCardPoints(e.target.value)}/><Coins size={15}/></label></div></div><button className="primary-cta wide-cta" disabled={!selectedWinner} onClick={addRound}>GUARDAR ESTA RONDA <Check size={17}/></button>{notice && <p className="inline-notice">{notice}</p>}</div>
        <aside className="panel rounds-panel"><div className="points-summary"><span className="eyebrow">ESTA PARTIDA</span><strong>{rounds.length}<small> rondas</small></strong><span>{rounds.reduce((sum, round) => sum + Number(round.points), 0)} monedas registradas</span></div><div className="round-history"><div className="history-heading"><span>ÚLTIMAS RONDAS</span><span>CARTA</span></div>{[...rounds].reverse().slice(0, 8).map((round, index) => <div className="history-row" key={round.id}><span className="history-number">{String(rounds.length - index).padStart(2, '0')}</span><strong>{data.profiles.find(player => player.id === round.winnerId)?.name || 'Perfil eliminado'}</strong><span className="history-points">+{round.points}<small> 🪙</small></span></div>)}{!rounds.length && <div className="history-empty">Las rondas que registres aparecerán aquí.</div>}</div><button className="finish-button" disabled={!rounds.length} onClick={saveSession}>VER RANKING FINAL <Trophy size={16}/></button><button className="end-link" onClick={saveSession}>Terminar y ver resultados</button></aside></section>}
      {page === 'ranking' && <section className="panel ranking-panel"><div className="ranking-header"><div><span className="eyebrow">PARTIDA · {rounds.length} RONDAS</span><h2>El tesoro queda así.</h2><p>Los empates comparten posición. Se ordena por monedas acumuladas.</p></div><div className="trophy-stamp"><Trophy size={24}/></div></div><div className="leaderboard">{leaderboard.map((player, index) => <div className={`leader-row ${index === 0 && player.points > 0 ? 'leader-first' : ''}`} key={player.id}><span className="rank-number">{String(player.rank).padStart(2, '0')}</span><span className={`avatar avatar-${index % 5}`}>{player.name.slice(0, 1).toUpperCase()}</span><strong>{player.name}{player.rank === 1 && player.points === topScore && <small>{player.points > 0 ? ' · LÍDER' : ' · EMPATE'}</small>}</strong><span className="win-count">{player.wins} carta{player.wins === 1 ? '' : 's'}</span><span className="score">{player.points}<small> 🪙</small></span></div>)}{!leaderboard.length && <div className="empty-state">Crea perfiles y registra rondas para ver resultados.</div>}</div><label className="session-title">Nombre de la partida<input value={sessionTitle} onChange={e => setSessionTitle(e.target.value)}/></label><div className="ranking-actions"><button className="secondary-cta" onClick={() => setPage('play')}><ArrowLeft size={16}/> VOLVER A RONDAS</button><button className="primary-cta" onClick={saveSession}>GUARDAR PARTIDA <Check size={16}/></button></div><div className="saved-sessions"><span>PARTIDAS GUARDADAS EN ESTE TELÉFONO</span>{data.sessions.length ? data.sessions.slice(0, 5).map(session => <div key={session.id}><strong>{session.title}</strong><small>{new Date(session.date).toLocaleDateString('es-CO')} · {session.rounds.length} rondas</small></div>) : <p>La partida aparecerá aquí cuando la guardes.</p>}</div></section>}
      {page === 'settings' && <section className="panel settings-panel"><div className="panel-heading"><span className="eyebrow">PUNTUACIÓN · EDITABLE</span><h2>Valor de cada carta</h2><p>El reglamento indica el valor en la esquina. Ajusta los valores según las cartas que tienes.</p></div><div className="value-list">{Object.entries(data.cardValues).sort((a, b) => Number(a[0]) - Number(b[0])).map(([key, points]) => <div key={key}><span>Carta de {key} moneda{key === '1' ? '' : 's'}</span><input type="number" min="0" value={points} onChange={e => setData(current => ({ ...current, cardValues: { ...current.cardValues, [key]: Math.max(0, Number(e.target.value)) } }))}/><Coins size={16}/></div>)}</div><form className="new-value" onSubmit={e => { e.preventDefault(); saveCardValue(); }}><input aria-label="Nueva categoría de carta" placeholder="Otra carta, ej. 5" value={newValueKey} onChange={e => setNewValueKey(e.target.value)}/><input aria-label="Monedas de la categoría" type="number" min="0" placeholder="Monedas" value={newValuePoints} onChange={e => setNewValuePoints(e.target.value)}/><button className="primary-cta"><Plus size={15}/> AÑADIR</button></form><button className="secondary-cta" onClick={() => setPage('play')}><ArrowLeft size={16}/> VOLVER A LA RONDA</button></section>}
    </main>}

    {mode === 'profiles' && <main className="group-layout"><div className="group-top"><button className="back-button" onClick={() => setMode('home')}><ArrowLeft size={16}/> INICIO</button><div><span className="mode-kicker">DATOS LOCALES</span><h1>Perfiles guardados</h1></div></div><section className="panel players-panel"><div className="panel-heading"><span className="eyebrow">SOLO EN ESTE TELÉFONO</span><h2>Jugadores</h2><p>Los perfiles y el historial no se suben a ningún servidor.</p></div><form className="add-profile" onSubmit={e => { e.preventDefault(); addProfile(); }}><input value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="Nombre del jugador"/><button className="primary-cta"><Plus size={17}/> AÑADIR</button></form><div className="player-list">{data.profiles.map((player, index) => <div className="player-row" key={player.id}><span className={`avatar avatar-${index % 5}`}>{player.name.slice(0, 1).toUpperCase()}</span><strong>{player.name}</strong><span className="saved-label">PERFIL GUARDADO</span><button className="remove-player" onClick={() => setData(current => ({ ...current, profiles: current.profiles.filter(item => item.id !== player.id) }))} aria-label={`Eliminar ${player.name}`}><X size={16}/></button></div>)}{!data.profiles.length && <div className="empty-state">Aún no hay perfiles guardados.</div>}</div><h3 className="session-section-title">Partidas recientes</h3><div className="saved-sessions full-sessions">{data.sessions.length ? data.sessions.map(session => <div key={session.id}><strong>{session.title}</strong><small>{new Date(session.date).toLocaleDateString('es-CO')} · {session.rounds.length} rondas · {session.players.length} jugadores</small></div>) : <p>Las partidas terminadas aparecerán aquí.</p>}</div></section></main>}
    <footer className="footer"><span>DACO ARTS <i>·</i> ¿MADAQUECUA?</span><span>HECHO PARA JUGAR JUNTOS <b>✳</b></span></footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);

if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
