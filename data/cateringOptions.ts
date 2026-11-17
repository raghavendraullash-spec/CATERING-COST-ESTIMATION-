import { MenuTier, ServiceStyle, AddonItem, DemoPreset, StaffingConfig } from '@/types/catering';

export const DEFAULT_EXCHANGE_RATE_USD_TO_INR = 83.5;

export const DEFAULT_STAFFING_CONFIG: StaffingConfig = {
  guestToStaffRatio: 20, // 1 staff per 20 guests (ceiling ratio)
  serverHourlyRate: 25, // $25 per hour
  eventHours: 5, // 5 hour standard shift (including setup/service/cleanup)
  includeSupervisor: true,
  supervisorRate: 40, // $40 per hour for lead maitre d'/event supervisor
};

export const MENU_TIERS: MenuTier[] = [
  {
    id: 'standard',
    name: 'Standard Package',
    tagline: 'Wholesome, classic flavors for gatherings & celebrations',
    pricePerGuest: 15,
    badge: 'Value Choice',
    isPopular: false,
    description:
      'A hearty, freshly crafted menu delivering high culinary satisfaction without blowing your event budget. Perfect for family reunions, corporate lunches, and casual parties.',
    features: [
      '2 Passed Starter Finger Foods',
      '2 Flavorful Main Entrées',
      '2 Savory Side Dishes & Salads',
      'Artisan Dinner Rolls & Whipped Herb Butter',
      'Classic Gourmet Dessert Tray',
      'Chilled Lemonade & Citrus Infused Water',
    ],
    sampleMenu: {
      appetizers: ['Crispy Bruschetta with Basil & Balsamic Glaze', 'Mini Spinach & Feta Phyllo Triangles'],
      mains: ['Herb-Roasted Rosemary Chicken Breast', 'Penne alla Vodka with Sun-Dried Tomatoes (V)'],
      sides: ['Roasted Garlic Smashed Red Potatoes', 'Garden Medley Salad with Honey Mustard Vinaigrette'],
      desserts: ['Fudge Chocolate Brownie Bites', 'Vanilla Bean Panna Cotta Shooters'],
      beverages: ['Sparkling Citrus Infused Water', 'Old-Fashioned Lemonade'],
    },
  },
  {
    id: 'premium',
    name: 'Premium Feast',
    tagline: 'Chef-curated culinary excellence with dual protein mains',
    pricePerGuest: 25,
    badge: 'Most Popular',
    isPopular: true,
    description:
      'Our most requested experience. Elevate your event with artisanal flavors, prime meat & seafood options, vibrant seasonal salads, and handcrafted duo dessert pairings.',
    features: [
      '4 Hot & Cold Canapés & Tapas',
      '3 Signature Chef Entrées (Meat, Seafood, Vegetarian)',
      '3 Gourmet Sides & Organic Field Greens Bar',
      'Warm Rosemary Focaccia & Truffle Olive Oil',
      '2 Decadent Dessert Showpieces',
      'Artisan Iced Tea & Fresh Fruit Spritzers',
    ],
    sampleMenu: {
      appetizers: [
        'Seared Beef Tenderloin Crostini with Horseradish Aioli',
        'Smoked Salmon Blinis with Dill Crème Fraîche',
        'Wild Mushroom & Fontina Arancini',
        'Caprese Skewers with Aged Modenese Glaze',
      ],
      mains: [
        'Pan-Seared Atlantic Salmon with Citrus Beurre Blanc',
        'Braised Beef Short Ribs with Red Wine Reduction',
        'Truffle Wild Mushroom Risotto (V)',
      ],
      sides: [
        'Grilled Asparagus with Shaved Parmesan',
        'Yukon Gold Truffle Potato Puree',
        'Arugula, Pear, and Candied Walnut Salad',
      ],
      desserts: ['New York Style Mini Cheesecakes with Berry Coulis', 'Belgian Dark Chocolate Mousse Cups'],
      beverages: ['White Peach Iced Tea', 'Cucumber-Mint Limeade Spritzer'],
    },
  },
  {
    id: 'royal',
    name: 'Royal Banquet',
    tagline: 'Opulent multi-course masterworks for high-profile galas',
    pricePerGuest: 40,
    badge: 'Luxury Experience',
    isPopular: false,
    description:
      'An uncompromising multi-course gastronomic journey. Featuring prime reserve cuts, lobster, artisan cheeses, interactive plating presentations, and gold-leaf pastry desserts.',
    features: [
      '6 Bespoke Canapés & Caviar / Truffle Tastings',
      '4 Reserve Entrées (Prime Ribeye, Lobster Medallions, Duck Confit, Truffle Pasta)',
      '4 Artisanal Organic Sides & Exotic Salad Bar',
      'Warm Brioche & Artisanal Truffle Butter Flight',
      'Trio Dessert Degustation with Gold Leaf Accent',
      'Craft Mocktails, French Press Barista & Welcome Sparkling Spritz',
    ],
    sampleMenu: {
      appetizers: [
        'Chilled Maine Lobster Medallions on Brioche Toast',
        'Wagyu Beef Carpaccio with Truffle Pearls',
        'Seared Hokkaido Scallops with Cauliflower Puree',
        'Duck Foie Gras Terrine with Fig Chutney',
        'Heirloom Tomato & Burrata with Micro Greens',
        'Crispy Crab Croquettes with Saffron Aioli',
      ],
      mains: [
        'Prime Angus Filet Mignon with Morel Mushroom Sauce',
        'Pan-Roasted Chilean Sea Bass with Champagne Caviar Emulsion',
        'Slow-Roasted Herb-Crusted Rack of Lamb',
        'Handmade Lobster Ravioli with Tarragon Cream',
      ],
      sides: [
        'Dauphinoise Potatoes with Gruyère & Fresh Thyme',
        'Baby Heirloom Carrots with Pistachio Pesto',
        'Charred Broccolini with Toasted Pine Nuts',
        'Winter Truffle & Frisée Salad with Champagne Vinaigrette',
      ],
      desserts: [
        'Valrhona Dark Chocolate Lava Cake with 24k Gold Flakes',
        'Madagascar Bourbon Vanilla Crème Brûlée',
        'French Macaron Tower & Hand-Rolled Truffles',
      ],
      beverages: [
        'Sparkling White Grape & Hibiscus Spritz',
        'Fresh Pressed Blood Orange Cooler',
        'Single-Origin Pour-over Coffee & Floral Tisanes',
      ],
    },
  },
];

