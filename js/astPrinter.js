class AstPrinter {
    printToString(expr) {
        return expr.accept(this);
    }

    visitBinary(expr) {
        return this.parenthesize(expr.operator.text, expr.left, expr.right);
    }

    visitUnary(expr) {
        return this.parenthesize(expr.operator.text, expr.right);
    }

    visitGrouping(expr) {
        return this.parenthesize("group", expr.expr);
    }

    visitLiteral(expr) {
        return expr.value.toString();
    }

    parenthesize(name, ...exprs) {
        let str = `(${name}`;
        exprs.forEach(x => str += ` ${x.accept(this)}`);
        str += ")";

        return str;
    }
}

module.exports = AstPrinter;