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
            return text.charAt(this.currentCharIndex);
        },
        nextChar : function() {
            if(this.currentCharIndex + 1 >= text.length) {
                return "\0";
            }

            return text.charAt(this.currentCharIndex + 1);
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
        let tokenType = TOKEN_TYPES.unknown;
        const index = lexer.currentCharIndex;
        const char = lexer.currentChar();

        if(isCharNumber(char)){
            tokens.push(getNumberToken(lexer));
            continue;
        }
        else if(SYMBOLS_TOKENS_LOOKUP.get(char)) {
            tokenType = SYMBOLS_TOKENS_LOOKUP.get(char);
        }
        // Modulo special case
        // TODO : Find a better way to handle multiple chars symbols
        else if(char === "m") {
            tokens.push(getModuloToken(lexer));
            continue;
        }
        else if(char === " ") {
            lexer.advance();
            continue;
        }

        if(tokenType !== TOKEN_TYPES.unknown) {
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
    while(isCharNumber(lexer.currentChar())){
        lexer.advance();
    }

    if(lexer.currentChar() === "." && isCharNumber(lexer.nextChar())){
        lexer.advance();
    }
    
    while(isCharNumber(lexer.currentChar())){
        lexer.advance();
    }

    return createToken(TOKEN_TYPES.number, lexer.text.substring(startIndex, lexer.currentCharIndex));
}

function getModuloToken(lexer) {
    const MOD_SYMBOL = "mod";
    let tokenText = "";
    if(lexer.currentCharIndex + 2 >= lexer.text.length) {
        // There is not enough characters left to make a modulo token
        return;
    }

    do {
        tokenText += lexer.currentChar();
        lexer.advance();
    } while(MOD_SYMBOL.startsWith(tokenText) && tokenText.length < MOD_SYMBOL.length);

    if(tokenText === MOD_SYMBOL) {
        return createToken(TOKEN_TYPES.mod, tokenText);
    }

    console.error(`Unknown symbol ${tokenText}`);
    return createToken(TOKEN_TYPES.unknown, tokenText);
}

const TOKEN_TYPES = {
    unknown : "TOKEN_UNKNOWN",
    eof : "TOKEN_EOF",
    number : "TOKEN_NUMBER",
    plus : "TOKEN_PLUS",
    minus : "TOKEN_MINUS",
    divide : "TOKEN_DIVIDE",
    multiply : "TOKEN_MULTIPLY",
    sqrt : "TOKEN_SQRT",
    exponent : "TOKEN_EXPONENT",
    mod : "TOKEN_MODULO",
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

module.exports = tokenize;