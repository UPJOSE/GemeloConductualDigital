import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import AvatarDisplay from '../components/AvatarDisplay';
import IRPBar from '../components/IRPBar';

const SCENARIO_ILLUSTRATIONS = {
  pot: (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
      <ellipse cx="100" cy="140" rx="60" ry="15" fill="#64748B" />
      <rect x="45" y="80" width="110" height="60" rx="8" fill="#94A3B8" />
      <rect x="40" y="75" width="120" height="12" rx="6" fill="#64748B" />
      <rect x="155" y="90" width="30" height="8" rx="4" fill="#475569" />
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M${75 + i * 25},75 Q${80 + i * 25},55 ${75 + i * 25},40`}
          stroke="white"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
          animate={{ y: [0, -10, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </svg>
  ),
  outlet: (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
      <rect x="50" y="50" width="100" height="100" rx="12" fill="#E2E8F0" />
      <rect x="55" y="55" width="90" height="90" rx="8" fill="#F8FAFC" />
      <circle cx="80" cy="85" r="6" fill="#1E293B" />
      <circle cx="120" cy="85" r="6" fill="#1E293B" />
      <rect x="93" y="105" width="14" height="8" rx="4" fill="#1E293B" />
      <motion.line x1="80" y1="130" x2="80" y2="160" stroke="#FACC15" strokeWidth="3" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
    </svg>
  ),
  fireworks: (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.circle
          key={i}
          cx={100 + Math.cos((i * Math.PI) / 3) * 40}
          cy={80 + Math.sin((i * Math.PI) / 3) * 40}
          r="4"
          fill={['#EF4444', '#F97316', '#FACC15', '#22C55E', '#2563EB', '#7C3AED'][i]}
          animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      <rect x="95" y="120" width="10" height="50" rx="3" fill="#94A3B8" />
      <motion.circle cx="100" cy="80" r="8" fill="#F97316" animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }} />
    </svg>
  ),
  iron: (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
      <path d="M60,120 L140,120 L160,100 Q160,80 140,80 L80,80 Q60,80 60,100 Z" fill="#94A3B8" />
      <rect x="90" y="60" width="15" height="25" rx="4" fill="#64748B" />
      <motion.path d="M80,130 Q90,140 80,150" stroke="#EF4444" strokeWidth="2" fill="none" opacity="0.5" animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.path d="M110,130 Q120,140 110,150" stroke="#EF4444" strokeWidth="2" fill="none" opacity="0.5" animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
    </svg>
  ),
  shower: (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
      <rect x="85" y="30" width="30" height="10" rx="5" fill="#94A3B8" />
      <rect x="95" y="40" width="10" height="30" fill="#64748B" />
      <ellipse cx="100" cy="75" rx="30" ry="8" fill="#94A3B8" />
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.line
          key={i}
          x1={80 + i * 10}
          y1="83"
          x2={78 + i * 10}
          y2="120"
          stroke="#60A5FA"
          strokeWidth="2"
          opacity="0.5"
          animate={{ y: [0, 15, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </svg>
  ),
  microwave: (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
      <rect x="30" y="60" width="140" height="100" rx="8" fill="#64748B" />
      <rect x="40" y="70" width="90" height="75" rx="4" fill="#1E293B" />
      <circle cx="150" cy="90" r="5" fill="#22C55E" />
      <circle cx="150" cy="110" r="5" fill="#94A3B8" />
      <rect x="140" y="125" width="20" height="8" rx="2" fill="#94A3B8" />
      <motion.rect x="55" y="100" width="60" height="10" rx="3" fill="#F97316" opacity="0.6" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
    </svg>
  ),
  stove: (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
      <rect x="30" y="80" width="140" height="80" rx="6" fill="#475569" />
      <circle cx="70" cy="100" r="20" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
      <circle cx="130" cy="100" r="20" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
      <motion.circle cx="70" cy="100" r="12" fill="#EF4444" opacity="0.4" animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.9, 1.1, 0.9] }} transition={{ duration: 2, repeat: Infinity }} />
    </svg>
  ),
  lighter: (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
      <rect x="80" y="70" width="40" height="80" rx="6" fill="#94A3B8" />
      <rect x="85" y="75" width="30" height="20" rx="3" fill="#64748B" />
      <motion.path d="M100,70 Q95,50 100,35 Q105,50 100,70" fill="#F97316" animate={{ scaleY: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 1, repeat: Infinity }} />
    </svg>
  ),
  wire: (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
      <path d="M30,100 Q60,80 90,100 Q120,120 150,100 Q170,90 180,100" stroke="#1E293B" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M30,100 Q60,80 90,100 Q120,120 150,100 Q170,90 180,100" stroke="#64748B" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M100,97 L130,103" stroke="#D97706" strokeWidth="3" />
      <path d="M105,95 L125,105" stroke="#D97706" strokeWidth="2" />
      <motion.circle cx="115" cy="100" r="8" fill="#FACC15" opacity="0.3" animate={{ opacity: [0.1, 0.4, 0.1], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 1.5, repeat: Infinity }} />
    </svg>
  ),
  matches: (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
      <rect x="60" y="60" width="80" height="100" rx="4" fill="#D97706" />
      <rect x="65" y="65" width="70" height="30" rx="2" fill="#92400E" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={78 + i * 15} y="40" width="4" height="30" fill="#F5D0A9" />
          <circle cx={80 + i * 15} cy="40" r="4" fill="#EF4444" />
        </g>
      ))}
      <motion.circle cx="95" cy="35" r="6" fill="#F97316" opacity="0.5" animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
    </svg>
  ),
};

function ScenarioCard({ scenario, onDecision, selectedDecision }) {
  const illustration = SCENARIO_ILLUSTRATIONS[scenario.illustration] || null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="glass-card p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{scenario.icon}</span>
          <h2 className="text-xl md:text-2xl font-bold">{scenario.title}</h2>
        </div>

        {/* Illustration */}
        <div className="mb-6 flex justify-center">
          {illustration}
        </div>

        {/* Description */}
        <p className="text-white/70 text-center mb-8 text-lg leading-relaxed">
          {scenario.description}
        </p>

        {/* Decisions */}
        <div className="space-y-3">
          <p className="text-sm text-white/50 text-center mb-4">¿Qué decides hacer?</p>
          {scenario.decisions.map((decision) => (
            <motion.button
              key={decision.id}
              whileHover={!selectedDecision ? { scale: 1.02, x: 8 } : {}}
              whileTap={!selectedDecision ? { scale: 0.98 } : {}}
              onClick={() => !selectedDecision && onDecision(decision)}
              disabled={!!selectedDecision}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedDecision?.id === decision.id
                  ? decision.riskDelta <= 0
                    ? 'border-neon-green bg-neon-green/10 text-white'
                    : 'border-bright-orange bg-bright-orange/10 text-white'
                  : selectedDecision
                  ? 'border-white/5 bg-white/3 text-white/30'
                  : 'border-white/10 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {selectedDecision?.id === decision.id
                    ? decision.riskDelta <= 0 ? '✅' : '⚠️'
                    : '○'}
                </span>
                <span className="font-medium">{decision.text}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function FeedbackOverlay({ decision, onContinue }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mt-4"
    >
      <div className={`glass-card p-6 border-2 ${
        decision.riskDelta <= 0 ? 'border-neon-green/30' : 'border-bright-orange/30'
      }`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">{decision.riskDelta <= 0 ? '🛡️' : '💡'}</span>
          <div className="flex-1">
            <h3 className={`font-bold mb-1 ${decision.riskDelta <= 0 ? 'text-neon-green' : 'text-bright-orange'}`}>
              {decision.riskDelta <= 0 ? '¡Buena decisión!' : 'Cuidado con esa decisión'}
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">{decision.narrativeImpact}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">Impacto IRP:</span>
            <span className={`text-sm font-bold ${decision.riskDelta <= 0 ? 'text-neon-green' : 'text-bright-orange'}`}>
              {decision.riskDelta > 0 ? '+' : ''}{(decision.riskDelta * decision.weight).toFixed(1)}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onContinue}
            className="px-6 py-2 bg-gradient-to-r from-electric-blue to-deep-purple text-white font-semibold rounded-xl text-sm"
          >
            Continuar →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Simulator() {
  const navigate = useNavigate();
  const {
    scenarios,
    currentScenarioIndex,
    nextScenario,
    updateIRP,
    addDecision,
    irp,
    avatar,
    setSimulationComplete,
    checkBadges,
  } = useStore();

  const [selectedDecision, setSelectedDecision] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [bgTint, setBgTint] = useState('');

  const currentScenario = scenarios[currentScenarioIndex];
  const progress = ((currentScenarioIndex) / scenarios.length) * 100;

  useEffect(() => {
    if (irp > 60) {
      setBgTint('from-red-900/20 to-transparent');
    } else if (irp < 30) {
      setBgTint('from-green-900/20 to-transparent');
    } else {
      setBgTint('');
    }
  }, [irp]);

  const handleDecision = (decision) => {
    setSelectedDecision(decision);
    updateIRP(decision.riskDelta, decision.weight, currentScenario.category);
    addDecision(currentScenario.id, decision);
    setShowFeedback(true);
  };

  const handleContinue = () => {
    if (currentScenarioIndex >= scenarios.length - 1) {
      checkBadges();
      setSimulationComplete(true);
      navigate('/results');
    } else {
      nextScenario();
      setSelectedDecision(null);
      setShowFeedback(false);
    }
  };

  if (!currentScenario) {
    navigate('/results');
    return null;
  }

  return (
    <div className={`aurora-bg min-h-screen ${bgTint ? `bg-gradient-to-b ${bgTint}` : ''}`}>
      {/* Dynamic background tint */}
      <div className={`fixed inset-0 pointer-events-none transition-all duration-1000 bg-gradient-to-b ${bgTint}`} />

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8">
              <AvatarDisplay avatar={avatar} size={32} animate={false} />
            </div>
            <span className="text-sm font-semibold text-white/70">{avatar.name}</span>
          </div>

          <IRPBar compact />

          <div className="text-sm text-white/50">
            {currentScenarioIndex + 1}/{scenarios.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-electric-blue via-deep-purple to-neon-green"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="pt-24 pb-8 px-4 min-h-screen flex flex-col items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          <ScenarioCard
            key={currentScenario.id}
            scenario={currentScenario}
            onDecision={handleDecision}
            selectedDecision={selectedDecision}
          />
        </AnimatePresence>

        <AnimatePresence>
          {showFeedback && selectedDecision && (
            <FeedbackOverlay decision={selectedDecision} onContinue={handleContinue} />
          )}
        </AnimatePresence>

        {/* Scenario dots */}
        <div className="flex gap-1.5 mt-8 flex-wrap justify-center">
          {scenarios.map((_, i) => (
            <motion.div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === currentScenarioIndex
                  ? 'w-6 bg-electric-blue'
                  : i < currentScenarioIndex
                  ? 'w-2 bg-neon-green'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Particle effect on good decisions */}
      <AnimatePresence>
        {showFeedback && selectedDecision?.riskDelta <= 0 && (
          <>
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 1,
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                  scale: 0,
                }}
                animate={{
                  opacity: 0,
                  x: window.innerWidth / 2 + (Math.random() - 0.5) * 400,
                  y: window.innerHeight / 2 + (Math.random() - 0.5) * 400,
                  scale: Math.random() + 0.5,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="fixed pointer-events-none z-50 w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#22C55E', '#2563EB', '#FACC15', '#7C3AED'][i % 4],
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
