declare module '*.ejs' {
    const render: (data: Record<string, any>) => string
    export default render
}
declare module '*.module.scss' {
    const mapper: Record<string, string>
    export default mapper
}
