import React from 'react';
import { Link } from 'react-router-dom';
import {
  Tractor,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  PlusCircle,
  MapPin,
  ArrowRight,
  UserCheck,
  Check,
  X,
  Sparkles,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/shared/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/formatters';

const OwnerDashboard = () => {
  const { user, canRent, hasBothCapabilities, enableCapability } = useAuth();
  const { equipment, bookings, updateBookingStatus, updateEquipment } = useApp();

  // Filter owner's equipment and bookings
  const myEquipment = equipment.filter(
    (eq) => eq.ownerId === user?.id || (user?.id === 'user-owner-demo' && eq.ownerId === 'user-owner-demo')
  );
  const myRequests = bookings.filter(
    (b) => b.ownerId === user?.id || (user?.id === 'user-owner-demo' && b.ownerId === 'user-owner-demo')
  );

  const pendingRequests = myRequests.filter((b) => b.status === 'pending');
  const approvedRequests = myRequests.filter((b) => b.status === 'approved' || b.status === 'in_progress');

  // Calculate earnings from approved/completed bookings
  const demoEarnings = myRequests
    .filter((b) => b.status === 'approved' || b.status === 'completed' || b.status === 'in_progress')
    .reduce((sum, b) => sum + (Number(b.estimatedCost) || 0), 0);

  const primaryCurrencySymbol = myEquipment[0]?.currencySymbol || myRequests[0]?.currencySymbol || '₦';

  const handleApprove = async (id) => {
    await updateBookingStatus(id, 'approved');
  };

  const handleReject = async (id) => {
    await updateBookingStatus(id, 'rejected');
  };

  const handleToggleAvailability = async (item) => {
    const nextStatus = item.availability === 'available' ? 'unavailable' : 'available';
    await updateEquipment(item.id, { availability: nextStatus });
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-primary-950 to-primary-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-200 text-xs font-medium mb-3 backdrop-blur-sm">
              <MapPin size={13} />
              <span>
                {user?.town ? `${user.town}, ` : ''}
                {user?.lga || 'Alimosho'}, {user?.state || 'Lagos'}, {user?.country || 'Nigeria'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Host Dashboard: {user?.name || 'Owner'} 🚜
            </h1>
            <p className="text-neutral-300 text-sm mt-1 max-w-xl">
              Manage your agricultural machinery listings, approve farmer rental requests, and track your hire revenue.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-2.5">
            <Link to="/owner/equipment/new">
              <Button variant="secondary" size="md" leftIcon={<PlusCircle size={16} />}>
                List Machinery
              </Button>
            </Link>
            <Link to="/owner/requests">
              <Button
                variant="outline"
                size="md"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                leftIcon={<Calendar size={16} />}
              >
                All Requests ({myRequests.length})
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Capability Enablement Callout if user cannot rent equipment */}
      {!canRent && (
        <div className="p-4 sm:p-5 rounded-3xl bg-secondary-50 border border-secondary-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary-100 text-secondary-800 flex items-center justify-center flex-shrink-0 mt-0.5">
              <User size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-secondary-950">
                Farming your own land as well?
              </h3>
              <p className="text-xs text-secondary-800/90 mt-0.5 leading-relaxed max-w-xl">
                Enable Farmer features to find &amp; rent machinery, submit rental requests, and track field operations — all on the same account.
              </p>
            </div>
          </div>
          <button
            onClick={() => enableCapability('canRentEquipment')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary-600 hover:bg-secondary-700 active:scale-95 text-white text-xs font-semibold transition-all duration-150 shadow-sm self-start sm:self-center whitespace-nowrap flex-shrink-0"
          >
            <Sparkles size={14} />
            <span>Enable Farmer View</span>
          </button>
        </div>
      )}

      {/* Dual Workspace Indicator */}
      {hasBothCapabilities && (
        <div className="px-4 py-2.5 rounded-2xl bg-neutral-100 border border-neutral-200/90 flex items-center justify-between text-xs text-neutral-700">
          <span className="flex items-center gap-1.5 font-medium">
            <span>Active Workspace: <strong>Owner Dashboard</strong></span>
          </span>
          <Link
            to="/farmer/dashboard"
            className="font-bold text-primary-700 hover:text-primary-800 flex items-center gap-1 transition-colors"
          >
            <span>Switch to Farmer View 🌾</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          label="Listed Machines"
          value={myEquipment.length}
          icon={Tractor}
          iconBg="bg-primary-50"
          iconColor="text-primary-700"
        />
        <StatCard
          label="Pending Inquiries"
          value={pendingRequests.length}
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          label="Active / Confirmed"
          value={approvedRequests.length}
          icon={CheckCircle}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          label="Rental Volume (Demo)"
          value={`${primaryCurrencySymbol}${demoEarnings.toLocaleString()}`}
          icon={DollarSign}
          iconBg="bg-accent-50"
          iconColor="text-accent-700"
        />
      </div>

      {/* Grid: Pending Action Requests + Listed Equipment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Pending Rental Requests needing Owner Decision */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-base font-bold text-neutral-900">Rental Inquiries</h2>
              <p className="text-xs text-neutral-400">Farmers awaiting your approval</p>
            </div>
            <Link to="/owner/requests">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>
                View All
              </Button>
            </Link>
          </div>

          {pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-neutral-900">{b.farmerName}</span>
                        <StatusBadge status={b.status} />
                      </div>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        Requested: <strong>{b.equipmentName}</strong>
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary-800">
                      ₦{Number(b.estimatedCost).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600 bg-white/80 p-2.5 rounded-xl border border-amber-100">
                    <p>
                      <strong>Date:</strong> {formatDate(b.requestedDate)} ({b.duration} {b.durationUnit})
                    </p>
                    <p>
                      <strong>Location:</strong> {b.location}
                    </p>
                    {b.purpose && (
                      <p className="col-span-2 text-neutral-500 italic">
                        "{b.purpose}"
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 justify-end pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
                      onClick={() => handleReject(b.id)}
                      leftIcon={<X size={14} />}
                    >
                      Decline
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleApprove(b.id)}
                      leftIcon={<Check size={14} />}
                    >
                      Accept & Confirm
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-neutral-400 text-xs">
              No pending rental requests at the moment.
            </div>
          )}
        </div>

        {/* Right: Quick Equipment Status */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h2 className="text-base font-bold text-neutral-900">My Machinery ({myEquipment.length})</h2>
            <Link to="/owner/equipment">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>
                Manage
              </Button>
            </Link>
          </div>

          {myEquipment.length > 0 ? (
            <div className="space-y-3">
              {myEquipment.map((eq) => (
                <div
                  key={eq.id}
                  className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-neutral-800 truncate">{eq.name}</p>
                    <p className="text-neutral-400 text-[11px] mt-0.5">
                      {eq.currencySymbol || '₦'}{eq.pricePerDay?.toLocaleString() || eq.pricePerHour?.toLocaleString()} / {eq.billingUnit || 'day'} • {eq.type}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleAvailability(eq)}
                    className={`px-3 py-1 rounded-xl font-bold transition-all ${
                      eq.availability === 'available'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                    }`}
                  >
                    {eq.availability === 'available' ? 'Available' : 'Paused'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Tractor}
              title="No machinery listed"
              description="List your first tractor, tiller, or harvester to start earning."
              action={() => {}}
              actionLabel="Add Machine"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
