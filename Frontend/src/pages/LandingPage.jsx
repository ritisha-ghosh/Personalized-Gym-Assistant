import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { DarkModeContext } from '../context/DarkModeContext';

const LandingPage = () => {
  const currentYear = new Date().getFullYear();
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

  // State to handle the hover for "Our Story" manually since we are using inline styles
  const [isStoryHovered, setIsStoryHovered] = useState(false);

  // Define the exact grey color for Kolkata text to reuse
  const locationGrey = isDarkMode ? '#94a3b8' : '#6b7280';
  const hoverTeal = '#00c4b4';

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'dark-mode' : 'bg-white'} selection:bg-teal-500 selection:text-white`}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;600;700;800;900&family=Noto+Sans:wght@400;500;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
          
          body { font-family: 'Epilogue', sans-serif; }
          .font-body { font-family: 'Noto Sans', sans-serif; }
          
          .soft-shadow { box-shadow: 0 10px 30px -5px rgba(20, 46, 92, 0.05); }
          .teal-gradient { background: linear-gradient(135deg, #00c4b4 0%, #00a89f 100%); }
          .hero-gradient-text {
            background: linear-gradient(90deg, #142E5C 0%, #00c4b4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          
          .dark-mode .hero-gradient-text {
            background: linear-gradient(90deg, #00c4b4 0%, #00f5ff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          /* Global Scrollbar Styles */
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
        `}
      </style>

      <header className={`sticky top-0 z-50 w-full backdrop-blur-md border-b ${isDarkMode ? 'bg-[#0f172a]/80 border-[#334155]' : 'bg-white/80 border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-105 ${isDarkMode ? 'bg-[#00c4b4]' : 'bg-teal-500'}`}>
              <span className="text-2xl font-bold">⚡</span>
            </div>
            <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-[#00c4b4]' : 'text-[#142E5C]'}`}>PulseAI</h2>
          </Link>
          
          <nav className={`hidden md:flex items-center gap-10 bg-transparent ${isDarkMode ? 'text-[#cbd5e1]' : 'text-[#142E5C]'}`}>
            {['Features',  'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-[#cbd5e1] hover:text-[#00c4b4] hover:bg-transparent' : 'text-[#142E5C] hover:text-[#00c4b4] hover:bg-transparent'}`}>
                {item}
              </a>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all bg-transparent ${isDarkMode ? 'text-[#00c4b4] hover:bg-[#1e293b]/40' : 'text-slate-600 hover:bg-slate-100'}`}
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* UPDATED: Login button with bordered look, no background hover, just smooth scale zoom */}
            <Link to="/login" className={`hidden sm:flex items-center justify-center text-sm font-bold px-6 py-2.5 rounded-full border transition-transform duration-300 active:scale-95 hover:scale-105 ${
              isDarkMode 
                ? 'border-[#334155] text-[#00c4b4] hover:border-[#475569]' 
                : 'border-gray-200 text-[#142E5C] hover:border-gray-300'
            }`}>
              Log in
            </Link>

            <Link to="/register" className="px-6 py-3 rounded-full text-sm font-bold shadow-lg transition-transform hover:scale-105 bg-[#00c4b4] !text-white shadow-teal-500/30">
              Register
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className={`relative overflow-hidden pt-12 pb-24 lg:pt-24 lg:pb-32 ${isDarkMode ? 'bg-[#0f172a]' : ''}`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 text-center lg:text-left">
                <span className={`inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase rounded-full ${isDarkMode ? 'bg-[#00c4b4]/20 text-[#00f5ff]' : 'bg-teal-500/10 text-teal-600'}`}>
                  Personal Training Redefined
                </span>
                <h1 className={`text-5xl lg:text-7xl font-black leading-tight tracking-tight mb-8 ${isDarkMode ? 'text-white' : 'text-[#142E5C]'}`}>
                  Your AI <br/>
                  <span className="hero-gradient-text">Personal Trainer</span>
                </h1>
                <p className={`text-lg max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed ${isDarkMode ? 'text-[#cbd5e1]' : 'text-gray-600'}`}>
                  Experience 24/7 personalized coaching and high-precision real-time form correction. Achieve your peak performance without the premium cost of a human trainer.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/register" className="bg-[#00c4b4] !text-white px-10 py-5 rounded-xl text-base font-bold shadow-xl shadow-teal-500/30 hover:-translate-y-1 transition-all flex items-center justify-center">
                    Get Started for Free
                  </Link>
                </div>
              </div>

              <div className="flex-1 w-full max-w-2xl relative">
                <div className={`absolute -inset-4 blur-3xl opacity-50 ${isDarkMode ? 'bg-gradient-to-r from-[#00c4b4]/20 to-[#00c4b4]/10' : 'bg-gradient-to-r from-teal-500/20 to-teal-500/10'}`}></div>
                <div className={`relative p-4 rounded-3xl soft-shadow ${isDarkMode ? 'bg-[#1e293b]' : 'bg-white'}`}>
                  <div 
                    className="aspect-[4/5] w-full rounded-2xl bg-cover bg-center" 
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop')` }}
                  ></div>
                  
                  <div className={`absolute -bottom-6 -left-6 p-6 rounded-2xl soft-shadow border max-w-[200px] ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-white border-gray-50'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                        ✓
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>Form Accuracy</span>
                    </div>
                    <div className={`text-3xl font-black ${isDarkMode ? 'text-[#00c4b4]' : 'text-[#142E5C]'}`}>98.4%</div>
                    <div className={`w-full h-1.5 rounded-full mt-3 overflow-hidden ${isDarkMode ? 'bg-[#334155]' : 'bg-gray-100'}`}>
                      <div className="w-[98%] h-full bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`py-12 ${isDarkMode ? 'bg-[#1e293b]' : 'bg-[#f9fafb]'}`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-8 ${isDarkMode ? 'divide-[#334155]' : 'divide-gray-200'} divide-x`}>
              {[
                { val: '50k+', label: 'Active Athletes' },
                { val: '1.2M+', label: 'Guided Workouts' },
                { val: '99.8%', label: 'AI Precision' },
                { val: '4.9/5', label: 'User Rating' }
              ].map((stat, i) => (
                <div key={i} className={`text-center ${i === 0 ? 'border-none' : ''}`}>
                  <p className={`text-4xl font-black mb-1 ${isDarkMode ? 'text-[#00c4b4]' : 'text-[#142E5C]'}`}>{stat.val}</p>
                  <p className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-400'}`}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={`py-24 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-white'}`} id="features">
          <div className="max-w-7xl mx-auto px-6">
            <div className={`text-center mb-16 max-w-2xl mx-auto ${isDarkMode ? 'text-white' : 'text-[#142E5C]'}`}>
              <h2 className="text-3xl lg:text-5xl font-black mb-6">Smart Features for Better Results</h2>
              <p className={`${isDarkMode ? 'text-[#cbd5e1]' : 'text-gray-600'}`}>Our advanced computer vision and adaptive algorithms ensure every rep counts toward your ultimate goal.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`p-10 rounded-3xl border soft-shadow group hover:-translate-y-1 transition-all ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:border-[#00c4b4]' : 'bg-white border-gray-50 hover:border-teal-300'}`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-[#00c4b4]/20 text-[#00c4b4]' : 'bg-teal-500/10 text-teal-600'}`}>
                  🎯
                </div>
                <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#142E5C]'}`}>Real-time Tracking</h3>
                <p className={`leading-relaxed text-sm ${isDarkMode ? 'text-[#cbd5e1]' : 'text-gray-600'}`}>Instant feedback on your movement using advanced computer vision to prevent injuries and maximize gains.</p>
              </div>

              <div className={`p-10 rounded-3xl border soft-shadow group hover:-translate-y-1 transition-all ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:border-[#00c4b4]' : 'bg-white border-gray-50 hover:border-teal-300'}`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-[#00c4b4]/20 text-[#00c4b4]' : 'bg-teal-500/10 text-teal-600'}`}>
                  ⚙️
                </div>
                <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#142E5C]'}`}>Adaptive Routines</h3>
                <p className={`leading-relaxed text-sm ${isDarkMode ? 'text-[#cbd5e1]' : 'text-gray-600'}`}>Workouts that evolve instantly based on your fatigue levels, heart rate, and strength improvements.</p>
              </div>

              <div className={`p-10 rounded-3xl border soft-shadow group hover:-translate-y-1 transition-all ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:border-[#00c4b4]' : 'bg-white border-gray-50 hover:border-teal-300'}`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-[#00c4b4]/20 text-[#00c4b4]' : 'bg-teal-500/10 text-teal-600'}`}>
                  📊
                </div>
                <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#142E5C]'}`}>Progress Analytics</h3>
                <p className={`leading-relaxed text-sm ${isDarkMode ? 'text-[#cbd5e1]' : 'text-gray-600'}`}>Deep-dive visual data that shows exactly where you're improving and where your untapped potential lies.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={`py-32 ${isDarkMode ? 'bg-[#1e293b]' : 'bg-white'}`} id="pricing">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className={`p-12 lg:p-20 rounded-[3rem] border soft-shadow ${isDarkMode ? 'bg-gradient-to-br from-[#1e293b] to-[#334155] border-[#334155]' : 'bg-gradient-to-br from-[#f9fafb] to-white border-gray-100'}`}>
              <h2 className={`text-4xl lg:text-6xl font-black mb-8 ${isDarkMode ? 'text-white' : 'text-[#142E5C]'}`}>Ready to break your records?</h2>
              <p className={`text-lg mb-12 max-w-2xl mx-auto ${isDarkMode ? 'text-[#cbd5e1]' : 'text-gray-600'}`}>
                Join 50,000+ athletes who are already training smarter, not harder. Start your 14-day premium trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="bg-[#00c4b4] !text-white px-12 py-5 rounded-xl text-lg font-bold shadow-2xl shadow-teal-500/40 hover:-translate-y-1 transition-all">
                  Start Free Trial
                </Link>
              </div>
              <p className={`mt-8 text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-400'}`}>No credit card required • Cancel anytime</p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER RESTRUCTURED FOR FULL WIDTH RESPONSIVENESS AND CENTERED COPYRIGHT */}
      <footer className={`pt-20 border-t flex flex-col items-center ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-white border-gray-100'}`}>
        
        {/* Top Section: Grid layout evenly spaced */}
        <div className="max-w-7xl mx-auto px-6 w-full mb-16">
          <div className={`flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8 ${isDarkMode ? 'text-[#cbd5e1]' : 'text-gray-900'}`}>
            
            {/* Left: PulseAI */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white">
                  ⚡
                </div>
                <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-[#00c4b4]' : 'text-[#142E5C]'}`}>PulseAI</h2>
              </div>
              <p className={`text-sm leading-relaxed max-w-sm ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
                The future of performance coaching. AI-driven, human-centered, results-oriented.
              </p>
            </div>
            
            {/* Center: Location */}
            <div className="flex-1 flex justify-start md:justify-center">
              <div>
                <h4 className={`font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-[#142E5C]'}`}>Location</h4>
                <ul className={`space-y-4 text-sm`}>
                   <li 
                    className="leading-relaxed list-none" 
                    style={{ color: locationGrey }}
                   >
                     Kolkata, WestBengal, India
                   </li>
                </ul>
              </div>
            </div>  

            {/* Right: Company */}
            <div className="flex-1 flex justify-start md:justify-end">
              <div className="custom-footer-link-container">
                <h4 className={`font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-[#142E5C]'}`}>Developers</h4>
                <ul className={`space-y-4 text-sm`}>
                  <li>
                    <div className="inline-block">
                      <Link 
                        to="/OurStory" 
                        onMouseEnter={() => setIsStoryHovered(true)}
                        onMouseLeave={() => setIsStoryHovered(false)}
                        className="transition-all duration-200 transform hover:scale-105 active:scale-95 py-0.5"
                        style={{ 
                          color: isStoryHovered ? hoverTeal : locationGrey, 
                          textDecoration: 'none',
                          borderBottom: `1px solid ${isStoryHovered ? hoverTeal : (isDarkMode ? 'rgba(148, 163, 184, 0.3)' : 'rgba(107, 114, 128, 0.3)')}`,
                          display: 'inline-block'
                        }}
                      >
                        Our Story
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: Full Width Line and Centered Copyright */}
        <div className={`w-full border-t py-8 ${isDarkMode ? 'border-[#334155]' : 'border-gray-100'}`}>
          <div className="w-full px-6 flex justify-center items-center">
            <p className={`text-xs text-center ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-400'}`}>
              © 2025-{currentYear} All rights reserved.
            </p>
          </div>
        </div>
        
      </footer>
    </div>
  );
};

export default LandingPage;