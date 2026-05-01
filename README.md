# AI Feedback Analyser

## Project Overview
A full-stack web application that collects user feedback, analyzes
it using sentiment analysis, stores it in a database, and visualizes
the results through dynamic web-based charts.

## Objectives
- Collect text-based feedback through a responsive web form
- Analyze sentiment using TextBlob (Positive / Negative / Neutral)
- Store feedback data persistently in an SQLite database
- Visualize results using Chart.js (pie chart and bar chart)
- Expose data through a RESTful API built with Flask

## Tech Stack
| Layer       | Technology              |
|-------------|-------------------------|
| Frontend    | HTML, CSS, JavaScript   |
| Backend     | Python, Flask           |
| Database    | SQLite                  |
| Sentiment   | TextBlob                |
| Charts      | Chart.js                |
| Tools       | VS Code, Postman, GitHub|

## Project Structure
feedback-app/
├── frontend/
│   ├── index.html       # Feedback submission form
│   ├── dashboard.html   # Analytics dashboard
│   ├── style.css        # All styling
│   ├── script.js        # Form logic and API calls
│   └── dashboard.js     # Chart and table rendering
├── backend/
│   ├── app.py           # Flask server and API routes
│   ├── database.py      # SQLite database functions
│   └── test_sentiment.py# Unit tests
├── requirements.txt     # Python dependencies
└── README.md            # Project documentation

## API Endpoints
| Method | Endpoint            | Description                  |
|--------|---------------------|------------------------------|
| POST   | /feedback           | Submit and analyze feedback  |
| GET    | /feedback           | Retrieve all feedback        |
| GET    | /stats              | Get sentiment counts         |
| DELETE | /feedback/<id>      | Delete a feedback entry      |

## How to Run

### Step 1 — Clone the repository
git clone <your-repo-url>
cd feedback-app

### Step 2 — Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

### Step 3 — Install dependencies
pip install -r requirements.txt

### Step 4 — Run the backend server
python backend/app.py

### Step 5 — Open the frontend
Open `frontend/index.html` using Live Server in VS Code
or visit: `http://127.0.0.1:5500/frontend/index.html`

## How to Run Unit Tests
python backend/test_sentiment.py

## Features
- **Modern Glassmorphism UI**: Beautiful semi-transparent containers with blurred backdrops.
- **Dark/Light Mode Toggle**: Dynamic theme switching with persistent local storage.
- **Responsive Layout**: Fluid CSS Grid and Flexbox layouts for mobile and desktop.
- **Dynamic Charting**: Chart.js graphs that automatically adapt colors to the current theme.
- Responsive feedback form with name, category, and message fields
- Real-time sentiment result shown after submission
- Colour-coded result box (green / red / yellow)
- Admin dashboard with live pie and bar charts
- Full feedback history table with sentiment badges
- RESTful API with proper error handling
- Input validation on both frontend and backend

## User Roles
| Role            | Access                              |
|-----------------|-------------------------------------|
| Guest           | Submit feedback anonymously         |
| Registered User | Submit + view own history (planned) |
| Admin           | View all feedback and analytics     |

## Sentiment Classification Logic
| Score Range      | Label    |
|------------------|----------|
| score > 0.1      | Positive |
| score < -0.1     | Negative |
| -0.1 to 0.1      | Neutral  |

## Known Limitations
- User authentication not implemented in this version
- Registered User role is planned for future development
- TextBlob may not accurately classify very short inputs

## System Architecture
The application follows a client-server architecture:
- **Frontend (HTML/CSS/JS)**: Sends HTTP requests to the Flask backend. Features a modern glassmorphism UI with dark mode.
- **Backend (Python/Flask)**: Processes requests, runs sentiment analysis, and saves to the DB.
- **Database (SQLite)**: Stores all feedback persistently.
- **Visualization (Chart.js)**: Renders live visualizations from API data.

### Database Schema (feedback)
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

## Testing
The application has been thoroughly tested across multiple layers:
1. **Unit Testing (`backend/test_sentiment.py`)**: Tests TextBlob sentiment analysis logic against boundary cases and empty inputs.
2. **Integration Testing**: Postman testing of all REST API endpoints (`GET`, `POST`, `DELETE`) to ensure correct HTTP status codes (200, 201, 400).
3. **UI Testing**: Verification of form validation, dynamic Chart.js rendering, glassmorphism responsiveness across devices, and Dark/Light mode state persistence.

## Challenges and Solutions
| Challenge                        | Solution                              |
|----------------------------------|---------------------------------------|
| CORS error between frontend/backend | Added `flask-cors` to the Flask app |
| Chart not updating after new data | Used `chart.destroy()` before redraw |
| Empty name crashing backend      | Added default value "Guest" in Flask |
| SQLite relative path errors      | Changed `database.py` to use absolute paths based on `__file__` |

## Future Enhancements
- Add user login and registration system
- Export feedback data as CSV
- Add date range filter on dashboard
- Deploy to cloud (Heroku / Render)
- Support for multilingual sentiment analysis