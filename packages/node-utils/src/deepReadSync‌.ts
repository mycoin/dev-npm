import path from "path"
import { readdirSync, statSync } from "fs"

const deepReadSync‌ = (dir: string, exclude?: (name: string, dir: string) => boolean) => {
    const subFiles = readdirSync(dir)

    return subFiles.reduce((prev, current): string[] => {
        const value = path.join(dir, current)
        const stat = statSync(value)
        if (typeof exclude === "function" && exclude(current, value)) {
            return prev
        }
        if (stat.isDirectory()) {
            return prev.concat(deepReadSync‌(value, exclude))
        } else {
            return prev.concat(value)
        }
    }, [])
}

export default deepReadSync‌
