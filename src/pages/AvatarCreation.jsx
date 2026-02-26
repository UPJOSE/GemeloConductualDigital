import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import AvatarDisplay from '../components/AvatarDisplay';
import ParticlesCanvas from '../components/ParticlesCanvas';

const AVATAR_TYPES = [
  { id: 'human', label: 'Humano', icon: '🧑' },
  { id: 'animal', label: 'Animal', icon: '🐾' },
];

const ANIMAL_OPTIONS = [
  { id: 'cat', label: 'Gato', icon: '🐱' },
  { id: 'rabbit', label: 'Conejo', icon: '🐰' },
  { id: 'dog', label: 'Perro', icon: '🐶' },
  { id: 'bear', label: 'Oso', icon: '🐻' },
  { id: 'fox', label: 'Zorro', icon: '🦊' },
  { id: 'penguin', label: 'Pingüino', icon: '🐧' },
];

const HAIR_OPTIONS = [
  { id: 'short', label: 'Corto', icon: '✂️' },
  { id: 'long', label: 'Largo', icon: '💇' },
  { id: 'curly', label: 'Rizado', icon: '🌀' },
  { id: 'spiky', label: 'Puntas', icon: '⚡' },
  { id: 'mohawk', label: 'Mohicano', icon: '🔥' },
  { id: 'braids', label: 'Trenzas', icon: '🎀' },
];

const HAIR_COLORS = [
  '#4A3728', '#1A1A2E', '#D4A574', '#C0392B', '#F39C12', '#8E44AD',
  '#E74C3C', '#1ABC9C', '#3498DB', '#2ECC71', '#F1C40F', '#E91E63',
];

const SKIN_COLORS = [
  '#FDEBD0', '#F5D0A9', '#D4A574', '#A0522D', '#8B6914', '#6B4226',
  '#FFE0BD', '#FFCD94', '#EAC086', '#C68642', '#8D5524', '#5C3317',
];

const ANIMAL_COLORS = [
  '#F5D0A9', '#D4A574', '#A0522D', '#8B6914', '#6B4226', '#1A1A2E',
  '#FDEBD0', '#FFE0BD', '#C0C0C0', '#F97316', '#FACC15', '#FFB4B4',
  '#2C3E50', '#ECF0F1', '#D35400', '#F39C12',
];

const CLOTHING_OPTIONS = [
  { id: 'tshirt', label: 'Camiseta', icon: '👕' },
  { id: 'hoodie', label: 'Sudadera', icon: '🧥' },
  { id: 'jacket', label: 'Chaqueta', icon: '🧥' },
  { id: 'dress', label: 'Vestido', icon: '👗' },
  { id: 'overalls', label: 'Overol', icon: '👖' },
];

const CLOTHING_COLORS = [
  '#2563EB', '#22C55E', '#F97316', '#EF4444', '#7C3AED', '#EC4899',
  '#06B6D4', '#FACC15', '#8B5CF6', '#14B8A6', '#F43F5E', '#6366F1',
];

const ACCESSORY_OPTIONS = [
  { id: 'none', label: 'Ninguno', icon: '❌' },
  { id: 'glasses', label: 'Lentes', icon: '👓' },
  { id: 'cap', label: 'Gorra', icon: '🧢' },
  { id: 'headband', label: 'Vincha', icon: '🎀' },
  { id: 'bow', label: 'Moño', icon: '🎀' },
  { id: 'crown', label: 'Corona', icon: '👑' },
  { id: 'mask', label: 'Antifaz', icon: '🦸' },
];

