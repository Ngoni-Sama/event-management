import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client, Client
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

# Load environment variables from a .env file
load_dotenv()

# Initialize the FastAPI application
app = FastAPI()

# Initialize Supabase client with URL and key from environment variables
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Define the Event model using Pydantic for data validation
class Event(BaseModel):
    title: str  # Title of the event
    date: str   # Date of the event
    description: str  # Description of the event

# Endpoint to create a new event
@app.post("/events")
async def create_event(event: Event):
    # Insert the event data into the Supabase 'events' table
    response = supabase.table('events').insert(event.dict()).execute()
    return {"message": "Event created successfully", "event": event}

# Endpoint to retrieve all events
@app.get("/events")
async def get_events():
    # Select all records from the Supabase 'events' table
    response = supabase.table('events').select("*").execute()
    return response.data if response.data else []  # Return data or an empty list

# Endpoint to retrieve a specific event by ID
@app.get("/events/{event_id}")
async def get_event(event_id: int):
    # Select the event with the specified ID from the Supabase 'events' table
    response = supabase.table('events').select("*").eq('id', event_id).execute()
    if response.data:
        return response.data[0]  # Return the first event if found
    else:
        raise HTTPException(status_code=404, detail="Event not found")  # Raise error if not found

# Endpoint to update an existing event by ID
@app.put("/events/{event_id}")
async def update_event(event_id: int, event: Event):
    # Update the event with the specified ID in the Supabase 'events' table
    response = supabase.table('events').update(event.dict()).eq('id', event_id).execute()
    if response.status_code == 200:
        return {"message": "Event updated successfully", "event": event}
    else:
        raise HTTPException(status_code=404, detail="Event not found")  # Raise error if not found

# Endpoint to delete an event by ID
@app.delete("/events/{event_id}")
async def delete_event(event_id: int):
    # Delete the event with the specified ID from the Supabase 'events' table
    response = supabase.table('events').delete().eq('id', event_id).execute()
    if response.status_code == 204:
        return {"message": "Event deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Event not found")  # Raise error if not found

# Serve the HTML frontend files from the 'frontend' directory
app.mount("/frontend", StaticFiles(directory="frontend"), name="static")

# Endpoint to serve the main HTML page
@app.get("/", response_class=HTMLResponse)
async def get_index():
    # Open and return the HTML file for the frontend
    with open("frontend/index.html") as f:
        return HTMLResponse(content=f.read())