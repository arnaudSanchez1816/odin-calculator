class ExpectedTokenException {
    constructor(message) {
        this.message = message;
    }
}

class UnexpectedTokenException {
    constructor(message) {
        this.message = message;
    }
}

class DivisionByZeroException {
    constructor() {
        this.message = "Division by zero is undefined";
    }
}

class ImaginaryNumberException {
    constructor() {
        this.message = "Imaginary numbers unsupported";
    }
}

export default {
    ExpectedTokenException,
    UnexpectedTokenException,
    DivisionByZeroException,
    ImaginaryNumberException
}