import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
import joblib
import os

def train_model():
    print("Loading dataset...")
    # Adjust path to match the root dataset location
    data_path = os.path.join(os.path.dirname(__file__), '..', 'india_weather_rainfall_data.xlsx')
    
    if not os.path.exists(data_path):
        print(f"Error: Dataset not found at {data_path}")
        return

    df = pd.read_excel(data_path)
    
    print("Data shape:", df.shape)
    
    # Select features
    features = ['avg_temp', 'min_temp', 'max_temp', 'wind_speed', 'air_pressure', 'elevation', 'latitude', 'longitude']
    target = 'rainfall'
    
    X = df[features]
    y = df[target]
    
    # Handle missing values if any
    X = X.fillna(X.mean())
    y = y.fillna(0) # assume missing rainfall is 0
    
    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Regressor...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    print(f"Training R^2 Score: {model.score(X_train, y_train):.4f}")
    print(f"Testing R^2 Score: {model.score(X_test, y_test):.4f}")
    
    # Save the model
    model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

    # Save summary stats for frontend dashboard
    summary_path = os.path.join(os.path.dirname(__file__), 'summary_stats.json')
    
    # Creating a simple monthly aggregation
    monthly_avg = df.groupby('month')[target].mean().to_dict()
    season_avg = df.groupby('season')[target].mean().to_dict()
    
    import json
    with open(summary_path, 'w') as f:
        json.dump({
            "monthly_avg": monthly_avg,
            "season_avg": season_avg,
            "total_records": len(df),
            "features_used": features
        }, f)
    print(f"Summary stats saved to {summary_path}")

if __name__ == "__main__":
    train_model()
