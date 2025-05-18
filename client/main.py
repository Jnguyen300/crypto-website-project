from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import requests
import httpx

#

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_TABLE = os.getenv("SUPABASE_TABLE")
GNEWS_API_KEY = os.getenv("GNEWS_API_KEY")

app = FastAPI()

# This calls from any frontend(CORS setting)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This is the route that gets the top ten cryptocurrencies and market prediction
@app.get("/api/market-trends")
def get_market_data():
    market = requests.get("https://api.coingecko.com/api/v3/coins/markets", params={
        'vs_currency': 'usd', 'order': 'market_cap_desc', 'per_page': 10, 'page': 1
    }).json()
    global_data = requests.get("https://api.coingecko.com/api/v3/global").json()
    prediction = "Bull Market" if global_data['data']['market_cap_change_percentage_24h_usd'] > 0 else "Bear Market"
    return {"prices": market, "prediction": prediction}

# Saves the user preferences to Supabase
@app.post("/api/user-preferences")
async def save_preferences(req: Request):
    data = await req.json()
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE}",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },
            json=data
        )
    return {"status": "Preferences saved", "response": response.json()}

@app.get("/api/user-preferences")
async def get_preferences():
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE}?select=*",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
            }
        )
    return response.json()

@app.get("/api/latest-news")
def get_latest_news():
    url = (
        "https://gnews.io/api/v4/search"
        f"?q=crypto&lang=en&country=us&max=10&apikey={GNEWS_API_KEY}"
    )
    response = requests.get(url)
    return response.json()
