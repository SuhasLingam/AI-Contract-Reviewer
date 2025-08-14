from pydantic import BaseModel

class FileDetails(BaseModel):
    filename: str
    content: str

class Results(BaseModel):
    output: str
    result: str

class UploadResponse(BaseModel):
    filedetails: FileDetails
    results: Results