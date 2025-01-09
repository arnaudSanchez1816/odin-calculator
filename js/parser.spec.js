const AstPrinter = require("./astPrinter");
const Parser = require("./parser");
const exprs = require("./expr");
const token = require("./lexer");

describe("AST", () => {
    test("Print AST visitor pattern", () => {
        const expr = new exprs.Binary(
            new exprs.Unary(
                new token.Token(token.TOKEN_TYPES.minus, "-"),
                new exprs.Literal(123)
            ),
            new token.Token(token.TOKEN_TYPES.plus, "+"),
            new exprs.Grouping(new exprs.Literal(45.67))
        );
        const ast = new AstPrinter();
        expect(ast.printToString(expr)).toBe("(+ (- 123) (group 45.67))");
    });
    test("Print AST print function", () => {
        const expr = new exprs.Binary(
            new exprs.Unary(
                new token.Token(token.TOKEN_TYPES.minus, "-"),
                new exprs.Literal(123)
            ),
            new token.Token(token.TOKEN_TYPES.plus, "+"),
            new exprs.Grouping(new exprs.Literal(45.67))
        );

        expect(expr.print()).toBe("(+ (- 123) (group 45.67))");
    });

    test("RPN", () => {
        const expr = new exprs.Binary(
            new exprs.Grouping(
                new exprs.Binary(
                    new exprs.Literal(1),
                    new token.Token(token.TOKEN_TYPES.plus, "+"),
                    new exprs.Literal(2)
                )
            ),
            new token.Token(token.TOKEN_TYPES.multiply, "*"),
            new exprs.Grouping(
                new exprs.Binary(
                    new exprs.Literal(4),
                    new token.Token(token.TOKEN_TYPES.minus, "-"),
                    new exprs.Literal(3)
                )
            )
        );
        expect(expr.rpn()).toBe("1 2 + 4 3 - *");
    });
});

describe("Parser", () => {
    test("1+1", () => {
        const input = "1 + 1";
        const tokens = token.tokenize(input);

        const parser = new Parser();
        const expr = parser.parse(tokens);
        expect(expr.print()).toBe("(+ 1 1)");
    });

    test("+1-2", () => {
        const input = "+1-2";
        const tokens = token.tokenize(input);

        const parser = new Parser();
        const expr = parser.parse(tokens);
        expect(expr.print()).toBe("(- 1 2)")
    });

    test("50*10-20/6", () => {
        const input = "50*10-20/6";
        const tokens = token.tokenize(input);

        const parser = new Parser();
        const expr = parser.parse(tokens);
        expect(expr.print()).toBe("(- (* 50 10) (/ 20 6))");
    });

    test("1#(5-2)", () => {
        const input = "1#(5-2)";
        const tokens = token.tokenize(input);

        const parser = new Parser();
        const expr = parser.parse(tokens);
        expect(expr.print()).toBe("(# 1 (group (- 5 2)))");
    });

    test("Chained square roots", () => {
        const input = "#2";
        const tokens = token.tokenize(input);

        const parser = new Parser();
        const expr = parser.parse(tokens);
        expect(expr.print()).toBe("(# 2)");

        const tokens2 = token.tokenize("####10");
        expect(parser.parse(tokens2).print()).toBe("(# (# (# (# 10))))");

        const tokens3 = token.tokenize("1##10##5");
        expect(parser.parse(tokens3).print()).toBe("(# (# 1 (# 10)) (# 5))");
    });

    test("Every operators", () => {
        const parser = new Parser();

        const add = token.tokenize("1+1");
        expect(parser.parse(add).print()).toBe("(+ 1 1)");

        const subtract = token.tokenize("1-1");
        expect(parser.parse(subtract).print()).toBe("(- 1 1)");

        const multiply = token.tokenize("1*1");
        expect(parser.parse(multiply).print()).toBe("(* 1 1)");

        const divide = token.tokenize("1/1");
        expect(parser.parse(divide).print()).toBe("(/ 1 1)");

        const pow = token.tokenize("1^1");
        expect(parser.parse(pow).print()).toBe("(^ 1 1)");

        const mod = token.tokenize("1mod1");
        expect(parser.parse(mod).print()).toBe("(mod 1 1)");

        const sqrt = token.tokenize("1#1");
        expect(parser.parse(sqrt).print()).toBe("(# 1 1)");
    });

    test("Literals", () => {
        const parser = new Parser();

        const literal = token.tokenize("1");
        expect(parser.parse(literal).print()).toBe("1");

        const literal2 = token.tokenize("+1");
        expect(parser.parse(literal2).print()).toBe("1");

        const literal3 = token.tokenize("+++1");
        expect(parser.parse(literal3)).toBe(undefined);
    });

    test("Groupings", () => {
        const parser = new Parser();

        const grouping = token.tokenize("(1)");
        expect(parser.parse(grouping).print()).toBe("(group 1)");

        const grouping2 = token.tokenize("(((5)))");
        expect(parser.parse(grouping2).print()).toBe("(group (group (group 5)))");

        const grouping3 = token.tokenize("(5");
        expect(parser.parse(grouping3)).toBe(undefined);

        const grouping4 = token.tokenize("5)");
        expect(parser.parse(grouping4)).toBe(undefined);

        const grouping5 = token.tokenize("((5)");
        expect(parser.parse(grouping5)).toBe(undefined);
    });

    test("Unary", () => {
        const parser = new Parser();

        const unary = token.tokenize("-5");
        expect(parser.parse(unary).print()).toBe("(- 5)");

        const unary2 = token.tokenize("#5");
        expect(parser.parse(unary2).print()).toBe("(# 5)");

        const unary3 = token.tokenize("---5");
        expect(parser.parse(unary3).print()).toBe("(- (- (- 5)))");

        const unary4 = token.tokenize("###5");
        expect(parser.parse(unary4).print()).toBe("(# (# (# 5)))");

        const unary5 = token.tokenize("-#-#-#5");
        expect(parser.parse(unary5).print()).toBe("(- (# (- (# (- (# 5))))))");
    });

    test("Priorities", () => {
        const parser = new Parser();

        const priority = token.tokenize("1+2*3^4");
        expect(parser.parse(priority).print()).toBe("(+ 1 (* 2 (^ 3 4)))");
    });
});