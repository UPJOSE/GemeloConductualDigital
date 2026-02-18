import { motion } from 'framer-motion';
import useStore from '../store/useStore';

export default function IRPBar({ compact = false }) {
  const irp = useStore((s) => s.irp);
  const getRiskLevel = useStore((s) => s.getRiskLevel);
  const { label, color, emoji } = getRiskLevel();

  const getBarColor = () => {
    if (irp <= 30) return 'from-green-400 to-green-600';
    if (irp <= 50) return 'from-yellow-400 to-yellow-500';
    if (irp <= 70) return 'from-orange-400 to-orange-500';
    return 'from-red-400 to-red-500';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-white/70">IRP</span>
        <div className="w-32 h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${getBarColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${irp}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <span className="text-sm font-bold" style={{ color }}>{Math.round(irp)}</span>
      </div>
    );
  }

  return (
    <motion.div
      className="glass-card p-4 w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-white/70">Índice de Riesgo Personal</span>
        <span className="text-lg font-bold flex items-center gap-1" style={{ color }}>
          {emoji} {Math.round(irp)}
        </span>
      </div>
      <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${getBarColor()}`}
          initial={{ width: '30%' }}
          animate={{ width: `${irp}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-white/40">Seguro</span>
        <span className="text-xs font-semibold" style={{ color }}>{label}</span>
        <span className="text-xs text-white/40">Riesgoso</span>
      </div>
    </motion.div>
  );
}
