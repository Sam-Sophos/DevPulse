import React, { useState, useEffect } from 'react';
import { DevLog } from '../types';
import { saveLog, getLogs } from '../services/storage';
import { generateLogInsights, suggestTags } from '../services/gemini';
import { Calendar, Save, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const DailyLogPage: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const [logs, setLogs] = useState<DevLog[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [isEditing, setIsEditing] = useState(true);
  
  // Form State
  const [workedOn, setWorkedOn] = useState('');
  const [learned, setLearned] = useState('');
  const [struggled, setStruggled] = useState('');
  const [next, setNext] = useState('');
  const [mood, setMood] = useState<DevLog['mood']>('good');
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const loadedLogs = getLogs();
    setLogs(loadedLogs);
    loadLogForDate(today, loadedLogs);
  }, []);

  const loadLogForDate = (date: string, currentLogs: DevLog[]) => {
    const existingLog = currentLogs.find(l => l.date === date);
    if (existingLog) {
      setWorkedOn(existingLog.workedOn);
      setLearned(existingLog.learned);
      setStruggled(existingLog.struggled);
      setNext(existingLog.next);
      setMood(existingLog.mood);
      setAiFeedback(existingLog.aiFeedback || '');
      setIsEditing(false); // If exists, show view mode first
    } else {
      // Reset for new entry
      setWorkedOn('');
      setLearned('');
      setStruggled('');
      setNext('');
      setMood('good');
      setAiFeedback('');
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    const newLog: DevLog = {
      id: `${selectedDate}-log`,
      date: selectedDate,
      workedOn,
      learned,
      struggled,
      next,
      mood,
      tags: [], // Could auto-generate tags here
      aiFeedback // Preserve existing feedback
    };
    
    // Auto-generate tags if empty
    if (newLog.tags.length === 0) {
        const textToAnalyze = `${workedOn} ${learned}`;
        if (textToAnalyze.length > 10) {
             // Non-blocking tag generation
             suggestTags(textToAnalyze).then(tags => {
                newLog.tags = tags;
                saveLog(newLog);
                setLogs(getLogs()); // Refresh
             });
        }
    }

    saveLog(newLog);
    setLogs(getLogs());
    setIsEditing(false);
  };

  const handleGenerateInsights = async () => {
    setLoadingAi(true);
    const tempLog: DevLog = {
        id: 'temp',
        date: selectedDate,
        workedOn,
        learned,
        struggled,
        next,
        mood,
        tags: []
    };
    const insight = await generateLogInsights(tempLog);
    setAiFeedback(insight);
    setLoadingAi(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-bold text-foreground">Daily Log</h2>
           <p className="text-muted-foreground mt-1">Reflect on your progress. Be honest.</p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border px-3 py-2 rounded-lg">
           <Calendar className="text-muted-foreground" size={16} />
           <input 
             type="date" 
             value={selectedDate} 
             onChange={(e) => {
                 setSelectedDate(e.target.value);
                 loadLogForDate(e.target.value, logs);
             }}
             className="bg-transparent border-none outline-none text-foreground text-sm"
           />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor/Viewer */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-semibold flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                     Entry for {selectedDate}
                   </h3>
                   {!isEditing && (
                       <button onClick={() => setIsEditing(true)} className="text-sm text-primary hover:underline">Edit Entry</button>
                   )}
                </div>

                {isEditing ? (
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">What did you work on?</label>
                            <textarea 
                                className="w-full bg-input/50 border border-input rounded-md p-3 text-sm focus:ring-1 focus:ring-primary outline-none min-h-[80px]"
                                placeholder="Built the authentication flow..."
                                value={workedOn}
                                onChange={e => setWorkedOn(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">What did you learn?</label>
                            <textarea 
                                className="w-full bg-input/50 border border-input rounded-md p-3 text-sm focus:ring-1 focus:ring-primary outline-none min-h-[80px]"
                                placeholder="React Server Components data fetching patterns..."
                                value={learned}
                                onChange={e => setLearned(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">What was difficult?</label>
                            <textarea 
                                className="w-full bg-input/50 border border-input rounded-md p-3 text-sm focus:ring-1 focus:ring-primary outline-none min-h-[80px]"
                                placeholder="Understanding hydration errors..."
                                value={struggled}
                                onChange={e => setStruggled(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Plan for tomorrow?</label>
                            <textarea 
                                className="w-full bg-input/50 border border-input rounded-md p-3 text-sm focus:ring-1 focus:ring-primary outline-none min-h-[80px]"
                                placeholder="Fix the bug in the login component..."
                                value={next}
                                onChange={e => setNext(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-4 py-2">
                            <label className="text-sm font-medium text-muted-foreground">Mood:</label>
                            <div className="flex gap-2">
                                {(['great', 'good', 'neutral', 'bad'] as const).map(m => (
                                    <button 
                                        key={m}
                                        onClick={() => setMood(m)}
                                        className={`px-3 py-1 rounded-full text-xs capitalize transition-colors ${mood === m ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-between">
                             <button 
                                onClick={handleGenerateInsights}
                                disabled={loadingAi || (!workedOn && !learned)}
                                className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 disabled:opacity-50"
                             >
                                {loadingAi ? <Loader2 className="animate-spin" size={14}/> : <Sparkles size={14} />}
                                {aiFeedback ? 'Regenerate Insights' : 'Get AI Insights'}
                             </button>

                             <button 
                                onClick={handleSave}
                                className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                             >
                                <Save size={16} /> Save Entry
                             </button>
                        </div>
                         {aiFeedback && (
                            <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                <h4 className="text-xs font-bold text-purple-400 mb-1 flex items-center gap-2">
                                    <Sparkles size={12} /> AI Insight
                                </h4>
                                <p className="text-sm text-purple-100/90">{aiFeedback}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* View Mode */}
                        <div className="grid grid-cols-1 gap-6">
                           <div>
                                <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Worked On</h4>
                                <div className="text-sm text-foreground bg-muted/30 p-3 rounded-md prose prose-invert max-w-none">
                                    <ReactMarkdown>{workedOn || "Nothing recorded."}</ReactMarkdown>
                                </div>
                           </div>
                           <div>
                                <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Learned</h4>
                                <div className="text-sm text-foreground bg-muted/30 p-3 rounded-md prose prose-invert max-w-none">
                                    <ReactMarkdown>{learned || "Nothing recorded."}</ReactMarkdown>
                                </div>
                           </div>
                           <div>
                                <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Struggled</h4>
                                <div className="text-sm text-foreground bg-muted/30 p-3 rounded-md prose prose-invert max-w-none">
                                    <ReactMarkdown>{struggled || "Nothing recorded."}</ReactMarkdown>
                                </div>
                           </div>
                           <div>
                                <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Next</h4>
                                <div className="text-sm text-foreground bg-muted/30 p-3 rounded-md prose prose-invert max-w-none">
                                    <ReactMarkdown>{next || "Nothing recorded."}</ReactMarkdown>
                                </div>
                           </div>
                        </div>
                        
                        {aiFeedback && (
                            <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                <h4 className="text-xs font-bold text-purple-400 mb-1 flex items-center gap-2">
                                    <Sparkles size={12} /> AI Insight
                                </h4>
                                <p className="text-sm text-purple-100/90">{aiFeedback}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Sidebar: History & Quick Stats */}
        <div className="space-y-6">
           <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Entry History</h3>
              <div className="space-y-3">
                 {logs.length === 0 ? (
                     <p className="text-xs text-muted-foreground">No history yet.</p>
                 ) : (
                    logs.slice(0, 5).map(log => (
                        <button 
                            key={log.id} 
                            onClick={() => {
                                setSelectedDate(log.date);
                                loadLogForDate(log.date, logs);
                            }}
                            className={`w-full text-left p-2 rounded-md flex justify-between items-center group transition-colors ${selectedDate === log.date ? 'bg-primary/20 border border-primary/30' : 'hover:bg-muted'}`}
                        >
                           <div className="overflow-hidden">
                               <div className="text-xs font-medium text-foreground">{log.date}</div>
                               <div className="text-[10px] text-muted-foreground truncate w-32">{log.workedOn}</div>
                           </div>
                           <div className={`w-2 h-2 rounded-full ${log.mood === 'great' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                        </button>
                    ))
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};