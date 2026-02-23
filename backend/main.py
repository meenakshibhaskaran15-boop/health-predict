from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from model import predictor

app = FastAPI(title="HealthPredict AI API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthInput(BaseModel):
    age: int
    gender: str
    symptoms: List[str]
    lifestyle_smoking: bool = False
    lifestyle_exercise: bool = False
    blood_pressure: Optional[str] = None
    sugar_level: Optional[str] = None

class PredictionResult(BaseModel):
    prediction: str
    risk_score: float
    probabilities: dict
    suggested_steps: List[str]
    doctor_consult: str

@app.get("/")
async def root():
    return {"message": "HealthPredict AI API is running"}

@app.post("/predict", response_model=PredictionResult)
async def get_prediction(data: HealthInput):
    try:
        result = predictor.predict(data.dict())
        
        # Add dynamic suggestions based on prediction
        suggestions = []
        if result["prediction"] == "High":
            suggestions = ["Consult a specialist immediately", "Monitor vital signs hourly", "Avoid strenuous physical activity"]
            doctor_consult = "Urgent: Visit an Emergency Room or General Physician today."
        elif result["prediction"] == "Medium":
            suggestions = ["Schedule a check-up this week", "Improve sleep hygiene", "Reduce sodium intake"]
            doctor_consult = "Recommended: Consult a General Practitioner within 2-3 days."
        else:
            suggestions = ["Maintain a healthy diet", "Continue regular exercise", "Annual health screening recommended"]
            doctor_consult = "Routine: Standard annual check-up is sufficient."
            
        return {
            **result,
            "suggested_steps": suggestions,
            "doctor_consult": doctor_consult
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Placeholder for Auth routes
@app.post("/auth/signup")
async def signup(user: dict):
    return {"message": "User registered successfully"}

@app.post("/auth/login")
async def login(credentials: dict):
    return {"access_token": "mock_token", "token_type": "bearer"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
