import { DistPathConfig, FilenameConfig, HtmlConfig } from '@rsbuild/core'
import { register, RegisterOptions } from "ts-node"
import path from 'path'
import { readFileSync } from 'fs-extra';
import { Primitive } from '@mycoin/node-utils';
import { Mode } from '@rspack/core';

declare global {
    var __TS_NODE_REGISTERED__: boolean | undefined;
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

const resolveDefines = (isNode: boolean, defines: Record<string, Primitive>) => {
    const result: Record<string, string> = {}
    const prefix = isNode ? "process.env." : "import.meta."
    for (const key of Object.keys(defines)) {
        result[prefix + key] = JSON.stringify(defines[key])
    }
    return result
}
export {
    createDistPath,
    createFilenames,
    getModeName,
    getHtmlOption,
    resolveDefines,
    readCertFile,
    registerTsNodeOnce,
    resolveInternal,
}
