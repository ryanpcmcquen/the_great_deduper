const test = require("tape");
const the_great_deduper = require("../source/the_great_deduper");

const default_args = [
    "--input=tests/sample.csv",
    "--output-directory=tests/output",
];

test("Test that email deduping works.", async (t) => {
    const result = await the_great_deduper(
        default_args.concat(["--strategy=email"])
    );

    t.equal(
        result,
        `FirstName,LastName,Email,Phone,id
Foo,Bars,foo@bar.baz,,2
Baz,,baz@z.inc,,1
Foof,Bar,foof@bar.baz,1235555555,3
Guy,Threepwood,guy@monkey.island,1215555555,4
Guy,Threeepwood,,1215555555,5`
    );
});

test("Test that phone deduping works.", async (t) => {
    const result = await the_great_deduper(
        default_args.concat(["--strategy=phone"])
    );

    t.equal(
        result,
        `FirstName,LastName,Email,Phone,id
Foof,Bar,foof@bar.baz,1235555555,3
Foo,Bars,foo@bar.baz,,2
Guy,Threeepwood,,1215555555,5`
    );
});

test("Test that email_or_phone deduping works.", async (t) => {
    const result = await the_great_deduper(
        default_args.concat(["--strategy=email_or_phone"])
    );

    t.equal(
        result,
        `FirstName,LastName,Email,Phone,id
Foof,Bar,foof@bar.baz,1235555555,3
Guy,Threeepwood,,1215555555,5`
    );
});

test("Test that an invalid argument throws an error.", async (t) => {
    try {
        await the_great_deduper(["--input"]);
    } catch (err) {
        t.match(err.message, /Invalid command line argument passed/);
    }
});
