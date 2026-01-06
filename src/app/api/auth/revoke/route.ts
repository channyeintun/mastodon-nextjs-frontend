import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * POST /api/auth/revoke
 * Server-side token revocation endpoint
 * 
 * Receives: token (access_token to revoke)
 * Reads: instanceURL, clientId, clientSecret from cookies
 * Returns: empty object on success
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { token } = body

        if (!token) {
            return NextResponse.json(
                { error: 'Missing token parameter' },
                { status: 400 }
            )
        }

        // Read auth data from cookies
        const cookieStore = await cookies()
        const instanceURL = cookieStore.get('instanceURL')?.value
        const clientId = cookieStore.get('clientId')?.value
        const clientSecret = cookieStore.get('clientSecret')?.value

        if (!instanceURL || !clientId || !clientSecret) {
            // If credentials are missing, just return success
            // The user is signing out anyway
            return NextResponse.json({})
        }

        // Revoke the token
        const revokeResponse = await fetch(`${instanceURL}/oauth/revoke`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${token}`,
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                token,
            }),
        })

        if (!revokeResponse.ok) {
            const errorData = await revokeResponse.json().catch(() => ({}))
            console.error('Token revocation failed:', errorData)
            // Don't fail the sign out - just log the error
            // The user wants to sign out regardless
        }

        return NextResponse.json({})
    } catch (error) {
        console.error('Revoke API error:', error)
        // Don't fail the sign out - just log the error
        return NextResponse.json({})
    }
}
