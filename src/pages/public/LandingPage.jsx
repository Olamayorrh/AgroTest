import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Tractor,
  Search,
  MapPin,
  Calendar,
  CheckCircle,
  TrendingUp,
  ShieldCheck,
  Users,
  Sprout,
  DollarSign,
  PhoneCall,
  ArrowRight,
  Clock,
  Layers,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import EquipmentCard from '../../components/shared/EquipmentCard';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import ScrollReveal from '../../components/ui/ScrollReveal';
import { getCountries, getStates } from '../../data/africaGeo';
import { EQUIPMENT_TYPES } from '../../data/mockData';

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Find Machinery Near You',
    description:
      'Search tractors, harvesters, planters, and pumps by your Local Government Area (LGA) or region to minimize transport logistics and save costs.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Compare Rates & Terms',
    description:
      'See transparent daily, hourly, or per-acre pricing in your local currency. Check whether a skilled operator and implements are included.',
    icon: DollarSign,
  },
  {
    step: '03',
    title: 'Request a Booking',
    description:
      'Select your farm size and preferred rental dates. Send a direct rental request to the owner or request assisted booking via cooperative agents.',
    icon: Calendar,
  },
  {
    step: '04',
    title: 'Manage Your Farm',
    description:
      'Track rental status updates and log your farm operations, planting cycles, and crop expenses all in one simple dashboard.',
    icon: Sprout,
  },
];

const PROBLEM_SOLUTIONS = [
  {
    problem: 'Prohibitive Machinery Costs',
    problemDesc:
      'Purchasing a standard 50-80 HP tractor costs millions of naira—out of reach for over 90% of smallholders and medium farms.',
    solution: 'On-Demand Pay-As-You-Use',
    solutionDesc:
      'Rent machinery only when you need it (per day or per acre) without the heavy burden of capital expenditure and maintenance.',
  },
  {
    problem: 'High Transport & Logistics Costs',
    problemDesc:
      'Moving heavy equipment across state lines can double rental fees due to transport hurdles, bad roads, and haulage delays.',
    solution: 'Hyper-Local Proximity Matching',
    solutionDesc:
      'Discover tractors within your own Local Government Area (LGA) and neighbouring farming clusters for faster delivery and lower haulage fees.',
  },
  {
    problem: 'Paper Records & Lost Expenses',
    problemDesc:
      'Most farmers track land preparation, seed purchases, and machine hours on scraps of paper or memory, losing sight of seasonal profitability.',
    solution: 'Built-in Farm & Expense Tracker',
    solutionDesc:
      'Log activities from ploughing to harvest, record chemical/seed purchases, and see real-time cost summaries right inside AgroShare.',
  },
];

const TRUST_PILLARS = [
  {
    icon: DollarSign,
    title: 'Transparent Pricing',
    description: 'No hidden agent fees or surprise costs. View exact rates per day, acre, or hour upfront.',
  },
  {
    icon: ShieldCheck,
    title: 'Clear Rental Terms',
    description: 'Every listing states operator availability, fuel responsibilities, and attachments clearly.',
  },
  {
    icon: Clock,
    title: 'Real-Time Status Updates',
    description: 'Track your booking from pending request to confirmation, active rental, and completion.',
  },
  {
    icon: Users,
    title: 'Direct Communication',
    description: 'Connect directly with verified equipment owners and local cooperative facilitators.',
  },
];

