import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { User, Tractor, ArrowRightLeft, Sparkles, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

/**
 * Responsive Dashboard Switcher component.
 * Allows dual-capability users to toggle between Farmer View and Equipment Owner View.
 * For single-capability users, displays a prompt to enable the other capability.
 */
const DashboardSwitcher = ({ className = '', compact = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, canRent, canList, hasBothCapabilities, enableCapability, setPreferredDashboard } = useAuth();
  const [enabling, setEnabling] = useState(false);

  if (!user) return null;

  const isOwnerRoute = location.pathname.startsWith('/owner');
  const isFarmerRoute = location.pathname.startsWith('/farmer');

  const handleSwitchTo = async (target) => {
    if (target === 'owner') {
      await setPreferredDashboard('owner');
      navigate('/owner/dashboard');
    } else {
      await setPreferredDashboard('farmer');
      navigate('/farmer/dashboard');
    }
  };

  const handleQuickEnable = async (capability) => {
    setEnabling(true);
    try {
      await enableCapability(capability);
      if (capability === 'canListEquipment') {
        navigate('/owner/dashboard');
      } else {
        navigate('/farmer/dashboard');
      }
    } finally {
      setEnabling(false);
    }
  };

  // Case 1: Dual-capability user -> Show interactive switcher
  if (hasBothCapabilities) {
    return (
      <div className={`flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl border border-neutral-200/80 ${className}`}>
        <button
          type="button"
          onClick={() => handleSwitchTo('farmer')}
          className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            isFarmerRoute
              ? 'bg-white text-primary-800 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
          }`}
          aria-pressed={isFarmerRoute}
        >
          <User size={13} className={isFarmerRoute ? 'text-primary-600' : 'text-neutral-400'} />
          <span>Farmer View</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTo('owner')}
          className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            isOwnerRoute
              ? 'bg-white text-primary-800 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
          }`}
          aria-pressed={isOwnerRoute}
        >
          <Tractor size={13} className={isOwnerRoute ? 'text-primary-600' : 'text-neutral-400'} />
          <span>Owner View</span>
        </button>
      </div>
    );
  }

  // Case 2: Farmer only -> Provide 1-click option to enable owner features
  if (canRent && !canList) {
    if (compact) {
      return (
        <button
          type="button"
          onClick={() => handleQuickEnable('canListEquipment')}
          disabled={enabling}
          className="text-[11px] font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 px-2.5 py-1 rounded-xl border border-primary-200 transition-colors flex items-center gap-1"
          title="Enable Equipment Owner features on your account"
        >
          <Sparkles size={12} className="text-primary-600" />
          <span>+ Enable Owner View</span>
        </button>
      );
    }

    return (
      <div className={`p-3 rounded-2xl bg-primary-50/80 border border-primary-200 text-xs text-primary-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${className}`}>
        <div className="flex items-center gap-2">
          <Tractor size={16} className="text-primary-700 flex-shrink-0" />
          <span>
            Own agricultural machinery? <strong>Enable owner features</strong> to list equipment and earn rental income.
          </span>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleQuickEnable('canListEquipment')}
          loading={enabling}
          className="whitespace-nowrap text-xs self-start sm:self-auto"
        >
          Enable Listing View
        </Button>
      </div>
    );
  }

  // Case 3: Owner only -> Provide 1-click option to enable farmer features
  if (canList && !canRent) {
    if (compact) {
      return (
        <button
          type="button"
          onClick={() => handleQuickEnable('canRentEquipment')}
          disabled={enabling}
          className="text-[11px] font-semibold text-secondary-700 bg-secondary-50 hover:bg-secondary-100 px-2.5 py-1 rounded-xl border border-secondary-200 transition-colors flex items-center gap-1"
          title="Enable Farmer rental features on your account"
        >
          <Sparkles size={12} className="text-secondary-600" />
          <span>+ Enable Farmer View</span>
        </button>
      );
    }

    return (
      <div className={`p-3 rounded-2xl bg-secondary-50/80 border border-secondary-200 text-xs text-secondary-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${className}`}>
        <div className="flex items-center gap-2">
          <User size={16} className="text-secondary-700 flex-shrink-0" />
          <span>
            Farming your own land? <strong>Enable farmer features</strong> to rent machinery and track farm operations.
          </span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleQuickEnable('canRentEquipment')}
          loading={enabling}
          className="whitespace-nowrap text-xs self-start sm:self-auto"
        >
          Enable Farmer View
        </Button>
      </div>
    );
  }

  return null;
};

export default DashboardSwitcher;
