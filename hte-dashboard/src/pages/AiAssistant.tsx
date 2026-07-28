import React from 'react';
import { Bot, Send, User, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: React.ReactNode;
  timestamp: Date;
}

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: (
        <div>
          <p className="mb-2">Hello! I am the HTE Decision Intelligence Assistant.</p>
          <p>I can help you analyze placement data, predict enrollments, or find specific college statistics. What would you like to know?</p>
        </div>
      ),
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = React.useState('');

  const suggestions = [
    "Which college has the highest placement rate?",
    "Show colleges with NAAC A++.",
    "Predict admissions for next year.",
    "Compare Computer Engineering and IT placements."
  ];

  const handleSend = (e?: React.FormEvent, suggestion?: string) => {
    e?.preventDefault();
    const text = suggestion || inputValue;
    if (!text.trim()) return;

    // Add user message
    const newUserMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: <p>{text}</p>,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      let responseContent: React.ReactNode = <p>I'm analyzing the latest state data to answer your query. This feature is currently in demo mode.</p>;
      
      if (text.includes('predict') || text.includes('next year')) {
        responseContent = (
          <div className="space-y-3">
            <p>Based on historical trends, here is the enrollment prediction for next year:</p>
            <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-start gap-4">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Projected Total Enrollment: 645,000</p>
                <p className="text-xs text-slate-500 mt-1">Expected increase of 5.3% primarily driven by IT and Computer Engineering branches.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
              <AlertTriangle className="w-4 h-4" />
              <span>Confidence interval: 92%. Monitor Pune district capacity.</span>
            </div>
          </div>
        );
      }

      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newAiMsg]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 leading-tight">HTE Copilot</h2>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-500" /> Powered by AI
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-4 max-w-3xl", msg.type === 'user' ? "ml-auto flex-row-reverse" : "")}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.type === 'user' ? "bg-slate-200 text-slate-600" : "bg-blue-600 text-white"
            )}>
              {msg.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className={cn(
              "px-4 py-3 rounded-2xl text-sm leading-relaxed",
              msg.type === 'user' 
                ? "bg-blue-600 text-white rounded-tr-sm" 
                : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex flex-wrap gap-2 mb-4 px-2">
          {suggestions.map((suggestion, idx) => (
            <button 
              key={idx}
              onClick={() => handleSend(undefined, suggestion)}
              className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors border border-transparent hover:border-blue-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything about colleges, placements, or enrollments..."
            className="w-full pl-4 pr-12 py-3 bg-slate-100 border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim()}
            className="absolute right-2 p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
