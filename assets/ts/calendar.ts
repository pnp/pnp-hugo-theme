import { NextOccurrence, ICalEvent, ICalFeed } from './ICalFeed';
declare const baseUrl: string;

const updateEvents = async (): Promise<void> => {

    const url = new URL('/ical/calendar.json', baseUrl);
    // console.log('URL:', url.toString());
    const response = await fetch(url.toString());
    const ical = await response.json() as ICalFeed;

    // write the current time in ISO format to the page
    const currentTime = new Date().toISOString();
    // console.log("Current time:", currentTime);

    //write the time in 1 hour in ISO format to the log
    const oneHourFromNow = new Date(new Date().getTime() + 60 * 60 * 1000).toISOString();
    // console.log("One hour from now:", oneHourFromNow);

    const events = ical.events;
    events.forEach((event: ICalEvent) => {

        const now = new Date();
        const startTime = new Date(event.startTime);
        const endTime = new Date(event.endTime);

        // calculate the duration of the event
        const duration = endTime.getTime() - startTime.getTime();

        // Find the matching .card-main item with an id that matches the event uid
        const card = document.getElementById(event.uid);
        if (!card) {
            console.error('No card found with id:', event.uid);

            // Exit the loop
            return;
        }

        if (event.nextOccurrences.length === 0) {
            return;
        }

        // Filter the nextOccurrences array to only include occurrences that are scheduled for today or later
        const futureOccurrences = event.nextOccurrences.filter((occurrence: NextOccurrence) => {
            const occurrenceStartTime = new Date(occurrence.date);
            const today = new Date();
            // Set the time part of now to 00:00:00 to only compare the date part
            today.setHours(0, 0, 0, 0);
            return occurrenceStartTime >= today;
        });

        console.log(event.summary);
        if (futureOccurrences.length === 0) {
            console.log('No future occurrences found.');
            return;
        }

        // Use the find method to get the first occurrence in the filtered array
        const nextOccurrence = futureOccurrences.find(() => true);

        if (nextOccurrence) {

            if (window.location.pathname.toLowerCase().endsWith('/test-events/')) {
                //BEGIN: TESTING
                // This code will be removed in production
                if (event.uid === "040000008200E00074C5B7101A82E008000000003DADB286B88DDA01000000000000000010000000CAE180660514504D8FEE060CF40A7A57") {
                    // Force the PLEASE DELETE ME to be to now
                    // set the occurrence date to 10 minutes ago
                    console.log('   Setting the meeting to be 10 minutes ago');
                    const date = new Date();
                    date.setMinutes(date.getMinutes() - 10);
                    nextOccurrence.date = date;
                } else if (event.uid === "040000008200E00074C5B7101A82E00800000000CE03C195278ADA010000000000000000100000001D5D5DA85E858D45B9A47028FB60C7F2") {
                    // Force the Viva connections to be cancelled
                    nextOccurrence.status = "cancelled";
                    nextOccurrence.summary = "Cancelled - With a reason for cancellation";
                    console.log('   Setting the status to be cancelled');
                } else if (event.uid === "040000008200E00074C5B7101A82E00800000000F97F040EAE8EDA01000000000000000010000000214806AD1FEB9B49B9BA5E95BB8A21A0") {
                    nextOccurrence.status = "moved";
                    nextOccurrence.summary = event.summary + "Moved - With a reason to move";
                    console.log('   Setting the status to be moved');
                } else if (event.uid === "040000008200E00074C5B7101A82E00800000000A1CD2D70268ADA0100000000000000001000000051CB05FE8CA1C74BB006BB017D44378A") {
                    nextOccurrence.status = "cancelled";
                    nextOccurrence.summary = event.summary + "On Hiatus - Summer Break 🏖️";
                    console.log('   Setting the status to on hiatus');
                } else if (event.uid === "040000008200E00074C5B7101A82E0080000000070404DDB288ADA01000000000000000010000000F485AAF2995C3947AF4B1E87F01384A0") {
                    // Force the PLEASE DELETE ME to be less than 1 hour away
                    const comingSoon = new Date(new Date().getTime() + 50 * 60 * 1000);
                    nextOccurrence.date = comingSoon;
                    console.log("   Setting the meeting to less than an hour from now")
                } else if (event.uid === "040000008200E00074C5B7101A82E00800000000C81EAE66288ADA01000000000000000010000000F6C360139C27FF4B8FF87F06B421CDB8") {
                    // Set the Power Platform Community Call to be today
                    console.log('   Setting the Power Platform Community Call to be today');
                    const endOfDay = new Date();
                    endOfDay.setHours(23, 59, 59, 999);
                    nextOccurrence.date = endOfDay;
                } else {
                    console.log(event.summary);
                    console.log(event.uid);
                    console.log('   No special handling for this event');

                }
                //END: TESTING
            }

            // Check if the occurrence has an specific message
            let occurrenceSummary: string | undefined = undefined;
            if (nextOccurrence.summary && nextOccurrence.summary !== event.summary) {

                // If the next occurrence summary is shorter than the event summary, set the occurrence summary to the next occurrence summary
                if (nextOccurrence.summary.length < event.summary.length) {
                    occurrenceSummary = nextOccurrence.summary;
                } else {
                    // remove the event summary length from the start of the occurrence summary
                    occurrenceSummary = nextOccurrence.summary.slice(event.summary.length);
                    occurrenceSummary = occurrenceSummary.trim();
                }
            }

            // nextOccurrence is the next occurrence that isn't scheduled before today
            // You can add your code here to handle nextOccurrence
            const occurrenceStartTime = new Date(nextOccurrence.date);
            // console.log(event.summary, nextOccurrence.status)


            if (nextOccurrence.status === "cancelled") {
                if (occurrenceSummary && (occurrenceSummary.toLowerCase().startsWith('hiatus') || occurrenceSummary.toLowerCase().startsWith('on hiatus'))) {
                    const statusMessage = occurrenceSummary ? `${occurrenceSummary}` : 'On Hiatus';
                    setCardStatus(card, 'hiatus', statusMessage);
                } else {
                    // console.log('The event has been cancelled.');
                    const statusMessage = occurrenceSummary ? occurrenceSummary : 'Cancelled';
                    setCardStatus(card, 'cancelled', statusMessage);
                }

                return;
            }

            const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

            // Check if the event is 1 hour away
            if (oneHourFromNow >= occurrenceStartTime && now < occurrenceStartTime && nextOccurrence.status === "scheduled") {
                console.log('       The event is starting soon.');
                setCardStatus(card, 'soon', 'Starting soon 🕐');
                return;
            }

            // calculate the occurrence end time by adding the duration to the start time
            const occurrenceEndTime = new Date(occurrenceStartTime.getTime() + duration);

            // Check if the event is currently happening
            if (now >= occurrenceStartTime && now <= occurrenceEndTime) {
                console.log('       The event is currently happening.');

                // Find the div within the card that has the class .card-status
                setCardStatus(card, 'live', 'Live');
                return;
            }

            // Create a Date object for the end of the day
            const nextOccurrenceDate = new Date(nextOccurrence.date);
            if (nextOccurrenceDate.toDateString() === now.toDateString()) {
                console.log('       The event starts today.');
                setCardStatus(card, 'today', "Today 📆");
                return;
            }

            if (nextOccurrence.status === "moved") {
                // Find the div within the card that has the class .card-status
                const statusMessage = occurrenceSummary ? occurrenceSummary : 'Moved';
                setCardStatus(card, 'moved', statusMessage);
                return;
            }

        }
    });
};

// Call the function when the page loads
window.addEventListener('DOMContentLoaded', updateEvents);

function setCardStatus(card: HTMLElement, statusClass: string, statusText: string) {
    const status = card?.querySelector('.card-status-outer');

    // Add the following HTML
    if (status) {
        status.innerHTML = `<div class="card-status ${statusClass}">${statusText}</div>`;
    }
}
