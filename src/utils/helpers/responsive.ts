import { useState, useEffect } from 'react';

export interface ResponsiveState {
  windowWidth: number;
  windowHeight: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  sidebarWidth: number;
  screenPadding: number;
  gridColumns: number;
}

export function getResponsiveValues(width: number): Omit<ResponsiveState, 'windowWidth' | 'windowHeight'> {
  const isMobile = width < 768;
  const isTablet = width >= 768 && width <= 1024;
  const isDesktop = width > 1024;

  let sidebarWidth = 0;
  if (isDesktop) sidebarWidth = 280;
  else if (isTablet) sidebarWidth = 220;

  let screenPadding = 20; // 20px on mobile
  if (isTablet) screenPadding = 32; // 32px on tablet
  else if (isDesktop) screenPadding = 48; // 48px on desktop

  let gridColumns = 1;
  if (isTablet) gridColumns = 2;
  else if (isDesktop) gridColumns = 3;

  return {
    isMobile,
    isTablet,
    isDesktop,
    sidebarWidth,
    screenPadding,
    gridColumns,
  };
}

export function useResponsive(): ResponsiveState {
  const [dimensions, setDimensions] = useState({
    windowWidth: typeof window !== 'undefined' ? window.innerWidth : 390,
    windowHeight: typeof window !== 'undefined' ? window.innerHeight : 844,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    function handleResize() {
      setDimensions({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const responsiveValues = getResponsiveValues(dimensions.windowWidth);

  return {
    ...dimensions,
    ...responsiveValues,
  };
}
