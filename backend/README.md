# RUPA backend

Minimal Flask API for local development. Announcements are stored in a local SQLite database (`rupa.db`), automatically created on first startup and seeded with two curated historical announcements. External news collection is not connected yet.

## Windows PowerShell setup

From the RUPA project root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Visit http://127.0.0.1:5000/api/health to check the backend.

Expected JSON:

```json
{
  "application": "RUPA",
  "service": "backend",
  "status": "ok",
  "version": "0.1.0"
}
```

Keep this terminal running. Start the React frontend in a separate terminal from the project root with `npm run dev`.

This is a development server only; it is not configured for production.

## Create an announcement (local development only)

Send a POST request to `http://127.0.0.1:5000/api/announcements` with header
`Content-Type: application/json` and a JSON body:

```json
{
  "id": "sample-ai-update",
  "title": "Sample AI update",
  "publisher": "Example Publisher",
  "publishedAt": "2026-11-18",
  "category": "TECHNOLOGY UPDATE",
  "summary": "A sample announcement for testing the local RUPA API.",
  "url": "https://example.com/"
}
```

The API generates `dateLabel` automatically. A valid new record returns HTTP 201.
Sending the same ID again returns HTTP 409. Missing or invalid fields return HTTP 400.
The GET endpoint returns the saved announcement, and React displays it after refresh.

**Security:** This POST route has no authentication. Run Flask on loopback for local
testing only; do not expose this write endpoint on the public internet.

## Delete an announcement (local development only)

Send `DELETE http://127.0.0.1:5000/api/announcements/sample-ai-update` in Postman.

- HTTP 200: `{"message":"Announcement deleted","id":"sample-ai-update"}`
- HTTP 404: `{"error":"Announcement not found"}`

**Note:** The two initial demo announcements are inserted again when Flask restarts if they have been deleted. Test deletion using your own record such as `sample-ai-update`.

Do not expose this unauthenticated write endpoint publicly.