const LandingPage = () => {
  const { equipment } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Hero Quick Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('NG');

  const countries = getCountries();

  // Featured equipment (take first 3-4 available listings)
  const featuredEquipment = equipment
    .filter((e) => e.availability === 'available')
    .slice(0, 4);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedType) params.set('type', selectedType);
    if (selectedCountry) params.set('country', selectedCountry);
    navigate(`/equipment?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ─────────────────── HERO SECTION ─────────────────── */}
      <section className="relative bg-gradient-to-b from-primary-50/60 via-white to-white pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content — slides in from left */}
            <ScrollReveal direction="left" duration={800} className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100 text-primary-800 text-xs sm:text-sm font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse"></span>
                Empowering African Agriculture
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 leading-[1.15] tracking-tight">
                The Right Equipment.{' '}
                <span className="text-primary-700">The Right Time.</span>{' '}
                <span className="text-secondary-600 block sm:inline">A Better Harvest.</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                AgroShare connects farmers with affordable agricultural machinery in their local community—saving logistics costs while helping equipment owners earn steady income.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link to="/equipment" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" fullWidth leftIcon={<Search size={18} />}>
                    Find Equipment
                  </Button>
                </Link>
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" fullWidth leftIcon={<Tractor size={18} />}>
                    List Your Equipment
                  </Button>
                </Link>
              </div>

              {/* Quick Search Card */}
              <div className="pt-4">
                <form
                  onSubmit={handleHeroSearch}
                  className="bg-white p-3 sm:p-4 rounded-2xl shadow-lg border border-neutral-200/80 flex flex-col md:flex-row gap-3 items-center"
                >
                  <div className="w-full md:flex-1">
                    <label htmlFor="hero-search" className="sr-only">Keywords</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                      <input
                        id="hero-search"
                        type="text"
                        placeholder="Search tractor, harvester, pump, town..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 rounded-xl text-sm border-0 focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-44">
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full py-2.5 px-3 bg-neutral-50 rounded-xl text-sm border-0 focus:ring-2 focus:ring-primary-500 text-neutral-700 font-medium"
                    >
                      <option value="">All Equipment</option>
                      {EQUIPMENT_TYPES.slice(0, 8).map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full md:w-36">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full py-2.5 px-3 bg-neutral-50 rounded-xl text-sm border-0 focus:ring-2 focus:ring-primary-500 text-neutral-700 font-medium"
                    >
                      {countries.map((c) => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <Button type="submit" variant="secondary" size="md" className="w-full md:w-auto">
                    Search
                  </Button>
                </form>
              </div>

              {/* Value metric pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={15} className="text-secondary-500" />
                  Hyper-local LGA proximity
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={15} className="text-secondary-500" />
                  Operator-inclusive options
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={15} className="text-secondary-500" />
                  No high upfront capital
                </span>
              </div>
            </ScrollReveal>

            {/* Right Hero Image Card — slides in from right */}
            <ScrollReveal direction="right" duration={900} delay={150} className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80"
                    alt="African farmer with agricultural tractor"
                    className="w-full h-[400px] object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/20 to-transparent"></div>
                  
                  {/* Floating testimonial badge */}
                  <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                        AO
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-900">Adewale Okonkwo • Maize Farmer</p>
                        <p className="text-xs text-neutral-500">Ibadan North, Oyo State</p>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-700 mt-2 italic leading-relaxed">
                      "I ploughed my 6-acre field in one weekend by renting a John Deere 5055E 8km away. Saved ₦45,000 in haulage alone."
                    </p>
                  </div>
                </div>

                {/* Decorative floating badge */}
                <div className="absolute -top-4 -right-4 bg-accent-400 text-neutral-900 px-4 py-2 rounded-2xl shadow-lg text-xs font-bold flex items-center gap-1.5 border-2 border-white">
                  📍 Proximity Matching Active
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─────────────────── PROBLEM & SOLUTION ─────────────────── */}
      <section className="py-16 sm:py-20 bg-neutral-100/60 border-y border-neutral-200/60">
        <div className="container-custom">
          {/* Section heading — drops in from top */}
          <ScrollReveal direction="down" duration={700} className="text-center max-w-2xl mx-auto mb-14">
            <span className="badge-primary mb-2">Why AgroShare</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              Modernizing Equipment Access for African Agriculture
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-2">
              Addressing the three biggest bottlenecks smallholder and commercial farmers face during planting and harvest seasons.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROBLEM_SOLUTIONS.map((item, idx) => (
              // Cards stagger up from bottom — left, center, right
              <ScrollReveal
                key={idx}
                direction="up"
                duration={700}
                delay={idx * 150}
              >
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 flex flex-col justify-between h-full">
                  <div>
                    <div className="inline-block px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-semibold mb-3">
                      The Problem
                    </div>
                    <h3 className="text-base font-bold text-neutral-900 mb-2">{item.problem}</h3>
                    <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mb-6">
                      {item.problemDesc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 bg-primary-50/50 -mx-6 -mb-6 p-6 rounded-b-3xl">
                    <div className="inline-block px-2.5 py-1 rounded-lg bg-primary-100 text-primary-800 text-xs font-semibold mb-2">
                      AgroShare Solution
                    </div>
                    <h4 className="text-sm font-bold text-primary-900 mb-1">{item.solution}</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {item.solutionDesc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── HOW IT WORKS ─────────────────── */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white">
        <div className="container-custom">
          {/* Heading — from top */}
          <ScrollReveal direction="down" duration={700} className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-primary mb-2">Simple Process</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              How AgroShare Works in 4 Steps
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-2">
              From discovering local machinery to completed farm operations in a seamless workflow.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS_STEPS.map((step, idx) => {
              const Icon = step.icon;
              // Alternate left/right for each step
              const directions = ['left', 'up', 'up', 'right'];
              return (
                <ScrollReveal
                  key={step.step}
                  direction={directions[idx]}
                  duration={700}
                  delay={idx * 120}
                >
                  <div className="relative flex flex-col items-start p-6 rounded-3xl bg-neutral-50 border border-neutral-100 hover:shadow-md transition-shadow h-full">
                    <div className="flex items-center justify-between w-full mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-primary-700 text-white flex items-center justify-center shadow-md">
                        <Icon size={22} />
                      </div>
                      <span className="text-3xl font-black text-neutral-200 tracking-tighter">
                        {step.step}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-neutral-900 mb-2">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal direction="up" duration={600} delay={200} className="text-center mt-12">
            <Link to="/equipment">
              <Button variant="primary" size="md" rightIcon={<ArrowRight size={16} />}>
                Start Browsing Equipment Now
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────── FEATURED MACHINERY ─────────────────── */}
      <section className="py-16 sm:py-20 bg-neutral-50 border-t border-neutral-200/60">
        <div className="container-custom">
          {/* Header row — left title from left, button from right */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <ScrollReveal direction="left" duration={700}>
              <div>
                <span className="badge-primary mb-2">Marketplace Preview</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                  Featured Agricultural Machinery
                </h2>
                <p className="text-sm text-neutral-600 mt-1">
                  Explore verified tractors, planters, and harvesters available for local booking.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" duration={700}>
              <Link to="/equipment">
                <Button variant="outline" size="sm" rightIcon={<ArrowRight size={15} />}>
                  View All Listings ({equipment.length})
                </Button>
              </Link>
            </ScrollReveal>
          </div>

          {/* Equipment cards — staggered up from bottom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEquipment.map((item, idx) => (
              <ScrollReveal
                key={item.id}
                direction="up"
                duration={700}
                delay={idx * 100}
              >
                <EquipmentCard
                  equipment={item}
                  userLocation={user ? { country: user.country, state: user.state, lga: user.lga } : null}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── FARM MANAGEMENT PREVIEW ─────────────────── */}
      <section id="farm-management" className="py-16 sm:py-24 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Description — slides from left */}
            <ScrollReveal direction="left" duration={800} className="lg:col-span-5 space-y-6">
              <span className="badge-primary">Smart Record Keeping</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-snug">
                More Than Rentals: Complete Farm Management
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                Keeping track of seed quantities, chemical applications, tractor rental dates, and labour costs should not be complicated. AgroShare gives farmers an intuitive digital notebook.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  { icon: Sprout, color: 'bg-primary-100 text-primary-700', title: 'Farm & Plot Profiles', desc: 'Record acreage, soil types, and primary crops (maize, cassava, rice, yam).' },
                  { icon: Layers, color: 'bg-secondary-100 text-secondary-700', title: 'Activity Logs', desc: 'Log ploughing, planting, spraying, and harvesting milestones with dates and notes.' },
                  { icon: TrendingUp, color: 'bg-accent-100 text-accent-700', title: 'Automated Expense Summaries', desc: 'Break down seasonal spending across equipment, seeds, fertilizer, and labour.' },
                ].map(({ icon: Icon, color, title, desc }, i) => (
                  <ScrollReveal key={title} direction="left" duration={600} delay={i * 120}>
                    <div className="flex items-start gap-3.5">
                      <div className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-900">{title}</h4>
                        <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <div className="pt-2">
                <Link to="/signup">
                  <Button variant="primary" size="md">
                    Start Managing Your Farm Free
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            {/* Right UI Preview — slides from right */}
            <ScrollReveal direction="right" duration={900} delay={100} className="lg:col-span-7">
              <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-neutral-400 ml-2 font-mono">AgroShare Farm Manager</span>
                  </div>
                  <span className="text-xs bg-primary-800 text-primary-200 px-2.5 py-1 rounded-full font-medium">
                    Demo Farm View
                  </span>
                </div>

                {/* Preview Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  <div className="bg-neutral-800/80 p-3.5 rounded-2xl border border-neutral-700">
                    <p className="text-xs text-neutral-400">Total Farm Size</p>
                    <p className="text-lg font-bold text-white mt-1">8 Acres</p>
                    <p className="text-xs text-secondary-400 mt-0.5">Maize &amp; Cassava</p>
                  </div>
                  <div className="bg-neutral-800/80 p-3.5 rounded-2xl border border-neutral-700">
                    <p className="text-xs text-neutral-400">Total Expenses</p>
                    <p className="text-lg font-bold text-white mt-1">₦65,500</p>
                    <p className="text-xs text-neutral-400 mt-0.5">3 recorded entries</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1 bg-neutral-800/80 p-3.5 rounded-2xl border border-neutral-700">
                    <p className="text-xs text-neutral-400">Completed Operations</p>
                    <p className="text-lg font-bold text-white mt-1">2 / 4</p>
                    <p className="text-xs text-secondary-400 mt-0.5">Ploughing &amp; Planting</p>
                  </div>
                </div>

                {/* Activity list preview */}
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Recent Farm Activities</p>
                  <div className="bg-neutral-800/60 p-3 rounded-xl border border-neutral-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-900/80 text-primary-300 flex items-center justify-center text-xs font-bold">
                        PL
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Planted hybrid maize on 6 acres</p>
                        <p className="text-[11px] text-neutral-400">Planting • Apr 01, 2024</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-accent-300">₦12,000</span>
                  </div>

                  <div className="bg-neutral-800/60 p-3 rounded-xl border border-neutral-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-900/80 text-primary-300 flex items-center justify-center text-xs font-bold">
                        TR
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">First ploughing with hired tractor</p>
                        <p className="text-[11px] text-neutral-400">Ploughing • Mar 20, 2024</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-accent-300">₦35,000</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─────────────────── INCLUSIVE ACCESS (NO SMARTPHONE) ─────────────────── */}
      <section className="py-16 sm:py-20 bg-accent-50/50 border-y border-accent-200/50">
        <div className="container-custom">
          {/* Zoom-in from center */}
          <ScrollReveal direction="zoom" duration={800}>
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-accent-200/80 shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-100 text-neutral-900 text-xs font-bold">
                    <PhoneCall size={14} className="text-neutral-800" />
                    Inclusive Digital Agriculture
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-neutral-900">
                    No Smartphone? You Can Still Access AgroShare.
                  </h2>
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                    We believe every farmer deserves access to modern machinery. In rural communities with limited internet or feature phones, farmers can request bookings through our assisted-booking service or designated cooperative agents.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-4 text-xs text-neutral-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      ✓ Local cooperative support
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      ✓ Voice &amp; SMS booking assistance (Demo)
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      ✓ Direct community coordinator visits
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
                  <Link to="/assisted-booking">
                    <Button variant="secondary" size="lg" fullWidth leftIcon={<PhoneCall size={18} />}>
                      Request Booking Assistance
                    </Button>
                  </Link>
                  <p className="text-[11px] text-neutral-400 text-center">
                    * Note: This is an illustrative assisted-service prototype for demo purposes.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────── FOR EQUIPMENT OWNERS ─────────────────── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Image — from left */}
            <ScrollReveal direction="left" duration={800} className="lg:col-span-6">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1599033329459-cc8c31c7eb6c?w=800&q=80"
                  alt="Modern tractor ready for rent"
                  className="rounded-3xl shadow-xl w-full h-[360px] object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-primary-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow">
                  Earn Up to ₦200,000+/Week
                </div>
              </div>
            </ScrollReveal>

            {/* Text — from right */}
            <ScrollReveal direction="right" duration={800} delay={100} className="lg:col-span-6 space-y-5">
              <span className="badge-primary">For Machine Owners</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight">
                Turn Idle Agricultural Machinery Into Steady Income
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                Tractors and harvesters often sit idle outside of brief personal use windows. List your machinery on AgroShare and receive rental requests from verified farmers right in your LGA.
              </p>

              <ul className="space-y-3 text-sm text-neutral-700">
                {[
                  'Set your own daily, hourly, or per-acre rental prices',
                  'Specify whether your equipment comes with your own operator',
                  'Review and approve rental requests on your own schedule',
                  'Toggle availability instantly during maintenance or personal farm use',
                ].map((point, i) => (
                  <ScrollReveal key={i} direction="right" duration={500} delay={i * 100}>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle size={18} className="text-primary-600 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  </ScrollReveal>
                ))}
              </ul>

              <div className="pt-2">
                <Link to="/signup">
                  <Button variant="primary" size="lg" leftIcon={<Tractor size={18} />}>
                    List Your Equipment Today
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─────────────────── TRUST & SAFETY ─────────────────── */}
      <section className="py-16 sm:py-20 bg-neutral-50 border-t border-neutral-200/60">
        <div className="container-custom">
          {/* Heading — drops from top */}
          <ScrollReveal direction="down" duration={700} className="text-center max-w-2xl mx-auto mb-14">
            <span className="badge-primary mb-2">Trust &amp; Safety Principles</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              Built on Transparency and Accountability
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-2">
              Our proposed platform guidelines ensure peace of mind for both farmers and machine owners.
            </p>
          </ScrollReveal>

          {/* Trust pillars — staggered up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <ScrollReveal
                  key={pillar.title}
                  direction="up"
                  duration={650}
                  delay={idx * 120}
                >
                  <div className="card card-body bg-white border border-neutral-200 h-full">
                    <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-base font-bold text-neutral-900 mb-2">{pillar.title}</h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────── FINAL CTA BANNER ─────────────────── */}
      <section className="py-16 bg-primary-700 text-white relative overflow-hidden">
        <ScrollReveal direction="up" duration={800} className="container-custom text-center relative z-10 max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Transform Your Farming Season?
          </h2>
          <p className="text-base text-primary-100 leading-relaxed">
            Join AgroShare today. Whether you need a tractor for land clearing next week or want to list your equipment to generate additional income, get started in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" fullWidth>
                Create a Free Account
              </Button>
            </Link>
            <Link to="/equipment" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" fullWidth className="text-white border-white hover:bg-white/10">
                Explore Equipment Listings
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default LandingPage;
