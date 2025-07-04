import { RsbuildEntry } from "@rsbuild/core"

export default (entry: RsbuildEntry) => {
    const mapper: RsbuildEntry = {}
    if (Array.isArray(entry) || typeof entry === "string") {
        mapper.index = entry
    } else if (entry && typeof entry === "object") {
        Object.assign(mapper, entry)
    } else {
        mapper.index = "@/index"
    }
    return mapper
}
