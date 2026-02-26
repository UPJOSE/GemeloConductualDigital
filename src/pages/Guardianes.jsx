import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import useStore from '../store/useStore';
import AvatarDisplay from '../components/AvatarDisplay';
import ParticlesCanvas from '../components/ParticlesCanvas';

/* ───────────────────────────────────────────
   STORIES – inspired by real burn cases in Peru
   ─────────────────────────────────────────── */
const STORIES = [
  {
    id: 'story1',
    title: 'La Sopa de Mamá',
    summary: 'Una historia inspirada en accidentes reales con líquidos calientes en la cocina.',
    icon: '🍲',
    sceneBg: 'from-orange-500/20 to-red-500/10',
    chapters: [
      {
        id: 'c1', type: 'narration',
        scene: '🏠🌅',
        sceneLabel: 'Un hogar en Lima, por la mañana',
        text: 'Era una mañana soleada en Lima. Sofía, una niña de 10 años, se despertó con un delicioso olor a sopa de pollo. Su mamá estaba cocinando en la cocina para el almuerzo familiar.',
        illustration: '🌅🏠👧',
      },
      {
        id: 'c2', type: 'narration',
        scene: '🍳👩‍🍳',
        sceneLabel: 'Mamá cocinando en la cocina',
        text: 'La mamá de Sofía puso una olla grande con sopa hirviendo en la estufa. El teléfono empezó a sonar desde la sala. "Ya vengo, hijita", dijo la mamá mientras iba a contestar. La olla quedó con el mango hacia afuera, al borde de la estufa.',
        illustration: '🍲📞👩',
      },
      {
        id: 'c3', type: 'narration',
        scene: '👧🍲',
        sceneLabel: 'Sofía sola en la cocina',
        text: 'Sofía entró a la cocina corriendo porque quería galletas. Pasó muy cerca de la estufa sin darse cuenta de la olla hirviendo. ¡El mango de la olla sobresalía justo a su altura!',
        illustration: '🏃‍♀️🍲⚠️',
      },
      {
        id: 'd1', type: 'decision',
        scene: '⚠️🤔',
        sceneLabel: '¡Momento de decisión!',
        text: '¡ATENCIÓN! Sofía está a punto de chocar con el mango de la olla hirviendo. Si fueras Sofía, ¿qué harías?',
        illustration: '🍲🤔❓',
        options: [
          { id: 'a', text: '🛑 Parar, alejarse y llamar a mamá para que mueva la olla', points: 30, badge: 'guardian-cocina', feedback: '¡Excelente! Sofía se detuvo a tiempo. Su mamá volvió y movió la olla de forma segura. ¡Eres un verdadero Guardián!', isCorrect: true, riskTag: 'safe' },
          { id: 'b', text: '🤚 Intentar mover la olla yo misma', points: 5, feedback: '¡Cuidado! La olla pesaba mucho y estaba muy caliente. En la vida real, muchos niños se han quemado gravemente intentando mover ollas hirviendo. Siempre pide ayuda a un adulto.', isCorrect: false, riskTag: 'dangerous' },
          { id: 'c', text: '🏃 Seguir corriendo sin importar', points: 0, feedback: '¡Peligro! Sofía chocó con el mango y la sopa caliente le cayó encima. En Perú, el 70% de las quemaduras infantiles ocurren con líquidos calientes en la cocina. ¡Siempre mira alrededor!', isCorrect: false, riskTag: 'very_dangerous' },
        ],
      },
      {
        id: 'c4', type: 'narration',
        scene: '💡🛡️',
        sceneLabel: 'La lección del Guardián',
        text: 'Cada año en Perú, más de 35,000 niños sufren quemaduras. La mayoría ocurre en la cocina con líquidos calientes. Recuerda: los mangos de las ollas SIEMPRE deben apuntar hacia adentro, y los niños nunca deben correr cerca de la estufa.',
        illustration: '📚🛡️✨',
      },
    ],
  },
  {
    id: 'story2',
    title: 'La Noche de los Fuegos',
    summary: 'Una historia sobre los peligros de la pirotecnia en fiestas, basada en casos reales.',
    icon: '🎆',
    sceneBg: 'from-purple-500/20 to-indigo-500/10',
    chapters: [
      {
        id: 'c1', type: 'narration',
        scene: '🌙🎉',
        sceneLabel: 'Noche de Año Nuevo en Arequipa',
        text: 'Era 31 de diciembre en Arequipa. Diego, un niño de 11 años, estaba emocionado por la celebración de Año Nuevo. Toda la familia se reunió en el patio de la casa del abuelo.',
        illustration: '🌙🎊👦',
      },
      {
        id: 'c2', type: 'narration',
        scene: '🧨👦',
        sceneLabel: 'Los primos traen cohetes',
        text: 'Sus primos mayores llegaron con una bolsa llena de cohetes y bengalas. "¡Mira Diego! Este año vamos a encender los más grandes", dijo su primo Carlos mientras sacaba un cohete rojo. Los adultos estaban dentro de la casa preparando la cena.',
        illustration: '🧨🎆👦👦',
      },
      {
        id: 'c3', type: 'narration',
        scene: '🔥👀',
        sceneLabel: 'La tentación del fuego',
        text: 'Carlos le ofreció un encendedor a Diego. "Dale, enciende tú este. No pasa nada, es fácil", le dijo. Diego sintió presión de sus primos que lo miraban esperando.',
        illustration: '🔥👀😰',
      },
      {
        id: 'd1', type: 'decision',
        scene: '⚠️🤔',
        sceneLabel: '¡Momento de decisión!',
        text: '¡ATENCIÓN! Diego tiene un encendedor en la mano y sus primos lo presionan para encender un cohete grande. Si fueras Diego, ¿qué harías?',
        illustration: '🧨🤔❓',
        options: [
          { id: 'a', text: '✋ Decir NO y buscar a un adulto para que supervise', points: 30, badge: 'guardian-fuego', feedback: '¡Bravo! Diego fue valiente al decir que no. Su abuelo vino y encendió los cohetes de forma segura, lejos de los niños. ¡El verdadero valor es proteger a todos!', isCorrect: true, riskTag: 'safe' },
          { id: 'b', text: '🧨 Encender el cohete para no quedar mal', points: 0, feedback: '¡Peligro grave! En la vida real, miles de niños peruanos terminan en el hospital cada Año Nuevo por quemaduras con pirotecnia. Los cohetes pueden explotar en las manos, causar quemaduras graves e incluso la pérdida de dedos.', isCorrect: false, riskTag: 'very_dangerous' },
          { id: 'c', text: '🚶 Alejarse sin decir nada', points: 15, feedback: 'Te protegiste a ti mismo, ¡pero tus primos siguen en peligro! Un verdadero Guardián también protege a los demás. Avisar a un adulto habría sido mejor.', isCorrect: false, riskTag: 'risky' },
        ],
      },
      {
        id: 'c4', type: 'narration',
        scene: '🏥📊',
        sceneLabel: 'Datos que importan',
        text: 'Cada año durante las fiestas, ANIQUEM atiende a cientos de niños quemados por pirotecnia. Muchos pierden dedos, sufren cicatrices permanentes o necesitan años de rehabilitación. La pirotecnia NO es un juguete. Solo los adultos deben manipularla, en espacios abiertos y con protección.',
        illustration: '🏥📊🛡️',
      },
    ],
  },
  {
    id: 'story3',
    title: 'El Baño Peligroso',
    summary: 'Una historia sobre quemaduras por agua caliente, el tipo más común en niños pequeños.',
    icon: '🚿',
    sceneBg: 'from-cyan-500/20 to-blue-500/10',
    chapters: [
      {
        id: 'c1', type: 'narration',
        scene: '🏠🛁',
        sceneLabel: 'Casa de la familia Quispe en Cusco',
        text: 'En una casita en Cusco vivía Mateo, un niño de 9 años, con su hermanita Lucía de 4 años. Sus padres trabajaban hasta tarde y Mateo a veces cuidaba a Lucía por las tardes.',
        illustration: '🏠👦👧',
      },
      {
        id: 'c2', type: 'narration',
        scene: '🛁💧',
        sceneLabel: 'Hora del baño de Lucía',
        text: 'Era hora del baño de Lucía. Mateo abrió la llave del agua caliente primero porque hacía frío. El agua salía con mucho vapor. Lucía corría por el pasillo queriendo meterse a la tina.',
        illustration: '🛁💨👧🏃',
      },
      {
        id: 'c3', type: 'narration',
        scene: '⚠️👧',
        sceneLabel: 'Lucía quiere entrar a la tina',
        text: 'Lucía llegó al baño y quiso meterse directamente a la tina llena de agua caliente. "¡Quiero bañarme ya!", gritó mientras extendía su manita hacia el agua humeante.',
        illustration: '👧✋💨⚠️',
      },
      {
        id: 'd1', type: 'decision',
        scene: '⚠️🤔',
        sceneLabel: '¡Momento de decisión!',
        text: '¡ATENCIÓN! Lucía está a punto de meter la mano en agua muy caliente. Si fueras Mateo, ¿qué harías?',
        illustration: '🛁🤔❓',
        options: [
          { id: 'a', text: '❄️ Detener a Lucía y mezclar agua fría primero, probando con el codo', points: 30, badge: 'guardian-agua', feedback: '¡Perfecto! Mateo detuvo a Lucía justo a tiempo. Primero mezcló agua fría hasta que la temperatura fue segura, y probó con su codo (que es más sensible). ¡Así protegen los Guardianes!', isCorrect: true, riskTag: 'safe' },
          { id: 'b', text: '🤚 Dejar que pruebe con la mano un poquito', points: 5, feedback: '¡Cuidado! El agua estaba a más de 60°C. Bastaba un segundo para causar una quemadura grave en la piel delicada de Lucía. Las quemaduras por escaldadura son las más comunes en niños menores de 5 años.', isCorrect: false, riskTag: 'dangerous' },
          { id: 'c', text: '📱 Ir a buscar el celular para llamar a mamá mientras Lucía espera', points: 10, feedback: 'Llamar a mamá es buena idea, ¡pero no puedes dejar a Lucía sola cerca del agua caliente! Un niño pequeño puede quemarse en solo 1 segundo con agua a 70°C.', isCorrect: false, riskTag: 'risky' },
        ],
      },
      {
        id: 'c4', type: 'narration',
        scene: '💡🌡️',
        sceneLabel: 'Sabías que...',
        text: 'Las quemaduras por escaldadura (agua caliente) son el tipo más común de quemadura en niños menores de 5 años. El agua a 60°C puede causar una quemadura grave en solo 5 segundos. SIEMPRE: primero agua fría, luego caliente, y prueba con el codo o el dorso de la muñeca antes de bañar a un niño.',
        illustration: '🌡️📚🛡️',
      },
    ],
  },
];

