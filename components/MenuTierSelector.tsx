'use client';

import React, { useState } from 'react';
import { MenuTierId, ServiceStyleId, Currency } from '@/types/catering';
import { MENU_TIERS, SERVICE_STYLES } from '@/data/cateringOptions';
import { formatCurrency } from '@/utils/calculator';
import {
  Check,
  Sparkles,
  Crown,
  Utensils,
  ChevronDown,
  ChevronUp,
  Flame,
  Soup,
  Coffee,
  CheckCircle2,
} from 'lucide-react';

interface MenuTierSelectorProps {
  selectedTierId: MenuTierId;
  onSelectTier: (id: MenuTierId) => void;
  selectedServiceStyleId: ServiceStyleId;
  onSelectServiceStyle: (id: ServiceStyleId) => void;
  currency: Currency;
  guestCount: number;
}

export default function MenuTierSelector({
  selectedTierId,
  onSelectTier,
  selectedServiceStyleId,
  onSelectServiceStyle,
  currency,
  guestCount,
}: MenuTierSelectorProps) {
  const [expandedTierId, setExpandedTierId] = useState<MenuTierId | null>('premium');

  const toggleSampleMenu = (tierId: MenuTierId, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTierId(expandedTierId === tierId ? null : tierId);
  };

  const getTierIcon = (id: MenuTierId) => {
    switch (id) {
      case 'royal':
        return <Crown className="w-5 h-5 text-amber-500" />;
      case 'premium':
        return <Sparkles className="w-5 h-5 text-indigo-500" />;
      default:
        return <Utensils className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Menu Tier Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-black">
                1
              </span>
              Select Menu Package
            </h2>
            <p className="text-sm text-slate-500">
              Curated by executive chefs. Prices scale per guest.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {guestCount > 0 ? `${guestCount} Guests Selected` : 'Enter Guest Count'}
          </span>
        </div>

        {/* 3 Tier Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-4">
          {MENU_TIERS.map((tier) => {
            const isSelected = selectedTierId === tier.id;
            const isExpanded = expandedTierId === tier.id;
            const packageTotal = tier.pricePerGuest * guestCount;

            return (
              <div
                key={tier.id}
                onClick={() => onSelectTier(tier.id)}
                className={`group relative rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-100/60 ring-2 ring-indigo-500/20 translate-y-[-2px]'
                    : 'border-slate-200 bg-white/80 hover:border-slate-300 hover:shadow-md hover:bg-white'
                }`}
              >
                {/* Popular or Luxury Badge */}
                {tier.badge && (
                  <div
                    className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[11px] font-bold tracking-wider uppercase ${
                      tier.id === 'premium'
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
                        : tier.id === 'royal'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold shadow-sm'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {tier.badge}
                  </div>
                )}

                <div className="p-6">
                  {/* Top Bar with Icon and Title */}
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className={`p-2 rounded-xl transition-colors ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                      }`}
                    >
                      {getTierIcon(tier.id)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {tier.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">
                        {tier.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Pricing Display */}
                  <div className="my-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                          {formatCurrency(tier.pricePerGuest, currency)}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          / guest
                        </span>
                      </div>
                      {guestCount > 0 && (
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Total for food: <strong className="text-slate-800">{formatCurrency(packageTotal, currency)}</strong>
                        </p>
                      )}
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 bg-white group-hover:border-indigo-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {tier.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Included In This Package
                    </p>
                    <ul className="space-y-2">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2
                            className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                              isSelected ? 'text-indigo-600' : 'text-slate-400'
                            }`}
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sample Menu Expander */}
                <div className="px-6 pb-5 pt-2 border-t border-slate-100 bg-slate-50/60 mt-auto">
                  <button
                    type="button"
                    onClick={(e) => toggleSampleMenu(tier.id, e)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-indigo-700 hover:text-indigo-900 py-1 transition-colors"
                  >
                    <span>{isExpanded ? 'Hide Sample Menu Items' : 'Preview Sample Menu Items'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-200/70 text-[11px] space-y-2.5 animate-fadeIn">
                      <div>
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Flame className="w-3 h-3 text-amber-500" /> Signature Mains:
                        </span>
                        <p className="text-slate-600 pl-4 mt-0.5">
                          {tier.sampleMenu.mains.join(' • ')}
                        </p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Soup className="w-3 h-3 text-emerald-500" /> Starters & Sides:
                        </span>
                        <p className="text-slate-600 pl-4 mt-0.5">
                          {[...tier.sampleMenu.appetizers, ...tier.sampleMenu.sides].slice(0, 3).join(' • ')}
                        </p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Coffee className="w-3 h-3 text-violet-500" /> Desserts & Drinks:
                        </span>
                        <p className="text-slate-600 pl-4 mt-0.5">
                          {[...tier.sampleMenu.desserts, ...tier.sampleMenu.beverages].join(' • ')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Style Selection */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 text-xs font-black">
                2
              </span>
              Choose Service & Delivery Style
            </h3>
            <p className="text-xs text-slate-500">
              Select how food will be staged and served to guests during your event.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SERVICE_STYLES.map((style) => {
            const isSelected = selectedServiceStyleId === style.id;
            return (
              <div
                key={style.id}
                onClick={() => onSelectServiceStyle(style.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-slate-900">{style.name}</span>
                    <span className="text-xs font-extrabold text-indigo-700">
                      +{formatCurrency(style.pricePerGuest, currency)}
                      <span className="text-[10px] text-slate-500 font-normal"> /guest</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">
                    {style.description}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {style.recommendedFor.split(',')[0]}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
