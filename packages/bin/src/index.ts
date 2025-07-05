import { createRsbuild } from "@rsbuild/core"
import defineConfig from "./defineConfig"
import parseArgs from "./parseArgs"
import parseOptions from "./parseOptions"

declare global {
    interface ImportMeta {
        readonly VERSION: string
        readonly PRODUCTION: string
        readonly BUILD_TIME: string
        readonly [k: string]: string
    }
}

export * from './interfaces'
export {
    defineConfig,
    createRsbuild,
    parseArgs,
    parseOptions,
}

