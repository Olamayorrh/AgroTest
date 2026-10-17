import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  MapPin,
  Tractor,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import EquipmentCard from '../../components/shared/EquipmentCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import { applyEquipmentFilters } from '../../utils/geo';
import { getCountries, getStates, getLGAs } from '../../data/africaGeo';
import { EQUIPMENT_TYPES } from '../../data/mockData';

const SORT_OPTIONS = [
  { value: 'nearest', label: '📍 Nearest First (Proximity)' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Listed' },
];

const EquipmentListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { equipment } = useApp();
  const { user } = useAuth();

  // Filter state initialized from URL or defaults
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [country, setCountry] = useState(
    searchParams.get('country') || (user?.country || 'NG')
  );
  const [state, setState] = useState(
    searchParams.get('state') || (user?.state || '')
  );
  const [lga, setLga] = useState(
    searchParams.get('lga') || (user?.lga || '')
  );
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [operatorIncluded, setOperatorIncluded] = useState(
    searchParams.get('operator') || ''
  );
  const [availability, setAvailability] = useState(
    searchParams.get('avail') || 'available'
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'nearest');

  // Mobile filters open/close
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setKeyword(q);
    const t = searchParams.get('type');
    if (t !== null) setType(t);
  }, [searchParams]);

  const countries = getCountries();
  const states = getStates(country);
  const lgas = getLGAs(country, state);

  // User location for proximity sorting
  const userLocation = useMemo(() => {
    if (user?.country) {
      return { country: user.country, state: user.state, lga: user.lga };
    }
    if (country) {
      return { country, state, lga };
    }
    return null;
  }, [user, country, state, lga]);

  // Apply filters
  const filteredEquipment = useMemo(() => {
    return applyEquipmentFilters(
      equipment,
      {
        keyword,
        type,
        country,
        state,
        lga,
        minPrice,
        maxPrice,
        availability,
        operatorIncluded,
        sortBy,
      },
      userLocation
    );
  }, [
    equipment,
    keyword,
    type,
    country,
    state,
    lga,
    minPrice,
    maxPrice,
    availability,
    operatorIncluded,
    sortBy,
    userLocation,
  ]);

  const handleCountryChange = (val) => {
    setCountry(val);
    setState('');
    setLga('');
  };

  const handleStateChange = (val) => {
    setState(val);
    setLga('');
  };

  const handleResetFilters = () => {
    setKeyword('');
    setType('');
    setCountry('NG');
    setState('');
    setLga('');
    setMinPrice('');
    setMaxPrice('');
    setOperatorIncluded('');
    setAvailability('available');
    setSortBy('nearest');
    setSearchParams({});
  };

  const activeFilterCount = [
    keyword,
    type,
    state,
    lga,
    minPrice,
    maxPrice,
    operatorIncluded,
  ].filter(Boolean).length;

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Machinery Marketplace
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Find, compare, and book tractors, implements, and harvesters nearby.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-semibold text-neutral-700 shadow-sm"
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary-700 text-white text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input text-xs sm:text-sm py-2 px-3 bg-white w-auto"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* User Proximity Callout */}
        {user?.lga && (
          <div className="mt-4 p-3 rounded-2xl bg-primary-50 border border-primary-200 flex items-center justify-between text-xs sm:text-sm text-primary-900">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary-700 flex-shrink-0" />
              <span>
                Sorted by proximity to your farm location in{' '}
                <strong>{user.lga}, {user.state}</strong>. Machinery in your LGA appears first to reduce haulage costs!
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Sidebar Filters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-sm sticky top-20">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
            <div className="flex items-center gap-2 font-bold text-neutral-800 text-sm">
              <Filter size={16} className="text-primary-700" />
              <span>Refine Search</span>
              {activeFilterCount > 0 && (
                <span className="text-xs font-semibold bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full">
                  {activeFilterCount} active
                </span>
              )}
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-neutral-400 hover:text-red-500 flex items-center gap-1 font-medium transition-colors"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            )}
          </div>

          <div className="space-y-5">
            {/* Keyword Search */}
            <div>
              <label className="form-label text-xs">Search Keywords</label>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="e.g. John Deere, 4-Row, Harrow"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="form-input text-xs pl-9"
                />
                {keyword && (
                  <button
                    onClick={() => setKeyword('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Equipment Type */}
            <div>
              <label className="form-label text-xs">Equipment Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="form-input text-xs"
              >
                <option value="">All Machinery Types</option>
                {EQUIPMENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Geographic Hierarchy */}
            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary-800">
                <MapPin size={14} />
                <span>Geographic Location</span>
              </div>

              <div>
                <label className="text-[11px] font-medium text-neutral-500 mb-1 block">Country</label>
                <select
                  value={country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="form-input text-xs py-1.5"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-neutral-500 mb-1 block">State / Region</label>
                <select
                  value={state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="form-input text-xs py-1.5"
                >
                  <option value="">All States</option>
                  {states.map((s) => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-neutral-500 mb-1 block">LGA / District</label>
                <select
                  value={lga}
                  onChange={(e) => setLga(e.target.value)}
                  disabled={!state}
                  className="form-input text-xs py-1.5 disabled:opacity-50"
                >
                  <option value="">All LGAs / Districts</option>
                  {lgas.map((l) => (
                    <option key={l.value} value={l.value}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="form-label text-xs">Daily Rate (Max)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="form-input text-xs w-1/2"
                />
                <span className="text-neutral-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="form-input text-xs w-1/2"
                />
              </div>
            </div>

            {/* Operator Included */}
            <div>
              <label className="form-label text-xs">Operator Status</label>
              <select
                value={operatorIncluded}
                onChange={(e) => setOperatorIncluded(e.target.value)}
                className="form-input text-xs"
              >
                <option value="">Any</option>
                <option value="yes">Operator Included</option>
                <option value="no">Self-Operated (No Operator)</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="form-label text-xs">Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="form-input text-xs"
              >
                <option value="">All (Including Inactive)</option>
                <option value="available">Available Now Only</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Results Column */}
        <main className="lg:col-span-9">
          {/* Results Bar */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
            <span className="text-sm font-semibold text-neutral-700">
              Showing {filteredEquipment.length}{' '}
              {filteredEquipment.length === 1 ? 'equipment listing' : 'equipment listings'}
            </span>
            {activeFilterCount > 0 && (
              <span className="text-xs text-neutral-400">
                Filtered from {equipment.length} total
              </span>
            )}
          </div>

          {/* Cards Grid */}
          {filteredEquipment.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEquipment.map((item) => (
                <EquipmentCard
                  key={item.id}
                  equipment={item}
                  userLocation={userLocation}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Tractor}
              title="No machinery matches your filters"
              description="Try adjusting your keywords, expanding your state or LGA selection, or resetting the price filters."
              action={handleResetFilters}
              actionLabel="Clear All Filters"
            />
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer / Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <div
            className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl z-10 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-base text-neutral-900">Filters & Location</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Keyword */}
            <div>
              <label className="form-label text-xs">Search Keywords</label>
              <input
                type="text"
                placeholder="e.g. John Deere, 4-Row, Harrow"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="form-input text-sm"
              />
            </div>

            {/* Type */}
            <div>
              <label className="form-label text-xs">Equipment Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="form-input text-sm"
              >
                <option value="">All Machinery Types</option>
                {EQUIPMENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Country / State / LGA */}
            <div className="space-y-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
              <p className="text-xs font-bold text-neutral-800">Location Settings</p>
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="form-input text-sm"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
              <select
                value={state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="form-input text-sm"
              >
                <option value="">All States</option>
                {states.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
              <select
                value={lga}
                onChange={(e) => setLga(e.target.value)}
                disabled={!state}
                className="form-input text-sm disabled:opacity-50"
              >
                <option value="">All LGAs</option>
                {lgas.map((l) => (
                  <option key={l.value} value={l.value}>{l.name}</option>
                ))}
              </select>
            </div>

            {/* Operator */}
            <div>
              <label className="form-label text-xs">Operator Status</label>
              <select
                value={operatorIncluded}
                onChange={(e) => setOperatorIncluded(e.target.value)}
                className="form-input text-sm"
              >
                <option value="">Any</option>
                <option value="yes">Operator Included</option>
                <option value="no">Self-Operated</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  handleResetFilters();
                  setMobileFiltersOpen(false);
                }}
              >
                Reset All
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={() => setMobileFiltersOpen(false)}
              >
                Show Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentListPage;
