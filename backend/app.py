from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import os
from dotenv import load_dotenv
from services.nlp_processor import NLPProcessor
from services.resume_parser import ResumeParser
from services.similarity import SimilarityAnalyzer

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def create_app():
    # Load environment variables
    load_dotenv()
    
    # Initialize Flask app
    app = Flask(__name__)
    CORS(app)
    
    # Initialize services
    nlp_processor = NLPProcessor()
    resume_parser = ResumeParser()
    similarity_analyzer = SimilarityAnalyzer()
    
    @app.route("/health", methods=["GET"])
    def health_check():
        """Health check endpoint."""
        return jsonify({"status": "healthy"}), 200
    
    @app.route("/process_resume", methods=["POST"])
    def process_resume():
        """Process resume and return analysis results."""
        try:
            logger.info("Starting resume processing request")
            
            # Validate request
            if 'file' not in request.files:
                return jsonify({"error": "No file uploaded"}), 400
            
            file = request.files['file']
            if file.filename == '':
                return jsonify({"error": "No selected file"}), 400
            
            # Get and validate job description
            job_description = request.form.get('jobDescription')
            if not job_description:
                return jsonify({"error": "Job description is required"}), 400
            
            # Parse resume
            logger.info(f"Processing file: {file.filename}")
            parsed_resume = resume_parser.parse_resume(file)
            
            # Extract keywords
            job_keywords = nlp_processor.extract_keywords(job_description)
            resume_keywords = nlp_processor.extract_keywords(parsed_resume["raw_text"])
            skills_keywords = nlp_processor.extract_keywords(" ".join(parsed_resume["skills"]))
            
            # Combine resume keywords with extracted skills
            all_candidate_keywords = list(set(resume_keywords + skills_keywords))
            
            # Analyze skill matches
            matches = nlp_processor.analyze_skill_matches(job_keywords, all_candidate_keywords)
            
            # Calculate similarity score
            similarity_score = similarity_analyzer.calculate_similarity_score(
                matches=matches,
                total_requirements=len(job_keywords),
                education=parsed_resume["education"],
                experience=parsed_resume["experience"]
            )
            
            # Prepare response
            response = {
                "candidate_name": parsed_resume["candidate_name"],
                "skills": sorted(list(set(parsed_resume["skills"]))),
                "job_keywords": sorted(job_keywords),
                "common_keywords": sorted(list(set(
                    matches["exact_matches"] + 
                    matches["partial_matches"] + 
                    matches["related_matches"]
                ))),
                "missing_keywords": sorted(matches["missing"]),
                "similarity_score": similarity_score,
                "experience": parsed_resume["experience"]
            }
            
            logger.info("Resume processing completed successfully")
            return jsonify(response)
            
        except Exception as e:
            logger.exception("Error processing resume:")
            return jsonify({"error": str(e)}), 500
    
    return app

# Create the Flask application
app = create_app()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)