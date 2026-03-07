import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../state/AppContext';

export default function Navbar() {
    const { user, logout, savedIds } = useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const isOwner = user?.role === 'owner';
    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMenuOpen(false);
    };

    const navLink = (to, label, icon) => (
        <Link to={to}
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${isActive(to)
                ? (isOwner ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700')
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}>
            {icon} {label}
        </Link>
    );

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to={isOwner ? '/owner-dashboard' : '/'} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${isOwner ? 'bg-amber-500' : 'bg-green-600'}`}>
                            <span className="text-white text-sm">🌿</span>
                        </div>
                        <span className="font-black text-gray-900 text-lg tracking-tight">
                            Eco<span className={isOwner ? 'text-amber-500' : 'text-green-600'}>Stay</span>
                        </span>
                        {isOwner && (
                            <span className="hidden sm:inline-flex px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Owner</span>
                        )}
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {isOwner ? (
                            <>
                                {navLink('/owner-dashboard', 'Dashboard', '📊')}
                                {navLink('/add-property', 'Add Property', '+')}
                            </>
                        ) : (
                            <>
                                {navLink('/', 'Home', '🏠')}
                                {navLink('/listings', 'Explore', '🌍')}
                                <Link to="/dashboard"
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all relative ${isActive('/dashboard') ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                                    ❤️ Saved
                                    {savedIds?.size > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                            {savedIds.size}
                                        </span>
                                    )}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Right: user + logout */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${isOwner ? 'bg-amber-500' : 'bg-green-600'}`}>
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                        </div>
                        <button onClick={handleLogout}
                            className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-xl transition-all">
                            Sign Out
                        </button>
                    </div>

                    {/* Mobile menu toggle */}
                    <button onClick={() => setMenuOpen(v => !v)} className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 shadow-lg">
                    {isOwner ? (
                        <>
                            {navLink('/owner-dashboard', 'Dashboard', '📊')}
                            {navLink('/add-property', 'Add Property', '+')}
                        </>
                    ) : (
                        <>
                            {navLink('/', 'Home', '🏠')}
                            {navLink('/listings', 'Explore', '🌍')}
                            {navLink('/dashboard', 'Saved & Bookings', '❤️')}
                        </>
                    )}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-sm text-gray-500">{user?.name} · <span className="capitalize">{user?.role}</span></span>
                        <button onClick={handleLogout} className="text-xs text-red-500 font-semibold">Sign Out</button>
                    </div>
                </div>
            )}
        </nav>
    );
}
