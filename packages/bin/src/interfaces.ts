import { Mode } from '@rspack/core'
import { Primitive } from '@mycoin/node-utils'
import { HtmlConfig, ProxyOptions, RsbuildEntry, RsbuildTarget } from '@rsbuild/core'

export type CommandArgs = {
    // 项目根文件夹位置
    readonly root?: string
    // 额外配置文件地址
    readonly config?: string
    // 项目运行环境
    readonly target?: RsbuildTarget,
    // 是否为生产模式构建
    production?: boolean
    // 是否启用监听模式，构建完成后继续监听文件变更
    watch?: boolean
    // 实时写入构建结果
    writeDisk?: boolean
    // 是否需要启动服务器
    server?: boolean
    // 浏览器访问路径前缀
    serverBaseUrl?: string
    // 指定本地服务器地址
    hostname?: string
    // 指定本地服务器端口号
    port?: number
    // 是否开启浏览器自动打开
    open?: boolean
    // 是否生成 SourceMap
    sourceMap?: boolean
    // 输出目录
    outDir?: string
    // 静态资源前缀
    assetPrefix?: string
    // 是否生成资源清单文件
    manifest?: boolean
    // 构建前是否清理输出目录
    clean?: boolean
    // 页面渲染模板
    html?: string
    // 是否需要释放样式文件
    cssExtract?: boolean
    // 是否自动生成样式模块申明
    typedCssModules?: boolean
}

export type CustomHooks = {
    handle: (params: CommandOptions) => CommandOptions | void
}

export type CommandName = "dev" | "build"
export type CommandOptions = Omit<CommandArgs, "html"> & {
    // 当前的命令类型
    readonly command: CommandName
    // 项目运行模式
    readonly mode: Mode
    // 根据当前项目根目录拼接完整路径
    readonly resolve: (name: string) => string
    // 构建配置加工函数
    readonly customHooks: CustomHooks
    //外部依赖声明
    readonly externals: {
        [key: string]: string | {
            root: string
            commonjs: string
            commonjs2: string
            amd: string
        }
    }
    // 全局替换变量定义
    defines: Record<string, Primitive>
    // 前置引导文件
    preprend?: string
    // 构建入口配置
    entry: RsbuildEntry
    // HTML插件相关配置
    html: string | HtmlConfig
    // 限制内联资源（如图片、字体等）的大小阈值
    dataUriLimit: number
    // 服务器代理配置
    serverProxy?: Record<string, ProxyOptions>
}

export type CommandParsed = {
    commandName: CommandName
    params: CommandArgs
}

