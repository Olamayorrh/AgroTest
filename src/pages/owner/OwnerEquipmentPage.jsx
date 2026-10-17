import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Tractor,
  PlusCircle,
  MapPin,
  Trash2,
  Eye,
  Power,
  Pencil,
  DollarSign,
  Coins,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import ImageUpload from '../../components/ui/ImageUpload';
import {
  getCountries,
  getStates,
  getLGAs,
  getCountryCurrency,
  SUPPORTED_CURRENCIES,
} from '../../data/africaGeo';
import { EQUIPMENT_TYPES, BILLING_UNITS } from '../../data/mockData';

const OwnerEquipmentPage = () => {
  const { user } = useAuth();
  const { equipment, createEquipment, updateEquipment, deleteEquipment } = useApp();
  const location = useLocation();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const userCountry = user?.country || 'NG';
  const defaultCurrencyInfo = getCountryCurrency(userCountry);

  // New Equipment Form State
  const [form, setForm] = useState({
    name: '',
    type: EQUIPMENT_TYPES[0],
    description: '',
    country: userCountry,
    state: user?.state || '',
    lga: user?.lga || '',
    town: user?.town || '',
    currency: defaultCurrencyInfo.currency || 'NGN',
    currencySymbol: defaultCurrencyInfo.symbol || '₦',
    pricePerDay: '',
    pricePerHour: '',
    pricePerAcre: '',
    billingUnit: 'per day',
    operatorIncluded: true,
    fuelIncluded: false,
    transportIncluded: false,
    engine: '',
    year: '',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
    rentalTerms: 'Standard daily rate. Fuel not included. Operator included.',
  });

  // Edit Equipment Form State
  const [editForm, setEditForm] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Auto open Add Modal if route is /owner/equipment/new
  useEffect(() => {
    if (location.pathname === '/owner/equipment/new') {
      setAddModalOpen(true);
    }
  }, [location.pathname]);

  const countries = getCountries();
  const states = getStates(form.country);
  const lgas = getLGAs(form.country, form.state);

  const editStates = editForm ? getStates(editForm.country) : [];
  const editLgas = editForm ? getLGAs(editForm.country, editForm.state) : [];

  const myEquipment = equipment.filter(
    (eq) => eq.ownerId === user?.id || (user?.id === 'user-owner-demo' && eq.ownerId === 'user-owner-demo')
  );

  const update = (field, val) => {
    setForm((prev) => {
      const next = { ...prev, [field]: val };
      if (field === 'country') {
        next.state = '';
        next.lga = '';
        // Automatically adapt currency to selected country
        const countryCurr = getCountryCurrency(val);
        next.currency = countryCurr.currency;
        next.currencySymbol = countryCurr.symbol;
      }
      if (field === 'state') {
        next.lga = '';
      }
      if (field === 'currency') {
        const found = SUPPORTED_CURRENCIES.find((c) => c.code === val);
        if (found) next.currencySymbol = found.symbol;
      }
      return next;
    });
  };

  const updateEdit = (field, val) => {
    setEditForm((prev) => {
      const next = { ...prev, [field]: val };
      if (field === 'country') {
        next.state = '';
        next.lga = '';
        const countryCurr = getCountryCurrency(val);
        next.currency = countryCurr.currency;
        next.currencySymbol = countryCurr.symbol;
      }
      if (field === 'state') {
        next.lga = '';
      }
      if (field === 'currency') {
        const found = SUPPORTED_CURRENCIES.find((c) => c.code === val);
        if (found) next.currencySymbol = found.symbol;
      }
      return next;
    });
  };

  const handleOpenEdit = (item) => {
    const itemCountry = item.country || userCountry;
    const fallbackCurr = getCountryCurrency(itemCountry);
    const itemCurrency = item.currency || fallbackCurr.currency;
    const itemSymbol = item.currencySymbol || fallbackCurr.symbol;

    setEditingItem(item);
    setEditForm({
      name: item.name || '',
      type: item.type || EQUIPMENT_TYPES[0],
      description: item.description || '',
      country: itemCountry,
      state: item.state || '',
      lga: item.lga || '',
      town: item.town || '',
      currency: itemCurrency,
      currencySymbol: itemSymbol,
      pricePerDay: item.pricePerDay || '',
      pricePerHour: item.pricePerHour || '',
      pricePerAcre: item.pricePerAcre || '',
      billingUnit: item.billingUnit || 'per day',
      operatorIncluded: Boolean(item.operatorIncluded),
      fuelIncluded: Boolean(item.fuelIncluded),
      transportIncluded: Boolean(item.transportIncluded),
      engine: item.specifications?.engine || '',
      year: item.specifications?.year || '',
      imageUrl: item.images?.[0] || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
      rentalTerms: item.rentalTerms || 'Standard daily rate. Fuel not included. Operator included.',
      availability: item.availability || 'available',
    });
    setError('');
    setEditModalOpen(true);
  };

  const handleToggleStatus = async (item) => {
    const nextStatus = item.availability === 'available' ? 'unavailable' : 'available';
    await updateEquipment(item.id, { availability: nextStatus });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this equipment listing?')) {
      await deleteEquipment(id);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.pricePerDay) {
      setError('Please provide equipment name and a daily hire price.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await createEquipment({
        ownerId: user?.id || 'user-owner-demo',
        ownerName: user?.name || 'Chukwuemeka Obi',
        ownerPhone: user?.phone || '08087654321',
        name: form.name.trim(),
        type: form.type,
        description: form.description.trim() || `${form.name} available for hire.`,
        country: form.country,
        state: form.state || 'OY',
        lga: form.lga || 'Ibadan North',
        town: form.town || '',
        currency: form.currency,
        currencySymbol: form.currencySymbol,
        pricePerDay: Number(form.pricePerDay),
        pricePerHour: form.pricePerHour ? Number(form.pricePerHour) : null,
        pricePerAcre: form.pricePerAcre ? Number(form.pricePerAcre) : null,
        billingUnit: form.billingUnit,
        operatorIncluded: form.operatorIncluded,
        fuelIncluded: form.fuelIncluded,
        transportIncluded: form.transportIncluded,
        availability: 'available',
        images: [form.imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80'],
        tags: [form.type.toLowerCase(), form.lga.toLowerCase()],
        specifications: {
          engine: form.engine || 'Standard Diesel',
          year: form.year ? Number(form.year) : 2020,
          condition: 'Good',
        },
        rentalTerms: form.rentalTerms,
        rating: 5.0,
        reviewCount: 1,
      });

      // Reset and close
      setAddModalOpen(false);
      setForm({
        name: '',
        type: EQUIPMENT_TYPES[0],
        description: '',
        country: userCountry,
        state: user?.state || '',
        lga: user?.lga || '',
        town: '',
        currency: defaultCurrencyInfo.currency || 'NGN',
        currencySymbol: defaultCurrencyInfo.symbol || '₦',
        pricePerDay: '',
        pricePerHour: '',
        pricePerAcre: '',
        billingUnit: 'per day',
        operatorIncluded: true,
        fuelIncluded: false,
        transportIncluded: false,
        engine: '',
        year: '',
        imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
        rentalTerms: 'Standard daily rate. Fuel not included. Operator included.',
      });
    } catch (err) {
      setError(err.message || 'Failed to add equipment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.pricePerDay) {
      setError('Please provide equipment name and a daily hire price.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await updateEquipment(editingItem.id, {
        name: editForm.name.trim(),
        type: editForm.type,
        description: editForm.description.trim(),
        country: editForm.country,
        state: editForm.state,
        lga: editForm.lga,
        town: editForm.town,
        currency: editForm.currency,
        currencySymbol: editForm.currencySymbol,
        pricePerDay: Number(editForm.pricePerDay),
        pricePerHour: editForm.pricePerHour ? Number(editForm.pricePerHour) : null,
        pricePerAcre: editForm.pricePerAcre ? Number(editForm.pricePerAcre) : null,
        billingUnit: editForm.billingUnit,
        operatorIncluded: editForm.operatorIncluded,
        fuelIncluded: editForm.fuelIncluded,
        transportIncluded: editForm.transportIncluded,
        availability: editForm.availability,
        images: [editForm.imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80'],
        specifications: {
          engine: editForm.engine || 'Standard Diesel',
          year: editForm.year ? Number(editForm.year) : 2020,
          condition: editingItem.specifications?.condition || 'Good',
          attachments: editingItem.specifications?.attachments || [],
        },
        rentalTerms: editForm.rentalTerms,
      });

      setEditModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      setError(err.message || 'Failed to update equipment listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            My Machinery Listings
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage your equipment catalog, customize rental rates &amp; currencies, upload real photos, and edit listings.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setError('');
            setAddModalOpen(true);
          }}
          leftIcon={<PlusCircle size={16} />}
        >
          Add New Machine
        </Button>
      </div>

      {/* Equipment Grid */}
      {myEquipment.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {myEquipment.map((eq) => {
            const symbol = eq.currencySymbol || getCountryCurrency(eq.country).symbol || '₦';
            const price = eq.pricePerDay || eq.pricePerHour || eq.pricePerAcre || 0;
            const unit = eq.billingUnit?.replace('per ', '') || 'day';

            return (
              <div
                key={eq.id}
                className="card bg-white border border-neutral-200/90 overflow-hidden flex flex-col shadow-sm hover:border-neutral-300 transition-all"
              >
                {/* Image Header */}
                <div className="relative h-48 bg-neutral-100 overflow-hidden">
                  <img
                    src={eq.images?.[0] || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80'}
                    alt={eq.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`badge text-xs font-semibold ${
                        eq.availability === 'available'
                          ? 'bg-green-600 text-white'
                          : 'bg-neutral-800 text-white'
                      }`}
                    >
                      {eq.availability === 'available' ? 'Available' : 'Paused'}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-extrabold text-primary-800 shadow">
                    {symbol}{Number(price).toLocaleString()} / {unit}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="badge-gray text-xs">{eq.type}</span>
                      <span className="text-[11px] font-semibold text-neutral-400 uppercase">
                        {eq.currency || 'NGN'}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-neutral-900 leading-snug line-clamp-1">
                      {eq.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-neutral-500 text-xs mt-1.5">
                      <MapPin size={13} className="text-primary-600 flex-shrink-0" />
                      <span className="truncate">
                        {[eq.town, eq.lga, eq.state, eq.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-neutral-600 pt-3 border-t border-neutral-100">
                    <p>
                      <strong>Operator:</strong> {eq.operatorIncluded ? 'Included' : 'Self-operated'}
                    </p>
                    <p>
                      <strong>Engine / Specs:</strong> {eq.specifications?.engine || 'Standard'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 gap-2">
                    <button
                      onClick={() => handleToggleStatus(eq)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                        eq.availability === 'available'
                          ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                          : 'bg-green-50 text-green-800 hover:bg-green-100'
                      }`}
                    >
                      <Power size={13} />
                      {eq.availability === 'available' ? 'Pause Hire' : 'Make Available'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(eq)}
                        className="p-2 text-neutral-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
                        title="Edit Machinery Details"
                      >
                        <Pencil size={15} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <Link to={`/equipment/${eq.id}`}>
                        <button
                          className="p-2 text-neutral-500 hover:text-primary-700 hover:bg-neutral-100 rounded-xl transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDelete(eq.id)}
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        aria-label="Delete listing"
                        title="Delete listing"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Tractor}
          title="No machinery listed yet"
          description="Add your first tractor, planter, or harvester to start receiving rental requests."
          action={() => setAddModalOpen(true)}
          actionLabel="Add Machine Now"
        />
      )}

      {/* ─── ADD EQUIPMENT MODAL ─────────────────────────────────────── */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="List Agricultural Machinery"
        size="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* Photo Upload Section */}
          <ImageUpload
            value={form.imageUrl}
            onChange={(val) => update('imageUrl', val)}
            label="Upload Machinery Photo / Choose Picture"
          />

          <Input
            id="eq-name"
            label="Machinery Name & Model"
            placeholder="e.g. John Deere 5055E 4WD Tractor"
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              id="eq-type"
              label="Equipment Type"
              value={form.type}
              onChange={(e) => update('type', e.target.value)}
              options={EQUIPMENT_TYPES.map((t) => ({ value: t, label: t }))}
            />

            <Select
              id="eq-unit"
              label="Billing Unit"
              value={form.billingUnit}
              onChange={(e) => update('billingUnit', e.target.value)}
              options={BILLING_UNITS.map((u) => ({ value: u, label: u }))}
            />
          </div>

          {/* Geographic Location (Country auto-adapts currency) */}
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-neutral-800">Where is the equipment parked?</p>
              <span className="text-[11px] text-primary-700 font-medium">
                Country sets default currency automatically
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Select
                id="eq-country"
                label="Country"
                value={form.country}
                onChange={(e) => update('country', e.target.value)}
                options={countries.map((c) => ({ value: c.code, label: c.name }))}
              />
              <Select
                id="eq-state"
                label="State / Region"
                value={form.state}
                onChange={(e) => update('state', e.target.value)}
                options={states.map((s) => ({ value: s.code, label: s.name }))}
              />
              <Select
                id="eq-lga"
                label="LGA / District"
                value={form.lga}
                onChange={(e) => update('lga', e.target.value)}
                options={lgas.map((l) => ({ value: l.value, label: l.name }))}
                disabled={!form.state}
              />
            </div>
            <Input
              id="eq-town"
              label="Town / Community / Landmark"
              placeholder="e.g. Agodi, Ring Road, Egbeda"
              value={form.town}
              onChange={(e) => update('town', e.target.value)}
            />
          </div>

          {/* Currency Selection & Pricing */}
          <div className="p-3.5 bg-primary-50/50 rounded-2xl border border-primary-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-primary-950 flex items-center gap-1.5">
                <Coins size={14} className="text-primary-700" />
                <span>Rental Currency &amp; Rates</span>
              </label>
              <span className="text-xs font-extrabold text-primary-700 bg-white px-2 py-0.5 rounded-lg border border-primary-200">
                Active: {form.currencySymbol} ({form.currency})
              </span>
            </div>

            <Select
              id="eq-currency"
              label="Select Rental Currency"
              value={form.currency}
              onChange={(e) => update('currency', e.target.value)}
              options={SUPPORTED_CURRENCIES.map((c) => ({
                value: c.code,
                label: `${c.name} — ${c.code}`,
              }))}
            />

            <div className="grid grid-cols-3 gap-3">
              <Input
                id="eq-price-day"
                label={`Rate / Day (${form.currencySymbol})*`}
                type="number"
                placeholder="e.g. 35000"
                required
                value={form.pricePerDay}
                onChange={(e) => update('pricePerDay', e.target.value)}
              />
              <Input
                id="eq-price-hour"
                label={`Rate / Hour (${form.currencySymbol})`}
                type="number"
                placeholder="e.g. 5000"
                value={form.pricePerHour}
                onChange={(e) => update('pricePerHour', e.target.value)}
              />
              <Input
                id="eq-price-acre"
                label={`Rate / Acre (${form.currencySymbol})`}
                type="number"
                placeholder="e.g. 12000"
                value={form.pricePerAcre}
                onChange={(e) => update('pricePerAcre', e.target.value)}
              />
            </div>
          </div>

          {/* Operator and fuel toggles */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-200 cursor-pointer bg-white">
              <input
                type="checkbox"
                checked={form.operatorIncluded}
                onChange={(e) => update('operatorIncluded', e.target.checked)}
                className="rounded border-neutral-300 text-primary-600"
              />
              <span className="font-medium text-neutral-700">Operator Included</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-200 cursor-pointer bg-white">
              <input
                type="checkbox"
                checked={form.fuelIncluded}
                onChange={(e) => update('fuelIncluded', e.target.checked)}
                className="rounded border-neutral-300 text-primary-600"
              />
              <span className="font-medium text-neutral-700">Fuel Included</span>
            </label>
          </div>

          <Textarea
            id="eq-desc"
            label="Machinery Description & Condition"
            placeholder="Describe horsepower, attachments (plough/harrow), and suitable soil terrains..."
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={3}
          />

          <div className="flex gap-2 justify-end pt-3 border-t border-neutral-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Publish Machinery
            </Button>
          </div>
        </form>
      </Modal>

      {/* ─── EDIT EQUIPMENT MODAL ────────────────────────────────────── */}
      {editForm && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingItem(null);
          }}
          title="Edit Machinery Listing"
          size="lg"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {error}
              </div>
            )}

            {/* Photo Upload Section */}
            <ImageUpload
              value={editForm.imageUrl}
              onChange={(val) => updateEdit('imageUrl', val)}
              label="Update Machinery Photo"
            />

            <Input
              id="edit-eq-name"
              label="Machinery Name & Model"
              placeholder="e.g. John Deere 5055E 4WD Tractor"
              required
              value={editForm.name}
              onChange={(e) => updateEdit('name', e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                id="edit-eq-type"
                label="Equipment Type"
                value={editForm.type}
                onChange={(e) => updateEdit('type', e.target.value)}
                options={EQUIPMENT_TYPES.map((t) => ({ value: t, label: t }))}
              />

              <Select
                id="edit-eq-unit"
                label="Billing Unit"
                value={editForm.billingUnit}
                onChange={(e) => updateEdit('billingUnit', e.target.value)}
                options={BILLING_UNITS.map((u) => ({ value: u, label: u }))}
              />
            </div>

            {/* Geographic Location */}
            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-neutral-800">Machinery Location</p>
                <span className="text-[11px] text-primary-700 font-medium">
                  Changing country adapts default currency
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Select
                  id="edit-eq-country"
                  label="Country"
                  value={editForm.country}
                  onChange={(e) => updateEdit('country', e.target.value)}
                  options={countries.map((c) => ({ value: c.code, label: c.name }))}
                />
                <Select
                  id="edit-eq-state"
                  label="State / Region"
                  value={editForm.state}
                  onChange={(e) => updateEdit('state', e.target.value)}
                  options={editStates.map((s) => ({ value: s.code, label: s.name }))}
                />
                <Select
                  id="edit-eq-lga"
                  label="LGA / District"
                  value={editForm.lga}
                  onChange={(e) => updateEdit('lga', e.target.value)}
                  options={editLgas.map((l) => ({ value: l.value, label: l.name }))}
                  disabled={!editForm.state}
                />
              </div>
              <Input
                id="edit-eq-town"
                label="Town / Community / Landmark"
                placeholder="e.g. Agodi, Ring Road, Egbeda"
                value={editForm.town}
                onChange={(e) => updateEdit('town', e.target.value)}
              />
            </div>

            {/* Currency Selection & Rates */}
            <div className="p-3.5 bg-primary-50/50 rounded-2xl border border-primary-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-primary-950 flex items-center gap-1.5">
                  <Coins size={14} className="text-primary-700" />
                  <span>Currency &amp; Rental Rates</span>
                </label>
                <span className="text-xs font-extrabold text-primary-700 bg-white px-2 py-0.5 rounded-lg border border-primary-200">
                  {editForm.currencySymbol} ({editForm.currency})
                </span>
              </div>

              <Select
                id="edit-eq-currency"
                label="Rental Currency"
                value={editForm.currency}
                onChange={(e) => updateEdit('currency', e.target.value)}
                options={SUPPORTED_CURRENCIES.map((c) => ({
                  value: c.code,
                  label: `${c.name} — ${c.code}`,
                }))}
              />

              <div className="grid grid-cols-3 gap-3">
                <Input
                  id="edit-eq-price-day"
                  label={`Rate / Day (${editForm.currencySymbol})*`}
                  type="number"
                  placeholder="e.g. 35000"
                  required
                  value={editForm.pricePerDay}
                  onChange={(e) => updateEdit('pricePerDay', e.target.value)}
                />
                <Input
                  id="edit-eq-price-hour"
                  label={`Rate / Hour (${editForm.currencySymbol})`}
                  type="number"
                  placeholder="e.g. 5000"
                  value={editForm.pricePerHour}
                  onChange={(e) => updateEdit('pricePerHour', e.target.value)}
                />
                <Input
                  id="edit-eq-price-acre"
                  label={`Rate / Acre (${editForm.currencySymbol})`}
                  type="number"
                  placeholder="e.g. 12000"
                  value={editForm.pricePerAcre}
                  onChange={(e) => updateEdit('pricePerAcre', e.target.value)}
                />
              </div>
            </div>

            {/* Operator and fuel toggles */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-200 cursor-pointer bg-white">
                <input
                  type="checkbox"
                  checked={editForm.operatorIncluded}
                  onChange={(e) => updateEdit('operatorIncluded', e.target.checked)}
                  className="rounded border-neutral-300 text-primary-600"
                />
                <span className="font-medium text-neutral-700">Operator Included</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-200 cursor-pointer bg-white">
                <input
                  type="checkbox"
                  checked={editForm.fuelIncluded}
                  onChange={(e) => updateEdit('fuelIncluded', e.target.checked)}
                  className="rounded border-neutral-300 text-primary-600"
                />
                <span className="font-medium text-neutral-700">Fuel Included</span>
              </label>
            </div>

            <Textarea
              id="edit-eq-desc"
              label="Machinery Description & Condition"
              placeholder="Describe horsepower, attachments, and field suitability..."
              value={editForm.description}
              onChange={(e) => updateEdit('description', e.target.value)}
              rows={3}
            />

            <div className="flex gap-2 justify-end pt-3 border-t border-neutral-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingItem(null);
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={submitting}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default OwnerEquipmentPage;
