// src/components/CustomCursor.tsx
import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  // Spring physics for the trailing ring effect
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(mousePosition.x, springConfig);
  const cursorYSpring = useSpring(mousePosition.y, springConfig);

  useEffect(() => {
    cursorXSpring.set(mousePosition.x);
    cursorYSpring.set(mousePosition.y);
  }, [mousePosition, cursorXSpring, cursorYSpring]);

  return (
    <>
      {/* Solid dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-gold rounded-full pointer-events-none z-[9999]"
        animate={{ x: mousePosition.x - 6, y: mousePosition.y - 6 }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
      />
      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 w-9 h-9 border-[1.5px] border-gold/50 rounded-full pointer-events-none z-[9998]"
        style={{ x: cursorXSpring, y: cursorYSpring, translateX: '-50%', translateY: '-50%' }}
      />
    </>
  );
}