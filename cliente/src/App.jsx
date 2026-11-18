import React, { useState, useEffect } from 'react';
import axios from 'axios';

// URL dinámica compatible con desarrollo local y producción en Vercel/Render
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/activities';
// Base del backend (para enlazar a Swagger): quita "/api/activities" de la URL
const API_BASE = API_URL.replace(/\/api\/activities\/?$/, '');

export default function App() {
  const [activities, setActivities] = useState([]);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Transporte');
  const [carbonKg, setCarbonKg] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    try {
      const res = await axios.get(API_URL);
      setActivities(res.data);
    } catch (err) {
      console.error('Error al cargar actividades:', err);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !carbonKg) return;
    setLoading(true);
    try {
      await axios.post(API_URL, {
        description,
        category,
        carbonKg: parseFloat(carbonKg)
      });
      setDescription('');
      setCarbonKg('');
      fetchActivities();
    } catch (err) {
      console.error('Error al guardar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchActivities();
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  const totalCarbon = activities.reduce((acc, curr) => acc + curr.carbonKg, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-2 border-b border-slate-800 pb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-400 flex items-center justify-center gap-2">
            🌿 EcoTrack Cloud System
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Optimización Web Full Stack • Tailwind CSS & Terser v5
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Formulario de Registro */}
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 p-6 rounded-xl shadow-lg col-span-1 space-y-4">
            <h2 className="text-lg font-bold text-emerald-300 border-b border-slate-700 pb-2">
              Registrar Actividad
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej. Viaje en Autobús"
                  className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 rounded-lg p-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900/90 text-slate-100 rounded-lg p-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                >
                  <option value="Transporte">Transporte</option>
                  <option value="Energía">Energía</option>
                  <option value="Alimentación">Alimentación</option>
                  <option value="Residuos">Residuos</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Impacto (kg CO₂)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={carbonKg}
                  onChange={(e) => setCarbonKg(e.target.value)}
                  placeholder="Ej. 2.5"
                  className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 rounded-lg p-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition duration-150 shadow-md hover:shadow-emerald-900/20 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Agregar Registro'}
              </button>
            </form>
          </div>

          {/* Listado e Historial */}
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 p-6 rounded-xl shadow-lg col-span-2 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
                <h2 className="text-lg font-bold text-emerald-300">Historial de Impacto</h2>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-inner">
                  Total: {totalCarbon.toFixed(2)} kg CO₂
                </span>
              </div>
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                {activities.length === 0 ? (
                  <p className="text-slate-500 text-center py-10 text-sm">No hay actividades registradas aún.</p>
                ) : (
                  activities.map((act) => (
                    <div key={act._id} className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-700/50 flex justify-between items-center hover:border-slate-600 transition">
                      <div>
                        <h3 className="font-semibold text-slate-200 text-sm">{act.description}</h3>
                        <span className="text-xs text-slate-400">{act.category} • {new Date(act.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-rose-400 text-sm">+{act.carbonKg} kg</span>
                        <button
                          onClick={() => handleDelete(act._id)}
                          title="Eliminar"
                          className="text-slate-500 hover:text-rose-400 text-xs border border-slate-700 hover:border-rose-500/60 rounded px-2 py-1 transition"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="pt-4 border-t border-slate-700/80 text-xs text-slate-400 flex flex-wrap justify-between gap-2">
              <span className="flex items-center gap-1.5">⚡ Minificado con Terser v5 + Gzip/Brotli</span>
              <span>Swagger Docs: <a href={`${API_BASE}/api-docs`} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">/api-docs</a></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
