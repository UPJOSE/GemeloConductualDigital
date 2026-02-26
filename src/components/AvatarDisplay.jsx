import { motion } from 'framer-motion';

const HAIR_PATHS = {
  short: 'M30,35 Q50,15 70,35 Q72,30 70,25 Q50,5 30,25 Q28,30 30,35Z',
  long: 'M25,35 Q50,10 75,35 L78,55 Q75,70 70,75 L70,45 Q50,20 30,45 L30,75 Q25,70 22,55 L25,35Z',
  curly: 'M25,40 Q30,15 50,12 Q70,15 75,40 Q80,35 78,25 Q70,5 50,2 Q30,5 22,25 Q20,35 25,40Z M28,38 Q32,30 28,35Z M72,38 Q68,30 72,35Z M25,45 Q22,50 24,55Z M75,45 Q78,50 76,55Z',
  spiky: 'M30,38 L25,15 L35,30 L40,8 L45,28 L50,5 L55,28 L60,8 L65,30 L75,15 L70,38 Q50,25 30,38Z',
  mohawk: 'M45,5 Q50,0 55,5 L56,30 Q50,25 44,30 Z M42,32 Q50,22 58,32 Q55,28 50,26 Q45,28 42,32Z',
  braids: 'M25,35 Q50,10 75,35 Q78,25 70,15 Q50,0 30,15 Q22,25 25,35Z M30,35 L26,70 Q28,75 32,70 L35,40Z M70,35 L74,70 Q72,75 68,70 L65,40Z',
};

const CLOTHING_PATHS = {
  tshirt: 'M30,75 L25,95 L25,120 L75,120 L75,95 L70,75 Q50,80 30,75Z M25,95 L15,85 L20,75 L30,75Z M75,95 L85,85 L80,75 L70,75Z',
  hoodie: 'M28,72 L22,95 L22,120 L78,120 L78,95 L72,72 Q50,78 28,72Z M22,95 L12,85 L18,72 L28,72Z M78,95 L88,85 L82,72 L72,72Z M40,72 Q50,68 60,72 L58,82 Q50,78 42,82 L40,72Z',
  jacket: 'M28,72 L22,95 L22,120 L78,120 L78,95 L72,72 Q50,78 28,72Z M22,95 L12,85 L18,72 L28,72Z M78,95 L88,85 L82,72 L72,72Z M50,72 L50,120',
  dress: 'M30,75 Q50,80 70,75 L78,120 L22,120 Z M25,85 L15,80 L22,72 L30,75Z M75,85 L85,80 L78,72 L70,75Z',
  overalls: 'M28,72 L22,120 L78,120 L72,72 Q50,78 28,72Z M35,72 L35,85 L45,85 L45,72Z M55,72 L55,85 L65,85 L65,72Z M35,85 L35,72 M65,85 L65,72',
};

function HumanAvatar({ avatar }) {
  const { hair, hairColor, clothing, clothingColor, skinColor, accessory } = avatar;
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 130" fill="none">
      <ellipse cx="50" cy="50" rx="22" ry="26" fill={skinColor} />
      <path d={HAIR_PATHS[hair] || HAIR_PATHS.short} fill={hairColor} />
      <ellipse cx="40" cy="50" rx="3" ry="3.5" fill="#1E293B" />
      <ellipse cx="60" cy="50" rx="3" ry="3.5" fill="#1E293B" />
      <ellipse cx="41" cy="49" rx="1" ry="1" fill="white" />
      <ellipse cx="61" cy="49" rx="1" ry="1" fill="white" />
      <path d="M40,60 Q50,68 60,60" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="34" cy="58" rx="4" ry="2.5" fill="#FFB4B4" opacity="0.5" />
      <ellipse cx="66" cy="58" rx="4" ry="2.5" fill="#FFB4B4" opacity="0.5" />
      <path d={CLOTHING_PATHS[clothing] || CLOTHING_PATHS.tshirt} fill={clothingColor} />
      {accessory === 'glasses' && (
        <>
          <circle cx="40" cy="49" r="6" stroke="#1E293B" strokeWidth="1.5" fill="none" />
          <circle cx="60" cy="49" r="6" stroke="#1E293B" strokeWidth="1.5" fill="none" />
          <line x1="46" y1="49" x2="54" y2="49" stroke="#1E293B" strokeWidth="1.5" />
        </>
      )}
      {accessory === 'cap' && (
        <path d="M22,35 Q50,20 78,35 L80,30 Q50,12 20,30 Z" fill={clothingColor} opacity="0.8" />
      )}
      {accessory === 'headband' && (
        <rect x="26" y="30" width="48" height="4" rx="2" fill="#F97316" />
      )}
      {accessory === 'bow' && (
        <path d="M50,24 L42,18 Q38,22 42,26 Z M50,24 L58,18 Q62,22 58,26 Z" fill="#EC4899" />
      )}
      {accessory === 'crown' && (
        <path d="M32,28 L36,16 L42,24 L50,12 L58,24 L64,16 L68,28 Z" fill="#FACC15" stroke="#D97706" strokeWidth="0.5" />
      )}
      {accessory === 'mask' && (
        <path d="M30,44 Q50,38 70,44 L68,54 Q50,50 32,54 Z" fill="#1E293B" opacity="0.8" />
      )}
    </svg>
  );
}

