import { defineConfig, OutputConfig, RsbuildConfig, SourceConfig } from "@rsbuild/core"
import getPlugins from "./getPlugin"
import getWebpackEntry from "./getWebpackEntry"
import { CommandOptions } from "./interfaces"
import {
    createDistPath,
    createFilenames,
    getHtmlOption,
    readCertFile,
    resolveDefines,
    resolveInternal
} from "./util"

const internalGlobal = resolveInternal("internal.js")
const checkOptions = (options: CommandOptions) => {
    const { assetPrefix } = options
    // 静态资源前缀不支持相对路径
    if (assetPrefix && assetPrefix[0] === ".") {
        throw new TypeError("`assetPrefix` cannot be a relative path")
    }
}

export default (options: CommandOptions) => {
    const {
        target,                    // 项目运行环境
        mode,                      // 项目构建模式
        production,                // 是否为生产模式构建
        sourceMap,
        outDir,                    // 输出目录
        assetPrefix,               // 静态资源前缀
        manifest,                  // 是否生成资源清单文件
        clean,                     // 构建前是否清理输出目录
        cssExtract,                // 是否需要释放样式
        resolve,
        preprend,                  // 前置引导文件
        entry,                     // 构建入口配置
        dataUriLimit,              // 限制内联资源（如图片、字体等）的大小阈值
        defines,                   // 全局替换变量定义
        externals,
    } = options

    checkOptions(options)
    const baseHtml = getHtmlOption(options.html)
    const baseOutput: OutputConfig = {
        // 构建目标
        target,
        // 外部模块（不打包）
        externals,
        // 构建产物命名规则
        filename: createFilenames(!baseHtml),
        // 输出路径配置
        distPath: createDistPath(!baseHtml, {
            root: outDir,
        }),
        // 静态资源前缀（可用于 CDN）
        assetPrefix,
        // base64 内联大小限制
        dataUriLimit: dataUriLimit ?? 0,
        // 是否保留注释（none 表示去除）
        legalComments: "none",
        // 是否启用压缩
        minify: production,
        // 输出构建清单
        manifest,
        // 是否生成 SourceMap
        sourceMap,
        // 是否将样式注入到 JS 中（true 为注入，false 为抽离 CSS 文件）
        injectStyles: !cssExtract,
        // 构建前是否清理输出目录
        cleanDistPath: clean,
    }
    const baseInput: SourceConfig = {
        // 设置构建入口
        entry: getWebpackEntry(entry),
        // 变量替换配置
        define: resolveDefines(target === "node", defines),
        // 前置引导文件
        preEntry: [
            internalGlobal,
        ],
    }
    if (preprend) {
        (baseInput.preEntry as string[]).push(preprend)
    }
    // 创建最终配置
    const config: RsbuildConfig = {
        // 当前构建模式
        mode,
        resolve: {
            alias: {
                "@": resolve("src"),
            },
        },
        source: baseInput,
        // 输出相关配置
        output: baseOutput,
        // 插件配置
        plugins: getPlugins(options),
        tools: {
            postcss: {
                sourceMap
            },
        },
    }
    const {
        server,             // 是否开启内置服务器
        serverBaseUrl,      // 浏览器访问路径前缀，默认“/”
        hostname,
        port,
        serverProxy,        // 请求代理转发规则
        writeDisk } = options
    if (server) {
        config.dev = {
            assetPrefix: assetPrefix[0] === "/" ? assetPrefix : "/",
            writeToDisk: !!writeDisk,
        }
        config.server = {
            base: serverBaseUrl || "/",
            host: hostname,
            port,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            cors: true,
            https: readCertFile(),
            proxy: serverProxy || {},
        }
    }

    // 如果开启了HTML插件且配置为对象添加HTML配置
    if (baseHtml && typeof baseHtml === "object") {
        config.html = baseHtml
    } else {
        // 否则禁用HTML插件
        if (config.tools) {
            config.tools.htmlPlugin = false
        }
    }
    // 返回最终配置
    return defineConfig(config)
}
