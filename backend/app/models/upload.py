from pydantic import BaseModel

class UploadResponse(BaseModel):
    filename: str
    content: str
