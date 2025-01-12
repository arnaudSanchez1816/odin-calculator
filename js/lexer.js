/**
 * Create a token of the given type.
 * @param {TokenType} tokenType - the token type of the token
 * @param {string} text - text of the token
 * @returns {Token}
 */
function createToken(tokenType, text) {
    return new Token(tokenType, text);
}

class Token {
    constructor(tokenType, text) {
        this.tokenType = tokenType;
        this.text = text;
        this.binary = tokenType.binary;
        this.unary = tokenType.unary;
        this.postfix = tokenType.postfix;
    }
}

function tokenize(text) {
    const lexer = {
        text,
        currentCharIndex: 0,
        currentChar: function () {
            return text.charAt(this.currentCharIndex);
        },
        nextChar: function () {
            if (this.currentCharIndex + 1 >= text.length) {
                return "\0";
            }

            return text.charAt(this.currentCharIndex + 1);
        },
        advance: function () {
            this.currentCharIndex += 1;
            if (this.currentCharIndex > text.length) {
                this.currentCharIndex = text.length;
            }
        }
    };

    const tokens = [];
    console.assert(typeof text === "string");

    while (lexer.currentCharIndex < lexer.text.length) {
        let tokenType = TOKEN_TYPES.unknown;
        const index = lexer.currentCharIndex;
        const char = lexer.currentChar();
        const lastToken = tokens.slice(-1)[0];
        let tryInsertImplicitMultiply = false;
        if (lastToken) {
            tryInsertImplicitMultiply = lastToken.tokenType === TOKEN_TYPES.number
                || lastToken.tokenType === TOKEN_TYPES.brace_right;
        }

        if (isCharNumber(char)) {
            tokens.push(getNumberToken(lexer));
            continue;
        }
        else if (SYMBOLS_TOKENS_LOOKUP.get(char)) {
            tokenType = SYMBOLS_TOKENS_LOOKUP.get(char);

            if (tryInsertImplicitMultiply &&
                (tokenType === TOKEN_TYPES.brace_left || tokenType === TOKEN_TYPES.sqrt)) {
                // Insert an implicit multiply token
                tokens.push(createToken(TOKEN_TYPES.multiply, "*"));
            }
        }
        // Modulo special case
        // TODO : Find a better way to handle multiple chars symbols
        else if (char === "m") {
            tokens.push(getModuloToken(lexer));
            continue;
        }
        else if (char === " ") {
            lexer.advance();
            continue;
        }

        if (tokenType !== TOKEN_TYPES.unknown) {
            // We found a valid token
            tokens.push(createToken(tokenType, char));
        }
        else {
            console.error(`Unknown symbol ${char}`);
            tokens.push(createToken(tokenType, char));
        }
        lexer.advance();
    }

    tokens.push(createToken(TOKEN_TYPES.eof, ""));
    return tokens;
}

function isCharNumber(c) {
    return c >= '0' && c <= '9';
}

function getNumberToken(lexer) {
    const startIndex = lexer.currentCharIndex;
    while (isCharNumber(lexer.currentChar())) {
        lexer.advance();
    }

    if (lexer.currentChar() === "." && isCharNumber(lexer.nextChar())) {
        lexer.advance();
    }

    while (isCharNumber(lexer.currentChar())) {
        lexer.advance();
    }

    return createToken(TOKEN_TYPES.number, lexer.text.substring(startIndex, lexer.currentCharIndex));
}

function getModuloToken(lexer) {
    const MOD_SYMBOL = "mod";
    let tokenText = "";
    if (lexer.currentCharIndex + 2 >= lexer.text.length) {
        // There is not enough characters left to make a modulo token
        return;
    }

    do {
        tokenText += lexer.currentChar();
        lexer.advance();
    } while (MOD_SYMBOL.startsWith(tokenText) && tokenText.length < MOD_SYMBOL.length);

    if (tokenText === MOD_SYMBOL) {
        return createToken(TOKEN_TYPES.mod, tokenText);
    }

    console.error(`Unknown symbol ${tokenText}`);
    return createToken(TOKEN_TYPES.unknown, tokenText);
}

const TOKEN_TYPES = {
    unknown: {
        name: "TOKEN_UNKNOWN"
    },
    eof: {
        name: "TOKEN_EOF"
    },
    number: {
        name:
            "TOKEN_NUMBER"
    },
    plus: {
        name: "TOKEN_PLUS",
        binary: function (left, right) {
            return left + right;
        }
    },
    minus: {
        name: "TOKEN_MINUS",
        binary: function (left, right) {
            return left - right;
        },
        unary: function (value) {
            return -value;
        }
    },
    divide: {
        name: "TOKEN_DIVIDE",
        binary: function (left, right) {
            if(right === 0) {
                throw "Division by zero is undefined";
            }

            return left / right;
        }
    },
    multiply: {
        name: "TOKEN_MULTIPLY",
        binary: function (left, right) {
            return left * right;
        }
    },
    sqrt: {
        name: "TOKEN_SQRT",
        unary: function (value) {
            if(value < 0) {
                throw new "Imaginary numbers unsupported";
            }

            return Math.sqrt(value);
        }
    },
    exponent: {
        name: "TOKEN_EXPONENT",
        binary: function (left, right) {
            return left ** right;
        }
    },
    mod: {
        name: "TOKEN_MODULO",
        binary: function (left, right) {
            if(right === 0) {
                throw "Division by zero is undefined";
            }

            return left % right;
        }
    },
    percent: {
        name: "TOKEN_PERCENT",
        postfix: function(left) {
            return left / 100;
        }
    },
    brace_left: {
        name: "TOKEN_BRACE_LEFT"
    },
    brace_right: {
        name: "TOKEN_BRACE_RIGHT"
    }
};

const SYMBOLS_TOKENS_LOOKUP = new Map([
    ["+", TOKEN_TYPES.plus],
    ["-", TOKEN_TYPES.minus],
    ["\u00F7", TOKEN_TYPES.divide],
    ["/", TOKEN_TYPES.divide],
    ["\u00D7", TOKEN_TYPES.multiply],
    ["*", TOKEN_TYPES.multiply],
    ["\u221A", TOKEN_TYPES.sqrt],
    ["#", TOKEN_TYPES.sqrt],
    ["^", TOKEN_TYPES.exponent],
    ["mod", TOKEN_TYPES.mod],
    ["%", TOKEN_TYPES.percent],
    ["(", TOKEN_TYPES.brace_left],
    [")", TOKEN_TYPES.brace_right]
]);

module.exports = {
    tokenize,
    Token,
    TOKEN_TYPES
};