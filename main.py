import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client, Client
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Initialize Supabase client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Define the Event model
class Event(BaseModel):
    title: str
    date: str
    description: str

@app.post("/events")
async def create_event(event: Event):
    response = supabase.table('events').insert(event.dict()).execute()
    return {"message": "Event created successfully", "event": event}

@app.get("/events")
async def get_events():
    response = supabase.table('events').select("*").execute()
    return response.data if response.data else []

@app.get("/events/{event_id}")
async def get_event(event_id: int):
    response = supabase.table('events').select("*").eq('id', event_id).execute()
    if response.data:
        return response.data[0]  # Return the first event if found
    else:
        raise HTTPException(status_code=404, detail="Event not found")

@app.put("/events/{event_id}")
async def update_event(event_id: int, event: Event):
    response = supabase.table('events').update(event.dict()).eq('id', event_id).execute()
    if response.status_code == 200:
        return {"message": "Event updated successfully", "event": event}
    else:
        raise HTTPException(status_code=404, detail="Event not found")

@app.delete("/events/{event_id}")
async def delete_event(event_id: int):
    response = supabase.table('events').delete().eq('id', event_id).execute()
    if response.status_code == 204:
        return {"message": "Event deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Event not found")

# Serve the HTML file
app.mount("/frontend", StaticFiles(directory="frontend"), name="static")

@app.get("/", response_class=HTMLResponse)
async def get_index():
    with open("frontend/index.html") as f:
        return HTMLResponse(content=f.read())