const HERO_BADGES = [
  { id: 'guardian-cocina', name: 'Guardián de la Cocina', icon: '🍳', description: 'Protegiste a alguien de quemaduras en la cocina' },
  { id: 'guardian-fuego', name: 'Guardián del Fuego', icon: '🔥', description: 'Dijiste NO a la pirotecnia peligrosa' },
  { id: 'guardian-agua', name: 'Guardián del Agua', icon: '💧', description: 'Previniste una escaldadura' },
  { id: 'narrador-estrella', name: 'Narrador Estrella', icon: '⭐', description: 'Completaste todas las historias' },
  { id: 'heroe-total', name: 'Héroe Total', icon: '🏆', description: 'Obtuviste la puntuación máxima' },
];

/* ─── Cat meow interjections ─── */
const MEOWS = [
  '¡Miau!', '¡Miaaau!', '¡Miau miau!', '¡Mew!',
  '¡Nyaa!', '¡Miau miu!', '¡Miauuu!', '¡Miau mew!',
];
const getRandomMeow = () => MEOWS[Math.floor(Math.random() * MEOWS.length)];

const addMeowsToText = (text) => {
  const sentences = text.split(/(?<=[.!?])\s+/);
  if (sentences.length <= 1) return `${getRandomMeow()} ${text}`;
  const meowIdx = Math.min(1, sentences.length - 1);
  const endMeow = Math.random() > 0.4;
  sentences.splice(meowIdx, 0, getRandomMeow());
  if (endMeow && sentences.length > 2) sentences.push(getRandomMeow());
  return sentences.join(' ');
};

