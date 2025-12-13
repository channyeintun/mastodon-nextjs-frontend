'use client';

import { useEffect } from 'react';

/**
 * VideoSyncProvider - Ensures only one video plays at a time across the entire app
 *
 * Listens for the "play" event on all video elements and automatically pauses
 * any other playing videos. This prevents multiple videos from playing simultaneously.
 */
export function VideoSyncProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handlePlay = (event: Event) => {
      const playingVideo = event.target as HTMLVideoElement;

      // Pause all other videos when one starts playing
      document.querySelectorAll('video').forEach((video) => {
        if (video !== playingVideo && !video.paused) {
          video.pause();
        }
      });
    };

    // Use capture phase to catch play events early
    document.addEventListener('play', handlePlay, true);

    return () => {
      document.removeEventListener('play', handlePlay, true);
    };
  }, []);

  return <>{children}</>;
}
