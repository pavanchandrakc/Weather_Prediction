import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { CloudRain, Database, Activity } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://weather-prediction-dbjf.onrender.com/data/summary')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-slate-500 animate-pulse">Loading dataset insights...</div>;
  }

  if (!stats || !stats.monthly_avg) {
    return <div className="text-center text-rose-600 p-8 border border-rose-200 bg-rose-50 rounded-xl">Error loading data. Is the backend running?</div>;
  }

  const monthlyData = Object.keys(stats.monthly_avg).map(month => ({
    name: month.substring(0, 3),
    rainfall: stats.monthly_avg[month]
  }));

  const seasonData = Object.keys(stats.season_avg).map(season => ({
    name: season,
    rainfall: stats.season_avg[season]
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/90 border-slate-200 backdrop-blur shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Records</CardTitle>
            <Database className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.total_records.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">Historical data points</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/90 border-slate-200 backdrop-blur shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Features Tracked</CardTitle>
            <Activity className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.features_used.length}</div>
            <p className="text-xs text-slate-500 mt-1">Environmental metrics</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 border-slate-200 backdrop-blur shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Highest Avg Season</CardTitle>
            <CloudRain className="w-4 h-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">Monsoon</div>
            <p className="text-xs text-slate-500 mt-1">Peak rainfall period</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/90 border-slate-200 backdrop-blur shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-800">Average Rainfall by Month (mm)</CardTitle>
            <CardDescription className="text-slate-500">Historical monthly trends across India</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }}
                  itemStyle={{ color: '#4f46e5' }}
                />
                <Line type="monotone" dataKey="rainfall" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/90 border-slate-200 backdrop-blur shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-800">Rainfall by Season (mm)</CardTitle>
            <CardDescription className="text-slate-500">Seasonal distribution analysis</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seasonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }}
                />
                <Bar dataKey="rainfall" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
