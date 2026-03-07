import axios from 'axios';

const api = axios.create({ baseURL: '/' });

export const getProperties = (params = {}) =>
    api.get('/properties', { params }).then(r => r.data.data);

export const getProperty = (id) =>
    api.get(`/properties/${id}`).then(r => r.data.data);

export const createBooking = (data) =>
    api.post('/booking-request', data).then(r => r.data.data);

export const getUserBookings = () =>
    api.get('/user-bookings').then(r => r.data.data);

export const updateBookingStatus = (id, status) =>
    api.patch(`/booking-request/${id}/status`, { status }).then(r => r.data.data);

export const getSavedProperties = () =>
    api.get('/saved-properties').then(r => r.data.data);

export const saveProperty = (property_id) =>
    api.post('/save-property', { property_id }).then(r => r.data.data);

export const removeSavedProperty = (property_id) =>
    api.delete(`/remove-property/${property_id}`).then(r => r.data);

// Owner APIs
export const addProperty = (data) =>
    api.post('/properties', data).then(r => r.data.data);

export const getOwnerProperties = (owner_id) =>
    api.get('/owner-properties', { params: { owner_id } }).then(r => r.data.data);

export const getOwnerBookings = (owner_id) =>
    api.get('/owner-bookings', { params: { owner_id } }).then(r => r.data.data);

export default api;

