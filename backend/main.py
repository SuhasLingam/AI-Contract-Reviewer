from fastapi import FastAPI
from app.core.config import setup_cors
from app.routes import root, upload

app = FastAPI()

setup_cors(app)

# Include routes
app.include_router(root.router)
app.include_router(upload.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
