import path from "path"
import { loadEnv } from "@rsbuild/core"
import { CommandParsed, CommandOptions } from "./interfaces"
import getCustomHooks from "./getCustomHooks"
import { getHtmlOption } from "./util"

export default (commandParsed: CommandParsed): CommandOptions => {
    const { commandName, params } = commandParsed
    const { html, config, production, root } = params
    const resolve = (fileName: string) => {
        return path.join(root, fileName)
    }

    const { version } = require(resolve("package.json"))
    const mode = production ? "production" : "development"
    const customHooks = getCustomHooks(resolve(config))

    const { rawPublicVars } = loadEnv({
        mode,
        cwd: root,
    })
    const returns: CommandOptions = {
        // 继承上游部分参数
        ...params,
        // 命令名称
        command: commandName,
        // 构建模式
        mode,
        // 根据当前项目根目录拼接完整路径
        resolve,
        // 前置引导文件
        preprend: "",
        // 构建入口配置
        entry: {
            index: "@/index"
        },
        // HTML插件相关配置
        html: getHtmlOption(html),
        // 全局替换变量定义
        defines: {
            // 最近构建时间
            BUILD_TIME: new Date().toISOString(),
            // 是否生产环境
            PRODUCTION: production,
            // 应用版本号
            VERSION: version,
            // 只能加载公开变量
            ...rawPublicVars,
        },
        // 外部依赖声明
        externals: {},
        // 限制内联资源（如图片、字体等）的大小阈值
        dataUriLimit: 4096,
        // 服务器代理配置
        serverProxy: {},
        // 自定义干预方法
        customHooks,
    }
    if (typeof customHooks.handle === "function") {
        return customHooks.handle(returns) || returns
    } else {
        return returns
    }
}
