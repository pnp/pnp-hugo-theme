import { NextOccurrence, ICalEvent, ICalFeed } from './ICalFeed';
declare global {
    interface Window {
        baseUrl: string;
    }
}



// Function to fetch calendar data
async function fetchCalendarData(baseUrl: string): Promise<ICalFeed> {
    const url = new URL('./ical/calendar.json', baseUrl);
    const response = await fetch(url.toString());
    return await response.json() as ICalFeed;
}

// Utility to get time one hour from now
function getTimeOneHourFromNow(): Date {
    return new Date(new Date().getTime() + 60 * 60 * 1000);
}

// Utility to calculate duration between two times
function calculateDuration(startTime: Date, endTime: Date): number {
    return endTime.getTime() - startTime.getTime();
}

// Process all events
function processEvents(events: ICalEvent[]): void {
    events.forEach(handleSingleEvent);
}

// Handle a single event
function handleSingleEvent(event: ICalEvent): void {
    const now = new Date();
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);
    const duration = calculateDuration(startTime, endTime);
    const card = document.getElementById(event.uid);

    if (!card) {
        console.error('No card found with id:', event.uid);
        return;
    }

    if (event.nextOccurrences.length === 0) {
        return;
    }

    const futureOccurrences = filterFutureOccurrences(event.nextOccurrences);
    updateEventStatus(event, card, futureOccurrences, duration, now);
}

// Filter future occurrences
function filterFutureOccurrences(occurrences: NextOccurrence[]): NextOccurrence[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return occurrences.filter(occurrence => new Date(occurrence.date) >= today);
}

// Update event status based on timing
function updateEventStatus(event: ICalEvent, card: HTMLElement, futureOccurrences: NextOccurrence[], duration: number, now: Date): void {
    futureOccurrences.forEach(occurrence => {
        if (!occurrence) {
            return;
        }

        //BEGIN: TESTING
        if (window.location.pathname.toLowerCase().endsWith('/test-events/')) {

            // This code will be removed in production
            if (event.uid === "040000008200E00074C5B7101A82E008000000003DADB286B88DDA01000000000000000010000000CAE180660514504D8FEE060CF40A7A57") {
                // Force the PLEASE DELETE ME to be to now
                // set the occurrence date to 10 minutes ago
                occurrence.summary = event.summary;
                occurrence.status = "scheduled";
                console.log('   Setting the meeting to be 10 minutes ago');
                const date = new Date();
                date.setMinutes(date.getMinutes() - 10);
                occurrence.date = date;
                console.log(now >= occurrence.date);
            } else if (event.uid === "040000008200E00074C5B7101A82E00800000000CE03C195278ADA010000000000000000100000001D5D5DA85E858D45B9A47028FB60C7F2") {
                // Force the Viva connections to be cancelled
                occurrence.status = "cancelled";
                occurrence.summary = "Cancelled until further notice";
                console.log('   Setting the status to be cancelled');
            } else if (event.uid === "040000008200E00074C5B7101A82E00800000000F97F040EAE8EDA01000000000000000010000000214806AD1FEB9B49B9BA5E95BB8A21A0") {
                occurrence.status = "moved";
                occurrence.summary = event.summary + "Moved to 8 AM PT/4 PM GMT";
                console.log('   Setting the status to be moved');
            } else if (event.uid === "040000008200E00074C5B7101A82E00800000000A1CD2D70268ADA0100000000000000001000000051CB05FE8CA1C74BB006BB017D44378A") {
                occurrence.status = "cancelled";
                occurrence.summary = event.summary + " On Hiatus for Summer Break 🏖️ Returns in September.";
                console.log('   Setting the status to on hiatus');
            } else if (event.uid === "040000008200E00074C5B7101A82E0080000000070404DDB288ADA01000000000000000010000000F485AAF2995C3947AF4B1E87F01384A0") {
                // Force the PLEASE DELETE ME to be less than 1 hour away
                const comingSoon = new Date(new Date().getTime() + 50 * 60 * 1000);
                occurrence.date = comingSoon;
                console.log("   Setting the meeting to less than an hour from now")
            } else if (event.uid === "040000008200E00074C5B7101A82E00800000000C81EAE66288ADA01000000000000000010000000F6C360139C27FF4B8FF87F06B421CDB8") {
                // Set the Power Platform Community Call to be today
                console.log('   Setting the Power Platform Community Call to be today');
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);
                occurrence.date = endOfDay;
            }
        }
        //END: TESTING

        const occurrenceStartTime = new Date(occurrence.date);
        const occurrenceEndTime = new Date(occurrenceStartTime.getTime() + duration);

        if (occurrence.status === "cancelled") {

            if (occurrence.summary && (occurrence.summary.toLowerCase().startsWith('hiatus') || occurrence.summary.toLowerCase().startsWith('on hiatus'))) {
                const statusMessage = extractOccurrenceSummary(occurrence.summary, event.summary) || 'On Hiatus';
                setCardStatus(card, 'hiatus', statusMessage);
            } else {
                const statusMessage = extractOccurrenceSummary(occurrence.summary, event.summary) || 'Cancelled';
                setCardStatus(card, 'cancelled', statusMessage);
            }
        } else if (now >= occurrenceStartTime && now <= occurrenceEndTime) {
            console.log('Event is currently happening.');
            setCardStatus(card, 'live', 'Live');
        } else if (getTimeOneHourFromNow() >= occurrenceStartTime && now < occurrenceStartTime && occurrence.status === "scheduled") {
            console.log('Event is starting soon.');
            setCardStatus(card, 'soon', 'Starting soon ⌛');
        } else if (occurrenceStartTime.toDateString() === now.toDateString()) {
            console.log('Event starts today.');
            setCardStatus(card, 'today', 'Today 📆');
        } else if (occurrence.status === "moved") {
            const statusMessage = extractOccurrenceSummary(occurrence.summary, event.summary) || 'Moved';
            setCardStatus(card, 'moved', statusMessage);
        }
    });
}


