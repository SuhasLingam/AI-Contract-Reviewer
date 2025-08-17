from fastapi import APIRouter , UploadFile , File
from app.AI.RagRetrival import RagRetrival
from app.services.chunk import createChunks
from app.services.embedding import createEmbeddings , embedding
from app.services.pinecone import pinecone , pc
from app.services.pdf_parser import parse_pdf

router = APIRouter()



@router.post("/rag")
async def rag(file: UploadFile = File(...)):

    contract_text = await parse_pdf(file)
    chunks = await createChunks(contract_text=contract_text)
    embedded_vectors = createEmbeddings(chunks=chunks)
    pinecone(chunks=chunks , embedded_vectors=embedded_vectors)
    
    return {    
        "Result": "Succesfully Created Chunks, Embedding Done and Updated To Pinecone"
    }

@router.post("/ask-contract")
async def ask_contract(question: str):
    question_vector = embedding.embed_query(question)
    index_name="contract-index"

    index = pc.Index(index_name)
    results = index.query(vector=question_vector , top_k=10 , include_metadata=True)
    chunks = [match["metadata"]["text"] for match in results["matches"]]
    context = "\n\n".join(chunks)

    # RAGGGGGG

    response = await RagRetrival(context=context , question=question)

    return {
        "result" : response
    }



