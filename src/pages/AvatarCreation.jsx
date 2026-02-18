import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import AvatarDisplay from '../components/AvatarDisplay';
import ParticlesCanvas from '../components/ParticlesCanvas';

const HAIR_OPTIONS = [
  { id: 'short', label: 'Corto', icon: '✂️' },
  { id: 'long', label: 'Largo', icon: '💇' },
  { id: 'curly', label: 'Rizado', icon: '🌀' },
  { id: 'spiky', label: 'Puntas', icon: '⚡' },
];

const HAIR_COLORS = ['#4A3728', '#1A1A2E', '#D4A574', '#C0392B', '#F39C12', '#8E44AD'];

const SKIN_COLORS = ['#FDEBD0', '#F5D0A9', '#D4A574', '#A0522D', '#8B6914', '#6B4226'];

const CLOTHING_OPTIONS = [
  { id: 'tshirt', label: 'Camiseta', icon: '👕' },
  { id: 'hoodie', label: 'Sudadera', icon: '🧥' },
  { id: 'jacket', label: 'Chaqueta', icon: '🧥' },
];

const CLOTHING_COLORS = ['#2563EB', '#22C55E', '#F97316', '#EF4444', '#7C3AED', '#EC4899'];

const ACCESSORY_OPTIONS = [
  { id: 'none', label: 'Ninguno', icon: '❌' },
  { id: 'glasses', label: 'Lentes', icon: '👓' },
  { id: 'cap', label: 'Gorra', icon: '🧢' },
  { id: 'headband', label: 'Vincha', icon: '🎀' },
];

function OptionButton({ selected, onClick, children, color }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative p-3 rounded-xl border-2 transition-all text-sm font-semibold ${
        selected
          ? 'border-electric-blue bg-electric-blue/20 text-white shadow-lg shadow-electric-blue/20'
          : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30'
      }`}
      style={color ? { borderColor: selected ? color : undefined } : {}}
    >
      {selected && (
        <motion.div
          layoutId="selected-glow"
          className="absolute inset-0 rounded-xl bg-electric-blue/10"
          initial={false}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

function ColorSwatch({ color, selected, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`w-10 h-10 rounded-full border-2 transition-all ${
        selected ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:border-white/40'
      }`}
      style={{ backgroundColor: color, boxShadow: selected ? `0 0 15px ${color}80` : 'none' }}
    />
  );
}

export default function AvatarCreation() {
  const navigate = useNavigate();
  const avatar = useStore((s) => s.avatar);
  const setAvatar = useStore((s) => s.setAvatar);
  const startSession = useStore((s) => s.startSession);
  const [step, setStep] = useState(0);
  const [name, setName] = useState(avatar.name);

  const steps = [
    {
      title: '¿Cómo te llamas?',
      subtitle: 'Tu gemelo necesita un nombre',
      content: (
        <div className="max-w-sm mx-auto">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setAvatar({ name: e.target.value });
            }}
            placeholder="Escribe tu nombre..."
            className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-center text-xl font-semibold placeholder-white/30 focus:outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/30 transition-all"
            maxLength={20}
          />
        </div>
      ),
    },
    {
      title: 'Elige tu piel',
      subtitle: 'Personaliza tu apariencia',
      content: (
        <div className="flex gap-3 justify-center flex-wrap">
          {SKIN_COLORS.map((c) => (
            <ColorSwatch key={c} color={c} selected={avatar.skinColor === c} onClick={() => setAvatar({ skinColor: c })} />
          ))}
        </div>
      ),
    },
    {
      title: 'Elige tu cabello',
      subtitle: 'Estilo y color',
      content: (
        <div className="space-y-6">
          <div className="flex gap-3 justify-center flex-wrap">
            {HAIR_OPTIONS.map((h) => (
              <OptionButton key={h.id} selected={avatar.hair === h.id} onClick={() => setAvatar({ hair: h.id })}>
                {h.icon} {h.label}
              </OptionButton>
            ))}
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            {HAIR_COLORS.map((c) => (
              <ColorSwatch key={c} color={c} selected={avatar.hairColor === c} onClick={() => setAvatar({ hairColor: c })} />
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Elige tu ropa',
      subtitle: 'Estilo y color favorito',
      content: (
        <div className="space-y-6">
          <div className="flex gap-3 justify-center flex-wrap">
            {CLOTHING_OPTIONS.map((c) => (
              <OptionButton key={c.id} selected={avatar.clothing === c.id} onClick={() => setAvatar({ clothing: c.id })}>
                {c.icon} {c.label}
              </OptionButton>
            ))}
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            {CLOTHING_COLORS.map((c) => (
              <ColorSwatch key={c} color={c} selected={avatar.clothingColor === c} onClick={() => setAvatar({ clothingColor: c })} />
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Accesorios',
      subtitle: 'Un toque especial',
      content: (
        <div className="flex gap-3 justify-center flex-wrap">
          {ACCESSORY_OPTIONS.map((a) => (
            <OptionButton key={a.id} selected={avatar.accessory === a.id} onClick={() => setAvatar({ accessory: a.id })}>
              {a.icon} {a.label}
            </OptionButton>
          ))}
        </div>
      ),
    },
  ];

  const canProceed = step === 0 ? name.trim().length > 0 : true;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      startSession();
      navigate('/simulator');
    }
  };

  return (
    <div className="aurora-bg min-h-screen flex flex-col">
      <ParticlesCanvas mousePos={{ x: 0, y: 0 }} />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-electric-blue to-neon-green"
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-16 relative z-10">
        <div className="w-full max-w-2xl">
          {/* Avatar Preview */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-block p-6 glass-card">
              <AvatarDisplay avatar={avatar} size={140} />
              {name && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-white/80 font-semibold"
                >
                  {name}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-8 text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{steps[step].title}</h2>
              <p className="text-white/50 mb-8">{steps[step].subtitle}</p>
              {steps[step].content}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-6 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => step > 0 ? setStep(step - 1) : navigate('/')}
              className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/20 transition-all"
            >
              ← {step > 0 ? 'Anterior' : 'Inicio'}
            </motion.button>

            <motion.button
              whileHover={canProceed ? { scale: 1.05 } : {}}
              whileTap={canProceed ? { scale: 0.95 } : {}}
              onClick={handleNext}
              disabled={!canProceed}
              className={`px-8 py-3 font-bold rounded-xl transition-all ${
                canProceed
                  ? 'bg-gradient-to-r from-electric-blue to-deep-purple text-white btn-3d'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {step < steps.length - 1 ? 'Siguiente →' : '🚀 Iniciar Simulación'}
            </motion.button>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {steps.map((_, i) => (
              <motion.div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step ? 'w-8 bg-electric-blue' : i < step ? 'w-2 bg-neon-green' : 'w-2 bg-white/20'
                }`}
                animate={{ scale: i === step ? 1.2 : 1 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
