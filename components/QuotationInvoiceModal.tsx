'use client';

import React, { useState } from 'react';
import { CostBreakdown, ClientDetails, Currency } from '@/types/catering';
import { formatCurrency, formatDate } from '@/utils/calculator';
import confetti from 'canvas-confetti';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  Calendar,
  MapPin,
  Mail,
  Phone,
  ChefHat,
  Sparkles,
  Edit3,
} from 'lucide-react';

interface QuotationInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  breakdown: CostBreakdown;
  client: ClientDetails;
  onUpdateClient: (details: Partial<ClientDetails>) => void;
  currency: Currency;
}

export default function QuotationInvoiceModal({
  isOpen,
  onClose,
  breakdown,
  client,
  onUpdateClient,
  currency,
}: QuotationInvoiceModalProps) {
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `
=============================================
CATERING PROPOSAL & QUOTATION: ${client.quotationNumber}
=============================================
Client: ${client.clientName || 'Valued Client'}
Event: ${client.eventName || 'Private Catering Event'} (${client.eventType})
Date: ${formatDate(client.eventDate)} at ${client.eventTime || 'TBD'}
Venue: ${client.venue || 'TBD'}
Guest Count: ${breakdown.guestCount} Attendees

PACKAGE & SERVICES BREAKDOWN:
- Menu Package: ${breakdown.menuTier.name} (${formatCurrency(breakdown.menuCostPerGuest, currency)}/guest) = ${formatCurrency(breakdown.menuTotal, currency)}
- Service Style: ${breakdown.serviceStyle.name} (${formatCurrency(breakdown.serviceStyle.pricePerGuest, currency)}/guest) = ${formatCurrency(breakdown.serviceStyleTotal, currency)}
- Add-ons (${breakdown.selectedAddons.length}): ${formatCurrency(breakdown.addonsTotal, currency)}
- Staffing: ${breakdown.staffing.serversCount} Servers (${breakdown.staffing.eventHours}h shift) = ${formatCurrency(breakdown.staffing.totalStaffCost, currency)}

FINANCIAL SUMMARY:
- Subtotal: ${formatCurrency(breakdown.subtotal, currency)}
- Operations Fee (10%): ${formatCurrency(breakdown.serviceFee, currency)}
- State Catering Tax (8%): ${formatCurrency(breakdown.tax, currency)}
${breakdown.discountPercent > 0 ? `- Promo Discount (${breakdown.discountPercent}%): -${formatCurrency(breakdown.discountAmount, currency)}\n` : ''}
- GRAND TOTAL: ${formatCurrency(breakdown.grandTotal, currency)}
- 25% Deposit Required: ${formatCurrency(breakdown.depositRequired, currency)}
- Average Per Guest: ${formatCurrency(breakdown.costPerGuest, currency)}
=============================================
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJSON = () => {
    const dataToExport = {
      quotationNumber: client.quotationNumber,
      issuedDate: client.issueDate,
      validUntil: client.validUntil,
      client,
      costBreakdown: breakdown,
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Catering-Quotation-${client.quotationNumber}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Action Toolbar (Hidden in Print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm tracking-wide">
              Official Catering Quotation & Invoice
            </span>
            <span className="text-xs bg-indigo-500/30 text-indigo-300 px-2.5 py-0.5 rounded-full font-mono border border-indigo-500/40">
              {client.quotationNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditingClient(!isEditingClient)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingClient ? 'View Invoice' : 'Edit Details'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Area */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-8 bg-white text-slate-900 print:p-0 print:overflow-visible">
          {/* Client Details Edit Panel (Hidden in Print) */}
          {isEditingClient && (
            <div className="print:hidden p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-indigo-600" /> Update Client & Event Parameters
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditingClient(false)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  Done Editing
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Client / Company Name</label>
                  <input
                    type="text"
                    value={client.clientName}
                    onChange={(e) => onUpdateClient({ clientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Acme Corp / Sarah Jenkins"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={client.clientEmail}
                    onChange={(e) => onUpdateClient({ clientEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="sarah@example.com"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={client.clientPhone}
                    onChange={(e) => onUpdateClient({ clientPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="+1 (555) 234-5678"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    value={client.eventName}
                    onChange={(e) => onUpdateClient({ eventName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Annual Gala Dinner"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Date</label>
                  <input
                    type="date"
                    value={client.eventDate}
                    onChange={(e) => onUpdateClient({ eventDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Venue / Staging Location</label>
                  <input
                    type="text"
                    value={client.venue}
                    onChange={(e) => onUpdateClient({ venue: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="The Grand Pavilion, Grand Ballroom"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Printable Invoice Header */}
          <div className="flex flex-wrap items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-900 text-white">
                  <ChefHat className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
                    Apex Culinary & Banquet
                  </h1>
                  <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
                    Artisanal Catering & Executive Hospitality
                  </p>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-600 space-y-0.5">
                <p>742 Evergreen Terrace, Suite 400</p>
                <p>New York, NY 10001 • concierge@apexcatering.com</p>
                <p>Direct: +1 (800) 555-APEX • Lic. #CAT-984421</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-black tracking-widest text-indigo-700 uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                Official Estimate
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">
                {client.quotationNumber}
              </h2>
              <div className="mt-2 text-xs text-slate-500 space-y-0.5">
                <p>
                  <strong>Date Issued:</strong> {formatDate(client.issueDate)}
                </p>
                <p>
                  <strong>Valid Until:</strong> {formatDate(client.validUntil)}
                </p>
                <p>
                  <strong>Currency:</strong> {currency === 'USD' ? 'USD ($)' : 'INR (₹)'}
                </p>
              </div>
            </div>
          </div>

          {/* Client & Event Details 2-Column Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            {/* Column 1: Client Info */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Client Information
              </span>
              <p className="text-sm font-bold text-slate-900">
                {client.clientName || 'Valued Client'}
              </p>
              <p className="text-slate-600 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {client.clientEmail || 'concierge-client@example.com'}
              </p>
              <p className="text-slate-600 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {client.clientPhone || '+1 (555) 234-5678'}
              </p>
            </div>

            {/* Column 2: Event Parameters */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Event Logistics
              </span>
              <p className="text-sm font-bold text-slate-900">
                {client.eventName || 'Private Celebration Gala'}
              </p>
              <p className="text-slate-600 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatDate(client.eventDate)} ({client.eventType})
              </p>
              <p className="text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {client.venue || 'Private Residence / Ballroom'}
              </p>
              <p className="text-indigo-700 font-bold">
                Guest Count: {breakdown.guestCount} Guaranteed Attendees
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Cost & Allocation Itemization
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Line Item / Description</th>
                    <th className="py-3 px-3 text-center">Unit / Pricing Type</th>
                    <th className="py-3 px-3 text-right">Quantity</th>
                    <th className="py-3 px-3 text-right">Unit Rate</th>
                    <th className="py-3 px-4 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {/* Menu Package */}
                  <tr>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{breakdown.menuTier.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {breakdown.menuTier.tagline}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-600">Per Guest</td>
                    <td className="py-3.5 px-3 text-right font-medium">{breakdown.guestCount}</td>
                    <td className="py-3.5 px-3 text-right">
                      {formatCurrency(breakdown.menuCostPerGuest, currency)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(breakdown.menuTotal, currency)}
                    </td>
                  </tr>

                  {/* Service Style */}
                  <tr>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{breakdown.serviceStyle.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {breakdown.serviceStyle.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-600">Per Guest</td>
                    <td className="py-3.5 px-3 text-right font-medium">{breakdown.guestCount}</td>
                    <td className="py-3.5 px-3 text-right">
                      {formatCurrency(breakdown.serviceStyleCostPerGuest, currency)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(breakdown.serviceStyleTotal, currency)}
                    </td>
                  </tr>

                  {/* Add-ons */}
                  {breakdown.selectedAddons.map((item) => (
                    <tr key={item.addon.id}>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.addon.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {item.addon.description}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-600 capitalize">
                        {item.addon.pricingType === 'per_guest' ? 'Per Guest' : 'Flat Event Fee'}
                      </td>
                      <td className="py-3.5 px-3 text-right font-medium">
                        {item.addon.pricingType === 'per_guest' ? breakdown.guestCount : 1}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {formatCurrency(item.unitPrice, currency)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        {formatCurrency(item.totalCost, currency)}
                      </td>
                    </tr>
                  ))}

                  {/* Staffing: Servers */}
                  <tr>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        Catering Server Crew ({breakdown.staffing.serversCount} Staff)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        1:20 ceiling ratio • {breakdown.staffing.eventHours} hours shift duration
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-600">Hourly / Server</td>
                    <td className="py-3.5 px-3 text-right font-medium">
                      {breakdown.staffing.serversCount} × {breakdown.staffing.eventHours} hrs
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {formatCurrency(breakdown.staffing.serverHourlyRate, currency)}/hr
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(breakdown.staffing.serverCost, currency)}
                    </td>
                  </tr>

                  {/* Staffing: Lead Supervisor (if included) */}
                  {breakdown.staffing.supervisorCount > 0 && (
                    <tr>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          Event Floor Supervisor / Maître D&apos;
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Lead event timing & service quality coordinator
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-600">Hourly</td>
                      <td className="py-3.5 px-3 text-right font-medium">
                        {breakdown.staffing.supervisorCount} × {breakdown.staffing.eventHours} hrs
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {formatCurrency(breakdown.staffing.supervisorHourlyRate, currency)}/hr
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        {formatCurrency(breakdown.staffing.supervisorCost, currency)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Summary and Terms Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            {/* Left: Formal Terms & Payment Instructions */}
            <div className="space-y-3 text-xs text-slate-600">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Terms & Conditions
              </h4>
              <ul className="list-disc pl-4 space-y-1.5 text-[11px]">
                <li>
                  A <strong>25% non-refundable security deposit</strong> ({formatCurrency(breakdown.depositRequired, currency)}) is required to secure the event calendar.
                </li>
                <li>
                  Final guest count guarantee must be confirmed <strong>7 calendar days</strong> prior to event date.
                </li>
                <li>
                  State catering tax is calculated at standard <strong>8.0%</strong>.
                </li>
                <li>
                  Payment accepted via Corporate Wire, ACH, Major Credit Cards, or Certified Bank Check.
                </li>
              </ul>

              {/* Signatures */}
              <div className="pt-6 grid grid-cols-2 gap-4">
                <div className="border-t border-slate-300 pt-2 text-[10px] text-slate-500">
                  <div className="h-8" />
                  <p className="font-bold text-slate-800">Client Authorized Signature</p>
                  <p>Date: ________________________</p>
                </div>
                <div className="border-t border-slate-300 pt-2 text-[10px] text-slate-500">
                  <div className="h-8 flex items-end">
                    <span className="font-serif italic text-indigo-700 text-sm">Chef Julian Rossi</span>
                  </div>
                  <p className="font-bold text-slate-800">Executive Director of Catering</p>
                  <p>Apex Hospitality Solutions</p>
                </div>
              </div>
            </div>

            {/* Right: Calculations Summary Box */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal (Food, Service & Crew)</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(breakdown.subtotal, currency)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Operational Coordination Fee (10%)</span>
                <span>{formatCurrency(breakdown.serviceFee, currency)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>State Catering Tax (8%)</span>
                <span>{formatCurrency(breakdown.tax, currency)}</span>
              </div>

              {breakdown.discountPercent > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-semibold">
                  <span>Promotional Discount ({breakdown.discountPercent}%)</span>
                  <span>-{formatCurrency(breakdown.discountAmount, currency)}</span>
                </div>
              )}

              <div className="pt-3 border-t-2 border-slate-900 flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-black text-slate-950 uppercase">
                    Grand Total
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    All-inclusive estimate
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-indigo-900">
                    {formatCurrency(breakdown.grandTotal, currency)}
                  </span>
                  <span className="block text-[11px] font-semibold text-slate-600">
                    ~ {formatCurrency(breakdown.costPerGuest, currency)} / guest
                  </span>
                </div>
              </div>

              {/* Deposit Pill */}
              <div className="mt-3 p-3 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between text-indigo-950 font-bold">
                <span>Initial 25% Deposit Required:</span>
                <span className="text-indigo-700 text-sm">
                  {formatCurrency(breakdown.depositRequired, currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer (Hidden in Print) */}
        <div className="print:hidden px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Ready to lock in this quotation? Print or save as executive PDF.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={triggerConfetti}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors flex items-center gap-1.5"
            >
              🎉 Celebrate
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Quotation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
