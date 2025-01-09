// Grammar
// expression     → term ;
// term           → factor ( ( "-" | "+" ) factor )* ;
// factor         → pow ( ( "*" | "/" ) pow )* ;
// pow            → unary ( ( "^" | "mod" ) unary )* ;
// unary          → ( "-" | "sqrt" ) unary
//                | primary ;
// primary        → NUMBER | "+" NUMBER | "(" expression ")" ;

// https://craftinginterpreters.com/parsing-expressions.html#syntax-errors

const tokens = require("./lexer");
const exprs = require("./expr")

class Parser {
    
    parse(tokens) {
        try {
          this.tokens = tokens;
          this.current = 0;
          return this.expression();  
        }
        catch (error) {
            console.error(error);
        }
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
        while (this.match(tokens.TOKEN_TYPES.pow, 
            tokens.TOKEN_TYPES.mod)) {
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

        return this.primary();
    }

    primary() {
        // NUMBER
        if (this.match(tokens.TOKEN_TYPES.number)) {
            return new exprs.Literal(this.previous().literal);
        }

        // "+" NUMBER
        if (this.match(tokens.TOKEN_TYPES.plus)) {
            this.consumeExpected(tokens.TOKEN_TYPES.number, "Expect number after plus symbol.");
            return new exprs.Literal(this.previous().literal);
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
            if (check(tokenType)) {
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
            throw `Failed to find expected token ${tokenType}.`;
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