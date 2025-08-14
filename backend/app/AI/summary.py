from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains.llm import LLMChain
# from app.AI.template import template
import os
from dotenv import load_dotenv
load_dotenv()


api_key = os.getenv("OPENROUTER_API_KEY")
base_url = os.getenv("BASE_URL_OPENROUTER")
model = os.getenv("MODEL")

template="""
You are an expert AI Contract Reviewer specializing in legal analysis for risk management, compliance, and contract optimization.

## Objective
Review the following contract text and produce a detailed analysis with the following sections:

### 1. Clause Summaries
- Summarize each clause in plain language.
- Keep summaries short (2–3 sentences each).
- Include the clause title if identifiable.

### 2. Risk Assessment
- Assign a **risk level** for each clause: Low, Medium, or High.
- Justify why you assigned this risk level.
- Highlight any potentially harmful or one-sided terms.

### 3. Missing Clauses
- Identify important clauses that are commonly found in contracts of this type but are absent.
- Examples: termination rights, dispute resolution, confidentiality, payment timelines, liability limitations.
- For each missing clause, explain why it’s important.

### 4. Ambiguous Language
- Highlight any vague or unclear wording.
- Suggest more precise wording where applicable.

### 5. Compliance Check
- Flag any sections that might be **non-compliant** with:
  - GDPR (if personal data is involved)
  - Intellectual Property rights
  - Labor laws (if employment-related)
  - Any other relevant legal frameworks based on the content.

### 6. Overall Risk Summary
- Provide an **Overall Risk Rating** for the entire contract (Low, Medium, High).
- Provide a short paragraph summarizing the key risks and recommendations.

## Output Format
Respond ONLY in valid JSON with the following structure:

{{
  "clauses": [
    {{
      "title": "Clause Title",
      "summary": "Short summary of clause",
      "risk": "Low | Medium | High",
      "justification": "Why this risk level was chosen"
    }}
  ],
  "missing_clauses": [
    {{
      "name": "Clause Name",
      "reason": "Why this clause is important"
    }}
  ],
  "ambiguous_terms": [
    {{
      "text": "The ambiguous wording",
      "suggestion": "Proposed clearer wording"
    }}
  ],
  "compliance_flags": [
    {{
      "issue": "Description of compliance concern",
      "reference": "Relevant law/regulation"
    }}
  ],
  "overall_risk": "Low | Medium | High",
  "summary": "Overall contract assessment summary"
}}

## Contract Text to Analyze:
\"\"\"{contract_text}\"\"\"


REMEMBER GIVE IN A VALID JSON ONLY 
"""

async def getSummary(contract_text: str):
    prompt = PromptTemplate(
        input_variables=["contract_text"],
        template=template
    )
    connect_llm = ChatOpenAI(
        api_key=api_key,
        base_url=base_url,
        model=model,
        temperature=0
    )
    llm_chain = LLMChain(
        llm=connect_llm,
        prompt=prompt
    )
    result = await llm_chain.arun(contract_text=contract_text)
    return result