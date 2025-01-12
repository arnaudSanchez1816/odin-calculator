const Parser = require("./parser");
const token = require("./lexer");

describe("Parser", () => {
    test("1+1", () => {
        const input = "1 + 1";
        const tokens = token.tokenize(input);

        const parser = new Parser();
        const expr = parser.parseTokens(tokens);
        expect(expr.print()).toBe("(+ 1 1)");
    });

    test("0+0", () => {
        const input = "0 + 0";
        const tokens = token.tokenize(input);

        const parser = new Parser();
        const expr = parser.parseTokens(tokens);
        expect(expr.print()).toBe("(+ 0 0)");
    });

    test("+1-2", () => {
        const input = "+1-2";
        const tokens = token.tokenize(input);

        const parser = new Parser();
        const expr = parser.parseTokens(tokens);
        expect(expr.print()).toBe("(- 1 2)")
    });

    test("50*10-20/6", () => {
        const input = "50*10-20/6";
        const tokens = token.tokenize(input);

        const parser = new Parser();
        const expr = parser.parseTokens(tokens);
        expect(expr.print()).toBe("(- (* 50 10) (/ 20 6))");
    });

    test("1#(5-2)", () => {
        const input = "1#(5-2)";
        const tokens = token.tokenize(input);

        const parser = new Parser();
        const expr = parser.parseTokens(tokens);
        expect(expr.print()).toBe("(* 1 (# (group (- 5 2))))");
    });

    test("50mod0", () => {
        const input = "50mod0";
        const tokens = token.tokenize(input);

        const parser = new Parser();
        const expr = parser.parseTokens(tokens);
        expect(expr.print()).toBe("(mod 50 0)");
    });

    test("Chained square roots", () => {
        const input = "#2";
        const tokens = token.tokenize(input);

        const parser = new Parser();
        const expr = parser.parseTokens(tokens);
        expect(expr.print()).toBe("(# 2)");

        const tokens2 = token.tokenize("####10");
        expect(parser.parseTokens(tokens2).print()).toBe("(# (# (# (# 10))))");

        const tokens3 = token.tokenize("1##10##5");
        expect(parser.parseTokens(tokens3).print()).toBe("(* (* 1 (# (# 10))) (# (# 5)))");
    });

    test("Every operators", () => {
        const parser = new Parser();

        const add = token.tokenize("1+1");
        expect(parser.parseTokens(add).print()).toBe("(+ 1 1)");

        const subtract = token.tokenize("1-1");
        expect(parser.parseTokens(subtract).print()).toBe("(- 1 1)");

        const multiply = token.tokenize("1*1");
        expect(parser.parseTokens(multiply).print()).toBe("(* 1 1)");

        const divide = token.tokenize("1/1");
        expect(parser.parseTokens(divide).print()).toBe("(/ 1 1)");

        const pow = token.tokenize("1^1");
        expect(parser.parseTokens(pow).print()).toBe("(^ 1 1)");

        const mod = token.tokenize("1mod1");
        expect(parser.parseTokens(mod).print()).toBe("(mod 1 1)");

        const sqrt = token.tokenize("#1");
        expect(parser.parseTokens(sqrt).print()).toBe("(# 1)");
    });

    test("Literals", () => {
        const parser = new Parser();

        const literal = token.tokenize("1");
        expect(parser.parseTokens(literal).print()).toBe("1");

        const literal2 = token.tokenize("+1");
        expect(parser.parseTokens(literal2).print()).toBe("1");

        const literal3 = token.tokenize("+++1");
        const func = function() { parser.parseTokens(literal3)};
        expect(func).toThrow();
    });

    test("Groupings", () => {
        const parser = new Parser();

        const grouping = token.tokenize("(1)");
        expect(parser.parseTokens(grouping).print()).toBe("(group 1)");

        const grouping2 = token.tokenize("(((5)))");
        expect(parser.parseTokens(grouping2).print()).toBe("(group (group (group 5)))");

        const grouping3 = token.tokenize("(5");
        const funcGrouping3 = function() { parser.parseTokens(grouping3)};
        expect(funcGrouping3).toThrow();

        const grouping4 = token.tokenize("5)");
        const funcGrouping4 = function() { parser.parseTokens(grouping4)};
        expect(funcGrouping4).toThrow();

        const grouping5 = token.tokenize("((5)");
        const funcGrouping5 = function() { parser.parseTokens(grouping5)};
        expect(funcGrouping5).toThrow();
    });

    test("Unary", () => {
        const parser = new Parser();

        const unary = token.tokenize("-5");
        expect(parser.parseTokens(unary).print()).toBe("(- 5)");

        const unary2 = token.tokenize("#5");
        expect(parser.parseTokens(unary2).print()).toBe("(# 5)");

        const unary3 = token.tokenize("---5");
        expect(parser.parseTokens(unary3).print()).toBe("(- (- (- 5)))");

        const unary4 = token.tokenize("###5");
        expect(parser.parseTokens(unary4).print()).toBe("(# (# (# 5)))");

        const unary5 = token.tokenize("-#-#-#5");
        expect(parser.parseTokens(unary5).print()).toBe("(- (# (- (# (- (# 5))))))");
    });

    test("Priorities", () => {
        const parser = new Parser();

        const priority = token.tokenize("1+2*3^4");
        expect(parser.parseTokens(priority).print()).toBe("(+ 1 (* 2 (^ 3 4)))");
    });

    test("Implicit multiplication", () => {
        const parser = new Parser();

        const tokens = token.tokenize("2(5)");
        expect(parser.parseTokens(tokens).print()).toBe("(* 2 (group 5))");

        const tokensSqrt = token.tokenize("50.5#10.1");
        expect(parser.parseTokens(tokensSqrt).print()).toBe("(* 50.5 (# 10.1))");

        const tokensSqrt2 = token.tokenize("1#(#63636)");
        expect(parser.parseTokens(tokensSqrt2).print()).toBe("(* 1 (# (group (# 63636))))");
    });

    test("Postfix", () => {
        const parser = new Parser();

        const tokens = token.tokenize("5%");
        expect(parser.parseTokens(tokens).print()).toBe("(5 %)");

        const tokens2 = token.tokenize("-5%");
        expect(parser.parseTokens(tokens2).print()).toBe("(- (5 %))");
    });
});