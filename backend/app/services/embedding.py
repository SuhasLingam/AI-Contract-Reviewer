# pyrefly: ignore [missing-import]
from langchain_google_genai import GoogleGenerativeAIEmbeddings
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
import os

load_dotenv()

def get_embedding():
    google_api_key = os.getenv("GOOGLE_API_KEY")
    if not google_api_key:
        raise ValueError("GOOGLE_API_KEY environment variable is not set. Please set it in backend/.env")
    return GoogleGenerativeAIEmbeddings(google_api_key=google_api_key, model="models/gemini-embedding-001")

def createEmbeddings(chunks):
    emb = get_embedding()
    embedded_vectors = []
    for chunk in chunks:
        res = emb.embed_documents([chunk])[0]
        embedded_vectors.append(res)

    print(f"length of Embedded vectors : {len(embedded_vectors)}")
    return embedded_vectors

