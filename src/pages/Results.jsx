import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts';
import { jsPDF } from 'jspdf';
import useStore from '../store/useStore';
import AvatarDisplay from '../components/AvatarDisplay';
import ParticlesCanvas from '../components/ParticlesCanvas';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const CATEGORY_LABELS = {
  cocina: 'Cocina',
  electricidad: 'Electricidad',
  fuego: 'Fuego',
  agua: 'Agua',
};

const CATEGORY_COLORS = {
  cocina: '#F97316',
  electricidad: '#FACC15',
  fuego: '#EF4444',
  agua: '#2563EB',
};

function SemiCircleGauge({ value, size = 200 }) {
  const angle = (value / 100) * 180;
  const rad = (angle * Math.PI) / 180;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const r = size / 2 - 20;

  const x = cx + r * Math.cos(Math.PI - rad);
  const y = cy - r * Math.sin(Math.PI - rad);

  const getColor = () => {
    if (value <= 30) return '#22C55E';
    if (value <= 50) return '#FACC15';
    if (value <= 70) return '#F97316';
    return '#EF4444';
  };

  const largeArc = angle > 180 ? 1 : 0;

  return (
    <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
      {/* Background arc */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* Value arc */}
      <motion.path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 ${largeArc} 1 ${x} ${y}`}
        fill="none"
        stroke={getColor()}
        strokeWidth="12"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
      {/* Value text */}
      <text x={cx} y={cy - 15} textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">
        {Math.round(value)}
      </text>
      <text x={cx} y={cy + 5} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">
        IRP Final
      </text>
      {/* Labels */}
      <text x={cx - r} y={cy + 20} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9">Seguro</text>
      <text x={cx + r} y={cy + 20} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9">Riesgoso</text>
    </svg>
  );
}

function ParallelFutures({ irp }) {
  const safeScore = Math.max(0, 100 - irp);
  const riskyScore = irp;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Safe Future */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-6 border-2 border-neon-green/20"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🟢</span>
          <h3 className="text-lg font-bold text-neon-green">Línea Segura</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">Probabilidad de seguridad</span>
            <span className="font-bold text-neon-green">{safeScore}%</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${safeScore}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
          <p className="text-white/50 text-sm mt-3">
            {safeScore >= 70
              ? 'Tu gemelo muestra un futuro con alta conciencia de seguridad. Tus decisiones protegen tu bienestar.'
              : safeScore >= 50
              ? 'Tu gemelo tiene una base de seguridad, pero hay áreas donde puedes mejorar tus decisiones.'
              : 'Tu gemelo necesita desarrollar más hábitos de seguridad para protegerse mejor.'}
          </p>
        </div>
      </motion.div>

      {/* Risky Future */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-card p-6 border-2 border-bright-orange/20"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🔴</span>
          <h3 className="text-lg font-bold text-bright-orange">Línea Riesgosa</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">Nivel de exposición</span>
            <span className="font-bold text-bright-orange">{riskyScore}%</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${riskyScore}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
          <p className="text-white/50 text-sm mt-3">
            {riskyScore <= 30
              ? 'Excelente: tu nivel de exposición al riesgo es muy bajo. ¡Sigue así!'
              : riskyScore <= 50
              ? 'Hay algunos riesgos que podrías reducir con mejores decisiones preventivas.'
              : 'Tu gemelo muestra alta exposición a situaciones de riesgo. Es importante aprender a prevenir.'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function BadgeDisplay({ earnedBadges, badges }) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {badges.map((badge) => {
        const earned = earnedBadges.includes(badge.id);
        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1, y: -5 }}
            className={`glass-card p-4 text-center w-36 ${
              earned ? 'border border-vibrant-yellow/30' : 'opacity-40'
            }`}
          >
            <motion.div
              animate={earned ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-3xl mb-2"
            >
              {earned ? badge.icon : '🔒'}
            </motion.div>
            <p className="text-xs font-bold text-white/80">{badge.name}</p>
            {earned && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-vibrant-yellow mt-1"
              >
                ¡Desbloqueada!
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function Results() {
  const navigate = useNavigate();
  const {
    irp, riskProfile, irpHistory, avatar, decisions, scenarios,
    earnedBadges, badges, getRiskLevel, getMostVulnerableCategory,
    getSessionDuration, resetSimulation, simulationComplete,
  } = useStore();

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!simulationComplete) {
      navigate('/');
      return;
    }
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, [simulationComplete, navigate]);

  const riskLevel = getRiskLevel();
  const mostVulnerable = getMostVulnerableCategory();
  const sessionDuration = getSessionDuration();

  const radarData = Object.entries(riskProfile).map(([key, val]) => ({
    category: CATEGORY_LABELS[key],
    value: Math.max(0, Math.min(100, val + 30)),
    fullMark: 100,
  }));

  const historyData = irpHistory.map((val, i) => ({
    escenario: i === 0 ? 'Inicio' : `E${i}`,
    irp: val,
  }));

  const categoryBarData = Object.entries(riskProfile).map(([key, val]) => ({
    name: CATEGORY_LABELS[key],
    value: Math.abs(val),
    color: CATEGORY_COLORS[key],
    raw: val,
  }));

  const getRecommendations = () => {
    const recs = [];
    if (riskProfile.fuego > 5) recs.push('Nunca juegues con fuego, fósforos o encendedores sin supervisión adulta.');
    if (riskProfile.electricidad > 5) recs.push('Los enchufes y cables son peligrosos. Siempre avisa a un adulto si ves algo raro.');
    if (riskProfile.cocina > 5) recs.push('La cocina tiene muchos riesgos. Pide ayuda para manejar objetos calientes.');
    if (riskProfile.agua > 5) recs.push('Siempre verifica la temperatura del agua antes de usarla.');
    if (recs.length === 0) recs.push('¡Excelente! Tus decisiones muestran gran conciencia de seguridad. ¡Sigue así!');
    return recs;
  };

  const getMotivationalMessage = () => {
    if (irp <= 25) return '¡Eres un verdadero Guardián de la Seguridad! Tus decisiones protegen tu futuro. 🌟';
    if (irp <= 45) return '¡Muy bien! Tienes buena conciencia de seguridad. Con práctica serás aún mejor. 💪';
    if (irp <= 65) return 'Tienes potencial para mejorar. Cada buena decisión cuenta para tu seguridad. 🎯';
    return 'Recuerda: siempre puedes elegir el camino seguro. ¡Tú tienes el poder de cambiar tu futuro! 🔮';
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Reporte - Gemelo Conductual Digital', 105, 25, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(150, 150, 150);
    doc.text('En alianza con ANIQEM', 105, 33, { align: 'center' });

    doc.setDrawColor(37, 99, 235);
    doc.line(30, 38, 180, 38);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(`Nombre: ${avatar.name}`, 30, 52);
    doc.text(`IRP Final: ${Math.round(irp)}`, 30, 62);
    doc.text(`Nivel: ${riskLevel.label}`, 30, 72);
    doc.text(`Categoría más vulnerable: ${CATEGORY_LABELS[mostVulnerable]}`, 30, 82);
    doc.text(`Duración: ${Math.floor(sessionDuration / 60)}m ${sessionDuration % 60}s`, 30, 92);

    doc.setDrawColor(37, 99, 235);
    doc.line(30, 100, 180, 100);

    doc.setFontSize(16);
    doc.setTextColor(37, 99, 235);
    doc.text('Perfil de Riesgo por Categoría', 30, 115);

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    let y = 128;
    Object.entries(riskProfile).forEach(([key, val]) => {
      doc.text(`${CATEGORY_LABELS[key]}: ${val > 0 ? '+' : ''}${val.toFixed(1)}`, 35, y);
      y += 10;
    });

    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.text('Recomendaciones', 30, y + 15);

    doc.setFontSize(11);
    doc.setTextColor(200, 200, 200);
    y += 28;
    getRecommendations().forEach((rec) => {
      const lines = doc.splitTextToSize(`• ${rec}`, 150);
      doc.text(lines, 35, y);
      y += lines.length * 7;
    });

    y += 10;
    doc.setFontSize(13);
    doc.setTextColor(250, 204, 21);
    const msgLines = doc.splitTextToSize(getMotivationalMessage(), 150);
    doc.text(msgLines, 105, y, { align: 'center' });

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Gemelo Conductual Digital © 2026 | ANIQEM', 105, 285, { align: 'center' });

    doc.save(`gemelo-conductual-${avatar.name || 'reporte'}.pdf`);
  };

  const handleRestart = () => {
    resetSimulation();
    navigate('/');
  };

  if (!showContent) {
    return (
      <div className="aurora-bg min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-6xl mb-4"
          >
            🔮
          </motion.div>
          <p className="text-white/60 text-lg">Analizando tu futuro paralelo...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="aurora-bg min-h-screen pb-16">
      <ParticlesCanvas mousePos={{ x: 0, y: 0 }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            Tu <span className="gradient-text">Futuro Paralelo</span>
          </h1>
          <p className="text-white/50">Resultados de la simulación de {avatar.name}</p>
        </motion.div>

        {/* Avatar + Gauge */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
          <div className="glass-card p-6 text-center">
            <AvatarDisplay avatar={avatar} size={120} />
            <p className="mt-2 font-bold">{avatar.name}</p>
            <p className="text-sm" style={{ color: riskLevel.color }}>
              {riskLevel.emoji} {riskLevel.label}
            </p>
          </div>
          <div className="glass-card p-6">
            <SemiCircleGauge value={irp} size={220} />
          </div>
        </motion.div>

        {/* Parallel Futures */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">Simulación de Futuros Paralelos</h2>
          <ParallelFutures irp={irp} />
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* IRP History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-bold mb-4">📈 Evolución del IRP</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="escenario" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <Tooltip
                  contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                />
                <Line
                  type="monotone"
                  dataKey="irp"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ fill: '#2563EB', r: 4 }}
                  activeDot={{ r: 6, fill: '#22C55E' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-bold mb-4">🎯 Perfil de Riesgo</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="category" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Riesgo"
                  dataKey="value"
                  stroke="#F97316"
                  fill="#F97316"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Bars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-bold mb-4">📊 Riesgo por Categoría</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <Tooltip
                  contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {categoryBarData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-bold mb-4">💡 Recomendaciones</h3>
            <div className="space-y-3">
              {getRecommendations().map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="flex gap-3 items-start"
                >
                  <span className="text-neon-green mt-0.5">●</span>
                  <p className="text-white/70 text-sm">{rec}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-vibrant-yellow/10 rounded-xl border border-vibrant-yellow/20">
              <p className="text-vibrant-yellow text-sm font-semibold">{getMotivationalMessage()}</p>
            </div>
          </motion.div>
        </div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-center mb-6">🏆 Insignias</h2>
          <BadgeDisplay earnedBadges={earnedBadges} badges={badges} />
        </motion.div>

        {/* Session Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-6 mb-12"
        >
          <h3 className="text-lg font-bold mb-4 text-center">📋 Resumen de Sesión</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-electric-blue">{Math.round(irp)}</p>
              <p className="text-xs text-white/50">IRP Final</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neon-green">{decisions.length}</p>
              <p className="text-xs text-white/50">Decisiones</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-bright-orange">{CATEGORY_LABELS[mostVulnerable]}</p>
              <p className="text-xs text-white/50">Más Vulnerable</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-vibrant-yellow">
                {Math.floor(sessionDuration / 60)}:{String(sessionDuration % 60).padStart(2, '0')}
              </p>
              <p className="text-xs text-white/50">Duración</p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generatePDF}
            className="btn-3d px-8 py-4 bg-gradient-to-r from-electric-blue to-deep-purple text-white font-bold rounded-2xl"
          >
            📄 Descargar Reporte PDF
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRestart}
            className="px-8 py-4 bg-white/10 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
          >
            🔄 Intentar de Nuevo
          </motion.button>
        </motion.div>

        {/* Footer */}
        <div className="text-center py-8 text-white/30 text-sm border-t border-white/5">
          <p>Gemelo Conductual Digital © 2026 | En alianza con ANIQEM</p>
        </div>
      </div>
    </div>
  );
}
