var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { convert } from './ical2json.js';
// Your existing code...
function downloadIcs(url) {
    return __awaiter(this, void 0, void 0, function* () {
        debugger;
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = yield response.text();
        return data;
    });
}
function readAndConvertICS(data) {
    debugger;
    return convert(data);
}
// function extractEvents(icalData: ical2json.IcalObject): ical2json.VEvent[] {
//     // Assuming the primary key in the converted data is 'VCALENDAR'
//     if (icalData.VCALENDAR && icalData.VCALENDAR[0].VEVENT) {
//         return icalData.VCALENDAR[0].VEVENT;
//     }
//     return [];
// }
// function displayEvents(events) {
//     events.forEach(event => {
//         console.log('Summary:', event.SUMMARY);
//         console.log('Start Date:', event.DTSTART);
//         console.log('End Date:', event.DTEND);
//         console.log('---');
//     });
// }
const displayRss = () => __awaiter(void 0, void 0, void 0, function* () {
    debugger;
    const icsUrl = 'https://outlook.office365.com/owa/calendar/c80c26982a604d3e89b403a318e7a477@officedevpnp.onmicrosoft.com/ca3a6fcd2d944eedb7f87d13bea580af13174372598351020792/calendar.ics'; // Replace with your .ics file URL
    const icsData = yield downloadIcs(icsUrl);
    const icalData = readAndConvertICS(icsData);
    // const events = extractEvents(icalData);
    // displayEvents(events);
});
// Call the function when the page loads
window.addEventListener('DOMContentLoaded', displayRss);
// interface CalendarEvent {
//     summary: string;
//     start: Date;
//     end: Date;
// }
// async function fetchAndParseICS(url: string): Promise<CalendarEvent[]> {
//     const response = await fetch(url);
//     if (!response.ok) {
//         throw new Error('Network response was not ok');
//     }
//     const data = await response.text();
//     const lines = data.split(/\r\n|\n|\r/);
//     const tree = lines2tree(lines);
//     const events: CalendarEvent[] = [];
//     tree.forEach((component: Component) => {
//         if (component.name === 'VEVENT') {
//             let summary = '';
//             let start: Date | null = null;
//             let end: Date | null = null;
//             component.props.forEach((prop: Property) => {
//                 switch (prop.name) {
//                     case 'SUMMARY':
//                         summary = prop.value;
//                         break;
//                     case 'DTSTART':
//                         start = new Date(prop.value);
//                         break;
//                     case 'DTEND':
//                         end = new Date(prop.value);
//                         break;
//                 }
//             });
//             if (start && end) {
//                 events.push({ summary, start, end });
//             }
//         }
//     });
//     return events;
// }
// function displayEvents(events: CalendarEvent[]): void {
//     const eventsContainer = document.getElementById('events-container');
//     if (!eventsContainer) return;
//     eventsContainer.innerHTML = ''; // Clear existing content
//     events.forEach(event => {
//         const eventElement = document.createElement('div');
//         eventElement.className = 'event';
//         const title = document.createElement('h3');
//         title.textContent = event.summary;
//         const when = document.createElement('p');
//         when.textContent = `Start: ${event.start} - End: ${event.end}`;
//         eventElement.appendChild(title);
//         eventElement.appendChild(when);
//         eventsContainer.appendChild(eventElement);
//     });
// }
// fetchAndParseICS(icsUrl)
//     .then(displayEvents)
//     .catch(error => console.error('Error loading calendar:', error));
//# sourceMappingURL=calendar.js.map