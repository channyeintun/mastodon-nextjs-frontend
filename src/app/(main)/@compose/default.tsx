/**
 * Default component for the @compose parallel route slot.
 * Returns null when the compose modal is not active.
 * This is required by Next.js parallel routes to prevent 404 errors
 * when navigating to routes that don't match this slot.
 */
export default function ComposeDefault() {
    return null;
}
