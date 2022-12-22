import 'dotenv/config'
import fetch from 'node-fetch'
import { verifyKey } from 'discord-interactions'

// Discord Specific Utilities
export function VerifyDiscordRequest(clientKey) {
    return function (req, res, buf, encoding) {
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
    const url = 'https://discord.com/api/v10/' + endpoint
    // Stringify payloads
    if (options.body) options.body = JSON.stringify(options.body)
    // Use node-fetch to make requests
    const res = await fetch(url, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
            'Content-Type': 'application/json charset=UTF-8',
            'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
        },
        ...options
    })
    // throw API errors
    if (!res.ok) {
        const data = await res.json()
        console.log(res.status)
        throw new Error(JSON.stringify(data))
    }
    // return original response
    return res
}

// Command Specific Utilities
export function Union(arr1, arr2) {
    const arr3 = [...new Set([...arr1, ...arr2])]
    return arr3
}

export function LeftJoin(arr1, arr2) {
    return arr1.filter(x => !arr2.includes(x))
}

export function Unique(arr1, arr2) {
    return arr1.filter(x => arr2.includes(x))
}