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

def pinecone(chunks , embedded_vectors):
    pc = get_pinecone_client()
    index_name="contract-index"

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
    
    def generate_id(text):
        return hashlib.md5(text.encode("utf-8")).hexdigest()

    to_upsert = []
    for chunk, vector in zip(chunks, embedded_vectors):
        vector_id = generate_id(chunk)  # deterministic ID
        to_upsert.append((vector_id, vector, {"text": chunk}))
    
    index.upsert(vectors=to_upsert)
