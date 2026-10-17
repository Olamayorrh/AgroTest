import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  equipmentApi,
  bookingApi,
  farmApi,
  activityApi,
  expenseApi,
  assistedApi,
} from '../services/api';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { user } = useAuth();

  const [equipment, setEquipment] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [farms, setFarms] = useState([]);
  const [activities, setActivities] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [assistedRequests, setAssistedRequests] = useState([]);
  const [loadingState, setLoadingState] = useState({
    equipment: false,
    bookings: false,
    farms: false,
  });

  // ─── Equipment ─────────────────────────────────────────────────────
  const fetchEquipment = useCallback(async () => {
    setLoadingState((s) => ({ ...s, equipment: true }));
    try {
      const { data } = await equipmentApi.getAll();
      setEquipment(data);
    } finally {
      setLoadingState((s) => ({ ...s, equipment: false }));
    }
  }, []);

  const addEquipment = useCallback(
    async (equipmentData) => {
      const { data } = await equipmentApi.create(
        equipmentData,
        user?.id || 'user-owner-demo',
        user?.name || 'Equipment Owner'
      );
      setEquipment((prev) => [...prev, data]);
      return data;
    },
    [user]
  );

  const updateEquipment = useCallback(async (id, updates) => {
    const { data } = await equipmentApi.update(id, updates);
    setEquipment((prev) => prev.map((e) => (e.id === id ? data : e)));
    return data;
  }, []);

  const deleteEquipment = useCallback(async (id) => {
    await equipmentApi.delete(id);
    setEquipment((prev) => prev.filter((e) => e.id !== id));
    return { success: true };
  }, []);

  const toggleEquipmentActive = useCallback(async (id) => {
    const { data } = await equipmentApi.toggleActive(id);
    setEquipment((prev) => prev.map((e) => (e.id === id ? data : e)));
    return data;
  }, []);

  // ─── Bookings ──────────────────────────────────────────────────────
  // Fetch all bookings so dual users can view both rental requests made and incoming host inquiries
  const fetchBookings = useCallback(async () => {
    setLoadingState((s) => ({ ...s, bookings: true }));
    try {
      const { data } = await bookingApi.getAll();
      setBookings(data);
    } finally {
      setLoadingState((s) => ({ ...s, bookings: false }));
    }
  }, []);

  const createBooking = useCallback(
    async (bookingData) => {
      const payload = {
        ...bookingData,
        farmerId: user?.id || 'user-farmer-demo',
        farmerName: user?.name || 'Farmer',
      };
      const { data } = await bookingApi.create(payload);
      setBookings((prev) => [...prev, data]);
      return data;
    },
    [user]
  );

  const updateBookingStatus = useCallback(async (id, status) => {
    const { data } = await bookingApi.updateStatus(id, status);
    setBookings((prev) => prev.map((b) => (b.id === id ? data : b)));
    return data;
  }, []);

  const updateBooking = useCallback(async (id, updates) => {
    const { data } = await bookingApi.update(id, updates);
    setBookings((prev) => prev.map((b) => (b.id === id ? data : b)));
    return data;
  }, []);

  // ─── Farms ─────────────────────────────────────────────────────────
  const fetchFarms = useCallback(async () => {
    if (!user) return;
    setLoadingState((s) => ({ ...s, farms: true }));
    try {
      const { data } = await farmApi.getByUser(user.id);
      setFarms(data);
    } finally {
      setLoadingState((s) => ({ ...s, farms: false }));
    }
  }, [user]);

  const addFarm = useCallback(
    async (farmData) => {
      const { data } = await farmApi.create(farmData, user?.id);
      setFarms((prev) => [...prev, data]);
      return data;
    },
    [user]
  );

  const updateFarm = useCallback(async (id, updates) => {
    const { data } = await farmApi.update(id, updates);
    setFarms((prev) => prev.map((f) => (f.id === id ? data : f)));
    return data;
  }, []);

  // ─── Activities ────────────────────────────────────────────────────
  const fetchActivities = useCallback(async () => {
    if (!user) return;
    const { data } = await activityApi.getByUser(user.id);
    setActivities(data);
  }, [user]);

  const addActivity = useCallback(
    async (activityData) => {
      const { data } = await activityApi.create(activityData, user?.id);
      setActivities((prev) => [...prev, data]);
      return data;
    },
    [user]
  );

  // ─── Expenses ──────────────────────────────────────────────────────
  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    const { data } = await expenseApi.getByUser(user.id);
    setExpenses(data);
  }, [user]);

  const addExpense = useCallback(
    async (expenseData) => {
      const { data } = await expenseApi.create(expenseData, user?.id);
      setExpenses((prev) => [...prev, data]);
      return data;
    },
    [user]
  );

  const deleteExpense = useCallback(async (id) => {
    await expenseApi.delete(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    return { success: true };
  }, []);

  // ─── Assisted Requests ─────────────────────────────────────────────
  const fetchAssistedRequests = useCallback(async () => {
    const { data } = await assistedApi.getAll();
    setAssistedRequests(data);
  }, []);

  const createAssistedRequest = useCallback(async (requestData) => {
    const { data } = await assistedApi.create(requestData);
    setAssistedRequests((prev) => [...prev, data]);
    return data;
  }, []);

  // ─── Load all data on mount / user change ──────────────────────────
  useEffect(() => {
    fetchEquipment();
    fetchBookings();
    if (user) {
      fetchFarms();
      fetchActivities();
      fetchExpenses();
    }
    fetchAssistedRequests();
  }, [user, fetchEquipment, fetchBookings, fetchFarms, fetchActivities, fetchExpenses, fetchAssistedRequests]);

  // ─── Computed values ───────────────────────────────────────────────
  const myEquipment = user ? equipment.filter((e) => e.ownerId === user.id) : [];
  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const value = {
    // Data
    equipment,
    myEquipment,
    bookings,
    farms,
    activities,
    expenses,
    assistedRequests,
    totalExpenses,
    loadingState,

    // Equipment actions
    fetchEquipment,
    addEquipment,
    createEquipment: addEquipment,
    updateEquipment,
    deleteEquipment,
    toggleEquipmentActive,

    // Booking actions
    fetchBookings,
    createBooking,
    updateBookingStatus,
    updateBooking,

    // Farm actions
    fetchFarms,
    addFarm,
    updateFarm,

    // Activity actions
    fetchActivities,
    addActivity,
    createActivity: addActivity,

    // Expense actions
    fetchExpenses,
    addExpense,
    createExpense: addExpense,
    deleteExpense,

    // Assisted request actions
    fetchAssistedRequests,
    createAssistedRequest,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export default AppContext;
