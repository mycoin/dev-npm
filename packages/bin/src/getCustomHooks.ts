import { existsSync } from "fs-extra"
import { CustomHooks } from "./interfaces"
import { registerTsNodeOnce } from "./util";

const resolvePath = (location: string) => {
    const extensions = ['.js', '.ts', '.mjs', "/index.js", "/index.ts", "/index.mjs"];
    for (const ext of extensions) {
        if (location.endsWith(ext)) {
            if (existsSync(location)) {
                return location
            }
        } else if (existsSync(location + ext)) {
            return location + ext
        }
    }
    return null
}

export default (location: string): CustomHooks => {
    const configFile = resolvePath(location)
    const returns: CustomHooks = {
        handle: (params) => params
    }
    if (configFile) {
        if (configFile.endsWith(".ts")) {
            registerTsNodeOnce()
        }
        const customHooks = require(configFile)
        const def = customHooks.default || customHooks

        if (typeof def === "function") {
            returns.handle = def
        } else if (def && typeof def === "object") {
            Object.assign(returns, def)
        }
    }
    return returns
}
