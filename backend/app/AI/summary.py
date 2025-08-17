from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser
from app.AI.template import template
import os
from dotenv import load_dotenv
load_dotenv()


# api_key = os.getenv("HF_ACCESS_TOKEN")
# base_url = os.getenv("BASE_URL_HUGGINGFACE")
# model = "openai/gpt-oss-120b"

api_key = os.getenv("GOOGLE_API_KEY")
model="gemini-1.5-flash"


async def getSummary(contract_text: str):
    prompt = PromptTemplate(
        input_variables=["contract_text"],
        template=template
    )

    llm = ChatGoogleGenerativeAI(
        api_key=api_key,
        model=model,
        temperature=0,
    )
    
    chain = prompt | llm | StrOutputParser()
    result = await chain.ainvoke({"contract_text": contract_text})
    return result