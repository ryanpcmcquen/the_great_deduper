/**
 * Strategy related configs and helpers.
 *
 * @type {Object}
 */
const strategizer = {
    strategies: {
        Email: null,
        Phone: /\D/g,
    },
    /**
     * Gets the cleaners.
     *
     * @return {Array} Returns all types of strategies that have regex cleaning values.
     */
    get_cleaners: () => {
        return Object.keys(strategizer.strategies).filter((strategy) => {
            return strategizer.strategies[strategy];
        });
    },
};

module.exports = strategizer;
