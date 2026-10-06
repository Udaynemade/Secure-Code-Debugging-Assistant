from fastapi import APIRouter
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel

from app.services.report_service import generate_report


router = APIRouter(
    prefix="/api",
    tags=["Reports"]
)


class ReportRequest(BaseModel):
    result: dict


@router.post("/report")
def create_report(request: ReportRequest):

    report = generate_report(request.result)

    return PlainTextResponse(
        content=report,
        media_type="text/plain",
        headers={
            "Content-Disposition": (
                "attachment; filename=code-analysis-report.txt"
            )
        },
    )