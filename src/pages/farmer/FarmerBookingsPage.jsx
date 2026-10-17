import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  MapPin,
  ArrowRight,
  Filter,
  Pencil,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/formatters';

const TABS = [
  { value: 'all', label: 'All Bookings' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const FarmerBookingsPage = () => {
  const { user } = useAuth();
  const { bookings, updateBookingStatus, updateBooking } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  // Edit Booking Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState({
    requestedDate: '',
    duration: 1,
    farmSize: '',
    purpose: '',
    note: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const myBookings = bookings.filter((b) => b.farmerId === user?.id);

  const filteredBookings = myBookings.filter((b) => {
    if (activeTab === 'all') return true;
    return b.status === activeTab;
  });

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this rental request?')) {
      setCancellingId(id);
      try {
        await updateBookingStatus(id, 'cancelled');
      } finally {
        setCancellingId(null);
      }
    }
  };

  const handleOpenEdit = (b) => {
    setEditingBooking(b);
    setEditForm({
      requestedDate: b.requestedDate || '',
      duration: b.duration || 1,
      farmSize: b.farmSize || '',
      purpose: b.purpose || '',
      note: b.note || '',
    });
    setEditModalOpen(true);
  };

  const unitRate = editingBooking
    ? editingBooking.dailyRate || Math.round(Number(editingBooking.estimatedCost || 0) / Math.max(1, Number(editingBooking.duration || 1)))
    : 0;

  const recalculatedCost = Math.round(unitRate * Math.max(1, Number(editForm.duration || 1)));

  const handleEditBookingSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.requestedDate) return;

    setSavingEdit(true);
    try {
      await updateBooking(editingBooking.id, {
        requestedDate: editForm.requestedDate,
        duration: Math.max(1, Number(editForm.duration || 1)),
        farmSize: editForm.farmSize.trim() || 'Not specified',
        purpose: editForm.purpose.trim() || 'General farm operations',
        note: editForm.note.trim(),
        estimatedCost: recalculatedCost,
      });
      setEditModalOpen(false);
      setEditingBooking(null);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            My Equipment Rentals
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Track your machinery bookings, edit rental parameters, communicate with hosts, and review past rentals.
          </p>
        </div>
        <Link to="/equipment">
          <Button variant="primary" size="md" leftIcon={<Calendar size={16} />}>
            Book New Machinery
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-neutral-200">
        {TABS.map((tab) => {
          const count =
            tab.value === 'all'
              ? myBookings.length
              : myBookings.filter((b) => b.status === tab.value).length;

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

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const symbol = b.currencySymbol || '₦';

            return (
              <div
                key={b.id}
                className="card card-body bg-white border border-neutral-200/90 hover:border-neutral-300 transition-all shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Details */}
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
                        <span className="text-neutral-400">Owner:</span>
                        <strong className="text-neutral-800">{b.ownerName}</strong>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <span className="text-neutral-400">Rental Date:</span>
                        <strong className="text-neutral-800">{formatDate(b.requestedDate)}</strong>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <span className="text-neutral-400">Duration:</span>
                        <strong className="text-neutral-800">
                          {b.duration} {b.durationUnit || 'days'}
                        </strong>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <span className="text-neutral-400">Farm Location:</span>
                        <strong className="text-neutral-800">{b.location}</strong>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <span className="text-neutral-400">Estimated Cost:</span>
                        <strong className="text-primary-700 font-bold">
                          {symbol}{Number(b.estimatedCost).toLocaleString()}
                        </strong>
                      </p>
                      {b.purpose && (
                        <p className="flex items-center gap-1.5">
                          <span className="text-neutral-400">Purpose:</span>
                          <span className="text-neutral-700 italic truncate">{b.purpose}</span>
                        </p>
                      )}
                    </div>

                    {b.note && (
                      <div className="p-2.5 bg-neutral-50 rounded-xl text-xs text-neutral-600 border border-neutral-100">
                        <strong>Special Instructions:</strong> {b.note}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col lg:flex-row items-center gap-2 self-start lg:self-center border-t sm:border-t-0 pt-3 sm:pt-0">
                    {/* Edit button for pending rentals */}
                    {b.status === 'pending' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenEdit(b)}
                        leftIcon={<Pencil size={14} />}
                      >
                        Edit Request
                      </Button>
                    )}

                    <Link to={`/equipment/${b.equipmentId}`}>
                      <Button variant="outline" size="sm">
                        View Equipment
                      </Button>
                    </Link>

                    {(b.status === 'pending' || b.status === 'approved') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleCancelBooking(b.id)}
                        loading={cancellingId === b.id}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title={`No ${activeTab === 'all' ? '' : activeTab} bookings found`}
          description={
            activeTab === 'all'
              ? 'You have not submitted any machinery booking requests yet.'
              : `You do not have any bookings currently marked as ${activeTab}.`
          }
          action={() => setActiveTab('all')}
          actionLabel={activeTab !== 'all' ? 'View All Bookings' : undefined}
        />
      )}

      {/* ─── EDIT RENTAL REQUEST MODAL ──────────────────────────────── */}
      {editingBooking && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingBooking(null);
          }}
          title={`Edit Rental: ${editingBooking.equipmentName}`}
        >
          <form onSubmit={handleEditBookingSubmit} className="space-y-4">
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs text-neutral-600 space-y-1">
              <p>
                <strong>Equipment:</strong> {editingBooking.equipmentName}
              </p>
              <p>
                <strong>Host / Owner:</strong> {editingBooking.ownerName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                id="edit-booking-date"
                label="Requested Date"
                type="date"
                required
                value={editForm.requestedDate}
                onChange={(e) => setEditForm((prev) => ({ ...prev, requestedDate: e.target.value }))}
              />
              <Input
                id="edit-booking-duration"
                label={`Duration (${editingBooking.durationUnit || 'days'})`}
                type="number"
                min="1"
                required
                value={editForm.duration}
                onChange={(e) => setEditForm((prev) => ({ ...prev, duration: e.target.value }))}
              />
            </div>

            <Input
              id="edit-booking-size"
              label="Farm Size (e.g. 5 acres)"
              placeholder="e.g. 4 acres"
              value={editForm.farmSize}
              onChange={(e) => setEditForm((prev) => ({ ...prev, farmSize: e.target.value }))}
            />

            <Input
              id="edit-booking-purpose"
              label="Intended Operation"
              placeholder="e.g. Land ploughing, ridging, harvesting"
              value={editForm.purpose}
              onChange={(e) => setEditForm((prev) => ({ ...prev, purpose: e.target.value }))}
            />

            <Textarea
              id="edit-booking-note"
              label="Special Instructions for Owner"
              placeholder="Update road directions, time of arrival, or field access notes..."
              value={editForm.note}
              onChange={(e) => setEditForm((prev) => ({ ...prev, note: e.target.value }))}
              rows={3}
            />

            {/* Recalculated Cost Summary */}
            <div className="p-3.5 bg-primary-50 rounded-2xl border border-primary-200 flex items-center justify-between text-sm">
              <div>
                <span className="text-xs text-neutral-500 block">Updated Estimated Cost:</span>
                <span className="font-bold text-primary-900 text-base">
                  {editingBooking.currencySymbol || '₦'}{recalculatedCost.toLocaleString()}
                </span>
                <span className="text-xs text-neutral-400 ml-1">
                  ({editForm.duration} {editingBooking.durationUnit || 'day'}s @ {editingBooking.currencySymbol || '₦'}{unitRate.toLocaleString()})
                </span>
              </div>
              <span className="text-xs bg-white text-primary-700 px-2.5 py-1 rounded-xl border border-primary-200 font-medium">
                Adjusted
              </span>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingBooking(null);
                }}
                disabled={savingEdit}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={savingEdit}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default FarmerBookingsPage;
