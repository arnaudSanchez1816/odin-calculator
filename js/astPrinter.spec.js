const AstPrinter = require("./astPrinter");
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