/* ─── TTS Voice Engine (super childlike & fun) ─── */
function useTTS() {
  const synth = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const utterRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);

  const getChildVoice = useCallback(() => {
    if (!synth.current) return null;
    const voices = synth.current.getVoices();
    const esVoices = voices.filter(v => v.lang.startsWith('es'));
    const preferred = esVoices.find(v => /female|femenin|paulina|elena|conchita/i.test(v.name))
      || esVoices.find(v => /google|microsoft|apple/i.test(v.name))
      || esVoices[0]
      || voices.find(v => /female/i.test(v.name))
      || voices[0];
    return preferred;
  }, []);

  const speak = useCallback((text) => {
    if (!synth.current) return;
    synth.current.cancel();
    const funText = addMeowsToText(text);
    const utter = new SpeechSynthesisUtterance(funText);
    const voice = getChildVoice();
    if (voice) utter.voice = voice;
    utter.rate = 0.78;
    utter.pitch = 1.8;
    utter.volume = 1;
    utter.lang = 'es-PE';
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    utterRef.current = utter;
    synth.current.speak(utter);
  }, [getChildVoice]);

  const stop = useCallback(() => {
    if (synth.current) synth.current.cancel();
    setSpeaking(false);
  }, []);

  useEffect(() => {
    if (synth.current) synth.current.getVoices();
    return () => { if (synth.current) synth.current.cancel(); };
  }, []);

  return { speak, stop, speaking };
}

