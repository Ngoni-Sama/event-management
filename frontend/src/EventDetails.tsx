 
import React from 'react';

const EventDetails: React.FC<{ event: any }> = ({ event }) => {
    if (!event) {
        return <div>No event selected</div>;  // Display a message if no event is provided
    }

    return (
        <div className="p-4 border rounded">
            <h2>Event Details</h2>
            <h3>{event.title}</h3>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Description:</strong> {event.description || "No description available."}</p>
        </div>
    );
};

export default EventDetails;