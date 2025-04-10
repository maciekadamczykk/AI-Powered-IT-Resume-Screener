# Resume Analysis System

## Overview
This project is a Resume Analysis System that helps match resumes with job descriptions using advanced natural language processing and similarity scoring algorithms. The system analyzes resumes against job requirements and provides detailed matching scores across different competency areas.

## Features
- Resume parsing and analysis
- Job description matching
- Competency-based scoring
- Education and experience evaluation
- Interactive web interface
- Real-time analysis results

## Tech Stack
### Backend
- Python
- Flask (Web Framework)
- scikit-learn (for TF-IDF and similarity calculations)
- Natural Language Processing capabilities

### Frontend
- React.js
- Modern UI components
- Interactive file upload
- Real-time result display

## Getting Started

### Prerequisites
- Python 3.12+
- Node.js and npm
- Required Python packages (install using `pip install -r requirements.txt`)

### Installation

1. Clone the repository
2. Set up the backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   python wsgi.py
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Project Structure
```
├── backend/
│   ├── models/          # Data models and schemas
│   ├── services/        # Core business logic
│   │   ├── nlp_processor.py
│   │   ├── resume_parser.py
│   │   └── similarity.py
│   └── app.py          # Flask application
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/ # React components
│       └── App.js
```

## Key Features
- Intelligent resume parsing
- Advanced similarity scoring
- Technical skills analysis
- Experience evaluation
- Education assessment
- Competency mapping
- Real-time results

## Screenshots
Here are some screenshots showcasing the key features of the application:

### Resume Upload
![Resume Upload](/docs/screenshots/upload-resume.png)
*Interface for uploading candidate resumes*

### Job Description Input
![Job Description](/docs/screenshots/job-description.png)
*Job description input and requirements specification*

### Analysis Results
![Analysis Results](/docs/screenshots/analysis-result.png)
*Detailed resume analysis and matching results*

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
