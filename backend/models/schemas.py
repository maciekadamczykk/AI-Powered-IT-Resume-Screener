from pydantic import BaseModel
from typing import Dict, List

class Experience(BaseModel):
    title: str
    company: str

class ResumeResponse(BaseModel):
    candidate_name: str
    skills: List[str]
    common_keywords: List[str]
    similarity_score: float
    experience: List[Experience]