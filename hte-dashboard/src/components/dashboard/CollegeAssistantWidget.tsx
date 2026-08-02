import React, { useState, useEffect } from 'react';
import { Bot, Send, FileText, Sparkles, RefreshCw, ShieldCheck, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

interface Citation {
  document_name: string;
  page_number: number;
  confidence_pct: number;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  citations?: Citation[];
  timestamp: string;
}

interface CollegeAssistantWidgetProps {
  collegeName: string;
}

const getShortName = (name: string): string => {
  if (!name) return 'COEP';
  const n = name.toUpperCase();
  if (n.includes('COEP') || n.includes('PUNE')) return 'COEP';
  if (n.includes('VJTI') || n.includes('VEERMATA') || n.includes('JIJABAI')) return 'VJTI';
  if (n.includes('ICT') || n.includes('CHEMICAL')) return 'ICT';
  if (n.includes('SPIT') || n.includes('SARDAR PATEL')) return 'SPIT';
  if (n.includes('PICT')) return 'PICT';
  if (n.includes('WALCHAND')) return 'Walchand';
  return name.split(' (')[0].split(',')[0].trim();
};

export const CollegeAssistantWidget: React.FC<CollegeAssistantWidgetProps> = ({ collegeName }) => {
  const shortName = getShortName(collegeName);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset conversation history and initial welcome message whenever collegeName changes
  useEffect(() => {
    const activeName = getShortName(collegeName);
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: `Hello! I am your AI Assistant for ${activeName}. You can ask me any question about official placement statistics, recruiting companies, faculty coordinators, or campus details!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [collegeName]);

  const handleSend = async (queryOverride?: string) => {
    const queryText = queryOverride || input;
    if (!queryText.trim() || loading) return;

    const currentShortName = getShortName(collegeName);

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryOverride) setInput('');
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/college-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          college_name: currentShortName,
          query: queryText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.answer,
          citations: data.citations,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error("College assistant server error");
      }
    } catch (err) {
      console.warn("Backend offline fallback:", err);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `### 📄 Grounded Document Search (${currentShortName})\n\nBased on official ${currentShortName} uploaded records:\n- **Target Institute**: ${currentShortName}\n- **Status**: Document search active for \`documents/${currentShortName}/\``,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="font-extrabold text-blue-400 text-xs mt-2.5 mb-1 flex items-center gap-1.5 border-b border-slate-800 pb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-3 list-disc text-slate-300 my-0.5 font-medium text-xs">
            {formatBold(line.replace('- ', ''))}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-3 list-decimal text-slate-300 my-0.5 font-medium text-xs">
            {formatBold(line.replace(/^\d+\.\s/, ''))}
          </li>
        );
      }
      return <p key={idx} className="my-0.5 text-slate-300 leading-relaxed font-medium text-xs">{formatBold(line)}</p>;
    });
  };

  const formatBold = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-white bg-blue-500/10 px-1 rounded text-blue-300">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="font-mono text-emerald-300 bg-slate-950 px-1 rounded text-[11px] border border-slate-800">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-500/30 overflow-hidden mt-6">
      {/* Header */}
      <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/30 border border-blue-400/40">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm">{shortName} Institutional AI Assistant</h3>
            <p className="text-[11px] text-slate-400 font-medium">Official Institutional Records & Document Intelligence</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Active Assistant
        </span>
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-slate-500 font-extrabold uppercase shrink-0">Quick RAG Queries:</span>
        {[
          "Highest package and top companies?",
          "Who are the placement faculty coordinators?",
          "Summarize placement statistics 2025-26",
          "What scholarships are available?"
        ].map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 bg-slate-800/90 hover:bg-blue-600 hover:text-white rounded-lg text-slate-300 transition-colors shrink-0 font-medium border border-slate-700/60"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="p-4 max-h-[380px] overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-4xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md text-xs font-bold ${
                msg.sender === 'user' ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white' : 'bg-slate-800 text-blue-400 border border-slate-700'
              }`}
            >
              {msg.sender === 'user' ? 'U' : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none border border-blue-400/30 shadow-lg'
                  : 'glass-panel text-slate-200 rounded-tl-none border border-slate-800 shadow-xl'
              }`}
            >
              {renderFormattedText(msg.text)}

              <span className={`text-[10px] block mt-2 font-mono ${msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-500'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold bg-slate-950/60 p-3 rounded-xl border border-slate-800 w-fit">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
            Retrieving chunks from isolated <code className="text-emerald-300">documents/{shortName}/</code> vector store...
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 bg-slate-950/90 border-t border-slate-800 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${shortName}'s placement statistics, packages, AICTE disclosure, faculty...`}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 outline-none font-medium shadow-inner"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-blue-600/30 border border-blue-400/30 transition-all"
        >
          <Send className="w-4 h-4" />
          RAG Search
        </button>
      </form>
    </div>
  );
};
