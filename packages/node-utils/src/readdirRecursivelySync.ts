import { readdirSync, statSync } from "fs"
import path from "path"

const readdirRecursivelySync = (dir: string) => {
    const entries = readdirSync(dir)

    return entries.reduce((prev, current): string[] => {
        const fullPath = path.join(dir, current)
        const stat = statSync(fullPath)

        if (stat.isDirectory()) {
            return prev.concat(readdirRecursivelySync(fullPath))
        } else {
            return prev.concat(fullPath)
        }
    }, [])
}

export default readdirRecursivelySync
