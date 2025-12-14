'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegister() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('SW registered:', registration.scope)
                })
                .catch((error) => {
                    console.log('SW registration failed:', error)
                })

            // Listen for messages from the service worker
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data?.type === 'RELOAD_PAGE') {
                    console.log('New deployment detected, reloading page...')
                    window.location.reload()
                }
            })
        }
    }, [])

    return null
}

