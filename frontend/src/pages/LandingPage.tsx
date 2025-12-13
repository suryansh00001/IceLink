import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-ice-900 via-ice-800 to-ice-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-ice-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ice-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-ice-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            {/* Navigation */}
            <nav className="bg-ice-900/50 backdrop-blur-xl border-b border-ice-700/50 sticky top-0 z-50 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-ice-400 via-ice-500 to-ice-600 blur-2xl opacity-60 animate-pulse"></div>
                                <img src="/assets/logo.png" alt="IceLink Logo" className="relative w-[84px] h-[84px] object-contain" />
                            </div>
                            <span className="text-3xl font-bold bg-gradient-to-r from-ice-200 via-white to-ice-300 bg-clip-text text-transparent">
                                IceLink
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="px-6 py-2.5 text-ice-200 hover:text-white font-semibold transition-all duration-300 hover:scale-105"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="px-8 py-2.5 bg-gradient-to-r from-ice-400 to-ice-500 hover:from-ice-500 hover:to-ice-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-ice-500/50 hover:scale-105"
                            >
                                Get Started Free
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
                <div className="text-center relative z-10">
                    <div className="inline-block mb-6 px-6 py-2 bg-ice-500/20 backdrop-blur-sm rounded-full border border-ice-400/30">
                        <span className="text-ice-200 font-medium">✨ Professional Communication Platform</span>
                    </div>
                    
                    <h1 className="text-7xl md:text-8xl font-extrabold mb-8 leading-tight">
                        <span className="bg-gradient-to-r from-white via-ice-100 to-ice-200 bg-clip-text text-transparent drop-shadow-2xl">
                            Crystal Clear
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-ice-200 via-ice-300 to-ice-400 bg-clip-text text-transparent">
                            Communication
                        </span>
                    </h1>
                    
                    <p className="text-2xl text-ice-200 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Experience seamless messaging and high-quality video calls. 
                        Connect with friends, family, and colleagues in a secure, professional environment.
                    </p>
                    
                    <div className="flex gap-6 justify-center items-center flex-wrap">
                        <button
                            onClick={() => navigate('/register')}
                            className="group px-10 py-5 bg-gradient-to-r from-ice-400 to-ice-500 hover:from-ice-500 hover:to-ice-600 text-white font-bold text-xl rounded-xl shadow-2xl hover:shadow-ice-400/50 transition-all duration-300 hover:scale-105 relative overflow-hidden"
                        >
                            <span className="relative z-10">Start Free Today</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-10 py-5 bg-ice-900/50 backdrop-blur-sm border-2 border-ice-400/50 text-ice-100 font-bold text-xl rounded-xl hover:bg-ice-800/50 hover:border-ice-300 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                        >
                            Sign In →
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-16 flex gap-8 justify-center items-center flex-wrap text-ice-300">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                            </svg>
                            <span>100% Free</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                            </svg>
                            <span>No Credit Card</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                            </svg>
                            <span>Instant Setup</span>
                        </div>
                    </div>
                </div>

                {/* Hero Visual */}
                <div className="mt-20 relative">
                    <div className="relative max-w-6xl mx-auto">
                        {/* Main screen mockup */}
                        <div className="bg-gradient-to-br from-ice-800/50 to-ice-900/50 backdrop-blur-xl border border-ice-600/30 rounded-2xl p-2 shadow-2xl">
                            <div className="aspect-video bg-gradient-to-br from-ice-950 to-ice-900 rounded-xl flex items-center justify-center border border-ice-700/50 relative overflow-hidden">
                                {/* Grid pattern */}
                                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, #e0f2fe 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                                
                                {/* Center icon */}
                                <div className="relative z-10">
                                    <div className="w-32 h-32 bg-gradient-to-br from-ice-400 to-ice-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-ice-500/50 animate-float">
                                        <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                                        </svg>
                                    </div>
                                </div>

                                {/* Floating status indicators */}
                                <div className="absolute top-8 left-8 bg-ice-800/80 backdrop-blur-md px-4 py-2 rounded-lg border border-ice-600/50 animate-slide-in-left">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-ice-200 text-sm font-medium">HD Quality</span>
                                    </div>
                                </div>

                                <div className="absolute top-8 right-8 bg-ice-800/80 backdrop-blur-md px-4 py-2 rounded-lg border border-ice-600/50 animate-slide-in-right">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                        <span className="text-ice-200 text-sm font-medium">Encrypted</span>
                                    </div>
                                </div>

                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-ice-800/80 backdrop-blur-md px-6 py-3 rounded-lg border border-ice-600/50 animate-slide-in-bottom">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-ice-800"></div>
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-ice-800"></div>
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-ice-800"></div>
                                        </div>
                                        <span className="text-ice-200 text-sm font-medium">Active Users</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-ice-400/20 to-transparent blur-3xl -z-10"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-20">
                    <div className="inline-block mb-4 px-6 py-2 bg-ice-500/20 backdrop-blur-sm rounded-full border border-ice-400/30">
                        <span className="text-ice-200 font-medium">🚀 Powerful Features</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-ice-100 to-ice-200 bg-clip-text text-transparent">
                        Everything You Need
                    </h2>
                    <p className="text-xl text-ice-300 max-w-2xl mx-auto">
                        Cutting-edge features designed for modern communication
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>,
                            title: "Instant Messaging",
                            description: "Send text messages, emojis, and media files instantly. Stay connected with real-time chat.",
                            gradient: "from-blue-500 to-cyan-500"
                        },
                        {
                            icon: <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>,
                            title: "HD Video Calls",
                            description: "Crystal-clear video and audio quality. See and hear every detail with WebRTC technology.",
                            gradient: "from-purple-500 to-pink-500"
                        },
                        {
                            icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>,
                            title: "Voice Calls",
                            description: "High-quality audio calls when you don't need video. Perfect for quick conversations.",
                            gradient: "from-green-500 to-emerald-500"
                        },
                        {
                            icon: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>,
                            title: "Group Chats",
                            description: "Create group conversations with unlimited members. Collaborate with your team effortlessly.",
                            gradient: "from-orange-500 to-red-500"
                        },
                        {
                            icon: <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>,
                            title: "Secure & Private",
                            description: "End-to-end encryption keeps your conversations private. Your data, your control.",
                            gradient: "from-indigo-500 to-blue-500"
                        },
                        {
                            icon: <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>,
                            title: "Call History",
                            description: "Track all your calls with detailed history. Never miss important conversations.",
                            gradient: "from-teal-500 to-cyan-500"
                        }
                    ].map((feature, index) => (
                        <div 
                            key={index}
                            className="group relative bg-ice-900/30 backdrop-blur-xl border border-ice-700/30 rounded-2xl p-8 hover:bg-ice-800/40 hover:border-ice-600/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-ice-500/20"
                        >
                            <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    {feature.icon}
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-ice-200 transition-colors">{feature.title}</h3>
                            <p className="text-ice-300 leading-relaxed">
                                {feature.description}
                            </p>
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-ice-600/20 to-ice-700/20 backdrop-blur-sm"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        {[
                            { value: "100%", label: "Free Forever", icon: "💎" },
                            { value: "24/7", label: "Always Available", icon: "⚡" },
                            { value: "HD", label: "Quality Calls", icon: "🎥" }
                        ].map((stat, index) => (
                            <div key={index} className="group">
                                <div className="text-6xl mb-3">{stat.icon}</div>
                                <div className="text-6xl md:text-7xl font-extrabold mb-3 bg-gradient-to-r from-white to-ice-200 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                                    {stat.value}
                                </div>
                                <div className="text-xl text-ice-200 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="relative bg-gradient-to-br from-ice-800/50 to-ice-900/50 backdrop-blur-xl border border-ice-600/30 rounded-3xl p-12 md:p-16 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-ice-400/10 to-ice-600/10"></div>
                    <div className="relative z-10">
                        <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-ice-100 to-ice-200 bg-clip-text text-transparent">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl md:text-2xl text-ice-200 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Join thousands of users already enjoying seamless communication with IceLink.
                            Sign up now and experience the difference.
                        </p>
                        <button
                            onClick={() => navigate('/register')}
                            className="group px-12 py-5 bg-gradient-to-r from-ice-400 to-ice-500 hover:from-ice-500 hover:to-ice-600 text-white font-bold text-xl rounded-xl shadow-2xl hover:shadow-ice-400/50 transition-all duration-300 hover:scale-110 relative overflow-hidden"
                        >
                            <span className="relative z-10">Create Free Account →</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative bg-ice-950/50 backdrop-blur-xl border-t border-ice-800/50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <svg className="w-10 h-10 text-ice-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 3.6v8.72c0 4.35-2.98 8.41-7 9.62V3.78l-1 .4z"/>
                            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" opacity="0.5"/>
                        </svg>
                        <span className="text-3xl font-bold bg-gradient-to-r from-ice-200 to-white bg-clip-text text-transparent">IceLink</span>
                    </div>
                    <p className="text-ice-300 text-lg mb-2">
                        © 2025 IceLink. Crystal Clear Communication.
                    </p>
                    <p className="text-ice-400 text-sm">
                        Built with ❤️ by 1C3B34R
                    </p>
                </div>
            </footer>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                @keyframes slide-in-left {
                    from {
                        opacity: 0;
                        transform: translateX(-100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes slide-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes slide-in-bottom {
                    from {
                        opacity: 0;
                        transform: translate(-50%, 100px);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
                
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                
                .animate-slide-in-left {
                    animation: slide-in-left 0.8s ease-out;
                }
                
                .animate-slide-in-right {
                    animation: slide-in-right 0.8s ease-out;
                }
                
                .animate-slide-in-bottom {
                    animation: slide-in-bottom 0.8s ease-out;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;

   