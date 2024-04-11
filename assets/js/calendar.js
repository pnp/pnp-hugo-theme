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
class ICALParser {
    constructor(icalData) {
        this.rawData = icalData;
        this.events = [];
    }
    parse() {
        const lines = this.rawData.split(/\r\n|\n|\r/);
        let currentEvent = null;
        lines.forEach(line => {
            if (line.startsWith('BEGIN:VEVENT')) {
                currentEvent = {};
            }
            else if (line.startsWith('END:VEVENT')) {
                this.events.push(currentEvent);
                currentEvent = null;
            }
            else if (currentEvent) {
                const [key, value] = line.split(':');
                switch (key) {
                    case 'SUMMARY':
                        currentEvent.summary = value;
                        break;
                    case 'DTSTART':
                        currentEvent.dtstart = this.parseDate(value);
                        break;
                    case 'DTEND':
                        currentEvent.dtend = this.parseDate(value);
                        break;
                    // Add more cases as per your need
                }
            }
        });
    }
    parseDate(dateStr) {
        // Basic date parsing, consider time zones and formats for production code
        const year = parseInt(dateStr.substr(0, 4));
        const month = parseInt(dateStr.substr(4, 2)) - 1; // JS months are 0-indexed
        const day = parseInt(dateStr.substr(6, 2));
        return new Date(year, month, day);
    }
    getEvents() {
        return this.events;
    }
}
function fetchAndParseICS(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = yield response.text();
        const parser = new ICALParser(data);
        parser.parse();
        console.log(parser.getEvents());
        // return events.map((eventComp: any) => {
        //     const event = new ICAL.Event(eventComp);
        //     return {
        //         summary: event.summary,
        //         start: event.startDate.toJSDate(),
        //         end: event.endDate.toJSDate(),
        //     };
        // });
    });
}
function displayEvents(events) {
    const eventsContainer = document.getElementById('events-container');
    if (!eventsContainer)
        return;
    eventsContainer.innerHTML = '';
    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event';
        const title = document.createElement('h3');
        title.textContent = event.summary;
        const when = document.createElement('p');
        when.textContent = `Start: ${event.start} - End: ${event.end}`;
        eventElement.appendChild(title);
        eventElement.appendChild(when);
        eventsContainer.appendChild(eventElement);
    });
}
const icsUrl = 'https://outlook.office365.com/owa/calendar/c80c26982a604d3e89b403a318e7a477@officedevpnp.onmicrosoft.com/ca3a6fcd2d944eedb7f87d13bea580af13174372598351020792/calendar.ics'; // Replace with your .ics file URL
fetchAndParseICS(icsUrl);
// .then(displayEvents)
// .catch(error => console.error('Error loading calendar:', error));
