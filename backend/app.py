from flask import Flask, jsonify

from database import initialize_database, list_announcements

app = Flask(__name__)
initialize_database()


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


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
