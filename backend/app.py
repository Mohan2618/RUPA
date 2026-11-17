from flask import Flask, jsonify

app = Flask(__name__)


@app.get("/api/health")
def health():
    return jsonify({
        "application": "RUPA",
        "service": "backend",
        "status": "ok",
        "version": "0.1.0",
    })


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