function AnimalAvatar({ avatar }) {
  const { animalType, clothingColor, skinColor } = avatar;

  if (animalType === 'cat') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 130" fill="none">
        <path d="M28,50 L22,20 L38,38Z" fill={skinColor} />
        <path d="M72,50 L78,20 L62,38Z" fill={skinColor} />
        <path d="M30,22 L24,22 L36,38Z" fill="#FFB4B4" opacity="0.5" />
        <path d="M70,22 L76,22 L64,38Z" fill="#FFB4B4" opacity="0.5" />
        <ellipse cx="50" cy="55" rx="24" ry="22" fill={skinColor} />
        <ellipse cx="40" cy="52" rx="4" ry="4.5" fill="#1E293B" />
        <ellipse cx="60" cy="52" rx="4" ry="4.5" fill="#1E293B" />
        <ellipse cx="41.5" cy="50.5" rx="1.5" ry="1.5" fill="white" />
        <ellipse cx="61.5" cy="50.5" rx="1.5" ry="1.5" fill="white" />
        <ellipse cx="50" cy="60" rx="3" ry="2" fill="#FFB4B4" />
        <path d="M47,62 Q50,66 53,62" stroke="#1E293B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <line x1="26" y1="58" x2="16" y2="55" stroke={skinColor} strokeWidth="1.5" />
        <line x1="26" y1="62" x2="16" y2="62" stroke={skinColor} strokeWidth="1.5" />
        <line x1="74" y1="58" x2="84" y2="55" stroke={skinColor} strokeWidth="1.5" />
        <line x1="74" y1="62" x2="84" y2="62" stroke={skinColor} strokeWidth="1.5" />
        <ellipse cx="50" cy="100" rx="20" ry="24" fill={clothingColor} />
        <path d="M68,110 Q75,125 65,130" stroke={skinColor} strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (animalType === 'rabbit') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 130" fill="none">
        <ellipse cx="38" cy="22" rx="6" ry="20" fill={skinColor} />
        <ellipse cx="62" cy="22" rx="6" ry="20" fill={skinColor} />
        <ellipse cx="38" cy="22" rx="3.5" ry="16" fill="#FFB4B4" opacity="0.4" />
        <ellipse cx="62" cy="22" rx="3.5" ry="16" fill="#FFB4B4" opacity="0.4" />
        <ellipse cx="50" cy="55" rx="22" ry="20" fill={skinColor} />
        <ellipse cx="40" cy="52" rx="3.5" ry="4" fill="#1E293B" />
        <ellipse cx="60" cy="52" rx="3.5" ry="4" fill="#1E293B" />
        <ellipse cx="41" cy="51" rx="1.2" ry="1.2" fill="white" />
        <ellipse cx="61" cy="51" rx="1.2" ry="1.2" fill="white" />
        <ellipse cx="50" cy="60" rx="3" ry="2" fill="#FFB4B4" />
        <path d="M46,63 Q50,67 54,63" stroke="#1E293B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="36" cy="60" r="4" fill="#FFB4B4" opacity="0.4" />
        <circle cx="64" cy="60" r="4" fill="#FFB4B4" opacity="0.4" />
        <ellipse cx="50" cy="100" rx="20" ry="24" fill={clothingColor} />
        <circle cx="50" cy="124" r="5" fill={skinColor} />
      </svg>
    );
  }

  if (animalType === 'dog') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 130" fill="none">
        <path d="M28,48 Q24,30 30,25 Q36,30 34,44Z" fill={skinColor} />
        <path d="M72,48 Q76,30 70,25 Q64,30 66,44Z" fill={skinColor} />
        <ellipse cx="50" cy="55" rx="24" ry="22" fill={skinColor} />
        <ellipse cx="40" cy="50" rx="4" ry="4.5" fill="#1E293B" />
        <ellipse cx="60" cy="50" rx="4" ry="4.5" fill="#1E293B" />
        <ellipse cx="41.5" cy="48.5" rx="1.5" ry="1.5" fill="white" />
        <ellipse cx="61.5" cy="48.5" rx="1.5" ry="1.5" fill="white" />
        <ellipse cx="50" cy="60" rx="5" ry="3.5" fill="#2C1810" />
        <path d="M47,64 Q50,68 53,64" stroke="#1E293B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M44,66 Q50,72 56,66" stroke="#EF4444" strokeWidth="2" fill="#EF4444" opacity="0.5" />
        <ellipse cx="50" cy="100" rx="20" ry="24" fill={clothingColor} />
        <path d="M70,108 Q80,118 72,128" stroke={skinColor} strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (animalType === 'bear') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 130" fill="none">
        <circle cx="30" cy="35" r="10" fill={skinColor} />
        <circle cx="70" cy="35" r="10" fill={skinColor} />
        <circle cx="30" cy="35" r="6" fill="#A0522D" opacity="0.3" />
        <circle cx="70" cy="35" r="6" fill="#A0522D" opacity="0.3" />
        <ellipse cx="50" cy="55" rx="26" ry="24" fill={skinColor} />
        <ellipse cx="40" cy="50" rx="3.5" ry="3.5" fill="#1E293B" />
        <ellipse cx="60" cy="50" rx="3.5" ry="3.5" fill="#1E293B" />
        <ellipse cx="41" cy="49" rx="1.2" ry="1.2" fill="white" />
        <ellipse cx="61" cy="49" rx="1.2" ry="1.2" fill="white" />
        <ellipse cx="50" cy="58" rx="4" ry="3" fill="#2C1810" />
        <path d="M46,63 Q50,67 54,63" stroke="#1E293B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <ellipse cx="50" cy="100" rx="22" ry="26" fill={clothingColor} />
      </svg>
    );
  }

  if (animalType === 'fox') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 130" fill="none">
        <path d="M28,50 L18,15 L40,40Z" fill={skinColor} />
        <path d="M72,50 L82,15 L60,40Z" fill={skinColor} />
        <path d="M28,45 L22,20 L38,40Z" fill="white" opacity="0.6" />
        <path d="M72,45 L78,20 L62,40Z" fill="white" opacity="0.6" />
        <ellipse cx="50" cy="55" rx="22" ry="20" fill={skinColor} />
        <ellipse cx="50" cy="62" rx="12" ry="10" fill="white" opacity="0.7" />
        <ellipse cx="40" cy="50" rx="3" ry="3.5" fill="#1E293B" />
        <ellipse cx="60" cy="50" rx="3" ry="3.5" fill="#1E293B" />
        <ellipse cx="41" cy="49" rx="1" ry="1" fill="white" />
        <ellipse cx="61" cy="49" rx="1" ry="1" fill="white" />
        <ellipse cx="50" cy="59" rx="3" ry="2" fill="#1E293B" />
        <path d="M47,63 Q50,66 53,63" stroke="#1E293B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <ellipse cx="50" cy="100" rx="20" ry="24" fill={clothingColor} />
        <path d="M70,108 Q85,120 75,130" stroke={skinColor} strokeWidth="5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (animalType === 'penguin') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 130" fill="none">
        <ellipse cx="50" cy="55" rx="22" ry="22" fill={skinColor} />
        <ellipse cx="50" cy="58" rx="14" ry="16" fill="white" />
        <ellipse cx="40" cy="48" rx="3" ry="3.5" fill="#1E293B" />
        <ellipse cx="60" cy="48" rx="3" ry="3.5" fill="#1E293B" />
        <ellipse cx="41" cy="47" rx="1" ry="1" fill="white" />
        <ellipse cx="61" cy="47" rx="1" ry="1" fill="white" />
        <path d="M47,56 L50,60 L53,56" fill="#F97316" />
        <ellipse cx="50" cy="100" rx="22" ry="26" fill={skinColor} />
        <ellipse cx="50" cy="102" rx="14" ry="20" fill="white" />
        <path d="M28,85 Q18,95 24,110" stroke={skinColor} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M72,85 Q82,95 76,110" stroke={skinColor} strokeWidth="6" fill="none" strokeLinecap="round" />
        <ellipse cx="40" cy="128" rx="6" ry="3" fill="#F97316" />
        <ellipse cx="60" cy="128" rx="6" ry="3" fill="#F97316" />
      </svg>
    );
  }

  return <HumanAvatar avatar={avatar} />;
}

export default function AvatarDisplay({ avatar, size = 120, animate = true }) {
  const Wrapper = animate ? motion.div : 'div';
  const wrapperProps = animate
    ? { animate: { y: [0, -8, 0] }, transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }
    : {};

  return (
    <Wrapper {...wrapperProps} style={{ display: 'inline-block', width: size, height: size * 1.2 }}>
      {avatar.type === 'animal' && avatar.animalType ? (
        <AnimalAvatar avatar={avatar} />
      ) : (
        <HumanAvatar avatar={avatar} />
      )}
    </Wrapper>
  );
}
