import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "rupa.db"

SEED_ANNOUNCEMENTS = [
    (
        "gpt-5-launch",
        "Introducing GPT-5",
        "OpenAI",
        "2025-08-07",
        "7 Aug 2025",
        "MODEL RELEASE",
        "OpenAI introduced GPT-5 as a unified AI system with fast responses and deeper reasoning for complex tasks.",
        "https://openai.com/index/introducing-gpt-5/",
    ),
    (
        "gemini-2-5-launch",
        "Introducing Gemini 2.5",
        "Google",
        "2025-03-25",
        "25 Mar 2025",
        "MODEL RELEASE",
        "Google introduced Gemini 2.5 Pro Experimental, emphasizing reasoning, coding, and long-context understanding.",
        "https://blog.google/innovation-and-ai/models-and-research/google-deepmind/gemini-model-thinking-updates-march-2025/",
    ),
]


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    with get_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS announcements (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                publisher TEXT NOT NULL,
                published_at TEXT NOT NULL,
                date_label TEXT NOT NULL,
                category TEXT NOT NULL,
                summary TEXT NOT NULL,
                url TEXT NOT NULL
            )
        """)
        connection.executemany("""
            INSERT OR IGNORE INTO announcements (
                id, title, publisher, published_at, date_label,
                category, summary, url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, SEED_ANNOUNCEMENTS)


def list_announcements():
    with get_connection() as connection:
        rows = connection.execute("""
            SELECT id, title, publisher,
                   published_at AS publishedAt,
                   date_label AS dateLabel,
                   category, summary, url
            FROM announcements
            ORDER BY published_at DESC, id
        """).fetchall()
    return [dict(row) for row in rows]


def insert_announcement(item):
    with get_connection() as connection:
        connection.execute("""
            INSERT INTO announcements (
                id, title, publisher, published_at, date_label,
                category, summary, url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            item["id"], item["title"], item["publisher"],
            item["publishedAt"], item["dateLabel"],
            item["category"], item["summary"], item["url"],
        ))
    return item


def delete_announcement(announcement_id):
    with get_connection() as connection:
        cursor = connection.execute(
            "DELETE FROM announcements WHERE id = ?",
            (announcement_id,),
        )
        return cursor.rowcount > 0


def update_announcement(announcement_id, item):
    with get_connection() as connection:
        cursor = connection.execute("""
            UPDATE announcements
            SET title = ?, publisher = ?, published_at = ?, date_label = ?,
                category = ?, summary = ?, url = ?
            WHERE id = ?
        """, (
            item["title"], item["publisher"], item["publishedAt"],
            item["dateLabel"], item["category"], item["summary"],
            item["url"], announcement_id,
        ))
        return cursor.rowcount > 0
