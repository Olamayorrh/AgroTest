import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Shield,
  CheckCircle,
  Tractor,
  Layers,
  Sparkles,
  AlertCircle,
  Power,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { getCountries, getStates, getLGAs } from '../../data/africaGeo';
import { getInitials } from '../../utils/formatters';

const ProfilePage = () => {
  const location = useLocation();
  const {
    user,
    updateUser,
    canRent,
    canList,
    hasBothCapabilities,
    enableCapability,
    setPreferredDashboard,
  } = useAuth();

  const promptCapability = location.state?.promptCapability;

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    country: user?.country || 'NG',
    state: user?.state || '',
    lga: user?.lga || '',
    town: user?.town || '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [capSuccessMsg, setCapSuccessMsg] = useState('');
  const [capLoading, setCapLoading] = useState(false);

  const countries = getCountries();
  const states = getStates(form.country);
  const lgas = getLGAs(form.country, form.state);

  const update = (field, val) => {
    setForm((prev) => {
      const next = { ...prev, [field]: val };
      if (field === 'country') {
        next.state = '';
        next.lga = '';
      }
      if (field === 'state') {
        next.lga = '';
      }
      return next;
    });
    setSuccess(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser(form);
      setSuccess(true);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleCapability = async (capabilityKey, willEnable) => {
    // Prevent disabling both capabilities
    if (!willEnable) {
      if (capabilityKey === 'canRentEquipment' && !canList) {
        alert('You must have at least one active capability on your account.');
        return;
      }
      if (capabilityKey === 'canListEquipment' && !canRent) {
        alert('You must have at least one active capability on your account.');
        return;
      }
    }

    setCapLoading(true);
    setCapSuccessMsg('');
    try {
      if (willEnable) {
        await enableCapability(capabilityKey);
        setCapSuccessMsg(
          capabilityKey === 'canListEquipment'
            ? 'Equipment Owner features enabled! You can now list machinery and access the Owner Dashboard.'
            : 'Farmer features enabled! You can now request rentals and manage farm activities.'
        );
      } else {
        // Disabling capability
        const newCaps = {
          ...user.capabilities,
          [capabilityKey]: false,
        };
        const nextPreferred =
          capabilityKey === 'canListEquipment' ? 'farmer' : 'owner';

        await updateUser({
          capabilities: newCaps,
          preferredDashboard: nextPreferred,
        });
        setCapSuccessMsg('Account capabilities updated.');
      }
    } finally {
      setCapLoading(false);
    }
  };

  const handleDashboardPrefChange = async (pref) => {
    await setPreferredDashboard(pref);
    setCapSuccessMsg(`Default login view updated to ${pref === 'owner' ? 'Owner Dashboard' : 'Farmer Dashboard'}.`);
  };

  const roleBadge = hasBothCapabilities
    ? 'Farmer & Equipment Owner'
    : canList
    ? 'Equipment Owner'
    : 'Farmer';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Account Profile &amp; Preferences
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage your contact information, default location, and enabled roles.
        </p>
      </div>

      {/* Capability Guard Prompt Notification */}
      {promptCapability && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Feature Capability Required</p>
            <p className="text-xs text-amber-800 leading-relaxed">
              You tried accessing a page that requires{' '}
              <strong>
                {promptCapability === 'canListEquipment'
                  ? 'Equipment Owner'
                  : 'Farmer'}
              </strong>{' '}
              features. Enable it with one click below without creating another account!
            </p>
          </div>
        </div>
      )}

      {/* Account Capabilities Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2">
              <Layers size={20} className="text-primary-700" />
              <h2 className="text-base font-bold text-neutral-900">
                Unified Account Capabilities
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              One account, one login, and one profile for both renting and listing equipment.
            </p>
          </div>
          <span className="badge-primary text-xs font-bold">{roleBadge}</span>
        </div>

        {capSuccessMsg && (
          <div className="p-3 bg-green-50 text-green-800 text-xs rounded-2xl border border-green-200 flex items-center gap-2">
            <CheckCircle size={15} className="text-green-600 flex-shrink-0" />
            <span>{capSuccessMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Farmer Capability Tile */}
          <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
            canRent ? 'border-primary-200 bg-primary-50/40' : 'border-neutral-200 bg-neutral-50/50'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-sm text-neutral-900">
                  <User size={18} className="text-primary-700" />
                  <span>Farmer Features</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  canRent ? 'bg-primary-100 text-primary-800' : 'bg-neutral-200 text-neutral-600'
                }`}>
                  {canRent ? 'Active' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                Rent machinery from nearby owners, submit booking requests, and manage farm activity &amp; expense logs.
              </p>
            </div>

            <Button
              variant={canRent ? 'outline' : 'primary'}
              size="sm"
              onClick={() => handleToggleCapability('canRentEquipment', !canRent)}
              loading={capLoading}
              disabled={canRent && !canList}
              className="text-xs w-full justify-center"
            >
              {canRent ? 'Disable Feature' : 'Enable Farmer Features'}
            </Button>
          </div>

          {/* Owner Capability Tile */}
          <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
            canList ? 'border-primary-200 bg-primary-50/40' : 'border-neutral-200 bg-neutral-50/50'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-sm text-neutral-900">
                  <Tractor size={18} className="text-primary-700" />
                  <span>Equipment Owner Features</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  canList ? 'bg-primary-100 text-primary-800' : 'bg-neutral-200 text-neutral-600'
                }`}>
                  {canList ? 'Active' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                Publish machinery listings, set hire prices, receive booking inquiries, and manage rental requests.
              </p>
            </div>

            <Button
              variant={canList ? 'outline' : 'primary'}
              size="sm"
              onClick={() => handleToggleCapability('canListEquipment', !canList)}
              loading={capLoading}
              disabled={canList && !canRent}
              className="text-xs w-full justify-center"
            >
              {canList ? 'Disable Feature' : 'Enable Owner Features'}
            </Button>
          </div>
        </div>

        {/* Default Dashboard Preference */}
        {hasBothCapabilities && (
          <div className="pt-4 border-t border-neutral-100">
            <label className="text-xs font-bold text-neutral-800 block mb-2">
              Default Login Dashboard:
            </label>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 cursor-pointer text-xs font-medium text-neutral-800">
                <input
                  type="radio"
                  name="preferredDashboard"
                  value="farmer"
                  checked={user.preferredDashboard === 'farmer'}
                  onChange={() => handleDashboardPrefChange('farmer')}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span>🌾 Farmer Dashboard (Default)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 cursor-pointer text-xs font-medium text-neutral-800">
                <input
                  type="radio"
                  name="preferredDashboard"
                  value="owner"
                  checked={user.preferredDashboard === 'owner'}
                  onChange={() => handleDashboardPrefChange('owner')}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span>🚜 Owner Dashboard</span>
              </label>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1.5">
              Determines which workspace opens right after signing in. You can still switch views at any time.
            </p>
          </div>
        )}
      </div>

      {/* Personal Info & Location Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-neutral-100">
          <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center text-xl font-black">
            {getInitials(user?.name || 'U')}
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-neutral-500">
                User ID: <code className="font-mono text-neutral-700">{user?.id}</code>
              </span>
              <span className="text-neutral-300">•</span>
              <span className="text-xs text-neutral-400">
                Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {success && (
          <div className="p-3.5 bg-green-50 text-green-800 text-xs rounded-2xl border border-green-200 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" />
            <span>Profile and location updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            id="prof-name"
            label="Full Name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
            leftIcon={<User size={16} />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="prof-phone"
              label="Phone Number"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              required
              leftIcon={<Phone size={16} />}
            />
            <Input
              id="prof-email"
              label="Email Address"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              leftIcon={<Mail size={16} />}
            />
          </div>

          {/* Location for Proximity Matching */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
              <MapPin size={14} className="text-primary-700" />
              <span>Default Geographic Location</span>
            </div>
            <p className="text-[11px] text-neutral-500">
              Used to sort marketplace machinery closest to your farm or storage yard.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Select
                id="prof-country"
                label="Country"
                value={form.country}
                onChange={(e) => update('country', e.target.value)}
                options={countries.map((c) => ({ value: c.code, label: c.name }))}
              />
              <Select
                id="prof-state"
                label="State / Region"
                value={form.state}
                onChange={(e) => update('state', e.target.value)}
                options={states.map((s) => ({ value: s.code, label: s.name }))}
              />
              <Select
                id="prof-lga"
                label="LGA / District"
                value={form.lga}
                onChange={(e) => update('lga', e.target.value)}
                options={lgas.map((l) => ({ value: l.value, label: l.name }))}
                disabled={!form.state}
              />
            </div>

            <Input
              id="prof-town"
              label="Town / Community"
              value={form.town}
              onChange={(e) => update('town', e.target.value)}
              placeholder="e.g. Agodi, Ring Road"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" loading={saving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
