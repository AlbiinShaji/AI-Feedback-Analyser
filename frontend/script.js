// The URL of your Flask backend
const API_URL = "http://127.0.0.1:5000";

// Grab the Submit button and listen for a click
document.getElementById("submit-btn").addEventListener("click", submitFeedback);

async function submitFeedback() {

    // Step 1: Read values from the form
    const name          = document.getElementById("name").value.trim() || "Guest";
    const category      = document.getElementById("category").value;
    const feedback_text = document.getElementById("feedback_text").value.trim();

    // Step 2: Check that feedback text is not empty
    if (!feedback_text) {
        alert("Please write your feedback before submitting.");
        return;
    }

    // Step 3: Show loading state on the button
    const btn = document.getElementById("submit-btn");
    btn.textContent = "Submitting...";
    btn.disabled = true;

    // Step 4: Send data to Flask backend
    try {
        const response = await fetch(`${API_URL}/feedback`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, category, feedback_text })
        });

        const data = await response.json();

        // Step 5: Show the result box
        const resultBox   = document.getElementById("result-box");
        const resultMsg   = document.getElementById("result-message");
        const sentimentLbl = document.getElementById("sentiment-label");

        resultBox.classList.remove("hidden", "positive", "negative", "neutral");
        resultBox.classList.add(data.sentiment.toLowerCase());

        resultMsg.textContent    = data.message;
        sentimentLbl.textContent = `Sentiment: ${data.sentiment} (Score: ${data.score})`;

        // Step 6: Clear the form
        document.getElementById("feedback_text").value = "";
        document.getElementById("name").value = "";

    } catch (error) {
        alert("Could not connect to the server. Make sure Flask is running.");
    }

    // Step 7: Reset button
    btn.textContent = "Submit Feedback";
    btn.disabled = false;
}