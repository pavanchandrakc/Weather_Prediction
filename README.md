# Weather Prediction Project 🌦️

A full-stack, machine-learning-powered weather prediction web application. This project allows users to explore historical rainfall data, predict future rainfall based on environmental parameters, and get real-time weather updates from around the globe.

## 🌟 Features

- **Rainfall Prediction Engine**: Input temperature, wind speed, elevation, and location to receive an instant ML-driven rainfall prediction (in mm).
- **Historical Weather Dashboard**: Visualize insights from an extensive Indian weather dataset, including monthly averages and seasonal peaks.
- **Live Global Forecasts**: Search for any city worldwide and get real-time weather conditions, powered by the OpenWeatherMap API.
- **Premium UI/UX**: Built with a sleek, dark-themed glassmorphism aesthetic featuring smooth animations and dynamic icons.

## 💻 Tech Stack

### Frontend
- **Framework**: React 18 with Vite and TypeScript
- **Styling**: Tailwind CSS v3
- **Components**: shadcn/ui & Radix UI
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **HTTP Client**: Axios

### Backend
- **API Framework**: FastAPI (Python)
- **Machine Learning**: Scikit-Learn (Random Forest Regressor)
- **Data Processing**: Pandas, OpenPyxl
- **Model Serialization**: Joblib
- **Server**: Uvicorn

## 📂 Repository Structure

```text
Weather_prediction/
├── backend/
│   ├── main.py                # FastAPI server and endpoints
│   ├── train.py               # ML training script (generates model.pkl)
│   ├── requirements.txt       # Python dependencies
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/        # shadcn/ui components
│   │   ├── pages/             # Dashboard, Prediction, Realtime views
│   │   └── App.tsx            # Main React routing
│   ├── tailwind.config.js     # Tailwind design system configuration
│   └── ...
├── india_weather_rainfall_data.xlsx  # Core dataset used for ML
└── commands.txt               # Quick reference terminal commands
```

## 🚀 Quick Start Guide

### 1. Backend Setup

Open a terminal and navigate to the `backend` directory:
```bash
cd backend
```

Create and activate a Python virtual environment:
```bash
# On Windows:
python -m venv venv
.\venv\Scripts\activate

# On Mac/Linux:
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Train the Machine Learning model (you must run this once):
```bash
python train.py
```

Start the FastAPI server:
```bash
uvicorn main:app --reload
```
*The backend API will now be running at `http://localhost:8000`.*

---

### 2. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
```

Install Node.js dependencies:
```bash
npm install
```

Configure Environment Variables:
1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and replace `YOUR_OPENWEATHERMAP_API_KEY` with your actual API key from [OpenWeatherMap](https://openweathermap.org/api).

Start the React development server:
```bash
npm run dev
```
*The web app will now be running at `http://localhost:5173`.*

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License
This project is open-source and available under the MIT License.
