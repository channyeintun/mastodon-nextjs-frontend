'use server'

import { cookies } from 'next/headers'

/**
 * Store client_secret as an httpOnly cookie
 * This action is called from the signin page after app registration
 */
export async function storeClientSecret(clientSecret: string) {
    const cookieStore = await cookies()

    cookieStore.set('clientSecret', clientSecret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
    })
}

/**
 * Store instance URL as an httpOnly cookie
 */
export async function storeInstanceURL(instanceURL: string) {
    const cookieStore = await cookies()

    cookieStore.set('instanceURL', instanceURL, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
    })
}

/**
 * Store client ID as an httpOnly cookie
 */
export async function storeClientId(clientId: string) {
    const cookieStore = await cookies()

    cookieStore.set('clientId', clientId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
    })
}
