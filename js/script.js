import ParserModule from './parser.js';
import LexerModule from './lexer.js';
import ExceptionsModule from './exceptions.js';

const buttons = Array.from(document.querySelectorAll("button"));
const inputField = document.querySelector("#inputField");
const parser = new ParserModule.Parser();
const errorTextContainer = document.querySelector("#input-error");
let errorDisplayed = false;

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
    // If an error was displayed, reset the text content
    if(errorDisplayed) {
        errorTextContainer.textContent = "";
        inputField.textContent = "";
        errorDisplayed = false;
    }

    const inputFieldContent = inputField.textContent;
    if(key === "Enter") {
        try {
            if(inputFieldContent === "") {
                return;
            }

            const expression = parser.parseString(inputField.textContent);
            const result = expression.evaluate();
            inputField.textContent = +result.toFixed(9);
        }
        catch (exception) {
            console.error(exception);
            let errorString = exception.message;
            if(exception instanceof ExceptionsModule.ExpectedTokenException 
                || exception instanceof ExceptionsModule.UnexpectedTokenException) {
                errorString = "Malformed expression";
            }
            // Incase error is not of the expected type
            errorString = errorString === "" ? exception : errorString;

            errorTextContainer.textContent = errorString;
            errorDisplayed = true;
        }
        return true;
    }
    else if(key === "Delete") {
        inputField.textContent = "";
        return true;
    }
    else if(key === "Backspace") {
        if(inputFieldContent.length <= 0) {
            return;
        }
        // Remove last input tokens
        const tokens = LexerModule.tokenize(inputFieldContent, false);
        // Pop the EOF token
        tokens.pop();
        
        if(tokens[tokens.length-1].tokenType === LexerModule.TOKEN_TYPES.number) {
            // If the last token is a number, remove the last input character instead
            inputField.textContent = inputFieldContent.slice(0, inputFieldContent.length - 1);
            return;
        }
        
        // Remove last token and reconstruct the input text
        tokens.pop();
        const inputText = tokens.reduce((resultString, currentToken) => {
            return resultString += currentToken.text;
        }, "");
        inputField.textContent = inputText
        return true;
    }

    const button = buttons.find(x => x.dataset.key === key);
    if(button) {
        if(inputFieldContent === "0") {
            if(key === inputFieldContent) {
                return;
            }
            // Clear initial 0 if input a number something other than 0
            if(key >= "0" && key <= "9") {
                inputField.textContent = "";
            }
        }

        inputField.textContent += button.textContent;
        return true;
    }

    return false;
}