import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import AvatarDisplay from '../components/AvatarDisplay';
import IRPBar from '../components/IRPBar';

/* ─── Mascot ─── */
function Mascot({ state, message }) {
  const expressions = { happy: '😺', excited: '😸', worried: '😿', scared: '🙀', celebrating: '😻', hint: '🐱' };
  return (
    <motion.div
      initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }}
      className="fixed bottom-4 left-4 z-40 flex items-end gap-2"
    >
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity }}
        className="text-4xl cursor-default select-none">{expressions[state] || '😺'}</motion.div>
      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="glass-card px-3 py-2 max-w-[200px] text-xs text-white/80 mb-2">{message}</motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Power Bars ─── */
function PowerPanel({ powers, onActivate }) {
  return (
    <div className="flex flex-col gap-2">
      {Object.values(powers).map((p) => (
        <motion.button key={p.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => p.energy >= 100 && onActivate(p.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
            p.energy >= 100 ? 'glass-card border border-white/20 cursor-pointer' : 'bg-white/5 cursor-default'}`}
        >
          <span>{p.icon}</span>
          <div className="flex-1">
            <div className="flex justify-between mb-0.5">
              <span className="text-[10px] font-semibold text-white/60">{p.name}</span>
              <span className="text-[10px]" style={{ color: p.color }}>{Math.round(p.energy)}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ backgroundColor: p.color }}
                animate={{ width: `${p.energy}%` }} transition={{ duration: 0.5 }} />
            </div>
          </div>
          {p.energy >= 100 && <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}
            className="text-xs">✨</motion.span>}
        </motion.button>
      ))}
    </div>
  );
}

/* ─── Event Timer ─── */
function EventTimer({ seconds, onExpire }) {
  const [time, setTime] = useState(seconds);
  useEffect(() => {
    if (time <= 0) { onExpire(); return; }
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [time, onExpire]);

  const pct = (time / seconds) * 100;
  const color = pct > 50 ? '#22C55E' : pct > 25 ? '#FACC15' : '#EF4444';
  return (
    <div className="flex items-center gap-2">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5, repeat: Infinity }}
        className="text-lg">⏱️</motion.div>
      <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
          animate={{ width: `${pct}%` }} transition={{ duration: 0.3 }} />
      </div>
      <span className="text-sm font-bold" style={{ color }}>{time}s</span>
    </div>
  );
}

/* ─── Badge Toast ─── */
function BadgeToast({ badge, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div initial={{ y: -80, opacity: 0, scale: 0.8 }} animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -80, opacity: 0 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] glass-card px-6 py-4 border-2 border-vibrant-yellow/40 text-center"
    >
      <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.6 }} className="text-4xl mb-1">{badge.icon}</motion.div>
      <p className="text-vibrant-yellow font-bold text-sm">¡Insignia Desbloqueada!</p>
      <p className="text-white text-xs mt-1">{badge.name}</p>
    </motion.div>
  );
}

/* ─── Alt Future Modal ─── */
function AltFutureModal({ text, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} onClick={(e) => e.stopPropagation()}
        className="glass-card p-6 max-w-md border-2 border-deep-purple/40 text-center">
        <span className="text-3xl">🔮</span>
        <h3 className="text-lg font-bold mt-2 text-deep-purple">¿Y si hubieras elegido diferente?</h3>
        <p className="text-white/70 text-sm mt-3 leading-relaxed">{text}</p>
        <button onClick={onClose} className="mt-4 px-5 py-2 bg-deep-purple/20 border border-deep-purple/30 rounded-xl text-sm text-white font-semibold hover:bg-deep-purple/30 transition-all">Entendido</button>
      </motion.div>
    </motion.div>
  );
}

/* ─── Confetti ─── */
function Confetti() {
  return (
    <>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div key={i}
          initial={{ opacity: 1, x: '50vw', y: '50vh', scale: 0 }}
          animate={{ opacity: 0, x: `${20 + Math.random() * 60}vw`, y: `${Math.random() * 100}vh`, scale: Math.random() + 0.5, rotate: Math.random() * 360 }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: i * 0.03 }}
          className="fixed pointer-events-none z-[58] w-2.5 h-2.5 rounded-sm"
          style={{ backgroundColor: ['#22C55E', '#2563EB', '#FACC15', '#F97316', '#7C3AED', '#EF4444', '#06B6D4'][i % 7] }} />
      ))}
    </>
  );
}

/* ─── Room Card in House Map ─── */
function RoomCard({ room, visited, eventsLeft, active, onClick, activePower }) {
  const allDone = eventsLeft === 0;
  return (
    <motion.button whileHover={{ scale: 1.08, y: -5 }} whileTap={{ scale: 0.95 }} onClick={onClick}
      className={`relative glass-card p-4 md:p-5 text-center transition-all min-w-[120px] ${
        active ? 'border-2 ring-2 ring-offset-2 ring-offset-dark-bg' : 'border border-white/10'
      } ${allDone ? 'opacity-60' : ''}`}
      style={active ? { borderColor: room.color, ringColor: room.color } : {}}
    >
      {activePower && eventsLeft > 0 && (
        <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl" style={{ boxShadow: `inset 0 0 20px ${room.color}40` }} />
      )}
      <motion.span animate={!allDone ? { y: [0, -4, 0] } : {}} transition={{ duration: 2, repeat: Infinity }}
        className="text-3xl md:text-4xl block mb-2">{room.icon}</motion.span>
      <p className="text-xs md:text-sm font-bold text-white">{room.name}</p>
      <div className="flex items-center justify-center gap-1 mt-1.5">
        {visited && <span className="text-[10px]">✅</span>}
        {eventsLeft > 0 ? (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10" style={{ color: room.color }}>{eventsLeft} evento{eventsLeft > 1 ? 's' : ''}</span>
        ) : (
          <span className="text-[10px] text-white/30">Completa</span>
        )}
      </div>
    </motion.button>
  );
}

/* ─── Scene Illustrations ─── */
const EVENT_SCENES = {
  k1: { emoji: '🍲', bg: 'from-orange-500/20 to-red-500/10', scene: '🔥🍳💨', label: 'Olla hirviendo en la estufa' },
  k2: { emoji: '📦', bg: 'from-yellow-500/20 to-orange-500/10', scene: '⚡🍽️✨', label: 'Plato metálico en microondas' },
  k3: { emoji: '💨', bg: 'from-red-500/20 to-orange-500/10', scene: '🔥💨⚠️', label: 'Fuga de gas en cocina' },
  s1: { emoji: '🔌', bg: 'from-blue-500/20 to-cyan-500/10', scene: '⚡🔌📎', label: 'Enchufe sin protección' },
  s2: { emoji: '⚡', bg: 'from-yellow-500/20 to-blue-500/10', scene: '⚡🔧💥', label: 'Cable pelado con corriente' },
  s3: { emoji: '👕', bg: 'from-red-400/20 to-orange-400/10', scene: '🔥👕♨️', label: 'Plancha caliente olvidada' },
  b1: { emoji: '🚿', bg: 'from-cyan-500/20 to-blue-500/10', scene: '🚿💨🌡️', label: 'Agua muy caliente' },
  b2: { emoji: '💨', bg: 'from-cyan-400/20 to-yellow-400/10', scene: '💨💧⚡', label: 'Secadora cerca del agua' },
  d1: { emoji: '🔦', bg: 'from-orange-500/20 to-yellow-500/10', scene: '🔥🧒🤔', label: 'Encendedor encontrado' },
  d2: { emoji: '🕯️', bg: 'from-amber-500/20 to-red-400/10', scene: '🕯️🔥🪟', label: 'Velas cerca de cortinas' },
  p1: { emoji: '🎆', bg: 'from-purple-500/20 to-red-500/10', scene: '🎆🧨💥', label: 'Pirotecnia sin supervisión' },
  p2: { emoji: '🔴', bg: 'from-red-500/20 to-orange-500/10', scene: '🔥📄💨', label: 'Fósforos cerca de papel' },
};

/* ─── Event Panel ─── */
function EventPanel({ event, onDecision, selectedDecision, showFeedback, feedbackDecision, onContinue, onAltFuture, timerExpired }) {
  const scene = EVENT_SCENES[event.id] || { emoji: event.icon, bg: 'from-white/10 to-white/5', scene: event.icon, label: '' };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="glass-card p-5 md:p-6 w-full">

      {/* Scene Illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative rounded-2xl bg-gradient-to-br ${scene.bg} p-6 mb-5 text-center overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <motion.div
          animate={{ y: [0, -6, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl md:text-7xl mb-2 relative z-10"
        >
          {scene.emoji}
        </motion.div>
        <div className="text-3xl md:text-4xl tracking-widest relative z-10 mb-2">{scene.scene}</div>
        <p className="text-white/40 text-xs font-medium relative z-10">{scene.label}</p>
      </motion.div>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{event.icon}</span>
        <div className="flex-1">
          <h3 className="text-lg font-bold">{event.title}</h3>
          {event.type === 'surprise' && <span className="text-[10px] px-2 py-0.5 bg-bright-orange/20 text-bright-orange rounded-full font-bold">⚡ EVENTO SORPRESA</span>}
        </div>
      </div>

      {event.timerSeconds && !selectedDecision && !timerExpired && (
        <div className="mb-4"><EventTimer seconds={event.timerSeconds} onExpire={() => {}} /></div>
      )}

      <p className="text-white/70 text-sm mb-5 leading-relaxed">{event.description}</p>

      <div className="space-y-2">
        {event.decisions.map((d) => (
          <motion.button key={d.id} whileHover={!selectedDecision ? { scale: 1.01, x: 4 } : {}}
            whileTap={!selectedDecision ? { scale: 0.98 } : {}}
            onClick={() => !selectedDecision && onDecision(d)} disabled={!!selectedDecision}
            className={`w-full text-left p-3 rounded-xl border-2 transition-all text-sm ${
              selectedDecision?.id === d.id
                ? d.riskDelta <= 0 ? 'border-neon-green bg-neon-green/10' : 'border-bright-orange bg-bright-orange/10'
                : selectedDecision ? 'border-white/5 bg-white/[0.02] text-white/30' : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <span className="font-medium">{d.text}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showFeedback && feedbackDecision && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-start gap-2 mb-3">
              <span className="text-xl">{feedbackDecision.riskDelta <= 0 ? '🛡️' : '💡'}</span>
              <div>
                <p className={`text-sm font-bold ${feedbackDecision.riskDelta <= 0 ? 'text-neon-green' : 'text-bright-orange'}`}>
                  {feedbackDecision.riskDelta <= 0 ? '¡Buena decisión!' : 'Hmm, cuidado...'}</p>
                <p className="text-white/60 text-xs mt-1">{feedbackDecision.narrativeImpact}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => onAltFuture(feedbackDecision.altFuture)}
                className="px-3 py-1.5 bg-deep-purple/20 border border-deep-purple/30 rounded-lg text-xs text-white/70 hover:text-white transition-all">
                🔮 ¿Y si...?
              </button>
              <button onClick={onContinue}
                className="px-4 py-1.5 bg-gradient-to-r from-electric-blue to-deep-purple text-white font-semibold rounded-lg text-xs ml-auto">
                Continuar →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── MAIN SIMULATOR ─── */
export default function Simulator() {
  const navigate = useNavigate();
  const store = useStore();
  const {
    irp, avatar, rooms, currentRoom, visitedRooms, powers, activePower,
    mascotState, mascotMessage, activeEvent, completedEvents,
    showAltFuture, altFutureText, newBadge, simulationComplete,
  } = store;

  const [selectedDecision, setSelectedDecision] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);

  const getEnvStyle = useCallback(() => {
    if (irp <= 25) return { bg: 'from-green-950/30 to-dark-bg', brightness: 1.1 };
    if (irp <= 50) return { bg: 'from-dark-bg to-dark-bg', brightness: 1 };
    if (irp <= 75) return { bg: 'from-orange-950/20 to-dark-bg', brightness: 0.95 };
    return { bg: 'from-red-950/20 to-dark-bg', brightness: 0.9 };
  }, [irp]);

  const envStyle = getEnvStyle();

  const getAvailableEvents = (roomId) => {
    return (store.roomEvents[roomId] || []).filter((e) => !completedEvents.includes(e.id));
  };

  const handleRoomClick = (roomId) => {
    if (currentRoom === roomId && activeEvent) return;
    store.setCurrentRoom(roomId);
    const avail = getAvailableEvents(roomId);
    if (avail.length > 0) {
      const surprise = avail.find((e) => e.type === 'surprise');
      const chosen = (Math.random() < 0.4 && surprise) ? surprise : avail[0];
      store.setActiveEvent(chosen);
      if (chosen.type === 'surprise') store.setMascotState('scared');
      else store.setMascotState('hint', `Cuidado en ${rooms[roomId].name}...`);
    } else {
      store.setActiveEvent(null);
      store.setMascotState('happy', `${rooms[roomId].name} está segura. ¡Bien hecho!`);
    }
    setSelectedDecision(null);
    setShowFeedback(false);
    setTimerExpired(false);
  };

  const handleDecision = (decision) => {
    setSelectedDecision(decision);
    store.updateIRP(decision.riskDelta, decision.weight, activeEvent.category);
    store.addDecision(activeEvent.id, decision, currentRoom);
    setShowFeedback(true);

    if (decision.riskDelta <= 0) {
      store.setMascotState('excited');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      store.setMascotState('worried');
    }
    store.checkBadges();
  };

  const handleContinue = () => {
    const justCompletedId = activeEvent.id;
    store.completeEvent(justCompletedId);
    setSelectedDecision(null);
    setShowFeedback(false);

    const remaining = (store.roomEvents[currentRoom] || []).filter(
      (e) => !completedEvents.includes(e.id) && e.id !== justCompletedId
    );
    if (remaining.length > 0) {
      store.setActiveEvent(remaining[0]);
      store.setMascotState('hint', 'Hay algo más aquí...');
    } else {
      store.setActiveEvent(null);
      store.setMascotState('happy', '¡Habitación completada! Explora otra.');

      const allEvents = Object.values(store.roomEvents).flat();
      const allDone = allEvents.every((e) => [...completedEvents, justCompletedId].includes(e.id));
      if (allDone) {
        store.checkBadges();
        store.setSimulationComplete(true);
        setTimeout(() => navigate('/results'), 1500);
      }
    }
  };

  const totalEvents = Object.values(store.roomEvents).flat().length;
  const doneCount = completedEvents.length;
  const progress = (doneCount / totalEvents) * 100;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${envStyle.bg} transition-all duration-1000`}>
      {/* Env tint overlay */}
      <div className="fixed inset-0 pointer-events-none transition-all duration-1000"
        style={{ filter: `brightness(${envStyle.brightness})` }} />

      {/* Top HUD */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7"><AvatarDisplay avatar={avatar} size={28} animate={false} /></div>
            <span className="text-xs font-semibold text-white/60 hidden sm:block">{avatar.name}</span>
          </div>
          <IRPBar compact />
          <div className="text-xs text-white/40">{doneCount}/{totalEvents}</div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { store.setSimulationComplete(true); navigate('/results'); }}
            className="px-3 py-1.5 bg-white/10 text-white/50 font-semibold rounded-lg border border-white/10 hover:bg-white/20 hover:text-white transition-all text-[10px] sm:text-xs whitespace-nowrap">
            🏁 Terminar
          </motion.button>
        </div>
        <div className="h-1 bg-white/5">
          <motion.div className="h-full bg-gradient-to-r from-electric-blue via-neon-green to-vibrant-yellow"
            animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      {/* Main Layout */}
      <div className="pt-16 pb-20 px-3 min-h-screen relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 mt-2">
          {/* Left sidebar: Powers + House Map */}
          <div className="space-y-4">
            {/* House Map */}
            <div className="glass-card p-4">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">🏠 Tu Casa Digital</h3>
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
                {Object.values(rooms).map((room) => {
                  const eventsLeft = getAvailableEvents(room.id).length;
                  return (
                    <RoomCard key={room.id} room={room} visited={visitedRooms.includes(room.id)}
                      eventsLeft={eventsLeft} active={currentRoom === room.id}
                      onClick={() => handleRoomClick(room.id)} activePower={activePower} />
                  );
                })}
              </div>
            </div>

            {/* Powers */}
            <div className="glass-card p-4 hidden lg:block">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">✨ Poderes</h3>
              <PowerPanel powers={powers} onActivate={(id) => store.activatePower(id)} />
            </div>
          </div>

          {/* Right: Active Event */}
          <div className="space-y-4">
            {!currentRoom && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass-card p-8 text-center">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}
                  className="text-6xl mb-4">🏠</motion.div>
                <h2 className="text-2xl font-bold mb-2">¡Bienvenido a tu Casa Digital!</h2>
                <p className="text-white/60 text-sm max-w-md mx-auto">
                  Explora cada habitación para descubrir situaciones de riesgo. Toma decisiones inteligentes, desbloquea poderes y protege tu futuro.
                </p>
                <p className="text-white/40 text-xs mt-4">👈 Selecciona una habitación para empezar</p>
              </motion.div>
            )}

            {currentRoom && !activeEvent && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass-card p-6 text-center">
                <span className="text-5xl block mb-3">{rooms[currentRoom].icon}</span>
                <h2 className="text-xl font-bold mb-1">{rooms[currentRoom].name}</h2>
                <p className="text-white/50 text-sm">{rooms[currentRoom].description}</p>
                <p className="text-neon-green text-xs mt-4 font-semibold">✅ ¡Todos los eventos completados aquí!</p>
                <p className="text-white/30 text-xs mt-1">Explora otra habitación →</p>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {activeEvent && (
                <EventPanel key={activeEvent.id} event={activeEvent} onDecision={handleDecision}
                  selectedDecision={selectedDecision} showFeedback={showFeedback}
                  feedbackDecision={selectedDecision} onContinue={handleContinue}
                  onAltFuture={(text) => store.showAlternateFuture(text)}
                  timerExpired={timerExpired} />
              )}
            </AnimatePresence>

            {/* Mobile Powers */}
            <div className="lg:hidden glass-card p-4">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">✨ Poderes</h3>
              <PowerPanel powers={powers} onActivate={(id) => store.activatePower(id)} />
            </div>

            {/* Finish button */}
            {doneCount >= totalEvents && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  animate={{ boxShadow: ['0 0 20px rgba(37,99,235,0.3)', '0 0 40px rgba(37,99,235,0.6)', '0 0 20px rgba(37,99,235,0.3)'] }}
                  transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
                  onClick={() => { store.setSimulationComplete(true); navigate('/results'); }}
                  className="px-10 py-4 bg-gradient-to-r from-electric-blue via-deep-purple to-neon-green text-white font-bold text-lg rounded-2xl">
                  🔮 Ver mi Futuro Paralelo
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mascot */}
      <Mascot state={mascotState} message={mascotMessage} />

      {/* Alt Future Modal */}
      <AnimatePresence>
        {showAltFuture && <AltFutureModal text={altFutureText} onClose={() => store.hideAlternateFuture()} />}
      </AnimatePresence>

      {/* Badge Toast */}
      <AnimatePresence>
        {newBadge && <BadgeToast badge={newBadge} onClose={() => store.clearNewBadge()} />}
      </AnimatePresence>

      {/* Confetti */}
      <AnimatePresence>{showConfetti && <Confetti />}</AnimatePresence>
    </div>
  );
}
