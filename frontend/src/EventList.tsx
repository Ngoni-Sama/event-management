import React, { useEffect, useState } from 'react';

// Define the Event type
interface Event {
    id: number;
    title: string;
    date: string;
    description?: string; // Optional property
}

const EventList: React.FC<{ onSelectEvent: (event: Event) => void }> = ({ onSelectEvent }) => {
    const [events, setEvents] = useState<Event[]>([]); // Specify the type of events state

    useEffect(() => {
        const fetchEvents = async () => {
            const response = await fetch('http://127.0.0.1:8000/events'); // Fetch events from the backend
            const data = await response.json(); // Parse the response as JSON
            setEvents(data); // Update state with the fetched events
        };
        fetchEvents(); // Call the fetch function when the component mounts
    }, []);

    return (
        <div>
            <h1>Event List</h1> // Title of the event list
            <ul>
                {events.map(event => ( // Map through events and display them
                    <li key={event.id} onClick={() => onSelectEvent(event)}>
                        {event.title} - {event.date} // Display event title and date
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventList;