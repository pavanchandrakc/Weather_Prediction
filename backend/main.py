from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os
import json

app = FastAPI(title="Weather Prediction API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
if os.path.exists(model_path):
    model = joblib.load(model_path)
else:
    model = None
    print("Warning: Model not found. Run train.py first.")

# Load summary stats
summary_path = os.path.join(os.path.dirname(__file__), 'summary_stats.json')
summary_stats = {}
if os.path.exists(summary_path):
    with open(summary_path, 'r') as f:
        summary_stats = json.load(f)

class PredictionRequest(BaseModel):
    avg_temp: float
    min_temp: float
    max_temp: float
    wind_speed: float
    air_pressure: float
    elevation: int
    latitude: float
    longitude: float

@app.get("/")
def read_root():
    return {"message": "Welcome to the Weather Prediction API"}

@app.post("/predict")
def predict_rainfall(req: PredictionRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded.")
    
    # Prepare features
    features = [
        req.avg_temp,
        req.min_temp,
        req.max_temp,
        req.wind_speed,
        req.air_pressure,
        req.elevation,
        req.latitude,
        req.longitude
    ]
    
    prediction = model.predict([features])[0]
    
    return {
        "predicted_rainfall_mm": round(prediction, 2),
        "input_features": req.dict()
    }

@app.get("/data/summary")
def get_summary():
    return summary_stats
