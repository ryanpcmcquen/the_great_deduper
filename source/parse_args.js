/**
 * Supports object creation of arguments starting with '--'.
 *
 * @param {Array} args The arguments.
 * @return {Object} { An object split between key/value pairs of arguments. }
 */
const parse_args = (args) => {
    return args.reduce((options, arg) => {
        if (/^--/.test(arg)) {
            const arg_split = arg.split("=");
            if (arg_split.length > 1) {
                options[arg_split[0]] = arg_split[1];
            } else {
                throw new Error(`Invalid command line argument passed: ${arg}`);
                process.exit(1);
            }
        }
        return options;
    }, {});
};

module.exports = parse_args;
