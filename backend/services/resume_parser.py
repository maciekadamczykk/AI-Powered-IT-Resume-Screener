import requests
import logging
import os
from datetime import datetime
from typing import Dict, Any

logger = logging.getLogger(__name__)

class ResumeParser:
    def __init__(self):
        self.api_key = os.getenv("AFFINDA_API_KEY")
        self.api_url = "https://api.affinda.com/v2/resumes"
        
        if not self.api_key:
            raise ValueError("AFFINDA_API_KEY environment variable is not set")

    def parse_resume(self, file_obj: Any) -> Dict:
        """Parse resume using Affinda API."""
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            response = requests.post(
                self.api_url,
                headers=headers,
                files={"file": (file_obj.filename, file_obj.stream, 'application/pdf')},
                timeout=30
            )
            response.raise_for_status()
            
            parsed_data = response.json().get("data", {})
            logger.debug(f"Affinda API response keys: {list(parsed_data.keys())}")
            
            return {
                "candidate_name": parsed_data.get("name", {}).get("raw", "No Name Found"),
                "skills": [skill.get("name", "") for skill in parsed_data.get("skills", [])],
                "experience": self._process_experience(parsed_data.get("workExperience", [])),
                "education": parsed_data.get("education", []),
                "raw_text": parsed_data.get("raw_text", "")
            }
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error calling Affinda API: {str(e)}")
            raise
    
    def _process_experience(self, experiences: list) -> list:
        """Process and format work experience entries."""
        processed = []
        for exp in experiences:
            processed.append({
                "title": exp.get("job_title", ""),
                "company": exp.get("organization", "")
            })
        return processed
