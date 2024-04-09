"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convert = exports.revert = void 0;
// Make sure lines are splited correctly
// http://stackoverflow.com/questions/1155678/javascript-string-newline-character
const NEW_LINE = /\r\n|\n|\r/;
const COLON = ':';
// const COMMA = ",";
// const DQUOTE = "\"";
// const SEMICOLON = ";";
const SPACE = ' ';
/**
 * Take ical string data and convert to JSON
 */
function convert(source) {
    const output = {};
    const lines = source.split(NEW_LINE);
    let parentObj = {};
    let currentObj = output;
    const parents = [];
    let currentKey = '';
    for (let i = 0; i < lines.length; i++) {
        let currentValue = '';
        const line = lines[i];
        if (line.charAt(0) === SPACE) {
            currentObj[currentKey] += line.substring(1);
        }
        else {
            const splitAt = line.indexOf(COLON);
            if (splitAt < 0) {
                continue;
            }
            currentKey = line.substring(0, splitAt);
            currentValue = line.substring(splitAt + 1);
            switch (currentKey) {
                case 'BEGIN':
                    parents.push(parentObj);
                    parentObj = currentObj;
                    if (parentObj[currentValue] == null) {
                        parentObj[currentValue] = [];
                    }
                    // Create a new object, store the reference for future uses
                    currentObj = {};
                    parentObj[currentValue].push(currentObj);
                    break;
                case 'END':
                    currentObj = parentObj;
                    parentObj = parents.pop();
                    break;
                default:
                    if (currentObj[currentKey]) {
                        if (!Array.isArray(currentObj[currentKey])) {
                            currentObj[currentKey] = [currentObj[currentKey]];
                        }
                        currentObj[currentKey].push(currentValue);
                    }
                    else {
                        currentObj[currentKey] = currentValue;
                    }
            }
        }
    }
    return output;
}
exports.convert = convert;
/**
 * Take JSON, revert back to ical
 */
function revert(object) {
    const lines = [];
    for (const key in object) {
        const value = object[key];
        if (Array.isArray(value)) {
            if (key === 'RDATE') {
                value.forEach((item) => {
                    lines.push(key + ':' + item);
                });
            }
            else {
                value.forEach((item) => {
                    lines.push('BEGIN:' + key);
                    lines.push(revert(item));
                    lines.push('END:' + key);
                });
            }
        }
        else {
            let fullLine = key + ':' + value;
            do {
                // According to ical spec, lines of text should be no longer
                // than 75 octets
                lines.push(fullLine.substring(0, 75));
                fullLine = SPACE + fullLine.substring(75);
            } while (fullLine.length > 1);
        }
    }
    return lines.join('\n');
}
exports.revert = revert;
