import { create } from 'zustand';

const SCENARIOS = [
  {
    id: 1,
    title: 'La Olla Hirviendo',
    category: 'cocina',
    icon: '🍲',
    description: 'Estás en la cocina y ves una olla con agua hirviendo en la estufa. El mango sobresale del borde.',
    illustration: 'pot',
    decisions: [
      { id: 'a', text: 'Aviso a un adulto para que la mueva', riskDelta: -5, weight: 1.2, narrativeImpact: 'Pediste ayuda responsablemente. Un adulto movió la olla de forma segura.' },
      { id: 'b', text: 'Intento mover la olla yo mismo', riskDelta: 8, weight: 1.5, narrativeImpact: 'Intentaste mover una olla pesada con agua hirviendo. Esto podría causar una quemadura grave.' },
      { id: 'c', text: 'Giro el mango hacia adentro de la estufa', riskDelta: -3, weight: 1.0, narrativeImpact: 'Giraste el mango para que no sobresalga. Buena acción preventiva.' },
    ],
  },
  {
    id: 2,
    title: 'Enchufe Sin Protección',
    category: 'electricidad',
    icon: '🔌',
    description: 'Encuentras un enchufe sin tapa protectora en la pared. Tienes un clip metálico en la mano.',
    illustration: 'outlet',
    decisions: [
      { id: 'a', text: 'Busco una tapa protectora y la coloco', riskDelta: -5, weight: 1.2, narrativeImpact: 'Protegiste el enchufe correctamente. Prevención inteligente.' },
      { id: 'b', text: 'Meto el clip en el enchufe por curiosidad', riskDelta: 10, weight: 1.8, narrativeImpact: 'Introducir metal en un enchufe puede causar electrocución severa.' },
      { id: 'c', text: 'Lo ignoro y sigo jugando', riskDelta: 2, weight: 0.8, narrativeImpact: 'Ignorar un peligro no lo elimina. Alguien más podría lastimarse.' },
    ],
  },
  {
    id: 3,
    title: 'Pirotecnia en la Fiesta',
    category: 'fuego',
    icon: '🎆',
    description: 'En una fiesta, tus amigos encontraron cohetes pirotécnicos. Quieren encenderlos sin supervisión.',
    illustration: 'fireworks',
    decisions: [
      { id: 'a', text: 'Les digo que busquemos a un adulto', riskDelta: -6, weight: 1.3, narrativeImpact: 'Convenciste a tus amigos de buscar supervisión. Liderazgo responsable.' },
      { id: 'b', text: 'Enciendo uno yo mismo para impresionar', riskDelta: 10, weight: 1.7, narrativeImpact: 'Manipular pirotecnia sin experiencia puede causar quemaduras graves en manos y cara.' },
      { id: 'c', text: 'Me alejo del grupo', riskDelta: -2, weight: 0.9, narrativeImpact: 'Te alejaste del peligro. Protegiste tu seguridad, aunque tus amigos siguen en riesgo.' },
    ],
  },
  {
    id: 4,
    title: 'La Plancha Caliente',
    category: 'cocina',
    icon: '👕',
    description: 'Tu mamá dejó la plancha encendida sobre la tabla y fue a contestar el teléfono.',
    illustration: 'iron',
    decisions: [
      { id: 'a', text: 'Espero a que regrese y le aviso', riskDelta: -3, weight: 1.0, narrativeImpact: 'Esperaste pacientemente y avisaste. La plancha fue apagada de forma segura.' },
      { id: 'b', text: 'Intento planchar mi ropa yo solo', riskDelta: 7, weight: 1.4, narrativeImpact: 'Usar una plancha caliente sin experiencia puede causar quemaduras en las manos.' },
      { id: 'c', text: 'Desconecto la plancha con cuidado', riskDelta: -4, weight: 1.1, narrativeImpact: 'Desconectaste la plancha de forma segura. Acción preventiva excelente.' },
    ],
  },
  {
    id: 5,
    title: 'Agua Muy Caliente',
    category: 'agua',
    icon: '🚿',
    description: 'Vas a bañarte y abres solo la llave del agua caliente. Sale vapor del agua.',
    illustration: 'shower',
    decisions: [
      { id: 'a', text: 'Primero pruebo la temperatura con la mano', riskDelta: 1, weight: 0.8, narrativeImpact: 'Probaste el agua, pero podrías quemarte la mano. Mejor usar el dorso de la muñeca.' },
      { id: 'b', text: 'Me meto directamente a la ducha', riskDelta: 8, weight: 1.5, narrativeImpact: 'Entrar sin verificar la temperatura puede causar quemaduras por escaldadura.' },
      { id: 'c', text: 'Mezclo agua fría primero y luego verifico', riskDelta: -5, weight: 1.2, narrativeImpact: 'Regulaste la temperatura antes de entrar. Procedimiento perfecto.' },
    ],
  },
  {
    id: 6,
    title: 'El Microondas',
    category: 'cocina',
    icon: '📦',
    description: 'Quieres calentar tu comida en el microondas. El plato tiene borde metálico.',
    illustration: 'microwave',
    decisions: [
      { id: 'a', text: 'Cambio a un plato apto para microondas', riskDelta: -5, weight: 1.2, narrativeImpact: 'Usaste el recipiente correcto. Conocimiento aplicado correctamente.' },
      { id: 'b', text: 'Lo meto así, no creo que pase nada', riskDelta: 8, weight: 1.5, narrativeImpact: 'El metal en el microondas puede causar chispas, incendio y explosión.' },
      { id: 'c', text: 'Le pregunto a alguien si este plato sirve', riskDelta: -3, weight: 1.0, narrativeImpact: 'Consultaste antes de actuar. Buena práctica de seguridad.' },
    ],
  },
  {
    id: 7,
    title: 'Cocina de Gas',
    category: 'fuego',
    icon: '🔥',
    description: 'Hueles gas en la cocina. La perilla de la estufa está ligeramente abierta.',
    illustration: 'stove',
    decisions: [
      { id: 'a', text: 'Abro ventanas y aviso a un adulto', riskDelta: -6, weight: 1.4, narrativeImpact: 'Ventilaste y pediste ayuda. Protocolo de seguridad perfecto.' },
      { id: 'b', text: 'Enciendo la luz para ver mejor', riskDelta: 10, weight: 1.8, narrativeImpact: 'Una chispa eléctrica con gas acumulado puede causar una explosión.' },
      { id: 'c', text: 'Cierro la perilla y salgo de la cocina', riskDelta: -4, weight: 1.1, narrativeImpact: 'Cerraste la fuente de gas y te alejaste. Reacción inteligente.' },
    ],
  },
  {
    id: 8,
    title: 'El Encendedor',
    category: 'fuego',
    icon: '🔦',
    description: 'Encuentras un encendedor en el cajón. Estás solo en casa y sientes curiosidad.',
    illustration: 'lighter',
    decisions: [
      { id: 'a', text: 'Lo dejo donde está y lo reporto después', riskDelta: -4, weight: 1.1, narrativeImpact: 'Resististe la curiosidad y reportarás el hallazgo. Madurez demostrada.' },
      { id: 'b', text: 'Lo enciendo para ver la llama', riskDelta: 8, weight: 1.5, narrativeImpact: 'Jugar con fuego sin supervisión es una de las principales causas de incendios domésticos.' },
      { id: 'c', text: 'Lo guardo en un lugar alto fuera de alcance', riskDelta: -3, weight: 1.0, narrativeImpact: 'Lo pusiste fuera de alcance de otros niños. Acción protectora.' },
    ],
  },
  {
    id: 9,
    title: 'Cable Pelado',
    category: 'electricidad',
    icon: '⚡',
    description: 'Ves un cable con el recubrimiento roto que deja ver los hilos de cobre. Está conectado.',
    illustration: 'wire',
    decisions: [
      { id: 'a', text: 'No lo toco y aviso a un adulto inmediatamente', riskDelta: -6, weight: 1.3, narrativeImpact: 'Identificaste el peligro y pediste ayuda. Protocolo de seguridad eléctrica correcto.' },
      { id: 'b', text: 'Lo toco para ver si da corriente', riskDelta: 10, weight: 1.8, narrativeImpact: 'Tocar un cable pelado puede causar electrocución, quemaduras internas y paro cardíaco.' },
      { id: 'c', text: 'Intento arreglarlo con cinta adhesiva', riskDelta: 5, weight: 1.3, narrativeImpact: 'Reparar cables sin desconectar la corriente es muy peligroso.' },
    ],
  },
  {
    id: 10,
    title: 'Juego con Fósforos',
    category: 'fuego',
    icon: '🔴',
    description: 'Tus amigos te retan a encender fósforos y lanzarlos al aire. Hay papel cerca.',
    illustration: 'matches',
    decisions: [
      { id: 'a', text: 'Me niego y les explico el peligro', riskDelta: -6, weight: 1.4, narrativeImpact: 'Te negaste ante la presión social y educaste a tus amigos. Verdadero liderazgo.' },
      { id: 'b', text: 'Acepto el reto para no quedar mal', riskDelta: 10, weight: 1.7, narrativeImpact: 'Lanzar fósforos encendidos cerca de papel puede iniciar un incendio incontrolable.' },
      { id: 'c', text: 'Me alejo sin decir nada', riskDelta: -1, weight: 0.7, narrativeImpact: 'Te protegiste alejándote, pero tus amigos siguen en peligro.' },
    ],
  },
];

