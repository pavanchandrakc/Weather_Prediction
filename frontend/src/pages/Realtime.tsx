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
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl flex items-center justify-center gap-3">
          <Cloud className="w-10 h-10 text-cyan-500" /> Live Weather Forecast
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Get real-time weather conditions for any city worldwide using OpenWeatherMap.
        </p>
      </div>

      <Card className="bg-white/90 border-slate-200 backdrop-blur shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={fetchWeather} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input 
                placeholder="Enter city name (e.g., Mumbai, London, Tokyo)" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="pl-10 bg-white border-slate-200 text-slate-900 h-12 text-lg focus-visible:ring-cyan-500"
              />
            </div>
            <Button type="submit" disabled={loading || !city.trim()} className="h-12 px-8 bg-cyan-600 hover:bg-cyan-700 text-white transition-all shadow-lg shadow-cyan-500/30">
              {loading ? 'Searching...' : 'Get Weather'}
            </Button>
          </form>
          {error && <p className="text-rose-600 mt-4 text-center">{error}</p>}
        </CardContent>
      </Card>

      {weatherData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 backdrop-blur overflow-hidden relative shadow-sm">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl"></div>
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800 flex items-center justify-between">
                <span>{weatherData.name}, {weatherData.sys.country}</span>
                <MapPin className="w-6 h-6 text-cyan-600" />
              </CardTitle>
              <CardDescription className="text-cyan-700 capitalize text-lg">
                {weatherData.weather[0].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mt-4">
                <div className="bg-white/50 p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <img 
                    src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
                    alt="Weather Icon" 
                    className="w-20 h-20 drop-shadow-md"
                  />
                </div>
                <div>
                  <div className="text-6xl font-bold text-slate-900 tracking-tighter">
                    {Math.round(weatherData.main.temp)}°<span className="text-3xl text-cyan-600">C</span>
                  </div>
                  <div className="text-slate-600 mt-1 flex gap-4 font-medium">
                    <span>H: {Math.round(weatherData.main.temp_max)}°</span>
                    <span>L: {Math.round(weatherData.main.temp_min)}°</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white/90 border-slate-200 backdrop-blur shadow-sm">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <Thermometer className="w-8 h-8 text-rose-500 mb-2" />
                <div className="text-sm text-slate-500 font-medium">Feels Like</div>
                <div className="text-2xl font-bold text-slate-800">{Math.round(weatherData.main.feels_like)}°C</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 border-slate-200 backdrop-blur shadow-sm">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <Droplets className="w-8 h-8 text-blue-500 mb-2" />
                <div className="text-sm text-slate-500 font-medium">Humidity</div>
                <div className="text-2xl font-bold text-slate-800">{weatherData.main.humidity}%</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 border-slate-200 backdrop-blur shadow-sm">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <Wind className="w-8 h-8 text-emerald-500 mb-2" />
                <div className="text-sm text-slate-500 font-medium">Wind Speed</div>
                <div className="text-2xl font-bold text-slate-800">{weatherData.wind.speed} m/s</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 border-slate-200 backdrop-blur shadow-sm">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <Cloud className="w-8 h-8 text-slate-400 mb-2" />
                <div className="text-sm text-slate-500 font-medium">Cloudiness</div>
                <div className="text-2xl font-bold text-slate-800">{weatherData.clouds.all}%</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
