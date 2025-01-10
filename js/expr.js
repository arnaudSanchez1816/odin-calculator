class Expr {
    accept(visitor){}

    /**
     * Print this expression abstract syntax tree representation to a string.
     * @returns {string} The string representation of this expression.
     */
    print(){}

    /**
     * Evaluate the expression.
     * @returns {number} A number corresponding to the evaluated expression.
     * @throws {String} If an operation was not supported, reason being the exception message.
     */
    evaluate(){}
}

class Binary extends Expr {
    constructor(leftExpr, operatorToken, rightExpr) {
        super();
        this.left = leftExpr;
        this.operator = operatorToken;
        this.right = rightExpr;
    };

    accept(visitor) {
        return visitor.visitBinary(this);
    }

    print() {
        return parenthesize(this.operator.text, this.left, this.right);
    }

    evaluate() {
        return this.operator.binary(this.left.evaluate(), this.right.evaluate());
    }
}

class Unary extends Expr {
    constructor(operatorToken, rightExpr) {
        super();
        this.operator = operatorToken;
        this.right = rightExpr;
    }

    accept(visitor) {
        return visitor.visitUnary(this);
    }

    print() {
        return parenthesize(this.operator.text, this.right);
    }

    evaluate() {
        return this.operator.unary(this.right.evaluate());
    }
}

class Grouping extends Expr {
    constructor(expr) {
        super();
        this.expr = expr;
    }

    accept(visitor) {
        return visitor.visitGrouping(this);
    }

    print() {
        return parenthesize("group", this.expr);
    }

    evaluate() {
        return this.expr.evaluate();
    }
}

class Literal extends Expr {
    constructor(value) {
        super();
        this.value = value;
    }

    accept(visitor) {
        return visitor.visitLiteral(this);
    }

    print() {
        return this.value.text;
    }

    evaluate() {
        return +this.value.text;
    }
}

function parenthesize(name, ...exprs) {
    let str = `(${name}`;
    exprs.forEach(x => str += ` ${x.print()}`);
    str += ")";

    return str;
}

module.exports = {
    Literal,
    Grouping,
    Unary,
    Binary
}