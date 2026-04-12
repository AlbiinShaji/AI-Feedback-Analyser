const API_URL = "http://127.0.0.1:5000";

let pieChart = null;
let barChart = null;

// Auto-load when page opens
window.addEventListener("load", function () {
    loadStats();
    loadFeedback();
});

// ── Fetch stats → update cards + pie chart ──
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const stats    = await response.json();

        const positive = stats.Positive || 0;
        const negative = stats.Negative || 0;
        const neutral  = stats.Neutral  || 0;
        const total    = positive + negative + neutral;

        document.getElementById("total-count").textContent    = total;
        document.getElementById("positive-count").textContent = positive;
        document.getElementById("negative-count").textContent = negative;

        drawPieChart(positive, negative, neutral);

    } catch (err) {
        console.error("Stats error:", err);
    }
}

// ── Pie chart ──
function drawPieChart(positive, negative, neutral) {
    const ctx = document.getElementById("pieChart").getContext("2d");
    if (pieChart) pieChart.destroy();

    pieChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Positive", "Negative", "Neutral"],
            datasets: [{
                data: [positive, negative, neutral],
                backgroundColor: ["#2ecc71", "#e74c3c", "#f39c12"],
                borderWidth: 2,
                borderColor: "#fff"
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        font: { size: 12 },
                        padding: 16,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

// ── Fetch all feedback → table + bar chart ──
async function loadFeedback() {
    try {
        const response = await fetch(`${API_URL}/feedback`);
        const entries  = await response.json();

        drawBarChart(entries);
        populateTable(entries);

    } catch (err) {
        console.error("Feedback error:", err);
    }
}

// ── Bar chart ──
function drawBarChart(entries) {
    const counts = { Product: 0, Service: 0, General: 0 };
    entries.forEach(function (e) {
        if (counts[e.category] !== undefined) counts[e.category]++;
    });

    const ctx = document.getElementById("barChart").getContext("2d");
    if (barChart) barChart.destroy();

    barChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Product", "Service", "General"],
            datasets: [{
                data: [counts.Product, counts.Service, counts.General],
                backgroundColor: ["#3498db", "#9b59b6", "#1abc9c"],
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 },
                    grid: { color: "#f0f0f0" }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// ── Feedback table ──
function populateTable(entries) {
    const tbody = document.getElementById("table-body");
    tbody.innerHTML = "";

    if (entries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5"
            style="text-align:center;color:#aaa;padding:24px;">
            No feedback yet.</td></tr>`;
        return;
    }

    entries.forEach(function (e) {
        const time = new Date(e.timestamp).toLocaleTimeString([], {
            hour: "2-digit", minute: "2-digit"
        });

        const badge =
            e.sentiment === "Positive" ? "badge-positive" :
            e.sentiment === "Negative" ? "badge-negative" :
            "badge-neutral";

        tbody.innerHTML += `
            <tr>
                <td>${e.name}</td>
                <td>${e.feedback_text}</td>
                <td>${e.category}</td>
                <td><span class="badge ${badge}">${e.sentiment}</span></td>
                <td>${time}</td>
            </tr>`;
    });
}