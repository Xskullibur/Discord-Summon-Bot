import 'dotenv/config'
import express from 'express'
import { InteractionResponseType, InteractionType } from 'discord-interactions'
import { TEST_COMMAND, UpdateCommands } from './commands.js'
import { VerifyDiscordRequest } from './utils.js'

// Setup server
const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json({
    verify: VerifyDiscordRequest(process.env.PUBLIC_KEY)
}))

// Interaction endpoint URL for Discord to send HTTP requests to
app.post('/interactions', async (req, res) => {

    // Get Interaction type and data
    const { type, data } = req.body

    // Handle verification requests (Required to upload bot)
    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG })
    }

    // Handle slash command requests
    if (type === InteractionType.APPLICATION_COMMAND) {

        // Get required fields from data
        const { name } = data
        if (name === 'test') {
            // Send a message into the channel where command was triggered from
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    // Fetches a random emoji to send from a helper function
                    content: 'Tuturu~~',
                },
            })
        }

    }

})

app.listen(PORT, () => {
    console.log('Listening on port', PORT)
    // Check if guild commands from commands.js are installed (if not, install them)
    UpdateCommands(process.env.APP_ID, [
        TEST_COMMAND
    ])
})
