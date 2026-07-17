from pydantic import BaseModel
from typing import Optional


class SignupRequest(BaseModel):
    email: str
    username: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    token: str
    username: str
    user_id: int


class PredictRequest(BaseModel):
    text: str


class PredictResponse(BaseModel):
    prediction: str
    confidence: float
    confidence_low: float
    confidence_high: float
    extracted_text: str


class DashboardStats(BaseModel):
    totalPredictions: int
    realCount: int
    fakeCount: int
    totalUsers: int
    accuracy: float


class LoginDayData(BaseModel):
    day: str
    logins: int


class ModelUsageData(BaseModel):
    date: str
    users: int
    predictions: int
    accuracy: float


class DistributionData(BaseModel):
    name: str
    value: int


class PredictionLog(BaseModel):
    id: int
    user_id: int
    username: str
    file_format: str
    original_text: str
    extracted_text: str
    prediction: str
    confidence: float
    confidence_low: float
    confidence_high: float
    created_at: str
