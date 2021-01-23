const test = require("tape");
const main = require("./csv_deduper");

test("test using promises", async (t) => {
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
