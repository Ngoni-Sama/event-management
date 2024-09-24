import os
from fastapi import FastAPI
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

# Serve the HTML file
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def get_index():
    with open("static/index.html") as f:
        return HTMLResponse(content=f.read())