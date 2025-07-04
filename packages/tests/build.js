
const { createConfig, createRsbuild } = require('@mycoin/bin')

createRsbuild({
    cwd: process.cwd(),
    loadEnv: true,
    rsbuildConfig: createConfig({
        html: {},
        options: {
            dataUriLimit: 0,
            assetPrefix: "https://localhost:4443/",
            cssExtract: true,
        }
    })
}).then((e) => {
    e.build({
        watch: true
    })
})
