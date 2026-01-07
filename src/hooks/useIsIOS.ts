import { useState, useEffect } from 'react';

export function useIsIOS() {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window === 'undefined') return;

    const ua = window.navigator.userAgent;
    
    // Detect iOS devices (iPhone, iPad, iPod)
    const isIOSDevice = /iPhone|iPad|iPod/.test(ua);
    
    // Detect Safari (excluding Chrome and Android)
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

    setIsIOS(isIOSDevice || isSafari);
  }, []);

  return isIOS;
}
