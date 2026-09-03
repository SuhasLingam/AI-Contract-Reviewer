from pinecone import Pinecone, ServerlessSpec
import os
import hashlib
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

load_dotenv()

def get_pinecone_client():
    pinecone_api_key = os.getenv("PINECONE_API_KEY")
    if not pinecone_api_key:
        raise ValueError("PINECONE_API_KEY environment variable is not set. Please set it in backend/.env")
    return Pinecone(api_key=pinecone_api_key)

def pinecone(chunks, embedded_vectors, doc_id=None):
    pc = get_pinecone_client()
    index_name = "contract-index"

    dimension = len(embedded_vectors[0]) if embedded_vectors else 768

    if index_name not in [index.name for index in pc.list_indexes()]:
        pc.create_index(
            name=index_name,
            metric="cosine",
            dimension=dimension,
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
            )
        )
    else:
        print("Index already exists")
    
    index = pc.Index(index_name)
    
    def generate_id(doc_id, idx, text):
        raw = f"{doc_id}_{idx}_{text}" if doc_id else f"{text}_{idx}"
        return hashlib.md5(raw.encode("utf-8")).hexdigest()

    to_upsert = []
    for idx, (chunk, vector) in enumerate(zip(chunks, embedded_vectors)):
        vector_id = generate_id(doc_id, idx, chunk)
        metadata = {"text": chunk}
        if doc_id:
            metadata["doc_id"] = doc_id
        to_upsert.append((vector_id, vector, metadata))
    
    index.upsert(vectors=to_upsert)
