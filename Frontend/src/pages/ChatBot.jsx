import React, { useState, useRef, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from "../componenets/layout/Layout";
import { Send, PlusCircle, Bot, Search, Mic, MicOff, User, Sparkles } from 'lucide-react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { DarkModeContext } from '../context/DarkModeContext'; // Added DarkModeContext

const ChatBot = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(DarkModeContext); // Extracted isDarkMode

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const [isSending, setIsSending] = useState(false);

  // --- Initial Chat History ---
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I'm your AI fitness coach. I'm here to help you with personalized workout plans, nutrition advice, and progress tracking. What can I help you with today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // --- Speech Recognition Logic ---
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Recognition. Please try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // --- Filter Messages based on Search ---
  const filteredMessages = messages.filter(msg =>
    msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-scroll to bottom (only if not searching)
  useEffect(() => {
    if (!searchQuery) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, searchQuery]);

  const handleSend = async (text = inputValue) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const newMessage = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);
    setIsSending(true);

    try {
      // 2. Send to backend for AI response
      const response = await api.post('/chat', {
        message: text
      });

      const aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.data.reply || "I'm processing your request. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Chat error", error);
      const errorResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "Sorry, I encountered an error. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Layout>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          body { font-family: 'Plus Jakarta Sans', sans-serif; }
          
          /* Custom Scrollbar for Chat Area */
          .chat-scroll::-webkit-scrollbar { width: 6px; }
          .chat-scroll::-webkit-scrollbar-track { background: transparent; }
          .chat-scroll::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 20px; }
        `}
      </style>

      <div className={`flex flex-col h-[calc(100vh-140px)] font-sans ${isDarkMode ? 'dark-mode' : ''}`}>

        {/* --- Chat Header --- */}
        <div className="mb-6">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>AI Coach</h1>
          <p className={`text-sm ${isDarkMode ? 'text-[#cbd5e1]' : 'text-slate-500'}`}>Always active • Personalized fitness guidance</p>

          {/* Search Feedback */}
          {searchQuery && (
            <div className="mt-2 flex items-center gap-2 text-sm font-bold text-[#00c4b4] animate-pulse">
              <Search size={14} />
              Searching chat history for: "{searchQuery}"
            </div>
          )}
        </div>

        {/* --- Messages Area --- */}
        <div className="flex-1 overflow-y-auto chat-scroll pr-4 space-y-6">

          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'ai' ? 'bg-teal-500 text-white' : ''}`}>
                  {msg.sender === 'ai' ? (
                    <Bot size={20} />
                  ) : (
                    /* User DP removed and replaced with dynamic theme gradient */
                    <div className={`w-full h-full rounded-full border-2 flex items-center justify-center ${isDarkMode ? 'border-[#334155] bg-gradient-to-br from-indigo-600 to-purple-600' : 'border-white bg-gradient-to-br from-[#db2777] to-orange-400'}`}>
                      <User size={20} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-5 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${msg.sender === 'ai'
                        ? (isDarkMode ? 'bg-[#1e293b] text-[#f1f5f9] rounded-tl-none border border-[#334155]' : 'bg-[#e0f7f6] text-slate-800 rounded-tl-none')
                        : 'bg-[#00c4b4] text-white rounded-tr-none'
                      }`}
                  >
                    {/* Highlight search term if searching */}
                    {searchQuery ? (
                      msg.text.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) =>
                        part.toLowerCase() === searchQuery.toLowerCase()
                          ? <span key={i} className="bg-yellow-300 text-black px-1 rounded">{part}</span>
                          : part
                      )
                    ) : (
                      // Standard bold parsing
                      msg.text.split('**').map((part, i) =>
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">
                    {msg.sender === 'ai' ? 'AI Coach' : 'You'} • {msg.time}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Search size={48} className="mb-4 opacity-20" />
              <p>No messages found matching "{searchQuery}"</p>
            </div>
          )}

          {/* Typing Indicator (Only show if not searching) */}
          {isTyping && !searchQuery && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
                <Bot size={20} className="text-white" />
              </div>
              <div className={`p-4 rounded-2xl rounded-tl-none flex items-center gap-1 ${isDarkMode ? 'bg-[#1e293b] border border-[#334155]' : 'bg-[#e0f7f6]'}`}>
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* --- Input Area --- */}
        <div className={`mt-4 bg-transparent pt-4 border-t ${isDarkMode ? 'border-[#334155]' : 'border-slate-100'}`}>

          {/* Quick Actions (Hide when searching to reduce clutter) */}
          {!searchQuery && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {['What is my current goal?', 'Show me my next workout', 'Analyze my last run', 'Recipe for post-workout'].map((action) => (
                <button
                  key={action}
                  onClick={() => handleSend(action)}
                  className={`whitespace-nowrap px-4 py-2 border rounded-full text-xs font-bold transition-colors ${
                    isDarkMode 
                    ? 'bg-[#1e293b] border-[#334155] text-slate-300 hover:bg-[#334155] hover:text-white' 
                    : 'bg-slate-50 hover:bg-[#e0f7f6] hover:text-teal-700 border-slate-200 text-slate-600'
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="relative flex items-center gap-2">
            
            {/* File Upload Plus Sign Commented Out */}
            {/* <div className="absolute left-2 flex items-center justify-center w-10 h-10 text-slate-400 hover:text-[#00c4b4] cursor-pointer transition-colors">
              <PlusCircle size={24} />
            </div> */}

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message your AI Coach..."
              className={`w-full pl-6 pr-14 py-4 border-none rounded-2xl focus:ring-2 focus:ring-[#00c4b4]/20 font-medium shadow-inner ${
                isDarkMode 
                ? 'bg-[#1e293b] text-white placeholder:text-slate-400' 
                : 'bg-slate-50 text-slate-700 placeholder:text-slate-400'
              }`}
            />

            {/* Voice Toggle Button */}
            <button 
              onClick={handleVoiceInput}
              className={`absolute right-14 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isListening ? 'bg-red-500 text-white shadow-lg animate-bounce' : 'text-slate-400 hover:text-[#00c4b4]'
              }`}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              className="absolute right-2 w-10 h-10 bg-[#00c4b4] hover:bg-[#00a89f] disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white shadow-md transition-all transform active:scale-95"
            >
              <Send size={18} className={inputValue.trim() ? 'translate-x-0.5' : ''} />
            </button>
          </div>

          <p className="text-center text-[10px] text-slate-300 mt-3 font-medium">
            PulseAI Coach can make mistakes. Verify important health information with a professional.
          </p>
        </div>

      </div>
    </Layout>
  );
};

export default ChatBot;