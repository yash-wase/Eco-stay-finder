import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';

/* ── Hooks ──────────────────────────────────────────────────────────────── */
function useScrollReveal() {
    useEffect(() => {
        const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.12 }
        );
        els.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);
}

function useCounter(target, duration = 1800, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime = null;
        const step = (ts) => {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [start, target, duration]);
    return count;
}

/* ── Data ───────────────────────────────────────────────────────────────── */
const LOCATIONS = ['Goa', 'Kerala', 'Bali', 'Costa Rica'];

const FEATURES = [
    { icon: '☀️', title: 'Solar Powered', desc: 'Renewable energy from the sun', color: 'from-amber-50 to-yellow-50', border: 'border-amber-100' },
    { icon: '💧', title: 'Water Conscious', desc: 'Rainwater & greywater systems', color: 'from-blue-50 to-cyan-50', border: 'border-blue-100' },
    { icon: '♻️', title: 'Zero Waste', desc: 'Composting & minimal plastic', color: 'from-green-50 to-emerald-50', border: 'border-green-100' },
    { icon: '🌳', title: 'Reforestation', desc: 'Active tree planting programs', color: 'from-lime-50 to-green-50', border: 'border-lime-100' },
    { icon: '🤝', title: 'Community', desc: 'Supports local livelihoods', color: 'from-purple-50 to-violet-50', border: 'border-purple-100' },
    { icon: '🐢', title: 'Wildlife', desc: 'Active conservation programs', color: 'from-teal-50 to-green-50', border: 'border-teal-100' },
];

const CERTS = [
    '🏅 Green Globe', '🌿 Green Key', '🌍 EarthCheck', '🦜 Rainforest Alliance',
    '✈️ Travelife Gold', '🌱 Carbon Neutral', '⭐ Responsible Tourism', '🏆 EcoTourism Certified',
    '🏅 Green Globe', '🌿 Green Key', '🌍 EarthCheck', '🦜 Rainforest Alliance',
    '✈️ Travelife Gold', '🌱 Carbon Neutral', '⭐ Responsible Tourism', '🏆 EcoTourism Certified',
];

const STATS = [
    { target: 12, suffix: '+', label: 'Verified Eco Stays' },
    { target: 4, suffix: '', label: 'Countries' },
    { target: 100, suffix: '%', label: 'Eco Certified' },
    { target: 5, suffix: '★', label: 'Avg. Rating' },
];

/* ── Animated Counter ───────────────────────────────────────────────────── */
function StatCounter({ target, suffix, label, trigger }) {
    const count = useCounter(target, 1600, trigger);
    return (
        <div className="text-center">
            <p className="text-4xl font-black text-green-700 tabular-nums">
                {count}{suffix}
            </p>
            <p className="text-sm text-gray-500 mt-1 font-medium">{label}</p>
        </div>
    );
}

