import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, initializeDemoData } from '../services/api';
import { normalizeUser } from '../utils/userModel';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize demo data and restore session on mount
  useEffect(() => {
    initializeDemoData();
    const currentUser = authApi.getCurrentUser();
    if (currentUser) setUser(normalizeUser(currentUser));
    setLoading(false);
  }, []);

  const login = useCallback(async (arg1, arg2) => {
    setError(null);
    try {
      const { user: loggedInUser } = await authApi.login(arg1, arg2);
      const normalized = normalizeUser(loggedInUser);
      setUser(normalized);
      return normalized;
    } catch (err) {
      const msg = err.message || 'Login failed. Please try again.';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const signup = useCallback(async (userData) => {
    setError(null);
    try {
      const { user: newUser } = await authApi.signup(userData);
      const normalized = normalizeUser(newUser);
      setUser(normalized);
      return normalized;
    } catch (err) {
      const msg = err.message || 'Sign up failed. Please try again.';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user) return;
    try {
      const { user: updatedUser } = await authApi.updateProfile(user.id, updates);
      const normalized = normalizeUser(updatedUser);
      setUser(normalized);
      return normalized;
    } catch (err) {
      throw new Error(err.message || 'Profile update failed.');
    }
  }, [user]);

  /**
   * Enables a capability for the current logged-in user without re-registration.
   * @param {'canRentEquipment' | 'canListEquipment' | 'both'} capability
   */
  const enableCapability = useCallback(async (capability) => {
    if (!user) return;
    try {
      let capUpdates = {};
      if (capability === 'canRentEquipment') {
        capUpdates = { canRentEquipment: true };
      } else if (capability === 'canListEquipment') {
        capUpdates = { canListEquipment: true };
      } else if (capability === 'both') {
        capUpdates = { canRentEquipment: true, canListEquipment: true };
      }

      const { user: updatedUser } = await authApi.updateCapabilities(user.id, capUpdates);
      const normalized = normalizeUser(updatedUser);
      setUser(normalized);
      return normalized;
    } catch (err) {
      throw new Error(err.message || 'Failed to update capabilities.');
    }
  }, [user]);

  /**
   * Sets the user's default/preferred dashboard view on login.
   * @param {'farmer' | 'owner'} preferredDashboard
   */
  const setPreferredDashboard = useCallback(async (preferredDashboard) => {
    if (!user) return;
    try {
      const { user: updatedUser } = await authApi.updateCapabilities(user.id, {
        preferredDashboard,
      });
      const normalized = normalizeUser(updatedUser);
      setUser(normalized);
      return normalized;
    } catch (err) {
      throw new Error(err.message || 'Failed to update preferred dashboard.');
    }
  }, [user]);

  const clearError = useCallback(() => setError(null), []);

  // Capability booleans
  const canRent = Boolean(user?.capabilities?.canRentEquipment);
  const canList = Boolean(user?.capabilities?.canListEquipment);
  const hasBothCapabilities = canRent && canList;
  const preferredDashboard = user?.preferredDashboard || (canRent ? 'farmer' : 'owner');

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    // Capabilities
    canRent,
    canList,
    hasBothCapabilities,
    // Legacy / Convenience flags (true if capability is enabled)
    isFarmer: canRent,
    isOwner: canList,
    preferredDashboard,
    // Actions
    login,
    signup,
    logout,
    updateProfile,
    updateUser: updateProfile, // alias
    enableCapability,
    setPreferredDashboard,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
