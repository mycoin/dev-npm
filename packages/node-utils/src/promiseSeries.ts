import { PromisableFn } from "./interfaces"

export default async (tasks: PromisableFn[]) => {
    const results = []
    for (const task of tasks) {
        results.push(await task())
    }
    return results
}
