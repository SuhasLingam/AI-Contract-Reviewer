from fastapi import APIRouter, UploadFile, File, Request
from app.services.pdf_parser import parse_pdf
from app.AI.summary import getSummary
from app.services.chunk import createChunks
from app.services.embedding import createEmbeddings, embedding
from app.services.pinecone import pinecone, pc
from app.AI.RagRetrival import RagRetrival

router = APIRouter()

@router.post("/upload")
async def upload(request: Request, file: UploadFile = File(...)):
    # Parse PDF
    text = await parse_pdf(file)
    # Get summary
    summary = await getSummary(contract_text=text)
    # Chunking
    chunks = await createChunks(contract_text=text)
    # Embeddings
    embedded_vectors = createEmbeddings(chunks=chunks)
    # Store in Pinecone
    pinecone(chunks=chunks, embedded_vectors=embedded_vectors)

    request.app.state.uploaded_result = {
        "filedetails": {
            "filename": file.filename,
            "content": text
        },
        "results": {
            "summary": summary
        }
    }
    
    return {
        "message": "Contract uploaded, summarized, and indexed successfully",
        "summary": summary
    }

@router.post("/ask-contract")
async def ask_contract(question: str):
    index_name = "contract-index"
    index = pc.Index(index_name)

    question_vector = embedding.embed_query(question)
    
    results = index.query(vector=question_vector, top_k=10, include_metadata=True)
    chunks = [match["metadata"]["text"] for match in results["matches"]]
    context = "\n\n".join(chunks)

    # RAG step
    response = await RagRetrival(context=context, question=question)

    return {
        "query": question,
        "response": response
    }
