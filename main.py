import requests
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
from dotenv import load_dotenv

load_dotenv()


# -----------------------------
# PART 1: Resume Parsing with Affinda
# -----------------------------
API_KEY = os.getenv("AFFINDA_API_KEY")
API_URL = "https://api.affinda.com/v2/resumes"
file_path = "FinanceSampleResume.pdf"

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

# Open and send the resume
with open(file_path, "rb") as file:
    response = requests.post(API_URL, headers=headers, files={"file": file})

# Check response and parse data
if response.status_code == 200:
    parsed_data = response.json()
    # Uncomment the following line if you want to see the full JSON response
    # print(parsed_data)
else:
    print("Error:", response.status_code, response.text)
    exit()

# Extract candidate data from parsed_data
resume = parsed_data.get('data', {})

# Extract candidate name
candidate_name = resume.get('name', {}).get('raw', 'No Name Found')

# Extract candidate skills (as a list)
candidate_skills = [skill.get('name', '') for skill in resume.get('skills', [])]

# Extract work experience (list of job entries)
candidate_experience = resume.get('workExperience', [])

print("Candidate:", candidate_name)
print("Skills:", candidate_skills)
print("Number of Experience entries:", len(candidate_experience))

# -----------------------------
# PART 2: Job Description Matching & NLP (Free)
# -----------------------------
# Load Spacy's English model
nlp = spacy.load("en_core_web_sm")

# Sample job description text
job_description = """
We are seeking a candidate with strong expertise in corporate finance,
excellent analytical skills, proficiency with Microsoft Excel, and experience in financial reporting.
"""

# Convert candidate skills list to a single string for analysis
candidate_skills_text = ", ".join(candidate_skills)

# Extract keywords using Spacy for both job description and candidate skills
def extract_keywords(text):
    doc = nlp(text)
    # Extract nouns and proper nouns as keywords
    keywords = [token.text for token in doc if token.pos_ in ('NOUN', 'PROPN')]
    return keywords

jd_keywords = extract_keywords(job_description)
skills_keywords = extract_keywords(candidate_skills_text)

print("\nJob Description Keywords:", jd_keywords)
print("Candidate Skills Keywords:", skills_keywords)

# -----------------------------
# PART 3: Keyword Matching
# -----------------------------
# Find common keywords between the job description and candidate's skills
common_keywords = set(jd_keywords).intersection(set(skills_keywords))
print("\nCommon Keywords between Job Description and Candidate Skills:", common_keywords)

# -----------------------------
# PART 4: Cosine Similarity
# -----------------------------
# Convert job description and candidate skills keywords to a single string for comparison
jd_keywords_text = " ".join(jd_keywords)
skills_keywords_text = " ".join(skills_keywords)

# Calculate the similarity between the job description and candidate's skills using TF-IDF
documents = [jd_keywords_text, skills_keywords_text]
vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(documents)
similarity_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

print("\nCosine Similarity Score between Job Description and Candidate Skills:", similarity_score)
