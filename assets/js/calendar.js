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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var displayiCal = function () { return __awaiter(void 0, void 0, void 0, function () {
    var icsUrl, response, iCal, items;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                icsUrl = 'https://outlook.office365.com/owa/calendar/c80c26982a604d3e89b403a318e7a477@officedevpnp.onmicrosoft.com/ca3a6fcd2d944eedb7f87d13bea580af13174372598351020792/calendar.ics';
                return [4 /*yield*/, fetch(icsUrl, { mode: 'no-cors' })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.text()];
            case 2:
                iCal = _a.sent();
                console.log(iCal);
                items = convert(iCal);
                console.log(items);
                return [2 /*return*/];
        }
    });
}); };
// Call the function when the page loads
window.addEventListener('DOMContentLoaded', displayiCal);
// Make sure lines are splited correctly
// http://stackoverflow.com/questions/1155678/javascript-string-newline-character
var NEW_LINE = /\r\n|\n|\r/;
var COLON = ':';
// const COMMA = ",";
// const DQUOTE = "\"";
// const SEMICOLON = ";";
var SPACE = ' ';
/**
 * Take ical string data and convert to JSON
 */
function convert(source) {
    var output = {};
    var lines = source.split(NEW_LINE);
    var parentObj = {};
    var currentObj = output;
    var parents = [];
    var currentKey = '';
    for (var i = 0; i < lines.length; i++) {
        var currentValue = '';
        var line = lines[i];
        if (line.charAt(0) === SPACE) {
            currentObj[currentKey] += line.substring(1);
        }
        else {
            var splitAt = line.indexOf(COLON);
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
    var lines = [];
    var _loop_1 = function (key) {
        var value = object[key];
        if (Array.isArray(value)) {
            if (key === 'RDATE') {
                value.forEach(function (item) {
                    lines.push(key + ':' + item);
                });
            }
            else {
                value.forEach(function (item) {
                    lines.push('BEGIN:' + key);
                    lines.push(revert(item));
                    lines.push('END:' + key);
                });
            }
        }
        else {
            var fullLine = key + ':' + value;
            do {
                // According to ical spec, lines of text should be no longer
                // than 75 octets
                lines.push(fullLine.substring(0, 75));
                fullLine = SPACE + fullLine.substring(75);
            } while (fullLine.length > 1);
        }
    };
    for (var key in object) {
        _loop_1(key);
    }
    return lines.join('\n');
}
