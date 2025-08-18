# AI Contract Reviewer

A full‑stack application to upload contracts (PDF), analyze them with AI, and query the document via a chat interface. The backend produces strict JSON with clause‑level insights, risks, ambiguities, missing clauses, compliance flags, and negotiation tips. The frontend renders a modern analysis dashboard and conversational RAG interface.

## Features

- Upload and parse PDF contracts
- AI analysis (Gemini via LangChain) with strict JSON output
- Clause summaries with risk levels and scores, justifications, and recommendations
- Obligations for each party, unusual terms, dependencies, citations
- Missing clauses and ambiguous terms detection with suggestions
- Compliance flags (e.g., GDPR, IP, Labor), risk overview and heatmap
- Timeline milestones and renewal details when present
- RAG‑powered Q&A over the uploaded document using Pinecone
- Modern React UI: analysis dashboard + chat interface
- Robust error handling and responsive design

## Tech Stack

- Backend: FastAPI, Uvicorn, PyPDF2, python‑dotenv
- AI/LLM: LangChain, Google Generative AI (Gemini)
- Vector DB: Pinecone
- Frontend: React + TypeScript, Vite, Tailwind CSS

## Repository Structure

```
AI_Contract_Reviewer/
  backend/          # FastAPI app
  frontend/         # React + Vite app
  PROJECT_OVERVIEW.md
  README.md         # This file
```

## Local Development

### Prerequisites

- Python 3.10+
- Node.js 18+ (or Bun)

### Backend

```bash
cd backend
python -m venv .venv && .venv/Scripts/activate  # Windows
# source .venv/bin/activate                      # macOS/Linux
pip install -r requirements.txt

# Create backend/.env
# GOOGLE_API_KEY=...
# PINECONE_API_KEY=...        # required for RAG
# PORT=8000                   # optional, defaults to 8000

python main.py
# Server: http://127.0.0.1:8000
```

### Frontend

```bash
cd frontend
npm install   # or bun install

# Optional: frontend/.env (or .env.development)
# BACKEND_URL=http://127.0.0.1:8000

npm run dev
# Dev server: http://localhost:5173
```

## Environment Variables

Backend (`backend/.env`):

- `GOOGLE_API_KEY` (required)
- `PINECONE_API_KEY` (required for RAG features)
- `PORT` (optional; defaults to 8000; on Render, `PORT` is injected)

Frontend (injected at build time via Vite):

- `BACKEND_URL` (production base URL for the backend). In development, the app defaults to `http://127.0.0.1:8000`.

Notes:

- Vite flags are automatic: `import.meta.env.DEV` in dev server, `import.meta.env.PROD` in builds.
- The frontend reads `BACKEND_URL` at build time (see `frontend/vite.config.ts`).

## API Reference (Backend)

Base URL:

- Dev: `http://127.0.0.1:8000`
- Prod: set in frontend via `BACKEND_URL` (e.g., `https://api.example.com`)

Endpoints:

- `GET /` → Basic health/info
- `POST /upload` → Upload and analyze a contract
  - Form-data: `file` (multipart)
  - Returns a message and `summary` (string containing JSON that the client parses)
- `GET /results` → Retrieve last analysis stored in-memory for this process
- `POST /ask-contract` → Ask a question (RAG) about the uploaded contract
  - JSON body: `{ "question": string }`
  - Returns `{ "query": string, "response": string }` where `response` is JSON as a string

Examples:

```bash
# Upload
curl -F "file=@/path/to/contract.pdf" http://127.0.0.1:8000/upload

# Ask question
curl -H "Content-Type: application/json" \
     -d '{"question":"What is the termination clause?"}' \
     http://127.0.0.1:8000/ask-contract
```

## Implementation Details

- Parsing: `PyPDF2` extracts text from uploaded PDF
- Chunking: LangChain `RecursiveCharacterTextSplitter`
- Embeddings: `GoogleGenerativeAIEmbeddings`
- Vector DB: Pinecone (index `contract-index`, cosine, dimension 3072)
- RAG: query Pinecone → build context → Gemini via LangChain prompt → strict JSON
- CORS: enabled for all origins in `app/core/config.py` (adjust for production)

## Deployment

### Backend (Render)

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `python main.py`
- Env vars: `GOOGLE_API_KEY`, `PINECONE_API_KEY` (needed for RAG). `PORT` is injected; the app binds to `0.0.0.0:$PORT`.

### Frontend (Vercel)

- Root directory: `frontend`
- Build command: `npm run build` (or `bun run build`)
- Output directory: `dist`
- Env var: `BACKEND_URL` (e.g., `https://your-backend.example.com`)
- TypeScript build: `@types/node` installed and `types: ["node"]` set for `vite.config.ts` so `process` is typed.
