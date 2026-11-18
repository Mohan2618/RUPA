import re
import sqlite3
from datetime import date
from urllib.parse import urlparse

from flask import Flask, jsonify, request

from database import initialize_database, insert_announcement, list_announcements

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024
initialize_database()

REQUIRED_FIELDS = ("id", "title", "publisher", "publishedAt", "category", "summary", "url")
MAX_LENGTHS = {
    "id": 100,
    "title": 200,
    "publisher": 120,
    "category": 80,
    "summary": 2000,
    "url": 2048,
}


@app.get("/api/health")
def health():
    return jsonify({
        "application": "RUPA",
        "service": "backend",
        "status": "ok",
        "version": "0.1.0",
    })


@app.get("/api/announcements")
def get_announcements():
    return jsonify(list_announcements())


@app.post("/api/announcements")
def create_announcement():
    # Development-only write endpoint. Add authentication before public deployment.
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 415

    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "Expected a JSON object"}), 400

    item = {}
    for field in REQUIRED_FIELDS:
        value = payload.get(field)
        if not isinstance(value, str) or not value.strip():
            return jsonify({"error": f"{field} must be a non-empty string"}), 400
        item[field] = value.strip()
        if len(item[field]) > MAX_LENGTHS[field]:
            return jsonify({"error": f"{field} is too long"}), 400

    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", item["id"]):
        return jsonify({"error": "id must be lowercase letters, numbers, or hyphens"}), 400

    try:
        published = date.fromisoformat(item["publishedAt"])
    except ValueError:
        return jsonify({"error": "publishedAt must be a valid YYYY-MM-DD date"}), 400
    if published.isoformat() != item["publishedAt"]:
        return jsonify({"error": "publishedAt must use YYYY-MM-DD format"}), 400

    parsed_url = urlparse(item["url"])
    if parsed_url.scheme != "https" or not parsed_url.hostname or parsed_url.username or parsed_url.password:
        return jsonify({"error": "url must be a valid HTTPS URL"}), 400

    item["dateLabel"] = published.strftime("%d %b %Y").lstrip("0")

    try:
        insert_announcement(item)
    except sqlite3.IntegrityError:
        return jsonify({"error": "An announcement with this id already exists"}), 409

    return jsonify(item), 201


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
