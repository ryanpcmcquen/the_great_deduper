const fs = require("fs");
const path = require("path");

const csv_to_json = require("csvtojson");
const json_export = require("jsonexport");

const strategizer = require("./strategizer");
const parse_args = require("./parse_args");

/**
 * Dedupes data based on a certain strategy.
 *
 * @param {Array} data The data.
 * @param {Object} strategies The strategies.
 * @param {Object} the_args The arguments object.
 * @return {Array} { An array of rows with lines deduped/merged using the given strategies. }
 */
const dedupe = (data, strategies, the_args) => {
    const just = {};
    Object.keys(strategies).forEach((strategy) => {
        just[strategy] = data.map((entry) => {
            return entry[strategy];
        });
    });

    return data.reduce((new_arr, entry, index) => {
        let old_index = index;

        Object.keys(strategies).forEach((strategy) => {
            if (new RegExp(strategy, "i").test(the_args["--strategy"])) {
                while (
                    (index = just[strategy].indexOf(
                        entry[strategy],
                        index + 1
                    )) !== -1
                ) {
                    Object.assign(entry, data[index]);
                    data[index].delete = true;
                }
            }
            index = old_index;
        });

        if (!entry.delete) {
            new_arr.push(entry);
        }
        return new_arr;
    }, []);
};

/**
 * The main method that ties together all the other deduping stuff.
 *
 * @param {Array} [args=process.argv] The arguments, either passed in code or from the command line.
 * @return {String} { Stringified, deduped, ready to write CSV data. }
 */
const the_great_deduper = async (args = process.argv) => {
    let the_result = null;
    const the_args = parse_args(args);

    const strategies = strategizer.strategies;

    if (the_args["--input"]) {
        const the_data = await csv_to_json().fromFile(the_args["--input"]);

        const things_to_clean = strategizer.get_cleaners();

        const indexed_and_cleaned_data = the_data.map((entry, index) => {
            entry.id = index;
            things_to_clean.forEach((thing) => {
                entry[thing] = entry[thing].replace(strategies[thing], "");
            });

            return entry;
        });

        const deduped_data = dedupe(
            indexed_and_cleaned_data,
            strategies,
            the_args
        );

        const deduped_csv = await json_export(deduped_data);

        const output_directory = the_args["--output-directory"] || "output";
        await fs.promises.writeFile(
            `${output_directory}/__DEDUPED__${
                the_args["--strategy"]
            }__${path.basename(the_args["--input"])}`,
            deduped_csv
        );

        the_result = deduped_csv;
    } else {
        throw new Error(`No input provided.`);
        process.exit(1);
    }

    return the_result;
};

module.exports = the_great_deduper;
