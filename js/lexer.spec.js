const tokenize = require("./lexer");

describe("tokenize", () => {
    const test1Exp = "1 + 1";
    test(test1Exp, () => {
        const tokens = [
            {tokenType : "TOKEN_NUMBER", text : "1"},
            {tokenType : "TOKEN_PLUS", text : "+"},
            {tokenType : "TOKEN_NUMBER", text : "1"},
            {tokenType : "TOKEN_EOF", text : ""}
        ];
        expect(tokenize(test1Exp)).toEqual(tokens);
    });
    const test2Exp = "1 + 12.1 \u00D7 (5\u00F7(9-1))";
    test(test2Exp, () => {
        const tokens = [
            {tokenType : "TOKEN_NUMBER", text : "1"},
            {tokenType : "TOKEN_PLUS", text : "+"},
            {tokenType : "TOKEN_NUMBER", text : "12.1"},
            {tokenType : "TOKEN_MULTIPLY", text : "\u00D7"},
            {tokenType : "TOKEN_BRACE_LEFT", text : "("},
            {tokenType : "TOKEN_NUMBER", text : "5"},
            {tokenType : "TOKEN_DIVIDE", text : "\u00F7"},
            {tokenType : "TOKEN_BRACE_LEFT", text : "("},
            {tokenType : "TOKEN_NUMBER", text : "9"},
            {tokenType : "TOKEN_MINUS", text : "-"},
            {tokenType : "TOKEN_NUMBER", text : "1"},
            {tokenType : "TOKEN_BRACE_RIGHT", text : ")"},
            {tokenType : "TOKEN_BRACE_RIGHT", text : ")"},
            {tokenType : "TOKEN_EOF", text : ""}
        ];
        expect(tokenize(test2Exp)).toEqual(tokens);
    });
    const everySymbolsExp = "+-\u00D7\u00F7\u221A^mod%()";
    test(everySymbolsExp, () => {
        const tokens = [
            {tokenType : "TOKEN_PLUS", text : "+"},
            {tokenType : "TOKEN_MINUS", text : "-"},
            {tokenType : "TOKEN_MULTIPLY", text : "\u00D7"},
            {tokenType : "TOKEN_DIVIDE", text : "\u00F7"},
            {tokenType : "TOKEN_SQRT", text : "\u221A"},
            {tokenType : "TOKEN_EXPONENT", text : "^"},
            {tokenType : "TOKEN_MODULO", text : "mod"},
            {tokenType : "TOKEN_PERCENT", text : "%"},
            {tokenType : "TOKEN_BRACE_LEFT", text : "("},
            {tokenType : "TOKEN_BRACE_RIGHT", text : ")"},
            {tokenType : "TOKEN_EOF", text : ""},
        ];
        expect(tokenize(everySymbolsExp)).toEqual(tokens);
    });
});