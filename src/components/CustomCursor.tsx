import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [hoveredTile, setHoveredTile] = useState(false);

  // Mouse target and current position tracking for lerping (easing: 0.18)
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // 1. Always check prefers-reduced-motion fallback that disables all of it
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return;
    }

    // 2. Disable custom cursor on mobile/touch screens for better usability
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) {
      return;
    }

    setShouldRender(true);

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // 3. Detect when mouse over an image tile
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tile = target.closest('.motion-image-tile');
      if (tile) {
        setHoveredTile(true);
      } else {
        setHoveredTile(false);
      }
    };

    window.addEventListener('mouseover', onMouseOver, { passive: true });

    let animationFrameId: number;
    const updatePosition = () => {
      // Smooth lerping with 0.18 easing coefficient: pos = pos + (target - pos) * ease
      pos.current.x += (mouse.current.x - pos.current.x) * 0.18;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.18;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <>
      {/* Hide browser cursor dynamic styles when over a motion tile */}
      {hoveredTile && (
        <style dangerouslySetInnerHTML={{ __html: `
          .motion-image-tile, .motion-image-tile * {
            cursor: none !important;
          }
        `}} />
      )}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          backgroundColor: hoveredTile ? 'rgba(209, 178, 128, 0.95)' : 'var(--color-accent)',
          color: '#050505',
          fontSize: '11px',
          fontWeight: 900,
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          width: hoveredTile ? '84px' : '8px',
          height: hoveredTile ? '84px' : '8px',
          marginTop: hoveredTile ? '-42px' : '-4px',
          marginLeft: hoveredTile ? '-42px' : '-4px',
          transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), margin 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform, width, height, margin',
          boxShadow: hoveredTile ? '0 10px 40px rgba(0,0,0,0.6)' : 'none',
        }}
      >
        <span
          ref={textRef}
          style={{
            opacity: hoveredTile ? 1 : 0,
            transition: 'opacity 0.2s ease',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          View
        </span>
      </div>
    </>
  );
}
