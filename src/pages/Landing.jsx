import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import ParticlesCanvas from '../components/ParticlesCanvas';

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

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <motion.div style={{ y: bgY }} className="absolute inset-0 z-0" />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-electric-blue to-deep-purple flex items-center justify-center float-animation pulse-glow">
              <span className="text-6xl">🧬</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <TypeWriter text="Cada decisión crea un futuro diferente." speed={60} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.6 }}
            className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto"
          >
            Descubre tu <span className="gradient-text font-bold">Gemelo Conductual Digital</span> en alianza con ANIQEM.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/avatar')}
              className="btn-3d px-8 py-4 bg-gradient-to-r from-electric-blue to-deep-purple text-white font-bold text-lg rounded-2xl hover:shadow-2xl transition-all"
            >
              🧬 Crear mi Gemelo
            </button>
            <button
              onClick={() => document.getElementById('problema').scrollIntoView({ behavior: 'smooth' })}
              className="btn-3d px-8 py-4 bg-white/10 backdrop-blur text-white font-bold text-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            >
              📖 Conocer el Proyecto
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5 }}
            className="mt-16"
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
        <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold text-center mb-4">
          El Problema que <span className="gradient-text">Enfrentamos</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
          Las quemaduras infantiles son una de las principales causas de lesiones prevenibles en América Latina.
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
      <SectionWrapper className="max-w-4xl mx-auto text-center">
        <motion.div variants={fadeUp} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/20 via-transparent to-electric-blue/20 rounded-3xl blur-3xl" />
          <div className="relative glass-card p-8 md:p-12 border border-white/10">
            <motion.div
              animate={{ boxShadow: ['0 0 30px rgba(37,99,235,0.2)', '0 0 60px rgba(37,99,235,0.4)', '0 0 30px rgba(37,99,235,0.2)'] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-white/10 flex items-center justify-center"
            >
              <span className="text-5xl">🏛️</span>
            </motion.div>

            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Alianza con <span className="text-electric-blue">ANIQEM</span>
            </h2>
            <p className="text-white/70 max-w-xl mx-auto leading-relaxed">
              Proyecto validado conceptualmente en colaboración con ANIQEM para prevención de quemaduras infantiles.
              Juntos construimos herramientas tecnológicas que salvan vidas.
            </p>
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
      <footer className="text-center py-8 text-white/30 text-sm border-t border-white/5">
        <p>Gemelo Conductual Digital © 2026 | En alianza con ANIQEM</p>
      </footer>
    </div>
  );
}
