import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PhoneCall,
  Users,
  CheckCircle,
  HelpCircle,
  MapPin,
  Tractor,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import { getCountries, getStates, getLGAs } from '../../data/africaGeo';
import { EQUIPMENT_TYPES } from '../../data/mockData';

const ASSISTANCE_CHANNELS = [
  { value: 'phone_call', label: 'Direct Phone Callback (Audio Call)' },
  { value: 'whatsapp', label: 'WhatsApp Voice Note / Message' },
  { value: 'agent_visit', label: 'Local Cooperative Agent Visit' },
];

const AssistedBookingPage = () => {
  const { createAssistedRequest } = useApp();

  const [form, setForm] = useState({
    farmerName: '',
    phone: '',
    country: 'NG',
    state: '',
    lga: '',
    community: '',
    equipmentType: EQUIPMENT_TYPES[0],
    preferredDate: '',
    farmSize: '',
    channel: 'phone_call',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

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
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.farmerName.trim() || !form.phone.trim() || !form.state || !form.lga) {
      setError('Please provide your name, phone number, and local government location.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await createAssistedRequest({
        ...form,
        createdAt: new Date().toISOString(),
      });
      setSuccessData(res);
    } catch (err) {
      setError(err.message || 'Failed to submit assisted booking request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-custom py-10 max-w-4xl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-700 text-white rounded-3xl p-6 sm:p-10 mb-8 shadow-md">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-primary-100 text-xs font-semibold backdrop-blur-sm">
            <PhoneCall size={14} />
            Proposed Community Service (Demo)
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Assisted Equipment Booking
          </h1>
          <p className="text-sm sm:text-base text-primary-100 leading-relaxed">
            No smartphone or struggling with internet access? A participating cooperative agent or service representative can facilitate your machinery hire over the phone.
          </p>
        </div>
      </div>

      {successData ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/90 shadow-sm text-center max-w-2xl mx-auto space-y-5">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">
            Assistance Request Received!
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Thank you, <strong>{form.farmerName}</strong>. Your request for a{' '}
            <strong>{form.equipmentType}</strong> in <strong>{form.lga}, {form.state}</strong> has been logged in our demo network.
          </p>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-700 max-w-md mx-auto text-left space-y-1 font-mono">
            <p><strong>Tracking Ref:</strong> {successData.id}</p>
            <p><strong>Contact Phone:</strong> {form.phone}</p>
            <p><strong>Preferred Contact:</strong> {ASSISTANCE_CHANNELS.find((c) => c.value === form.channel)?.label}</p>
          </div>

          <p className="text-xs text-neutral-400">
            * In the actual platform, a cooperative representative or certified local field agent will contact you within 24 hours to confirm tractor availability and delivery details.
          </p>

          <div className="pt-4 flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setSuccessData(null);
                setForm({
                  farmerName: '',
                  phone: '',
                  country: 'NG',
                  state: '',
                  lga: '',
                  community: '',
                  equipmentType: EQUIPMENT_TYPES[0],
                  preferredDate: '',
                  farmSize: '',
                  channel: 'phone_call',
                  notes: '',
                });
              }}
            >
              Submit Another Request
            </Button>
            <Link to="/equipment">
              <Button variant="primary">
                Browse Marketplace
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900 mb-1">
              Request Agent or Phone Assistance
            </h2>
            <p className="text-xs text-neutral-500 mb-6">
              Fill in your details below and an agent will assist with finding the nearest machine.
            </p>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="as-name"
                label="Your Full Name"
                placeholder="e.g. Adewale Okonkwo"
                required
                value={form.farmerName}
                onChange={(e) => update('farmerName', e.target.value)}
              />

              <Input
                id="as-phone"
                label="Phone Number (for call or SMS)"
                type="tel"
                placeholder="e.g. 0801 234 5678"
                required
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
              />

              {/* Geographic Cascading Location */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-3">
                <p className="text-xs font-bold text-neutral-800">
                  📍 Where is your farm located?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Select
                    id="as-country"
                    label="Country"
                    value={form.country}
                    onChange={(e) => update('country', e.target.value)}
                    options={countries.map((c) => ({ value: c.code, label: c.name }))}
                  />
                  <Select
                    id="as-state"
                    label="State / Region"
                    value={form.state}
                    onChange={(e) => update('state', e.target.value)}
                    options={states.map((s) => ({ value: s.code, label: s.name }))}
                  />
                  <Select
                    id="as-lga"
                    label="LGA / District"
                    value={form.lga}
                    onChange={(e) => update('lga', e.target.value)}
                    options={lgas.map((l) => ({ value: l.value, label: l.name }))}
                    disabled={!form.state}
                  />
                </div>
                <Input
                  id="as-comm"
                  label="Town / Village / Landmark"
                  placeholder="e.g. Agodi, Moniya, Omi Adio"
                  value={form.community}
                  onChange={(e) => update('community', e.target.value)}
                />
              </div>

              {/* Machinery requirements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  id="as-type"
                  label="Machinery Needed"
                  value={form.equipmentType}
                  onChange={(e) => update('equipmentType', e.target.value)}
                  options={EQUIPMENT_TYPES.map((t) => ({ value: t, label: t }))}
                />

                <Input
                  id="as-size"
                  label="Estimated Land Size"
                  placeholder="e.g. 3 acres / 1 hectare"
                  value={form.farmSize}
                  onChange={(e) => update('farmSize', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  id="as-date"
                  label="Target Operation Date"
                  type="date"
                  value={form.preferredDate}
                  onChange={(e) => update('preferredDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />

                <Select
                  id="as-channel"
                  label="How should we contact you?"
                  value={form.channel}
                  onChange={(e) => update('channel', e.target.value)}
                  options={ASSISTANCE_CHANNELS}
                />
              </div>

              <Textarea
                id="as-notes"
                label="Any specific requirements?"
                placeholder="Mention if you require a driver/operator, specialized attachments, or need help on a specific crop..."
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                rows={3}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={submitting}
                className="mt-2"
              >
                Submit Assistance Request
              </Button>
            </form>
          </div>

          {/* Right Column: How assisted booking works */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-neutral-900 pb-2 border-b border-neutral-100">
                How It Works
              </h3>
              <div className="space-y-3 text-xs text-neutral-600">
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-800 font-bold flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <p>You submit your location and equipment requirement using this form or via phone.</p>
                </div>
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-800 font-bold flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <p>A participating local agent checks equipment registered within your LGA.</p>
                </div>
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-800 font-bold flex items-center justify-center flex-shrink-0">
                    3
                  </span>
                  <p>The agent negotiates timing with the machine owner and calls you to confirm rental details.</p>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 rounded-3xl p-5 border border-primary-200 text-xs text-primary-900 space-y-2">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-primary-700" />
                Community Notice
              </p>
              <p className="leading-relaxed">
                AgroShare does not charge farmers an advance booking fee for assisted requests. Payment terms are agreed upon direct delivery of the machinery.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistedBookingPage;
