from PyPDF2 import PdfReader
from io import BytesIO
from fastapi import UploadFile

async def parse_pdf(file: UploadFile) -> str:
    pdf_bytes = await file.read()
    reader = PdfReader(BytesIO(pdf_bytes))
    text = "\n".join([page.extract_text() or "" for page in reader.pages])
    return text
