//This is where all the coin data will be stored 
let allCoinData = [];

//This will fetch the top 10 cryptocurrencies and display them in the table and chart
async function loadMarketData() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1"
    );
    const data = await res.json();

    //Filter the coins out with no number 
    allCoinData = data.filter((coin) => typeof coin.current_price === "number");
    renderCoinTable(allCoinData);
    renderChart(allCoinData); 
  } catch (error) {
    console.error("Error fetching market data:", error);
  }
}

//Shows the coin data in table 
function renderCoinTable(coins) {
  const tbody = document.getElementById("coinTableBody");
  tbody.innerHTML = "";

  //This will tell if the coin is up or down, in bullish or bearish direction
  coins.forEach((coin) => {
    const isBull = coin.price_change_percentage_24h >= 0;
    const status = `<span style="color: ${isBull ? "green" : "red"}">${
      isBull ? "Bull" : "Bear"
    }</span>`;
    const action = isBull
      ? `<button class="buy-btn">Buy</button>`
      : `<button class="sell-btn">Sell</button>`;

    //Create a row with coin details 
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${coin.name}</td>
      <td>${coin.symbol.toUpperCase()}</td>
      <td>$${coin.current_price.toLocaleString()}</td>
      <td>${status}</td>
      <td>${action}</td>
    `;
    //This onloy load a 30 day history of the coin 
    tr.style.cursor = "pointer";
    tr.onclick = () => loadCoinHistory(coin.id, coin.name);
    tbody.appendChild(tr);
  });
}

//Allows the update of chart instance or destory it 
let chartInstance;

//Load and show 30-day price for one coin 
async function loadCoinHistory(coinId, coinName) {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`
    );
    const data = await res.json();

    //Extrac date and price from API data 
    const labels = data.prices.map((item) => {
      const date = new Date(item[0]);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    const prices = data.prices.map((item) => item[1]);

    //Show line chart of coin history 
    renderLineChart(labels, prices, `${coinName} - Last 30 Days`);
  } catch (error) {
    console.error(`Error fetching historical data for ${coinName}:`, error);
  }
}

//Shows bar chart for all coin prices 
function renderChart(coins) {
  const labels = coins.map((c) => c.name);
  const prices = coins.map((c) => c.current_price);

  //Remove previous chart if it exists 
  if (chartInstance) {
    chartInstance.destroy();
  }

  //This code will create a new bar chart 
  chartInstance = new Chart(document.getElementById("marketChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Current Price (USD)",
          data: prices,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  //Updates teh title
  document.getElementById("chartTitle").textContent = "All Coins Overview";
}

//Specific Line chart for coin history 
function renderLineChart(labels, data, title) {
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(document.getElementById("marketChart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Price (USD)",
          data: data,
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });

  document.getElementById("chartTitle").textContent = title;
}

//Sends the user preference to the backend 
async function loadPreferences() {
  const res = await fetch("/api/savePreference");
  const data = await res.json();
  console.log("Saved Preferences:", data);
}


async function submitPreferences(event) {
  event.preventDefault();

  const user = document.getElementById("user").value;
  const coin = document.getElementById("coin").value;

  async function submitPreferences(event) {
  event.preventDefault();

  const user = document.getElementById("user").value;
  const coin = document.getElementById("coin").value;

  try {
    const response = await fetch("/api/savePreference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, coin }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("✅ Preferences saved!");
    } else {
      alert("❌ Failed to save preference.");
      console.error("Server response:", result);
    }
  } catch (err) {
    console.error("❌ Network error:", err);
    alert("Something went wrong:\n" + err.message);
  }
}
}

async function loadLatestNews() {
  const tbody = document.getElementById("newsTableBody");
  tbody.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

  try {
    const GNEWS_API_KEY = "c93720fed1057e745b15f7a8949e6f17";
    const url = `https://gnews.io/api/v4/search?q=crypto&lang=en&country=us&max=10&apikey=${GNEWS_API_KEY}`;

    const res = await fetch(url);

    // Check for a valid response
    if (!res.ok) {
      let message = `Server error (${res.status})`;

      if (res.status === 429) {
        message = "Rate limit exceeded. Try again later.";
      }

      tbody.innerHTML = `<tr><td colspan='3'>${message}</td></tr>`;
      console.error("GNews API error:", res.status, await res.text());
      return;
    }

    const data = await res.json();

    // Clear previous content
    tbody.innerHTML = "";

    if (!data.articles || !Array.isArray(data.articles)) {
      tbody.innerHTML = "<tr><td colspan='3'>No news articles found.</td></tr>";
      return;
    }

    // Populate table rows
    for (const article of data.articles) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a></td>
        <td>${article.source?.name || "Unknown"}</td>
        <td>${new Date(article.publishedAt).toLocaleString()}</td>
      `;
      tbody.appendChild(tr);
    }

    // If for some reason no articles were appended
    if (tbody.children.length === 0) {
      tbody.innerHTML = "<tr><td colspan='3'>No news available.</td></tr>";
    }

  } catch (err) {
    console.error("Unexpected error while loading news:", err);
    tbody.innerHTML = "<tr><td colspan='3'>Something went wrong. Please try again later.</td></tr>";
  }
}

console.log("chartTitle exists:", document.getElementById("chartTitle"));


document.addEventListener("DOMContentLoaded", function () {
  loadLatestNews();
  loadMarketData();
  document
    .getElementById("prefsForm")
    .addEventListener("submit", submitPreferences);
});
