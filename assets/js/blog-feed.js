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
// Function to parse the RSS feed
var parseRss = function (rss) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(rss, 'text/xml');
    var items = Array.from(xmlDoc.querySelectorAll('item'));
    return items.map(function (item) {
        var _a, _b, _c, _d, _e, _f, _g;
        var pubDate = ((_a = item.querySelector('pubDate')) === null || _a === void 0 ? void 0 : _a.textContent) || '';
        var date = new Date(pubDate);
        var year = date.getFullYear();
        var month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0-based in JavaScript
        var day = ('0' + date.getDate()).slice(-2);
        var shortDate = "".concat(year, "-").concat(month, "-").concat(day);
        var formattedDate = "".concat(date.getDate(), " ").concat(date.toLocaleString('default', { month: 'short' }), ", ").concat(year);
        var category = ((_b = item.querySelector('category')) === null || _b === void 0 ? void 0 : _b.textContent) || '';
        category = category.split(' ').map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1); }).join(' ');
        return {
            title: ((_c = item.querySelector('title')) === null || _c === void 0 ? void 0 : _c.textContent) || '',
            description: ((_d = item.querySelector('description')) === null || _d === void 0 ? void 0 : _d.textContent) || '',
            link: ((_e = item.querySelector('link')) === null || _e === void 0 ? void 0 : _e.textContent) || '',
            category: category,
            pubDate: formattedDate,
            date: shortDate,
            mediaContentUrl: ((_f = item.querySelector('content')) === null || _f === void 0 ? void 0 : _f.getAttribute('url')) || '',
            author: ((_g = item.querySelector('creator')) === null || _g === void 0 ? void 0 : _g.textContent) || 'PnP Community'
        };
    });
};
// Function to create a div for an RSS item
var createRSSPost = function (item, template) {
    var li = document.createElement('li');
    var _loop_1 = function (key) {
        var regex = new RegExp("{{".concat(key, "\\s*(\\|\\s*safeHTML)?}}"), 'g');
        var value = item[key] || '';
        var safeValue = safeHTML(value);
        template = template.replace(regex, function (_match, p1) { return p1 ? safeValue : value; });
    };
    for (var key in item) {
        _loop_1(key);
    }
    li.innerHTML = template;
    return li;
};
var safeHTML = function (str) {
    return encodeURIComponent(str);
};
// Function to fetch and display the RSS feed
var displayRss = function () { return __awaiter(void 0, void 0, void 0, function () {
    var rssFeedUrl, response, rss, items, section, templateResponse, template;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rssFeedUrl = window.rssFeedUrl;
                return [4 /*yield*/, fetch(rssFeedUrl)];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.text()];
            case 2:
                rss = _a.sent();
                items = parseRss(rss).slice(0, 4);
                section = document.querySelector('#rss-section');
                return [4 /*yield*/, fetch('templates/blog-item.html')];
            case 3:
                templateResponse = _a.sent();
                return [4 /*yield*/, templateResponse.text()];
            case 4:
                template = _a.sent();
                items.forEach(function (item) {
                    var div = createRSSPost(item, template);
                    if (section) {
                        section.appendChild(div);
                    }
                });
                return [2 /*return*/];
        }
    });
}); };
// Call the function when the page loads
window.addEventListener('DOMContentLoaded', displayRss);
