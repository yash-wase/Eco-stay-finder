import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

export function AppProvider({ children }) {
    // ── Auth ──
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('ecostay_user')) || null; }
        catch { return null; }
    });

    const login = (userData) => {
        localStorage.setItem('ecostay_user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('ecostay_user');
        setUser(null);
    };

    // ── Customer state ──
    const [savedIds, setSavedIds] = useState(new Set());
    const [bookings, setBookings] = useState([]);
    const [location, setLocation] = useState('');
    const [filters, setFilters] = useState({
        minScore: 0,
        maxPrice: 20000,
        type: '',
        features: [],
    });

    // Load saved property IDs on mount (for customers)
    useEffect(() => {
        if (user?.role === 'customer') {
            axios.get('/saved-properties').then(res => {
                const ids = res.data.data?.map(s => s.property_id?._id || s.property_id) || [];
                setSavedIds(new Set(ids));
            }).catch(() => { });
        }
    }, [user]);

    const saveProperty = async (id) => {
        try {
            await axios.post('/save-property', { property_id: id });
            setSavedIds(prev => new Set([...prev, id]));
        } catch (e) { console.error(e); }
    };

    const unsaveProperty = async (id) => {
        try {
            await axios.delete(`/remove-property/${id}`);
            setSavedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
        } catch (e) { console.error(e); }
    };

    return (
        <AppContext.Provider value={{
            user, login, logout,
            savedIds, saveProperty, unsaveProperty,
            bookings, setBookings,
            location, setLocation,
            filters, setFilters,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
