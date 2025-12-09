'use client';

/**
 * Skip to main content link for keyboard accessibility
 * Allows users to bypass navigation and jump directly to main content
 */
export default function SkipToMain() {
    return (
        <a href="#main-content" className="skip-to-main">
            Skip to main content
        </a>
    );
}
