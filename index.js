import 'dotenv/config'
import express from 'express'
import { InteractionResponseType, InteractionType } from 'discord-interactions'
import { MessageCommand, SUMMON_COMMAND, TEST_COMMAND, UNSUMMON_COMMAND, UpdateCommands } from './commands.js'
import { VerifyDiscordRequest } from './utils.js'


// Setup server
const summonDict = {}
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json({
    verify: VerifyDiscordRequest(process.env.PUBLIC_KEY)
}))

// Interaction endpoint URL for Discord to send HTTP requests to
app.post('/interactions', async (req, res) => {

    // Get Interaction type and data
    const { type, data, channel_id } = req.body

    // Handle verification requests (Required to upload bot)
    if (type === InteractionType.PING) {
        return handlePing(res)
    }

    // Handle slash command requests
    if (type === InteractionType.APPLICATION_COMMAND) {

        // Get required fields from data
        const { name, options } = data

        switch (name) {
            case 'test':
                // Send a message into the channel where command was triggered from
                return handleTestCommand(res)

            case 'summon':
                // Get Summoned User ID
                /**
                * SUMMON COMMAND
                */
                var summoned_user = options[0].value

                // Check if user is mentioned
                if (!(summoned_user in summonDict)) {

                    // Send a message into the channel where command was triggered from
                    res.send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            content: `Summoning <@${summoned_user}>`,
                        },
                    })

                    // Start summoning
                    const intervalId = setInterval(() => {
                        MessageCommand(channel_id, `<@${summoned_user}>`)
                    }, 1000)

                    // Add user to mention list
                    summonDict[summoned_user] = intervalId
                }
                break

            case 'unsummon':

                // Get Summoned User ID
                /**
                * UNSUMMON COMMAND 
                */
                var summonedUser = options[0].value

                // Check if user is mentioned
                if (summonedUser in summonDict) {
                    clearInterval(summonDict[summonedUser])
                    delete summonDict[summonedUser]

                    // Send a message into the channel where command was triggered from
                    return res.send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            content: `Stopped Summoning <@${summonedUser}>`,
                        },
                    })
                }
                else {
                    // Send a message into the channel where command was triggered from
                    return res.send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            content: 'User was not summoned',
                        },
                    })
                }

            default:
                break
        }

    }

})

// Test Command
function handleTestCommand(res) {
    return res.send({
        // type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            // Fetches a random emoji to send from a helper function
            content: 'Tuturu~~',
        },
    })
}

// Ping Command
function handlePing(res) {
    return res.send({ type: InteractionResponseType.PONG })
}

// Listen to requests
app.listen(PORT, () => {

    // Verify Environment Variables
    console.log('Verifying environment variables')
    if (!process.env.APP_ID) {
        throw new Error('Missing Application ID')
    }
    else if (!process.env.DISCORD_TOKEN) {
        throw new Error('Missing Discord Token')
    }
    else if (!process.env.PUBLIC_KEY) {
        throw new Error('Missing Public Key')
    }
    
    // Check if guild commands from commands.js are installed (if not, install them)
    console.log('Listening on port', PORT)
    UpdateCommands(process.env.APP_ID, [
        TEST_COMMAND,
        SUMMON_COMMAND,
        UNSUMMON_COMMAND
    ])
})
