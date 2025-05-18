# Crypto Market Predictor

## Project Description

This tool is a powerful API backend service that helps apps and websites show the latest trends in the crypto market. To continue, it predicts
when the market will go down(Bearish) or go up(Bullish). Users also have the ability to save their coins that they like most using SupaBase, which comes down to their personal preference. In addition, it also provides NEWS or Articles about crypto or other related material about the world
or event that could manipulate the market. Overall, It’s built to power a frontend dashboard or mobile app so users can stay informed and customize their experience.

## Target Browsers

- Desktop: Google Chrome, Firefox, Microsoft Edge,
- Mobile: iOS Safari, Android Chrome

## Developer Manual

See bottom of this README.

## Developer Manual

### Setup Instructions

1. **Clone Repository**
   git clone https://github.com/your-org/your-repo-name.git
   cd server
   pip install fastapi uvicorn requests httpx
   uvicorn main:app --reload

2. **Create Virtual Enviroment**
   Window User:
   python -m venv venv
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\venv\Scripts\Activate.ps1
   After activation, your terminal should look like this: (venv) PS C:\Users\yourname\path\to\server>

Mac Users:
python3 -m venv venv
source venv/bin/activate
After activation, your terminal should look like this: (venv) yourname@yourmachine server %

3. **Select Python Interpreter**
   This is a Crucial Step!!!!
   Both Mac and Window users:
   Press Ctrl + Shift + P(Windows), Press Command + Shift + P(Mac)
   Choose the one that ends like this.
   Window: /server/venv/Scripts/python.exe
   Mac: /server/venv/bin/python

4. **Reload VS Code Window**
   Press Ctrl + Shift + P(Windows) and Press Command + Shift + P(Mac)
   Type Reload Windown and hit Enter

5. **Install required packages**
   Window: pip install fastapi uvicorn httpx requests
   Mac: pip3 install fastapi uvicorn httpx requests
   If the imports are still underlined, then repeat step 3 and reload vs code.
   When successfully installed, write this code:
   uvicorn main:app --reload
   You can finally access the browser at https://localhost:8000

6. **Test Your code with this**

Install pytest- pip install pytest httpx, pip3 install pytest httpx
Create a test_main.py file in your server file and paste this.
This should verify if the api are working

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_market_trends_route():
response = client.get("/api/market-trends")
assert response.status_code == 200
json_data = response.json()
assert "prices" in json_data
assert "prediction" in json_data

def test_user_preferences_post():
sample_data = {
"user": "test_user",
"coin": "bitcoin"
}
response = client.post("/api/user-preferences", json=sample_data)
assert response.status_code == 200
json_data = response.json()
assert "status" in json_data

def test_latest_news_route():
response = client.get("/api/latest-news")
assert response.status_code == 200
json_data = response.json()
assert isinstance(json_data, dict)
if "articles" in json_data:
assert isinstance(json_data["articles"], list)

now type pytest in the terminal to test the code.

### API Endpoints

- `GET /api/market-trends`: Returns top 10 cryptos prices and bullish/bearish predictions
- `POST /api/user-preferences`: saves user settings to Supabase
- `GET /api/latest-news`: Returns the last 10 articles/news of world related events that could affect the market from GNews API

### Known Issues

- tried using a .env file but had to hardcode the keys since it keeps throwing errors.
- No authenticaion System
- No testing for edge cases
- Caching of markets and news data is not efficient

### Roadmap

- Move API keys to .env and use python-dotenv
- Speed things up by caching slow API calls
- Add user authentication
- Create dashboard for logged-in users
