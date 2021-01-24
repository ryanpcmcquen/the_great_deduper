const fs = require("fs");
const path = require("path");
const csv_to_json = require("csvtojson");
const json_export = require("jsonexport");

const the_great_deduper = async (args) => {
    args = args || process.argv;
    const the_args = args.reduce((options, arg) => {
        if (/^--/.test(arg)) {
            const arg_split = arg.split("=");
            if (arg_split.length > 1) {
                options[arg_split[0]] = arg_split[1];
            } else {
                console.error(`Invalid command line argument passed: ${arg}`);
                process.exit(1);
            }
        }
        return options;
    }, {});

    let the_result = null;

    if (the_args["--input"]) {
        const the_data = await csv_to_json().fromFile(the_args["--input"]);

        const indexed_and_cleaned_data = the_data.map((entry, index) => {
            entry.id = index;
            entry.Phone = entry.Phone.replace(/\D/g, "");
            return entry;
        });

        const just_phones = indexed_and_cleaned_data.map((entry) => {
            return entry.Phone;
        }, {});

        const just_emails = indexed_and_cleaned_data.map((entry) => {
            return entry.Email;
        }, {});

        const deduped_data = indexed_and_cleaned_data.reduce(
            (new_arr, entry, index) => {
                let old_index = index;
                if (/email/.test(the_args["--strategy"])) {
                    while (
                        (index = just_emails.indexOf(
                            entry.Email,
                            index + 1
                        )) !== -1
                    ) {
                        Object.assign(entry, indexed_and_cleaned_data[index]);
                        indexed_and_cleaned_data[index].delete = true;
                    }
                }

                index = old_index;
                if (/phone/.test(the_args["--strategy"])) {
                    while (
                        (index = just_phones.indexOf(
                            entry.Phone,
                            index + 1
                        )) !== -1
                    ) {
                        Object.assign(entry, indexed_and_cleaned_data[index]);
                        indexed_and_cleaned_data[index].delete = true;
                    }
                }
                if (!entry.delete) {
                    new_arr.push(entry);
                }
                return new_arr;
            },
            []
        );

        const deduped_csv = await json_export(deduped_data);

        await fs.promises.writeFile(
            `output/__DEDUPED__${the_args["--strategy"]}__${path.basename(
                the_args["--input"]
            )}`,
            deduped_csv
        );

        the_result = deduped_csv;
    } else {
        console.error(`No input provided.`);
        process.exit(1);
    }

    return the_result;
};

module.exports = the_great_deduper;