function setCardStatus(card: HTMLElement, statusClass: string, statusText: string): void {
    const status = card?.querySelector('.card-status-outer');
    if (status) {
        status.innerHTML = `<div class="card-status ${statusClass}">${statusText}</div>`;
    }
}

// Main function that starts the process
async function updateEvents(): Promise<void> {
    const calendarData = await fetchCalendarData(window.baseUrl);

    // Only do this for the events page
    if (document.getElementById("events-container")) {
        processEvents(calendarData.events);
    }

    if (document.getElementById("calendar-container")) {
        generateCalendar(calendarData.events);
        processEvents(calendarData.events);
    }
}

function generateCalendar(events: ICalEvent[]): void {
    const today: Date = new Date();
    let thisMonday: Date = new Date(today);

    // Calculate the day of the week (0 for Sunday, 1 for Monday, etc.)
    let dayOfWeek: number = today.getDay();
    let offset: number = dayOfWeek - 1; // Calculate the offset to get to Monday
    if (offset < 0) offset = 6; // If today is Sunday, set offset to 6

    // Subtract the offset from the current date to get this Monday
    thisMonday.setDate(today.getDate() - offset);

    const calendarContainer: HTMLElement | null = document.querySelector('.calendar');
    if (calendarContainer) {
        calendarContainer.innerHTML = ''; // Clear previous entries

        for (let i: number = 0; i < 12; i++) { // Only generate for 10 days (2 weeks of weekdays)

            // Skip weekends
            if (thisMonday.getDay() !== 0 && thisMonday.getDay() !== 6) {
                const dayElem: HTMLDivElement = document.createElement('div');
                dayElem.className = 'date';
                dayElem.setAttribute('data-date', thisMonday.toISOString().split('T')[0]);
                // Create header
                const headerElem: HTMLElement = document.createElement('header');
                headerElem.className = 'card-header';

                // Create h1
                const h1Elem: HTMLHeadingElement = document.createElement('h1');
                h1Elem.textContent = thisMonday.getDate().toString(); // Date goes here

                // Create day name
                const dayNameElem: Text = document.createTextNode(thisMonday.toLocaleDateString('default', { weekday: 'long' })); // Day Name goes here

                // Append h1 and day name to header
                headerElem.appendChild(h1Elem);
                headerElem.appendChild(dayNameElem);

                // Append header to dayElem
                dayElem.appendChild(headerElem);

                for (let event of events) {
                    for (let occurrence of event.nextOccurrences) {
                        let occurrenceDate: Date = new Date(occurrence.date);
                        occurrenceDate.setMinutes(occurrenceDate.getMinutes() - occurrenceDate.getTimezoneOffset());
                        let formattedDate: string = occurrenceDate.toISOString().split('T')[0];

                        let formattedTime: string = occurrenceDate.toLocaleTimeString(navigator.language, { hour: 'numeric', minute: 'numeric' });
                        let timeElem: HTMLTimeElement = document.createElement('time');
                        timeElem.textContent = formattedTime;
                        timeElem.setAttribute('datetime', occurrenceDate.toISOString());

                        if (formattedDate === thisMonday.toISOString().split('T')[0]) {
                            // Create a div and add the event summary and occurrence start time
                            const eventElem: HTMLDivElement = document.createElement('div');
                            eventElem.id = event.uid;
                            eventElem.className = 'card-hor';
                            eventElem.innerHTML = `<h2 class="sample-headline" title="${event.summary}">${event.summary}</h2>`;

                            // Create card-status-outer div
                            const cardStatusOuter: HTMLDivElement = document.createElement('div');
                            cardStatusOuter.className = 'card-status-outer';

                            // Append card-status-outer div to eventElem
                            eventElem.appendChild(cardStatusOuter);

                            // Append timeElem to eventElem
                            eventElem.appendChild(timeElem);
                            dayElem.appendChild(eventElem);
                        }
                    }
                }

                calendarContainer.appendChild(dayElem);

                // Add events to the day


            }
            thisMonday.setDate(thisMonday.getDate() + 1);
        }


    }
}


function extractOccurrenceSummary(nextOccurrenceSummary: string | undefined, eventSummary: string): string | undefined {
    // Check if the occurrence has an specific message
    let occurrenceSummary: string | undefined = undefined;
    if (nextOccurrenceSummary && nextOccurrenceSummary !== eventSummary) {

        // If the next occurrence summary is shorter than the event summary, set the occurrence summary to the next occurrence summary
        if (nextOccurrenceSummary.length < eventSummary.length) {
            occurrenceSummary = nextOccurrenceSummary;
        } else {
            // remove the event summary length from the start of the occurrence summary
            occurrenceSummary = nextOccurrenceSummary.slice(eventSummary.length);
            occurrenceSummary = occurrenceSummary.trim();

            // If there is a - at the start of the occurrence summary, remove it and trim the string
            if (occurrenceSummary.startsWith('-')) {
                occurrenceSummary = occurrenceSummary.slice(1);
                occurrenceSummary = occurrenceSummary.trim();
            }
        }
    }
    return occurrenceSummary;
}

// Call the function when the page loads
window.addEventListener('DOMContentLoaded', updateEvents);
