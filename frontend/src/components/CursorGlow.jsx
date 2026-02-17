/**
 * @description A React component that renders a glowing cursor-following effect over the UI.
 * 
 * @usage This component is used on the welcome page to enhance the dark background with an animated radial glow that follows mouse movement.
 * 
 * @param {Object} props - The component props
 * @returns {JSX.Element} The rendered component
 * 
 * @example
 * <CursorGlow />
 */
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(233, 165, 48, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        left: position.x,
        top: position.y,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        zIndex: 9999,
        mixBlendMode: 'screen',
      }}
    />
  );
}

export default CursorGlow;
