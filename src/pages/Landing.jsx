import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import ParticlesCanvas from '../components/ParticlesCanvas';
import aniqemLogo from '../images.png';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

function AnimatedCounter({ end, duration = 2, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function TypeWriter({ text, speed = 50 }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!done && <span className="animate-pulse text-electric-blue">|</span>}
    </span>
  );
}

function SectionWrapper({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={stagger}
      className={`relative py-20 px-4 md:px-8 lg:px-16 ${className}`}
    >
      {children}
    </motion.section>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const stats = [
    { value: 35000, suffix: '+', label: 'Niños con quemaduras al año en Perú', icon: '🏥' },
    { value: 70, suffix: '%', label: 'Ocurren en el hogar', icon: '🏠' },
    { value: 60, suffix: '%', label: 'Son prevenibles con educación', icon: '📚' },
    { value: 9, suffix: '-12', label: 'Edad de mayor riesgo (años)', icon: '👧' },
  ];

  const timelinePhases = [
    { phase: 'Fase 1', title: 'MVP validado en colegios', color: '#2563EB', icon: '🏫' },
    { phase: 'Fase 2', title: 'Modelo predictivo avanzado', color: '#22C55E', icon: '🧠' },
    { phase: 'Fase 3', title: 'Dashboard poblacional para ANIQEM', color: '#F97316', icon: '📊' },
    { phase: 'Fase 4', title: 'Escalamiento nacional', color: '#FACC15', icon: '🚀' },
  ];

  return (
    <div className="aurora-bg min-h-screen" onMouseMove={handleMouseMove}>
      <ParticlesCanvas mousePos={mousePos} />

      {/* NAVBAR */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/60 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <span className="font-bold text-sm md:text-base text-white">Gemelo Conductual</span>
          </div>
          <div className="flex items-center gap-3">
            <img src={aniqemLogo} alt="ANIQEM" className="h-8 md:h-9 object-contain bg-white rounded-md px-2 py-1" />
          </div>
        </div>
      </motion.nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden">
        <motion.div style={{ y: bgY }} className="absolute inset-0 z-0" />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Alliance badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <img src={aniqemLogo} alt="ANIQEM" className="h-5 object-contain bg-white rounded px-1" />
            <span className="text-xs md:text-sm text-white/60">Proyecto en alianza con ANIQEM</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-6"
          >
            <div className="w-28 h-28 mx-auto mb-4 rounded-full bg-gradient-to-br from-bright-orange/80 to-vibrant-yellow/80 flex items-center justify-center float-animation pulse-glow">
              <span className="text-5xl">🛡️</span>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base font-semibold tracking-widest uppercase text-bright-orange/80 mb-4"
          >
            Prevención de Quemaduras Infantiles
          </motion.p>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            <TypeWriter text="Tus decisiones pueden prevenir quemaduras." speed={50} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.6 }}
            className="text-base md:text-lg text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Un <span className="text-white font-semibold">simulador conductual predictivo</span> que enseña a niños de 9 a 12 años a identificar riesgos de quemaduras en el hogar, a través de escenarios interactivos y un <span className="gradient-text font-bold">Gemelo Conductual Digital</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/avatar')}
              className="btn-3d px-8 py-4 bg-gradient-to-r from-bright-orange to-vibrant-yellow text-dark-bg font-bold text-lg rounded-2xl hover:shadow-2xl transition-all"
            >
              🛡️ Iniciar Simulación
            </button>
            <button
              onClick={() => document.getElementById('problema').scrollIntoView({ behavior: 'smooth' })}
              className="btn-3d px-8 py-4 bg-white/10 backdrop-blur text-white font-bold text-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            >
              📖 Conocer el Proyecto
            </button>
          </motion.div>

          {/* Quick stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.6, duration: 0.6 }}
            className="mt-14 grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            {[
              { num: '35K+', text: 'niños afectados/año' },
              { num: '70%', text: 'ocurren en el hogar' },
              { num: '60%', text: 'son prevenibles' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-lg md:text-xl font-bold text-bright-orange">{s.num}</p>
                <p className="text-[10px] md:text-xs text-white/40">{s.text}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4 }}
            className="mt-12"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white/40 text-3xl"
            >
              ↓
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PROBLEMA */}
      <SectionWrapper className="max-w-6xl mx-auto" >
        <div id="problema" className="scroll-mt-20" />
        <motion.div variants={fadeUp} className="text-center mb-4">
          <span className="inline-block px-3 py-1 rounded-full bg-bright-orange/10 border border-bright-orange/20 text-bright-orange text-xs font-semibold tracking-wider uppercase mb-4">Contexto del problema</span>
        </motion.div>
        <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold text-center mb-4">
          Las Quemaduras Infantiles <span className="text-bright-orange">son Prevenibles</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
          En el Perú, miles de niños sufren quemaduras cada año, la mayoría dentro de sus propios hogares. La educación preventiva es la herramienta más poderosa para cambiar esta realidad.
        </motion.p>

        <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card p-6 text-center cursor-default"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-white/60 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </SectionWrapper>

      {/* QUE ES EL GEMELO */}
      <SectionWrapper className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeUp}>
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 to-deep-purple/10" />
              <div className="relative z-10">
                <svg viewBox="0 0 300 200" className="w-full">
                  {/* Decision Tree Diagram */}
                  <circle cx="150" cy="30" r="20" fill="#2563EB" opacity="0.8" />
                  <text x="150" y="35" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">?</text>

                  <line x1="150" y1="50" x2="80" y2="90" stroke="#22C55E" strokeWidth="2" />
                  <line x1="150" y1="50" x2="220" y2="90" stroke="#F97316" strokeWidth="2" />

                  <circle cx="80" cy="100" r="15" fill="#22C55E" opacity="0.8" />
                  <text x="80" y="104" textAnchor="middle" fill="white" fontSize="10">✓</text>

                  <circle cx="220" cy="100" r="15" fill="#F97316" opacity="0.8" />
                  <text x="220" y="104" textAnchor="middle" fill="white" fontSize="10">✗</text>

                  <line x1="80" y1="115" x2="50" y2="150" stroke="#22C55E" strokeWidth="1.5" opacity="0.6" />
                  <line x1="80" y1="115" x2="110" y2="150" stroke="#FACC15" strokeWidth="1.5" opacity="0.6" />
                  <line x1="220" y1="115" x2="190" y2="150" stroke="#FACC15" strokeWidth="1.5" opacity="0.6" />
                  <line x1="220" y1="115" x2="250" y2="150" stroke="#EF4444" strokeWidth="1.5" opacity="0.6" />

                  <circle cx="50" cy="160" r="10" fill="#22C55E" opacity="0.6" />
                  <circle cx="110" cy="160" r="10" fill="#FACC15" opacity="0.6" />
                  <circle cx="190" cy="160" r="10" fill="#FACC15" opacity="0.6" />
                  <circle cx="250" cy="160" r="10" fill="#EF4444" opacity="0.6" />

                  <text x="150" y="195" textAnchor="middle" fill="white" fontSize="11" opacity="0.7">Árbol de Decisiones → Futuro Simulado</text>
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold mb-6">
              ¿Qué es el <span className="gradient-text">Gemelo Conductual</span>?
            </motion.h2>

            {[
              { icon: '🌳', title: 'Árboles de Decisión', desc: 'Cada elección abre caminos diferentes hacia el futuro.' },
              { icon: '🧬', title: 'Perfil Dinámico', desc: 'Tu Índice de Riesgo Personal se adapta en tiempo real.' },
              { icon: '🎲', title: 'Simulación Probabilística', desc: 'Calculamos el impacto de tus decisiones con modelos predictivos.' },
              { icon: '🔮', title: 'Proyección Comparativa', desc: 'Visualiza dos futuros paralelos basados en tus elecciones.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ x: 10 }}
                className="flex gap-4 mb-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h4 className="font-bold text-white">{item.title}</h4>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}

            <motion.div variants={fadeUp} className="mt-6 glass-card p-4">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span className="text-neon-green font-bold">Decisión</span>
                <span>→</span>
                <span className="text-bright-orange font-bold">Cambio IRP</span>
                <span>→</span>
                <span className="text-vibrant-yellow font-bold">Proyección Futuro</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* ALIANZA ANIQEM */}
      <SectionWrapper className="max-w-5xl mx-auto">
        <motion.div variants={fadeUp} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-bright-orange/10 via-transparent to-bright-orange/10 rounded-3xl blur-3xl" />
          <div className="relative rounded-3xl overflow-hidden border border-white/10">
            {/* Professional header bar */}
            <div className="bg-gradient-to-r from-white/[0.08] to-white/[0.03] px-6 md:px-10 py-4 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs md:text-sm font-semibold tracking-wider uppercase text-white/40">Alianza Estratégica</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="text-xs text-neon-green/80 font-medium">Activa</span>
              </div>
            </div>

            <div className="p-8 md:p-12 bg-white/[0.03]">
              <div className="grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
                {/* Left: ANIQEM info */}
                <div className="text-center md:text-left">
                  <motion.div
                    animate={{ boxShadow: ['0 0 20px rgba(249,115,22,0.15)', '0 0 40px rgba(249,115,22,0.25)', '0 0 20px rgba(249,115,22,0.15)'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-block bg-white rounded-xl p-4 md:p-5 mb-5"
                  >
                    <img src={aniqemLogo} alt="ANIQEM - Asociación de Ayuda al Niño Quemado" className="h-12 md:h-16 object-contain" />
                  </motion.div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">
                    ANIQEM
                  </h3>
                  <p className="text-white/40 text-sm font-medium">
                    Asociación de Ayuda al Niño Quemado
                  </p>
                </div>

                {/* Center divider */}
                <div className="hidden md:flex flex-col items-center gap-2">
                  <div className="w-px h-8 bg-white/10" />
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <span className="text-sm">🤝</span>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                </div>

                {/* Right: Project info */}
                <div className="text-center md:text-right">
                  <div className="inline-block bg-gradient-to-br from-electric-blue/20 to-deep-purple/20 rounded-xl p-4 md:p-5 mb-5 border border-white/10">
                    <span className="text-4xl">🧬</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">
                    Gemelo Conductual Digital
                  </h3>
                  <p className="text-white/40 text-sm font-medium">
                    Simulador de Prevención de Quemaduras
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-white/60 text-center max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
                  Proyecto validado conceptualmente en colaboración con <span className="text-white font-semibold">ANIQEM</span> (Asociación de Ayuda al Niño Quemado) para la <span className="text-bright-orange font-semibold">prevención de quemaduras infantiles</span> en el Perú. Utilizamos tecnología de simulación conductual para generar conciencia y reducir los índices de accidentes domésticos en la población infantil.
                </p>
              </div>

              {/* Impact numbers */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { label: 'Misión', value: 'Prevención', icon: '🎯' },
                  { label: 'Población', value: '9-12 años', icon: '👧' },
                  { label: 'Enfoque', value: 'Quemaduras', icon: '🏥' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/5"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <p className="text-sm font-bold text-white mt-1">{item.value}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </SectionWrapper>

      {/* TIMELINE */}
      <SectionWrapper className="max-w-5xl mx-auto">
        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-center mb-12">
          Planes y <span className="gradient-text">Proyecciones</span>
        </motion.h2>

        <div className="relative">
          {/* Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-white/10 -translate-y-1/2" />

          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {timelinePhases.map((phase, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative text-center"
              >
                <motion.div
                  whileHover={{ boxShadow: `0 0 30px ${phase.color}40` }}
                  className="glass-card p-6 cursor-default"
                >
                  <div
                    className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${phase.color}30`, border: `2px solid ${phase.color}` }}
                  >
                    {phase.icon}
                  </div>
                  <div className="text-xs font-bold mb-1" style={{ color: phase.color }}>{phase.phase}</div>
                  <p className="text-white/80 text-sm font-semibold">{phase.title}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 320">
            <motion.path
              animate={{
                d: [
                  'M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L0,320Z',
                  'M0,192L48,181.3C96,171,192,149,288,160C384,171,480,213,576,218.7C672,224,768,192,864,170.7C960,149,1056,139,1152,154.7C1248,171,1344,213,1392,234.7L1440,256L1440,320L0,320Z',
                ],
              }}
              transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
              fill="url(#wave-gradient)"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="wave-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="50%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#22C55E" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            ¿Listo para explorar <span className="gradient-text">tu futuro</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 mb-10"
          >
            Tus decisiones de hoy construyen el mundo de mañana.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ boxShadow: ['0 0 20px rgba(37,99,235,0.3)', '0 0 40px rgba(37,99,235,0.6)', '0 0 20px rgba(37,99,235,0.3)'] }}
            transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
            onClick={() => navigate('/avatar')}
            className="px-12 py-5 bg-gradient-to-r from-electric-blue via-deep-purple to-neon-green text-white font-bold text-xl rounded-2xl"
          >
            🚀 Explorar mi Futuro
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-lg">🛡️</span>
            <span className="text-white/40 text-sm font-medium">Gemelo Conductual Digital © 2026</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/30 text-xs">En alianza con</span>
            <img src={aniqemLogo} alt="ANIQEM" className="h-7 object-contain bg-white rounded px-2 py-0.5" />
          </div>
        </div>
      </footer>
    </div>
  );
}
