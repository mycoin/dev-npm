import { DistPathConfig, FilenameConfig, HtmlConfig } from '@rsbuild/core'
import { register, RegisterOptions } from "ts-node"
import path from 'path'
import { readFileSync } from 'fs-extra';
import { Mode } from '@rspack/core';
import { KV } from '@mycoin/node-utils';

declare global {
    var __TS_NODE_REGISTERED__: boolean | undefined;
}


const coerce = <T>(target: unknown, sample: T): T => {
    switch (typeof sample) {
        case "number":
            return Number(target) as T;
        case "boolean":
            if (typeof target === "string") {
                return (target.toLowerCase() !== "false" && target !== "") as T;
            } else {
                return Boolean(target) as T;
            }
        case "string":
            return String(target) as T;
        default:
            return target as T;
    }
}

const resolveInternal = (fileName: string) => {
    return path.join(__dirname, '../' + fileName)
}

const readCertFile = () => {
    return {
        key: readFileSync(resolveInternal("config/server.key")),
        cert: readFileSync(resolveInternal("config/server.crt")),
    }
}

const registerTsNodeOnce = (options?: RegisterOptions) => {
    if (!global.__TS_NODE_REGISTERED__) {
        global.__TS_NODE_REGISTERED__ = true;
        register(options);
    }
}
const createDistPath = (flatMode: boolean, extra?: DistPathConfig): DistPathConfig => {
    const result: DistPathConfig = {
        js: 'static',
        jsAsync: 'static',
        css: 'static',
        cssAsync: 'static',
        svg: 'static',
        font: 'static',
        wasm: 'static',
        image: 'static',
        media: 'static',
        assets: 'static',
    }
    if (flatMode) {
        result.js = ""
        result.css = ""
    }
    if (extra && typeof extra === "object") {
        Object.assign(result, extra)
    }
    return result
}

const createFilenames = (flatMode: boolean): FilenameConfig => {
    const result: FilenameConfig = {}
    if (flatMode) {
        result.css = "[name].css"
        result.js = "[name].js"
    }
    return result;
}

const getModeName = (production: boolean) => {
    return ["development", "production"][+production || 0] as Mode
}

const getHtmlOption = (html: string | HtmlConfig): HtmlConfig => {
    if (html && typeof html === "object") {
        return html
    }
    if (html && typeof html === "string") {
        return {
            inject: "body",
            template: html,
        }
    }
    return null
}

const resolveDefines = (isNode: boolean, defines: KV) => {
    const result: Record<string, string> = {}
    const prefix = isNode ? "process.env." : "import.meta."

    // @ts-ignore
    defines.env = {
        ...defines
    }

    for (const key of Object.keys(defines)) {
        result[prefix + key] = JSON.stringify(defines[key])
    }
    return result
}
export {
    coerce,
    createDistPath,
    createFilenames,
    getModeName,
    getHtmlOption,
    resolveDefines,
    readCertFile,
    registerTsNodeOnce,
    resolveInternal,
}
