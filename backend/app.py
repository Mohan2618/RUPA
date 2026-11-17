from flask import Flask, jsonify

app = Flask(__name__)

# Temporary curated data. A database will replace this in a later update.
ANNOUNCEMENTS = [
    {
        "id": "gpt-5-launch",
        "title": "Introducing GPT-5",
        "publisher": "OpenAI",
        "publishedAt": "2025-08-07",
        "dateLabel": "7 Aug 2025",
        "category": "MODEL RELEASE",
        "summary": (
            "OpenAI introduced GPT-5 as a unified AI system with fast responses "
            "and deeper reasoning for complex tasks."
        ),
        "url": "https://openai.com/index/introducing-gpt-5/",
    },
    {
        "id": "gemini-2-5-launch",
        "title": "Introducing Gemini 2.5",
        "publisher": "Google",
        "publishedAt": "2025-03-25",
        "dateLabel": "25 Mar 2025",
        "category": "MODEL RELEASE",
        "summary": (
            "Google introduced Gemini 2.5 Pro Experimental, emphasizing "
            "reasoning, coding, and long-context understanding."
        ),
        "url": (
            "https://blog.google/innovation-and-ai/models-and-research/"
            "google-deepmind/gemini-model-thinking-updates-march-2025/"
        ),
    },
]


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
    return jsonify(ANNOUNCEMENTS)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
