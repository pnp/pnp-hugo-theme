// Define an interface for the RSS item
interface RssItem {
    title: string;
    description: string;
    link: string;
    category?: string;
    pubDate: string;
    date: string;
    mediaContentUrl?: string;
    author: string;
}