function OptionButton({ selected, onClick, children, color, large }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative ${large ? 'p-4 min-w-[90px]' : 'p-3'} rounded-xl border-2 transition-all text-sm font-semibold ${
        selected
          ? 'border-electric-blue bg-electric-blue/20 text-white shadow-lg shadow-electric-blue/20'
          : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30'
      }`}
      style={color ? { borderColor: selected ? color : undefined } : {}}
    >
      {selected && (
        <motion.div
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
      className={`w-9 h-9 rounded-full border-2 transition-all ${
        selected ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:border-white/40'
      }`}
      style={{ backgroundColor: color, boxShadow: selected ? `0 0 15px ${color}80` : 'none' }}
    />
  );
}

function ModeSelection({ onSelectHome, onSelectGuardianes }) {
  return (
    <div className="space-y-4">
      <motion.button
        whileHover={{ scale: 1.03, y: -3 }}
        whileTap={{ scale: 0.97 }}
        onClick={onSelectHome}
        className="w-full p-6 rounded-2xl border-2 border-electric-blue/40 bg-electric-blue/10 text-left flex items-center gap-5 transition-all hover:border-electric-blue hover:bg-electric-blue/20 group"
      >
        <div className="w-16 h-16 rounded-xl bg-electric-blue/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
          🏠
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">Prueba dentro del Hogar</h3>
          <p className="text-white/50 text-sm mt-1">Explora tu casa digital, toma decisiones y descubre cómo prevenir accidentes.</p>
        </div>
        <span className="text-electric-blue text-xl">→</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.03, y: -3 }}
        whileTap={{ scale: 0.97 }}
        onClick={onSelectGuardianes}
        className="w-full p-6 rounded-2xl border-2 border-bright-orange/40 bg-bright-orange/10 text-left flex items-center gap-5 transition-all hover:border-bright-orange hover:bg-bright-orange/20 group"
      >
        <div className="w-16 h-16 rounded-xl bg-bright-orange/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
          🛡️
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">Historias de Guardianes</h3>
          <p className="text-white/50 text-sm mt-1">Vive las aventuras de los Guardianes Antillama y aprende jugando.</p>
        </div>
        <span className="text-bright-orange text-xl">→</span>
      </motion.button>
    </div>
  );
}

export default function AvatarCreation() {
  const navigate = useNavigate();
  const avatar = useStore((s) => s.avatar);
  const setAvatar = useStore((s) => s.setAvatar);
  const startSession = useStore((s) => s.startSession);
  const [step, setStep] = useState(0);
  const [name, setName] = useState(avatar.name);
  const [showModeSelect, setShowModeSelect] = useState(false);

  const isAnimal = avatar.type === 'animal';

  const humanSteps = [
    {
      title: '¿Cómo te llamas?',
      subtitle: 'Tu gemelo necesita un nombre',
      content: (
        <div className="max-w-sm mx-auto">
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setAvatar({ name: e.target.value }); }}
            placeholder="Escribe tu nombre..."
            className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-center text-xl font-semibold placeholder-white/30 focus:outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/30 transition-all"
            maxLength={20}
          />
        </div>
      ),
    },
    {
      title: 'Elige tu tipo de avatar',
      subtitle: '¿Humano o animal?',
      content: (
        <div className="space-y-6">
          <div className="flex gap-4 justify-center">
            {AVATAR_TYPES.map((t) => (
              <OptionButton key={t.id} large selected={avatar.type === t.id}
                onClick={() => setAvatar({ type: t.id, animalType: t.id === 'human' ? null : avatar.animalType || 'cat' })}>
                <span className="text-2xl block mb-1">{t.icon}</span>
                {t.label}
              </OptionButton>
            ))}
          </div>
          {avatar.type === 'animal' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-white/40 text-xs mb-3 uppercase tracking-wider font-bold">Elige tu animal</p>
              <div className="flex gap-3 justify-center flex-wrap">
                {ANIMAL_OPTIONS.map((a) => (
                  <OptionButton key={a.id} selected={avatar.animalType === a.id} onClick={() => setAvatar({ animalType: a.id })}>
                    <span className="text-lg block">{a.icon}</span>
                    <span className="text-[11px]">{a.label}</span>
                  </OptionButton>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      ),
    },
    {
      title: isAnimal ? 'Color de tu pelaje' : 'Elige tu piel',
      subtitle: 'Personaliza tu apariencia',
      content: (
        <div className="flex gap-2.5 justify-center flex-wrap max-w-sm mx-auto">
          {(isAnimal ? ANIMAL_COLORS : SKIN_COLORS).map((c) => (
            <ColorSwatch key={c} color={c} selected={avatar.skinColor === c} onClick={() => setAvatar({ skinColor: c })} />
          ))}
        </div>
      ),
    },
    ...(isAnimal ? [] : [
      {
        title: 'Elige tu cabello',
        subtitle: 'Estilo y color',
        content: (
          <div className="space-y-6">
            <div className="flex gap-2.5 justify-center flex-wrap">
              {HAIR_OPTIONS.map((h) => (
                <OptionButton key={h.id} selected={avatar.hair === h.id} onClick={() => setAvatar({ hair: h.id })}>
                  {h.icon} {h.label}
                </OptionButton>
              ))}
            </div>
            <div className="flex gap-2.5 justify-center flex-wrap max-w-sm mx-auto">
              {HAIR_COLORS.map((c) => (
                <ColorSwatch key={c} color={c} selected={avatar.hairColor === c} onClick={() => setAvatar({ hairColor: c })} />
              ))}
            </div>
          </div>
        ),
      },
    ]),
    {
      title: 'Elige tu ropa',
      subtitle: 'Estilo y color favorito',
      content: (
        <div className="space-y-6">
          {!isAnimal && (
            <div className="flex gap-2.5 justify-center flex-wrap">
              {CLOTHING_OPTIONS.map((c) => (
                <OptionButton key={c.id} selected={avatar.clothing === c.id} onClick={() => setAvatar({ clothing: c.id })}>
                  {c.icon} {c.label}
                </OptionButton>
              ))}
            </div>
          )}
          <div className="flex gap-2.5 justify-center flex-wrap max-w-sm mx-auto">
            {CLOTHING_COLORS.map((c) => (
              <ColorSwatch key={c} color={c} selected={avatar.clothingColor === c} onClick={() => setAvatar({ clothingColor: c })} />
            ))}
          </div>
        </div>
      ),
    },
    ...(isAnimal ? [] : [
      {
        title: 'Accesorios',
        subtitle: 'Un toque especial',
        content: (
          <div className="flex gap-2.5 justify-center flex-wrap">
            {ACCESSORY_OPTIONS.map((a) => (
              <OptionButton key={a.id} selected={avatar.accessory === a.id} onClick={() => setAvatar({ accessory: a.id })}>
                {a.icon} {a.label}
              </OptionButton>
            ))}
          </div>
        ),
      },
    ]),
  ];

  const steps = humanSteps;
  const totalSteps = steps.length;
  const canProceed = step === 0 ? name.trim().length > 0 : true;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setShowModeSelect(true);
    }
  };

  const handleSelectHome = () => {
    startSession();
    navigate('/simulator');
  };

  const handleSelectGuardianes = () => {
    startSession();
    navigate('/guardianes');
  };

  if (showModeSelect) {
    return (
      <div className="aurora-bg min-h-screen flex flex-col">
        <ParticlesCanvas mousePos={{ x: 0, y: 0 }} />
        <div className="flex-1 flex items-center justify-center px-4 py-16 relative z-10">
          <div className="w-full max-w-2xl">
            <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-block p-6 glass-card">
                <AvatarDisplay avatar={avatar} size={120} />
                {name && <p className="mt-2 text-white/80 font-semibold">{name}</p>}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">¿Qué aventura quieres vivir?</h2>
              <p className="text-white/50 mb-8">Elige tu modo de juego</p>
              <ModeSelection onSelectHome={handleSelectHome} onSelectGuardianes={handleSelectGuardianes} />
            </motion.div>

            <div className="flex justify-center mt-6">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setShowModeSelect(false)}
                className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/20 transition-all">
                ← Volver al avatar
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="aurora-bg min-h-screen flex flex-col">
      <ParticlesCanvas mousePos={{ x: 0, y: 0 }} />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-electric-blue to-neon-green"
          animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
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
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-white/80 font-semibold">
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
              {step < totalSteps - 1 ? 'Siguiente →' : '🚀 Elegir Modo'}
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
