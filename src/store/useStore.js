import { create } from 'zustand';

const ROOMS = {
  cocina: {
    id: 'cocina', name: 'Cocina', icon: '🍳', color: '#F97316',
    description: 'Una cocina familiar con estufa, microondas y muchos utensilios.',
    position: { x: 10, y: 55 },
  },
  sala: {
    id: 'sala', name: 'Sala', icon: '🛋️', color: '#2563EB',
    description: 'La sala de estar con enchufes, cables y la televisión.',
    position: { x: 50, y: 30 },
  },
  bano: {
    id: 'bano', name: 'Baño', icon: '🚿', color: '#06B6D4',
    description: 'El baño con agua caliente, secadora de pelo y suelo mojado.',
    position: { x: 90, y: 55 },
  },
  dormitorio: {
    id: 'dormitorio', name: 'Dormitorio', icon: '🛏️', color: '#7C3AED',
    description: 'Tu dormitorio con velas, enchufes y objetos curiosos.',
    position: { x: 30, y: 80 },
  },
  patio: {
    id: 'patio', name: 'Patio', icon: '🌳', color: '#22C55E',
    description: 'El patio trasero con parrilla, pirotecnia y fósforos escondidos.',
    position: { x: 70, y: 80 },
  },
};

const ROOM_EVENTS = {
  cocina: [
    {
      id: 'k1', title: 'Olla Hirviendo', category: 'cocina', icon: '🍲', type: 'standard',
      description: '¡Una olla con agua hirviendo! El mango sobresale peligrosamente del borde de la estufa.',
      decisions: [
        { id: 'a', text: '🔔 Avisar a un adulto', riskDelta: -5, weight: 1.2, narrativeImpact: 'Pediste ayuda responsablemente. Un adulto movió la olla de forma segura.', altFuture: 'Sin tu aviso, la olla podría haber caído causando quemaduras graves.' },
        { id: 'b', text: '💪 Mover la olla yo mismo', riskDelta: 8, weight: 1.5, narrativeImpact: 'Intentaste mover una olla pesada con agua hirviendo. ¡Cuidado!', altFuture: 'Si hubieras pedido ayuda, un adulto la habría movido sin riesgo.' },
        { id: 'c', text: '🔄 Girar el mango hacia adentro', riskDelta: -3, weight: 1.0, narrativeImpact: 'Giraste el mango para que no sobresalga. ¡Buena prevención!', altFuture: 'Si lo dejas así, alguien podría chocar el mango y derramar agua hirviendo.' },
      ],
    },
    {
      id: 'k2', title: 'Microondas Peligroso', category: 'cocina', icon: '📦', type: 'standard',
      description: 'Quieres calentar tu comida. El plato tiene borde metálico brillante.',
      decisions: [
        { id: 'a', text: '🍽️ Cambiar a plato seguro', riskDelta: -5, weight: 1.2, narrativeImpact: '¡Usaste el recipiente correcto! Conocimiento aplicado.', altFuture: 'El metal habría causado chispas y un posible incendio dentro del microondas.' },
        { id: 'b', text: '🤷 Meterlo así', riskDelta: 8, weight: 1.5, narrativeImpact: 'El metal en el microondas puede causar chispas e incendio.', altFuture: 'Un plato adecuado habría calentado tu comida sin ningún peligro.' },
        { id: 'c', text: '❓ Preguntar a alguien', riskDelta: -3, weight: 1.0, narrativeImpact: 'Consultaste antes de actuar. ¡Buena práctica!', altFuture: 'Si no preguntas, podrías dañar el microondas y causar un accidente.' },
      ],
    },
    {
      id: 'k3', title: 'Cocina de Gas', category: 'fuego', icon: '🔥', type: 'surprise',
      description: '¡Alerta! Hueles gas en la cocina. La perilla de la estufa está ligeramente abierta.',
      timerSeconds: 8,
      decisions: [
        { id: 'a', text: '🪟 Abrir ventanas y avisar', riskDelta: -6, weight: 1.4, narrativeImpact: 'Ventilaste y pediste ayuda. ¡Protocolo perfecto!', altFuture: 'El gas acumulado podría haber causado una explosión al encender cualquier chispa.' },
        { id: 'b', text: '💡 Encender la luz', riskDelta: 10, weight: 1.8, narrativeImpact: 'Una chispa eléctrica con gas acumulado es muy peligroso.', altFuture: 'Abrir ventanas primero habría disipado el gas de forma segura.' },
        { id: 'c', text: '🔧 Cerrar la perilla y salir', riskDelta: -4, weight: 1.1, narrativeImpact: 'Cerraste la fuente de gas y te alejaste. ¡Reacción inteligente!', altFuture: 'Ignorar el olor a gas podría terminar en una emergencia grave.' },
      ],
    },
  ],
  sala: [
    {
      id: 's1', title: 'Enchufe Sin Protección', category: 'electricidad', icon: '🔌', type: 'standard',
      description: 'Encuentras un enchufe sin tapa protectora. Tienes un clip metálico en la mano.',
      decisions: [
        { id: 'a', text: '🛡️ Buscar una tapa protectora', riskDelta: -5, weight: 1.2, narrativeImpact: 'Protegiste el enchufe correctamente. ¡Prevención inteligente!', altFuture: 'Sin protección, un niño pequeño podría meter los dedos y recibir una descarga.' },
        { id: 'b', text: '📎 Meter el clip por curiosidad', riskDelta: 10, weight: 1.8, narrativeImpact: 'Introducir metal en un enchufe puede causar electrocución.', altFuture: 'Si hubieras puesto la tapa, nadie estaría en peligro.' },
        { id: 'c', text: '🚶 Ignorar y seguir jugando', riskDelta: 2, weight: 0.8, narrativeImpact: 'Ignorar un peligro no lo elimina.', altFuture: 'Si lo reportas, un adulto puede poner la protección adecuada.' },
      ],
    },
    {
      id: 's2', title: 'Cable Pelado', category: 'electricidad', icon: '⚡', type: 'surprise',
      description: '¡Cuidado! Un cable con el recubrimiento roto deja ver los hilos de cobre. Está conectado.',
      timerSeconds: 7,
      decisions: [
        { id: 'a', text: '🚨 No tocar y avisar', riskDelta: -6, weight: 1.3, narrativeImpact: '¡Identificaste el peligro y pediste ayuda! Protocolo correcto.', altFuture: 'Alguien podría tropezar con el cable y recibir una descarga eléctrica.' },
        { id: 'b', text: '🤚 Tocar para ver si da corriente', riskDelta: 10, weight: 1.8, narrativeImpact: 'Tocar un cable pelado es extremadamente peligroso.', altFuture: 'Avisar a un adulto habría resuelto el problema de forma segura.' },
        { id: 'c', text: '🩹 Intentar arreglar con cinta', riskDelta: 5, weight: 1.3, narrativeImpact: 'Reparar cables sin desconectar la corriente es peligroso.', altFuture: 'Un electricista profesional puede reparar el cable de forma segura.' },
      ],
    },
    {
      id: 's3', title: 'Plancha Olvidada', category: 'cocina', icon: '👕', type: 'standard',
      description: 'Alguien dejó la plancha encendida sobre la tabla y se fue a contestar el teléfono.',
      decisions: [
        { id: 'a', text: '⏳ Esperar y avisar', riskDelta: -3, weight: 1.0, narrativeImpact: 'Esperaste y avisaste. ¡La plancha fue apagada de forma segura!', altFuture: 'La plancha podría haber quemado la ropa o la tabla y causar un incendio.' },
        { id: 'b', text: '👔 Intentar planchar', riskDelta: 7, weight: 1.4, narrativeImpact: 'Usar una plancha caliente sin experiencia puede causar quemaduras.', altFuture: 'Esperar a un adulto es siempre más seguro con objetos calientes.' },
        { id: 'c', text: '🔌 Desconectar con cuidado', riskDelta: -4, weight: 1.1, narrativeImpact: '¡Desconectaste la plancha de forma segura! Excelente.', altFuture: 'Si nadie la desconecta, la plancha podría causar un incendio.' },
      ],
    },
  ],
  bano: [
    {
      id: 'b1', title: 'Agua Muy Caliente', category: 'agua', icon: '🚿', type: 'standard',
      description: 'Vas a bañarte y abres solo la llave del agua caliente. Sale mucho vapor.',
      decisions: [
        { id: 'a', text: '✋ Probar con la mano', riskDelta: 1, weight: 0.8, narrativeImpact: 'Probaste el agua, pero podrías quemarte. Mejor usar el dorso de la muñeca.', altFuture: 'Mezclar agua fría primero es el método más seguro.' },
        { id: 'b', text: '🚿 Meterse directo', riskDelta: 8, weight: 1.5, narrativeImpact: 'Entrar sin verificar puede causar quemaduras por escaldadura.', altFuture: 'Regular la temperatura primero te habría protegido completamente.' },
        { id: 'c', text: '❄️ Mezclar agua fría primero', riskDelta: -5, weight: 1.2, narrativeImpact: '¡Regulaste la temperatura antes de entrar! Procedimiento perfecto.', altFuture: 'Sin regular, el agua caliente podría haberte quemado la piel.' },
      ],
    },
    {
      id: 'b2', title: 'Secadora Cerca del Agua', category: 'electricidad', icon: '💨', type: 'surprise',
      description: '¡La secadora de pelo está enchufada al lado del lavabo lleno de agua!',
      timerSeconds: 6,
      decisions: [
        { id: 'a', text: '🔌 Desenchufar inmediatamente', riskDelta: -6, weight: 1.3, narrativeImpact: '¡Reacción rápida! Electricidad + agua = peligro extremo.', altFuture: 'Si la secadora cae al agua, podría causar una electrocución fatal.' },
        { id: 'b', text: '💧 Vaciar el lavabo primero', riskDelta: -2, weight: 0.9, narrativeImpact: 'Reduciste el riesgo, pero la secadora sigue enchufada.', altFuture: 'Desenchufar primero es siempre más seguro que vaciar el agua.' },
        { id: 'c', text: '🤷 No hacer nada', riskDelta: 6, weight: 1.4, narrativeImpact: 'Electricidad cerca del agua es extremadamente peligroso.', altFuture: 'Un simple movimiento podría tirar la secadora al agua.' },
      ],
    },
  ],
  dormitorio: [
    {
      id: 'd1', title: 'El Encendedor', category: 'fuego', icon: '🔦', type: 'standard',
      description: 'Encuentras un encendedor en el cajón. Estás solo y sientes curiosidad.',
      decisions: [
        { id: 'a', text: '🚫 Dejarlo y reportar', riskDelta: -4, weight: 1.1, narrativeImpact: '¡Resististe la curiosidad! Madurez demostrada.', altFuture: 'Jugar con el encendedor podría iniciar un incendio accidental.' },
        { id: 'b', text: '🔥 Encenderlo para ver', riskDelta: 8, weight: 1.5, narrativeImpact: 'Jugar con fuego sin supervisión es muy peligroso.', altFuture: 'Dejarlo en su sitio y avisar es siempre la opción correcta.' },
        { id: 'c', text: '📦 Guardarlo en lugar alto', riskDelta: -3, weight: 1.0, narrativeImpact: 'Lo pusiste fuera de alcance. ¡Acción protectora!', altFuture: 'Si queda al alcance, otro niño podría encontrarlo.' },
      ],
    },
    {
      id: 'd2', title: 'Velas Encendidas', category: 'fuego', icon: '🕯️', type: 'standard',
      description: 'Hay velas encendidas en la mesa de noche, cerca de las cortinas.',
      decisions: [
        { id: 'a', text: '💨 Apagar las velas', riskDelta: -5, weight: 1.2, narrativeImpact: '¡Excelente! Eliminaste un riesgo de incendio inmediato.', altFuture: 'Una cortina tocando la llama podría incendiar toda la habitación.' },
        { id: 'b', text: '🤩 Dejarlas, se ven bonitas', riskDelta: 7, weight: 1.4, narrativeImpact: 'Velas sin supervisión cerca de telas son un riesgo alto de incendio.', altFuture: 'Apagarlas habría eliminado el riesgo por completo.' },
        { id: 'c', text: '↔️ Alejarlas de las cortinas', riskDelta: -2, weight: 0.9, narrativeImpact: 'Reduciste el riesgo alejándolas de material inflamable.', altFuture: 'Apagarlas sería aún más seguro, pero alejarlas ayuda mucho.' },
      ],
    },
  ],
  patio: [
    {
      id: 'p1', title: 'Pirotecnia', category: 'fuego', icon: '🎆', type: 'standard',
      description: 'Tus amigos encontraron cohetes pirotécnicos y quieren encenderlos sin supervisión.',
      decisions: [
        { id: 'a', text: '👨‍👩‍👧 Buscar a un adulto', riskDelta: -6, weight: 1.3, narrativeImpact: '¡Convenciste a tus amigos de buscar supervisión! Liderazgo.', altFuture: 'Sin supervisión, los cohetes podrían explotar en las manos de alguien.' },
        { id: 'b', text: '🧨 Encender uno para impresionar', riskDelta: 10, weight: 1.7, narrativeImpact: 'La pirotecnia sin experiencia causa quemaduras graves.', altFuture: 'Con un adulto supervisando, todos podrían disfrutar de forma segura.' },
        { id: 'c', text: '🚶 Alejarse del grupo', riskDelta: -2, weight: 0.9, narrativeImpact: 'Te protegiste, aunque tus amigos siguen en riesgo.', altFuture: 'Buscar a un adulto protegería a todos, no solo a ti.' },
      ],
    },
    {
      id: 'p2', title: 'Juego con Fósforos', category: 'fuego', icon: '🔴', type: 'surprise',
      description: '¡Tus amigos te retan a encender fósforos y lanzarlos al aire! Hay papel seco cerca.',
      timerSeconds: 7,
      decisions: [
        { id: 'a', text: '✋ Negarse y explicar el peligro', riskDelta: -6, weight: 1.4, narrativeImpact: '¡Te negaste ante la presión! Verdadero liderazgo.', altFuture: 'Aceptar el reto podría iniciar un incendio incontrolable.' },
        { id: 'b', text: '😎 Aceptar el reto', riskDelta: 10, weight: 1.7, narrativeImpact: 'Fósforos + papel = riesgo de incendio extremo.', altFuture: 'Negarse y explicar podría haber salvado a todos de un accidente.' },
        { id: 'c', text: '🚶 Alejarse sin decir nada', riskDelta: -1, weight: 0.7, narrativeImpact: 'Te alejaste, pero tus amigos siguen en peligro.', altFuture: 'Explicar el peligro habría protegido a todo el grupo.' },
      ],
    },
  ],
};

