from fastapi import APIRouter, UploadFile, File, Request
from app.services.pdf_parser import parse_pdf
from app.AI.summary import getSummary

router = APIRouter()

@router.post("/upload")
async def upload(request: Request, file: UploadFile = File(...)):
    text = await parse_pdf(file)
    summary = await getSummary(contract_text=text)

    request.app.state.uploaded_result = {
        "filedetails": {
            "filename": file.filename,
            "content": text
        },
        "results": {
            "output": file.filename,
            "result": summary
        }
    }
    return request.app.state.uploaded_result
