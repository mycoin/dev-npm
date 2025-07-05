export type Promisable<T = any> = T | Promise<T>
export type PromisableFn<T = any> = (args?: T) => Promisable<T>

export type KV = Record<string, string | number | boolean>
export type KVS = Record<string, string>
