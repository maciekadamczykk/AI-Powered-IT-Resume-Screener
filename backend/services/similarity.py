from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_similarity(jd_keywords: list, resume_keywords: list) -> float:
    """Compute cosine similarity between job description and resume keywords."""
    documents = [" ".join(jd_keywords), " ".join(resume_keywords)]
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(documents)
    return cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]