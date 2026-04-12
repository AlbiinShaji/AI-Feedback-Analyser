import sqlite3
from datetime import datetime

DATABASE = "backend/feedback.db"


def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS feedback (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            name          TEXT,
            feedback_text TEXT NOT NULL,
            category      TEXT,
            sentiment     TEXT,
            score         REAL,
            user_role     TEXT DEFAULT 'guest',
            timestamp     DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()
    print("Database initialised successfully.")


def save_feedback(name, feedback_text, category, sentiment, score, user_role):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO feedback (name, feedback_text, category, sentiment, score, user_role)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (name, feedback_text, category, sentiment, score, user_role))
    conn.commit()
    conn.close()


def get_all_feedback():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM feedback ORDER BY timestamp DESC')
    rows = cursor.fetchall()
    conn.close()
    return rows


def get_stats():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT sentiment, COUNT(*) as count
        FROM feedback
        GROUP BY sentiment
    ''')
    rows = cursor.fetchall()
    conn.close()

    stats = {'Positive': 0, 'Negative': 0, 'Neutral': 0}
    for row in rows:
        stats[row[0]] = row[1]
    return stats


def delete_feedback(entry_id):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM feedback WHERE id = ?', (entry_id,))
    conn.commit()
    conn.close()