# pyrefly: ignore [missing-import]
from langchain_core.prompts import PromptTemplate
# pyrefly: ignore [missing-import]
from langchain_google_genai import ChatGoogleGenerativeAI
# pyrefly: ignore [missing-import]
from langchain_core.output_parsers import StrOutputParser
from app.AI.template import SUMMARY_TEMPLATE
import os
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
load_dotenv()


# api_key = os.getenv("HF_ACCESS_TOKEN")
# base_url = os.getenv("BASE_URL_HUGGINGFACE")
# model = "openai/gpt-oss-120b"

async def getSummary(contract_text: str):
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY environment variable is not set. Please set it in backend/.env")

    prompt = PromptTemplate(
        input_variables=["contract_text"],
        template=SUMMARY_TEMPLATE
    )

    llm = ChatGoogleGenerativeAI(
        api_key=api_key,
        model="gemini-3.6-flash",
        temperature=0,
    )
    
    chain = prompt | llm | StrOutputParser()
    result = await chain.ainvoke({"contract_text": contract_text})
    return result