/* ─── ANI the Cat Assistant ─── */
function AniCat({ message, mood, speaking }) {
  const moods = {
    happy: '😺', excited: '😸', worried: '😿', thinking: '🐱',
    celebrating: '😻', greeting: '🐱', narrating: '😺',
  };
  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="flex items-end gap-3"
    >
      <motion.div
        animate={{ y: [0, -5, 0], rotate: speaking ? [0, -3, 3, 0] : 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <div className="text-5xl md:text-6xl">{moods[mood] || '😺'}</div>
        {speaking && (
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="absolute -top-2 -right-2 text-lg"
          >🔊</motion.div>
        )}
        <div className="text-center text-[10px] font-bold text-vibrant-yellow mt-1">ANI</div>
      </motion.div>
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key={message.substring(0, 20)}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card px-4 py-3 max-w-sm text-sm text-white/90 leading-relaxed relative"
          >
            <div className="absolute -left-2 bottom-3 w-0 h-0 border-t-8 border-r-8 border-t-transparent border-r-white/10" />
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Story Scene ─── */
function StoryScene({ chapter, storyBg }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative rounded-2xl bg-gradient-to-br ${storyBg} p-8 md:p-10 text-center overflow-hidden`}
    >
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="text-5xl md:text-6xl mb-3 relative z-10"
      >{chapter.scene}</motion.div>
      <div className="text-3xl md:text-4xl tracking-wider relative z-10 mb-2">{chapter.illustration}</div>
      <p className="text-white/40 text-xs font-medium relative z-10">{chapter.sceneLabel}</p>
    </motion.div>
  );
}

/* ─── Decision Card ─── */
function DecisionOption({ option, selected, onSelect, disabled }) {
  const borderColor = selected
    ? option.isCorrect ? 'border-neon-green bg-neon-green/10' : option.riskTag === 'very_dangerous' ? 'border-red-500 bg-red-500/10' : 'border-bright-orange bg-bright-orange/10'
    : 'border-white/10 bg-white/5';

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, x: 4 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={() => !disabled && onSelect(option)}
      disabled={disabled}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm ${borderColor} ${
        disabled && !selected ? 'opacity-30' : ''
      }`}
    >
      <span className="font-semibold">{option.text}</span>
      {selected && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3">
          <div className="flex items-center gap-2 mb-2">
            {option.isCorrect
              ? <span className="text-neon-green font-bold text-xs">✅ ¡Decisión correcta!</span>
              : <span className="text-bright-orange font-bold text-xs">⚠️ Decisión riesgosa</span>}
            <span className="text-vibrant-yellow font-bold text-xs ml-auto">+{option.points} pts</span>
          </div>
          <p className="text-white/60 text-xs leading-relaxed">{option.feedback}</p>
        </motion.div>
      )}
    </motion.button>
  );
}

/* ─── Badge Display ─── */
function BadgeCard({ badge, earned }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`glass-card p-4 text-center ${earned ? 'border border-vibrant-yellow/30' : 'opacity-40'}`}
    >
      <motion.span
        animate={earned ? { rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-3xl block mb-2"
      >{badge.icon}</motion.span>
      <p className="text-xs font-bold text-white">{badge.name}</p>
      <p className="text-[10px] text-white/40 mt-1">{badge.description}</p>
    </motion.div>
  );
}

