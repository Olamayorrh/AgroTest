import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Leaf,
  LayoutDashboard,
  Tractor,
  BookOpen,
  Sprout,
  User,
  LogOut,
  X,
  PlusCircle,
  ClipboardList,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/formatters';
import DashboardSwitcher from './DashboardSwitcher';

const FARMER_NAV = [
  { label: 'Farmer Dashboard', href: '/farmer/dashboard', icon: LayoutDashboard },
  { label: 'Browse Equipment', href: '/equipment', icon: Tractor },
  { label: 'My Rentals', href: '/farmer/bookings', icon: BookOpen },
  { label: 'Farm Management', href: '/farmer/farm', icon: Sprout },
  { label: 'Request Assistance', href: '/assisted-booking', icon: ClipboardList },
  { label: 'Profile & Settings', href: '/profile', icon: User },
];

const OWNER_NAV = [
  { label: 'Owner Dashboard', href: '/owner/dashboard', icon: LayoutDashboard },
  { label: 'My Machinery', href: '/owner/equipment', icon: Tractor },
  { label: 'Rental Requests', href: '/owner/requests', icon: ClipboardList },
  { label: 'Add Equipment', href: '/owner/equipment/new', icon: PlusCircle },
  { label: 'Profile & Settings', href: '/profile', icon: User },
];

const Sidebar = ({ onClose }) => {
  const { user, logout, canRent, canList, hasBothCapabilities } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Active view: if currently on an owner route, show owner nav; otherwise farmer nav
  const isOwnerView = location.pathname.startsWith('/owner');
  const navItems = isOwnerView ? OWNER_NAV : FARMER_NAV;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const roleDisplay = hasBothCapabilities
    ? 'Farmer & Machine Owner'
    : canList
    ? 'Equipment Owner'
    : 'Farmer';

  return (
    <aside className="flex flex-col h-full bg-white border-r border-neutral-100 w-64 shadow-xs">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary-700 flex items-center justify-center shadow-xs">
            <Leaf size={18} className="text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-primary-700">Agro</span>
            <span className="text-lg font-bold text-secondary-500">Share</span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* User info */}
      {user && (
        <div className="px-4 py-3.5 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs flex-shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-neutral-900 truncate">{user.name}</p>
              <span className="inline-block px-1.5 py-0.5 rounded-md bg-primary-100/70 text-primary-800 text-[10px] font-semibold mt-0.5 truncate max-w-full">
                {roleDisplay}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard View Switcher */}
      <div className="px-3 pt-3 pb-1">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 px-1">
          Active Workspace
        </p>
        <DashboardSwitcher />
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto" aria-label="Sidebar navigation">
        <ul className="flex flex-col gap-1" role="list">
          {navItems.map(({ label, href, icon: Icon }) => (
            <li key={href}>
              <NavLink
                to={href}
                end={href === '/farmer/dashboard' || href === '/owner/dashboard'}
                onClick={onClose}
                className={({ isActive }) =>
                  isActive ? 'nav-item-active' : 'nav-item-inactive'
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-neutral-100">
        <button
          onClick={handleLogout}
          className="nav-item-inactive w-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
