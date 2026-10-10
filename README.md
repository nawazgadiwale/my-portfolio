# React + Django REST + LangChain Portfolio

A static-content React portfolio with a Django REST API, contact submissions stored in SQLite, and a retrieval-grounded LangChain chatbot.

## Requirements
- Python 3.11+
- Node.js 20+
- For Gemini: a Google AI API key
- Or Ollama installed locally for a local model

## 1. Backend setup (Windows PowerShell)
```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```
Edit `backend/.env`. For Gemini, set `LLM_PROVIDER=gemini` and `GOOGLE_API_KEY=...`.
For Ollama, set `LLM_PROVIDER=ollama`, make sure Ollama is running, and pull a chat model and embedding model.

Then:
```powershell
python manage.py migrate
python manage.py runserver
```
API runs at `http://127.0.0.1:8000/api/v1/`.

## 2. Frontend setup
In another terminal:
```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```
Open `http://localhost:5173`.

## API routes
- `GET /api/v1/health/`
- `POST /api/v1/chat/` body: `{"message":"What projects has Nawaz built?"}`
- `POST /api/v1/contact/` body: `{"name":"...","email":"...","message":"..."}`

## Notes
- Portfolio text is static in React (`src/data/portfolio.js`); update it with your verified details.
- Chatbot knowledge is in `backend/apps/chatbot/knowledge.py`. Keep it aligned with your public portfolio.
- FAISS index is built lazily and cached in process memory. It rebuilds when the process restarts. For a larger project, move ingestion to a management command and persist the index.
- The chatbot uses retrieved portfolio context and is instructed to admit when the answer is not present. Retrieval reduces hallucinations but does not guarantee their elimination.
- Configure allowed hosts, HTTPS, secure cookies, and production secrets before deployment.
# my-portfolio