export const SERVICE_STYLES: ServiceStyle[] = [
  {
    id: 'buffet',
    name: 'Buffet Style',
    pricePerGuest: 3,
    badge: 'Efficient & Generous',
    recommendedFor: 'Casual gatherings, company lunches, celebrations up to 500+ guests',
    description:
      'Self-service presentation equipped with modern chafing stands, temperature-controlled warmers, sleek display risers, and sneeze guard shields.',
  },
  {
    id: 'plated',
    name: 'Plated Service',
    pricePerGuest: 7,
    badge: 'Executive White-Glove',
    recommendedFor: 'Weddings, corporate awards, galas, formal dinner parties',
    description:
      'Full white-glove table service. Synchronized delivery of elegantly arranged plates straight from the staging kitchen directly to seated guests.',
  },
  {
    id: 'boxed',
    name: 'Boxed Meals',
    pricePerGuest: 2,
    badge: 'Grab-and-Go',
    recommendedFor: 'Conferences, business seminars, outdoor roadshows, crew catering',
    description:
      'Individually sealed eco-friendly designer lunch boxes containing cutlery packs, antibacterial wipes, and labeled nutritional cards.',
  },
];

export const ADDON_ITEMS: AddonItem[] = [
  {
    id: 'beverage_station',
    name: 'Artisan Beverage & Mocktail Station',
    category: 'beverage',
    pricingType: 'per_guest',
    price: 4,
    badge: 'Popular',
    iconName: 'GlassWater',
    description:
      'Chic self-serve drink station featuring iced fruit spritzers, cucumber-mint coolers, infused detox waters, and cold-brew iced teas with glassware.',
  },
  {
    id: 'live_dessert',
    name: 'Live Flambé & Gelato Dessert Counters',
    category: 'dessert',
    pricingType: 'per_guest',
    price: 6,
    badge: 'Guest Favorite',
    iconName: 'Sparkles',
    description:
      'Interactive dessert experience with on-site chef flambé crepes suzette, Belgian waffle bar, and 4 flavors of churned Italian artisanal gelato.',
  },
  {
    id: 'table_decor',
    name: 'Table Decor & Centerpieces',
    category: 'decor',
    pricingType: 'flat',
    price: 350,
    badge: 'Aesthetic Upgrade',
    iconName: 'Flower2',
    description:
      'Elegant linen runners, gold or brushed silver charger plates, botanical floral arrangements, and romantic LED ambient votives.',
  },
  {
    id: 'chef_station',
    name: 'Live Interactive Chef Carving Station',
    category: 'experience',
    pricingType: 'flat',
    price: 500,
    badge: 'Showstopper',
    iconName: 'Flame',
    description:
      'Live culinary theatre. Uniformed executive chef carving slow-roasted roasts, flambéing live pasta wheels, or assembling gourmet sushi.',
  },
  {
    id: 'late_night_snacks',
    name: 'Late-Night Midnight Munchies',
    category: 'experience',
    pricingType: 'per_guest',
    price: 5,
    badge: 'Party Hit',
    iconName: 'UtensilsCrossed',
    description:
      'Passed late-night bites served 1 hour before event close: mini Angus sliders, truffle fries cones, and warm churros with chocolate dip.',
  },
  {
    id: 'barista_coffee',
    name: 'Specialty Espresso & Artisan Tea Bar',
    category: 'beverage',
    pricingType: 'flat',
    price: 250,
    badge: 'Freshly Brewed',
    iconName: 'Coffee',
    description:
      'Barista-operated espresso bar offering lattes, cappuccinos, decaf options, oat & almond milk choices, and herbal tea infusions.',
  },
];

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'corporate-gala',
    name: 'Corporate Executive Dinner',
    description: 'Sophisticated 60-guest celebration with plated dining and artisan coffee.',
    guestCount: 60,
    tierId: 'premium',
    serviceStyleId: 'plated',
    addonIds: ['beverage_station', 'table_decor', 'barista_coffee'],
    eventType: 'Annual Corporate Banquet',
  },
  {
    id: 'royal-wedding',
    name: 'Luxury Wedding Gala',
    description: 'Opulent 200-guest fairy tale banquet with live dessert and chef carving stations.',
    guestCount: 200,
    tierId: 'royal',
    serviceStyleId: 'plated',
    addonIds: ['beverage_station', 'live_dessert', 'table_decor', 'chef_station', 'late_night_snacks'],
    eventType: 'Luxury Wedding Reception',
  },
  {
    id: 'company-lunch',
    name: 'Tech Conference Luncheon',
    description: 'High-speed 120-guest buffet catering with quick drink station.',
    guestCount: 120,
    tierId: 'standard',
    serviceStyleId: 'buffet',
    addonIds: ['beverage_station'],
    eventType: 'Industry Conference & Expo',
  },
  {
    id: 'milestone-birthday',
    name: 'Milestone Jubilee Evening',
    description: 'Chic 45-guest birthday soiree with gourmet menu and live gelato station.',
    guestCount: 45,
    tierId: 'premium',
    serviceStyleId: 'buffet',
    addonIds: ['live_dessert', 'table_decor', 'barista_coffee'],
    eventType: '50th Jubilee Celebration',
  },
];
