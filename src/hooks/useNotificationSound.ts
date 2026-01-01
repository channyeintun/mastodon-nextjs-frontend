'use client';

import { useRef } from 'react';

interface AudioSource {
    src: string;
    type: string;
}

/**
 * Class to manage notification sound playback.
 * Creates audio, plays it, then cleans up.
 */
class NotificationSound {
    private audio: HTMLAudioElement;

    constructor(sources: AudioSource[]) {
        this.audio = new Audio();
        sources.forEach(({ type, src }) => {
            const source = document.createElement('source');
            source.type = type;
            source.src = src;
            this.audio.appendChild(source);
        });
    }

    play(): Promise<void> {
        return new Promise((resolve) => {
            this.audio.addEventListener('ended', () => resolve(), { once: true });
            this.audio.play().catch((error) => {
                // Silently ignore autoplay errors (e.g., user hasn't interacted with the page yet)
                console.debug('Audio play was prevented:', error);
                resolve();
            });
        });
    }

    destroy(): void {
        this.audio.pause();
        this.audio.src = '';
        this.audio.load();
    }
}

const DEFAULT_DEBOUNCE_DELAY = 1000;

/**
 * Hook to get notification sound controls with debouncing.
 * Returns a play function that creates audio, plays it, then cleans up.
 * If multiple notifications arrive within the debounce delay, only the last one will play a sound.
 * @param debounceDelay - The debounce delay in milliseconds (default: 1000ms)
 */
export function useNotificationSound(debounceDelay: number = DEFAULT_DEBOUNCE_DELAY) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const play = (): void => {
        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set a new timeout
        timeoutRef.current = setTimeout(async () => {
            const sound = new NotificationSound([
                { src: '/boop.ogg', type: 'audio/ogg' },
                { src: '/boop.mp3', type: 'audio/mpeg' },
            ]);
            await sound.play();
            sound.destroy();
            timeoutRef.current = null;
        }, debounceDelay);
    };

    return { play };
}
