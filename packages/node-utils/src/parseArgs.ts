import { PrimitiveKV, Primitive, ParseArgsResult } from "./interfaces";

export default function <D extends PrimitiveKV = {}>(
    argv: string[],
    defaults: D
): ParseArgsResult<D> {
    const result: Record<string, Primitive> = {};
    const valueParsed: Record<string, Primitive> = {};
    const positionals: string[] = [];

    const types: Record<string, string> = {};
    const setValue = (k: string, v: Primitive) => {
        result[k] = v;
        valueParsed[k] = v;
    }

    const toCamelCase = (key: string): string => {
        return key.replace(/[-_]+(\w)/g, (_, c) => c.toUpperCase());
    }

    for (const key in defaults) {
        const camelKey = toCamelCase(key);

        types[camelKey] = typeof defaults[key];
        result[camelKey] = defaults[key];
    }

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];

        if (!arg.startsWith('-')) {
            positionals.push(arg);
            continue;
        }

        let key: string;
        let value: any;

        if (arg.startsWith('--no-')) {
            key = toCamelCase(arg.slice(5));
            setValue(key, false)
            continue;
        }
        if (arg.startsWith('--')) {
            const eqIdx = arg.indexOf('=');
            const expectedType = types[key];

            if (eqIdx !== -1) {
                key = toCamelCase(arg.slice(2, eqIdx));
                value = arg.slice(eqIdx + 1);
            } else {
                key = toCamelCase(arg.slice(2));
                const next = argv[i + 1];
                if (next && !next.startsWith('-')) {
                    value = next;
                    i++;
                } else {
                    value = true;
                }
            }
            if (expectedType === 'boolean') {
                setValue(key, value === 'false' ? false : Boolean(value))
            } else if (expectedType === 'number') {
                setValue(key, Number(value))
            } else {
                setValue(key, value)
            }
        }
    }
    for (const k in result) {
        if (typeof defaults[k] === "undefined") {
            delete result[k]
        }
    }
    return {
        values: result as ParseArgsResult<D>['values'],
        valueParsed,
        positionals,
    };
}
