import chalk from 'chalk';

interface UsageLine {
    command: string;
    description: string;
}

interface Argument {
    flags: string;
    description: string;
}

interface HelpOptions {
    title?: string;
    version?: string;
    usage: UsageLine[];
    arguments: Argument[];
    colors?: {
        title?: (text: string) => string;
        section?: (text: string) => string;
        flags?: (text: string) => string;
        description?: (text: string) => string;
    };
}

export default (options: HelpOptions) => {
    const { title, version, usage, arguments: args, colors = {}, } = options;

    const colorTitle = colors.title ?? chalk.bold.cyan;
    const colorSection = colors.section ?? chalk.bold;
    const colorFlags = colors.flags ?? chalk.green;
    const colorDesc = colors.description ?? chalk.reset;

    const versionLine = colorTitle((title + ' ' + (version ?? '')).trim());
    const maxUsageLength = Math.max(24, ...usage.map(u => u.command.length)) + 4;
    const maxFlagLength = Math.max(16, ...args.map(a => a.flags.length)) + 4;
    const usageLines = usage.map(function (u) {
        return '   ' + chalk.white(u.command.padEnd(maxUsageLength)) + colorDesc(u.description);
    }).join('\n');

    const argumentLines = args.map(function (arg) {
        return '   ' + colorFlags(arg.flags.padEnd(maxFlagLength)) + colorDesc(arg.description);
    }).join('\n');

    return [
        versionLine,
        '',
        colorSection('Usage:'),
        usageLines,
        '',
        colorSection('Arguments:'),
        argumentLines,
        ''
    ].join('\n');
};
