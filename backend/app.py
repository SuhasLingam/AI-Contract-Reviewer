from fastapi import FastAPI, UploadFile , File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from PyPDF2 import PdfReader
from io import BytesIO

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return { "message": "hello world" }

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    pdf_bytes = await file.read()
    reader = PdfReader(BytesIO(pdf_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    
    return {
        "filename": file.filename,
        "content": text
    }


if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)