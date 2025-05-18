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
