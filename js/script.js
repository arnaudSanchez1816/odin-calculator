import ParserModule from './parser.js';

const buttons = Array.from(document.querySelectorAll("button"));
const inputField = document.querySelector("#inputField");
const parser = new ParserModule.Parser();

document.addEventListener("keydown", function(event) {
    const key = event.key;
    const handled = processKey(key);
    if(handled) {
        event.preventDefault();
    }
});

buttons.forEach(x => {
    x.addEventListener("click", () => processKey(x.dataset.key));
});

function processKey(key) {
    if(key === "Enter") {
        try {
            const expression = parser.parseString(inputField.textContent);
            const result = expression.evaluate();
            inputField.textContent = +result.toFixed(9);
        }
        catch (exception) {
            console.error(exception);
            inputField.textContent = "Error";
        }
        return true;
    }
    else if(key === "Delete") {
        inputField.textContent = "";
        return true;
    }
    else if(key === "Backspace") {
        const str = inputField.textContent;
        if(str.length > 0) {
            inputField.textContent = str.slice(0, str.length - 1);
        }
        return true;
    }

    const button = buttons.find(x => x.dataset.key === key);
    if(button) {
        inputField.textContent += button.textContent;
        return true;
    }

    return false;
}