# RUPA backend

Minimal Flask API for local development. No database or external news collection is connected yet.

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
