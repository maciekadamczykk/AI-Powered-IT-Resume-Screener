import requests
import os

def parse_resume_with_affinda(file) -> dict:
    """Send PDF to Affinda API and return structured data."""
    headers = {"Authorization": f"Bearer {os.getenv('AFFINDA_API_KEY')}"}
    response = requests.post(
        "https://api.affinda.com/v2/resumes",
        headers=headers,
        files={"file": file}
    )
    response.raise_for_status()  # Raise HTTP errors
    return response.json().get("data", {})