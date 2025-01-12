// Grammar
// expression     → term ;
// term           → factor ( ( "-" | "+" ) factor )* ;
// factor         → pow ( ( "*" | "/" ) pow )* ;
// pow            → unary ( ( "^" | "mod" ) unary )* ;
// unary          → ( "-" | "sqrt" ) unary
//                | postfix ;
// postfix        → primary ( "%" )* ;
// primary        → NUMBER | "+" NUMBER | "(" expression ")" ;

// https://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/
// https://github.com/foolnotion/pratt-parser-calculator/tree/main
// https://pest.rs/book/examples/calculator.html

// https://craftinginterpreters.com/parsing-expressions.html#syntax-errors

const tokens = require("./lexer");
const exprs = require("./expr")

class Parser {

    /**
     * Parse the given string to an expression.
     * @param {string} inputString 
     * @returns {Expr} The expression parsed from the input string.
     * @throws {string} When a valid expression cannot be formed.
     */
    parseString(inputString) {
        const inputTokens = tokens.tokenize(inputString);
        return this.parseTokens(inputTokens)
    }

    /**
     * Parse the given array of tokens into an expression.
     * @param {Token[]} tokens - Array of tokens to parse.
     * @returns {Expr} The expression parsed from the tokens array.
     * @throws {string} When a valid expression cannot be formed.
     */
    parseTokens(tokens) {
        this.tokens = tokens;
        this.current = 0;
        const result = this.expression();
        if (this.endReached() === false) {
            throw "Unexpected symbol !";
        }

        return result;
    }

    expression() {
        return this.term();
    }

    term() {
        let expr = this.factor();

        // +, -
        while (this.match(tokens.TOKEN_TYPES.minus, tokens.TOKEN_TYPES.plus)) {
            const operator = this.previous();
            const right = this.factor();
            expr = new exprs.Binary(expr, operator, right);
        }

        return expr;
    }

    factor() {
        let expr = this.pow();

        // *, /
        while (this.match(tokens.TOKEN_TYPES.divide,
            tokens.TOKEN_TYPES.multiply)) {
            const operator = this.previous();
            const right = this.pow();
            expr = new exprs.Binary(expr, operator, right);
        }

        return expr;
    }

    pow() {
        let expr = this.unary();

        // pow, mod
        while (this.match(tokens.TOKEN_TYPES.exponent,
            tokens.TOKEN_TYPES.mod
        )) {
            const operator = this.previous();
            const right = this.unary();
            expr = new exprs.Binary(expr, operator, right);
        }

        return expr;
    }

    unary() {
        // -, sqrt
        if (this.match(tokens.TOKEN_TYPES.minus,
            tokens.TOKEN_TYPES.sqrt)) {
            return new exprs.Unary(this.previous(), this.unary());
        }

        return this.postfix();
    }

    postfix() {
        // %
        let expr = this.primary();
        while(this.match(tokens.TOKEN_TYPES.percent)) {
            expr = new exprs.Postfix(this.previous(), expr);
        }

        return expr;
    }

    primary() {
        // NUMBER
        if (this.match(tokens.TOKEN_TYPES.number)) {
            return new exprs.Literal(this.previous());
        }

        // "+" NUMBER
        if (this.match(tokens.TOKEN_TYPES.plus)) {
            this.consumeExpected(tokens.TOKEN_TYPES.number, "Expect number after plus symbol.");
            return new exprs.Literal(this.previous());
        }

        // "(" expression ")"
        if (this.match(tokens.TOKEN_TYPES.brace_left)) {
            const expr = this.expression();
            this.consumeExpected(tokens.TOKEN_TYPES.brace_right, "Expect ')' after expression.");
            return new exprs.Grouping(expr);
        }

        throw "Expected expression.";
    }

    match(...tokenTypes) {
        for (const tokenType of tokenTypes) {
            if (this.check(tokenType)) {
                this.advance();
                return true;
            }
        }

        return false;
    }

    check(tokenType) {
        if (this.endReached()) {
            return false;
        }

        return this.peek().tokenType === tokenType;
    }

    consumeExpected(tokenType, error = "") {
        if (this.peek().tokenType !== tokenType) {
            throw `Failed to find expected token ${tokenType.name}.`;
        }
        return this.advance();
    }

    advance() {
        this.current = Math.min(this.current + 1, this.tokens.length);
        return this.previous;
    }

    previous() {
        if (this.current <= 0) {
            return this.tokens[0];
        }

        return this.tokens[this.current - 1];
    }

    peek() {
        return this.tokens[this.current];
    }

    endReached() {
        return this.peek().tokenType === tokens.TOKEN_TYPES.eof;
    }
}

module.exports = Parser;