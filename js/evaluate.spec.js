const Parser = require("./parser");

// TODO : fix duplication 
describe("Expressions evaluations", () => {
    test("1+1 = 2", () => {
        const parser = new Parser();
        const expression = parser.parseString("1+1");

        expect(expression.evaluate()).toBe(2);
    });

    test("1+0 = 1", () => {
        const parser = new Parser();
        const expression = parser.parseString("1+0");

        expect(expression.evaluate()).toBe(1);
    });

    test("0+0 = 0", () => {
        const parser = new Parser();
        const expression = parser.parseString("0+0");

        expect(expression.evaluate()).toBe(0);
    });

    test("10.5+4.5 = 15", () => {
        const parser = new Parser();
        const expression = parser.parseString("10.5+4.5");

        expect(expression.evaluate()).toBe(15);
    });

    test("1+-50 = -49", () => {
        const parser = new Parser();
        const expression = parser.parseString("1+-50");

        expect(expression.evaluate()).toBe(-49);
    });

    test("5-2 = 3", () => {
        const parser = new Parser();
        const expression = parser.parseString("5-2");

        expect(expression.evaluate()).toBe(3);
    });

    test("5-10 = -5", () => {
        const parser = new Parser();
        const expression = parser.parseString("5-10");

        expect(expression.evaluate()).toBe(-5);
    });

    test("5-5 = 0", () => {
        const parser = new Parser();
        const expression = parser.parseString("5-5");

        expect(expression.evaluate()).toBe(0);
    });

    test("2*3 = 6", () => {
        const parser = new Parser();
        const expression = parser.parseString("2*3");

        expect(expression.evaluate()).toBe(6);
    });

    test("6/3 = 2", () => {
        const parser = new Parser();
        const expression = parser.parseString("6/3");

        expect(expression.evaluate()).toBe(2);
    });

    test("6/12 = 0.5", () => {
        const parser = new Parser();
        const expression = parser.parseString("6/12");

        expect(expression.evaluate()).toBe(0.5);
    });

    test("20 / 0 Exception", () => {
        const parser = new Parser();
        const expression = parser.parseString("20/0");
        const evaluateFunc = function() {
            return expression.evaluate();
        }

        expect(evaluateFunc).toThrow("Division by zero is undefined");
    });

    test("1 mod 2 = 1", () => {
        const parser = new Parser();
        const expression = parser.parseString("1mod2");

        expect(expression.evaluate()).toBe(1);
    });

    test("2 mod 2 = 0", () => {
        const parser = new Parser();
        const expression = parser.parseString("2mod2");

        expect(expression.evaluate()).toBe(0);
    });

    test("0 mod 2 = 0", () => {
        const parser = new Parser();
        const expression = parser.parseString("0mod2");

        expect(expression.evaluate()).toBe(0);
    });

    test("50 mod 0 Exception", () => {
        const parser = new Parser();
        const expression = parser.parseString("50mod0");
        const evaluateFunc = function() {
            return expression.evaluate();
        }

        expect(evaluateFunc).toThrow("Division by zero is undefined");
    });

    test("2^2 = 4", () => {
        const parser = new Parser();
        const expression = parser.parseString("2^2");

        expect(expression.evaluate()).toBe(4);
    });

    test("2^3 = 8", () => {
        const parser = new Parser();
        const expression = parser.parseString("2^3");

        expect(expression.evaluate()).toBe(8);
    });

    test("0^3 = 0", () => {
        const parser = new Parser();
        const expression = parser.parseString("0^3");

        expect(expression.evaluate()).toBe(0);
    });

    test("0^0 = 1", () => {
        const parser = new Parser();
        const expression = parser.parseString("0^0");

        expect(expression.evaluate()).toBe(1);
    });

    test("#4 = 2", () => {
        const parser = new Parser();
        const expression = parser.parseString("#4");

        expect(expression.evaluate()).toBe(2);
    });

    test("#2 = 1.414", () => {
        const parser = new Parser();
        const expression = parser.parseString("#2");

        expect(+(expression.evaluate().toFixed(3))).toBe(1.414);
    });

    test("#-1 Exception", () => {
        const parser = new Parser();
        const expression = parser.parseString("#-1");
        const evaluateFunc = function() {
            return expression.evaluate();
        }

        expect(evaluateFunc).toThrow("Imaginary numbers unsupported");
    });

    test("10*(1+9) = 100", () => evaluateInput("10*(1+9)", 100));
    test("10(1+9) = 100", () => evaluateInput("10(1+9)", 100));
    test("1+10*100/10 = 101", () => evaluateInput("1+10*100/10", 101));
    test("2#4 = 4", () => evaluateInput("2#4", 4));
    test("(1+4)(10-5) = 25", () => evaluateInput("(1+4)(10-5)", 25));
});

function evaluateInput(input, expectedValue) {
    const parser = new Parser();
    const expression = parser.parseString(input);

    expect(expression.evaluate()).toBe(expectedValue);
}