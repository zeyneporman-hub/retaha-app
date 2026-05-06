from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def init_db():
    conn = sqlite3.connect("clicks.db")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS clicks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hotel_id TEXT,
            button_name TEXT,
            timestamp TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

class Click(BaseModel):
    hotel_id: str
    button_name: str
    timestamp: str

@app.post("/track")
def track_click(click: Click):
    conn = sqlite3.connect("clicks.db")
    conn.execute("INSERT INTO clicks (hotel_id, button_name, timestamp) VALUES (?, ?, ?)",
                 (click.hotel_id, click.button_name, click.timestamp))
    conn.commit()
    conn.close()
    return {"status": "ok"}

@app.get("/stats/{hotel_id}")
def get_stats(hotel_id: str):
    conn = sqlite3.connect("clicks.db")
    cursor = conn.execute(
        "SELECT button_name, COUNT(*) as count FROM clicks WHERE hotel_id = ? GROUP BY button_name",
        (hotel_id,)
    )
    rows = cursor.fetchall()
    conn.close()
    return {"hotel_id": hotel_id, "stats": [{"button": r[0], "count": r[1]} for r in rows]}

@app.get("/stats/{hotel_id}/filter")
def get_stats_filtered(hotel_id: str, period: str = "all"):
    conn = sqlite3.connect("clicks.db")
    if period == "today":
        cursor = conn.execute(
            "SELECT button_name, COUNT(*) FROM clicks WHERE hotel_id = ? AND date(timestamp, '+3 hours') = date('now', '+3 hours') GROUP BY button_name",
            (hotel_id,)
        )
    elif period == "week":
        cursor = conn.execute(
            "SELECT button_name, COUNT(*) FROM clicks WHERE hotel_id = ? AND timestamp >= datetime('now', '-7 days') GROUP BY button_name",
            (hotel_id,)
        )
    elif period == "month":
        cursor = conn.execute(
            "SELECT button_name, COUNT(*) FROM clicks WHERE hotel_id = ? AND timestamp >= datetime('now', '-30 days') GROUP BY button_name",
            (hotel_id,)
        )
    else:
        cursor = conn.execute(
            "SELECT button_name, COUNT(*) FROM clicks WHERE hotel_id = ? GROUP BY button_name",
            (hotel_id,)
        )
    rows = cursor.fetchall()
    conn.close()
    return {"hotel_id": hotel_id, "period": period, "stats": [{"button": r[0], "count": r[1]} for r in rows]}