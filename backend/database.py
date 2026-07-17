import libsql_experimental as libsql
import os
from dotenv import load_dotenv

load_dotenv()

TURSO_URL = os.getenv("TURSO_DATABASE_URL", "file:local.db")
TURSO_TOKEN = os.getenv("TURSO_AUTH_TOKEN", "")

_conn = None

def get_connection():
    global _conn
    if _conn is None:
        if TURSO_TOKEN:
            _conn = libsql.connect("fake-news.db", sync_url=TURSO_URL, auth_token=TURSO_TOKEN)
            _conn.sync()
        else:
            _conn = libsql.connect("local.db")
    return _conn

def sync_db():
    global _conn
    if _conn and TURSO_TOKEN:
        _conn.sync()

def init_db():
    conn = get_connection()
    # Create tables if they don't exist
    schema_path = os.path.join(os.path.dirname(__file__), "schema.sql")
    with open(schema_path, "r") as f:
        conn.executescript(f.read())
    
    # Auto-migrate: add missing columns
    try:
        conn.execute("ALTER TABLE predictions ADD COLUMN confidence_low REAL")
        conn.commit()
    except Exception:
        pass  # Column already exists
    
    try:
        conn.execute("ALTER TABLE predictions ADD COLUMN confidence_high REAL")
        conn.commit()
    except Exception:
        pass  # Column already exists
    
    sync_db()
    print("Database initialized")

def create_user(email: str, username: str, password_hash: str):
    conn = get_connection()
    try:
        conn.execute(
            "INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)",
            (email, username, password_hash)
        )
        conn.commit()
        sync_db()
        return True
    except Exception as e:
        print(f"Create user error: {e}")
        return False

def get_user_by_email(email: str):
    conn = get_connection()
    result = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    if result:
        return {
            "id": result[0], "email": result[1], "username": result[2],
            "password_hash": result[3], "created_at": result[4],
        }
    return None

def save_prediction(user_id: int, username: str, file_format: str, original_text: str, extracted_text: str, prediction: str, confidence: float, confidence_low: float, confidence_high: float):
    conn = get_connection()
    conn.execute(
        "INSERT INTO predictions (user_id, username, file_format, original_text, extracted_text, prediction, confidence, confidence_low, confidence_high) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (user_id, username, file_format, original_text[:500], extracted_text[:2000], prediction, confidence, confidence_low, confidence_high)
    )
    conn.commit()
    sync_db()

def get_all_predictions():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM predictions ORDER BY created_at DESC").fetchall()
    return [
        {
            "id": r[0], "user_id": r[1], "username": r[2], "file_format": r[3],
            "original_text": r[4], "extracted_text": r[5],
            "prediction": r[6], "confidence": r[7], "confidence_low": r[8],
            "confidence_high": r[9], "created_at": r[10],
        }
        for r in rows
    ]

def get_user_predictions(user_id: int):
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM predictions WHERE user_id = ? ORDER BY created_at DESC", (user_id,)
    ).fetchall()
    return [
        {
            "id": r[0], "user_id": r[1], "username": r[2], "file_format": r[3],
            "original_text": r[4], "extracted_text": r[5],
            "prediction": r[6], "confidence": r[7], "confidence_low": r[8],
            "confidence_high": r[9], "created_at": r[10],
        }
        for r in rows
    ]

def get_dashboard_stats():
    conn = get_connection()
    total = conn.execute("SELECT COUNT(*) FROM predictions").fetchone()[0]
    real = conn.execute("SELECT COUNT(*) FROM predictions WHERE prediction = 'REAL'").fetchone()[0]
    fake = conn.execute("SELECT COUNT(*) FROM predictions WHERE prediction = 'FAKE'").fetchone()[0]
    users = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    accuracy = round((real / total * 100), 1) if total > 0 else 0
    return {"totalPredictions": total, "realCount": real, "fakeCount": fake, "totalUsers": users, "accuracy": accuracy}

def get_logins_by_day():
    conn = get_connection()
    rows = conn.execute("""
        SELECT strftime('%w', created_at) as day_num,
               CASE strftime('%w', created_at)
                   WHEN '0' THEN 'Sun' WHEN '1' THEN 'Mon' WHEN '2' THEN 'Tue'
                   WHEN '3' THEN 'Wed' WHEN '4' THEN 'Thu' WHEN '5' THEN 'Fri'
                   WHEN '6' THEN 'Sat'
               END as day,
               COUNT(*) as count
        FROM predictions
        GROUP BY day_num
        ORDER BY day_num
    """).fetchall()
    return [{"day": r[1], "logins": r[2]} for r in rows]

def get_model_usage():
    conn = get_connection()
    rows = conn.execute("""
        SELECT strftime('%Y-%m', created_at) as month,
               COUNT(DISTINCT user_id) as users,
               COUNT(*) as predictions,
               ROUND(AVG(CASE WHEN prediction = 'REAL' THEN 100.0 ELSE 0 END), 1) as accuracy
        FROM predictions
        GROUP BY month
        ORDER BY month
    """).fetchall()
    return [{"date": r[0], "users": r[1], "predictions": r[2], "accuracy": r[3]} for r in rows]

def get_distribution():
    conn = get_connection()
    rows = conn.execute("SELECT prediction, COUNT(*) as count FROM predictions GROUP BY prediction").fetchall()
    return [{"name": r[0], "value": r[1]} for r in rows]
