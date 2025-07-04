import { RsbuildPluginAPI } from "@rsbuild/core"
import { run } from 'typed-css-modules'

type PluginCssModulesOptions = {
    watch: boolean
    resolve: (name: string) => string
}

const pluginCssModules = (params: PluginCssModulesOptions) => {
    const { resolve, watch } = params
    const sourceDir = resolve('src')

    return {
        name: 'rsbuild:cssModules',
        setup: (api: RsbuildPluginAPI) => {
            api.onBeforeBuild(() => {
                run(sourceDir, {
                    pattern: '**/*.module.{css,scss,less}', // 匹配文件的 glob 模式
                    camelCase: true,                        // 是否将 className 转成 camelCase
                    watch,                                  // 是否启用监听模式（开发时可为 true）
                    silent: true,                           // 是否禁用日志输出
                })
            })
        }
    }
}

export {
    pluginCssModules
}
