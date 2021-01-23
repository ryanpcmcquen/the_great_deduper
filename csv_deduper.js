const fs = require("fs");
const path = require("path");
const csv_to_json = require("csvtojson");
const json_export = require("jsonexport");

const theGreatDeduper = async (args) => {
    args = args || process.argv;
    const theArgs = args.reduce((options, arg) => {
        if (/^--/.test(arg)) {
            const argSplit = arg.split("=");
            if (argSplit.length > 1) {
                options[argSplit[0]] = argSplit[1];
            } else {
                console.error(`Invalid command line argument passed: ${arg}`);
                process.exit(1);
            }
        }
        return options;
    }, {});

    let theResult = null;

    if (theArgs["--input"]) {
        const theData = await csv_to_json().fromFile(theArgs["--input"]);

        const indexedAndCleanedData = theData.map((entry, index) => {
            entry.id = index;
            entry.Phone = entry.Phone.replace(/\D/g, "");
            return entry;
        });

        const justPhones = indexedAndCleanedData.map((entry) => {
            return entry.Phone;
        }, {});

        const justEmails = indexedAndCleanedData.map((entry) => {
            return entry.Email;
        }, {});

        const dedupedData = indexedAndCleanedData.reduce(
            (newArr, entry, index) => {
                let oldIndex = index;
                if (/email/.test(theArgs["--strategy"])) {
                    while (
                        (index = justEmails.indexOf(entry.Email, index + 1)) !==
                        -1
                    ) {
                        Object.assign(entry, indexedAndCleanedData[index]);
                        indexedAndCleanedData[index].delete = true;
                    }
                }

                index = oldIndex;
                if (/phone/.test(theArgs["--strategy"])) {
                    while (
                        (index = justPhones.indexOf(entry.Phone, index + 1)) !==
                        -1
                    ) {
                        Object.assign(entry, indexedAndCleanedData[index]);
                        indexedAndCleanedData[index].delete = true;
                    }
                }
                if (!entry.delete) {
                    newArr.push(entry);
                }
                return newArr;
            },
            []
        );

        const dedupedCsv = await json_export(dedupedData);

        await fs.promises.writeFile(
            `${path.dirname(theArgs["--input"])}/__DEDUPED__${path.basename(
                theArgs["--input"]
            )}`,
            dedupedCsv
        );

        theResult = dedupedCsv;
    } else {
        console.error(`No input provided.`);
        process.exit(1);
    }

    return theResult;
};

module.exports = theGreatDeduper;
