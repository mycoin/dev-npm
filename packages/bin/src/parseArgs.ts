import { coerceToTypeOf, parseArgs } from "@mycoin/node-utils";
import { CommandArgs, CommandName, CommandParsed } from "./interfaces";
import { loadEnv } from "@rsbuild/core";
import { getModeName } from "./util";

const buildModeArgs: CommandArgs = {
    // 项目根文件夹位置
    root: process.cwd(),
    // 额外配置文件地址
    config: "build",
    // 项目运行环境
    target: "web",
    // 是否为生产模式构建（RsbuildMode）
    production: true,
    // 是否生成 SourceMap
    sourceMap: true,
    // 输出目录
    outDir: "dist",
    // 静态资源前缀
    assetPrefix: "/",
    // 是否生成资源清单文件
    manifest: false,
    // 构建前是否清理输出目录
    clean: true,
    // 页面渲染模板
    html: "",
    // 是否需要释放样式文件
    cssExtract: false,
    // 关闭启用监听模式
    watch: false,
    // 开发模式不用写入磁盘
    writeDisk: false,
    // 是否自动生成样式模块申明
    typedCssModules: false
}

const devModeExtra: CommandArgs = {
    // 是否启用监听模式，构建完成后继续监听文件变更
    watch: true,
    // 是否需要启动服务器
    server: true,
    // 浏览器访问路径前缀
    serverBaseUrl: "/",
    // 指定本地服务器地址
    hostname: "127.0.0.1",
    // 指定本地服务器端口号
    port: 4443,
    // 是否开启浏览器自动打开
    open: false,
    // 开发模式默认不压缩
    production: false,
}

// 映射关系
const envNameMapper: Record<string, keyof CommandArgs> = {
    // 浏览器访问路径前缀
    PUBLIC_SERVER_BASE_URL: "serverBaseUrl",
    // 输出目录
    PUBLIC_OUT_DIR: "outDir",
    // 静态资源前缀
    PUBLIC_ASSET_PREFIX: "assetPrefix",
    // 是否需要释放样式文件
    PUBLIC_CSS_EXTRACT: "cssExtract",
}

const cleanAndAdjust = (params: CommandArgs) => {
    // 配置不全则禁用服务器
    if (!params.hostname || !params.port) {
        params.server = false
    }
    // 如果没有开启服务则写磁盘
    if (!params.server) {
        params.writeDisk = true
    }
}

export default (args: [CommandName, ...string[]]): CommandParsed => {
    const [commandName, ...otherArgs] = args
    const mapper: Record<CommandName, CommandArgs> = {
        build: buildModeArgs,
        dev: {
            ...buildModeArgs,
            ...devModeExtra,
        },
    }
    // 这里复制一份配置
    const params = {
        ...mapper[commandName]
    }

    const { values, valueParsed } = parseArgs<CommandArgs>(otherArgs, params)
    const mode = getModeName(values.production)
    const { rawPublicVars } = loadEnv({
        mode,
        cwd: values.root,
    })

    // 使用环境变量替换默认值
    for (const k in rawPublicVars) {
        if (!envNameMapper[k]) {
            continue
        }
        Object.assign(params, {
            [envNameMapper[k]]: coerceToTypeOf(rawPublicVars[k], params[envNameMapper[k]])
        })
    }
    // 用参数解析结果覆盖最终值
    Object.keys(params).forEach((keyName) => {
        if (keyName in valueParsed) {
            params[keyName] = valueParsed[keyName]
        }
    })

    cleanAndAdjust(params)
    return {
        commandName,
        params,
    }
}

