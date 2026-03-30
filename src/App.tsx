import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Info, TrendingUp, Zap, Target, ListOrdered } from 'lucide-react';

type Idea = {
  id: string;
  title: string;
  description: string;
  impact: number;
  confidence: number;
  ease: number;
};

const initialIdeas: Idea[] = [
  {
    id: '1',
    title: 'Впровадити Single Sign-On (SSO)',
    description: 'Дозволити користувачам входити через Google та GitHub.',
    impact: 8,
    confidence: 9,
    ease: 4,
  },
  {
    id: '2',
    title: 'Оновити Landing Page',
    description: 'Змінити головний екран та додати відгуки клієнтів.',
    impact: 7,
    confidence: 6,
    ease: 6,
  },
  {
    id: '3',
    title: 'Додати Dark Mode',
    description: 'Темна тема для панелі керування.',
    impact: 5,
    confidence: 8,
    ease: 7,
  }
];

function ScoreInput({ 
  label, 
  value, 
  onChange, 
  icon, 
  tooltip 
}: { 
  label: string, 
  value: number, 
  onChange: (v: number) => void, 
  icon: React.ReactNode, 
  tooltip: string 
}) {
  return (
    <div className="flex flex-col gap-2 w-full sm:w-32 group relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon}
          <label className="text-xs font-medium text-slate-600 cursor-help" title={tooltip}>{label}</label>
        </div>
        <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{value}</span>
      </div>
      <input 
        type="range" 
        min="1" 
        max="10" 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
      />
    </div>
  )
}

export default function App() {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const addIdea = () => {
    if (!newTitle.trim()) return;
    const newIdea: Idea = {
      id: crypto.randomUUID(),
      title: newTitle,
      description: newDescription,
      impact: 5,
      confidence: 5,
      ease: 5,
    };
    setIdeas([newIdea, ...ideas]);
    setNewTitle('');
    setNewDescription('');
  };

  const updateIdea = (id: string, field: keyof Idea, value: number | string) => {
    setIdeas(ideas.map(idea => idea.id === id ? { ...idea, [field]: value } : idea));
  };

  const deleteIdea = (id: string) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
  };

  const sortIdeas = () => {
    setIdeas(prev => [...prev].sort((a, b) => {
      const scoreA = a.impact * a.confidence * a.ease;
      const scoreB = b.impact * b.confidence * b.ease;
      return scoreB - scoreA;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans selection:bg-blue-200">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">ICE Scoring Board</h1>
          <p className="text-slate-500 text-lg">Пріоритезуйте ідеї разом з командою за допомогою фреймворку ICE.</p>
        </header>

        <div className="bg-blue-50/80 border border-blue-100 text-blue-900 rounded-2xl p-5 text-sm flex flex-col sm:flex-row gap-4 items-start shadow-sm">
          <div className="bg-blue-100 p-2 rounded-full shrink-0">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <strong className="font-semibold block mb-2 text-base">Як працює ICE фільтр:</strong>
            <ul className="list-disc pl-5 space-y-1.5 text-blue-800/80">
              <li><strong>Impact (Вплив, 1-10):</strong> Наскільки ця ідея вплине на досягнення нашої мети?</li>
              <li><strong>Confidence (Впевненість, 1-10):</strong> Наскільки ми впевнені у своїх оцінках впливу та зусиль?</li>
              <li><strong>Ease (Легкість / Зусилля, 1-10):</strong> Наскільки легко це реалізувати? (10 = Дуже легко / Мінімум зусиль)</li>
            </ul>
            <p className="mt-3 text-blue-800 font-medium bg-blue-100/50 inline-block px-3 py-1 rounded-lg">
              Score = Impact × Confidence × Ease. Вищий бал означає вищий пріоритет.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-500" />
            Додати нову ідею
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Назва ідеї..." 
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addIdea()}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            <input 
              type="text" 
              placeholder="Короткий опис (опціонально)..." 
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addIdea()}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            <button 
              onClick={addIdea}
              disabled={!newTitle.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              Додати
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <span>Беклог ідей <span className="text-slate-400 text-base font-normal ml-2">({ideas.length})</span></span>
            </h2>
            {ideas.length > 1 && (
              <button
                onClick={sortIdeas}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm"
              >
                <ListOrdered className="w-4 h-4" />
                Пріоритезувати
              </button>
            )}
          </div>
          
          {ideas.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">Немає ідей</h3>
              <p className="text-slate-500 mt-1">Додайте свою першу ідею вище, щоб почати пріоритезацію.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {ideas.map((idea, index) => {
                  const score = idea.impact * idea.confidence * idea.ease;
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      key={idea.id}
                      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 flex flex-col lg:flex-row gap-6 items-start lg:items-center relative group overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex items-start gap-4 flex-1 w-full">
                        <div className="bg-slate-100 text-slate-400 w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-mono text-sm font-medium mt-0.5">
                          {index + 1}
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 leading-tight">{idea.title}</h3>
                          {idea.description && (
                            <p className="text-slate-500 text-sm leading-relaxed">{idea.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap sm:flex-nowrap gap-4 md:gap-6 items-center w-full lg:w-auto bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                         <ScoreInput 
                           label="Impact" 
                           value={idea.impact} 
                           onChange={(v) => updateIdea(idea.id, 'impact', v)} 
                           icon={<Target className="w-4 h-4 text-blue-500"/>} 
                           tooltip="Вплив на мету (1-10)"
                         />
                         <ScoreInput 
                           label="Confidence" 
                           value={idea.confidence} 
                           onChange={(v) => updateIdea(idea.id, 'confidence', v)} 
                           icon={<TrendingUp className="w-4 h-4 text-green-500"/>} 
                           tooltip="Впевненість в оцінці (1-10)"
                         />
                         <ScoreInput 
                           label="Ease" 
                           value={idea.ease} 
                           onChange={(v) => updateIdea(idea.id, 'ease', v)} 
                           icon={<Zap className="w-4 h-4 text-amber-500"/>} 
                           tooltip="Легкість реалізації (10 = дуже легко)"
                         />
                      </div>

                      <div className="flex items-center justify-between lg:justify-end w-full lg:w-auto gap-6 lg:pl-6 lg:border-l border-slate-100 pt-4 lg:pt-0 border-t lg:border-t-0 mt-2 lg:mt-0">
                        <div className="text-left lg:text-center flex flex-row lg:flex-col items-center lg:items-center gap-3 lg:gap-0">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0 lg:mb-1">Score</div>
                          <div className="text-3xl lg:text-4xl font-light text-slate-900 tabular-nums tracking-tight">
                            {score}
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteIdea(idea.id)} 
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition-colors"
                          title="Видалити ідею"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
