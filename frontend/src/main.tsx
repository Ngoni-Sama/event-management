import React, { useEffect, useState } from 'react';

// Define the Event interface for type safety
interface Event {
    id?: number;             // Optional ID for the event
    title: string;          // Title of the event
    date: string;           // Date of the event
    description: string;    // Description of the event
}

const App: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]); // State to hold the list of events
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null); // State to hold the currently selected event
    const [formData, setFormData] = useState<Event>({ title: '', date: '', description: '' }); // State for form input

    // Fetch events from the backend
    const fetchEvents = async () => {
        const response = await fetch("http://127.0.0.1:8000/events");
        const data = await response.json();
        setEvents(data); // Update the events state with fetched data
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target; // Destructure name and value from the input
        setFormData({ ...formData, [name]: value }); // Update formData state
    };

    // Handle form submission to create or update an event
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent the default form submission behavior

        if (currentEvent) {
            // If an event is currently being edited, update it
            await fetch(`http://127.0.0.1:8000/events/${currentEvent.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData), // Send formData as JSON
            });
        } else {
            // Otherwise, create a new event
            await fetch("http://127.0.0.1:8000/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData), // Send formData as JSON
            });
        }

        setFormData({ title: '', date: '', description: '' }); // Reset the form after submission
        setCurrentEvent(null); // Reset the current event
        fetchEvents(); // Refresh the event list
    };

    // Show details for the clicked event
    const showEventDetails = (event: Event) => {
        setCurrentEvent(event); // Set the current event to the selected one
        setFormData(event); // Populate the form with event data for editing
    };

    // Handle the delete event button click
    const handleDelete = async () => {
        if (currentEvent && window.confirm("Are you sure you want to delete this event?")) {
            // Confirm deletion and make a DELETE request
            await fetch(`http://127.0.0.1:8000/events/${currentEvent.id}`, {
                method: "DELETE",
            });
            setCurrentEvent(null); // Reset current event after deletion
            fetchEvents(); // Refresh the event list
        }
    };

    // Fetch events on component mount
    useEffect(() => {
        fetchEvents(); // Call fetchEvents when the component mounts
    }, []);

    return (
        <div className="bg-gray-100 p-6 flex flex-col">
            <div className="flex flex-row mb-6">
                {/* Event List Section */}
                <div className="w-1/3 pr-4">
                    <h2 className="text-xl font-semibold mb-2">Event List</h2>
                    <div className="flex flex-col space-y-2">
                        {events.map(event => (
                            <button
                                key={event.id}
                                className="event w-full text-left bg-white border border-gray-300 p-2 rounded hover:bg-gray-100 flex flex-col items-start"
                                onClick={() => showEventDetails(event)} // Show event details when clicked
                            >
                                <span className="font-bold">{event.title}</span>
                                <span className="text-gray-600">{event.date}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Event Details Section */}
                <div className="w-2/3 pl-4">
                    <h2 className="text-xl font-semibold mb-2">Event Details</h2>
                    {currentEvent && (
                        <div className="border border-gray-300 p-4 rounded">
                            <h3 className="text-lg font-bold">{currentEvent.title}</h3>
                            <p className="text-gray-600">Date: {currentEvent.date}</p>
                            <p className="text-gray-800">{currentEvent.description}</p>
                            <div className="mt-4 flex space-x-2">
                                {/* Edit and Delete buttons */}
                                <button
                                    className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                                    onClick={() => setCurrentEvent(currentEvent)} // Populate form for editing
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                    onClick={handleDelete} // Delete event
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Event Entry Form Section */}
            <div className="border border-gray-300 bg-gray-50 p-4 rounded">
                <h1 className="text-2xl font-bold mb-4">Enter Event Details</h1>
                <form onSubmit={handleSubmit} className="mb-6">
                    {/* Form Fields */}
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange} // Handle input changes
                        placeholder="Event Title"
                        required
                        className="border border-gray-300 p-2 w-full mb-4 rounded"
                    />
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange} // Handle input changes
                        required
                        className="border border-gray-300 p-2 w-full mb-4 rounded"
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange} // Handle input changes
                        placeholder="Event Description"
                        className="border border-gray-300 p-2 w-full mb-4 rounded"
                    />
                    <button type="submit" className="bg-green-300 text-white p-2 rounded hover:bg-green-400">
                        Create Event
                    </button>
                </form>
            </div>
        </div>
    );
};

export default App; // Export the App component for use in other files