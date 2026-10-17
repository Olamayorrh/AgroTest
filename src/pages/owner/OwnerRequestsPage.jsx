import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  MapPin,
  Check,
  X,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/formatters';

const TABS = [
  { value: 'all', label: 'All Requests' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
];

const OwnerRequestsPage = () => {
  const { user } = useAuth();
  const { bookings, updateBookingStatus } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const myRequests = bookings.filter(
    (b) => b.ownerId === user?.id || (user?.id === 'user-owner-demo' && b.ownerId === 'user-owner-demo')
  );

  const filteredRequests = myRequests.filter((b) => {
    if (activeTab === 'all') return true;
    return b.status === activeTab;
  });

  const handleUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateBookingStatus(id, status);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Farmer Rental Requests
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Review, approve, or schedule equipment rentals requested by farmers in your area.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-neutral-200">
        {TABS.map((tab) => {
          const count =
            tab.value === 'all'
              ? myRequests.length
              : myRequests.filter((b) => b.status === tab.value).length;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.value
                  ? 'bg-primary-700 text-white shadow-sm'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.value
                    ? 'bg-primary-800 text-primary-100'
                    : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Request Cards */}
      {filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((b) => (
            <div
              key={b.id}
              className="card card-body bg-white border border-neutral-200/90 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                      {b.equipmentName}
                    </h3>
                    <StatusBadge status={b.status} />
                    <span className="text-xs text-neutral-400 font-mono">
                      Ref: {b.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-6 text-xs text-neutral-600">
                    <p className="flex items-center gap-1.5">
                      <span className="text-neutral-400">Requesting Farmer:</span>
                      <strong className="text-neutral-900">{b.farmerName}</strong>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="text-neutral-400">Scheduled Date:</span>
                      <strong className="text-neutral-900">{formatDate(b.requestedDate)}</strong>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="text-neutral-400">Duration:</span>
                      <strong className="text-neutral-900">
                        {b.duration} {b.durationUnit}
                      </strong>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="text-neutral-400">Farm Location:</span>
                      <strong className="text-neutral-900">{b.location}</strong>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="text-neutral-400">Total Due:</span>
                      <strong className="text-primary-700 font-bold">
                        {b.currencySymbol || '₦'}{Number(b.estimatedCost).toLocaleString()}
                      </strong>
                    </p>
                    {b.farmSize && (
                      <p className="flex items-center gap-1.5">
                        <span className="text-neutral-400">Plot Size:</span>
                        <span className="text-neutral-800">{b.farmSize}</span>
                      </p>
                    )}
                  </div>

                  {b.purpose && (
                    <p className="text-xs text-neutral-600 italic">
                      Operation: "{b.purpose}"
                    </p>
                  )}

                  {b.note && (
                    <div className="p-2.5 bg-neutral-50 rounded-xl text-xs text-neutral-600 border border-neutral-100">
                      <strong>Farmer instructions:</strong> {b.note}
                    </div>
                  )}
                </div>

                {/* Owner Actions */}
                <div className="flex sm:flex-col lg:flex-row items-center gap-2 self-start lg:self-center border-t sm:border-t-0 pt-3 sm:pt-0">
                  {b.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
                        onClick={() => handleUpdate(b.id, 'rejected')}
                        loading={updatingId === b.id}
                        leftIcon={<X size={14} />}
                      >
                        Decline
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleUpdate(b.id, 'approved')}
                        loading={updatingId === b.id}
                        leftIcon={<Check size={14} />}
                      >
                        Accept & Approve
                      </Button>
                    </>
                  )}

                  {b.status === 'approved' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleUpdate(b.id, 'in_progress')}
                        loading={updatingId === b.id}
                        leftIcon={<Play size={13} />}
                      >
                        Start Rental
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleUpdate(b.id, 'completed')}
                        loading={updatingId === b.id}
                        leftIcon={<CheckCircle size={14} />}
                      >
                        Mark Completed
                      </Button>
                    </>
                  )}

                  {b.status === 'in_progress' && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleUpdate(b.id, 'completed')}
                      loading={updatingId === b.id}
                      leftIcon={<CheckCircle size={14} />}
                    >
                      Mark Completed
                    </Button>
                  )}

                  {(b.status === 'completed' || b.status === 'rejected' || b.status === 'cancelled') && (
                    <span className="text-xs text-neutral-400 font-medium italic">
                      No further action needed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title={`No ${activeTab === 'all' ? '' : activeTab} requests`}
          description="Rental requests from farmers will appear here as soon as they book your machinery."
          action={() => setActiveTab('all')}
          actionLabel={activeTab !== 'all' ? 'View All Requests' : undefined}
        />
      )}
    </div>
  );
};

export default OwnerRequestsPage;
