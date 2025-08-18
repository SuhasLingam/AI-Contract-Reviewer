from fastapi import FastAPI
from app.core.config import setup_cors
from app.routes import root, upload, results

app = FastAPI()

setup_cors(app)

app.state.uploaded_result = None

# Include routes
app.include_router(root.router)
app.include_router(upload.router)
app.include_router(results.router)

if __name__ == "__main__":
    import os
    import uvicorn
    port = int(os.environ.get("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
