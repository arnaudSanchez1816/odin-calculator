class Expr {
    accept(visitor){}

    print(){}

    rpn() {}
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

    rpn () {
        return `${this.left.rpn()} ${this.right.rpn()} ${this.operator.text}`;
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

    rpn () {
        let operator = this.operator.text;
        if (expr.operator.type == TokenType.MINUS) {
            // Can't use same symbol for unary and binary.
            operator = "~";
        }
        return `${this.right.rpn()} ${operator}`;
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

    rpn () {
        return `${this.expr.rpn()}`;
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
        return this.value.toString();
    }

    rpn () {
        return this.print();
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