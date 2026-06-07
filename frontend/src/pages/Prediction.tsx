import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Droplets, Wind, Thermometer, MapPin, Gauge } from 'lucide-react';

export default function Prediction() {
  const [formData, setFormData] = useState({
    avg_temp: 25.0,
    min_temp: 20.0,
    max_temp: 30.0,
    wind_speed: 10.0,
    air_pressure: 1010.0,
    elevation: 100,
    latitude: 20.0,
    longitude: 78.0
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://127.0.0.1:8000/predict', formData);
      setPrediction(res.data.predicted_rainfall_mm);
    } catch (err) {
      setError('Failed to get prediction. Is the backend running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Rainfall Prediction Engine
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          Enter environmental parameters to get an ML-powered rainfall estimate based on historical patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-slate-200">Environmental Parameters</CardTitle>
              <CardDescription className="text-slate-400">Adjust the values to simulate different conditions.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-2">
                    <Label htmlFor="avg_temp" className="text-slate-300 flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-rose-400" /> Avg Temperature (°C)
                    </Label>
                    <Input id="avg_temp" name="avg_temp" type="number" step="0.1" value={formData.avg_temp} onChange={handleChange} className="bg-slate-800/50 border-white/10 text-white" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="min_temp" className="text-slate-300">Min Temperature (°C)</Label>
                    <Input id="min_temp" name="min_temp" type="number" step="0.1" value={formData.min_temp} onChange={handleChange} className="bg-slate-800/50 border-white/10 text-white" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_temp" className="text-slate-300">Max Temperature (°C)</Label>
                    <Input id="max_temp" name="max_temp" type="number" step="0.1" value={formData.max_temp} onChange={handleChange} className="bg-slate-800/50 border-white/10 text-white" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wind_speed" className="text-slate-300 flex items-center gap-2">
                      <Wind className="w-4 h-4 text-cyan-400" /> Wind Speed (km/h)
                    </Label>
                    <Input id="wind_speed" name="wind_speed" type="number" step="0.1" value={formData.wind_speed} onChange={handleChange} className="bg-slate-800/50 border-white/10 text-white" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="air_pressure" className="text-slate-300 flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-emerald-400" /> Air Pressure (hPa)
                    </Label>
                    <Input id="air_pressure" name="air_pressure" type="number" step="0.1" value={formData.air_pressure} onChange={handleChange} className="bg-slate-800/50 border-white/10 text-white" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="elevation" className="text-slate-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-400" /> Elevation (m)
                    </Label>
                    <Input id="elevation" name="elevation" type="number" step="1" value={formData.elevation} onChange={handleChange} className="bg-slate-800/50 border-white/10 text-white" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="latitude" className="text-slate-300">Latitude</Label>
                    <Input id="latitude" name="latitude" type="number" step="0.01" value={formData.latitude} onChange={handleChange} className="bg-slate-800/50 border-white/10 text-white" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="longitude" className="text-slate-300">Longitude</Label>
                    <Input id="longitude" name="longitude" type="number" step="0.01" value={formData.longitude} onChange={handleChange} className="bg-slate-800/50 border-white/10 text-white" required />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-lg shadow-indigo-500/20">
                  {loading ? 'Analyzing patterns...' : 'Predict Rainfall'}
                </Button>
                {error && <p className="text-rose-400 text-sm mt-2">{error}</p>}
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-slate-900/80 border-indigo-500/30 backdrop-blur sticky top-24 shadow-2xl shadow-indigo-500/10">
            <CardHeader>
              <CardTitle className="text-indigo-300">Prediction Result</CardTitle>
              <CardDescription className="text-slate-400">Estimated rainfall based on provided metrics.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
                <div className="relative bg-slate-950 p-6 rounded-full border border-indigo-500/30 shadow-inner flex items-center justify-center w-32 h-32 mb-4">
                  {prediction !== null ? (
                    <div className="text-center">
                      <span className="text-3xl font-bold text-white">{prediction}</span>
                      <span className="text-indigo-400 block text-sm">mm</span>
                    </div>
                  ) : (
                    <Droplets className="w-12 h-12 text-slate-600" />
                  )}
                </div>
              </div>
              
              {prediction !== null && (
                <div className="mt-4 text-center space-y-2">
                  <p className="text-slate-300 font-medium">
                    {prediction > 50 ? 'Heavy Rainfall Expected' : prediction > 10 ? 'Moderate Rainfall' : prediction > 0 ? 'Light Drizzle' : 'Dry Conditions'}
                  </p>
                  <p className="text-xs text-slate-500 max-w-[200px]">
                    This is an ML estimate. Actual conditions may vary.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
