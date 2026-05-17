import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { DarkModeContext } from '../context/DarkModeContext';

// Import image asset
import TeamImg from '../assets/Team.png'; 
import logoImg from '../assets/logo.png';

const OurStory = () => {
  const currentYear = new Date().getFullYear();
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  
  // State for advanced screenshot prevention (blurs page when snipping tool opens)
  const [isSecurityBlurred, setIsSecurityBlurred] = useState(false);

  // --- SECURITY LOGIC (Only runs on this page) ---
  useEffect(() => {
    const blockKeys = (e) => {
      if (
        e.key === 'PrintScreen' || 
        (e.ctrlKey && ['p', 'c', 's', 'u'].includes(e.key.toLowerCase())) || 
        (e.metaKey && ['p', 'c', 's', 'u'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
      }
    };

    const handleWindowBlur = () => setIsSecurityBlurred(true);
    const handleWindowFocus = () => setIsSecurityBlurred(false);

    window.addEventListener('keydown', blockKeys);
    window.addEventListener('keyup', blockKeys);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('keydown', blockKeys);
      window.removeEventListener('keyup', blockKeys);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  return (
    <div 
      className={`min-h-screen flex flex-col select-none transition-all duration-150 ${isDarkMode ? 'dark-mode bg-[#0f172a]' : 'bg-slate-50'} ${isSecurityBlurred ? 'blur-xl grayscale' : ''}`}
      onContextMenu={(e) => e.preventDefault()} 
      onDragStart={(e) => e.preventDefault()}   
      style={{ fontFamily: "'Libre Baskerville', serif" }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
          
          body { font-family: 'Libre Baskerville', serif; }
          .font-body { font-family: 'Libre Baskerville', serif; }

          @media print {
            body { display: none !important; }
          }

          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          ::-webkit-scrollbar-track {
            background: ${isDarkMode ? '#1e293b' : '#f1f5f9'};
          }
          ::-webkit-scrollbar-thumb {
            background-color: ${isDarkMode ? '#334155' : '#94a3b8'};
            border-radius: 20px;
          }

          .comic-shadow {
            box-shadow: 12px 12px 0px ${isDarkMode ? '#00c4b4' : '#142E5C'};
          }
          
          .cartoon-text {
            background: ${isDarkMode ? 'linear-gradient(90deg, #00f5ff, #ff00ea, #ffb800)' : 'linear-gradient(90deg, #00c4b4, #db2777, #f59e0b)'};
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}
      </style>

      {/* UPDATED: Landing page style blurred header so text scrolls underneath perfectly */}
      <header className={`sticky top-0 z-50 w-full backdrop-blur-md border-b pt-2 pb-2 ${isDarkMode ? 'bg-[#0f172a]/80 border-[#334155]' : 'bg-slate-50/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-8 lg:px-16 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logoImg} alt="BeFit Logo" className="w-14 h-14 object-contain transition-transform group-hover:scale-105" />
            <h2 className={`text-xl font-light tracking-wide hover:text-teal-500 transition-colors ${isDarkMode ? 'text-[#00c4b4]' : 'text-[#142E5C]'}`}>Back to Home Page</h2>
          </Link>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-[#00c4b4] hover:bg-[#1e293b]/40' : 'text-slate-600 hover:bg-slate-200'}`}
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-8 lg:px-16 py-10 flex flex-col items-center justify-center !bg-transparent">
        
        <div className="text-center mb-16 w-full !bg-transparent">
          <h1 className="text-1xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter cartoon-text uppercase mb-4 py-2">
            Our-Journey
          </h1>
          <p className={`text-lg md:text-1xl font-bold !bg-transparent ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            How a friendly discussion became the future of fitness.
          </p>
        </div>

        {/* items-stretch ensures both columns start and end at the exact same height on large screens */}
        <div className="flex flex-col lg:flex-row items-stretch gap-10 lg:gap-16 w-full !bg-transparent">
          
          {/* Left Column: Photo & Team Members */}
          {/* Native flex-1 and justify-between forces inner elements to push to the extremes of the stretched container */}
          <div className="flex-1 w-full flex flex-col justify-between gap-8 lg:gap-16 !bg-transparent">
            
            <div className="relative w-[90%] sm:w-4/5 lg:w-full mx-auto rounded-[2rem] comic-shadow border-4 border-slate-900 overflow-hidden bg-slate-200">
              <img 
                src={TeamImg} 
                alt="BeFit Team" 
                className="w-full h-auto block pointer-events-none" 
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" }}
              />
            </div>

            {/* mt-auto forces this box to pin to the absolute bottom of the column */}
            <div className={`mt-auto w-[90%] sm:w-4/5 lg:w-full mx-auto p-5 rounded-3xl border-4 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-teal-50 border-teal-100'}`}>
              <h3 className={`text-lg font-black mb-3 ${isDarkMode ? 'text-[#00f5ff]' : 'text-teal-600'}`}>
                Team Members
              </h3>
              <ul className="space-y-1.5 !bg-transparent">
                {[
                  "Subham Roy",
                  "Ritisha Ghosh",
                  "Debanka Samanta",
                  "Shreya Sarkar",
                  "Pritam Chakraborty"
                ].map((member, index) => (
                  <li key={index} className="flex items-center gap-2 !bg-transparent">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                    <span className={`font-bold text-base !bg-transparent ${isDarkMode ? 'text-white' : 'text-[#142E5C]'}`}>
                      {member}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Story Text & Mission Box */}
          <div className="flex-1 w-full flex flex-col justify-between gap-8 !bg-transparent">
            <div className="space-y-6 !bg-transparent">
              <h2 className={`text-xl md:text-2xl font-extrabold tracking-tight !bg-transparent ${isDarkMode ? 'text-white' : 'text-[#142E5C]'}`}>
                Final Year Project ⚡
              </h2>
              
              <p className={`text-base md:text-m font-medium leading-relaxed !bg-transparent ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                It all started with a crazy observation : <span className="cartoon-text font-bold !bg-transparent">getting fit shouldn't be boring , and personal trainers shouldn't cost a fortune .</span> We wanted to build a world where anyone , anywhere , could access elite-level coaching right from their living room .
              </p>
              
              <p className={`text-base md:text-m font-medium leading-relaxed !bg-transparent ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                We are from the <b>B.Tech CSE</b> , 2022–2026 batch at the Bengal Institute of Technology , Kolkata . One day, our team was discussing various fitness problems , which inspired us to develop a solution for our final year project . And then under the mentorship of <b>Prof. Bulbul Mukherjee</b> , we developed this platform .
              </p>

              <p className={`text-base md:text-m font-medium leading-relaxed !bg-transparent ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Enter BeFit ! A squad of gym junkies and code wizards banded together . Powered entirely by passion , late-night pizzas , and endless cups of coffee , we trained cutting-edge AI-ML models to actually understand human biomechanics .
              </p>
            </div>

            {/* mt-auto forces this box to pin to the absolute bottom of the column */}
            <div className={`mt-auto p-5 md:p-6 rounded-3xl border-4 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-teal-50 border-teal-100'}`}>
              <h3 className={`text-xl font-black mb-2 ${isDarkMode ? 'text-[#00f5ff]' : 'text-teal-600'}`}>Our Mission is Simple :</h3>
              <p className={`font-bold text-xm !bg-transparent ${isDarkMode ? 'text-white' : 'text-[#142E5C]'}`}>
               Fitness made simple. We’ve streamlined gym routines and diet plans so you can reach your goals at home. Track your daily progress and start your journey toward a healthier life today !
              </p>
            </div>
          </div>

        </div>
      </main>
      
    </div>
  );
};

export default OurStory;