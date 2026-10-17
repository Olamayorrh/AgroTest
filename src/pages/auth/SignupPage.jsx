import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, Tractor, Layers, Phone, Mail, Lock, MapPin, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { getCountries, getStates, getLGAs } from '../../data/africaGeo';
import { EQUIPMENT_TYPES } from '../../data/mockData';

const ROLE_CARDS = [
  {
    value: 'farmer',
    icon: User,
    title: 'Rent Equipment',
    subtitle: 'Farmer',
    description: 'Find & rent machinery for my farm.',
    capabilities: { canRentEquipment: true, canListEquipment: false },
    preferredDashboard: 'farmer',
  },
  {
    value: 'owner',
    icon: Tractor,
    title: 'Lease Machinery',
    subtitle: 'Equipment Owner',
    description: 'List equipment & earn rental income.',
    capabilities: { canRentEquipment: false, canListEquipment: true },
    preferredDashboard: 'owner',
  },
  {
    value: 'both',
    icon: Layers,
    title: 'I Want to Do Both',
    subtitle: 'Farmer & Owner',
    description: 'Rent from others AND list my own machines.',
    capabilities: { canRentEquipment: true, canListEquipment: true },
    preferredDashboard: 'farmer',
  },
];

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    country: 'NG',
    state: '',
    lga: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const countries = getCountries();
  const states = getStates(form.country);
  const lgas = getLGAs(form.country, form.state);

  const update = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Reset cascading location fields
      if (field === 'country') { next.state = ''; next.lga = ''; }
      if (field === 'state') { next.lga = ''; }
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setServerError('');
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.role) e.role = 'Please select your account type';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.country) e.country = 'Country is required';
    if (!form.state) e.state = 'State / Region is required';
    if (!form.lga) e.lga = 'LGA / District is required';
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to the terms to continue';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError('');
    try {
      const { confirmPassword, agreeTerms, ...userData } = form;
      const selectedOption = ROLE_CARDS.find((c) => c.value === form.role);
      const userPayload = {
        ...userData,
        capabilities: selectedOption?.capabilities || { canRentEquipment: true, canListEquipment: false },
        preferredDashboard: selectedOption?.preferredDashboard || 'farmer',
      };
      const user = await signup(userPayload);
      const targetDashboard =
        user.preferredDashboard === 'owner' ? '/owner/dashboard' : '/farmer/dashboard';
      navigate(targetDashboard, { replace: true });
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex w-1/2 bg-primary-700 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <img
          src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=75"
          alt="African farmer with tractor"
          className="w-full max-w-sm rounded-3xl object-cover mb-8 shadow-2xl"
          style={{ maxHeight: '260px' }}
          loading="lazy"
        />
        <div className="flex items-center gap-2 mb-3">
          <Leaf size={28} className="text-white" />
          <span className="text-3xl font-bold text-white">AgroShare</span>
        </div>
        <p className="text-primary-200 text-center text-lg font-medium mb-2">
          Share Equipment. Grow More.
        </p>
        <p className="text-primary-300 text-center text-sm max-w-xs leading-relaxed">
          Join thousands of farmers and equipment owners across Nigeria, Ghana, Kenya, and beyond.
        </p>
        <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-xs">
          {[
            { label: 'Equipment Listings', value: '200+' },
            { label: 'Active Farmers', value: '1,200+' },
            { label: 'African Countries', value: '5' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-primary-300 mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-primary-400 mt-6 text-center">
          * Illustrative demo figures only.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-start overflow-y-auto py-8 px-4 sm:px-8">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-primary-700 flex items-center justify-center">
            <Leaf size={20} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-primary-700">Agro</span>
            <span className="text-xl font-bold text-secondary-500">Share</span>
          </div>
        </div>

        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">Create your account</h1>
          <p className="text-sm text-neutral-500 mb-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-700 font-medium hover:underline">
              Sign in
            </Link>
          </p>

          {serverError && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {/* Capability selection */}
            <div>
              <p className="form-label">
                How do you plan to use AgroShare? <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {ROLE_CARDS.map(({ value, icon: Icon, title, subtitle, description }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update('role', value)}
                    className={`
                      p-3.5 rounded-2xl border-2 text-left transition-all duration-150 flex flex-col justify-between
                      ${form.role === value
                        ? 'border-primary-600 bg-primary-50 shadow-xs'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'}
                    `}
                    aria-pressed={form.role === value}
                  >
                    <div>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${
                        form.role === value ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        <Icon size={18} />
                      </div>
                      <span className="text-[10px] font-bold text-primary-700 uppercase tracking-wider block">
                        {subtitle}
                      </span>
                      <p className={`font-bold text-xs sm:text-sm mt-0.5 ${
                        form.role === value ? 'text-primary-900' : 'text-neutral-900'
                      }`}>
                        {title}
                      </p>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-snug">{description}</p>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-neutral-400 mt-1.5">
                Tip: You can always enable the other capability later with 1-click from your profile.
              </p>
              {errors.role && (
                <p className="form-error mt-1">{errors.role}</p>
              )}
            </div>

            {/* Name */}
            <Input
              id="signup-name"
              label="Full Name"
              placeholder="e.g. Adewale Okonkwo"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              error={errors.name}
              required
              leftIcon={<User size={16} />}
            />

            {/* Phone */}
            <Input
              id="signup-phone"
              label="Phone Number"
              type="tel"
              placeholder="+234 or 0801 234 5678"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              error={errors.phone}
              required
              leftIcon={<Phone size={16} />}
              helperText="Used for account recovery and booking contact"
            />

            {/* Email (optional) */}
            <Input
              id="signup-email"
              label="Email Address"
              type="email"
              placeholder="your@email.com (optional)"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              error={errors.email}
              leftIcon={<Mail size={16} />}
            />

            {/* Password */}
            <Input
              id="signup-password"
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              error={errors.password}
              required
              leftIcon={<Lock size={16} />}
            />

            {/* Confirm password */}
            <Input
              id="signup-confirm-password"
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={(e) => update('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              required
              leftIcon={<Lock size={16} />}
            />

            {/* Location — Country */}
            <Select
              id="signup-country"
              label="Country"
              required
              value={form.country}
              onChange={(e) => update('country', e.target.value)}
              error={errors.country}
              placeholder="Select country"
              options={countries.map((c) => ({ value: c.code, label: c.name }))}
            />

            {/* State */}
            <Select
              id="signup-state"
              label="State / Region"
              required
              value={form.state}
              onChange={(e) => update('state', e.target.value)}
              error={errors.state}
              placeholder={form.country ? 'Select state' : 'Select country first'}
              options={states.map((s) => ({ value: s.code, label: s.name }))}
              disabled={!form.country}
            />

            {/* LGA */}
            <Select
              id="signup-lga"
              label="LGA / District / Sub-County"
              required
              value={form.lga}
              onChange={(e) => update('lga', e.target.value)}
              error={errors.lga}
              placeholder={form.state ? 'Select LGA / district' : 'Select state first'}
              options={lgas.map((l) => ({ value: l.value, label: l.name }))}
              disabled={!form.state}
              helperText="Used to show you nearby equipment first"
            />

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                id="signup-terms"
                type="checkbox"
                checked={form.agreeTerms}
                onChange={(e) => update('agreeTerms', e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="signup-terms" className="text-sm text-neutral-600 leading-relaxed">
                I agree to the{' '}
                <a href="/terms" className="text-primary-700 hover:underline font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-primary-700 hover:underline font-medium">
                  Privacy Policy
                </a>
                . I understand this is a demo application.
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="form-error -mt-2">{errors.agreeTerms}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="mt-1"
            >
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
