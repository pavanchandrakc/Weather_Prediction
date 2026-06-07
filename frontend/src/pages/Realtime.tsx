import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cloud, Droplets, Wind, Thermometer, Search, MapPin } from 'lucide-react';

export default function Realtime() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY || '';

  const fetchWeather = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      // In a real application, you would make this call from the backend to hide the API key
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      setWeatherData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch weather data.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl flex items-center justify-center gap-3">
          <Cloud className="w-10 h-10 text-cyan-400" /> Live Weather Forecast
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          Get real-time weather conditions for any city worldwide using OpenWeatherMap.
        </p>
      </div>

      <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
        <CardContent className="pt-6">
          <form onSubmit={fetchWeather} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input 
                placeholder="Enter city name (e.g., Mumbai, London, Tokyo)" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="pl-10 bg-slate-800/50 border-white/10 text-white h-12 text-lg"
              />
            </div>
            <Button type="submit" disabled={loading || !city.trim()} className="h-12 px-8 bg-cyan-600 hover:bg-cyan-700 text-white transition-all shadow-lg shadow-cyan-500/20">
              {loading ? 'Searching...' : 'Get Weather'}
            </Button>
          </form>
          {error && <p className="text-rose-400 mt-4 text-center">{error}</p>}
        </CardContent>
      </Card>

      {weatherData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-cyan-500/30 backdrop-blur overflow-hidden relative">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl"></div>
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center justify-between">
                <span>{weatherData.name}, {weatherData.sys.country}</span>
                <MapPin className="w-6 h-6 text-cyan-400" />
              </CardTitle>
              <CardDescription className="text-cyan-200 capitalize text-lg">
                {weatherData.weather[0].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mt-4">
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                  <img 
                    src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
                    alt="Weather Icon" 
                    className="w-20 h-20"
                  />
                </div>
                <div>
                  <div className="text-6xl font-bold text-white tracking-tighter">
                    {Math.round(weatherData.main.temp)}°<span className="text-3xl text-cyan-400">C</span>
                  </div>
                  <div className="text-slate-300 mt-1 flex gap-4">
                    <span>H: {Math.round(weatherData.main.temp_max)}°</span>
                    <span>L: {Math.round(weatherData.main.temp_min)}°</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <Thermometer className="w-8 h-8 text-rose-400 mb-2" />
                <div className="text-sm text-slate-400">Feels Like</div>
                <div className="text-2xl font-bold text-white">{Math.round(weatherData.main.feels_like)}°C</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <Droplets className="w-8 h-8 text-blue-400 mb-2" />
                <div className="text-sm text-slate-400">Humidity</div>
                <div className="text-2xl font-bold text-white">{weatherData.main.humidity}%</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <Wind className="w-8 h-8 text-emerald-400 mb-2" />
                <div className="text-sm text-slate-400">Wind Speed</div>
                <div className="text-2xl font-bold text-white">{weatherData.wind.speed} m/s</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <Cloud className="w-8 h-8 text-slate-400 mb-2" />
                <div className="text-sm text-slate-400">Cloudiness</div>
                <div className="text-2xl font-bold text-white">{weatherData.clouds.all}%</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
