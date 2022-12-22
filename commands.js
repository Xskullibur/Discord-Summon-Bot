import { GlobalApplicationEndpoint } from "./classes/endpoints.js"
import { DiscordRequest } from "./utils.js"

// Update Commands
export async function UpdateCommands(appId, commands) {
    // Error Handling
    if (appId == '') return

    // Retrieve global commands
    await RetrieveGlobalCommands(appId).then(globalCommands => {

        // Clear deleted commands
        const deletedCommands = globalCommands.filter(existingCommand => !commands.some(newCommand => existingCommand.name == newCommand.name))
        if (deletedCommands.length > 0) {
            console.log(`Deleting ${deletedCommands.length} commands`)
            deletedCommands.forEach(deletedCommand => DeleteCommand(appId, deletedCommand.id))
        }


        // Update commands
        commands.forEach(command => {

            // Command does not exist or lower version
            if (!globalCommands.includes(command.name)) {

                // Install Commands
                console.log(`Installing "${command['name']}"`)
                InstallCommand(appId, command).then(
                    console.log(`Installed "${command['name']}"`)
                )
            }
            else {
                console.log(`"${command['name']}" command already installed and up to`)
            }
        })
    })
}

async function RetrieveGlobalCommands(appId) {
    // API endpoint to retrieve commands
    const endpoint = new GlobalApplicationEndpoint(appId)

    try {
        // Get existing global commands
        const res = await DiscordRequest(endpoint.allCommandsEndpoint(), { method: 'GET' })
        const data = await res.json()
        return data

    } catch (err) {
        console.error(err)
    }
}

// Installs a command
export async function InstallCommand(appId, command) {

    // API endpoint to delete command
    const endpoint = new GlobalApplicationEndpoint(appId)
    const commandEndpoint = endpoint.allCommandsEndpoint()

    // Install command
    try {
        await DiscordRequest(commandEndpoint, { method: 'POST', body: command })
    } catch (err) {
        console.error(err)
    }
}

// Deletes commands that does not exist
export async function DeleteCommand(appId, commandId) {

    // API endpoint to delete command
    const endpoint = new GlobalApplicationEndpoint(appId)
    const commandEndpoint = endpoint.singleCommandEndpoint(commandId)

    try {
        // Deleted command
        await DiscordRequest(commandEndpoint, { method: 'DELETE' })
    } catch (err) {
        console.error(err)
    }
}

// Simple test command
export const TEST_COMMAND = {
    name: 'test',
    description: 'Basic guild command',
    type: 1
}