const BADGES = [
  { id: 'guardian-fuego', name: 'Guardián del Fuego', icon: '🔥', category: 'fuego', requirement: 'Decisiones seguras en escenarios de fuego', secret: false },
  { id: 'protector-electrico', name: 'Protector Eléctrico', icon: '⚡', category: 'electricidad', requirement: 'Decisiones seguras en escenarios eléctricos', secret: false },
  { id: 'maestro-cocina', name: 'Maestro de la Cocina', icon: '🍳', category: 'cocina', requirement: 'Decisiones seguras en escenarios de cocina', secret: false },
  { id: 'detective-gas', name: 'Detective del Gas', icon: '🔍', category: 'fuego', requirement: 'Resolver el evento de gas correctamente', secret: false },
  { id: 'heroe-agua', name: 'Héroe del Agua', icon: '💧', category: 'agua', requirement: 'Decisiones seguras en el escenario de agua', secret: false },
  { id: 'explorador', name: 'Explorador Total', icon: '🗺️', category: 'all', requirement: 'Visitar todas las habitaciones', secret: true },
  { id: 'velocista', name: 'Velocista Seguro', icon: '⏱️', category: 'all', requirement: 'Resolver un evento sorpresa en menos de 3 segundos', secret: true },
];

const POWERS = {
  precaucion: { id: 'precaucion', name: 'Poder de Precaución', icon: '👁️', color: '#FACC15', energy: 0, maxEnergy: 100, ability: 'Vista Preventiva', abilityDesc: 'Los objetos peligrosos brillan durante 10 segundos' },
  escudo: { id: 'escudo', name: 'Escudo Eléctrico', icon: '⚡', color: '#2563EB', energy: 0, maxEnergy: 100, ability: 'Campo Protector', abilityDesc: 'Protección contra un error eléctrico' },
  fuego: { id: 'fuego', name: 'Control del Fuego', icon: '🔥', color: '#EF4444', energy: 0, maxEnergy: 100, ability: 'Extintor Mágico', abilityDesc: 'Apaga cualquier fuego instantáneamente' },
  agua: { id: 'agua', name: 'Maestro del Agua', icon: '💧', color: '#06B6D4', energy: 0, maxEnergy: 100, ability: 'Termómetro Mental', abilityDesc: 'Detecta la temperatura del agua automáticamente' },
};

