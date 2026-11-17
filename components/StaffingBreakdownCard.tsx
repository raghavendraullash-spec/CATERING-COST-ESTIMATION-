'use client';

import React from 'react';
import { StaffingConfig, StaffingCalculation, Currency } from '@/types/catering';
import { formatCurrency } from '@/utils/calculator';
import { Users, Clock, ShieldCheck, UserCheck, Info } from 'lucide-react';

interface StaffingBreakdownCardProps {
  guestCount: number;
  staffing: StaffingCalculation;
  staffingConfig: StaffingConfig;
  onUpdateConfig: (newConfig: Partial<StaffingConfig>) => void;
  currency: Currency;
}

export default function StaffingBreakdownCard({
  guestCount,
  staffing,
  staffingConfig,
  onUpdateConfig,
  currency,
}: StaffingBreakdownCardProps) {
  const hoursOptions = [4, 5, 6, 8];

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-black">
              4
            </span>
            Catering Staff & Operations Ratio
          </h2>
          <p className="text-sm text-slate-500">
            Complies with industry hospitality standards using a strict 1:20 ceiling ratio.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Ceiling Ratio: 1 Server per 20 Guests</span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Guest Count */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Guest Attendance
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{guestCount}</span>
            <span className="text-xs text-slate-500">attendees</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Used as calculation base
          </p>
        </div>

        {/* Metric 2: Required Servers */}
        <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
              Servers Required
            </span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-indigo-700">
              {staffing.serversCount}
            </span>
            <span className="text-xs text-indigo-600 font-semibold">
              {staffing.serversCount === 1 ? 'server' : 'servers'}
            </span>
          </div>
          <p className="text-[11px] text-indigo-600 font-medium mt-1">
            ⌈{guestCount} ÷ 20⌉ ceiling rounded
          </p>
        </div>

        {/* Metric 3: Shift Hours */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Shift Duration
            </span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">
              {staffingConfig.eventHours}
            </span>
            <span className="text-xs text-slate-500">hours</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Setup, service & packdown
          </p>
        </div>

        {/* Metric 4: Total Staffing Cost */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
            Total Staffing Cost
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-amber-900">
              {formatCurrency(staffing.totalStaffCost, currency)}
            </span>
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-1">
            Included in subtotal
          </p>
        </div>
      </div>

      {/* Interactive Shift Duration & Supervisor Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* Shift Duration Controller */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" /> Event Shift Duration
            </label>
            <span className="text-xs font-bold text-slate-900">
              {staffingConfig.eventHours} Hours
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {hoursOptions.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => onUpdateConfig({ eventHours: h })}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                  staffingConfig.eventHours === h
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-100'
                }`}
              >
                {h} hrs
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500">
            Standard shift includes 1 hr pre-event staging + 3 hr event meal service + 1 hr cleanup.
          </p>
        </div>

        {/* Event Supervisor & Lead Coordinator Toggle */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Event Floor Supervisor / Maître D&apos;
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated hospitality lead overseeing banquet timing, kitchen sync, VIP table needs, and server dispatch.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                onUpdateConfig({ includeSupervisor: !staffingConfig.includeSupervisor })
              }
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 shrink-0 ${
                staffingConfig.includeSupervisor ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  staffingConfig.includeSupervisor ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Rate: {formatCurrency(staffingConfig.supervisorRate, currency)}/hr
            </span>
            <span className="font-bold text-slate-900">
              {staffingConfig.includeSupervisor
                ? `${staffing.supervisorCount} Assigned (${formatCurrency(staffing.supervisorCost, currency)})`
                : 'Not Included'}
            </span>
          </div>
        </div>
      </div>

      {/* Explanatory Calculation Formula Box */}
      <div className="rounded-xl bg-slate-100/80 p-3.5 flex items-start gap-2.5 text-xs text-slate-600">
        <Info className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-800">
            Ceiling Calculation Logic:
          </p>
          <p className="text-[11px] leading-relaxed">
            For {guestCount} guests, the engine computes <code>Math.ceil({guestCount} / 20)</code> ={' '}
            <strong>{staffing.serversCount} servers</strong>. At{' '}
            {formatCurrency(staffingConfig.serverHourlyRate, currency)}/hour for {staffingConfig.eventHours} hours,
            base server cost is <strong>{formatCurrency(staffing.serverCost, currency)}</strong>.
            {staffingConfig.includeSupervisor && staffing.supervisorCount > 0 && (
              <> Plus 1 supervisor for <strong>{formatCurrency(staffing.supervisorCost, currency)}</strong>.</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
