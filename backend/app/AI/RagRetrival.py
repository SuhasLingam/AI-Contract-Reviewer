# pyrefly: ignore [missing-import]
from langchain_google_genai import ChatGoogleGenerativeAI
# pyrefly: ignore [missing-import]
from langchain_core.prompts import PromptTemplate
# pyrefly: ignore [missing-import]
from langchain_core.output_parsers import StrOutputParser
from app.AI.template import RAG_TEMPLATE
import os
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
load_dotenv()


async def RagRetrival(context, question):
    google_api_key = os.getenv("GOOGLE_API_KEY")
    if not google_api_key:
        raise ValueError("GOOGLE_API_KEY environment variable is not set. Please set it in backend/.env")

    llm = ChatGoogleGenerativeAI(
        api_key=google_api_key,
        model="gemini-3.6-flash",
        temperature=0
    )

    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template=RAG_TEMPLATE
    )

    chain = prompt | llm | StrOutputParser()
    result = await chain.ainvoke({"context": context, "question": question})
    return result


