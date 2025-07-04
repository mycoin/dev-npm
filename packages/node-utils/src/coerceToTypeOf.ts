export default <T>(target: unknown, sample: T): T => {
    switch (typeof sample) {
        case "number":
            return Number(target) as T;
        case "boolean":
            if (typeof target === "string") {
                return (target.toLowerCase() !== "false" && target !== "") as T;
            } else {
                return Boolean(target) as T;
            }
        case "string":
            return String(target) as T;
        default:
            return target as T;
    }
};
