const API_URL = "http://127.0.0.1:5000";

let pieChart = null;
let barChart = null;
let currentEntries = []; // Cache to re-render bar chart without refetching
let currentStats = null;

// Auto-load when page opens
window.addEventListener("load", function () {
    loadStats();
    loadFeedback();
});

// Listen for theme changes to re-render charts with correct colors
window.addEventListener("themeChanged", function() {
    if (currentStats) {
        drawPieChart(currentStats.Positive || 0, currentStats.Negative || 0, currentStats.Neutral || 0);
    }
    if (currentEntries.length > 0) {
        drawBarChart(currentEntries);
    }
});

function getChartColors() {
    const isDark = document.body.classList.contains('dark-mode');
    return {
        textColor: isDark ? '#cbd5e1' : '#475569',
        gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        pieBorder: isDark ? '#1e293b' : '#ffffff'
    };
}

// ── Fetch stats → update cards + pie chart ──
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const stats    = await response.json();
        currentStats = stats;

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
    const colors = getChartColors();
    const ctx = document.getElementById("pieChart").getContext("2d");
    if (pieChart) pieChart.destroy();

    pieChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Positive", "Negative", "Neutral"],
            datasets: [{
                data: [positive, negative, neutral],
                backgroundColor: ["#10b981", "#ef4444", "#f59e0b"],
                borderWidth: 3,
                borderColor: colors.pieBorder
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: colors.textColor,
                        font: { size: 13, family: "'Inter', sans-serif" },
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
        currentEntries = entries;

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

    const colors = getChartColors();
    const ctx = document.getElementById("barChart").getContext("2d");
    if (barChart) barChart.destroy();

    barChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Product", "Service", "General"],
            datasets: [{
                data: [counts.Product, counts.Service, counts.General],
                backgroundColor: ["#6366f1", "#8b5cf6", "#14b8a6"],
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
                    ticks: { stepSize: 1, color: colors.textColor, font: { family: "'Inter', sans-serif" } },
                    grid: { color: colors.gridColor }
                },
                x: {
                    ticks: { color: colors.textColor, font: { family: "'Inter', sans-serif" } },
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
            style="text-align:center;color:var(--text-secondary);padding:24px;">
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