import React from 'react';
import { Link } from 'react-router-dom';
import {
  Tractor,
  Calendar,
  Clock,
  CheckCircle,
  TrendingUp,
  PlusCircle,
  HelpCircle,
  MapPin,
  ArrowRight,
  Sprout,
  DollarSign,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/shared/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatters';

const FarmerDashboard = () => {
  const { user, canList, hasBothCapabilities, enableCapability } = useAuth();
  const { bookings, activities, expenses, farms } = useApp();

  // Metrics
  const myBookings = bookings.filter((b) => b.farmerId === user?.id);
  const pendingCount = myBookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = myBookings.filter(
    (b) => b.status === 'approved' || b.status === 'in_progress'
  ).length;

  const userFarm = farms.find((f) => f.ownerId === user?.id) || farms[0];
  const myActivities = activities.filter((a) => a.userId === user?.id || (user?.id === 'user-farmer-demo' && a.userId === 'user-farmer-demo'));
  const displayActivities = myActivities.length > 0 ? myActivities : activities;
  const myExpenses = expenses.filter((e) => e.userId === user?.id || (user?.id === 'user-farmer-demo' && e.userId === 'user-farmer-demo'));
  const totalExpenses = (myExpenses.length > 0 ? myExpenses : expenses).reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );

  const farmerCurrencySymbol =
    userFarm?.currencySymbol ||
    myBookings[0]?.currencySymbol ||
    (user?.country === 'GH' ? '₵' : user?.country === 'KE' ? 'KSh' : '₦');

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-700 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-100 text-xs font-medium mb-3 backdrop-blur-sm">
              <MapPin size={13} />
              <span>
                {user?.town ? `${user.town}, ` : ''}
                {user?.lga || 'Ibadan North'}, {user?.state || 'Oyo'}, {user?.country || 'Nigeria'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Farmer'}! 🌾
            </h1>
            <p className="text-primary-100 text-sm mt-1 max-w-xl">
              Track your machinery rentals, log field activities, and record seasonal farm expenses all in one place.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2.5">
            <Link to="/equipment">
              <Button variant="secondary" size="md" leftIcon={<Tractor size={16} />}>
                Find Machinery
              </Button>
            </Link>
            <Link to="/assisted-booking">
              <Button
                variant="outline"
                size="md"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                leftIcon={<HelpCircle size={16} />}
              >
                Booking Assistance
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Capability Enablement Callout if user cannot list equipment */}
      {!canList && (
        <div className="p-4 sm:p-5 rounded-3xl bg-primary-50 border border-primary-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-800 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Tractor size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-primary-950">
                Have idle tractors or farm machinery?
              </h3>
              <p className="text-xs text-primary-800/90 mt-0.5 leading-relaxed max-w-xl">
                Enable Equipment Owner features to list machinery and earn rental income — no new sign-up needed!
              </p>
            </div>
          </div>
          <button
            onClick={() => enableCapability('canListEquipment')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-700 hover:bg-primary-800 active:scale-95 text-white text-xs font-semibold transition-all duration-150 shadow-sm self-start sm:self-center whitespace-nowrap flex-shrink-0"
          >
            <Sparkles size={14} />
            <span>Enable Owner View</span>
          </button>
        </div>
      )}

      {/* Dual Workspace Indicator */}
      {hasBothCapabilities && (
        <div className="px-4 py-2.5 rounded-2xl bg-neutral-100 border border-neutral-200/90 flex items-center justify-between text-xs text-neutral-700">
          <span className="flex items-center gap-1.5 font-medium">
            <span>Active Workspace: <strong>Farmer Dashboard</strong></span>
          </span>
          <Link
            to="/owner/dashboard"
            className="font-bold text-primary-700 hover:text-primary-800 flex items-center gap-1 transition-colors"
          >
            <span>Switch to Owner View 🚜</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          label="Total Bookings"
          value={myBookings.length}
          icon={Calendar}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Pending Requests"
          value={pendingCount}
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          label="Confirmed Rentals"
          value={confirmedCount}
          icon={CheckCircle}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          label="Recorded Expenses"
          value={`${farmerCurrencySymbol}${totalExpenses.toLocaleString()}`}
          icon={DollarSign}
          iconBg="bg-primary-50"
          iconColor="text-primary-700"
        />
      </div>

      {/* Split Columns: Recent Bookings & Farm Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Bookings */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-base font-bold text-neutral-900">Recent Rental Requests</h2>
              <p className="text-xs text-neutral-400">Track equipment availability and owner feedback</p>
            </div>
            <Link to="/farmer/bookings">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>
                View All
              </Button>
            </Link>
          </div>

          {myBookings.length > 0 ? (
            <div className="space-y-3">
              {myBookings.slice(0, 4).map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-100/70 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-neutral-900 truncate">
                        {b.equipmentName}
                      </span>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="text-xs text-neutral-500">
                      Host: <strong>{b.ownerName}</strong> • Date: {formatDate(b.requestedDate)} ({b.duration} {b.durationUnit})
                    </p>
                    <p className="text-xs text-neutral-400">
                      Estimated Cost: <strong className="text-primary-700">{b.currencySymbol || farmerCurrencySymbol}{Number(b.estimatedCost).toLocaleString()}</strong>
                    </p>
                  </div>

                  <Link to={`/equipment/${b.equipmentId}`} className="self-end sm:self-center">
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No rental requests yet"
              description="Browse tractors and machinery near your farm and submit your first booking."
              action={() => {}}
              actionLabel="Search Equipment"
            />
          )}
        </div>

        {/* Right Column: Farm Profile & Recent Activities */}
        <div className="lg:col-span-5 space-y-6">
          {/* Farm Profile Summary */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                  <Sprout size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    {userFarm?.name || 'My Farm Plot'}
                  </h3>
                  <p className="text-xs text-neutral-400">Primary Farm Profile</p>
                </div>
              </div>
              <Link to="/farmer/farm">
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded-2xl">
                <span className="text-neutral-400 block">Acreage</span>
                <span className="font-bold text-neutral-800 text-sm mt-0.5 block">
                  {userFarm?.size || '8'} {userFarm?.sizeUnit || 'acres'}
                </span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-2xl">
                <span className="text-neutral-400 block">Crops</span>
                <span className="font-bold text-neutral-800 text-sm mt-0.5 block truncate">
                  {userFarm?.mainCrop || 'Maize, Cassava'}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activities List */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900">Recent Field Activities</h3>
              <Link to="/farmer/farm">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>
                  Log Activity
                </Button>
              </Link>
            </div>

            {displayActivities.length > 0 ? (
              <div className="space-y-2.5">
                {displayActivities.slice(0, 3).map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-neutral-800">{act.type}</p>
                      <p className="text-neutral-400 text-[11px]">
                        {act.description} • {formatDate(act.date)}
                      </p>
                    </div>
                    {act.cost > 0 && (
                      <span className="font-bold text-neutral-700 bg-white px-2 py-1 rounded-lg border border-neutral-200">
                        {act.currencySymbol || farmerCurrencySymbol}{Number(act.cost).toLocaleString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400 text-center py-4">No activities logged yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
