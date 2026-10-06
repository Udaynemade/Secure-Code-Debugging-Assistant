from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.code_analyzer import analyze_code


router = APIRouter(
    prefix="/api",
    tags=["Code Analysis"]
)


class CodeAnalysisRequest(BaseModel):
    code: str
    language: str = "C++"


@router.post("/analyze")
def analyze_source_code(request: CodeAnalysisRequest):

    if not request.code.strip():
        raise HTTPException(
            status_code=400,
            detail="Code cannot be empty."
        )

    result = analyze_code(
        request.code,
        request.language
    )

    return {
        "success": True,
        "result": result
    }