from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.AI.template import RAG_TEMPLATE
import os
from dotenv import load_dotenv
load_dotenv()


google_api_key = os.getenv("GOOGLE_API_KEY")

llm = ChatGoogleGenerativeAI(
    api_key=google_api_key,
    model="gemini-1.5-flash",
    temperature = 0
)

prompt = PromptTemplate(
    input_variables=["context" , "question"],
    template=RAG_TEMPLATE
)



async def RagRetrival(context , question):
    chain = prompt | llm | StrOutputParser()
    result = await chain.ainvoke({"context": context, "question": question})
    return result


