# Project Report
## Feedback Sentiment Analyzer
**Course:** Mini Project
**Date:** April 2026

---

## 1. Introduction

### 1.1 Context
Feedback is essential for improving services, products, and user
experience. Traditional feedback systems often lack real-time
analysis and visualization. This project addresses that gap by
building a web-based feedback system that collects, analyzes,
stores, and visualizes user feedback instantly.

### 1.2 Objective
To build a full-stack web application that:
- Enables users to submit text-based feedback
- Processes input using sentiment analysis on the backend
- Stores data in a structured database
- Visualizes results using dynamic web-based charts

---

## 2. System Design

### 2.1 Application Structure

**User Roles:**
- Guest: Submits feedback anonymously
- Registered User: Submits feedback and views history (planned)
- Admin: Views and analyzes all feedback via dashboard

**Feedback Type:**
- Text-based feedback (product reviews, service comments)

**Data Fields:**

| Field         | Type     | Description                        |
|---------------|----------|------------------------------------|
| id            | INTEGER  | Auto-generated primary key         |
| name          | TEXT     | Submitter name or "Guest"          |
| feedback_text | TEXT     | The feedback message               |
| category      | TEXT     | Product / Service / General        |
| sentiment     | TEXT     | Positive / Negative / Neutral      |
| score         | REAL     | Polarity score (-1.0 to +1.0)      |
| user_role     | TEXT     | guest / user / admin               |
| timestamp     | DATETIME | Date and time of submission        |

### 2.2 System Architecture

The application follows a client-server architecture:

- Frontend (HTML/CSS/JS) sends HTTP requests to Flask backend
- Flask processes requests, runs sentiment analysis, saves to DB
- SQLite stores all feedback persistently
- Chart.js renders live visualizations from API data

### 2.3 API Endpoints

| Method | Endpoint       | Function                        |
|--------|----------------|---------------------------------|
| POST   | /feedback      | Receive, analyze, store feedback|
| GET    | /feedback      | Return all entries as JSON      |
| GET    | /stats         | Return sentiment counts         |
| DELETE | /feedback/<id> | Remove one entry by ID          |

### 2.4 Sentiment Classification

TextBlob analyzes each feedback text and returns a polarity
score between -1.0 and +1.0. Classification rules:

- Score > 0.1  → Positive
- Score < -0.1 → Negative
- Score between -0.1 and 0.1 → Neutral

---

## 3. Implementation

### 3.1 Frontend
Built using HTML5, CSS3, and vanilla JavaScript.

- index.html: Feedback form with name, category, and message fields
- dashboard.html: Analytics page with charts and feedback table
- style.css: Responsive styling for both pages
- script.js: Handles form submission and displays sentiment result
- dashboard.js: Fetches data and renders Chart.js visualizations

### 3.2 Backend
Built using Python and Flask framework.

- app.py: Defines all four REST API routes with error handling
- database.py: Manages SQLite connection, all CRUD operations
- CORS enabled to allow frontend-backend communication

### 3.3 Database
SQLite database (feedback.db) with a single feedback table.
Initialized automatically when app.py is run for the first time.

### 3.4 Sentiment Analysis
TextBlob library used for natural language processing.
Analyzes polarity of each feedback text submission.
Returns a float score which is stored alongside the label.

### 3.5 Data Visualization
Chart.js library loaded via CDN.

- Pie Chart: Shows proportion of Positive / Negative / Neutral
- Bar Chart: Shows number of entries per category
- Table: Shows all feedback with colour-coded sentiment badges

---

## 4. Testing

### 4.1 Unit Testing
File: backend/test_sentiment.py
Five test cases written using Python assert statements:

| Test Case       | Input                              | Expected  | Result |
|-----------------|------------------------------------|-----------|--------|
| Positive text   | "This product is absolutely amazing"| Positive  | PASS   |
| Negative text   | "This is terrible, very disappointed"| Negative | PASS   |
| Neutral text    | "The item was delivered"           | Neutral   | PASS   |
| Empty input     | ""                                 | Neutral   | PASS   |
| Boundary case   | "good"                             | Positive  | PASS   |

### 4.2 Integration Testing (Postman)

| Test | Endpoint            | Method | Expected Status | Result |
|------|---------------------|--------|-----------------|--------|
| T1   | /feedback           | POST   | 201 Created     | PASS   |
| T2   | /feedback           | GET    | 200 OK          | PASS   |
| T3   | /stats              | GET    | 200 OK          | PASS   |
| T4   | /feedback (empty)   | POST   | 400 Bad Request | PASS   |
| T5   | /feedback/<id>      | DELETE | 200 OK          | PASS   |

### 4.3 UI Testing

| Test  | Description                        | Result |
|-------|------------------------------------|--------|
| UI-01 | Form loads without errors          | PASS   |
| UI-02 | Empty submission shows alert       | PASS   |
| UI-03 | Positive feedback → green box      | PASS   |
| UI-04 | Negative feedback → red box        | PASS   |
| UI-05 | Neutral feedback → yellow box      | PASS   |
| UI-06 | Blank name defaults to Guest       | PASS   |
| UI-07 | Dashboard link works               | PASS   |
| UI-08 | Responsive on mobile width         | PASS   |
| DB-01 | Stat cards show correct numbers    | PASS   |
| DB-02 | Pie chart renders correctly        | PASS   |
| DB-03 | Bar chart renders correctly        | PASS   |
| DB-04 | Table shows all entries with badges| PASS   |

---

## 5. Results

The application successfully:
- Collects and validates user feedback through a clean web form
- Analyzes sentiment in real time using TextBlob
- Stores all entries persistently in SQLite
- Displays live analytics via pie chart, bar chart, and table
- Handles errors gracefully (empty input, server errors)
- Works responsively on different screen sizes

---

## 6. Challenges and Solutions

| Challenge                        | Solution                              |
|----------------------------------|---------------------------------------|
| CORS error between frontend/backend | Added flask-cors to Flask app      |
| Chart not updating after new data | Used chart.destroy() before redraw  |
| Empty name crashing backend      | Added default value "Guest" in Flask |
| Sentiment wrong for short words  | Noted as TextBlob limitation         |

---

## 7. Conclusion

This project successfully demonstrates the integration of core
web technologies — HTML, CSS, JavaScript, REST APIs, Flask, and
SQLite — to build a functional full-stack application. The system
collects real user feedback, processes it intelligently using
sentiment analysis, and presents the results through a clean,
interactive dashboard. All project milestones were completed and
all tests passed successfully.

---

## 8. Future Enhancements

- User login and registration system
- CSV export of feedback data
- Date range filter on the dashboard
- Deployment to a cloud platform (Render / Heroku)
- Support for multilingual sentiment analysis