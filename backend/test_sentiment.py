from textblob import TextBlob

# ─────────────────────────────────────────
# This is the exact same logic used in app.py
# We test it in isolation here
# ─────────────────────────────────────────

def analyze_sentiment(text):
    analysis = TextBlob(text)
    score    = round(analysis.sentiment.polarity, 4)

    if score > 0.1:
        return "Positive", score
    elif score < -0.1:
        return "Negative", score
    else:
        return "Neutral", score


# ─────────────────────────────────────────
# UNIT TESTS — each test checks one case
# ─────────────────────────────────────────

def test_positive():
    sentiment, score = analyze_sentiment("This product is absolutely amazing!")
    assert sentiment == "Positive", f"Expected Positive, got {sentiment}"
    assert score > 0.1,            f"Expected score > 0.1, got {score}"
    print(f"  PASS  Positive test — score: {score}")


def test_negative():
    sentiment, score = analyze_sentiment("This is terrible and I am very disappointed.")
    assert sentiment == "Negative", f"Expected Negative, got {sentiment}"
    assert score < -0.1,            f"Expected score < -0.1, got {score}"
    print(f"  PASS  Negative test — score: {score}")


def test_neutral():
    sentiment, score = analyze_sentiment("The item was delivered.")
    assert sentiment == "Neutral", f"Expected Neutral, got {sentiment}"
    assert -0.1 <= score <= 0.1,   f"Expected score between -0.1 and 0.1, got {score}"
    print(f"  PASS  Neutral test — score: {score}")


def test_empty_input():
    sentiment, score = analyze_sentiment("")
    assert sentiment == "Neutral", f"Expected Neutral for empty input, got {sentiment}"
    print(f"  PASS  Empty input test — score: {score}")


def test_boundary_positive():
    sentiment, score = analyze_sentiment("good")
    print(f"  INFO  Boundary test 'good' — sentiment: {sentiment}, score: {score}")


# ─────────────────────────────────────────
# RUN ALL TESTS
# ─────────────────────────────────────────

if __name__ == "__main__":
    print("\n Running Unit Tests for Sentiment Analysis\n")
    print("-" * 45)

    try:
        test_positive()
        test_negative()
        test_neutral()
        test_empty_input()
        test_boundary_positive()
    except AssertionError as e:
        print(f"  FAIL  {e}")

    print("-" * 45)
    print(" All tests completed.\n")