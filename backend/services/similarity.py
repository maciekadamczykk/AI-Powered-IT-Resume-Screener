from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Union

class SimilarityAnalyzer:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words="english")
        
        # Define core competency areas for data roles
        self.core_competencies = {
            'technical': {
                'programming': ['python', 'r', 'sql', 'excel'],
                'data_processing': ['data cleaning', 'etl', 'data validation', 'data quality'],
                'visualization': ['tableau', 'power bi', 'data studio', 'dashboards'],
                'analysis': ['data analysis', 'exploratory analysis', 'business analytics'],
            },
            'analytical': {
                'statistics': ['statistics', 'analytics', 'metrics', 'kpis'],
                'business': ['business intelligence', 'operational metrics', 'reporting'],
                'research': ['research', 'analysis', 'insights', 'patterns'],
            },
            'business': {
                'collaboration': ['teamwork', 'cross-functional', 'stakeholders', 'communication'],
                'presentation': ['presentation', 'storytelling', 'reports', 'summaries'],
                'tools': ['excel', 'powerpoint', 'microsoft office']
            }
        }
        
    def calculate_similarity_score(self, 
                                 matches: Dict[str, List[str]], 
                                 total_requirements: int,
                                 education: List[Dict],
                                 experience: List[Dict]) -> float:
        """Calculate weighted similarity score with education and experience boosts."""
        if total_requirements == 0:
            return 0.0
            
        # Calculate base scores with more lenient weights
        num_exact = len(matches.get("exact_matches", []))
        num_partial = len(matches.get("partial_matches", []))
        num_related = len(matches.get("related_matches", []))
        
        # Calculate competency coverage
        competency_scores = self._calculate_competency_coverage(
            matches["exact_matches"] + 
            matches["partial_matches"] + 
            matches["related_matches"]
        )
        
        # More lenient weighting system
        total_matches = num_exact + (num_partial * 0.7) + (num_related * 0.5)  # Increased weights for partial and related
        coverage_ratio = total_matches / total_requirements
        
        # Adjusted weighted score with more lenient requirements
        weighted_score = (
            (0.35 * (num_exact / total_requirements)) +      # Reduced from 0.40
            (0.25 * (num_partial / total_requirements)) +    # Increased from 0.15
            (0.15 * (num_related / total_requirements)) +    # Increased from 0.05
            (0.10 * competency_scores['technical']) +        # Reduced from 0.20
            (0.075 * competency_scores['analytical']) +      # Reduced from 0.10
            (0.075 * competency_scores['business'])         # Reduced from 0.10
        )
        
        # More lenient education boost
        education_boost = self._calculate_education_boost(education) * 0.8  # Increased from 0.7
        
        # More lenient experience boost
        experience_boost = self._calculate_experience_boost(experience) * 0.7  # Increased from 0.6
        
        # Calculate advanced competency score with more lenient standards
        advanced_competency = (
            competency_scores['technical'] * 0.4 +
            competency_scores['analytical'] * 0.3 +
            competency_scores['business'] * 0.3
        ) * 0.9  # Increased from 0.8
        
        # More lenient qualification multiplier
        qualification_multiplier = 1.0 + (education_boost * 0.4) + (experience_boost * 0.4)
        
        # Increased senior experience bonus
        if any('senior' in exp.get('title', '').lower() for exp in experience):
            qualification_multiplier += 0.2  # Increased from 0.15
            
        if any('data science' in edu.get('degree', '').lower() for edu in education):
            qualification_multiplier += 0.15  # Increased from 0.1
            
        # More lenient experience scaling
        years_of_experience = len(experience)
        if years_of_experience >= 5:  # Senior level
            qualification_multiplier *= 1.25  # Increased from 1.2
        elif years_of_experience >= 3:  # Mid level
            qualification_multiplier *= 1.15  # Increased from 1.1
            
        # Normalize the score with more lenient weighting
        base_score = (
            weighted_score * 0.6 +  # Reduced core skill matching weight
            advanced_competency * 0.25 +  # Increased competency coverage
            min(1.0, coverage_ratio) * 0.15  # Increased overall coverage impact
        )
        
        # Apply final multipliers with a more lenient cap
        final_score = base_score * min(1.3, qualification_multiplier)  # Increased cap from 1.2
        
        # More lenient handling of overqualified candidates
        if qualification_multiplier > 1.5 and advanced_competency > 0.7:
            final_score = min(0.98, final_score * 1.15)  # Increased cap from 0.95
            
        return min(1.0, max(0.0, final_score))  # Ensure score is between 0 and 1
    
    def _calculate_competency_coverage(self, matched_skills: List[str]) -> Dict[str, float]:
        """Calculate coverage scores for each core competency area."""
        scores = {'technical': 0.0, 'analytical': 0.0, 'business': 0.0}
        matched_skills_lower = [skill.lower() for skill in matched_skills]
        
        for area, categories in self.core_competencies.items():
            area_matches = 0
            total_skills = 0
            
            for category_skills in categories.values():
                total_skills += len(category_skills)
                area_matches += sum(1 for skill in category_skills 
                                  if any(m_skill in skill.lower() 
                                        for m_skill in matched_skills_lower))
            
            scores[area] = area_matches / total_skills if total_skills > 0 else 0.0
            
        return scores
    
    def _calculate_education_boost(self, education: List[Dict]) -> float:
        """Calculate education relevance boost with focus on data science degrees."""
        relevant_degrees = {
            'high': ['data science', 'machine learning', 'artificial intelligence',
                    'statistics', 'mathematics', 'computer science'],
            'medium': ['analytics', 'information systems', 'economics',
                      'engineering', 'physics', 'operations research'],
            'low': ['business', 'management', 'information technology']
        }
        
        max_boost = 0.0
        for edu in education:
            degree = edu.get('degree', '').lower()
            
            if any(rel_degree in degree for rel_degree in relevant_degrees['high']):
                max_boost = max(max_boost, 0.20)  # 20% boost for highly relevant degrees
            elif any(rel_degree in degree for rel_degree in relevant_degrees['medium']):
                max_boost = max(max_boost, 0.15)  # 15% boost for moderately relevant degrees
            elif any(rel_degree in degree for rel_degree in relevant_degrees['low']):
                max_boost = max(max_boost, 0.10)  # 10% boost for somewhat relevant degrees
        
        return max_boost
    
    def _calculate_experience_boost(self, experience: List[Dict]) -> float:
        """Calculate experience boost based on seniority, relevance, and leadership."""
        max_boost = 0.0
        relevant_titles = [
            'data analyst', 'data scientist', 'business analyst', 'analytics',
            'bi analyst', 'data engineer', 'statistical analyst', 'business intelligence'
        ]
        
        leadership_keywords = ['senior', 'lead', 'team', 'manager', 'head']
        years_of_experience = len(experience)
        
        for exp in experience:
            title = exp.get('title', '').lower()
            
            # Check for leadership/senior roles
            is_leadership = any(keyword in title for keyword in leadership_keywords)
            
            # Check relevance
            is_relevant = any(rel_title in title for rel_title in relevant_titles)
            
            # Calculate role-specific boost
            if is_leadership and is_relevant:
                max_boost = max(max_boost, 0.45)  # 45% boost for senior relevant positions
            elif is_leadership:
                max_boost = max(max_boost, 0.35)  # 35% boost for senior positions
            elif is_relevant:
                max_boost = max(max_boost, 0.30)  # 30% boost for relevant positions
            elif 'analyst' in title or 'data' in title:
                max_boost = max(max_boost, 0.20)  # 20% boost for somewhat relevant positions
        
        # Add years of experience bonus
        years_bonus = min(0.30, years_of_experience * 0.05)  # Up to 30% additional boost for experience
        
        # For internship positions, add overqualification bonus
        if years_of_experience >= 5 and max_boost >= 0.35:  # Senior with 5+ years
            max_boost += 0.25  # Additional 25% boost for significant overqualification
            
        return min(0.95, max_boost + years_bonus)  # Cap at 95% to allow for growth
    
    def calculate_context_similarity(self, text1: str, text2: str) -> float:
        """Calculate TF-IDF based cosine similarity between two texts."""
        try:
            # Clean texts by removing special characters and normalizing whitespace
            import re
            
            def clean_text(text):
                # Replace special characters with spaces
                text = re.sub(r'[^\w\s]', ' ', text.lower())
                # Normalize whitespace
                text = re.sub(r'\s+', ' ', text).strip()
                return text
                
            clean_text1 = clean_text(text1)
            clean_text2 = clean_text(text2)
            
            tfidf_matrix = self.vectorizer.fit_transform([clean_text1, clean_text2])
            return float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])
        except Exception:
            return 0.0  # Return 0 if there's any error in calculation
