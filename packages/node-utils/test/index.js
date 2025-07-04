const { parseArgs } = require("..")

const argv = [
    '--port=8080',
    '--no-css-extract',
    '--sourceMap=true',
    '--out-dir', 'dist',
    'main.ts',
    'utils.ts'
];
const defaults = {
    port: 3000,
    cssExtract: true,
    outDir: 'build',
    sourcemap: true,
};

const e = parseArgs(argv, defaults)
console.error(e);
