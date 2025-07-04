export type Promisable<T = any> = T | Promise<T>
export type PromisableFn<T = any> = (args?: T) => Promisable<T>

type CamelCased<K extends string> = K extends `${infer Head}-${infer Tail}` ? `${Head}${Capitalize<CamelCased<Tail>>}` : K

export type Primitive = string | number | boolean
export type PrimitiveKV = Record<string, Primitive>
export type ParseArgsResult<D extends PrimitiveKV> = {
    positionals: string[]
    valueParsed: PrimitiveKV
    values: {
        [K in keyof D as CamelCased<string & K>]: D[K]
    }
}
