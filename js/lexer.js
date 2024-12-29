function createToken(tokenType, text) {
    return {
        tokenType,
        text
    };
}

function tokenize(text) {
    const lexer = {
        text,
        currentCharIndex : 0,
        currentChar : function() {
            return text.chartAt(this.currentCharIndex);
        },
        advance : function() {
            this.currentCharIndex +=1;
            if(this.currentCharIndex > text.length) {
                this.currentCharIndex = text.length;
            }
        }
    };

    const tokens = [];
    console.assert(typeof text === "string");

    while(lexer.currentCharIndex < lexer.text.length) {
        const tokenType = TOKEN_TYPES.unknown;
        const char = lexer.currentChar();

        if(isCharNumber(char) || char === "."){
            tokens.push(getNumberToken(lexer));
            continue;
        }
        else if(SYMBOLS_TOKENS_LOOKUP[char]) {
            tokenType = SYMBOLS_TOKENS_LOOKUP[char];
        }
        else if(char == " ") {
            lexer.advance();
            continue;
        }

        if(tokenType !== TOKEN_TYPES.unknown) {
            // We found a valid token
            tokens.push(createToken(tokenType, char));
        }
        else {
            console.error(`Unknown symbol ${char}`);
        }
        lexer.advance();
    }

    tokens.push(createToken(TOKEN_TYPES.eof, ""));
    return tokens;
}

function getNumberToken(lexer) {
    let number = "";
    while(isCharNumber(lexer.currentChar()) || char === ".") {
        number += lexer.currentChar();
        lexer.advance();
    }
    return createToken(TOKEN_TYPES.number, number); 
}

const TOKEN_TYPES = {
    unknown : null,
    eof : "TOKEN_EOF",
    plus : "TOKEN_PLUS",
    minus : "TOKEN_MINUS",
    divide : "TOKEN_DIVIDE",
    multiply : "TOKEN_MULTIPLY",
    sqrt : "TOKEN_SQRT",
    exponent : "TOKEN_EXPONENT",
    mod : "TOKEN_MOD",
    percent : "TOKEN_PERCENT",
    brace_left : "TOKEN_BRACE_LEFT",
    brace_right : "TOKEN_BRACE_RIGHT"
};

const SYMBOLS_TOKENS_LOOKUP = new Map([
    ["+", TOKEN_TYPES.plus],
    ["-", TOKEN_TYPES.minus],
    ["\u00F7", TOKEN_TYPES.divide],
    ["\u00D7", TOKEN_TYPES.multiply],
    ["\u221A", TOKEN_TYPES.sqrt],
    ["^", TOKEN_TYPES.exponent],
    ["mod", TOKEN_TYPES.mod],
    ["%", TOKEN_TYPES.percent],
    ["(", TOKEN_TYPES.brace_left],
    [")", TOKEN_TYPES.brace_right]
]);

function isCharNumber(c) {
    return c >= '0' && c <= '9';
}

module.exports = tokenize;