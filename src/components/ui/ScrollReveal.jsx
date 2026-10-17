import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal component
 * Animates child elements when they scroll into the viewport.
 * Supports entrance from: 'up' (bottom), 'down' (top), 'left' (side), 'right' (side), 'zoom'
 *
 * Props:
 *  direction  – 'up' | 'down' | 'left' | 'right' | 'zoom'  (default: 'up')
 *  delay      – delay in ms before animation starts          (default: 0)
 *  duration   – animation duration in ms                     (default: 700)
 *  distance   – translate distance: 'sm' | 'md' | 'lg'       (default: 'md')
 *  threshold  – IntersectionObserver threshold               (default: 0.12)
 *  once       – animate only once (true) or re-trigger        (default: true)
 *  className  – extra classes for the wrapper div             (default: '')
 *  easing     – CSS easing function                           (default: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)')
 */
const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 700,
  distance = 'md',
  className = '',
  threshold = 0.12,
  once = true,
  easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const currentElem = elementRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem);
      }
    };
  }, [threshold, once]);

  // Distance map
  const distanceMap = {
    sm: { translate: '20px', scale: '0.95' },
    md: { translate: '48px', scale: '0.92' },
    lg: { translate: '80px', scale: '0.88' },
  };

  const dist = distanceMap[distance] || distanceMap.md;

  // Build initial transform string based on direction
  const getInitialStyle = () => {
    if (isVisible) {
      return {
        opacity: 1,
        transform: 'translate3d(0, 0, 0) scale(1)',
      };
    }
    switch (direction) {
      case 'down':
        return {
          opacity: 0,
          transform: `translate3d(0, -${dist.translate}, 0) scale(1)`,
        };
      case 'left':
        return {
          opacity: 0,
          transform: `translate3d(-${dist.translate}, 0, 0) scale(1)`,
        };
      case 'right':
        return {
          opacity: 0,
          transform: `translate3d(${dist.translate}, 0, 0) scale(1)`,
        };
      case 'zoom':
        return {
          opacity: 0,
          transform: `translate3d(0, 0, 0) scale(${dist.scale})`,
        };
      case 'up':
      default:
        return {
          opacity: 0,
          transform: `translate3d(0, ${dist.translate}, 0) scale(1)`,
        };
    }
  };

  return (
    <div
      ref={elementRef}
      className={`will-change-[opacity,transform] ${className}`}
      style={{
        ...getInitialStyle(),
        transition: `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
