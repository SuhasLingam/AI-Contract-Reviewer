from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/results")
async def get_results(request: Request):
    if request.app.state.uploaded_result is None:
        return {"error": "No upload yet"}
    return request.app.state.uploaded_result
