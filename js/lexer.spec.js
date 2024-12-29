const tokenize = require("./lexer");

describe("tokenize", () => {
    test("1 + 1", () => {
        const tokens = [
            {tokenType : "TOKEN_NUMBER", text : "1"},
            {tokenType : "TOKEN_PLUS", text : "+"},
            {tokenType : "TOKEN_NUMBER", text : "1"},
            {tokenType : "TOKEN_EOF", text : ""}
        ];
        expect(tokenize("1 + 1").toBe(tokens));
    });
});