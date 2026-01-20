import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  // Logic to get the dynamic current year
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white font-sans text-[#142E5C] selection:bg-[#df20af] selection:text-white">
      
      {/* --- Global Styles for Fonts & Custom Effects --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;600;700;800;900&family=Noto+Sans:wght@400;500;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
          
          body { font-family: 'Epilogue', sans-serif; }
          .font-body { font-family: 'Noto Sans', sans-serif; }
          
          /* Custom Utilities */
          .soft-shadow { box-shadow: 0 10px 30px -5px rgba(20, 46, 92, 0.05); }
          .magenta-gradient { background: linear-gradient(135deg, #df20af 0%, #ff52d0 100%); }
          .hero-gradient-text {
            background: linear-gradient(90deg, #142E5C 0%, #33A1A1 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}
      </style>

      {/* --- Navigation --- */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#df20af] rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-2xl font-bold">bolt</span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-[#142E5C]">PulseAI</h2>
          </Link>
          
          <nav className="hidden md:flex items-center gap-10">
            {['Features', 'How it Works', 'Community', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className="text-sm font-bold text-[#142E5C] hover:text-[#df20af] transition-colors">
                {item}
              </a>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-sm font-bold text-[#142E5C] px-4 hover:text-[#df20af] transition-colors">
              Log in
            </Link>
            <Link to="/register" className="magenta-gradient text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg shadow-[#df20af]/20 hover:scale-105 transition-transform">
              Start Free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* --- Hero Section --- */}
        <section className="relative overflow-hidden pt-12 pb-24 lg:pt-24 lg:pb-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              
              {/* Hero Text */}
              <div className="flex-1 text-center lg:text-left">
                <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-[#df20af]/10 text-[#df20af] rounded-full">
                  Personal Training Redefined
                </span>
                <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight text-[#142E5C] mb-8">
                  Your AI <br/>
                  <span className="hero-gradient-text">Personal Trainer</span>
                </h1>
                <p className="text-lg text-gray-600 font-body max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                  Experience 24/7 personalized coaching and high-precision real-time form correction. Achieve your peak performance without the premium cost of a human trainer.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/register" className="magenta-gradient text-white px-10 py-5 rounded-xl text-base font-bold shadow-xl shadow-[#df20af]/30 hover:-translate-y-1 transition-all flex items-center justify-center">
                    Get Started for Free
                  </Link>
                  <button className="bg-white border-2 border-gray-100 px-10 py-5 rounded-xl text-base font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-[#142E5C]">
                    <span className="material-symbols-outlined">play_circle</span>
                    See in Action
                  </button>
                </div>
              </div>

              {/* Hero Image & Floating Card */}
              <div className="flex-1 w-full max-w-2xl relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#33A1A1]/20 to-[#df20af]/20 blur-3xl opacity-50"></div>
                <div className="relative bg-white p-4 rounded-3xl soft-shadow">
                  <div 
                    className="aspect-[4/5] w-full rounded-2xl bg-cover bg-center" 
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop')` }}
                  ></div>
                  
                  {/* Floating Stats Card */}
                  <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl soft-shadow border border-gray-50 max-w-[200px]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Form Accuracy</span>
                    </div>
                    <div className="text-3xl font-black text-[#142E5C]">98.4%</div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
                      <div className="w-[98%] h-full bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Stats Grid --- */}
        <section className="py-12 bg-[#f9fafb]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-gray-200">
              {[
                { val: '50k+', label: 'Active Athletes' },
                { val: '1.2M+', label: 'Guided Workouts' },
                { val: '99.8%', label: 'AI Precision' },
                { val: '4.9/5', label: 'User Rating' }
              ].map((stat, i) => (
                <div key={i} className={`text-center ${i === 0 ? 'border-none' : ''}`}>
                  <p className="text-4xl font-black text-[#142E5C] mb-1">{stat.val}</p>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="py-24 bg-white" id="features">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl lg:text-5xl font-black text-[#142E5C] mb-6">Smart Features for Better Results</h2>
              <p className="text-gray-600 font-body">Our advanced computer vision and adaptive algorithms ensure every rep counts toward your ultimate goal.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-10 rounded-3xl border border-gray-50 soft-shadow group hover:border-[#33A1A1]/30 transition-all hover:-translate-y-1">
                <div className="w-16 h-16 bg-[#33A1A1]/10 text-[#33A1A1] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">center_focus_strong</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-[#142E5C]">Real-time Tracking</h3>
                <p className="text-gray-600 font-body leading-relaxed text-sm">Instant feedback on your movement using advanced computer vision to prevent injuries and maximize gains.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-10 rounded-3xl border border-gray-50 soft-shadow group hover:border-[#CCAB26]/30 transition-all hover:-translate-y-1">
                <div className="w-16 h-16 bg-[#CCAB26]/10 text-[#CCAB26] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">adaptive_audio_mic</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-[#142E5C]">Adaptive Routines</h3>
                <p className="text-gray-600 font-body leading-relaxed text-sm">Workouts that evolve instantly based on your fatigue levels, heart rate, and strength improvements.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-10 rounded-3xl border border-gray-50 soft-shadow group hover:border-[#df20af]/30 transition-all hover:-translate-y-1">
                <div className="w-16 h-16 bg-[#df20af]/10 text-[#df20af] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">query_stats</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-[#142E5C]">Progress Analytics</h3>
                <p className="text-gray-600 font-body leading-relaxed text-sm">Deep-dive visual data that shows exactly where you're improving and where your untapped potential lies.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- How it Works --- */}
        <section className="py-24 mx-6" id="how-it-works">
          <div className="max-w-7xl mx-auto bg-[#142E5C] rounded-[3rem] px-6 py-20 text-white text-center relative overflow-hidden">
            <h2 className="text-3xl lg:text-5xl font-black mb-20 relative z-10">Master Your Training in 3 Steps</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative z-10">
              {/* Connector Line (Desktop) */}
              <div className="hidden lg:block absolute top-10 left-0 w-full h-0.5 bg-gradient-to-r from-[#33A1A1]/30 via-[#df20af]/30 to-[#CCAB26]/30"></div>

              {[
                { num: 1, title: 'Sync Your Devices', desc: 'Connect your smartwatch, phone camera, or gym equipment seamlessly in seconds.', color: 'bg-[#33A1A1]' },
                { num: 2, title: 'Start Training', desc: 'Follow dynamic, voice-guided workouts with real-time HUD overlays for form correction.', color: 'bg-[#df20af]' },
                { num: 3, title: 'Evolve Quickly', desc: 'Review your automated performance report and see your personalized plan adapt for tomorrow.', color: 'bg-[#CCAB26]' }
              ].map((step) => (
                <div key={step.num} className="flex flex-col items-center relative">
                  <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center text-2xl font-black mb-6 border-4 border-[#142E5C] shadow-xl relative z-10`}>
                    {step.num}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-300 font-body text-sm max-w-xs">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="py-32" id="pricing">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="p-12 lg:p-20 rounded-[3rem] bg-gradient-to-br from-[#f9fafb] to-white border border-gray-100 soft-shadow">
              <h2 className="text-4xl lg:text-6xl font-black text-[#142E5C] mb-8">Ready to break your records?</h2>
              <p className="text-lg text-gray-600 font-body mb-12 max-w-2xl mx-auto">
                Join 50,000+ athletes who are already training smarter, not harder. Start your 14-day premium trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="magenta-gradient text-white px-12 py-5 rounded-xl text-lg font-bold shadow-2xl shadow-[#df20af]/40 hover:-translate-y-1 transition-all">
                  Start Free Trial
                </Link>
                <button className="bg-[#142E5C] text-white px-12 py-5 rounded-xl text-lg font-bold hover:bg-[#142E5C]/90 transition-all">
                  Contact Sales
                </button>
              </div>
              <p className="mt-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest">No credit card required • Cancel anytime</p>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#df20af] rounded-lg flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-xl">bolt</span>
                </div>
                <h2 className="text-xl font-black tracking-tight text-[#142E5C]">PulseAI</h2>
              </div>
              <p className="text-gray-500 font-body text-sm leading-relaxed">The future of performance coaching. AI-driven, human-centered, results-oriented.</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-[#142E5C]">Product</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-body">
                <li><a href="#" className="hover:text-[#df20af]">Vision tracking</a></li>
                <li><a href="#" className="hover:text-[#df20af]">Workout Builder</a></li>
                <li><a href="#" className="hover:text-[#df20af]">Wearable Sync</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-[#142E5C]">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-body">
                <li><a href="#" className="hover:text-[#df20af]">Our Story</a></li>
                <li><a href="#" className="hover:text-[#df20af]">Science</a></li>
                <li><a href="#" className="hover:text-[#df20af]">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-[#142E5C]">Newsletter</h4>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email" className="flex-1 px-4 py-2 rounded-lg bg-gray-50 border-none text-sm focus:ring-2 focus:ring-[#df20af]/20 font-body"/>
                <button className="bg-[#df20af] text-white px-4 py-2 rounded-lg text-sm font-bold">Join</button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400 font-body">© 2025-{currentYear} PulseAI Technologies Inc. All rights reserved.</p>
            <div className="flex gap-6 text-gray-400">
              {['share', 'public', 'thumb_up'].map(icon => (
                <button key={icon} className="hover:text-[#df20af] transition-colors">
                  <span className="material-symbols-outlined text-xl">{icon}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;