const test = require("tape");
const main = require("../source/the_great_deduper");

test("Test that email deduping works.", async (t) => {
    const result = await main(["--input=tests/sample.csv", "--strategy=email"]);
    console.log(result);
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
