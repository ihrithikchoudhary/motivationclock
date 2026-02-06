// Daily Quotes
const API_URL = "https://zenquotes.io/api/random";
const STORAGE_KEY = "daily_quote_v1";
const localQuotes = [
    { q: "Discipline beats motivation every time.", a: "Unknown" },
    { q: "Consistency is more powerful than talent.", a: "Unknown" },
    { q: "Comfort is the enemy of growth.", a: "Unknown" },
    { q: "You can meet a better you"},
    { q: "Be loyal to your future, not your past"},
    { q: "A new day to try again."},
     { q: "A great future doesn't require a great past"},
     { q: "Thanks for using this digital clock: Hrithik Choudhary", a: "Hrithik Choudhary"},
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
