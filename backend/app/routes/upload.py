from fastapi import APIRouter, UploadFile, File
from app.services.pdf_parser import parse_pdf
from app.models.upload import UploadResponse

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
async def upload(file: UploadFile = File(...)):
    text = await parse_pdf(file)
    return {"filename": file.filename, "content": text}
