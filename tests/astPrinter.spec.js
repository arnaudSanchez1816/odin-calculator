const exprs = require("../js/expr");
const token = require("../js/lexer");

describe("AST", () => {
    test("AST print function", () => {
        const expr = new exprs.Binary(
            new exprs.Unary(
                new token.Token(token.TOKEN_TYPES.minus, "-"),
                new exprs.Literal(new token.Token(token.TOKEN_TYPES.number, "123"))
            ),
            new token.Token(token.TOKEN_TYPES.plus, "+"),
            new exprs.Grouping(new exprs.Literal(new token.Token(token.TOKEN_TYPES.number, "45.67")))
        );

        expect(expr.print()).toBe("(+ (- 123) (group 45.67))");
    });
});
