/**
 * Simple event emitter for authentication events
 * Allows API client to communicate with UI components
 */

type AuthEventListener = () => void;

class AuthEventEmitter {
    private listeners: AuthEventListener[] = [];

    subscribe(listener: AuthEventListener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    }

    emit() {
        this.listeners.forEach((listener) => listener());
    }
}

export const authEvents = new AuthEventEmitter();
