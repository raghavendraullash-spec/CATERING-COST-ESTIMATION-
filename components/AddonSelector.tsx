'use client';

import React from 'react';
import { AddonId, Currency } from '@/types/catering';
import { ADDON_ITEMS } from '@/data/cateringOptions';
import { formatCurrency } from '@/utils/calculator';
import {
  GlassWater,
  Sparkles,
  Flower2,
  Flame,
  UtensilsCrossed,
  Coffee,
  Check,
} from 'lucide-react';

interface AddonSelectorProps {
  selectedAddonIds: AddonId[];
  onToggleAddon: (id: AddonId) => void;
  currency: Currency;
  guestCount: number;
}

export default function AddonSelector({
  selectedAddonIds,
  onToggleAddon,
  currency,
  guestCount,
}: AddonSelectorProps) {
  const getAddonIcon = (iconName: string) => {
    switch (iconName) {
      case 'GlassWater':
        return <GlassWater className="w-5 h-5 text-sky-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'Flower2':
        return <Flower2 className="w-5 h-5 text-rose-500" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-5 h-5 text-emerald-500" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-amber-700" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-500" />;
    }
  };

  const selectedCount = selectedAddonIds.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-black">
              3
            </span>
            Event Enhancements & Add-ons
          </h2>
          <p className="text-sm text-slate-500">
            Customize your event with interactive live stations, beverage packages, and decor.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            {selectedCount} {selectedCount === 1 ? 'Add-on' : 'Add-ons'} Selected
          </span>
        </div>
      </div>

      {/* Grid of Add-on Cards with Toggle Switches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ADDON_ITEMS.map((addon) => {
          const isSelected = selectedAddonIds.includes(addon.id);
          const isPerGuest = addon.pricingType === 'per_guest';
          const calculatedCost = isPerGuest ? addon.price * guestCount : addon.price;

          return (
            <div
              key={addon.id}
              onClick={() => onToggleAddon(addon.id)}
              className={`p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 bg-white shadow-md shadow-indigo-100 ring-2 ring-indigo-500/10'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl transition-colors ${
                        isSelected ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'bg-slate-100'
                      }`}
                    >
                      {getAddonIcon(addon.iconName)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm md:text-base leading-tight">
                        {addon.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isPerGuest
                              ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                              : 'bg-purple-50 text-purple-700 border border-purple-200/60'
                          }`}
                        >
                          {isPerGuest ? 'Per Guest' : 'Flat Event Fee'}
                        </span>
                        {addon.badge && (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            {addon.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Accessible iOS style toggle switch */}
                  <div
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 shrink-0 ${
                      isSelected ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 flex items-center justify-center ${
                        isSelected ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-indigo-600 stroke-[3]" />}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {addon.description}
                </p>
              </div>

              {/* Bottom Price Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-sm font-extrabold text-slate-900">
                    {formatCurrency(addon.price, currency)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {isPerGuest ? ' / guest' : ' total flat'}
                  </span>
                </div>

                {isSelected && guestCount > 0 && (
                  <div className="text-right">
                    <span className="text-xs font-bold text-indigo-700">
                      +{formatCurrency(calculatedCost, currency)}
                    </span>
                    {isPerGuest && (
                      <span className="block text-[10px] text-slate-400">
                        ({guestCount} × {formatCurrency(addon.price, currency)})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