/* ── Floating Orbs (hero background decoration) ─────────────────────────── */
function FloatingOrbs() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="animate-float-slow absolute top-16 left-[8%] w-20 h-20 rounded-full bg-green-300/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl">🌿</div>
            <div className="animate-float absolute top-32 right-[12%] w-16 h-16 rounded-full bg-emerald-300/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-xl">☀️</div>
            <div className="animate-float-delay absolute bottom-28 left-[18%] w-14 h-14 rounded-full bg-teal-300/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-lg">🌱</div>
            <div className="animate-float-slow absolute bottom-20 right-[20%] w-18 h-18 rounded-full bg-green-200/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl">💧</div>
            <div className="animate-float absolute top-1/2 left-[5%] w-12 h-12 rounded-full bg-lime-300/15 border border-white/10 flex items-center justify-center text-lg">🐢</div>
            <div className="animate-float-delay absolute top-1/3 right-[6%] w-12 h-12 rounded-full bg-emerald-200/15 border border-white/10 flex items-center justify-center text-lg">🌳</div>
        </div>
    );
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function Home() {
    const [search, setSearch] = useState('');
    const { setLocation } = useApp();
    const navigate = useNavigate();
    const statsRef = useRef(null);
    const [statsVisible, setStatsVisible] = useState(false);

    useScrollReveal();

    // Trigger counter when stats section scrolls into view
    useEffect(() => {
        const el = statsRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const handleSearch = (loc) => {
        const q = loc || search;
        setLocation(q);
        navigate(q ? `/listings?location=${encodeURIComponent(q)}` : '/listings');
    };

    return (
        <div className="min-h-screen overflow-x-hidden">

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden min-h-[90vh] flex items-center text-white">
                {/* Photo background */}
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/hero.png')" }} />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-950/85 via-green-900/70 to-green-950/80" />
                {/* Floating orbs */}
                <FloatingOrbs />

                <div className="relative w-full max-w-5xl mx-auto px-6 py-28 text-center">
                    {/* Pill badge */}
                    <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-green-100 text-sm font-medium mb-6 border border-white/20">
                        🌱 Discover Sustainable Accommodations
                    </div>

                    {/* Headline */}
                    <h1 className="animate-fade-up-delay text-5xl md:text-7xl font-black mb-6 leading-tight drop-shadow-xl">
                        Stay Green,
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-200 to-teal-300">
                            Travel Better.
                        </span>
                    </h1>

                    {/* Subtext */}
                    <p className="animate-fade-up-delay-2 text-xl text-green-100 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow">
                        Eco-certified stays from{' '}
                        <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-lg">₹4,599/night</span>.
                        Every booking supports sustainability and local communities.
                    </p>

                    {/* Search */}
                    <div className="animate-fade-up-delay-2 max-w-2xl mx-auto">
                        <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-2xl border border-white/20">
                            <div className="flex items-center gap-2 pl-3 flex-1">
                                <span className="text-gray-400 text-lg">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search by destination (Goa, Bali, Kerala...)"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                    className="flex-1 py-2 text-gray-800 placeholder-gray-400 focus:outline-none text-sm font-medium bg-transparent"
                                />
                            </div>
                            <button
                                onClick={() => handleSearch()}
                                className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 active:scale-95 transition-all shadow-sm"
                            >
                                Explore
                            </button>
                        </div>

                        {/* Location chips */}
                        <div className="flex flex-wrap justify-center gap-3 mt-5">
                            {LOCATIONS.map(loc => (
                                <button
                                    key={loc}
                                    onClick={() => handleSearch(loc)}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
                                >
                                    📍 {loc}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scroll hint */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float-slow opacity-60">
                        <div className="flex flex-col items-center gap-1 text-white/60 text-xs">
                            <span>Scroll to explore</span>
                            <span className="text-lg">↓</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Certification Marquee ───────────────────────────────── */}
            <section className="bg-green-900 py-3 overflow-hidden border-y border-green-800">
                <div className="marquee-track gap-8 px-4">
                    {CERTS.map((c, i) => (
                        <span key={i} className="flex-shrink-0 text-green-200 text-sm font-medium px-6 py-1 rounded-full border border-green-700/50">
                            {c}
                        </span>
                    ))}
                </div>
            </section>

            {/* ── Stats Bar ──────────────────────────────────────────── */}
            <section ref={statsRef} className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {STATS.map((s) => (
                        <StatCounter key={s.label} {...s} trigger={statsVisible} />
                    ))}
                </div>
            </section>

            {/* ── Why EcoStay ────────────────────────────────────────── */}
            <section className="max-w-5xl mx-auto px-6 py-24">
                <div className="reveal text-center mb-16">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-4 uppercase tracking-widest">Why EcoStay</span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                        Sustainability you can
                        <span className="text-green-600"> see & measure</span>
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-lg">
                        Every property is scored on 6 pillars. You see exactly how green your stay is — no greenwashing.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 stagger">
                    {FEATURES.map(f => (
                        <div
                            key={f.title}
                            className={`reveal card-hover group p-6 bg-gradient-to-br ${f.color} rounded-2xl border ${f.border} text-center cursor-default`}
                        >
                            <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300 inline-block">
                                {f.icon}
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1 text-base">{f.title}</h3>
                            <p className="text-gray-500 text-sm leading-snug">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How It Works ────────────────────────────────────────── */}
            <section className="bg-gray-50 py-24 px-6 border-y border-gray-100">
                <div className="max-w-5xl mx-auto">
                    <div className="reveal text-center mb-16">
                        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full mb-4 uppercase tracking-widest">How It Works</span>
                        <h2 className="text-4xl font-black text-gray-900">Ready in 3 simple steps</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger">
                        {[
                            { step: '01', icon: '🔍', title: 'Search', desc: 'Find eco-certified stays by destination, type, or sustainability features.' },
                            { step: '02', icon: '📋', title: 'Request', desc: 'Send a booking request directly to the property owner.' },
                            { step: '03', icon: '✅', title: 'Confirmed', desc: 'Owner reviews and confirms your booking. Pack your bags!' },
                        ].map(({ step, icon, title, desc }) => (
                            <div key={step} className="reveal relative flex flex-col items-center text-center group">
                                <div className="relative mb-6">
                                    <div className="w-20 h-20 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                                        {icon}
                                    </div>
                                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-green-600 text-white text-xs font-black rounded-full flex items-center justify-center">
                                        {step}
                                    </span>
                                </div>
                                <h3 className="font-bold text-xl text-gray-900 mb-2">{title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden py-28 px-6">
                {/* Animated gradient bg */}
                <div className="absolute inset-0 gradient-animate bg-gradient-to-br from-green-700 via-emerald-600 to-teal-700" />
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                    backgroundSize: '32px 32px',
                }} />
                {/* Floating shapes */}
                <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/5 animate-float-slow" />
                <div className="absolute bottom-10 right-10 w-28 h-28 rounded-full bg-white/5 animate-float" />

                <div className="reveal-scale relative max-w-3xl mx-auto text-center text-white">
                    <div className="text-6xl mb-6 animate-float-slow inline-block">🌿</div>
                    <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                        Ready for your next<br />eco adventure?
                    </h2>
                    <p className="text-green-200 mb-10 text-lg max-w-xl mx-auto">
                        Browse 12+ verified eco-stays across 4 countries. Every stay makes a difference.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={() => navigate('/listings')}
                            className="btn-press px-10 py-4 bg-white text-green-800 font-black rounded-2xl hover:bg-green-50 shadow-xl text-lg"
                        >
                            🌿 Explore All Stays
                        </button>
                        <button
                            onClick={() => navigate('/listings')}
                            className="btn-press px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold rounded-2xl backdrop-blur-sm transition-all text-lg"
                        >
                            Browse by Location →
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Footer ──────────────────────────────────────────────── */}
            <footer className="bg-green-950 text-green-300 py-10 px-6 text-center">
                <div className="animate-float-slow inline-block text-3xl mb-3">🌿</div>
                <p className="font-black text-white text-xl mb-1">EcoStay Finder</p>
                <p className="text-sm mb-4">Green Accommodation Discovery Platform · Built for a sustainable future</p>
                <div className="flex justify-center gap-6 text-xs text-green-500">
                    <span>🌍 Eco Certified</span>
                    <span>♻️ Zero Waste</span>
                    <span>☀️ Solar Powered</span>
                    <span>🤝 Community First</span>
                </div>
            </footer>
        </div>
    );
}
