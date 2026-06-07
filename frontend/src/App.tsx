import { useEffect, useState } from 'react';
import axios from 'axios';
import Dashboard from './pages/Dashboard';
import Realtime from './pages/Realtime';
import { BarChart3, CloudLightning, MapPin, AlertCircle } from 'lucide-react';

export default function App() {
  const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [rainInfo, setRainInfo] = useState<{ city: string; isRaining: boolean; description: string } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY || '';
        
        if (!API_KEY) {
          setLocationStatus('error');
          return;
        }

        try {
          const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
          const weatherList = res.data.weather || [];
          const hasRainCondition = weatherList.some((w: any) => {
            return (w.id >= 200 && w.id < 600) || w.main.toLowerCase().includes('rain') || w.description.toLowerCase().includes('rain');
          });
          
          let mlPredictsRain = false;
          try {
            const mlRes = await axios.post('https://weather-prediction-dbjf.onrender.com/predict', {
              avg_temp: res.data.main.temp,
              min_temp: res.data.main.temp_min,
              max_temp: res.data.main.temp_max,
              wind_speed: res.data.wind.speed * 3.6, // m/s to km/h
              air_pressure: res.data.main.pressure,
              elevation: 100,
              latitude: latitude,
              longitude: longitude
            });
            mlPredictsRain = mlRes.data.predicted_rainfall_mm > 0.5;
          } catch (e) {
            console.error("ML Prediction Error:", e);
          }

          const isRaining = hasRainCondition || !!res.data.rain || mlPredictsRain;
          
          setRainInfo({
            city: res.data.name,
            isRaining,
            description: res.data.weather[0].description
          });
          setLocationStatus('success');
        } catch (error) {
          setLocationStatus('error');
        }
      },
      () => {
        setLocationStatus('error');
      }
    );
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/30">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-500/20 rounded-xl">
                <CloudLightning className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Weather Prediction
              </span>
            </div>
            <div className="hidden md:flex space-x-1">
              <button onClick={() => scrollToSection('realtime')} className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-100 hover:text-indigo-600 text-slate-600">
                <CloudLightning className="w-4 h-4" /> <span>Real-time</span>
              </button>
              <button onClick={() => scrollToSection('dashboard')} className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-100 hover:text-indigo-600 text-slate-600">
                <BarChart3 className="w-4 h-4" /> <span>Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Live Location Rain Banner */}
      <div className="bg-indigo-50 border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-center text-center">
          {locationStatus === 'loading' && (
            <div className="flex items-center gap-2 text-indigo-600 animate-pulse">
              <MapPin className="w-5 h-5" />
              <span>Fetching live location weather... Allow access if prompted.</span>
            </div>
          )}
          
          {locationStatus === 'success' && rainInfo && (
            <div className={`flex items-center gap-3 font-medium text-lg ${rainInfo.isRaining ? 'text-indigo-600' : 'text-emerald-600'}`}>
              <MapPin className="w-6 h-6" />
              <span>
                {rainInfo.isRaining 
                  ? `Yes, rain is expected in your present location (${rainInfo.city})!` 
                  : `No rain expected in your present location (${rainInfo.city}). Currently: ${rainInfo.description}.`}
              </span>
            </div>
          )}

          {locationStatus === 'error' && (
            <div className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="w-5 h-5" />
              <span>Unable to access location or fetch live weather. Check your browser permissions.</span>
            </div>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-32">
        <section id="realtime" className="scroll-mt-24">
          <Realtime />
        </section>

        <section id="dashboard" className="scroll-mt-24 border-t border-slate-200 pt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Historical Insights
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Analysis based on our massive Indian weather dataset.
            </p>
          </div>
          <Dashboard />
        </section>
      </main>
    </div>
  );
}