const MASCOT_STATES = {
  happy: { expression: '😺', message: '¡Vamos bien! Sigue explorando.' },
  excited: { expression: '😸', message: '¡Increíble decisión! ¡Eres genial!' },
  worried: { expression: '😿', message: 'Hmm... eso fue arriesgado. ¡Ten cuidado!' },
  scared: { expression: '🙀', message: '¡Peligro cerca! Piensa bien...' },
  celebrating: { expression: '😻', message: '¡PODER DESBLOQUEADO! ¡Eres increíble!' },
  hint: { expression: '🐱', message: '' },
};

const useStore = create((set, get) => ({
  // Avatar
  avatar: {
    type: 'human', animalType: null,
    hair: 'short', hairColor: '#4A3728', clothing: 'tshirt',
    clothingColor: '#2563EB', skinColor: '#F5D0A9', accessory: 'none', name: '',
  },
  setAvatar: (updates) => set((s) => ({ avatar: { ...s.avatar, ...updates } })),

  // IRP Engine
  irp: 30,
  riskProfile: { cocina: 0, electricidad: 0, fuego: 0, agua: 0 },
  irpHistory: [30],
  decisions: [],

  updateIRP: (riskDelta, weight, category) => set((s) => {
    const change = riskDelta * weight;
    const newIRP = Math.max(0, Math.min(100, s.irp + change));
    const newProfile = { ...s.riskProfile };
    newProfile[category] = Math.max(0, Math.min(100, (newProfile[category] || 0) + change));

    const powerMap = { cocina: 'precaucion', electricidad: 'escudo', fuego: 'fuego', agua: 'agua' };
    const powerId = powerMap[category];
    let newPowers = { ...s.powers };
    if (powerId && riskDelta < 0) {
      newPowers = { ...newPowers, [powerId]: { ...newPowers[powerId], energy: Math.min(100, newPowers[powerId].energy + Math.abs(change) * 4) } };
    }

    return {
      irp: Math.round(newIRP * 10) / 10,
      riskProfile: newProfile,
      irpHistory: [...s.irpHistory, Math.round(newIRP * 10) / 10],
      powers: newPowers,
    };
  }),

  addDecision: (eventId, decision, roomId) => set((s) => ({
    decisions: [...s.decisions, { eventId, roomId, ...decision, timestamp: Date.now() }],
  })),

  // Rooms
  rooms: ROOMS,
  currentRoom: null,
  visitedRooms: [],
  roomTimeSpent: {},
  setCurrentRoom: (roomId) => set((s) => {
    const visited = s.visitedRooms.includes(roomId) ? s.visitedRooms : [...s.visitedRooms, roomId];
    return { currentRoom: roomId, visitedRooms: visited };
  }),
  trackRoomTime: (roomId, seconds) => set((s) => ({
    roomTimeSpent: { ...s.roomTimeSpent, [roomId]: (s.roomTimeSpent[roomId] || 0) + seconds },
  })),

  // Events
  roomEvents: ROOM_EVENTS,
  completedEvents: [],
  activeEvent: null,
  setActiveEvent: (event) => set({ activeEvent: event }),
  completeEvent: (eventId) => set((s) => ({
    completedEvents: [...s.completedEvents, eventId], activeEvent: null,
  })),
  getAvailableEvents: (roomId) => {
    const completed = get().completedEvents;
    return (ROOM_EVENTS[roomId] || []).filter((e) => !completed.includes(e.id));
  },

  // Powers
  powers: { ...POWERS },
  activePower: null,
  activatePower: (powerId) => set((s) => {
    if (s.powers[powerId]?.energy >= 100) {
      return {
        activePower: powerId,
        powers: { ...s.powers, [powerId]: { ...s.powers[powerId], energy: 0 } },
      };
    }
    return {};
  }),
  deactivatePower: () => set({ activePower: null }),

  // Mascot
  mascotState: 'happy',
  mascotMessage: MASCOT_STATES.happy.message,
  setMascotState: (state, customMessage) => set({
    mascotState: state,
    mascotMessage: customMessage || MASCOT_STATES[state]?.message || '',
  }),

  // Badges
  badges: BADGES,
  earnedBadges: [],
  newBadge: null,
  checkBadges: () => set((s) => {
    const earned = [...s.earnedBadges];
    const catDecs = {};
    s.decisions.forEach((d) => {
      const room = d.roomId;
      const events = ROOM_EVENTS[room] || [];
      const evt = events.find((e) => e.id === d.eventId);
      if (evt) {
        if (!catDecs[evt.category]) catDecs[evt.category] = [];
        catDecs[evt.category].push(d);
      }
    });

    let newBadge = null;
    BADGES.forEach((badge) => {
      if (earned.includes(badge.id)) return;
      if (badge.id === 'explorador') {
        if (s.visitedRooms.length >= 5) { earned.push(badge.id); newBadge = badge; }
      } else if (badge.category !== 'all') {
        const decs = catDecs[badge.category] || [];
        if (decs.length > 0 && decs.every((d) => d.riskDelta <= 0)) { earned.push(badge.id); newBadge = badge; }
      }
    });
    return { earnedBadges: earned, newBadge };
  }),
  clearNewBadge: () => set({ newBadge: null }),

  // "¿Y si...?" mode
  showAltFuture: false,
  altFutureText: '',
  showAlternateFuture: (text) => set({ showAltFuture: true, altFutureText: text }),
  hideAlternateFuture: () => set({ showAltFuture: false, altFutureText: '' }),

  // Session
  sessionStart: null,
  startSession: () => set({ sessionStart: Date.now() }),
  getSessionDuration: () => {
    const start = get().sessionStart;
    return start ? Math.round((Date.now() - start) / 1000) : 0;
  },

  // Navigation
  simulationComplete: false,
  setSimulationComplete: (val) => set({ simulationComplete: val }),

  getTotalEvents: () => Object.values(ROOM_EVENTS).flat().length,
  getCompletedCount: () => get().completedEvents.length,
  isAllComplete: () => get().completedEvents.length >= Object.values(ROOM_EVENTS).flat().length,

  // Reset
  resetSimulation: () => set({
    irp: 30, riskProfile: { cocina: 0, electricidad: 0, fuego: 0, agua: 0 },
    irpHistory: [30], decisions: [], currentRoom: null, visitedRooms: [],
    roomTimeSpent: {}, completedEvents: [], activeEvent: null,
    powers: { ...POWERS }, activePower: null, mascotState: 'happy',
    mascotMessage: MASCOT_STATES.happy.message, earnedBadges: [], newBadge: null,
    showAltFuture: false, altFutureText: '', sessionStart: null, simulationComplete: false,
  }),

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
    let max = -Infinity; let cat = 'cocina';
    Object.entries(profile).forEach(([k, v]) => { if (v > max) { max = v; cat = k; } });
    return cat;
  },
}));

export default useStore;
