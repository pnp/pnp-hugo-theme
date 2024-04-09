"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const displayiCal = () => __awaiter(void 0, void 0, void 0, function* () {
    const icsUrl = 'https://outlook.office365.com/owa/calendar/c80c26982a604d3e89b403a318e7a477@officedevpnp.onmicrosoft.com/ca3a6fcd2d944eedb7f87d13bea580af13174372598351020792/calendar.ics'; // Replace with your .ics file URL
    // const response = await fetch(icsUrl);
    const response = yield fetch(icsUrl, { mode: 'no-cors' });
    const iCal = yield response.text();
    console.log(iCal);
    const items = convert(iCal);
    console.log(items);
    // const items = parseiCal(iCal).slice(0, 4);
    // const section = document.querySelector('#iCal-section');
    // const templateResponse = await fetch('templates/blog-item.html');
    // const template = await templateResponse.text();
    // items.forEach(item => {
    //     const div = createiCalPost(item, template);
    //     if (section) {
    //         section.appendChild(div);
    //     }
    // });
});
// Call the function when the page loads
window.addEventListener('DOMContentLoaded', displayiCal);
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
