import spacy
import logging
from typing import List, Dict, Set

logger = logging.getLogger(__name__)

class NLPProcessor:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
        self.skill_variations = {
            # Data Analysis Core Skills
            'data analysis': ['data analytics', 'analytical skills', 'data insights', 'exploratory analysis', 'data analysis concepts',
                            'data analysis techniques', 'analytical thinking', 'quantitative analysis', 'qualitative analysis',
                            'data interpretation', 'analytical mindset', 'analytical approach', 'data analytics concepts'],
            
            # Tools and Technologies
            'excel': ['microsoft excel', 'ms excel', 'spreadsheet', 'excel vba', 'advanced excel', 'spreadsheet analysis',
                     'microsoft office', 'office suite'],
            'sql': ['mysql', 'postgresql', 'oracle sql', 'database', 'databases', 'querying', 't-sql', 'pl/sql', 'sql server',
                   'database management', 'rdbms', 'nosql', 'bigquery', 'data storage', 'data management systems'],
            'python': ['py', 'python programming', 'python development', 'pandas', 'numpy', 'scikit-learn', 'python libraries',
                      'programming language', 'coding skills', 'programming skills'],
            'r': ['r programming', 'r language', 'r studio', 'tidyverse', 'ggplot2', 'programming language',
                  'statistical programming', 'data analysis tool'],
            'power bi': ['powerbi', 'power-bi', 'microsoft bi', 'dax', 'power query', 'business intelligence tools',
                        'bi tools', 'reporting tools', 'dashboard tools'],
            'tableau': ['tableau desktop', 'tableau visualization', 'tableau prep', 'data visualization tools',
                       'bi tools', 'reporting tools', 'dashboard creation'],
            
            # Analysis and Statistics
            'analytical skills': ['analytical thinking', 'problem solving', 'critical thinking', 'attention to detail',
                                'analytical mindset', 'data-driven', 'logical thinking', 'analytical approach',
                                'quantitative skills', 'analytical ability'],
            'statistics': ['statistical analysis', 'statistical modeling', 'stats', 'hypothesis testing', 'statistical methods',
                         'descriptive statistics', 'inferential statistics', 'statistical tools', 'quantitative analysis'],
            'data validation': ['data quality', 'data accuracy', 'data cleaning', 'data verification', 'quality assurance',
                              'data integrity', 'data quality control', 'data preprocessing', 'data preparation'],
            'pattern recognition': ['trend analysis', 'pattern identification', 'insights generation', 'data patterns',
                                  'trend identification', 'pattern discovery', 'data exploration'],
            
            # Data Tools & Libraries
            'jupyter': ['jupyter notebook', 'jupyter lab', 'ipython', 'interactive computing'],
            'scikit-learn': ['sklearn', 'machine learning library', 'ml libraries'],
            'tensorflow': ['tf', 'keras', 'deep learning framework'],
            'visualization': ['data visualization', 'visualizing', 'visual analytics', 'plotly', 'seaborn', 'charts', 'graphs',
                            'dashboards', 'reporting tools'],
            
            # Database & Data Management
            'database': ['sql', 'mysql', 'postgresql', 'oracle', 'databases', 'database management', 'rdbms', 
                        'database systems', 'data storage', 'data management'],
            
            # Business Skills and Communication
            'business intelligence': ['bi tools', 'bi development', 'business analytics', 'analytics tools',
                                    'power bi', 'tableau', 'looker', 'data studio', 'business reporting',
                                    'business metrics', 'business insights'],
            'communication': ['stakeholder communication', 'team collaboration', 'presentation skills',
                            'teamwork', 'cross-functional collaboration', 'interpersonal skills',
                            'stakeholder management', 'team player', 'collaborative work'],
            'reporting': ['report generation', 'report development', 'dashboards', 'metrics reporting',
                         'kpi reporting', 'business reporting', 'data presentation', 'executive summaries',
                         'status reports', 'performance reporting', 'visualization'],
            'business acumen': ['business understanding', 'business operations', 'operational metrics',
                              'business processes', 'strategic thinking', 'business strategy',
                              'process optimization', 'business requirements']
        }
        
        self.data_skills = [
            # Core Data Analysis
            'data analysis', 'data analytics', 'data visualization', 'statistical analysis',
            'data cleaning', 'data collection', 'data mining', 'data modeling',
            'data reporting', 'data transformation', 'data quality', 'exploratory analysis',
            'etl', 'data pipeline', 'data integration',
            
            # Tools and Software
            'excel', 'pivot tables', 'vlookup', 'spreadsheets', 'power pivot',
            'tableau', 'power bi', 'looker', 'data studio', 'qlik',
            'sql', 'mysql', 'postgresql', 'oracle', 'database', 'mongodb', 'nosql',
            'python', 'r', 'spss', 'sas', 'stata', 'matlab', 'scala',
            'jupyter', 'vscode', 'git', 'docker',
            
            # Data Science & ML
            'machine learning', 'deep learning', 'neural networks', 'ai',
            'natural language processing', 'nlp', 'computer vision',
            'scikit-learn', 'tensorflow', 'pytorch', 'keras',
            'regression', 'classification', 'clustering',
            
            # Big Data
            'hadoop', 'spark', 'hive', 'kafka', 'airflow',
            'aws', 'azure', 'gcp', 'cloud computing',
            'data warehouse', 'data lake', 'big data',
            
            # Statistics & Math
            'statistics', 'probability', 'hypothesis testing',
            'a/b testing', 'experimental design', 'time series',
            'linear algebra', 'calculus', 'optimization',
            
            # Visualization & Reporting
            'matplotlib', 'seaborn', 'plotly', 'bokeh',
            'dashboard design', 'storytelling', 'presentation',
            
            # Soft Skills
            'problem solving', 'analytical thinking', 'communication',
            'teamwork', 'project management', 'agile'
        ]
        
        self.skill_groups = {
            'data_analysis': [
                'data analysis', 'analytics', 'statistical analysis', 'data cleaning', 'etl',
                'exploratory analysis', 'data insights', 'data validation', 'data quality',
                'quantitative analysis', 'qualitative analysis', 'business analytics'
            ],
            'visualization': [
                'tableau', 'power bi', 'data visualization', 'matplotlib', 'seaborn',
                'dashboards', 'reporting', 'visual analytics', 'charts', 'graphs',
                'business intelligence', 'bi tools'
            ],
            'programming': [
                'python', 'r', 'sql', 'scala', 'java', 'programming', 'coding',
                'scripting', 'development', 'software engineering'
            ],
            'database': [
                'sql', 'mysql', 'postgresql', 'mongodb', 'data warehouse', 'database',
                'databases', 'data storage', 'data management', 'rdbms', 'bigquery'
            ],
            'statistics': [
                'statistics', 'hypothesis testing', 'a/b testing', 'regression',
                'statistical analysis', 'statistical modeling', 'quantitative methods',
                'probability', 'metrics', 'kpis'
            ],
            'business': [
                'business intelligence', 'kpi', 'metrics', 'reporting', 'stakeholder management',
                'business analytics', 'business strategy', 'operations', 'process optimization'
            ],
            'soft_skills': [
                'communication', 'teamwork', 'leadership', 'collaboration', 'analytical thinking',
                'problem solving', 'attention to detail', 'project management', 'stakeholder management'
            ],
            'tools': [
                'excel', 'microsoft office', 'powerpoint', 'tableau', 'power bi',
                'business intelligence tools', 'data analysis tools', 'visualization tools'
            ],
            'advanced': [
                'team leadership', 'mentoring', 'strategy', 'predictive modeling',
                'machine learning', 'data pipeline', 'automation', 'cloud platforms'
            ]
        }

    def extract_keywords(self, text: str) -> List[str]:
        """Extract keywords from text using spaCy and custom rules."""
        # Clean text by removing special characters and normalizing whitespace
        import re
        cleaned_text = re.sub(r'[^\w\s]', ' ', text.lower())
        cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()
        
        doc = self.nlp(cleaned_text)
        keywords = set()
        
        # Extract from noun chunks
        for chunk in doc.noun_chunks:
            chunk_text = chunk.text.lower().strip()
            
            # Direct matches
            if chunk_text in self.data_skills:
                keywords.add(chunk_text)
                continue
            
            # Check variations
            for main_skill, variations in self.skill_variations.items():
                if chunk_text in variations or main_skill in chunk_text:
                    keywords.add(main_skill)
                    break
            
            # Check for skill phrases
            if any(skill in chunk_text for skill in self.data_skills):
                keywords.add(chunk_text)
        
        # Extract from individual tokens
        for token in doc:
            if not token.is_stop and len(token.text) > 2:
                if token.text.lower() in self.data_skills:
                    keywords.add(token.text.lower())
        
        return list(keywords)

    def find_related_skills(self, keyword: str) -> Set[str]:
        """Find skills that are related to the given keyword with context awareness."""
        keyword = keyword.lower()
        related = set()
        
        # Check direct variations first
        for main_skill, variations in self.skill_variations.items():
            if keyword == main_skill.lower() or keyword in [v.lower() for v in variations]:
                related.update([main_skill] + variations)
        
        # Check skill groups for broader relationships
        for group, skills in self.skill_groups.items():
            if keyword in [s.lower() for s in skills]:
                related.update(skills)
                
        # Special handling for experience-based skill implications
        experience_implications = {
            'senior': {'team leadership', 'stakeholder management', 'strategy', 'mentoring'},
            'data analyst': {'data analysis', 'sql', 'reporting', 'analytics'},
            'business intelligence': {'power bi', 'tableau', 'data visualization', 'kpi reporting'},
            'machine learning': {'python', 'statistics', 'data analysis', 'modeling'},
            'data visualization': {'reporting', 'dashboards', 'presentation', 'communication'}
        }
        
        # Add implied skills based on role and experience
        for exp_type, implied_skills in experience_implications.items():
            if exp_type in keyword:
                related.update(implied_skills)
        
        return related

    def analyze_skill_matches(self, job_keywords: List[str], 
                            candidate_keywords: List[str]) -> Dict:
        """Analyze matches between job requirements and candidate skills."""
        import re
        
        def normalize_text(text):
            # Remove special characters and standardize whitespace
            text = re.sub(r'[^\w\s]', ' ', text.lower())
            text = re.sub(r'\s+', ' ', text).strip()
            return text
        
        matching_keywords = []
        partial_matches = []
        related_matches = []
        missing_keywords = []
        
        # Normalize all keywords before comparison
        candidate_keywords_lower = [normalize_text(k) for k in candidate_keywords]
        
        for jd_keyword in job_keywords:
            jd_keyword_lower = normalize_text(jd_keyword)
            
            # First check if the keyword or its variations are direct matches
            found_direct_match = False
            for main_skill, variations in self.skill_variations.items():
                normalized_main = normalize_text(main_skill)
                normalized_variations = [normalize_text(var) for var in variations]
                
                if jd_keyword_lower == normalized_main or jd_keyword_lower in normalized_variations:
                    # Check if candidate has the main skill or any of its variations
                    if (normalized_main in candidate_keywords_lower or 
                        any(var in candidate_keywords_lower for var in normalized_variations)):
                        matching_keywords.append(jd_keyword)
                        found_direct_match = True
                        break
            
            if found_direct_match:
                continue
                
            # Check exact matches
            if jd_keyword_lower in candidate_keywords_lower or any(jd_keyword_lower == norm_cand for norm_cand in candidate_keywords_lower):
                matching_keywords.append(jd_keyword)
                continue
            
            # Check partial and related matches
            found_match = False
            for candidate_keyword in candidate_keywords:
                candidate_lower = normalize_text(candidate_keyword)
                
                # Check variations of candidate skills
                for main_skill, variations in self.skill_variations.items():
                    normalized_main = normalize_text(main_skill)
                    normalized_variations = [normalize_text(var) for var in variations]
                    
                    if candidate_lower == normalized_main or candidate_lower in normalized_variations:
                        if (jd_keyword_lower == normalized_main or 
                            jd_keyword_lower in normalized_variations or
                            any(var in jd_keyword_lower for var in normalized_variations)):
                            partial_matches.append(jd_keyword)
                            found_match = True
                            break
                
                if found_match:
                    break
                    
                # Traditional partial matches - with word-level comparison for more accuracy
                jd_words = jd_keyword_lower.split()
                candidate_words = candidate_lower.split()
                
                # Check if any complete words match between the two
                if any(word in candidate_words for word in jd_words if len(word) > 2):
                    partial_matches.append(jd_keyword)
                    found_match = True
                    break
                
                # Check for longer substring matches
                if (jd_keyword_lower in candidate_lower or candidate_lower in jd_keyword_lower) and len(jd_keyword_lower) > 3:
                    partial_matches.append(jd_keyword)
                    found_match = True
                    break
                
                # Related skills
                related_skills = self.find_related_skills(jd_keyword)
                normalized_related = [normalize_text(s) for s in related_skills]
                if candidate_lower in normalized_related:
                    related_matches.append(jd_keyword)
                    found_match = True
                    break
            
            if not found_match:
                # Double check against all variations before marking as missing
                variation_found = False
                for main_skill, variations in self.skill_variations.items():
                    normalized_main = normalize_text(main_skill)
                    normalized_variations = [normalize_text(var) for var in variations]
                    
                    if (jd_keyword_lower == normalized_main or jd_keyword_lower in normalized_variations):
                        for candidate_keyword in candidate_keywords:
                            candidate_lower = normalize_text(candidate_keyword)
                            if (normalized_main in candidate_lower or 
                                any(var in candidate_lower for var in normalized_variations)):
                                related_matches.append(jd_keyword)
                                variation_found = True
                                break
                    if variation_found:
                        break
                        
                if not variation_found:
                    missing_keywords.append(jd_keyword)
        
        return {
            "exact_matches": matching_keywords,
            "partial_matches": partial_matches,
            "related_matches": related_matches,
            "missing": missing_keywords
        }
