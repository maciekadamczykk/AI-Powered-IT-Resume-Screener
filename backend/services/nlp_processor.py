import spacy

nlp = spacy.load("en_core_web_sm")

def extract_keywords(text: str) -> list[str]:
    """Extract NOUNs/PROPNs from text using spaCy."""
    doc = nlp(text)
    return [token.text.lower() for token in doc if token.pos_ in ("NOUN", "PROPN")]