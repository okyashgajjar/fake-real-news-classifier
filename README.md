# Fake/Real News Classifier

A full-stack machine learning application that classifies news articles as fake or real using a Ridge Classifier model. The project features a modern React + Vite frontend dashboard and a FastAPI backend with comprehensive analytics and user authentication.

## 🎯 Project Overview

This application combines machine learning with web technologies to detect misinformation in news articles. It uses a **RidgeClassifier** trained on fake and real news datasets to provide predictions with confidence intervals. The application includes user authentication, prediction logging, and an analytics dashboard.

## 🏗️ Architecture

### Tech Stack

| Component | Technologies | Share |
|-----------|-------------|-------|
| **Frontend** | React 19, Vite, TailwindCSS, Recharts | 52.6% |
| **Backend** | Python, FastAPI, Uvicorn | 13.9% |
| **Styling** | CSS | 32.3% |
| **ML/Data** | scikit-learn, pandas | - |
| **Database** | LibSQL (Turso) | - |

### Project Structure

```
fake-real-news-classifier/
├── frontend/                    # React + Vite web application
│   ├── src/                    # React components and pages
│   ├── package.json            # Node dependencies
│   ├── Dockerfile              # Frontend container config
│   ├── nginx.conf              # Nginx reverse proxy config
│   └── vite.config.js          # Vite build configuration
│
├── backend/                     # FastAPI Python backend
│   ├── main.py                 # API endpoints and startup
│   ├── models.py               # Pydantic data models
│   ├── ml_service.py           # ML model loading and prediction
│   ├── database.py             # Database operations
│   ├── doc_reader.py           # Document parsing (PDF, DOCX, PPTX)
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment configuration
│   └── Dockerfile              # Backend container config
│
├── ml_pipelines/               # Trained ML models
│   ├── *.pkl                   # Serialized Ridge Classifier models
│   └── datasets/               # Training data (excluded from build)
│
├── docker-compose.yml          # Multi-container orchestration
├── Dockerfile                  # Backend container build
└── render.yaml                 # Render deployment config
```

## ✨ Features

### 🔍 News Classification
- **Real-time prediction** of news article authenticity
- **Confidence intervals** showing prediction reliability (90% confidence band)
- Support for **multiple file formats**: Text, PDF, DOCX, PPTX
- **Ridge Classifier** model with scikit-learn

### 👤 User Management
- User registration and login with JWT authentication
- Password hashing with bcrypt for security
- User-specific prediction history

### 📊 Analytics Dashboard
- Real-time statistics on predictions made
- Login analytics by day
- Model usage patterns
- Distribution of predictions (Fake vs Real)
- Interactive charts using Recharts

### 🔐 Security
- JWT token-based authentication
- CORS middleware for cross-origin requests
- Password encryption with bcrypt
- Bearer token verification on protected endpoints

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ (for frontend)
- **Python** 3.11+ (for backend)
- **Docker** & **Docker Compose** (optional, for containerized deployment)

### Local Development Setup

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env  # or create .env with required variables
```

**Required Environment Variables:**
```env
JWT_SECRET=your-secret-key-here
DATABASE_URL=your-libsql-database-url
PORT=8000
```

#### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

#### 3. Run Backend

```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### Docker Deployment

Run both services with Docker Compose:

```bash
docker-compose up --build
```

- **Backend** runs on: `http://localhost:8000`
- **Frontend** runs on: `http://localhost` (via Nginx)

## 📡 API Endpoints

### Authentication
- `POST /api/signup` - Register new user
- `POST /api/login` - Login and get JWT token

### Predictions
- `POST /api/predict` - Classify news text (requires authentication)
- `POST /api/predict-file` - Classify from uploaded document

### Analytics (Protected)
- `GET /api/dashboard-stats` - Overall statistics
- `GET /api/logins-by-day` - Login trends
- `GET /api/model-usage` - Model usage patterns
- `GET /api/distribution` - Prediction distribution
- `GET /api/predictions` - User prediction history

## 🤖 Machine Learning Model

### Model Details
- **Algorithm**: Ridge Classifier (L2 regularization)
- **Features**: TF-IDF vectorized text
- **Training Data**: Balanced fake and real news datasets
- **Output**: Binary classification (Fake/Real) with confidence scores

### Model Usage
The model is automatically loaded on application startup:
```python
from ml_service import load_models, predict_news

# Model is loaded in memory
result = predict_news("News text here")
# Returns: {"prediction": "real", "confidence": 0.85, ...}
```

## 📦 Dependencies

### Backend (Python)
```
fastapi==0.115.0           # Web framework
uvicorn==0.30.6            # ASGI server
scikit-learn==1.6.1        # ML models
pandas==2.2.3              # Data manipulation
pydantic==2.9.2            # Data validation
bcrypt==4.2.0              # Password hashing
python-jose==3.3.0         # JWT tokens
libsql-experimental        # Database
python-multipart==0.0.9    # File uploads
PyMuPDF==1.24.10           # PDF processing
python-docx==1.1.2         # DOCX processing
python-pptx==1.0.2         # PPTX processing
```

### Frontend (Node.js)
```
react==19.2.7              # UI library
react-dom==19.2.7          # DOM rendering
vite==8.1.1                # Build tool
react-router-dom==7.18.1   # Routing
recharts==3.9.2            # Charts
lucide-react==1.25.0       # Icons
```

## 🔄 Workflow

1. **User Registration/Login**: Create account and authenticate
2. **Input News**: Paste text or upload documents (PDF, DOCX, PPTX)
3. **Classification**: Backend processes text and predicts authenticity
4. **Results**: Display prediction with confidence interval
5. **Analytics**: Track predictions in personal dashboard

## 🌐 Deployment

### Render.io Deployment
Configuration available in `render.yaml`:

```bash
# Deploy to Render
render deploy
```

### Docker Hub / Registry
```bash
# Build and push backend
docker build -f Dockerfile -t your-registry/fake-news-backend:latest .
docker push your-registry/fake-news-backend:latest

# Build and push frontend
docker build -f frontend/Dockerfile -t your-registry/fake-news-frontend:latest .
docker push your-registry/fake-news-frontend:latest
```

## 📋 Development Notes

### Adding New Features

**Backend API Endpoint:**
1. Define request/response models in `backend/models.py`
2. Implement endpoint in `backend/main.py`
3. Test with FastAPI interactive docs at `/docs`

**Frontend Component:**
1. Create component in `frontend/src/components/`
2. Add route in `frontend/src/App.jsx`
3. Style with Tailwind CSS classes

### Model Retraining
Place trained models (`.pkl` files) in `ml_pipelines/` directory. The startup process automatically loads them.

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check Python version (3.11+), verify `.env` file, check port 8000 availability |
| CORS errors | Ensure CORS middleware in FastAPI is configured correctly |
| Model not loading | Verify `.pkl` files exist in `ml_pipelines/`, check file permissions |
| Database connection fails | Verify `DATABASE_URL` in `.env`, check LibSQL credentials |
| Frontend build fails | Run `npm install` again, clear node_modules cache |

## 📄 License

This project is provided as-is for educational and research purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests to improve the project.

## 📧 Contact & Support

For questions or issues, please open a GitHub issue in the repository.

---

**Built with ❤️ using React, FastAPI, and scikit-learn**
