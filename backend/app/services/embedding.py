from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
import os

load_dotenv()

google_api_key = os.getenv("GOOGLE_API_KEY")

embedding = GoogleGenerativeAIEmbeddings(google_api_key=google_api_key , model="gemini-embedding-001")


def createEmbeddings(chunks):
    embedded_vectors = []
    for chunk in chunks:
        res = embedding.embed_documents([chunk])[0]
        embedded_vectors.append(res)

    print(f"length of Embedded vecotrs : {len(embedded_vectors)} ")

    return embedded_vectors

