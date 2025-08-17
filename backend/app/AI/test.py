import os
from pinecone import Pinecone, ServerlessSpec
from langchain.text_splitter import RecursiveCharacterTextSplitter
from PyPDF2 import PdfReader
from langchain_google_genai import GoogleGenerativeAIEmbeddings 
import google.generativeai as genai
from dotenv import load_dotenv
from langchain_pinecone import PineconeVectorStore


load_dotenv()

google_api_key=os.getenv("GOOGLE_API_KEY")
pc_api_key=os.getenv("PINECONE_API_KEY")

# Read PDF directly from disk
def parse_pdf_local(file_path: str) -> str:
    reader = PdfReader(file_path)
    text = "\n".join([page.extract_text() or "" for page in reader.pages])
    return text

# Chunking config
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,     
    chunk_overlap=200,     
    length_function=len,  
    separators=["\n\n", "\n", " ", ""], 
)

# Get text from PDF
contract_text = parse_pdf_local("app/AI/mou.pdf")

# Split into chunks
chunks = text_splitter.split_text(contract_text)

print(f"Number of chunks: {len(chunks)}")


embedding = GoogleGenerativeAIEmbeddings(google_api_key=google_api_key , model="gemini-embedding-001")

embedded_vectors = []
for chunk in chunks:
    res = embedding.embed_documents([chunk])[0]
    embedded_vectors.append(res)

print(len(embedded_vectors))


#PINECONE

pc = Pinecone(api_key=pc_api_key)

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


# RAG RETRIVAL

question = "What is this document about ?"


question_vector = embedding.embed_query(question)

index = pc.Index(index_name)


res = index.query(vector=question_vector , top_k=15 , include_metadata=True)

# for match in res["matches"]:
#     print(match["score"], match["metadata"]["text"])


context = "\n\n".join([match["metadata"]["text"] for match in res["matches"]])

# Configure Google Generative AI
genai.configure(api_key=google_api_key)

# Create the prompt template
prompt_template = """
You are a helpful assistant that answers questions about a contract.
Use the following context to answer the user's question.
give the response well detailed and remember DO NOT ASSUME anything ... just give me data based on the contract
If the answer is not in the context, say "I cannot find that in the document."

Context:
{context}

Question:
{question}

Answer:
"""

# Format the prompt with context and question
formatted_prompt = prompt_template.format(context=context, question=question)

# Use Google's Gemini model
model = genai.GenerativeModel('gemini-1.5-flash')

response = model.generate_content(formatted_prompt)
rag_answer = response.text
print("Successfully generated RAG answer using Google Gemini")


print("\n--- RAG Answer ---\n")
print(rag_answer)

