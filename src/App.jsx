import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { ProtectedRoute, CapabilityGuard } from './components/layout/ProtectedRoute';
import ScrollToTop from './components/layout/ScrollToTop';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import EquipmentListPage from './pages/equipment/EquipmentListPage';
import EquipmentDetailPage from './pages/equipment/EquipmentDetailPage';
import AssistedBookingPage from './pages/public/AssistedBookingPage';
import TermsPage from './pages/public/TermsPage';
import PrivacyPage from './pages/public/PrivacyPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerBookingsPage from './pages/farmer/FarmerBookingsPage';
import FarmManagementPage from './pages/farmer/FarmManagementPage';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerEquipmentPage from './pages/owner/OwnerEquipmentPage';
import OwnerRequestsPage from './pages/owner/OwnerRequestsPage';

// Shared Pages
import ProfilePage from './pages/shared/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
          <ScrollToTop />
          <Routes>
            {/* Public Routes with Navbar and Footer */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <LandingPage />
                </PublicLayout>
              }
            />
            <Route
              path="/equipment"
              element={
                <PublicLayout>
                  <EquipmentListPage />
                </PublicLayout>
              }
            />
            <Route
              path="/equipment/:id"
              element={
                <PublicLayout>
                  <EquipmentDetailPage />
                </PublicLayout>
              }
            />
            <Route
              path="/assisted-booking"
              element={
                <PublicLayout>
                  <AssistedBookingPage />
                </PublicLayout>
              }
            />
            <Route
              path="/terms"
              element={
                <PublicLayout>
                  <TermsPage />
                </PublicLayout>
              }
            />
            <Route
              path="/privacy"
              element={
                <PublicLayout>
                  <PrivacyPage />
                </PublicLayout>
              }
            />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Farmer Protected Routes */}
            <Route
              path="/farmer/dashboard"
              element={
                <ProtectedRoute>
                  <CapabilityGuard requireCapability="canRentEquipment">
                    <DashboardLayout>
                      <FarmerDashboard />
                    </DashboardLayout>
                  </CapabilityGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/bookings"
              element={
                <ProtectedRoute>
                  <CapabilityGuard requireCapability="canRentEquipment">
                    <DashboardLayout>
                      <FarmerBookingsPage />
                    </DashboardLayout>
                  </CapabilityGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/farm"
              element={
                <ProtectedRoute>
                  <CapabilityGuard requireCapability="canRentEquipment">
                    <DashboardLayout>
                      <FarmManagementPage />
                    </DashboardLayout>
                  </CapabilityGuard>
                </ProtectedRoute>
              }
            />

            {/* Equipment Owner Protected Routes */}
            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute>
                  <CapabilityGuard requireCapability="canListEquipment">
                    <DashboardLayout>
                      <OwnerDashboard />
                    </DashboardLayout>
                  </CapabilityGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/equipment"
              element={
                <ProtectedRoute>
                  <CapabilityGuard requireCapability="canListEquipment">
                    <DashboardLayout>
                      <OwnerEquipmentPage />
                    </DashboardLayout>
                  </CapabilityGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/equipment/new"
              element={
                <ProtectedRoute>
                  <CapabilityGuard requireCapability="canListEquipment">
                    <DashboardLayout>
                      <OwnerEquipmentPage />
                    </DashboardLayout>
                  </CapabilityGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/requests"
              element={
                <ProtectedRoute>
                  <CapabilityGuard requireCapability="canListEquipment">
                    <DashboardLayout>
                      <OwnerRequestsPage />
                    </DashboardLayout>
                  </CapabilityGuard>
                </ProtectedRoute>
              }
            />

            {/* Shared Authenticated Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProfilePage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
  );
}

export default App;
