import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Wrench, 
  Clock, 
  Utensils, 
  Ticket, 
  ShieldAlert, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

export interface VaigaiAiHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateRoute?: (route: string) => void;
  userRole?: string;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  category?: string;
  priority?: string;
  assignedTo?: string;
  suggestedAction?: { label: string; route: string };
}

export const VaigaiAiHelperModal: React.FC<VaigaiAiHelperModalProps> = ({
  isOpen,
  onClose,
  onNavigateRoute,
  userRole = 'Resident'
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello! I am **Vaigai AI**, your intelligent campus assistant. Ask me anything about complaint routing, hostel curfew, mess rebates, or visitor passes!`,
      time: 'Just now'
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnalyzing]);

  if (!isOpen) return null;

  const handleSendQuery = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsAnalyzing(true);

    // AI Intelligence Response Simulation
    setTimeout(() => {
      const qLower = query.toLowerCase();
      let replyText = '';
      let category: string | undefined;
      let priority: string | undefined;
      let assignedTo: string | undefined;
      let suggestedAction: { label: string; route: string } | undefined;

      if (qLower.includes('plumb') || qLower.includes('water') || qLower.includes('tap') || qLower.includes('leak') || qLower.includes('drain') || qLower.includes('flush')) {
        category = 'Plumbing Maintenance';
        priority = qLower.includes('heavy') || qLower.includes('overflow') ? 'Critical' : 'High';
        assignedTo = 'M. Selvam (Senior Plumber)';
        replyText = `I have categorized this as **${category}** (${priority} Priority). Vaigai AI will automatically route this ticket to **${assignedTo}**. Expected response turnaround is under **2 hours**.`;
        suggestedAction = { label: 'Log Plumbing Ticket', route: '/resident/dashboard' };
      } 
      else if (qLower.includes('fan') || qLower.includes('light') || qLower.includes('spark') || qLower.includes('electric') || qLower.includes('plug') || qLower.includes('power') || qLower.includes('switch')) {
        category = 'Electrical Services';
        priority = qLower.includes('spark') || qLower.includes('fire') ? 'Critical' : 'High';
        assignedTo = 'S. Kumar (Duty Electrician)';
        replyText = `This has been analyzed as an **${category}** issue (${priority} Priority). Vaigai AI will assign it to **${assignedTo}**. Please do not tamper with live wires or faulty sockets.`;
        suggestedAction = { label: 'Submit Electrical Complaint', route: '/resident/dashboard' };
      }
      else if (qLower.includes('curfew') || qLower.includes('timing') || qLower.includes('late') || qLower.includes('time') || qLower.includes('entry')) {
        replyText = `**Hostel Gate Timings & Curfew Rules:**\n• **In-Time for Residents:** 09:30 PM (Mon - Sun)\n• **Late Pass Requirement:** Late entry after 09:30 PM requires a warden-approved digital pass.\n• **Security Gate A:** Suresh Kumar will verify your QR pass at entry.`;
        suggestedAction = { label: 'Request Outpass', route: '/resident/outpass' };
      }
      else if (qLower.includes('mess') || qLower.includes('food') || qLower.includes('rebate') || qLower.includes('meal') || qLower.includes('lunch') || qLower.includes('dinner')) {
        replyText = `**Mess Rebate & Dining Policy:**\n• **Rebate Eligibility:** Apply at least **24 hours prior** for a minimum of 3 consecutive absent days.\n• **Special Menu:** Special meals are served on Wednesdays & Sundays.\n• **Feedback:** You can post mess appreciation or suggestions on **Hostel Circle**.`;
        suggestedAction = { label: 'View Community Feed', route: '/resident/circle' };
      }
      else if (qLower.includes('visitor') || qLower.includes('parent') || qLower.includes('guest') || qLower.includes('pass')) {
        replyText = `**Digital Visitor Pass Process:**\n1. Generate a pass request under the **Passes** tab.\n2. Chief Warden Dr. Priya Raman receives an instant notification for approval.\n3. Show the approved QR pass at Gate A for instant Security check-in.`;
        suggestedAction = { label: 'Generate Visitor Pass', route: '/resident/passes' };
      }
      else if (qLower.includes('sos') || qLower.includes('emergency') || qLower.includes('medical') || qLower.includes('danger') || qLower.includes('doctor')) {
        replyText = `🚨 **EMERGENCY ASSISTANCE TRIGGERED**\n• **Chief Warden Hotline:** +91 98401 23456 (Dr. Priya Raman)\n• **Campus Medical Center:** Block C First Aid Room\n• Click below to trigger immediate siren distress signal to security.`;
        suggestedAction = { label: 'Trigger Emergency SOS', route: '/resident/sos' };
      }
      else if (qLower.includes('username') || qLower.includes('circle') || qLower.includes('post') || qLower.includes('anonymous')) {
        replyText = `**Hostel Circle & Username Generator:**\n• You can generate custom anonymous handles using our 3-tier word generator (Prefix + Separator + Middle + Suffix).\n• Usernames can be changed once every 30 days.`;
        suggestedAction = { label: 'Manage Community Username', route: '/resident/settings' };
      }
      else {
        replyText = `I have received your query: "${query}". Project Vaigai AI is continuously learning campus workflows. I recommend logging a ticket or checking with Dr. Priya Raman (Warden Office, Vaigai Block A).`;
        suggestedAction = { label: 'Open Main Dashboard', route: '/resident/dashboard' };
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category,
        priority,
        assignedTo,
        suggestedAction
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsAnalyzing(false);
    }, 800);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-1',
        sender: 'ai',
        text: `Hello! I am **Vaigai AI**, your intelligent campus assistant. Ask me anything about complaint routing, hostel curfew, mess rebates, or visitor passes!`,
        time: 'Just now'
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-[28px] border border-[#E7E4DF] shadow-2xl max-w-xl w-full h-[620px] flex flex-col overflow-hidden animate-slideUp relative">
        
        {/* Top Header Banner */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#2A5C8A] via-[#A73FD3] to-[#996E7D] text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-base font-black text-white tracking-wide">
                  Vaigai AI Helper
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-widest text-white border border-white/20">
                  Gemini Powered
                </span>
              </div>
              <p className="font-body text-xs text-purple-100 font-medium mt-0.5">
                Complaint Auto-Router & Campus Knowledge Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetChat}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Close AI Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips Header Bar */}
        <div className="bg-[#FAF8F2] border-b border-[#E7E4DF] p-2.5 px-4 overflow-x-auto flex items-center gap-2 shrink-0 no-scrollbar">
          <span className="text-[10px] font-bold text-[#8E8E93] uppercase shrink-0 mr-1 flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#A73FD3]" /> Quick Actions:
          </span>

          <button
            onClick={() => handleSendQuery('Water tank leakage in bathroom')}
            className="px-2.5 py-1 rounded-full bg-white border border-[#E7E4DF] text-[#1A1A1A] hover:bg-[#EBF3FA] hover:border-[#2A5C8A] transition-all text-[11px] font-semibold shrink-0 cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <Wrench className="w-3 h-3 text-[#2A5C8A]" />
            Plumbing Route
          </button>

          <button
            onClick={() => handleSendQuery('What are hostel gate timings?')}
            className="px-2.5 py-1 rounded-full bg-white border border-[#E7E4DF] text-[#1A1A1A] hover:bg-[#EBF3FA] hover:border-[#2A5C8A] transition-all text-[11px] font-semibold shrink-0 cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <Clock className="w-3 h-3 text-[#D97706]" />
            Gate Timings
          </button>

          <button
            onClick={() => handleSendQuery('How to apply for mess rebate?')}
            className="px-2.5 py-1 rounded-full bg-white border border-[#E7E4DF] text-[#1A1A1A] hover:bg-[#EBF3FA] hover:border-[#2A5C8A] transition-all text-[11px] font-semibold shrink-0 cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <Utensils className="w-3 h-3 text-[#059669]" />
            Mess Rebate
          </button>

          <button
            onClick={() => handleSendQuery('How do I generate a visitor pass?')}
            className="px-2.5 py-1 rounded-full bg-white border border-[#E7E4DF] text-[#1A1A1A] hover:bg-[#EBF3FA] hover:border-[#2A5C8A] transition-all text-[11px] font-semibold shrink-0 cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <Ticket className="w-3 h-3 text-[#996E7D]" />
            Visitor Pass
          </button>

          <button
            onClick={() => handleSendQuery('Emergency SOS procedures')}
            className="px-2.5 py-1 rounded-full bg-[#FDF2F2] border border-[#D9534F]/30 text-[#D9534F] hover:bg-[#D9534F] hover:text-white transition-all text-[11px] font-bold shrink-0 cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <ShieldAlert className="w-3 h-3" />
            SOS Guide
          </button>
        </div>

        {/* Chat Conversation Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-body text-xs bg-[#FAF8F2]/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#996E7D]'
                    : 'bg-gradient-to-br from-[#2A5C8A] to-[#A73FD3]'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl p-3.5 shadow-2xs space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-[#996E7D] text-white rounded-tr-none'
                    : 'bg-white border border-[#E7E4DF] text-[#1A1A1A] rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed">
                  {msg.text}
                </p>

                {/* AI Classification Card if present */}
                {msg.category && (
                  <div className="mt-2 p-2.5 bg-[#FAF8F2] rounded-xl border border-[#E7E4DF] space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#2A5C8A] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                        Category: {msg.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#D97706]/10 text-[#D97706] font-extrabold text-[10px]">
                        {msg.priority}
                      </span>
                    </div>

                    {msg.assignedTo && (
                      <p className="text-[#666666]">
                        Auto-assigned: <strong className="text-[#1A1A1A]">{msg.assignedTo}</strong>
                      </p>
                    )}
                  </div>
                )}

                {/* Action Link Button inside message */}
                {msg.suggestedAction && onNavigateRoute && (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateRoute(msg.suggestedAction!.route);
                      onClose();
                    }}
                    className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                      msg.sender === 'user'
                        ? 'bg-white text-[#996E7D] hover:bg-gray-100'
                        : 'bg-[#2A5C8A] text-white hover:bg-[#1A1A1A]'
                    }`}
                  >
                    <span>{msg.suggestedAction.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <span
                  className={`text-[9px] block text-right mt-1 ${
                    msg.sender === 'user' ? 'text-purple-200' : 'text-[#8E8E93]'
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {/* Typing / Analyzing Indicator */}
          {isAnalyzing && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2A5C8A] to-[#A73FD3] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-[#E7E4DF] rounded-2xl rounded-tl-none p-3 px-4 shadow-2xs flex items-center gap-2 text-xs text-[#666666] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#A73FD3] animate-ping" />
                Vaigai AI is routing and analyzing your request...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#E7E4DF] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Vaigai AI or describe a complaint (e.g. Broken fan regulator in 204)..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-[#FAF8F2] border border-[#E7E4DF] rounded-2xl px-4 py-2.5 text-xs text-[#1A1A1A] outline-none focus:border-[#A73FD3] transition-colors font-body"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isAnalyzing}
              className={`p-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center ${
                inputQuery.trim() && !isAnalyzing
                  ? 'bg-[#A73FD3] text-white hover:bg-[#8025A8] shadow-md active:scale-95'
                  : 'bg-[#E7E4DF] text-[#8E8E93] cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default VaigaiAiHelperModal;
