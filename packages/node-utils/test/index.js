const { parseArgs, deepReadSync‌, getUsageLine, chalk } = require("..")

const argv = [
    "dev",
    '--port=4444',
    '--no-css-extract',
    '--sourcemap',
    '--production',
    '--out-dir', '"a"',
    'main.ts',
    'utils.ts'
];

const e = parseArgs({
    defaults: {
        port: 3000,
        cssExtract: true,
        outDir: 'build',
        x: 1,
        sourcemap: true,
    },
    args: argv,
    strict: false
})

console.error(e);
console.error(deepReadSync‌("node_modules/", (n, r) => {
    return n[0] === "."
}));

console.error(
    getUsageLine({
        title: 'MYTOOL - My CLI Tool',
        version: '1.0.0',
        usage: [
            { command: 'mytool [arguments] [file ..]', description: 'process specified file(s)' },
            { command: 'mytool [arguments] -', description: 'read input from stdin' },
            { command: 'mytool [arguments] -c config.json', description: 'use a specific config file' },
        ],
        arguments: [
            { flags: '--', description: 'Only file names after this' },
            { flags: '-v', description: 'Verbose mode' },
            { flags: '-q', description: 'Quiet mode' },
            { flags: '-c <file>', description: 'Specify config file' },
            { flags: '-o <dir>', description: 'Output directory' },
            { flags: '--dry-run', description: 'Run without making changes' },
            { flags: '--no-cache', description: 'Disable caching' },
            { flags: '--version', description: 'Print version' },
            { flags: '--help', description: 'Print this help message' },
        ],
        colors: {
            title: chalk.bold.yellow,
            section: chalk.bold,
            flags: chalk.green,
            description: chalk.white,
        },
    })
);
