import { RsbuildPlugins } from "@rsbuild/core"
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSass } from '@rsbuild/plugin-sass'
import { pluginSvelte } from '@rsbuild/plugin-svelte'
import { pluginLess } from '@rsbuild/plugin-less'
import { pluginVue } from '@rsbuild/plugin-vue'
import { isInstalled } from '@mycoin/node-utils'

import { pluginEjs } from "./includes/ejs"
import { pluginCssModules } from "./includes/cssModules"
import { CommandOptions } from './interfaces'

export default (config: CommandOptions): RsbuildPlugins => {
    // 从配置中解构出项目根目录和是否生产模式标志
    const { root, resolve, watch, production, typedCssModules } = config
    // 初始化插件列表
    const results: RsbuildPlugins = [
        pluginSass(),             // 启用 Sass 支持（.scss/.sass）
        pluginLess(),             // 启用 Less 支持（.less）
        pluginEjs({
            esModule: false,      // 编译 EJS 模板时不使用 ESModule 输出
            debug: !production,   // 开发模式开启 debug 输出
        })
    ]
    if (typedCssModules) {
        results.push(pluginCssModules({
            resolve,
            watch,
        }))
    }
    // 如果项目中安装了 svelte，就添加 svelte 插件
    if (isInstalled("svelte", root)) {
        results.push(pluginSvelte())
    }
    // 如果项目中安装了 react，就添加 react 插件
    if (isInstalled('react', root)) {
        results.push(pluginReact())
    }
    // 如果项目中安装了 vue，就添加 vue 插件
    if (isInstalled('vue', root)) {
        results.push(pluginVue())
    }
    return results
}