const BADGES = [
  { id: 'guardian-fuego', name: 'Guardián del Fuego', icon: '🏆', category: 'fuego', requirement: 'Tomar decisiones seguras en todos los escenarios de fuego' },
  { id: 'protector-electrico', name: 'Protector Eléctrico', icon: '🏆', category: 'electricidad', requirement: 'Tomar decisiones seguras en todos los escenarios eléctricos' },
  { id: 'maestro-cocina', name: 'Maestro de la Cocina', icon: '🏆', category: 'cocina', requirement: 'Tomar decisiones seguras en todos los escenarios de cocina' },
  { id: 'heroe-agua', name: 'Héroe del Agua', icon: '🏆', category: 'agua', requirement: 'Tomar decisiones seguras en el escenario de agua' },
];

const useStore = create((set, get) => ({
  // Avatar
  avatar: {
    hair: 'short',
    hairColor: '#4A3728',
    clothing: 'tshirt',
    clothingColor: '#2563EB',
    skinColor: '#F5D0A9',
    accessory: 'none',
    name: '',
  },
  setAvatar: (updates) => set((state) => ({ avatar: { ...state.avatar, ...updates } })),

  // IRP Engine
  irp: 30,
  riskProfile: { cocina: 0, electricidad: 0, fuego: 0, agua: 0 },
  irpHistory: [30],
  decisions: [],

  updateIRP: (riskDelta, weight, category) => set((state) => {
    const change = riskDelta * weight;
    const newIRP = Math.max(0, Math.min(100, state.irp + change));
    const newProfile = { ...state.riskProfile };
    newProfile[category] = Math.max(0, Math.min(100, (newProfile[category] || 0) + change));
    return {
      irp: Math.round(newIRP * 10) / 10,
      riskProfile: newProfile,
      irpHistory: [...state.irpHistory, Math.round(newIRP * 10) / 10],
    };
  }),

  addDecision: (scenarioId, decision) => set((state) => ({
    decisions: [...state.decisions, { scenarioId, ...decision, timestamp: Date.now() }],
  })),

  // Scenarios
  scenarios: SCENARIOS,
  currentScenarioIndex: 0,
  setCurrentScenarioIndex: (index) => set({ currentScenarioIndex: index }),
  nextScenario: () => set((state) => ({
    currentScenarioIndex: Math.min(state.currentScenarioIndex + 1, SCENARIOS.length),
  })),

  // Badges
  badges: BADGES,
  earnedBadges: [],
  checkBadges: () => set((state) => {
    const earned = [];
    const categoryDecisions = {};

    state.decisions.forEach((d) => {
      const scenario = SCENARIOS.find((s) => s.id === d.scenarioId);
      if (scenario) {
        if (!categoryDecisions[scenario.category]) categoryDecisions[scenario.category] = [];
        categoryDecisions[scenario.category].push(d);
      }
    });

    BADGES.forEach((badge) => {
      const catDecs = categoryDecisions[badge.category] || [];
      const allSafe = catDecs.length > 0 && catDecs.every((d) => d.riskDelta <= 0);
      if (allSafe) earned.push(badge.id);
    });

    return { earnedBadges: earned };
  }),

  // Session
  sessionStart: null,
  startSession: () => set({ sessionStart: Date.now() }),
  getSessionDuration: () => {
    const start = get().sessionStart;
    if (!start) return 0;
    return Math.round((Date.now() - start) / 1000);
  },

  // Navigation state
  simulationComplete: false,
  setSimulationComplete: (val) => set({ simulationComplete: val }),

  // Reset
  resetSimulation: () => set({
    irp: 30,
    riskProfile: { cocina: 0, electricidad: 0, fuego: 0, agua: 0 },
    irpHistory: [30],
    decisions: [],
    currentScenarioIndex: 0,
    earnedBadges: [],
    sessionStart: null,
    simulationComplete: false,
  }),

  // Get risk level label
  getRiskLevel: () => {
    const irp = get().irp;
    if (irp <= 20) return { label: 'Muy Seguro', color: '#22C55E', emoji: '🛡️' };
    if (irp <= 40) return { label: 'Seguro', color: '#22C55E', emoji: '✅' };
    if (irp <= 60) return { label: 'Moderado', color: '#FACC15', emoji: '⚠️' };
    if (irp <= 80) return { label: 'Elevado', color: '#F97316', emoji: '🔶' };
    return { label: 'Alto', color: '#EF4444', emoji: '🔴' };
  },

  getMostVulnerableCategory: () => {
    const profile = get().riskProfile;
    let max = -Infinity;
    let cat = 'cocina';
    Object.entries(profile).forEach(([key, val]) => {
      if (val > max) { max = val; cat = key; }
    });
    return cat;
  },
}));

export default useStore;
