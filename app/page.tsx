'use client';

import React, { useState, useMemo } from 'react';
import {
  MenuTierId,
  ServiceStyleId,
  AddonId,
  Currency,
  StaffingConfig,
  ClientDetails,
} from '@/types/catering';
import {
  DEFAULT_STAFFING_CONFIG,
  DEMO_PRESETS,
} from '@/data/cateringOptions';
import {
  calculateCateringCost,
  sanitizeGuestCount,
} from '@/utils/calculator';
import MenuTierSelector from '@/components/MenuTierSelector';
import AddonSelector from '@/components/AddonSelector';
import StaffingBreakdownCard from '@/components/StaffingBreakdownCard';
import LiveSummaryPanel from '@/components/LiveSummaryPanel';
import QuotationInvoiceModal from '@/components/QuotationInvoiceModal';
import {
  Users,
  Utensils,
  FileCheck2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function Home() {
  // Application State
  const [guestCount, setGuestCount] = useState<number>(80);
  const [selectedTierId, setSelectedTierId] = useState<MenuTierId>('premium');
  const [selectedServiceStyleId, setSelectedServiceStyleId] =
    useState<ServiceStyleId>('buffet');
  const [selectedAddonIds, setSelectedAddonIds] = useState<AddonId[]>([
    'beverage_station',
  ]);
  const [staffingConfig, setStaffingConfig] = useState<StaffingConfig>(
    DEFAULT_STAFFING_CONFIG
  );
  const [currency, setCurrency] = useState<Currency>('USD');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Client Details state for Quotation & Invoicing
  const [client, setClient] = useState<ClientDetails>({
    clientName: 'Sarah Montgomery',
    clientEmail: 's.montgomery@luminaevents.com',
    clientPhone: '+1 (555) 749-2810',
    eventName: 'Lumina Annual Executive Gala',
    eventType: 'Corporate Dinner',
    eventDate: '2026-12-15',
    eventTime: '18:30',
    venue: 'The Grand Pavilion Ballroom, 4th Floor',
    notes:
      'Please ensure allergen labeling cards for gluten-free and vegan guests. Staging kitchen access required by 15:00.',
    quotationNumber: 'QT-2026-8492',
    issueDate: '2026-11-15',
    validUntil: '2026-11-29',
  });

  // Real-time calculation engine invocation
  const costBreakdown = useMemo(() => {
    return calculateCateringCost({
      guestCount,
      tierId: selectedTierId,
      serviceStyleId: selectedServiceStyleId,
      addonIds: selectedAddonIds,
      staffingConfig,
      currency,
      discountPercent,
    });
  }, [
    guestCount,
    selectedTierId,
    selectedServiceStyleId,
    selectedAddonIds,
    staffingConfig,
    currency,
    discountPercent,
  ]);

  // Handler for Add-on toggling
  const handleToggleAddon = (id: AddonId) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handler for Updating Staffing Configuration
  const handleUpdateStaffing = (newConfig: Partial<StaffingConfig>) => {
    setStaffingConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Handler for Updating Client Details
  const handleUpdateClient = (details: Partial<ClientDetails>) => {
    setClient((prev) => ({ ...prev, ...details }));
  };

  // Handler for loading Demo Presets
  const handleLoadPreset = (presetId: string) => {
    const preset = DEMO_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setActivePresetId(preset.id);
    setGuestCount(preset.guestCount);
    setSelectedTierId(preset.tierId);
    setSelectedServiceStyleId(preset.serviceStyleId);
    setSelectedAddonIds(preset.addonIds);
    setClient((prev) => ({
      ...prev,
      eventName: preset.name,
      eventType: preset.eventType,
    }));
  };

  // Reset to default configuration
  const handleReset = () => {
    setGuestCount(80);
    setSelectedTierId('premium');
    setSelectedServiceStyleId('buffet');
    setSelectedAddonIds(['beverage_station']);
    setStaffingConfig(DEFAULT_STAFFING_CONFIG);
    setDiscountPercent(0);
    setActivePresetId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation & Brand Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 flex items-center gap-2">
                Apex Catering Engine
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  v2.4 Live
                </span>
              </span>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Real-Time Banquet Cost Estimation & Executive Quotation Builder
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency Pill */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  currency === 'USD'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  currency === 'INR'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                INR (₹)
              </button>
            </div>

            {/* Quick Quotation Modal CTA */}
            <button
              type="button"
              onClick={() => setIsInvoiceModalOpen(true)}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <FileCheck2 className="w-4 h-4" />
              <span className="hidden sm:inline">View Quotation</span>
              <span className="sm:hidden">Invoice</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero & Preset Quick Switcher */}
        <section className="mb-8">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
            {/* Background Decorative Glow */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
            <div className="absolute left-1/2 top-0 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold mb-3 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Interactive Cost Modeling & Invoicing</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Calculate Banquet & Event Costs With Surgical Accuracy
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
                Dynamically adjust guest counts, explore chef menu tiers ($15–$40/guest), test service styles ($2–$7/guest), auto-scale servers with 1:20 ceiling ratio, and print ready-to-sign executive quotations.
              </p>

              {/* Demo Presets Chips */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Load Pre-Configured Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  {DEMO_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleLoadPreset(preset.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        activePresetId === preset.id
                          ? 'bg-indigo-500 text-white font-bold ring-2 ring-indigo-300'
                          : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10'
                      }`}
                    >
                      <span>{preset.name}</span>
                      <span className="text-[10px] opacity-75">
                        ({preset.guestCount}p)
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Configuration Form (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Guest Count Card */}
            <section className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-7 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600 text-white text-sm font-black">
                      <Users className="w-4 h-4" />
                    </span>
                    Guest Attendance Count
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Real-time per-guest multipliers and staffing ratios recalculate instantly.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={2000}
                      value={guestCount}
                      onChange={(e) => {
                        const val = sanitizeGuestCount(e.target.value);
                        setGuestCount(val);
                        setActivePresetId(null);
                      }}
                      className="w-28 text-center text-xl font-extrabold px-3 py-2 rounded-xl border-2 border-indigo-500 bg-indigo-50/50 text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block text-center mt-1">
                      Attendees
                    </span>
                  </div>
                </div>
              </div>

              {/* Slider Controller */}
              <div className="space-y-3 pt-2">
                <input
                  type="range"
                  min={0}
                  max={500}
                  step={5}
                  value={guestCount}
                  onChange={(e) => {
                    setGuestCount(Number(e.target.value));
                    setActivePresetId(null);
                  }}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />

                <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                  <span>0 Guests</span>
                  <span>100</span>
                  <span>250</span>
                  <span>500+ Guests</span>
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 mr-1">
                  Quick Counts:
                </span>
                {[25, 50, 80, 120, 200, 350].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      setGuestCount(count);
                      setActivePresetId(null);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                      guestCount === count
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {count}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setGuestCount((prev) => prev + 25)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors ml-auto"
                >
                  +25 More
                </button>
              </div>

              {/* Edge Case Warning if Guest Count is 0 */}
              {guestCount === 0 && (
                <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    Guest count is currently set to <strong>0</strong>. Multipliers and staffing are zeroed out. Enter guest attendance to see live estimates.
                  </span>
                </div>
              )}
            </section>

            {/* Step 1 & 2: Menu Tiers & Service Style Selector */}
            <section className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-7 shadow-sm">
              <MenuTierSelector
                selectedTierId={selectedTierId}
                onSelectTier={(id) => {
                  setSelectedTierId(id);
                  setActivePresetId(null);
                }}
                selectedServiceStyleId={selectedServiceStyleId}
                onSelectServiceStyle={(id) => {
                  setSelectedServiceStyleId(id);
                  setActivePresetId(null);
                }}
                currency={currency}
                guestCount={guestCount}
              />
            </section>

            {/* Step 3: Event Add-ons */}
            <section className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-7 shadow-sm">
              <AddonSelector
                selectedAddonIds={selectedAddonIds}
                onToggleAddon={(id) => {
                  handleToggleAddon(id);
                  setActivePresetId(null);
                }}
                currency={currency}
                guestCount={guestCount}
              />
            </section>

            {/* Step 4: Staffing Breakdown Card with 1:20 Ceiling Ratio */}
            <section>
              <StaffingBreakdownCard
                guestCount={guestCount}
                staffing={costBreakdown.staffing}
                staffingConfig={staffingConfig}
                onUpdateConfig={handleUpdateStaffing}
                currency={currency}
              />
            </section>
          </div>

          {/* Right Column: Sticky Live Summary Panel (4 Cols) */}
          <aside className="lg:col-span-4">
            <LiveSummaryPanel
              breakdown={costBreakdown}
              currency={currency}
              onCurrencyChange={setCurrency}
              onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)}
              onResetToDefaults={handleReset}
              discountPercent={discountPercent}
              onDiscountChange={setDiscountPercent}
            />
          </aside>
        </div>
      </main>

      {/* Quotation & Executive Printable Invoice Modal */}
      <QuotationInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        breakdown={costBreakdown}
        client={client}
        onUpdateClient={handleUpdateClient}
        currency={currency}
      />

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Apex Catering Cost Engine • 1:20 Ceiling Ratio • 8% Tax Model Compliant</span>
          </div>
          <p>© 2026 Apex Hospitality Group. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
