import React, { useState } from 'react';
import {
  Sprout,
  DollarSign,
  PlusCircle,
  Calendar,
  Layers,
  TrendingUp,
  Trash2,
  CheckCircle,
  FileText,
  MapPin,
  Tag,
  Coins,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Modal from '../../components/ui/Modal';
import StatCard from '../../components/shared/StatCard';
import { formatDate } from '../../utils/formatters';
import { ACTIVITY_TYPES, EXPENSE_CATEGORIES } from '../../data/mockData';
import { SUPPORTED_CURRENCIES, getCountryCurrency } from '../../data/africaGeo';

const FarmManagementPage = () => {
  const { user } = useAuth();
  const {
    farms,
    activities,
    expenses,
    createActivity,
    createExpense,
    deleteExpense,
  } = useApp();

  const [activeTab, setActiveTab] = useState('activities'); // 'activities' | 'expenses' | 'farm_profile'

  // Modal States
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  // New Activity Form
  const [activityType, setActivityType] = useState(ACTIVITY_TYPES[0]);
  const [activityDate, setActivityDate] = useState(new Date().toISOString().split('T')[0]);
  const [activityDesc, setActivityDesc] = useState('');
  const [activityCost, setActivityCost] = useState('');

  // New Expense Form
  const [expenseCategory, setExpenseCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenseDesc, setExpenseDesc] = useState('');

  const currentFarm =
    farms.find(
      (f) => f.ownerId === user?.id || (user?.id === 'user-farmer-demo' && f.ownerId === 'user-farmer-demo')
    ) || farms[0] || {
      name: 'My Farm Plot',
      size: 5,
      sizeUnit: 'acres',
      mainCrop: 'Maize, Cassava',
      lga: user?.lga || 'Ibadan North',
      state: user?.state || 'Oyo',
      country: user?.country || 'NG',
    };

  // Farm Currency Management
  const initialCurrency = getCountryCurrency(currentFarm.country || user?.country || 'NG');
  const [farmCurrency, setFarmCurrency] = useState(currentFarm.currency || initialCurrency.currency || 'NGN');
  const [farmCurrencySymbol, setFarmCurrencySymbol] = useState(currentFarm.currencySymbol || initialCurrency.symbol || '₦');

  const handleCurrencyChange = (newCode) => {
    setFarmCurrency(newCode);
    const found = SUPPORTED_CURRENCIES.find((c) => c.code === newCode);
    if (found) {
      setFarmCurrencySymbol(found.symbol);
    }
  };

  const userExpenses = expenses.filter(
    (e) => e.userId === user?.id || (user?.id === 'user-farmer-demo' && e.userId === 'user-farmer-demo')
  );
  const activeExpenses = userExpenses.length > 0 ? userExpenses : expenses;

  const userActivities = activities.filter(
    (a) => a.userId === user?.id || (user?.id === 'user-farmer-demo' && a.userId === 'user-farmer-demo')
  );
  const activeActivities = userActivities.length > 0 ? userActivities : activities;

  // Expense calculations
  const totalExpenses = activeExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // Category totals
  const expensesByCategory = activeExpenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!activityDesc.trim()) return;

    await createActivity({
      farmId: currentFarm.id || 'farm-1',
      userId: user?.id,
      type: activityType,
      date: activityDate,
      description: activityDesc.trim(),
      cost: Number(activityCost) || 0,
      currency: farmCurrency,
      currencySymbol: farmCurrencySymbol,
    });

    // Reset
    setActivityDesc('');
    setActivityCost('');
    setActivityModalOpen(false);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseAmount || !expenseDesc.trim()) return;

    await createExpense({
      farmId: currentFarm.id || 'farm-1',
      userId: user?.id,
      category: expenseCategory,
      amount: Number(expenseAmount),
      date: expenseDate,
      description: expenseDesc.trim(),
      currency: farmCurrency,
      currencySymbol: farmCurrencySymbol,
    });

    // Reset
    setExpenseAmount('');
    setExpenseDesc('');
    setExpenseModalOpen(false);
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Delete this expense record?')) {
      await deleteExpense(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Farm Management &amp; Records
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Log operations, maintain farm plot details, and track seasonal farm finances in your local currency.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Farm Currency Selector */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-neutral-200/90 shadow-2xs">
            <Coins size={15} className="text-primary-700 flex-shrink-0" />
            <span className="text-xs font-semibold text-neutral-500">Currency:</span>
            <select
              value={farmCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="text-xs font-bold text-primary-900 bg-transparent focus:outline-none cursor-pointer pr-1"
              title="Select active farm currency"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={() => setExpenseModalOpen(true)}
            leftIcon={<DollarSign size={16} />}
          >
            Record Expense
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => setActivityModalOpen(true)}
            leftIcon={<PlusCircle size={16} />}
          >
            Log Activity
          </Button>
        </div>
      </div>

      {/* Farm Overview Card */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
              <Sprout size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">{currentFarm.name}</h2>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                <MapPin size={13} className="text-primary-600" />
                <span>
                  {currentFarm.lga}, {currentFarm.state} • {farmCurrency} ({farmCurrencySymbol})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold">
              🌱 Size: {currentFarm.size} {currentFarm.sizeUnit || 'acres'}
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-primary-50 text-primary-800 text-xs font-semibold">
              🌾 Main Crop: {currentFarm.mainCrop}
            </div>
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-neutral-50">
            <span className="text-xs text-neutral-400 block">Total Recorded Expenses</span>
            <span className="text-xl font-bold text-neutral-900 mt-1 block">
              {farmCurrencySymbol}{totalExpenses.toLocaleString()}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-50">
            <span className="text-xs text-neutral-400 block">Logged Field Operations</span>
            <span className="text-xl font-bold text-neutral-900 mt-1 block">
              {activeActivities.length} entries
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-50">
            <span className="text-xs text-neutral-400 block">Largest Spending Category</span>
            <span className="text-xl font-bold text-primary-700 mt-1 block truncate">
              {Object.keys(expensesByCategory).sort(
                (a, b) => expensesByCategory[b] - expensesByCategory[a]
              )[0] || 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 pb-2">
        <button
          onClick={() => setActiveTab('activities')}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'activities'
              ? 'bg-primary-700 text-white shadow-sm'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Layers size={16} />
          <span>Field Activity Logs ({activeActivities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'expenses'
              ? 'bg-primary-700 text-white shadow-sm'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <DollarSign size={16} />
          <span>Farm Expenses ({activeExpenses.length})</span>
        </button>
      </div>

      {/* Content depending on active tab */}
      {activeTab === 'activities' && (
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="font-bold text-base text-neutral-900">Activity Timeline</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActivityModalOpen(true)}
              leftIcon={<PlusCircle size={14} />}
            >
              Add Entry
            </Button>
          </div>

          {activeActivities.length > 0 ? (
            <div className="divide-y divide-neutral-100">
              {activeActivities.map((act) => {
                const sym = act.currencySymbol || farmCurrencySymbol;

                return (
                  <div key={act.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        {act.type.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-neutral-900">{act.type}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{act.description}</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">Date: {formatDate(act.date)}</p>
                      </div>
                    </div>
                    {act.cost > 0 && (
                      <span className="font-bold text-neutral-800 text-sm bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-200">
                        {sym}{Number(act.cost).toLocaleString()}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-neutral-400 text-center py-8">
              No farm activities recorded yet. Click "Log Activity" to start tracking.
            </p>
          )}
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Expenses List */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-base text-neutral-900">Expense Records</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpenseModalOpen(true)}
                leftIcon={<DollarSign size={14} />}
              >
                Record Expense
              </Button>
            </div>

            {activeExpenses.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {activeExpenses.map((exp) => {
                  const sym = exp.currencySymbol || farmCurrencySymbol;

                  return (
                    <div key={exp.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                          <Tag size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm text-neutral-900">{exp.category}</p>
                            <span className="text-[11px] text-neutral-400">• {formatDate(exp.date)}</span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-0.5">{exp.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-neutral-900 text-sm">
                          {sym}{Number(exp.amount).toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="text-neutral-300 hover:text-red-500 transition-colors p-1"
                          aria-label="Delete expense"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-neutral-400 text-center py-8">
                No expense entries yet.
              </p>
            )}
          </div>

          {/* Breakdown by Category */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-neutral-900 pb-2 border-b border-neutral-100">
              Spending Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(expensesByCategory).map(([cat, amt]) => {
                const percentage = totalExpenses > 0 ? Math.round((amt / totalExpenses) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-neutral-700">
                      <span>{cat}</span>
                      <span>
                        {farmCurrencySymbol}{amt.toLocaleString()} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── LOG ACTIVITY MODAL ───────────────────────────────────────── */}
      <Modal
        isOpen={activityModalOpen}
        onClose={() => setActivityModalOpen(false)}
        title="Log Farm Field Operation"
      >
        <form onSubmit={handleAddActivity} className="space-y-4">
          <Select
            id="act-type"
            label="Operation Type"
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
            options={ACTIVITY_TYPES.map((t) => ({ value: t, label: t }))}
          />

          <Input
            id="act-date"
            label="Date"
            type="date"
            required
            value={activityDate}
            onChange={(e) => setActivityDate(e.target.value)}
          />

          <Input
            id="act-cost"
            label={`Associated Cost (Optional ${farmCurrencySymbol})`}
            type="number"
            placeholder="e.g. 25000"
            value={activityCost}
            onChange={(e) => setActivityCost(e.target.value)}
          />

          <Textarea
            id="act-desc"
            label="Description / Observations"
            required
            placeholder="e.g. Ploughed 4 acres with tractor hired from Chukwuemeka..."
            value={activityDesc}
            onChange={(e) => setActivityDesc(e.target.value)}
            rows={3}
          />

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActivityModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Activity
            </Button>
          </div>
        </form>
      </Modal>

      {/* ─── ADD EXPENSE MODAL ────────────────────────────────────────── */}
      <Modal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        title="Record Farm Expense"
      >
        <form onSubmit={handleAddExpense} className="space-y-4">
          <Select
            id="exp-cat"
            label="Expense Category"
            value={expenseCategory}
            onChange={(e) => setExpenseCategory(e.target.value)}
            options={EXPENSE_CATEGORIES.map((c) => ({ value: c, label: c }))}
          />

          <Input
            id="exp-amount"
            label={`Amount (${farmCurrencySymbol})`}
            type="number"
            required
            placeholder="e.g. 35000"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
          />

          <Input
            id="exp-date"
            label="Date Incurred"
            type="date"
            required
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
          />

          <Input
            id="exp-desc"
            label="Description / Purpose"
            required
            placeholder="e.g. 2 bags of NPK fertilizer from Ibadan depot"
            value={expenseDesc}
            onChange={(e) => setExpenseDesc(e.target.value)}
          />

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setExpenseModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Expense
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FarmManagementPage;
