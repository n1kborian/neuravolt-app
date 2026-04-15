export const PRICING = {
  minOrderValue: 99,
  travelFee: 49,
  setupFeeFirstInspection: 89,
  vatRate: 0.19,
  perDeviceTiers: [
    { minDevices: 1, pricePerDevice: 4.9 },
    { minDevices: 50, pricePerDevice: 4.5 },
    { minDevices: 100, pricePerDevice: 3.9 },
    { minDevices: 250, pricePerDevice: 3.5 },
  ],
} as const;

export type QuoteInput = {
  deviceCount: number;
  isFirstInspection: boolean;
};

export type QuoteBreakdown = {
  deviceCount: number;
  pricePerDevice: number;
  devicesSubtotal: number;
  travelFee: number;
  setupFee: number;
  subtotalBeforeMinimum: number;
  minimumAdjustment: number;
  netTotal: number;
  vat: number;
  grossTotal: number;
};

export function resolvePricePerDevice(deviceCount: number): number {
  const tiers = [...PRICING.perDeviceTiers].sort((a, b) => b.minDevices - a.minDevices);
  for (const tier of tiers) {
    if (deviceCount >= tier.minDevices) return tier.pricePerDevice;
  }
  return PRICING.perDeviceTiers[0].pricePerDevice;
}

export function calculateQuote({ deviceCount, isFirstInspection }: QuoteInput): QuoteBreakdown {
  const safeDevices = Math.max(0, Math.floor(deviceCount));
  const pricePerDevice = resolvePricePerDevice(safeDevices);
  const devicesSubtotal = round2(safeDevices * pricePerDevice);
  const travelFee = PRICING.travelFee;
  const setupFee = isFirstInspection ? PRICING.setupFeeFirstInspection : 0;
  const subtotalBeforeMinimum = round2(devicesSubtotal + travelFee + setupFee);
  const minimumAdjustment = subtotalBeforeMinimum < PRICING.minOrderValue
    ? round2(PRICING.minOrderValue - subtotalBeforeMinimum)
    : 0;
  const netTotal = round2(subtotalBeforeMinimum + minimumAdjustment);
  const vat = round2(netTotal * PRICING.vatRate);
  const grossTotal = round2(netTotal + vat);

  return {
    deviceCount: safeDevices,
    pricePerDevice,
    devicesSubtotal,
    travelFee,
    setupFee,
    subtotalBeforeMinimum,
    minimumAdjustment,
    netTotal,
    vat,
    grossTotal,
  };
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