/* ─── MAIN GUARDIANES PAGE ─── */
export default function Guardianes() {
  const navigate = useNavigate();
  const avatar = useStore((s) => s.avatar);
  const { speak, stop, speaking } = useTTS();

  const [phase, setPhase] = useState('intro');
  const [currentStoryIdx, setCurrentStoryIdx] = useState(0);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [storyDecisions, setStoryDecisions] = useState([]);
  const [completedStories, setCompletedStories] = useState([]);
  const [aniMessage, setAniMessage] = useState('');
  const [aniMood, setAniMood] = useState('greeting');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const currentStory = STORIES[currentStoryIdx];
  const currentChapter = currentStory?.chapters[currentChapterIdx];

  const speakText = useCallback((text) => {
    if (voiceEnabled) speak(text);
  }, [voiceEnabled, speak]);

  // ANI intro
  useEffect(() => {
    if (phase === 'intro') {
      setAniMessage(`¡Miau miau! ¡Hola ${avatar.name || 'amiguito'}! 🐱 Soy ANI, tu gatito guardián. Juntos viviremos historias súper emocionantes y aprenderemos a proteger a los que más queremos. ¡Miau! ¿Estás listo para la aventura?`);
      setAniMood('greeting');
    }
  }, [phase, avatar.name]);

  // Narrate chapter text
  useEffect(() => {
    if (phase === 'story' && currentChapter) {
      if (currentChapter.type === 'narration') {
        setAniMood('narrating');
        setAniMessage(currentChapter.text.substring(0, 80) + '...');
        speakText(currentChapter.text);
      } else if (currentChapter.type === 'decision') {
        setAniMood('thinking');
        setAniMessage('¡Miau miau! ¡Es tu turno de decidir! 🐱 Piensa biiien antes de elegir...');
        speakText(currentChapter.text);
      }
    }
  }, [phase, currentStoryIdx, currentChapterIdx, currentChapter, speakText]);

  const handleStartAdventure = () => {
    stop();
    setPhase('story-select');
    setAniMessage('¡Miau! Elige una historia para comenzar. Cada una te enseñará algo súper importante. 🐱');
    setAniMood('happy');
  };

  const handleSelectStory = (idx) => {
    stop();
    setCurrentStoryIdx(idx);
    setCurrentChapterIdx(0);
    setSelectedOption(null);
    setPhase('story');
  };

  const handleNextChapter = () => {
    stop();
    if (currentChapterIdx < currentStory.chapters.length - 1) {
      setCurrentChapterIdx(currentChapterIdx + 1);
      setSelectedOption(null);
    } else {
      // Story complete
      const newCompleted = [...completedStories, currentStory.id];
      setCompletedStories(newCompleted);

      // Check if earned star badge
      if (newCompleted.length >= STORIES.length && !earnedBadges.includes('narrador-estrella')) {
        setEarnedBadges(prev => [...prev, 'narrador-estrella']);
      }
      // Check hero total
      if (score >= 90 && !earnedBadges.includes('heroe-total')) {
        setEarnedBadges(prev => [...prev, 'heroe-total']);
      }

      if (newCompleted.length >= STORIES.length) {
        setPhase('results');
        setAniMood('celebrating');
        setAniMessage('¡MIAAAAAU! 🐱🏆 ¡Felicidades! ¡Has completado todas las historias! ¡Eres un verdadero Héroe Guardián! ¡Miau miau miau!');
        speakText('¡MIAU MIAU! ¡Felicidades! ¡Has completado todas las historias! ¡Eres un verdadero Héroe Guardián!');
      } else {
        setPhase('story-select');
        setAniMood('excited');
        setAniMessage('¡Miau! ¡Historia completada! 🐱 Elige otra aventura para seguir aprendiendo. ¡Miau miau!');
      }
    }
  };

  const handleDecision = (option) => {
    stop();
    setSelectedOption(option);
    setScore(prev => prev + option.points);
    setStoryDecisions(prev => [...prev, {
      storyId: currentStory.id,
      storyTitle: currentStory.title,
      chapterId: currentChapter.id,
      option: option,
    }]);

    if (option.badge && option.isCorrect && !earnedBadges.includes(option.badge)) {
      setEarnedBadges(prev => [...prev, option.badge]);
    }

    if (option.isCorrect) {
      setAniMood('celebrating');
      setAniMessage('¡MIAAAU! ¡INCREÍBLE! 🌟 ¡Esa es la decisión de un verdadero Guardián! 🐱');
    } else if (option.riskTag === 'very_dangerous') {
      setAniMood('worried');
      setAniMessage('¡Miau...! 😿 Eso fue muy peligroso... Pero miau, ¡aprendimos algo importante! 💡');
    } else {
      setAniMood('thinking');
      setAniMessage('¡Miu miu! 🐱 No fue la mejor opción, pero ¡miau! ¡Ahora sabes qué hacer la próxima vez! 📚');
    }
    speakText(option.feedback);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('Historias de Guardianes - Reporte', 105, 25, { align: 'center' });

    doc.setFontSize(11);
    doc.setTextColor(150, 150, 150);
    doc.text('En alianza con ANIQUEM', 105, 33, { align: 'center' });

    doc.setDrawColor(249, 115, 22);
    doc.line(30, 38, 180, 38);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.text(`Guardián: ${avatar.name || 'Anónimo'}`, 30, 50);
    doc.text(`Puntuación: ${score}/${STORIES.length * 30} puntos`, 30, 60);
    doc.text(`Historias completadas: ${completedStories.length}/${STORIES.length}`, 30, 70);
    doc.text(`Insignias ganadas: ${earnedBadges.length}/${HERO_BADGES.length}`, 30, 80);

    doc.setDrawColor(100, 100, 100);
    doc.line(30, 88, 180, 88);

    let y = 98;
    doc.setFontSize(14);
    doc.setTextColor(250, 204, 21);
    doc.text('Decisiones tomadas:', 30, y);
    y += 12;

    doc.setFontSize(10);
    storyDecisions.forEach((d) => {
      if (y > 260) { doc.addPage(); doc.setFillColor(15, 23, 42); doc.rect(0, 0, 210, 297, 'F'); y = 25; }
      doc.setTextColor(255, 255, 255);
      doc.text(`${d.storyTitle}:`, 30, y);
      y += 7;
      doc.setTextColor(d.option.isCorrect ? 34 : 249, d.option.isCorrect ? 197 : 115, d.option.isCorrect ? 94 : 22);
      const lines = doc.splitTextToSize(`${d.option.isCorrect ? '✓' : '✗'} ${d.option.text} (+${d.option.points}pts)`, 140);
      doc.text(lines, 35, y);
      y += lines.length * 6 + 4;
    });

    y += 8;
    doc.setFontSize(14);
    doc.setTextColor(250, 204, 21);
    doc.text('Insignias:', 30, y);
    y += 10;
    doc.setFontSize(10);
    HERO_BADGES.forEach(b => {
      if (y > 270) { doc.addPage(); doc.setFillColor(15, 23, 42); doc.rect(0, 0, 210, 297, 'F'); y = 25; }
      const earned = earnedBadges.includes(b.id);
      doc.setTextColor(earned ? 255 : 100, earned ? 255 : 100, earned ? 255 : 100);
      doc.text(`${earned ? '★' : '☆'} ${b.name} - ${b.description}`, 30, y);
      y += 8;
    });

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Gemelo Conductual Digital © 2026 | ANIQUEM', 105, 285, { align: 'center' });

    doc.save(`guardianes-${avatar.name || 'reporte'}.pdf`);
  };

  /* ────── RENDER ────── */

  // INTRO PHASE
  if (phase === 'intro') {
    return (
      <div className="aurora-bg min-h-screen flex flex-col">
        <ParticlesCanvas mousePos={{ x: 0, y: 0 }} />
        <div className="flex-1 flex items-center justify-center px-4 py-16 relative z-10">
          <div className="w-full max-w-2xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
              <div className="inline-block p-6 glass-card">
                <AvatarDisplay avatar={avatar} size={120} />
                {avatar.name && <p className="mt-2 text-white/80 font-semibold">{avatar.name}</p>}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="glass-card p-8">
              <div className="mb-6">
                <AniCat message={aniMessage} mood={aniMood} speaking={speaking} />
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                className="text-center space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold">Historias de Guardianes</h2>
                <p className="text-white/50 text-sm max-w-md mx-auto">
                  Vive historias inspiradas en casos reales de prevención de quemaduras. Toma decisiones, gana puntos y conviértete en un Héroe Guardián.
                </p>

                <div className="flex items-center justify-center gap-3">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      voiceEnabled ? 'border-neon-green/40 bg-neon-green/10 text-neon-green' : 'border-white/10 bg-white/5 text-white/40'
                    }`}>
                    {voiceEnabled ? '🔊 Voz activada' : '🔇 Voz desactivada'}
                  </motion.button>
                </div>

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleStartAdventure}
                  className="px-10 py-4 bg-gradient-to-r from-bright-orange to-vibrant-yellow text-white font-bold text-lg rounded-2xl btn-3d">
                  🛡️ ¡Comenzar Aventura!
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // STORY SELECT PHASE
  if (phase === 'story-select') {
    return (
      <div className="aurora-bg min-h-screen flex flex-col">
        <ParticlesCanvas mousePos={{ x: 0, y: 0 }} />
        <div className="flex-1 px-4 py-16 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <AniCat message={aniMessage} mood={aniMood} speaking={speaking} />
            </div>

            <h2 className="text-2xl font-bold text-center mb-2">Elige una Historia</h2>
            <p className="text-white/40 text-center text-sm mb-8">Cada historia está inspirada en casos reales</p>

            <div className="grid gap-4">
              {STORIES.map((story, idx) => {
                const done = completedStories.includes(story.id);
                return (
                  <motion.button
                    key={story.id}
                    whileHover={!done ? { scale: 1.02, y: -3 } : {}}
                    whileTap={!done ? { scale: 0.98 } : {}}
                    onClick={() => !done && handleSelectStory(idx)}
                    disabled={done}
                    className={`w-full p-5 rounded-2xl border-2 text-left flex items-center gap-5 transition-all ${
                      done ? 'border-neon-green/30 bg-neon-green/5 opacity-60'
                        : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    <motion.div
                      animate={!done ? { y: [0, -4, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center text-3xl flex-shrink-0"
                    >
                      {done ? '✅' : story.icon}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white">{story.title}</h3>
                      <p className="text-white/50 text-sm mt-1">{story.summary}</p>
                    </div>
                    {!done && <span className="text-white/30 text-xl flex-shrink-0">→</span>}
                  </motion.button>
                );
              })}
            </div>

            {/* Score bar */}
            <div className="mt-8 glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="text-xs font-bold text-white/60">Puntuación</p>
                  <p className="text-lg font-bold text-vibrant-yellow">{score} pts</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {HERO_BADGES.slice(0, 3).map(b => (
                  <span key={b.id} className={`text-2xl ${earnedBadges.includes(b.id) ? '' : 'opacity-20 grayscale'}`}>
                    {b.icon}
                  </span>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-white/60">Historias</p>
                <p className="text-lg font-bold text-neon-green">{completedStories.length}/{STORIES.length}</p>
              </div>
            </div>

            {/* Early finish button */}
            {storyDecisions.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-6">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    stop();
                    setPhase('results');
                    setAniMood('happy');
                    setAniMessage('¡Miau! ¡Buen trabajo hasta aquí! 🐱 Veamos cómo te fue...');
                  }}
                  className="px-6 py-2.5 bg-white/10 text-white/60 font-semibold rounded-xl border border-white/10 hover:bg-white/20 hover:text-white transition-all text-sm">
                  🏁 Terminar Prueba y Ver Reporte
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // STORY PHASE
  if (phase === 'story' && currentChapter) {
    const isDecision = currentChapter.type === 'decision';
    const isLastChapter = currentChapterIdx === currentStory.chapters.length - 1;
    const canContinue = isDecision ? !!selectedOption : true;

    return (
      <div className="aurora-bg min-h-screen flex flex-col">
        <ParticlesCanvas mousePos={{ x: 0, y: 0 }} />

        {/* Progress */}
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/10">
          <motion.div className="h-full bg-gradient-to-r from-bright-orange to-vibrant-yellow"
            animate={{ width: `${((currentChapterIdx + 1) / currentStory.chapters.length) * 100}%` }}
            transition={{ duration: 0.5 }} />
        </div>

        <div className="flex-1 px-4 py-16 relative z-10">
          <div className="max-w-2xl mx-auto space-y-5">
            {/* ANI */}
            <AniCat message={aniMessage} mood={aniMood} speaking={speaking} />

            {/* Voice toggle */}
            <div className="flex items-center justify-between">
              <p className="text-white/30 text-xs">{currentStory.title} — Parte {currentChapterIdx + 1}/{currentStory.chapters.length}</p>
              <button onClick={() => { setVoiceEnabled(!voiceEnabled); if (voiceEnabled) stop(); }}
                className="text-xs text-white/30 hover:text-white/60 transition-all">
                {voiceEnabled ? '🔊' : '🔇'}
              </button>
            </div>

            {/* Scene */}
            <AnimatePresence mode="wait">
              <motion.div key={currentChapter.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }}>
                <StoryScene chapter={currentChapter} storyBg={currentStory.sceneBg} />
              </motion.div>
            </AnimatePresence>

            {/* Text */}
            <AnimatePresence mode="wait">
              <motion.div key={`text-${currentChapter.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }} className="glass-card p-5 md:p-6">
                <p className="text-white/90 leading-relaxed text-sm md:text-base">{currentChapter.text}</p>

                {/* Decision options */}
                {isDecision && currentChapter.options && (
                  <div className="mt-5 space-y-3">
                    {currentChapter.options.map(opt => (
                      <DecisionOption key={opt.id} option={opt} selected={selectedOption?.id === opt.id}
                        onSelect={handleDecision} disabled={!!selectedOption} />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => { stop(); setPhase('story-select'); setSelectedOption(null); }}
                className="px-5 py-2.5 bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/20 transition-all text-sm">
                ← Historias
              </motion.button>

              {canContinue && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextChapter}
                  className="px-6 py-2.5 bg-gradient-to-r from-bright-orange to-vibrant-yellow text-white font-bold rounded-xl text-sm">
                  {isLastChapter ? '✅ Completar Historia' : 'Continuar →'}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RESULTS PHASE
  if (phase === 'results') {
    const maxScore = STORIES.length * 30;
    const percentage = Math.round((score / maxScore) * 100);

    return (
      <div className="aurora-bg min-h-screen flex flex-col">
        <ParticlesCanvas mousePos={{ x: 0, y: 0 }} />
        <div className="flex-1 px-4 py-16 relative z-10">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="mb-6">
              <AniCat message={aniMessage} mood={aniMood} speaking={speaking} />
            </div>

            {/* Score Summary */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 text-center">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4">🏆</motion.div>
              <h2 className="text-3xl font-bold mb-2">¡Héroe Guardián!</h2>
              <p className="text-white/50 text-sm mb-6">Has completado todas las Historias de Guardianes</p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="glass-card p-4">
                  <p className="text-3xl font-bold text-vibrant-yellow">{score}</p>
                  <p className="text-[10px] text-white/40">Puntos</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-3xl font-bold text-neon-green">{percentage}%</p>
                  <p className="text-[10px] text-white/40">Protección</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-3xl font-bold text-bright-orange">{earnedBadges.length}</p>
                  <p className="text-[10px] text-white/40">Insignias</p>
                </div>
              </div>

              {/* Performance message */}
              <div className={`p-4 rounded-xl mb-4 ${percentage >= 80 ? 'bg-neon-green/10 border border-neon-green/20' : percentage >= 50 ? 'bg-vibrant-yellow/10 border border-vibrant-yellow/20' : 'bg-bright-orange/10 border border-bright-orange/20'}`}>
                <p className="text-sm font-semibold">
                  {percentage >= 80 ? '🌟 ¡Eres un Guardián excepcional! Tus decisiones protegen a todos.' :
                    percentage >= 50 ? '💪 ¡Buen trabajo! Estás aprendiendo a ser un Guardián. ¡Sigue así!' :
                      '📚 Cada historia te enseñó algo valioso. ¡Practica lo aprendido y serás un gran Guardián!'}
                </p>
              </div>
            </motion.div>

            {/* Badges */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h3 className="text-lg font-bold text-center mb-4">🛡️ Insignias de Héroe</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {HERO_BADGES.map(b => (
                  <BadgeCard key={b.id} badge={b} earned={earnedBadges.includes(b.id)} />
                ))}
              </div>
            </motion.div>

            {/* Decisions recap */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="glass-card p-6">
              <h3 className="text-lg font-bold mb-4">📋 Tus Decisiones</h3>
              <div className="space-y-3">
                {storyDecisions.map((d, i) => (
                  <div key={i} className={`p-3 rounded-xl border ${d.option.isCorrect ? 'border-neon-green/20 bg-neon-green/5' : 'border-bright-orange/20 bg-bright-orange/5'}`}>
                    <p className="text-xs text-white/40 font-bold">{d.storyTitle}</p>
                    <p className="text-sm text-white/80 mt-1">{d.option.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold ${d.option.isCorrect ? 'text-neon-green' : 'text-bright-orange'}`}>
                        {d.option.isCorrect ? '✅ Correcto' : '⚠️ Riesgoso'}
                      </span>
                      <span className="text-[10px] text-vibrant-yellow font-bold">+{d.option.points}pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={generatePDF}
                className="px-8 py-3 bg-gradient-to-r from-electric-blue to-deep-purple text-white font-bold rounded-xl">
                📄 Descargar Reporte PDF
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/avatar', { state: { goToModeSelect: true } })}
                className="px-8 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                � Elegir otro Modo
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
