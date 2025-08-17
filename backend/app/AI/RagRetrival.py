import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()


google_api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=google_api_key)
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

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


async def RagRetrival(context , question):
    formatted_prompt = prompt_template.format(context=context, question=question)
    response = model.generate_content(formatted_prompt)
    rag_answer = response.text
    # print("Successfully generated RAG answer using Google Gemini")
    # print("\n--- RAG Answer ---\n")
    # print(rag_answer)
    return rag_answer

