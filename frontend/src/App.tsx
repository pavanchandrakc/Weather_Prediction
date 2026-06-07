import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import Prediction from './pages/Prediction.tsx';
import Realtime from './pages/Realtime.tsx';
import { CloudRain, BarChart3, CloudLightning } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
        <nav className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-500/20 rounded-xl">
                  <CloudRain className="w-6 h-6 text-indigo-400" />
                </div>
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  Weather Prediction
                </span>
              </div>
              <div className="flex space-x-1">
                <NavLink to="/" icon={<BarChart3 className="w-4 h-4" />}>Dashboard</NavLink>
                <NavLink to="/predict" icon={<CloudRain className="w-4 h-4" />}>Predict</NavLink>
                <NavLink to="/realtime" icon={<CloudLightning className="w-4 h-4" />}>Real-time</NavLink>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predict" element={<Prediction />} />
            <Route path="/realtime" element={<Realtime />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function NavLink({ to, children, icon }: { to: string, children: React.ReactNode, icon: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5 hover:text-indigo-300 text-slate-300"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

export default App;
