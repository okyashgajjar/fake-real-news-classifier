from fastapi import FastAPI, HTTPException, Depends, Header, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from models import (
    SignupRequest, LoginRequest, LoginResponse, PredictRequest, PredictResponse,
    DashboardStats, LoginDayData, ModelUsageData, DistributionData, PredictionLog,
)
from ml_service import load_models, predict_news
from doc_reader import extract_text
from database import (
    init_db, create_user, get_user_by_email, save_prediction,
    get_all_predictions, get_user_predictions, get_dashboard_stats,
    get_logins_by_day, get_model_usage, get_distribution,
)
from typing import Optional
import bcrypt
from jose import jwt
import os

SECRET_KEY = os.getenv("JWT_SECRET", "fake-news-detector-secret-key-2024")
ALGORITHM = "HS256"

app = FastAPI(title="Fake News Detector API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def verify_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.on_event("startup")
async def startup():
    init_db()
    load_models()


@app.post("/api/signup", response_model=LoginResponse)
async def signup(req: SignupRequest):
    if get_user_by_email(req.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    password_hash = bcrypt.hashpw(req.password.encode(), bcrypt.gensalt()).decode()
    create_user(req.email, req.username, password_hash)
    user = get_user_by_email(req.email)
    token = jwt.encode({"user_id": user["id"], "email": user["email"], "username": user["username"]}, SECRET_KEY, algorithm=ALGORITHM)
    return LoginResponse(token=token, username=user["username"], user_id=user["id"])


@app.post("/api/login", response_model=LoginResponse)
async def login(req: LoginRequest):
    user = get_user_by_email(req.email)
    if not user or not bcrypt.checkpw(req.password.encode(), user["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = jwt.encode({"user_id": user["id"], "email": user["email"], "username": user["username"]}, SECRET_KEY, algorithm=ALGORITHM)
    return LoginResponse(token=token, username=user["username"], user_id=user["id"])


@app.post("/api/predict", response_model=PredictResponse)
async def predict_text(req: PredictRequest, payload: dict = Depends(verify_token)):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    result = predict_news(req.text)
    save_prediction(
        user_id=payload["user_id"],
        username=payload["username"],
        file_format="text",
        original_text=req.text[:500],
        extracted_text=req.text[:2000],
        prediction=result["prediction"],
        confidence=result["confidence"],
        confidence_low=result["confidence_low"],
        confidence_high=result["confidence_high"],
    )
    return PredictResponse(**result, extracted_text=req.text[:2000])


@app.post("/api/predict/upload", response_model=PredictResponse)
async def predict_file(file: UploadFile = File(...), payload: dict = Depends(verify_token)):
    allowed = ["pdf", "docx", "pptx", "txt"]
    ext = file.filename.rsplit(".", 1)[-1].lower()
    if ext not in allowed:
        raise HTTPException(status_code=400, detail=f"Unsupported file type. Allowed: {', '.join(allowed)}")
    file_bytes = await file.read()
    try:
        extracted = extract_text(file.filename, file_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading file: {str(e)}")
    if not extracted.strip():
        raise HTTPException(status_code=400, detail="No text could be extracted from file")
    result = predict_news(extracted)
    save_prediction(
        user_id=payload["user_id"],
        username=payload["username"],
        file_format=ext,
        original_text=file.filename,
        extracted_text=extracted[:2000],
        prediction=result["prediction"],
        confidence=result["confidence"],
        confidence_low=result["confidence_low"],
        confidence_high=result["confidence_high"],
    )
    return PredictResponse(**result, extracted_text=extracted[:2000])


@app.get("/api/predictions")
async def get_predictions(payload: dict = Depends(verify_token)):
    return get_user_predictions(payload["user_id"])


@app.get("/api/admin/predictions")
async def get_all_preds(payload: dict = Depends(verify_token)):
    return get_all_predictions()


@app.get("/api/dashboard/stats")
async def get_stats(payload: dict = Depends(verify_token)):
    return get_dashboard_stats()


@app.get("/api/dashboard/logins")
async def get_logins(payload: dict = Depends(verify_token)):
    data = get_logins_by_day()
    if not data:
        return [
            {"day": "Mon", "logins": 0}, {"day": "Tue", "logins": 0},
            {"day": "Wed", "logins": 0}, {"day": "Thu", "logins": 0},
            {"day": "Fri", "logins": 0}, {"day": "Sat", "logins": 0},
            {"day": "Sun", "logins": 0},
        ]
    return data


@app.get("/api/dashboard/model-usage")
async def get_usage(payload: dict = Depends(verify_token)):
    data = get_model_usage()
    if not data:
        return [{"date": "No data", "users": 0, "predictions": 0, "accuracy": 0}]
    return data


@app.get("/api/dashboard/distribution")
async def get_dist(payload: dict = Depends(verify_token)):
    data = get_distribution()
    if not data:
        return [{"name": "REAL", "value": 0}, {"name": "FAKE", "value": 0}]
    return data


@app.get("/api/health")
async def health():
    return {"status": "ok"}
