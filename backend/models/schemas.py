from pydantic import BaseModel

class ResumeResponse(BaseModel):
    candidate_name: str
    skills: list[str]
    common_keywords: list[str]
    similarity_score: float