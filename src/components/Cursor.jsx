import { useEffect, useState, useRef } from 'react';

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Direct DOM manipulation for instant response
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${e.clientX}px`;
        ringRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-hover')
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          transform: `translate(-50%, -50%) ${isHovering ? 'scale(0)' : 'scale(1)'}`,
          transition: 'transform 0.2s ease',
          willChange: 'transform',
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
      </div>

      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
      >
        <div
          className="rounded-full border-2 transition-all duration-300"
          style={{
            width: isHovering ? '50px' : '36px',
            height: isHovering ? '50px' : '36px',
            borderColor: isHovering ? '#00ffff' : '#ffffff',
            opacity: isHovering ? 1 : 0.5,
          }}
        />
      </div>

      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
};

export default CustomCursor;