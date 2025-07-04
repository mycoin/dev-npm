import { RsbuildPluginAPI, TransformDescriptor } from "@rsbuild/core"
import ejs, { Options } from 'ejs'

type PluginEjsOptions = {
    esModule?: boolean
    debug?: boolean
}

const pluginEjs = (options?: PluginEjsOptions) => {
    const { esModule, debug } = options || {}
    const params: Options = {
        client: true,
        rmWhitespace: true,
        compileDebug: debug,
        debug,
    }
    if (esModule) {
        params.strict = true
        params.localsName = 'data'
    }
    return {
        name: 'rsbuild:ejs',
        setup: (api: RsbuildPluginAPI) => {
            const descriptor: TransformDescriptor = {
                enforce: "pre",
                test: (fileName: string) => {
                    return fileName.endsWith(".ejs")
                }
            }
            api.transform(descriptor, async (context) => {
                const { code } = context
                const compiled = ejs.compile(code, params)
                return {
                    code: (esModule ? 'export default ' : 'module.exports = ') + compiled
                }
            })
        }
    }
}

export {
    pluginEjs,
}
