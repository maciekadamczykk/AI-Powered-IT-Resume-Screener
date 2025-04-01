from flask import Flask, request, jsonify
from config import DEFAULT_JOB_DESCRIPTION
from flask_cors import CORS
import requests
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
from dotenv import load_dotenv
import logging
from datetime import datetime

# Initialize logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='app.log',
    filemode='a'
)

# Load environment variables
load_dotenv()

# Initialize Flask app with CORS
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load Spacy's English model
nlp = spacy.load("en_core_web_sm")

# Affinda API configuration
API_KEY = os.getenv("AFFINDA_API_KEY")
API_URL = "https://api.affinda.com/v2/resumes"


@app.route("/process_resume", methods=["POST"])
def process_resume():
    """Endpoint to process resume PDF and return matching results"""
    try:
        # Debug: Print received files
        print("\nReceived request with files:", request.files)

        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        print(f"Processing file: {file.filename}")

        # Send to Affinda API
        headers = {"Authorization": f"Bearer {API_KEY}"}
        response = requests.post(
            API_URL,
            headers=headers,
            files={"file": (file.filename, file.stream, 'application/pdf')},
            timeout=30
        )
        response.raise_for_status()

        parsed_data = response.json().get("data", {})
        print("Affinda returned:", list(parsed_data.keys()))

        # Extract data
        candidate_name = parsed_data.get("name", {}).get("raw", "No Name Found")
        candidate_skills = [skill.get("name", "") for skill in parsed_data.get("skills", [])]

        # Process job description
        job_description = DEFAULT_JOB_DESCRIPTION

        # Calculate similarity
        def extract_keywords(text):
            doc = nlp(text)
            return [token.text.lower() for token in doc
                    if token.pos_ in ('NOUN', 'PROPN') and not token.is_stop]

        jd_keywords = extract_keywords(job_description)
        skills_keywords = extract_keywords(" ".join(candidate_skills))

        documents = [" ".join(jd_keywords), " ".join(skills_keywords)]
        vectorizer = TfidfVectorizer(stop_words="english")
        tfidf_matrix = vectorizer.fit_transform(documents)
        similarity_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

        return jsonify({
            "candidate_name": candidate_name,
            "skills": candidate_skills,
            "common_keywords": list(set(jd_keywords) & set(skills_keywords)),
            "cosine_similarity": float(similarity_score)
        })

    except Exception as e:
        logging.exception("Error in process_resume:")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)