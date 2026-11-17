import type {
  Currency,
  AddonItem,
  StaffingConfig,
  StaffingCalculation,
  CostBreakdown,
  MenuTierId,
  ServiceStyleId,
  AddonId,
} from '@/types/catering';
import {
  MENU_TIERS,
  SERVICE_STYLES,
  ADDON_ITEMS,
  DEFAULT_STAFFING_CONFIG,
  DEFAULT_EXCHANGE_RATE_USD_TO_INR,
} from '@/data/cateringOptions';

/**
 * Sanitizes input guest count to an integer >= 0.
 * Handles negative numbers, strings, undefined, null, and NaN safely.
 */
export function sanitizeGuestCount(guests: unknown): number {
  if (guests === null || guests === undefined) return 0;
  const num = typeof guests === 'number' ? guests : Number(guests);
  if (isNaN(num) || !isFinite(num)) return 0;
  return Math.max(0, Math.floor(num));
}

/**
 * Computes catering staff requirements based on a 1:20 ceiling ratio.
 * Formula: Math.ceil(guestCount / guestToStaffRatio)
 */
export function calculateStaffing(
  guestCount: number,
  config: Partial<StaffingConfig> = {}
): StaffingCalculation {
  const safeGuests = sanitizeGuestCount(guestCount);
  const ratio = Math.max(1, config.guestToStaffRatio ?? DEFAULT_STAFFING_CONFIG.guestToStaffRatio);
  const serverHourlyRate = Math.max(0, config.serverHourlyRate ?? DEFAULT_STAFFING_CONFIG.serverHourlyRate);
  const eventHours = Math.max(1, config.eventHours ?? DEFAULT_STAFFING_CONFIG.eventHours);
  const includeSupervisor = config.includeSupervisor ?? DEFAULT_STAFFING_CONFIG.includeSupervisor;
  const supervisorRate = Math.max(0, config.supervisorRate ?? DEFAULT_STAFFING_CONFIG.supervisorRate);

  if (safeGuests === 0) {
    return {
      guestCount: 0,
      serversCount: 0,
      eventHours,
      serverHourlyRate,
      serverCost: 0,
      supervisorCount: 0,
      supervisorHourlyRate: supervisorRate,
      supervisorCost: 0,
      totalStaffCost: 0,
    };
  }

  // Ceiling ratio calculation: e.g. 21 guests = 2 servers, 100 guests = 5 servers
  const serversCount = Math.ceil(safeGuests / ratio);
  const serverCost = serversCount * serverHourlyRate * eventHours;

  // 1 Lead Supervisor for events over 25 guests if supervisor is enabled
  const supervisorCount = includeSupervisor ? Math.max(1, Math.ceil(safeGuests / 100)) : 0;
  const supervisorCost = supervisorCount * supervisorRate * eventHours;

  const totalStaffCost = serverCost + supervisorCost;

  return {
    guestCount: safeGuests,
    serversCount,
    eventHours,
    serverHourlyRate,
    serverCost,
    supervisorCount,
    supervisorHourlyRate: supervisorRate,
    supervisorCost,
    totalStaffCost,
  };
}

export interface CalculateCostParams {
  guestCount: number;
  tierId: MenuTierId;
  serviceStyleId: ServiceStyleId;
  addonIds: AddonId[];
  staffingConfig?: Partial<StaffingConfig>;
  currency?: Currency;
  exchangeRate?: number;
  discountPercent?: number;
  serviceFeeRate?: number; // default 0.10 (10%)
  taxRate?: number; // default 0.08 (8%)
}

/**
 * Comprehensive calculator engine handling per-guest multipliers, flat addons,
 * dynamic staffing ratios, 8% tax calculation, service fees, and currency conversions.
 */
