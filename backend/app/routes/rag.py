from fastapi import APIRouter , UploadFile , File
from app.AI.RagRetrival import RagRetrival
from app.services.chunk import createChunks
from app.services.embedding import createEmbeddings , embedding
from app.services.pinecone import pinecone
from app.services.pdf_parser import parse_pdf

router = APIRouter()


@router.post("/rag")
async def rag(file: UploadFile = File(...)):

    contract_text = await parse_pdf(file)
    chunks = await createChunks(contract_text=contract_text)
    embedded_vectors = createEmbeddings(chunks=chunks)
    pinecone(chunks=chunks , embedded_vectors=embedded_vectors)
    
    return {    
        "Result": "Done"
    }

