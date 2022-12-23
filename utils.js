import 'dotenv/config'
import fetch, { FetchError } from 'node-fetch'
import { verifyKey } from 'discord-interactions'

// Discord Specific Utilities
export function VerifyDiscordRequest(clientKey) {
    return function (req, res, buf,) {
        const signature = req.get('X-Signature-Ed25519')
        const timestamp = req.get('X-Signature-Timestamp')

        const isValidRequest = verifyKey(buf, signature, timestamp, clientKey)
        if (!isValidRequest) {
            res.status(401).send('Bad request signature')
            throw new Error('Bad request signature')
        }
    }
}

export async function DiscordRequest(endpoint, options) {
    // append endpoint to root API URL
    const url = `https://discord.com/api/v10/${endpoint}`
    // Stringify payloads
    if (options.body) options.body = JSON.stringify(options.body)

    try {
        // Use node-fetch to make requests
        const res = await fetch(url, {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
                'Content-Type': 'application/json charset=UTF-8'
            },
            ...options
        })

        // throw API errors
        if (res.status === 400 || res.status === 401 || res.status === 500) {
            const data = await res.json()
            console.log(res.status)
            throw new Error(JSON.stringify(data))
        }
        // return original response
        return res

    } catch (err) {
        // Log errors
        if (err instanceof TypeError) {
            console.log('Error: Non-JSON response')
        } else if (err instanceof FetchError) {
            console.log('Error: Failed to make request')
        } else {
            // Default case
            console.log('Error: Unhandled error')
            console.log(err)
        }
        
        return null
    }

}