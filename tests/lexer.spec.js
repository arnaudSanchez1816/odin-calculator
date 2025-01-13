const token = require("../js/lexer");

describe("tokenize", () => {
    const test0Exp = "0 + 0";
    test(test0Exp, () => {
        const tokens = [
            new token.Token(token.TOKEN_TYPES.number, "0"),
            new token.Token(token.TOKEN_TYPES.plus, "+"),
            new token.Token(token.TOKEN_TYPES.number, "0"),
            new token.Token(token.TOKEN_TYPES.eof, ""),
        ];
        expect(token.tokenize(test0Exp)).toEqual(tokens);
    });
    const test1Exp = "1 + 1";
    test(test1Exp, () => {
        const tokens = [
            new token.Token(token.TOKEN_TYPES.number, "1"),
            new token.Token(token.TOKEN_TYPES.plus, "+"),
            new token.Token(token.TOKEN_TYPES.number, "1"),
            new token.Token(token.TOKEN_TYPES.eof, ""),
        ];
        expect(token.tokenize(test1Exp)).toEqual(tokens);
    });
    const test2Exp = "1 + 12.1 \u00D7 (5\u00F7(9-1))";
    test(test2Exp, () => {
        const tokens = [
            new token.Token(token.TOKEN_TYPES.number, "1"),
            new token.Token(token.TOKEN_TYPES.plus, "+"),
            new token.Token(token.TOKEN_TYPES.number, "12.1"),
            new token.Token(token.TOKEN_TYPES.multiply, "\u00D7"),
            new token.Token(token.TOKEN_TYPES.brace_left, "("),
            new token.Token(token.TOKEN_TYPES.number, "5"),
            new token.Token(token.TOKEN_TYPES.divide, "\u00F7"),
            new token.Token(token.TOKEN_TYPES.brace_left, "("),
            new token.Token(token.TOKEN_TYPES.number, "9"),
            new token.Token(token.TOKEN_TYPES.minus, "-"),
            new token.Token(token.TOKEN_TYPES.number, "1"),
            new token.Token(token.TOKEN_TYPES.brace_right, ")"),
            new token.Token(token.TOKEN_TYPES.brace_right, ")"),
            new token.Token(token.TOKEN_TYPES.eof, ""),
        ];
        expect(token.tokenize(test2Exp)).toEqual(tokens);
    });
    test("Modulo token", () => {
        const tokens = [
            new token.Token(token.TOKEN_TYPES.mod, "mod"),
            new token.Token(token.TOKEN_TYPES.unknown, "me"),
            new token.Token(token.TOKEN_TYPES.unknown, "d"),
            new token.Token(token.TOKEN_TYPES.unknown, "mol"),
            new token.Token(token.TOKEN_TYPES.unknown, "d"),
            new token.Token(token.TOKEN_TYPES.eof, ""),
        ];
        expect(token.tokenize("modmedmold")).toEqual(tokens);
    });
    const allNumbersExp = "123456789987654321 + 00000123";
    test(allNumbersExp, () => {
        const tokens = [
            new token.Token(token.TOKEN_TYPES.number, "123456789987654321"),
            new token.Token(token.TOKEN_TYPES.plus, "+"),
            new token.Token(token.TOKEN_TYPES.number, "00000123"),
            new token.Token(token.TOKEN_TYPES.eof, ""),
        ];
        expect(token.tokenize(allNumbersExp)).toEqual(tokens);
    });

    test("Decimal numbers", () => {
        expect(token.tokenize("12.56")).toEqual([
            new token.Token(token.TOKEN_TYPES.number, "12.56"),
            new token.Token(token.TOKEN_TYPES.eof, ""),
        ]);
        expect(token.tokenize(".5")).toEqual([
            new token.Token(token.TOKEN_TYPES.unknown, "."),
            new token.Token(token.TOKEN_TYPES.number, "5"),
            new token.Token(token.TOKEN_TYPES.eof, ""),
        ]);
        expect(token.tokenize("1...5")).toEqual([
            new token.Token(token.TOKEN_TYPES.number, "1"),
            new token.Token(token.TOKEN_TYPES.unknown, "."),
            new token.Token(token.TOKEN_TYPES.unknown, "."),
            new token.Token(token.TOKEN_TYPES.unknown, "."),
            new token.Token(token.TOKEN_TYPES.number, "5"),
            new token.Token(token.TOKEN_TYPES.eof, ""),
        ]);
    });

    test("Implicit multiplication", () => {
        expect(token.tokenize("5(5)")).toEqual([
            new token.Token(token.TOKEN_TYPES.number, "5"),
            new token.Token(token.TOKEN_TYPES.multiply, "*"),
            new token.Token(token.TOKEN_TYPES.brace_left, "("),
            new token.Token(token.TOKEN_TYPES.number, "5"),
            new token.Token(token.TOKEN_TYPES.brace_right, ")"),
            new token.Token(token.TOKEN_TYPES.eof, ""),
        ]);

        expect(token.tokenize("2#2")).toEqual([
            new token.Token(token.TOKEN_TYPES.number, "2"),
            new token.Token(token.TOKEN_TYPES.multiply, "*"),
            new token.Token(token.TOKEN_TYPES.sqrt, "#"),
            new token.Token(token.TOKEN_TYPES.number, "2"),
            new token.Token(token.TOKEN_TYPES.eof, ""),
        ]);

        expect(token.tokenize("22(6)")).toEqual([
            new token.Token(token.TOKEN_TYPES.number, "22"),
            new token.Token(token.TOKEN_TYPES.multiply, "*"),
            new token.Token(token.TOKEN_TYPES.brace_left, "("),
            new token.Token(token.TOKEN_TYPES.number, "6"),
            new token.Token(token.TOKEN_TYPES.brace_right, ")"),
            new token.Token(token.TOKEN_TYPES.eof, ""),
        ]);
    });

    test("Every tokens", () => {
        expect(token.tokenize("1+-\u00D7*\u00F7/^\u221A#mod%()")).toEqual([
            new token.Token(token.TOKEN_TYPES.number, "1"),
            new token.Token(token.TOKEN_TYPES.plus, "+"),
            new token.Token(token.TOKEN_TYPES.minus, "-"),
            new token.Token(token.TOKEN_TYPES.multiply, "\u00D7"),
            new token.Token(token.TOKEN_TYPES.multiply, "*"),
            new token.Token(token.TOKEN_TYPES.divide, "\u00F7"),
            new token.Token(token.TOKEN_TYPES.divide, "/"),
            new token.Token(token.TOKEN_TYPES.exponent, "^"),
            new token.Token(token.TOKEN_TYPES.sqrt, "\u221A"),
            new token.Token(token.TOKEN_TYPES.sqrt, "#"),
            new token.Token(token.TOKEN_TYPES.mod, "mod"),
            new token.Token(token.TOKEN_TYPES.percent, "%"),
            new token.Token(token.TOKEN_TYPES.brace_left, "("),
            new token.Token(token.TOKEN_TYPES.brace_right, ")"),
            new token.Token(token.TOKEN_TYPES.eof, "")
        ]);
    });

    test("123.", () => {
        const tokens = [
            new token.Token(token.TOKEN_TYPES.number, "123"),
            new token.Token(token.TOKEN_TYPES.unknown, "."),
            new token.Token(token.TOKEN_TYPES.eof, ""),
        ];
        expect(token.tokenize("123.")).toEqual(tokens);
    });
});