export function calculateCateringCost(params: CalculateCostParams): CostBreakdown {
  const safeGuests = sanitizeGuestCount(params.guestCount);
  const currency = params.currency || 'USD';
  const exchangeRate = params.exchangeRate ?? DEFAULT_EXCHANGE_RATE_USD_TO_INR;
  const discountPercent = Math.min(100, Math.max(0, params.discountPercent ?? 0));
  const serviceFeeRate = params.serviceFeeRate ?? 0.10; // 10% operational coordination fee
  const taxRate = params.taxRate ?? 0.08; // 8% tax as specified in requirements

  // Lookup Menu Tier
  const menuTier =
    MENU_TIERS.find((t) => t.id === params.tierId) || MENU_TIERS[0];
  const menuCostPerGuest = menuTier.pricePerGuest;
  const menuTotal = safeGuests * menuCostPerGuest;

  // Lookup Service Style
  const serviceStyle =
    SERVICE_STYLES.find((s) => s.id === params.serviceStyleId) || SERVICE_STYLES[0];
  const serviceStyleCostPerGuest = serviceStyle.pricePerGuest;
  const serviceStyleTotal = safeGuests * serviceStyleCostPerGuest;

  // Calculate Selected Add-ons
  const selectedAddons = (params.addonIds || [])
    .map((addonId) => {
      const addon = ADDON_ITEMS.find((a) => a.id === addonId);
      if (!addon) return null;

      let totalCost = 0;
      if (safeGuests > 0) {
        if (addon.pricingType === 'per_guest') {
          totalCost = safeGuests * addon.price;
        } else {
          totalCost = addon.price;
        }
      }

      return {
        addon,
        unitPrice: addon.price,
        totalCost,
      };
    })
    .filter((item): item is { addon: AddonItem; unitPrice: number; totalCost: number } => item !== null);

  const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.totalCost, 0);

  // Calculate Staffing
  const staffing = calculateStaffing(safeGuests, params.staffingConfig);

  // Food & Beverage total
  const foodAndBeverageTotal = menuTotal + serviceStyleTotal + addonsTotal;

  // Subtotal (Food & Beverage + Staffing)
  const subtotal = foodAndBeverageTotal + staffing.totalStaffCost;

  // Operational Service Fee (10% on subtotal)
  const serviceFee = subtotal * serviceFeeRate;

  // Tax calculation (8% on subtotal)
  const tax = subtotal * taxRate;

  // Promotional Discount
  const discountAmount = (subtotal * discountPercent) / 100;

  // Grand Total
  const grandTotal = Math.max(0, subtotal + serviceFee + tax - discountAmount);

  // Per guest average
  const costPerGuest = safeGuests > 0 ? grandTotal / safeGuests : 0;

  // Required 25% Deposit
  const depositRequired = grandTotal * 0.25;

  return {
    guestCount: safeGuests,
    currency,
    exchangeRate,
    menuTier,
    menuCostPerGuest,
    menuTotal,
    serviceStyle,
    serviceStyleCostPerGuest,
    serviceStyleTotal,
    selectedAddons,
    addonsTotal,
    staffing,
    foodAndBeverageTotal,
    subtotal,
    serviceFeeRate,
    serviceFee,
    taxRate,
    tax,
    discountPercent,
    discountAmount,
    grandTotal,
    costPerGuest,
    depositRequired,
  };
}

/**
 * Currency conversion and formatting utilities for USD ($) and INR (₹).
 */
export function formatCurrency(
  amountInUSD: number,
  targetCurrency: Currency = 'USD',
  exchangeRate: number = DEFAULT_EXCHANGE_RATE_USD_TO_INR
): string {
  const safeAmount = isNaN(amountInUSD) ? 0 : amountInUSD;

  if (targetCurrency === 'INR') {
    const amountInINR = safeAmount * exchangeRate;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(amountInINR));
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeAmount);
}

/**
 * Converts a raw USD amount to the numeric target currency value.
 */
export function convertAmount(
  amountInUSD: number,
  targetCurrency: Currency,
  exchangeRate: number = DEFAULT_EXCHANGE_RATE_USD_TO_INR
): number {
  if (targetCurrency === 'INR') {
    return Math.round(amountInUSD * exchangeRate);
  }
  return Number(amountInUSD.toFixed(2));
}

/**
 * Generates an executive quotation reference ID (e.g., QT-2026-7892).
 */
export function generateQuotationId(suffix?: number): string {
  const code = suffix ?? 8492;
  return `QT-2026-${code}`;
}

/**
 * Formats a date string into readable formal format (e.g., Nov 25, 2026).
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return 'Pending Selection';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}
