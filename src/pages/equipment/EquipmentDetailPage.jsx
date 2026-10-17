import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Tractor,
  ArrowLeft,
  Star,
  Shield,
  Clock,
  Phone,
  User,
  Sparkles,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { getProximityLabel } from '../../utils/geo';
import { formatPrice } from '../../utils/formatters';

const EquipmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { equipment, createBooking } = useApp();
  const { user, isAuthenticated, canRent, enableCapability } = useAuth();

  const item = equipment.find((eq) => eq.id === id);

  // Gallery active image
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState(1);
  const [farmSize, setFarmSize] = useState('');
  const [purpose, setPurpose] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  if (!item) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Equipment Not Found</h2>
        <p className="text-neutral-500 mb-6">The machinery listing you requested could not be located.</p>
        <Link to="/equipment">
          <Button variant="primary" leftIcon={<ArrowLeft size={16} />}>
            Back to Marketplace
          </Button>
        </Link>
      </div>
    );
  }

  const {
    name,
    type,
    description,
    lga,
    state,
    country,
    town,
    pricePerDay,
    pricePerHour,
    pricePerAcre,
    billingUnit = 'per day',
    operatorIncluded,
    fuelIncluded,
    transportIncluded,
    availability,
    images = [],
    rating,
    reviewCount,
    specifications = {},
    rentalTerms,
    ownerName,
    ownerPhone,
    currencySymbol = '₦',
  } = item;

  const activeImage = images[activeImageIndex] || images[0] || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80';
  const unitRate = pricePerDay || pricePerHour || pricePerAcre || 0;
  const estimatedCost = Number(duration || 1) * unitRate;

  const proximityLabel = getProximityLabel(
    item,
    user ? { country: user.country, state: user.state, lga: user.lga } : null
  );

  const handleOpenBooking = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/equipment/${id}` } } });
      return;
    }
    setBookingModalOpen(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!startDate) {
      setBookingError('Please choose a start date.');
      return;
    }
    if (duration < 1) {
      setBookingError('Duration must be at least 1 day/unit.');
      return;
    }

    setSubmitting(true);
    setBookingError('');
    try {
      await createBooking({
        equipmentId: item.id,
        equipmentName: item.name,
        ownerId: item.ownerId,
        ownerName: item.ownerName,
        requestedDate: startDate,
        duration: Number(duration),
        durationUnit: billingUnit.replace('per ', ''),
        farmSize: farmSize || 'Not specified',
        purpose: purpose || 'General farm operations',
        location: [lga, state, country].filter(Boolean).join(', '),
        estimatedCost,
        currency: item.currency || 'NGN',
        currencySymbol: item.currencySymbol || '₦',
        dailyRate: unitRate,
        note,
      });
      setBookingSuccess(true);
    } catch (err) {
      setBookingError(err.message || 'Failed to submit booking request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb & Back Link */}
      <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
        <Link to="/equipment" className="hover:text-primary-700 flex items-center gap-1 font-medium">
          <ArrowLeft size={16} />
          Back to Equipment
        </Link>
        <span>/</span>
        <span className="text-neutral-400 capitalize">{type}</span>
        <span>/</span>
        <span className="text-neutral-900 font-medium truncate max-w-xs">{name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Visuals & Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Image & Gallery */}
          <div className="space-y-3">
            <div className="relative rounded-3xl overflow-hidden bg-neutral-100 h-80 sm:h-96 shadow-md border border-neutral-200">
              <img
                src={activeImage}
                alt={name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`badge text-xs font-semibold ${
                  availability === 'available' ? 'bg-primary-600 text-white' : 'bg-neutral-800 text-white'
                }`}>
                  {availability === 'available' ? '● Available for Hire' : 'Currently Unavailable'}
                </span>
                {proximityLabel && (
                  <span className="badge bg-accent-400 text-neutral-900 text-xs font-bold shadow">
                    📍 {proximityLabel}
                  </span>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-primary-600 ring-2 ring-primary-100' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="card card-body bg-white border border-neutral-200/80">
            <h2 className="text-lg font-bold text-neutral-900 mb-3">About this Machinery</h2>
            <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* Specifications */}
          <div className="card card-body bg-white border border-neutral-200/80">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">Technical Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(specifications).map(([key, val]) => (
                <div key={key} className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <p className="text-xs text-neutral-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-sm font-semibold text-neutral-800 mt-0.5">
                    {Array.isArray(val) ? val.join(', ') : String(val)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Rental Terms & Policies */}
          <div className="card card-body bg-white border border-neutral-200/80">
            <h2 className="text-lg font-bold text-neutral-900 mb-3">Rental Terms & Conditions</h2>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              {rentalTerms || 'Standard agricultural equipment hire contract applies upon booking confirmation.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-neutral-100 text-xs">
              <div className="flex items-center gap-2 text-neutral-700">
                {operatorIncluded ? (
                  <CheckCircle size={16} className="text-primary-600" />
                ) : (
                  <XCircle size={16} className="text-neutral-400" />
                )}
                <span>Operator {operatorIncluded ? 'Included' : 'Not Included'}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                {fuelIncluded ? (
                  <CheckCircle size={16} className="text-primary-600" />
                ) : (
                  <XCircle size={16} className="text-neutral-400" />
                )}
                <span>Fuel {fuelIncluded ? 'Included' : 'Hirer supplies fuel'}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                {transportIncluded ? (
                  <CheckCircle size={16} className="text-primary-600" />
                ) : (
                  <XCircle size={16} className="text-neutral-400" />
                )}
                <span>Transport {transportIncluded ? 'Included' : 'Self-collection / Haulage'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Booking Action */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
          {/* Main Booking Card */}
          <div className="card card-body bg-white border-2 border-primary-100 shadow-xl p-6 sm:p-7">
            {/* Header info */}
            <div className="mb-4">
              <span className="badge-primary mb-2 text-xs">{type}</span>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 leading-tight">
                {name}
              </h1>
              <div className="flex items-center gap-1.5 text-neutral-500 text-sm mt-2">
                <MapPin size={16} className="text-primary-600 flex-shrink-0" />
                <span>{[town, lga, state, country].filter(Boolean).join(', ')}</span>
              </div>
            </div>

            {/* Price display */}
            <div className="p-4 bg-primary-50/70 rounded-2xl border border-primary-200/80 mb-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-black text-primary-800">
                    {currencySymbol}{unitRate.toLocaleString()}
                  </span>
                  <span className="text-xs text-neutral-500 ml-1.5 font-medium">/{billingUnit.replace('per ', '')}</span>
                </div>
                {rating && (
                  <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl shadow-xs border border-neutral-200">
                    <Star size={14} className="text-accent-400 fill-accent-400" />
                    <span className="text-xs font-bold text-neutral-800">{rating}</span>
                    <span className="text-[11px] text-neutral-400">({reviewCount})</span>
                  </div>
                )}
              </div>
              {pricePerAcre && (
                <p className="text-xs text-primary-700 mt-2 font-medium">
                  Also available per acre: {currencySymbol}{pricePerAcre.toLocaleString()} / acre
                </p>
              )}
            </div>

            {/* Quick value highlights */}
            <div className="space-y-2.5 mb-6 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <CheckCircle size={15} className="text-secondary-500 flex-shrink-0" />
                <span>Hyper-local pickup in {lga} reduces logistics delay</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={15} className="text-secondary-500 flex-shrink-0" />
                <span>{operatorIncluded ? 'Comes with experienced equipment operator' : 'Self-operated with valid certification'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={15} className="text-secondary-500 flex-shrink-0" />
                <span>No advance online payment required for demo booking</span>
              </div>
            </div>

            {/* Primary Action Button or Self-Ownership / Capability Warning */}
            {user && item.ownerId === user.id ? (
              <div className="space-y-2">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Tractor size={15} className="text-amber-700" />
                    <span>You own this machinery listing</span>
                  </p>
                  <p>You cannot submit a rental request for your own equipment.</p>
                </div>
                <Link to="/owner/equipment">
                  <Button variant="outline" size="md" fullWidth>
                    Manage in Owner Dashboard
                  </Button>
                </Link>
              </div>
            ) : isAuthenticated && !canRent ? (
              <div className="space-y-2">
                <div className="p-3.5 rounded-2xl bg-primary-50 border border-primary-200 text-xs text-primary-900 space-y-1">
                  <p className="font-bold">Farmer Features Needed</p>
                  <p>Your account currently has Owner features. Enable Farmer rental features with 1-click to request this booking!</p>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={async () => {
                    await enableCapability('canRentEquipment');
                    setBookingModalOpen(true);
                  }}
                  leftIcon={<Sparkles size={18} />}
                >
                  Enable Farmer Features &amp; Book
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleOpenBooking}
                  leftIcon={<Calendar size={18} />}
                >
                  Request to Book Equipment
                </Button>
                <p className="text-[11px] text-neutral-400 text-center mt-3">
                  Requests are sent directly to the machinery owner for confirmation.
                </p>
              </>
            )}
          </div>

          {/* Owner Profile Card */}
          <div className="card card-body bg-white border border-neutral-200">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
              Equipment Owner
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-primary-700 font-bold text-base flex-shrink-0">
                <User size={22} className="text-neutral-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-neutral-900 truncate">{ownerName}</p>
                <p className="text-xs text-neutral-500 truncate">Verified Equipment Host</p>
                <p className="text-xs text-primary-700 font-medium flex items-center gap-1 mt-0.5">
                  <Phone size={12} />
                  {ownerPhone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => {
          if (!submitting) {
            setBookingModalOpen(false);
            setBookingSuccess(false);
          }
        }}
        title={`Request Rental: ${name}`}
      >
        {bookingSuccess ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Rental Request Submitted!</h3>
            <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
              Your request for <strong>{name}</strong> has been sent to <strong>{ownerName}</strong>. You can view the request status in your dashboard.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setBookingModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('/farmer/bookings')}
              >
                View My Rentals
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            {bookingError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {bookingError}
              </div>
            )}

            <Input
              id="booking-date"
              label="Requested Start Date"
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                id="booking-duration"
                label={`Duration (${billingUnit.replace('per ', '')}s)`}
                type="number"
                min="1"
                required
                value={duration}
                onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <Input
                id="booking-size"
                label="Farm Size (e.g. 5 acres)"
                placeholder="e.g. 4 acres"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
              />
            </div>

            <Input
              id="booking-purpose"
              label="Intended Operation"
              placeholder="e.g. Land ploughing, ridging, harvesting"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />

            <Textarea
              id="booking-note"
              label="Special Instructions for Owner"
              placeholder="Provide access road details, nearest landmark, or preferred time of arrival..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />

            {/* Estimated Total Calculation */}
            <div className="p-3.5 bg-primary-50 rounded-2xl border border-primary-200 flex items-center justify-between text-sm">
              <div>
                <span className="text-xs text-neutral-500 block">Estimated Cost:</span>
                <span className="font-bold text-primary-900 text-base">
                  {currencySymbol}{estimatedCost.toLocaleString()}
                </span>
                <span className="text-xs text-neutral-400 ml-1">
                  ({duration} {billingUnit.replace('per ', '')}s @ {currencySymbol}{unitRate.toLocaleString()})
                </span>
              </div>
              <span className="text-xs bg-white text-primary-700 px-2.5 py-1 rounded-xl border border-primary-200 font-medium">
                Pay on Confirmation
              </span>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setBookingModalOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
              >
                Submit Booking Request
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default EquipmentDetailPage;
