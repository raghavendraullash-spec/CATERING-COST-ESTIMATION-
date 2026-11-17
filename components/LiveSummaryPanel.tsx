'use client';

import React from 'react';
import { CostBreakdown, Currency } from '@/types/catering';
import { formatCurrency } from '@/utils/calculator';
import {
  FileText,
  Percent,
  Receipt,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface LiveSummaryPanelProps {
  breakdown: CostBreakdown;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onOpenInvoiceModal: () => void;
  onResetToDefaults: () => void;
  discountPercent: number;
  onDiscountChange: (discount: number) => void;
}

export default function LiveSummaryPanel({
  breakdown,
  currency,
  onCurrencyChange,
  onOpenInvoiceModal,
  onResetToDefaults,
  discountPercent,
  onDiscountChange,
}: LiveSummaryPanelProps) {
  const {
    guestCount,
    menuTier,
    menuTotal,
    serviceStyle,
    serviceStyleTotal,
    selectedAddons,
    addonsTotal,
    staffing,
    subtotal,
    serviceFee,
    tax,
    discountAmount,
    grandTotal,
    costPerGuest,
    depositRequired,
  } = breakdown;

  return (
    <div className="sticky top-6 rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-800 overflow-hidden">
      {/* Top Gradient Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-6 py-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-200" />
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-100">
              Live Quotation Engine
            </h3>
          </div>

          {/* Currency Toggle Switch */}
          <div className="flex items-center bg-slate-900/40 backdrop-blur-md p-1 rounded-full border border-white/20">
            <button
              type="button"
              onClick={() => onCurrencyChange('USD')}
              className={`px-2.5 py-0.5 text-xs font-bold rounded-full transition-all ${
                currency === 'USD'
                  ? 'bg-white text-indigo-950 shadow-sm'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              USD ($)
            </button>
            <button
              type="button"
              onClick={() => onCurrencyChange('INR')}
              className={`px-2.5 py-0.5 text-xs font-bold rounded-full transition-all ${
                currency === 'INR'
                  ? 'bg-white text-indigo-950 shadow-sm'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              INR (₹)
            </button>
          </div>
        </div>

        {/* Grand Total Display */}
        <div className="mt-2">
          <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider block">
            Estimated Grand Total
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {formatCurrency(grandTotal, currency)}
            </span>
          </div>

          {/* Per Guest Pill */}
          <div className="mt-2 flex items-center justify-between text-xs text-indigo-100/90 bg-indigo-950/40 px-3 py-1.5 rounded-xl border border-indigo-400/20">
            <span>Average Cost / Guest:</span>
            <span className="font-bold text-white text-sm">
              {guestCount > 0 ? formatCurrency(costPerGuest, currency) : '$0.00'}
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Real-Time Breakdown */}
      <div className="p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider text-[11px] pb-2 border-b border-slate-800">
          <span>Item Breakdown</span>
          <span>Amount</span>
        </div>

        {/* 1. Menu Tier */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="font-bold text-slate-200">{menuTier.name}</span>
            <span className="block text-[11px] text-slate-400">
              {guestCount} guests × {formatCurrency(menuTier.pricePerGuest, currency)}
            </span>
          </div>
          <span className="font-bold text-slate-100">
            {formatCurrency(menuTotal, currency)}
          </span>
        </div>

        {/* 2. Service Style */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="font-bold text-slate-200">{serviceStyle.name}</span>
            <span className="block text-[11px] text-slate-400">
              {guestCount} guests × {formatCurrency(serviceStyle.pricePerGuest, currency)}
            </span>
          </div>
          <span className="font-bold text-slate-100">
            {formatCurrency(serviceStyleTotal, currency)}
          </span>
        </div>

        {/* 3. Add-ons Summary */}
        <div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200">
              Event Add-ons ({selectedAddons.length})
            </span>
            <span className="font-bold text-slate-100">
              {formatCurrency(addonsTotal, currency)}
            </span>
          </div>
          {selectedAddons.length > 0 && (
            <div className="mt-1 space-y-1 pl-2 border-l border-slate-800">
              {selectedAddons.map((item) => (
                <div key={item.addon.id} className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[180px]">{item.addon.name}</span>
                  <span>{formatCurrency(item.totalCost, currency)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Staffing Total */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="font-bold text-slate-200">
              Staffing ({staffing.serversCount} Servers
              {staffing.supervisorCount > 0 ? ` + ${staffing.supervisorCount} Sup.` : ''})
            </span>
            <span className="block text-[11px] text-slate-400">
              1:20 Ceiling Ratio • {staffing.eventHours}h Shift
            </span>
          </div>
          <span className="font-bold text-slate-100">
            {formatCurrency(staffing.totalStaffCost, currency)}
          </span>
        </div>

        {/* Subtotal Separator */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between font-bold text-slate-200">
            <span>Subtotal</span>
            <span className="text-sm">{formatCurrency(subtotal, currency)}</span>
          </div>

          {/* Operational Coordination Fee */}
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1">
              Operations & Setup (10%)
            </span>
            <span>{formatCurrency(serviceFee, currency)}</span>
          </div>

          {/* 8% Tax as specified in prompt */}
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1">
              State Catering Tax (8%)
            </span>
            <span>{formatCurrency(tax, currency)}</span>
          </div>

          {/* Optional Promotional Discount */}
          {discountPercent > 0 && (
            <div className="flex items-center justify-between text-emerald-400 font-semibold">
              <span>Promotional Discount ({discountPercent}%)</span>
              <span>-{formatCurrency(discountAmount, currency)}</span>
            </div>
          )}
        </div>

        {/* Promo Discount Slider */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-1 text-[11px] text-slate-400">
            <label className="flex items-center gap-1 font-semibold text-slate-300">
              <Percent className="w-3 h-3 text-emerald-400" /> Apply Discount
            </label>
            <span className="font-bold text-emerald-400">{discountPercent}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={25}
            step={5}
            value={discountPercent}
            onChange={(e) => onDiscountChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* 25% Deposit Note */}
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-[11px] text-slate-300 space-y-1">
          <div className="flex items-center justify-between font-bold text-indigo-300">
            <span>Security Deposit (25%):</span>
            <span>{formatCurrency(depositRequired, currency)}</span>
          </div>
          <p className="text-slate-400 text-[10px]">
            Required to lock in kitchen calendar and reserve staging crew.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2 space-y-2">
          <button
            type="button"
            onClick={onOpenInvoiceModal}
            className="w-full group relative py-3.5 px-4 rounded-xl font-black text-sm tracking-wide bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <FileText className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span>Generate Executive Quotation</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          </button>

          <button
            type="button"
            onClick={onResetToDefaults}
            className="w-full py-2 px-3 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Standard Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
}
