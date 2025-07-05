import { KV } from "./interface"
import { coerceAs, toCamelCase } from "./util"

export type ParsedArgs<T extends KV> = {
    options: KV
    positional: string[]
    result: T
}

export type ParseArgsParam<T extends KV> = {
    args: string[]
    defaults?: T
    strict?: boolean
}

export default <T extends KV>(params: ParseArgsParam<T>): ParsedArgs<T> => {
    const { args, defaults, strict } = params
    const paramArgs = [...args]
    const options: KV = {}
    const result = {
        ...defaults,
    }

    const positional: string[] = []
    const set = (k: string, v: unknown) => {
        if (k in defaults) {
            v = coerceAs(v, defaults[k])
            Object.assign(result, {
                [k]: v
            })
        } else if (strict || k in options) {
            throw new TypeError("unknown args `" + k + "`")
        }
        options[k] = v as any
    }

    while (paramArgs.length > 0) {
        const arg = paramArgs.shift()!

        if (!arg.startsWith('--')) {
            positional.push(arg)
            continue
        }
        if (arg.startsWith('--no-')) {
            const key = toCamelCase(arg.slice(5))
            set(key, false)
            continue
        }
        const eqIndex = arg.indexOf('=')
        if (eqIndex !== -1) {
            const rawKey = arg.slice(2, eqIndex)
            const key = toCamelCase(rawKey)
            const value = arg.slice(eqIndex + 1).replace(/^['"]|['"]$/g, '') // 去除包裹的引号

            set(key, value)
            continue
        }
        const rawKey = arg.slice(2)
        const key = toCamelCase(rawKey)

        if (paramArgs.length > 0 && !paramArgs[0].startsWith('--')) {
            const value = paramArgs.shift()!
            set(key, value.replace(/^['"]|['"]$/g, ''))
        } else {
            set(key, true)
        }
    }

    return {
        options,
        result,
        positional
    }
}
