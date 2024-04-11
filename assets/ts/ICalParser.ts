export class ICALParser {

    private rawData: string;
    private events: any[];

    constructor(icalData: string) {
        this.rawData = icalData;
        this.events = [];
    }

    parse() {
        const lines = this.rawData.split(/\r\n|\n|\r/);
        let currentEvent: any = null;

        lines.forEach(line => {
            if (line.startsWith('BEGIN:VEVENT')) {
                currentEvent = {};
            } else if (line.startsWith('END:VEVENT')) {
                this.events.push(currentEvent);
                currentEvent = null;
            } else if (currentEvent) {
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

    parseDate(dateStr: string): Date {
        // Basic date parsing, consider time zones and formats for production code
        const year = parseInt(dateStr.substr(0, 4));
        const month = parseInt(dateStr.substr(4, 2)) - 1; // JS months are 0-indexed
        const day = parseInt(dateStr.substr(6, 2));
        return new Date(year, month, day);
    }

    getEvents(): any[] {
        return this.events;
    }
}
