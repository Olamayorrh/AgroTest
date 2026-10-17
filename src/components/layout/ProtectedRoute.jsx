import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * Protect routes that require authentication.
 * Redirects to /login with the current path saved in state.
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullPage message="Loading..." />;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

/**
 * Protect routes based on user capabilities rather than exclusive single roles.
 * A dual-capability user has access to both farmer and owner routes.
 */
export const CapabilityGuard = ({
  children,
  requireCapability, // 'canRentEquipment' | 'canListEquipment'
  allowedRole, // backward-compatibility alias: 'farmer' | 'owner'
}) => {
  const { user, loading, canRent, canList } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullPage />;

  const capability =
    requireCapability ||
    (allowedRole === 'farmer' ? 'canRentEquipment' : 'canListEquipment');

  const hasAccess =
    capability === 'canRentEquipment' ? canRent : canList;

  if (!hasAccess) {
    // If the user has the other capability, redirect them to that dashboard
    if (capability === 'canRentEquipment' && canList) {
      return <Navigate to="/owner/dashboard" replace />;
    }
    if (capability === 'canListEquipment' && canRent) {
      return <Navigate to="/farmer/dashboard" replace />;
    }
    // Otherwise redirect to profile to enable capability
    return <Navigate to="/profile" state={{ from: location, promptCapability: capability }} replace />;
  }

  return children;
};

// Backward-compatibility alias
export const RoleGuard = CapabilityGuard;

export default ProtectedRoute;
