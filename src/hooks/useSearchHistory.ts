import { useState, useEffect } from 'react';

const STORAGE_KEY = 'mastodon_search_history';
const MAX_HISTORY_ITEMS = 10;

export const useSearchHistory = () => {
    const [history, setHistory] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load history from local storage on mount
    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem(STORAGE_KEY);
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (error) {
            console.error('Failed to parse search history:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save history to local storage whenever it changes
    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }, [history, isLoaded]);

    const addToHistory = (query: string) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        setHistory((prev) => {
            // Remove existing entry if present to move it to the top
            const filtered = prev.filter((item) => item.toLowerCase() !== trimmedQuery.toLowerCase());
            // Add new item to the top
            const newHistory = [trimmedQuery, ...filtered];
            // Limit to MAX_HISTORY_ITEMS
            return newHistory.slice(0, MAX_HISTORY_ITEMS);
        });
    };

    const removeFromHistory = (query: string) => {
        setHistory((prev) => prev.filter((item) => item !== query));
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return {
        history,
        addToHistory,
        removeFromHistory,
        clearHistory,
        isLoaded
    };
};
