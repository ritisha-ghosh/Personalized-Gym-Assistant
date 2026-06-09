import React, { useState, useRef, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from "../componenets/layout/Layout";
import { Send, PlusCircle, Bot, Search, Mic, MicOff, User, Sparkles, Clock, X, MessageSquare, Trash2, Pencil } from 'lucide-react';
import api from '../utils/api';
import logo from '../assets/logo.png';
import { AuthContext } from '../context/AuthContext';
import { DarkModeContext } from '../context/DarkModeContext';

const allPresetQuestions = [
  "Give me a diet with no onion or garlic",
  "I want to lose weight",
  "Give me a diet for muscle gain",
  "I need a keto meal plan",
  "What should a vegetarian eat for dinner?",
  "Recommend a vegan diet",
  "I want a meal plan to bulk up",
  "Can you suggest a diet for cutting fat?",
  "I need a high protein vegetarian diet",
  "What is a good diet for a beginner?",
  "Show me a non-veg meal plan",
  "I need a dairy-free meal plan",
  "Suggest a 2000 calorie diet",
  "What should I eat to get lean?",
  "Meal plan for gaining mass",
  "I have diabetes what is a good diet",
  "PCOS friendly meal plan",
  "Diet for high blood pressure",
  "What should I eat if I have high cholesterol?",
  "Need a cheap diet plan",
  "Budget friendly muscle gain diet",
  "What should a student eat for protein?",
  "Give me a 7 day meal plan",
  "What is a good diet for a teenager?",
  "I need to cut 10 pounds fast",
  "Meal plan for a marathon runner",
  "How to eat to build big arms",
  "What should I eat to get a six pack?",
  "Show me a low carb diet",
  "I want to do intermittent fasting meals",
  "How many calories are in an egg?",
  "Is rice good for bulking?",
  "What is the best pre-workout meal?",
  "How much protein is in chicken breast?",
  "Are carbs bad for weight loss?",
  "What should I eat after a workout?",
  "Is whey protein necessary?",
  "Tell me the macros for a banana",
  "Are almonds good for fat loss?",
  "What is intermittent fasting?",
  "How many meals should I eat a day?",
  "Is oatmeal a good breakfast?",
  "Does creatine make you fat?",
  "Is it bad to eat before bed?",
  "How much water should I drink?",
  "Are egg yolks bad for you?",
  "What is a good source of healthy fats?",
  "Is peanut butter good for bulking?",
  "How many calories should I eat to lose weight?",
  "What are macros?",
  "Do I need to track calories?",
  "Is soy protein bad for men?",
  "What is the glycemic index?",
  "Are potatoes better than rice?",
  "Can I drink coffee before a workout?",
  "Is milk good for gaining weight?",
  "Suggest a workout for beginners",
  "I need a chest workout",
  "What is a good leg day routine?",
  "Give me a full body workout",
  "Recommend a push day routine",
  "What should I do for back and biceps?",
  "Suggest an ab workout",
  "I want to build my shoulders",
  "Give me a 3-day split routine",
  "What is a good workout for weight loss?",
  "Recommend a hypertrophy program",
  "I need a quick 20 minute home workout",
  "What exercises grow the glutes?",
  "Give me a dumbbell only workout",
  "I want to increase my bench press",
  "Bro split vs PPL",
  "Give me a 5 day workout split",
  "How to get a bigger chest",
  "What is the best back workout?",
  "Exercises for wider shoulders",
  "How to build big calves",
  "Workout for a 40 year old man",
  "Cardio routine for fat loss",
  "HIIT workout suggestions",
  "Give me a calisthenics routine",
  "How to get better at pullups",
  "Upper lower split routine",
  "Bodyweight exercises for chest",
  "I only have 30 minutes to workout",
  "Suggest a routine for a woman",
  "How to tone my arms",
  "Log my bench press",
  "Record 3 sets of squats",
  "I just finished 30 minutes of cardio",
  "Track my workout",
  "Save my deadlift max",
  "I did 4 sets of 12 reps on cable flys",
  "Mark my pull workout as complete",
  "I ran for 5 miles today",
  "Log 50 pushups",
  "Track my leg day",
  "Record that I missed my workout today",
  "Save my new PR on squat",
  "I want to track my calories for today",
  "Save my workout",
  "Record 100 kg deadlift",
  "I completed my push day",
  "Log 5 sets of bench",
  "Track 20 minutes on the treadmill",
  "Save today's session",
  "I burned 400 calories today",
  "Mark today as a rest day",
  "I did yoga for an hour",
  "Record my bicep curls",
  "Track my macros",
  "Log my breakfast",
  "My knee hurts when I squat",
  "I have asthma what should I do",
  "Lower back pain after deadlifts",
  "How to workout with a shoulder impingement",
  "Modify my workout for an elbow injury",
  "I sprained my ankle",
  "Need exercises for a bad back",
  "My wrists hurt when I do pushups",
  "I have a torn ACL how do I train legs",
  "What cardio is safe for bad knees?",
  "I have high blood pressure what should I avoid?",
  "Modify my plan for a rotator cuff tear",
  "I am recovering from a broken arm",
  "How to train around tennis elbow",
  "Is it safe to lift with sciatica?",
  "Alternative to squats for bad knees",
  "I pulled my hamstring sprinting",
  "My shin splints are flaring up",
  "Modifications for a herniated disc",
  "I have a heart condition what is safe?",
  "How to rehab a rolled ankle",
  "Neck pain after overhead press",
  "I feel a sharp pain in my bicep tendon",
  "What to do for hip flexor pain?",
  "I have a slight groin pull",
  "Is swimming good for joint pain?",
  "How to train with plantar fasciitis",
  "My lower back is tight",
  "I have osteoporosis is lifting safe",
  "Can I workout with arthritis",
  "Exercises to avoid with a hernia",
  "How to train if I have GERD",
  "Workout modifications for pregnant women",
  "Shoulder pops when I lift",
  "I have carpal tunnel syndrome",
  "Is deadlifting bad for your spine?",
  "I dislocated my shoulder recently",
  "How to recover from a torn meniscus",
  "Safe exercises for cervical spondylosis",
  "What to do for a stiff neck",
  "I have chronic fatigue syndrome",
  "Is it safe to workout with a fever?",
  "How to fix bad posture",
  "What is my current goal?",
  "Tell me my goal",
  "Show my user profile",
  "Analyze my last run",
  "How did I do on my last run",
  "Analyze my progress",
  "Show me my next workout",
  "What is my workout today",
  "Recipe for post-workout",
  "Post workout meal recipe",
  "Give me a recipe"
];

// Helper function to shuffle an array (Fisher-Yates shuffle)
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const AI_WELCOME_TEXT = "Hello ! I'm your BeFit AI fitness coach. 🤖 I'm here to help with personalized workout plans, diet info, injury advice, logging your workouts, and more. What can I help you with today ? 💪";

const ChatBot = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(DarkModeContext);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  
  // NEW: State to hold the full user profile directly from the backend
  const [userProfile, setUserProfile] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [presetQuestions, setPresetQuestions] = useState([]);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const [currentSessionId, setCurrentSessionId] = useState(() => Date.now().toString());

  // Format date to: 15-October-2023
  const formatChatDate = (dateVal) => {
    const d = new Date(dateVal);
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'long' });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // --- Fetch Real Profile Data on Load ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        setUserProfile(response.data.user);
      } catch (error) {
        console.error("Failed to load user profile in chat:", error);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const reshufflePresets = () => {
    const shuffled = shuffleArray([...allPresetQuestions]);
    setPresetQuestions(shuffled.slice(0, 10)); // Show 10 random questions
  };

  // --- Shuffle and select preset questions ---
  useEffect(() => {
    reshufflePresets();
  }, [user]);

  // --- Fetch Chat History on Load ---
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        let response;
        try {
          response = await api.get('/chat'); 
        } catch (err) {
          try {
            response = await api.get('/chat/history');
          } catch (err2) {
            response = await api.get('/user-activities'); // Fallback schema search
          }
        }
        
        // Safely map possible backend response structures
        let history = [];
        if (Array.isArray(response.data)) {
          history = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          history = response.data.data;
        } else if (response.data && Array.isArray(response.data.chats)) {
          history = response.data.chats;
        } else if (response.data && Array.isArray(response.data.history)) {
          history = response.data.history;
        }
        
        if (history.length > 0) {
          const grouped = {};
          const sortedHistory = [...history].sort((a, b) => new Date(a.createdAt || a.timestamp) - new Date(b.createdAt || b.timestamp));
          
          let lastSid = null;
          
          sortedHistory.forEach(chat => {
            // Group by existing sessionId OR fallback to smart time-based session grouping
            let sid = chat.sessionId;
            if (!sid) {
               const chatTime = new Date(chat.createdAt || chat.timestamp || Date.now()).getTime();
               if (!lastSid || (chatTime - lastSid.time > 60 * 60 * 1000)) { // 1 hour gap = new session
                 sid = `session_${chatTime}`;
                 lastSid = { id: sid, time: chatTime };
               } else {
                 sid = lastSid.id;
                 lastSid.time = chatTime; // extend session
               }
            }
            
            if (!grouped[sid]) {
              grouped[sid] = {
                sessionId: sid,
                // The title from the very first message in the session.
                // Prioritize an explicit title field if the backend provides it.
                title: chat.title || chat.query || chat.message || 'Conversation',
                timestamp: chat.createdAt || chat.timestamp || Date.now(),
                messages: []
              };
            }
            
            // If a later message in the same session has an explicit title, update it.
            // This ensures edited titles are respected upon reload.
            if (chat.title) grouped[sid].title = chat.title;
            // The session's timestamp should always reflect the last activity for correct sorting.
            grouped[sid].timestamp = chat.createdAt || chat.timestamp || Date.now();

            if(chat.query || chat.message) {
              grouped[sid].messages.push({
                id: (chat._id || Date.now() + Math.random()) + '_user',
                sender: 'user',
                text: chat.query || chat.message,
                time: new Date(chat.createdAt || chat.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              });
            }
            if(chat.response || chat.reply || chat.aiResponse) {
              grouped[sid].messages.push({
                id: (chat._id || Date.now() + Math.random()) + '_ai',
                sender: 'ai',
                text: chat.response || chat.reply || chat.aiResponse,
                time: new Date(chat.createdAt || chat.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              });
            }
          });
          
          const sessionsArray = Object.values(grouped).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setChatSessions(sessionsArray);
          
        }
      } catch (error) {
        console.warn("Failed to fetch chat history, starting fresh.", error);
      }
    };

    if (user) {
      fetchHistory();
    }
  }, [user]);

  // --- Initial Chat History ---
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: AI_WELCOME_TEXT,
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
    
    const activeSessionId = currentSessionId;

    try {
      // 2. Send to backend for AI response
      const response = await api.post('/chat', {
        message: text,
        query: text, // Sent alongside message to support different backend schemas
        sessionId: activeSessionId // Inform backend of the active thread
      });

      const aiResponseText = response.data.reply || response.data.response || response.data.message || response.data.answer || "I'm processing your request. Please try again.";

      const aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);

      // Update history sidebar dynamically
      setChatSessions(prevSessions => {
        const existingIdx = prevSessions.findIndex(s => s.sessionId === activeSessionId);
        if (existingIdx >= 0) {
          const updated = [...prevSessions];
          updated[existingIdx].messages.push(newMessage, aiResponse);
          updated[existingIdx].timestamp = new Date();
          const [moved] = updated.splice(existingIdx, 1);
          return [moved, ...updated];
        } else {
          return [{
            sessionId: activeSessionId,
            title: text,
            timestamp: new Date(),
            messages: [newMessage, aiResponse]
          }, ...prevSessions];
        }
      });
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
      reshufflePresets(); // Re-shuffle questions after every interaction
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Function to clear active window for a new conversation thread
  const handleNewChat = () => {
    const newSessionId = Date.now().toString();
    setCurrentSessionId(newSessionId);
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: AI_WELCOME_TEXT,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    try {
      // Remove from UI dynamically 
      setChatSessions(prev => prev.filter(s => s.sessionId !== sessionId));
      if (currentSessionId === sessionId) {
        handleNewChat();
      }
      // Execute database deletion via backend
      await api.delete(`/chat/${sessionId}`);
    } catch (error) {
      console.warn("Error deleting session or endpoint not yet configured", error);
    }
  };

  const handleEditTitle = (e, session) => {
    e.stopPropagation();
    setEditingSessionId(session.sessionId);
    setEditingTitle(session.title);
  };
  
  const handleSaveTitle = async (sessionId) => {
    if (!editingSessionId || !editingTitle.trim()) {
        setEditingSessionId(null); // Cancel if title is empty
        return;
    }
  
    const originalSession = chatSessions.find(s => s.sessionId === sessionId);
    if (originalSession && originalSession.title === editingTitle.trim()) {
        setEditingSessionId(null); // No change, just exit edit mode
        return;
    }
  
    const originalTitle = originalSession ? originalSession.title : '';
  
    // Optimistic UI update for a snappy user experience
    setChatSessions(prevSessions =>
        prevSessions.map(s =>
            s.sessionId === sessionId ? { ...s, title: editingTitle.trim() } : s
        )
    );
    setEditingSessionId(null); // Exit edit mode immediately
  
    try {
        await api.put(`/chat/${sessionId}`, { title: editingTitle.trim() });
    } catch (error) {
        console.error("Failed to update session title:", error);
        // Revert UI on error to maintain data integrity
        setChatSessions(prevSessions =>
            prevSessions.map(s => (s.sessionId === sessionId ? { ...s, title: originalTitle } : s))
        );
    }
  };

  return (
    <Layout>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
          body { font-family: 'Libre Baskerville', serif; }
          @keyframes chatSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-chat-slide-up { animation: chatSlideUp 0.4s ease-out forwards; }
        `}
      </style>

      {/* --- History Sidebar Overlay --- */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsHistoryOpen(false)}>
          <div 
            className={`w-80 h-full shadow-2xl flex flex-col transform transition-transform duration-300 ${isDarkMode ? 'bg-[#1e293b] border-l border-[#334155]' : 'bg-white border-l border-slate-200'}`}
            onClick={e => e.stopPropagation()} // Prevent close when clicking inside
          >
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <Clock size={18} className="text-[#00c4b4]"/> Chat History
              </h2>
              <button onClick={() => setIsHistoryOpen(false)} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 chat-scroll">
               {chatSessions.length > 0 ? (
                 chatSessions.map((session, idx) => (
                   <div 
                     key={session.sessionId || idx}
                     onClick={() => {
                       if (editingSessionId !== session.sessionId) {
                         setMessages(session.messages);
                         setCurrentSessionId(session.sessionId);
                         setIsHistoryOpen(false);
                       }
                     }}
                     className={`relative group p-3.5 rounded-xl cursor-pointer transition-all duration-300 transform hover:translate-x-1 hover:shadow-md border hover:border-[#00c4b4] ${isDarkMode ? 'bg-[#334155]/40 border-[#334155]' : 'bg-slate-50 border-slate-100'} ${currentSessionId === session.sessionId ? 'border-[#00c4b4] bg-[#00c4b4]/10' : ''}`}
                   >
                     <div className="flex justify-between items-start gap-2">
                       <div className="flex-1 min-w-0">
                         {editingSessionId === session.sessionId ? (
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveTitle(session.sessionId);
                                if (e.key === 'Escape') setEditingSessionId(null);
                              }}
                              onBlur={() => handleSaveTitle(session.sessionId)}
                              className={`w-full text-sm font-bold p-0 border-b-2 focus:outline-none focus:ring-0 ${isDarkMode ? 'bg-transparent text-white border-teal-500' : 'bg-transparent text-slate-900 border-teal-500'}`}
                              autoFocus
                              onClick={e => e.stopPropagation()}
                            />
                          ) : (
                            <p className={`text-sm font-bold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                              {session.title}
                            </p>
                          )}
                         <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                           {session.messages[session.messages.length - 1]?.text || 'No messages yet'}
                         </p>
                         <p className="text-[10px] text-slate-400 mt-2 font-medium">
                           {formatChatDate(session.timestamp || Date.now())} • {session.messages.length} messages
                         </p>
                       </div>
                       <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => handleEditTitle(e, session)} className={`p-1.5 rounded-lg transition-all ${isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'text-slate-500 hover:bg-slate-200'}`} title="Edit title">
                            <Pencil size={16} />
                          </button>
                          <button onClick={(e) => handleDeleteSession(e, session.sessionId)} className={`p-1.5 rounded-lg transition-all ${isDarkMode ? 'text-red-400 hover:bg-red-500 hover:text-white' : 'text-red-500 hover:bg-red-100'}`} title="Delete chat session">
                            <Trash2 size={16} />
                          </button>
                        </div>
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-70">
                   <MessageSquare size={32} className="mb-3 opacity-50" />
                   <p className="text-sm font-medium">No previous history</p>
                   <p className="text-xs mt-1 text-center px-4">Your conversations will be saved here automatically.</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      <div className={`flex flex-col h-[calc(100vh-140px)] ${isDarkMode ? 'dark-mode' : ''}`} style={{ fontFamily: "'Libre Baskerville', serif" }}>

        {/* --- Chat Header --- */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div className="hover:translate-x-1 transition-transform duration-300">
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>BeFit AI Coach</h1>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-[#cbd5e1]' : 'text-slate-500'}`}>Always active • Personalized fitness guidance</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleNewChat}
                className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${isDarkMode ? 'border-slate-700 bg-[#1e293b] hover:bg-slate-800 text-slate-300' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'}`}
                title="Start a New Chat"
              >
                <PlusCircle size={18} />
                <span className="text-sm font-bold hidden sm:inline">New Chat</span>
              </button>
              
              <button 
                onClick={() => setIsHistoryOpen(true)}
                className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${isDarkMode ? 'border-slate-700 bg-[#1e293b] hover:bg-slate-800 text-slate-300' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'}`}
                title="View Chat History"
              >
                <Clock size={18} />
                <span className="text-sm font-bold hidden sm:inline">History</span>
              </button>
            </div>
          </div>

          {/* Search Feedback */}
          {searchQuery && (
            <div className="mt-4 flex items-center gap-2 text-sm font-bold text-[#00c4b4] animate-pulse">
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
                className={`flex gap-4 animate-chat-slide-up ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'ai' ? 'bg-[#00c4b4]/10 border border-[#00c4b4]/50 shadow-md shadow-[#00c4b4]/30' : 'shadow-sm'}`}>
                  {msg.sender === 'ai' ? (
                    <img src={logo} alt="AI Coach" className="w-7 h-7 object-contain" />
                  ) : (
                    /* Display Real Profile Image directly from backend fetch (userProfile) */
                    userProfile?.profileImage ? (
                      <img 
                        src={userProfile.profileImage} 
                        alt="User" 
                        className={`w-full h-full rounded-full object-cover border-2 ${isDarkMode ? 'border-slate-600' : 'border-slate-400'}`}
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.name || 'User')}&background=00c4b4&color=fff`;
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full rounded-full border-2 flex items-center justify-center ${isDarkMode ? 'border-slate-600 bg-gradient-to-br from-indigo-600 to-purple-600' : 'border-slate-400 bg-gradient-to-br from-[#db2777] to-orange-400'}`}>
                        <User size={20} className="text-white" />
                      </div>
                    )
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 text-sm leading-relaxed whitespace-pre-wrap ${msg.sender === 'ai'
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
              <div className="w-10 h-10 rounded-full bg-[#00c4b4]/10 border border-[#00c4b4]/50 shadow-md shadow-[#00c4b4]/30 flex items-center justify-center shrink-0">
                <img src={logo} alt="AI Coach" className="w-7 h-7 object-contain" />
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
            <div className="flex gap-2 mb-4 overflow-x-auto pb-3">
              {presetQuestions.map((action) => (
                <button
                  key={action}
                  onClick={() => handleSend(action)}
                  className={`whitespace-nowrap px-4 py-2 border rounded-full text-xs font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:scale-105 ${
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
          <div className="relative flex items-center gap-2 transition-all duration-500 focus-within:-translate-y-1 focus-within:shadow-xl rounded-2xl">
            
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message your AI Coach..."
              className={`w-full pl-6 pr-14 py-4 border-none rounded-2xl focus:ring-2 focus:ring-[#00c4b4]/30 font-medium shadow-inner transition-shadow duration-300 ${
                isDarkMode 
                ? 'bg-[#1e293b] text-white placeholder:text-slate-400' 
                : 'bg-slate-50 text-slate-700 placeholder:text-slate-400'
              }`}
            />

            {/* Voice Toggle Button */}
            <button 
              onClick={handleVoiceInput}
              className={`absolute right-14 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                isListening ? 'bg-red-500 text-white shadow-lg animate-bounce' : 'text-slate-400 hover:text-[#00c4b4]'
              }`}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              className="absolute right-2 w-10 h-10 bg-[#00c4b4] hover:bg-[#00a89f] disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300 transform hover:scale-110 hover:rotate-6 active:scale-95"
            >
              <Send size={18} className={inputValue.trim() ? 'translate-x-0.5' : ''} />
            </button>
          </div>

          <p className={`text-center text-[10px] mt-3 font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
            ⚠️Note : BeFit AI Coach can make mistakes. Verify important health information with a professional.
          </p>
        </div>

      </div>
    </Layout>
  );
};

export default ChatBot;