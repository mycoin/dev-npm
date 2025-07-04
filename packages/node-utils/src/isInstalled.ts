export default (name: string, root?: string) => {
    if (typeof root === "undefined") {
        root = process.cwd()
    }
    try {
        require.resolve(name, {
            paths: [root],
        })
        return true
    } catch (e) {
        return false
    }
}
