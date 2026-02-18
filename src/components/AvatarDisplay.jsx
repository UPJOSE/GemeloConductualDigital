import { motion } from 'framer-motion';

const HAIR_PATHS = {
  short: 'M30,35 Q50,15 70,35 Q72,30 70,25 Q50,5 30,25 Q28,30 30,35Z',
  long: 'M25,35 Q50,10 75,35 L78,55 Q75,70 70,75 L70,45 Q50,20 30,45 L30,75 Q25,70 22,55 L25,35Z',
  curly: 'M25,40 Q30,15 50,12 Q70,15 75,40 Q80,35 78,25 Q70,5 50,2 Q30,5 22,25 Q20,35 25,40Z M28,38 Q32,30 28,35Z M72,38 Q68,30 72,35Z M25,45 Q22,50 24,55Z M75,45 Q78,50 76,55Z',
  spiky: 'M30,38 L25,15 L35,30 L40,8 L45,28 L50,5 L55,28 L60,8 L65,30 L75,15 L70,38 Q50,25 30,38Z',
};

const CLOTHING_PATHS = {
  tshirt: 'M30,75 L25,95 L25,120 L75,120 L75,95 L70,75 Q50,80 30,75Z M25,95 L15,85 L20,75 L30,75Z M75,95 L85,85 L80,75 L70,75Z',
  hoodie: 'M28,72 L22,95 L22,120 L78,120 L78,95 L72,72 Q50,78 28,72Z M22,95 L12,85 L18,72 L28,72Z M78,95 L88,85 L82,72 L72,72Z M40,72 Q50,68 60,72 L58,82 Q50,78 42,82 L40,72Z',
  jacket: 'M28,72 L22,95 L22,120 L78,120 L78,95 L72,72 Q50,78 28,72Z M22,95 L12,85 L18,72 L28,72Z M78,95 L88,85 L82,72 L72,72Z M50,72 L50,120',
};

export default function AvatarDisplay({ avatar, size = 120, animate = true }) {
  const { hair, hairColor, clothing, clothingColor, skinColor, accessory } = avatar;

  const Wrapper = animate ? motion.div : 'div';
  const wrapperProps = animate
    ? { animate: { y: [0, -8, 0] }, transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }
    : {};

  const scale = size / 120;

  return (
    <Wrapper {...wrapperProps} style={{ display: 'inline-block' }}>
      <svg width={size} height={size * 1.2} viewBox="0 0 100 130" fill="none">
        {/* Head */}
        <ellipse cx="50" cy="50" rx="22" ry="26" fill={skinColor} />

        {/* Hair */}
        <path d={HAIR_PATHS[hair] || HAIR_PATHS.short} fill={hairColor} />

        {/* Eyes */}
        <ellipse cx="40" cy="50" rx="3" ry="3.5" fill="#1E293B" />
        <ellipse cx="60" cy="50" rx="3" ry="3.5" fill="#1E293B" />
        <ellipse cx="41" cy="49" rx="1" ry="1" fill="white" />
        <ellipse cx="61" cy="49" rx="1" ry="1" fill="white" />

        {/* Smile */}
        <path d="M40,60 Q50,68 60,60" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Blush */}
        <ellipse cx="34" cy="58" rx="4" ry="2.5" fill="#FFB4B4" opacity="0.5" />
        <ellipse cx="66" cy="58" rx="4" ry="2.5" fill="#FFB4B4" opacity="0.5" />

        {/* Body / Clothing */}
        <path d={CLOTHING_PATHS[clothing] || CLOTHING_PATHS.tshirt} fill={clothingColor} />

        {/* Accessory */}
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
      </svg>
    </Wrapper>
  );
}
