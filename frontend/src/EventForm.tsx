
import React, { useState } from 'react';

const EventForm: React.FC<{ onEventCreated: (event: any) => void }> = ({ onEventCreated }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();  // Prevent default form submission behavior

        const newEvent = { title, date, description };  // Create a new event object

        // Send a POST request to create a new event
        const response = await fetch('http://127.0.0.1:8000/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEvent),  // Convert the event object to JSON
        });

        if (response.ok) {
            const createdEvent = await response.json();  // Parse the response as JSON
            onEventCreated(createdEvent);  // Call the callback with the new event
            // Reset the form fields
            setTitle('');
            setDate('');
            setDescription('');
        } else {
            console.error('Failed to create event');  // Log an error if the request fails
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded">
            <h2>Create New Event</h2>
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border p-1"
                />
            </div>
            <div>
                <label>Date:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="border p-1"
                />
            </div>
            <div>
                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-1"
                />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Create Event
            </button>
        </form>
    );
};

export default EventForm;