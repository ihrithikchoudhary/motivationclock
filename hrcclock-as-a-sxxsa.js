function updateTime() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    document.getElementById("hh").textContent = `${hours}`;
    document.getElementById("mm").textContent = `${minutes}`;
    document.getElementById("ss").textContent = `${seconds}`;
}

updateTime(); // run immediately
setInterval(updateTime, 1000);
// update every second

function checkampm() {
    const now = new Date();
    const hours = now.getHours();
    if (hours < 12) {
        document.getElementById("ampm").innerText = "AM";
    } else {
        document.getElementById("ampm").innerText = "PM";
    }
}

checkampm();
setInterval(checkampm, 1000);

if (!navigator.geolocation) {
    document.getElementById("status").innerText =
        "Geolocation not supported";
} else {
    navigator.geolocation.getCurrentPosition(success, error);
}

function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("Network error");
            return res.json();
        })
        .then(data => {
            document.getElementById("city").innerText = "Your Location";
            document.getElementById("temp").innerText =
                data.current_weather.temperature + "°C";
            document.getElementById("status").innerText =
                "Wind: " + data.current_weather.windspeed + " km/h";
        })
        .catch(err => {
            console.error(err);
            document.getElementById("status").innerText =
                "Failed to fetch weather";
        });
}

function error() {
    document.getElementById("status").innerText =
        "Location permission denied";
}

const API_URL = "https://zenquotes.io/api/random";
const STORAGE_KEY = "daily_quote_v1";

const localQuotes = [
    { q: "Discipline beats motivation every time.", a: "Unknown" },
    { q: "Consistency is more powerful than talent.", a: "Unknown" },
    { q: "Comfort is the enemy of growth.", a: "Unknown" },
    { q: "Results come from systems, not wishes.", a: "Unknown" }
];

function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function showQuote(q, a) {
    document.getElementById("quote").textContent = `"${q}"`;
    document.getElementById("author").textContent = `— ${a}`;
}

async function loadDailyQuote() {
    const today = todayKey();
    const cached = localStorage.getItem(STORAGE_KEY);
    
    if (cached) {
        const data = JSON.parse(cached);
        if (data.date === today) {
            showQuote(data.q, data.a);
            return;
        }
    }
    
    try {
        const res = await fetch(API_URL, { cache: "no-store" });
        if (!res.ok) throw new Error("API failed");

        const data = await res.json();
        const quote = {
            q: data[0].q,
            a: data[0].a,
            date: today
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(quote));
        showQuote(quote.q, quote.a);

    } catch (err) {
        const r = localQuotes[Math.floor(Math.random() * localQuotes.length)];
        showQuote(r.q, r.a);
    }
}
loadDailyQuote();
