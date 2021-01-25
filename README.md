# The Great Deduper

A tool to merge duplicate records inside of CSVs using easily configurable 'strategies'.

To run it, simply install dependencies:

```
yarn
```

Then call the script with an input csv and strategy:

```
node index.js --input=FOO.csv --strategy=email_or_phone
```

A new csv will be created under [`output`](./output) with a prefixed name, for example:

```
output/__DEDUPED__email_or_phone__FOO.csv
```

### Available strategies:
- email
- phone
- email_or_phone

Optionally, you can pass an `output-directory`, to use something besides [`output`](./output).

```
node index.js --input=FOO.csv --strategy=email_or_phone --output-directory=BARBAZ
```

---

## One click setup

Choose either of these to run the entire thing with testing right in your browser!

[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/ryanpcmcquen/the_great_deduper)

[![Run on Repl.it](https://repl.it/badge/github/ryanpcmcquen/the_great_deduper)](https://repl.it/github/ryanpcmcquen/the_great_deduper)

---

To run the built in tests, do:

```
yarn test
```

---

To add additional deduping/merging strategies, extend the `strategies` prop inside of [`source/strategizer.js`](./source/strategizer.js). Schema is as follows:

```
{
    STRATEGY_COLUMN_NAME: REGEX_TO_CLEAN_DATA_BY
}
```

If no cleaning of the data is required, simply pass `null` as the 'regex' value.
