from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
from database import init_db, save_feedback, get_all_feedback, get_stats, delete_feedback
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# --------------------------------------------------
# POST /feedback  — receive, analyze, save feedback
# --------------------------------------------------
@app.route('/feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json()

    name          = data.get('name', 'Guest')
    feedback_text = data.get('feedback_text', '')
    category      = data.get('category', 'General')
    user_role     = data.get('user_role', 'guest')

    if not feedback_text:
        return jsonify({'success': False, 'error': 'Feedback text is required'}), 400

    # Sentiment analysis
    analysis  = TextBlob(feedback_text)
    score     = round(analysis.sentiment.polarity, 4)

    if score > 0.1:
        sentiment = 'Positive'
    elif score < -0.1:
        sentiment = 'Negative'
    else:
        sentiment = 'Neutral'

    save_feedback(name, feedback_text, category, sentiment, score, user_role)

    return jsonify({
        'success'  : True,
        'sentiment': sentiment,
        'score'    : score,
        'message'  : 'Feedback submitted successfully!'
    }), 201


# --------------------------------------------------
# GET /feedback  — return all feedback entries
# --------------------------------------------------
@app.route('/feedback', methods=['GET'])
def fetch_feedback():
    rows = get_all_feedback()
    result = []
    for row in rows:
        result.append({
            'id'           : row[0],
            'name'         : row[1],
            'feedback_text': row[2],
            'category'     : row[3],
            'sentiment'    : row[4],
            'score'        : row[5],
            'user_role'    : row[6],
            'timestamp'    : row[7]
        })
    return jsonify(result), 200


# --------------------------------------------------
# GET /stats  — return sentiment counts for charts
# --------------------------------------------------
@app.route('/stats', methods=['GET'])
def fetch_stats():
    stats = get_stats()
    return jsonify(stats), 200


# --------------------------------------------------
# DELETE /feedback/<id>  — delete one entry
# --------------------------------------------------
@app.route('/feedback/<int:entry_id>', methods=['DELETE'])
def remove_feedback(entry_id):
    delete_feedback(entry_id)
    return jsonify({'success': True, 'message': f'Entry {entry_id} deleted'}), 200


# --------------------------------------------------
# Run the app
# --------------------------------------------------
if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)