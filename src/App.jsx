import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, X, Check, Coffee, Zap, Settings, Lock, Crown } from 'lucide-react';

export default function FocusApp() {
  // State Yönetimi
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' | 'break'
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const timerRef = useRef(null);

  // Zamanlayıcı Mantığı
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Ses çalınabilir (Audio API)
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  // Mod Değiştirme
  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  // Zaman Formatı (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Görev Ekleme
  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask('');
  };

  // Görev Tamamlama
  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Görev Silme
  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      
      {/* Navbar */}
      <header className="p-6 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Zap size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold">FocusFlow</h1>
        </div>
        <button 
          onClick={() => setShowPremiumModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-orange-500/20"
        >
          <Crown size={16} /> Premium'a Geç
        </button>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 grid md:grid-cols-2 gap-8 items-start">
        
        {/* Sol Panel: Timer */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
            {/* Arkaplan Efekti */}
            <div className={`absolute inset-0 opacity-20 transition-colors duration-500 ${mode === 'work' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
            
            {/* Mod Seçici */}
            <div className="flex bg-slate-900/80 p-1 rounded-xl mb-8 relative z-10">
              <button 
                onClick={() => switchMode('work')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'work' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Odaklan
              </button>
              <button 
                onClick={() => switchMode('break')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'break' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Mola Ver
              </button>
            </div>

            {/* Sayaç */}
            <div className="text-8xl font-black tabular-nums tracking-tighter mb-8 relative z-10 text-white drop-shadow-2xl">
              {formatTime(timeLeft)}
            </div>

            {/* Kontroller */}
            <div className="flex gap-4 relative z-10">
              <button 
                onClick={() => setIsActive(!isActive)}
                className={`p-6 rounded-2xl transition-all transform active:scale-95 shadow-xl ${isActive ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white text-slate-900 hover:bg-slate-200'}`}
              >
                {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
              </button>
              <button 
                onClick={() => { setIsActive(false); setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60); }}
                className="p-6 rounded-2xl bg-slate-700 hover:bg-slate-600 transition-all text-white shadow-xl active:scale-95"
              >
                <RotateCcw size={32} />
              </button>
            </div>
            
            <p className="mt-6 text-slate-400 text-sm font-medium">
              {mode === 'work' ? '🚀 Derin çalışma zamanı!' : '☕ Kahveni al ve dinlen.'}
            </p>
          </div>

          {/* İstatistik Kartı (Demo) */}
          <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50 flex justify-between items-center">
             <div>
               <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Bugünkü Odaklanma</p>
               <p className="text-2xl font-bold text-white">45 dk</p>
             </div>
             <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
               <Zap size={20} />
             </div>
          </div>
        </div>

        {/* Sağ Panel: Görevler */}
        <div className="bg-slate-800/50 rounded-3xl border border-slate-700 shadow-xl overflow-hidden flex flex-col h-full min-h-[400px]">
          <div className="p-6 border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Check className="text-emerald-400" size={20} /> Görev Listesi
            </h2>
          </div>
          
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[400px]">
            {tasks.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <p>Henüz görev yok.</p>
                <p className="text-sm">Bugün ne başarmak istiyorsun?</p>
              </div>
            )}
            
            {tasks.map(task => (
              <div 
                key={task.id} 
                className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${task.completed ? 'bg-slate-800/50 border-slate-700 opacity-60' : 'bg-slate-700/50 border-slate-600 hover:border-indigo-500/50'}`}
              >
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500 hover:border-emerald-400'}`}
                >
                  {task.completed && <Check size={14} className="text-white" />}
                </button>
                <span className={`flex-1 font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {task.text}
                </span>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={addTask} className="p-4 bg-slate-800 border-t border-slate-700">
            <div className="relative">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Yeni bir görev ekle..."
                className="w-full bg-slate-900 text-white pl-4 pr-12 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded-lg transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </form>
        </div>

      </main>
      
      {/* Footer / Reklam Alanı Simülasyonu */}
      <footer className="mt-auto border-t border-slate-800 p-6 bg-slate-900/50 text-center">
         <div className="max-w-md mx-auto bg-slate-800 p-4 rounded-lg border border-slate-700 border-dashed">
            <p className="text-xs text-slate-500 font-mono mb-1">REKLAM ALANI</p>
            <p className="text-sm text-slate-400">Verimliliğinizi artıracak en iyi kitap önerileri burada olabilir.</p>
         </div>
         <p className="text-slate-600 text-xs mt-4">© 2024 FocusFlow Inc. Tüm hakları saklıdır.</p>
      </footer>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-3xl max-w-sm w-full p-8 border border-slate-700 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowPremiumModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
            
            <div className="flex justify-center mb-6">
               <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-4 rounded-2xl shadow-lg shadow-orange-500/20">
                 <Crown size={40} className="text-white" />
               </div>
            </div>
            
            <h3 className="text-2xl font-bold text-center mb-2">FocusFlow Pro</h3>
            <p className="text-center text-slate-400 mb-6">Sınırsız tema, detaylı istatistikler ve reklamsız deneyim için yükseltin.</p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Check size={16} className="text-emerald-400" /> <span>Zen Modu & Doğa Sesleri</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Check size={16} className="text-emerald-400" /> <span>Haftalık Verimlilik Raporu</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Check size={16} className="text-emerald-400" /> <span>Reklamsız Arayüz</span>
              </div>
            </div>

            <button className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-100 transition-colors mb-3">
              Yıllık Plan (₺199/yıl)
            </button>
            <button className="w-full bg-slate-700 text-white font-medium py-3 rounded-xl hover:bg-slate-600 transition-colors">
              Aylık Plan (₺29/ay)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}