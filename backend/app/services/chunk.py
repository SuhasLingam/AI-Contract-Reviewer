# pyrefly: ignore [missing-import]
try:
    # pyrefly: ignore [missing-import]
    from langchain_text_splitters import RecursiveCharacterTextSplitter
except ImportError:
    # pyrefly: ignore [missing-import]
    from langchain.text_splitter import RecursiveCharacterTextSplitter

async def createChunks(contract_text):
    textspiltter = RecursiveCharacterTextSplitter(
        chunk_size=1000,     
        chunk_overlap=200,     
        length_function=len,  
        separators=["\n\n", "\n", " ", ""], 
    )

    chunks = textspiltter.split_text(contract_text)
    print(f"Number of chunks: {len(chunks)}")
    return chunks
