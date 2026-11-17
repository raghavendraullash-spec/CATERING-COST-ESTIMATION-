export type Currency = 'USD' | 'INR';

export type MenuTierId = 'standard' | 'premium' | 'royal';

export interface MenuTier {
  id: MenuTierId;
  name: string;
  tagline: string;
  pricePerGuest: number;
  description: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
  sampleMenu: {
    appetizers: string[];
    mains: string[];
    sides: string[];
    desserts: string[];
    beverages: string[];
  };
}

export type ServiceStyleId = 'buffet' | 'plated' | 'boxed';

export interface ServiceStyle {
  id: ServiceStyleId;
  name: string;
  pricePerGuest: number;
  description: string;
  recommendedFor: string;
  badge?: string;
}

export type AddonPricingType = 'per_guest' | 'flat';

export type AddonId =
  | 'beverage_station'
  | 'live_dessert'
  | 'table_decor'
  | 'chef_station'
  | 'late_night_snacks'
  | 'barista_coffee';

export interface AddonItem {
  id: AddonId;
  name: string;
  category: 'beverage' | 'dessert' | 'decor' | 'experience';
  pricingType: AddonPricingType;
  price: number;
  description: string;
  badge?: string;
  iconName: string;
}

export interface StaffingConfig {
  guestToStaffRatio: number; // e.g. 20 (1:20 ceiling ratio)
  serverHourlyRate: number; // e.g. $25/hr
  eventHours: number; // e.g. 5 hours
  includeSupervisor: boolean;
  supervisorRate: number; // e.g. $40/hr
}

export interface StaffingCalculation {
  guestCount: number;
  serversCount: number;
  eventHours: number;
  serverHourlyRate: number;
  serverCost: number;
  supervisorCount: number;
  supervisorHourlyRate: number;
  supervisorCost: number;
  totalStaffCost: number;
}

export interface ClientDetails {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventName: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  notes: string;
  quotationNumber: string;
  issueDate: string;
  validUntil: string;
}

export interface CostBreakdown {
  guestCount: number;
  currency: Currency;
  exchangeRate: number; // 1 USD = X INR
  
  // Menu Tier
  menuTier: MenuTier;
  menuCostPerGuest: number;
  menuTotal: number;

  // Service Style
  serviceStyle: ServiceStyle;
  serviceStyleCostPerGuest: number;
  serviceStyleTotal: number;

  // Addons
  selectedAddons: Array<{
    addon: AddonItem;
    unitPrice: number;
    totalCost: number;
  }>;
  addonsTotal: number;

  // Staffing
  staffing: StaffingCalculation;

  // Subtotals and Final
  foodAndBeverageTotal: number;
  subtotal: number;
  
  // Operational fee
  serviceFeeRate: number; // 10%
  serviceFee: number;

  // Taxes (8%)
  taxRate: number; // 0.08
  tax: number;

  // Discount
  discountPercent: number;
  discountAmount: number;

  // Final totals
  grandTotal: number;
  costPerGuest: number;
  depositRequired: number; // 25%
}

export interface QuotationState {
  guestCount: number;
  selectedTierId: MenuTierId;
  selectedServiceStyleId: ServiceStyleId;
  selectedAddonIds: AddonId[];
  staffingConfig: StaffingConfig;
  currency: Currency;
  discountPercent: number;
  client: ClientDetails;
}

export interface DemoPreset {
  id: string;
  name: string;
  description: string;
  guestCount: number;
  tierId: MenuTierId;
  serviceStyleId: ServiceStyleId;
  addonIds: AddonId[];
  eventType: string;
}
