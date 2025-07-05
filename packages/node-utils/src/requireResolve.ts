export default (name: string, root?: string) => {
    if (typeof root === 'undefined') {
        root = process.cwd()
    }
    try {
        return require.resolve(name, {
            paths: [root],
        })
    } catch (e) {
        return false
    }
}
