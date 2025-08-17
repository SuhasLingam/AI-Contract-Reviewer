from pinecone import Pinecone, ServerlessSpec
import os
from dotenv import load_dotenv

load_dotenv()

google_api_key=os.getenv("GOOGLE_API_KEY")
pinecone_api_key=os.getenv("PINECONE_API_KEY")

pc = Pinecone(api_key=pinecone_api_key)

def pinecone(chunks , embedded_vectors):

    index_name="contract-index"

    if index_name not in [index.name for index in pc.list_indexes()]:
        pc.create_index(
            name=index_name,
            metric="cosine",
            dimension=3072,
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
            )
        )
    else:
        print("Index already exists")
        index = pc.Index(index_name)
    
        import hashlib
        def generate_id(text):
            return hashlib.md5(text.encode("utf-8")).hexdigest()
    
        to_upsert = []
        for chunk, vector in zip(chunks, embedded_vectors):
            vector_id = generate_id(chunk)  # deterministic ID
            to_upsert.append((vector_id, vector, {"text": chunk}))
        
        
        index.upsert(vectors=to_upsert)
