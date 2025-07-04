#!/usr/bin/env node
const { logger } = require("@rsbuild/core")
const { parseArgs, parseOptions, defineConfig, createRsbuild } = require(".")
const userArgs = process.argv.slice(2)

// 默认行动类型
if (!/^\w/.test(userArgs[0] || "")) {
    userArgs.unshift("build")
}

const args = parseArgs(userArgs)
const { commandName } = args
switch (commandName) {
    case 'dev':
    case 'build':
        runCommand()
        break;
    default:
        logger.error("unknown command `" + commandName + "`.")
        break;
}

async function runCommand() {
    const options = parseOptions(args)
    const { root, server } = options
    const handler = await createRsbuild({
        cwd: root,
        rsbuildConfig: defineConfig(options),
    })
    if (server) {
        const { urls } = await handler.startDevServer()
        logger.start("Server started: " + urls[0])
    } else {
        handler.build({
            watch: options.watch,
        })
    }
}
