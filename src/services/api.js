// Axios-based API service layer
// All requests currently resolve against localStorage.
// To switch to a real backend, update the adapter functions below.
// The calling code (context/hooks) does NOT need to change.

import axios from 'axios';
import storage from '../utils/storage';
import { generateId } from '../utils/formatters';
import { normalizeUser } from '../utils/userModel';
import {
  DEMO_USERS,
  INITIAL_EQUIPMENT,
  INITIAL_BOOKINGS,
  INITIAL_FARMS,
  INITIAL_ACTIVITIES,
  INITIAL_EXPENSES,
  INITIAL_ASSISTED_REQUESTS,
} from '../data/mockData';

// ─── Axios instance ───────────────────────────────────────────────────
// In production: set baseURL to your API and remove the interceptors below.
const api = axios.create({
  baseURL: '/api', // Future: replace with real API base URL
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Initialise demo data on first load ──────────────────────────────
export const initializeDemoData = () => {
  // Only seed if storage is empty (preserve user changes)
  if (!storage.get('initialized')) {
    storage.set('users', DEMO_USERS.map(normalizeUser));
    storage.set('equipment', INITIAL_EQUIPMENT);
    storage.set('bookings', INITIAL_BOOKINGS);
    storage.set('farms', INITIAL_FARMS);
    storage.set('activities', INITIAL_ACTIVITIES);
    storage.set('expenses', INITIAL_EXPENSES);
    storage.set('assistedRequests', INITIAL_ASSISTED_REQUESTS);
    storage.set('initialized', true);
  } else {
    // Safe, backward-compatible migration for existing records
    const existingUsers = storage.get('users', []);
    let changed = false;
    const normalizedUsers = existingUsers.map((u) => {
      const norm = normalizeUser(u);
      if (!u.capabilities || u.preferredDashboard !== norm.preferredDashboard) {
        changed = true;
        return norm;
      }
      return u;
    });

    // Make sure dual demo user is available in demo list
    if (!normalizedUsers.some((u) => u.email === 'dual@demo.com')) {
      const dualUser = DEMO_USERS.find((u) => u.email === 'dual@demo.com');
      if (dualUser) {
        normalizedUsers.push(normalizeUser(dualUser));
        changed = true;
      }
    }

    if (changed) {
      storage.set('users', normalizedUsers);
    }

    // Ensure dual user demo equipment & booking exists if demo bookings are present
    const existingBookings = storage.get('bookings', []);
    if (existingBookings.length > 0 && !existingBookings.some((b) => b.id === 'BKG-DEMO-003')) {
      const dualBooking = INITIAL_BOOKINGS.find((b) => b.id === 'BKG-DEMO-003');
      if (dualBooking) {
        storage.set('bookings', [...existingBookings, dualBooking]);
      }
    }

    const existingFarms = storage.get('farms', []);
    if (existingFarms.length > 0 && !existingFarms.some((f) => f.id === 'farm-demo-002')) {
      const dualFarm = INITIAL_FARMS.find((f) => f.id === 'farm-demo-002');
      if (dualFarm) {
        storage.set('farms', [...existingFarms, dualFarm]);
      }
    }

    const current = storage.get('currentUser', null);
    if (current) {
      storage.set('currentUser', normalizeUser(current));
    }
  }
};

// ─── Reset demo data ──────────────────────────────────────────────────
export const resetDemoData = () => {
  storage.clear();
  initializeDemoData();
};

// ─── AUTH ─────────────────────────────────────────────────────────────
export const authApi = {
  login: async (arg1, arg2) => {
    const users = storage.get('users', []);
    let identifier, password;
    if (typeof arg1 === 'object' && arg1 !== null) {
      identifier = arg1.email || arg1.phone || arg1.identifier;
      password = arg1.password;
    } else {
      identifier = arg1;
      password = arg2;
    }

    const cleanIdentifier = String(identifier || '').trim().toLowerCase();
    const user = users.find((u) => {
      const matchesEmail = u.email && u.email.toLowerCase() === cleanIdentifier;
      const matchesPhone = u.phone && u.phone.trim() === String(identifier || '').trim();
      return (matchesEmail || matchesPhone) && u.password === password;
    });

    if (!user) {
      throw new Error('Invalid credentials. Please check your email/phone and password.');
    }

    const safeUser = normalizeUser(user);
    const { password: _pw, ...cleanUser } = safeUser;
    storage.set('currentUser', cleanUser);
    return { user: cleanUser };
  },

  logout: async () => {
    storage.remove('currentUser');
    return { success: true };
  },

  signup: async (userData) => {
    const users = storage.get('users', []);
    const cleanEmail = userData.email?.trim().toLowerCase();
    const cleanPhone = userData.phone?.trim();

    const exists = users.find(
      (u) =>
        (cleanEmail && u.email?.toLowerCase() === cleanEmail) ||
        (cleanPhone && u.phone?.trim() === cleanPhone)
    );
    if (exists) throw new Error('An account with this email or phone already exists.');

    const newUser = normalizeUser({
      ...userData,
      id: generateId('USR'),
      createdAt: new Date().toISOString(),
    });

    const { password: _pw, ...safeUser } = newUser;
    storage.set('users', [...users, newUser]);
    storage.set('currentUser', safeUser);
    return { user: safeUser };
  },

  getCurrentUser: () => {
    const user = storage.get('currentUser', null);
    return user ? normalizeUser(user) : null;
  },

  updateCapabilities: async (userId, { canRentEquipment, canListEquipment, preferredDashboard }) => {
    const users = storage.get('users', []);
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error('User not found.');

    const targetUser = users[userIndex];
    const existingCaps = targetUser.capabilities || {};
    const updatedCapabilities = {
      canRentEquipment: canRentEquipment !== undefined ? Boolean(canRentEquipment) : Boolean(existingCaps.canRentEquipment),
      canListEquipment: canListEquipment !== undefined ? Boolean(canListEquipment) : Boolean(existingCaps.canListEquipment),
    };

    const updatedUser = normalizeUser({
      ...targetUser,
      capabilities: updatedCapabilities,
      ...(preferredDashboard ? { preferredDashboard } : {}),
    });

    users[userIndex] = updatedUser;
    storage.set('users', users);

    const { password: _pw, ...safeUser } = updatedUser;
    storage.set('currentUser', safeUser);
    return { user: safeUser };
  },

  updateProfile: async (userId, updates) => {
    const users = storage.get('users', []);
    const updatedUsers = users.map((u) =>
      u.id === userId ? normalizeUser({ ...u, ...updates }) : u
    );
    storage.set('users', updatedUsers);
    const updatedUser = updatedUsers.find((u) => u.id === userId);
    const { password: _pw, ...safeUser } = updatedUser;
    storage.set('currentUser', safeUser);
    return { user: safeUser };
  },
};

// ─── EQUIPMENT ────────────────────────────────────────────────────────
export const equipmentApi = {
  getAll: async () => {
    const equipment = storage.get('equipment', []);
    return { data: equipment };
  },

  getById: async (id) => {
    const equipment = storage.get('equipment', []);
    const item = equipment.find((e) => e.id === id);
    if (!item) throw new Error('Equipment not found.');
    return { data: item };
  },

  getByOwner: async (ownerId) => {
    const equipment = storage.get('equipment', []);
    return { data: equipment.filter((e) => e.ownerId === ownerId) };
  },

  create: async (equipmentData, ownerId, ownerName) => {
    const equipment = storage.get('equipment', []);
    const newItem = {
      ...equipmentData,
      id: generateId('EQ'),
      ownerId,
      ownerName,
      createdAt: new Date().toISOString(),
      isActive: true,
      reviewCount: 0,
      rating: null,
    };
    storage.set('equipment', [...equipment, newItem]);
    return { data: newItem };
  },

  update: async (id, updates) => {
    const equipment = storage.get('equipment', []);
    const updatedEquipment = equipment.map((e) =>
      e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
    );
    storage.set('equipment', updatedEquipment);
    const updated = updatedEquipment.find((e) => e.id === id);
    return { data: updated };
  },

  toggleActive: async (id) => {
    const equipment = storage.get('equipment', []);
    const updatedEquipment = equipment.map((e) =>
      e.id === id ? { ...e, isActive: !e.isActive } : e
    );
    storage.set('equipment', updatedEquipment);
    return { data: updatedEquipment.find((e) => e.id === id) };
  },

  delete: async (id) => {
    const equipment = storage.get('equipment', []);
    const filtered = equipment.filter((e) => e.id !== id);
    storage.set('equipment', filtered);
    return { success: true };
  },
};

// ─── BOOKINGS ─────────────────────────────────────────────────────────
export const bookingApi = {
  getAll: async () => {
    const bookings = storage.get('bookings', []);
    return { data: bookings };
  },

  getByFarmer: async (farmerId) => {
    const bookings = storage.get('bookings', []);
    return { data: bookings.filter((b) => b.farmerId === farmerId) };
  },

  getByOwner: async (ownerId) => {
    const bookings = storage.get('bookings', []);
    return { data: bookings.filter((b) => b.ownerId === ownerId) };
  },

  getById: async (id) => {
    const bookings = storage.get('bookings', []);
    const booking = bookings.find((b) => b.id === id);
    if (!booking) throw new Error('Booking not found.');
    return { data: booking };
  },

  create: async (bookingData) => {
    const bookings = storage.get('bookings', []);
    const newBooking = {
      ...bookingData,
      id: generateId('BKG'),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storage.set('bookings', [...bookings, newBooking]);
    return { data: newBooking };
  },

  updateStatus: async (id, status) => {
    const bookings = storage.get('bookings', []);
    const updatedBookings = bookings.map((b) =>
      b.id === id
        ? { ...b, status, updatedAt: new Date().toISOString() }
        : b
    );
    storage.set('bookings', updatedBookings);
    return { data: updatedBookings.find((b) => b.id === id) };
  },

  update: async (id, updates) => {
    const bookings = storage.get('bookings', []);
    const updatedBookings = bookings.map((b) =>
      b.id === id
        ? { ...b, ...updates, updatedAt: new Date().toISOString() }
        : b
    );
    storage.set('bookings', updatedBookings);
    return { data: updatedBookings.find((b) => b.id === id) };
  },
};

// ─── FARMS ────────────────────────────────────────────────────────────
export const farmApi = {
  getByUser: async (userId) => {
    const farms = storage.get('farms', []);
    return { data: farms.filter((f) => f.ownerId === userId) };
  },

  create: async (farmData, userId) => {
    const farms = storage.get('farms', []);
    const newFarm = {
      ...farmData,
      id: generateId('FRM'),
      ownerId: userId,
      createdAt: new Date().toISOString(),
    };
    storage.set('farms', [...farms, newFarm]);
    return { data: newFarm };
  },

  update: async (id, updates) => {
    const farms = storage.get('farms', []);
    const updatedFarms = farms.map((f) =>
      f.id === id ? { ...f, ...updates } : f
    );
    storage.set('farms', updatedFarms);
    return { data: updatedFarms.find((f) => f.id === id) };
  },
};

// ─── ACTIVITIES ───────────────────────────────────────────────────────
export const activityApi = {
  getByUser: async (userId) => {
    const activities = storage.get('activities', []);
    return { data: activities.filter((a) => a.userId === userId) };
  },

  getByFarm: async (farmId) => {
    const activities = storage.get('activities', []);
    return { data: activities.filter((a) => a.farmId === farmId) };
  },

  create: async (activityData, userId) => {
    const activities = storage.get('activities', []);
    const newActivity = {
      ...activityData,
      id: generateId('ACT'),
      userId,
      createdAt: new Date().toISOString(),
    };
    storage.set('activities', [...activities, newActivity]);
    return { data: newActivity };
  },
};

// ─── EXPENSES ─────────────────────────────────────────────────────────
export const expenseApi = {
  getByUser: async (userId) => {
    const expenses = storage.get('expenses', []);
    return { data: expenses.filter((e) => e.userId === userId) };
  },

  getByFarm: async (farmId) => {
    const expenses = storage.get('expenses', []);
    return { data: expenses.filter((e) => e.farmId === farmId) };
  },

  create: async (expenseData, userId) => {
    const expenses = storage.get('expenses', []);
    const newExpense = {
      ...expenseData,
      id: generateId('EXP'),
      userId,
      createdAt: new Date().toISOString(),
    };
    storage.set('expenses', [...expenses, newExpense]);
    return { data: newExpense };
  },

  delete: async (id) => {
    const expenses = storage.get('expenses', []);
    const filtered = expenses.filter((e) => e.id !== id);
    storage.set('expenses', filtered);
    return { success: true };
  },
};

// ─── ASSISTED REQUESTS ────────────────────────────────────────────────
export const assistedApi = {
  getAll: async () => {
    const requests = storage.get('assistedRequests', []);
    return { data: requests };
  },

  create: async (requestData) => {
    const requests = storage.get('assistedRequests', []);
    const newRequest = {
      ...requestData,
      id: generateId('AST'),
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };
    storage.set('assistedRequests', [...requests, newRequest]);
    return { data: newRequest };
  },
};

export default api;
