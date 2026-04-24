// Currency conversion and formatting utilities

// Exchange rate: 1 USD = 3800 UGX (This can be updated with live API rates later)
const EXCHANGE_RATE = {
  USD_TO_UGX: 3800,
  UGX_TO_USD: 1 / 3800,
} as const

export type Currency = 'USD' | 'UGX'

export const CURRENCY_SYMBOLS = {
  USD: '$',
  UGX: 'UGX',
} as const

export const CURRENCY_NAMES = {
  USD: 'US Dollar',
  UGX: 'Ugandan Shilling',
} as const

/**
 * Convert currency from one type to another
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number {
  if (fromCurrency === toCurrency) return amount

  if (fromCurrency === 'USD' && toCurrency === 'UGX') {
    return amount * EXCHANGE_RATE.USD_TO_UGX
  }

  if (fromCurrency === 'UGX' && toCurrency === 'USD') {
    return amount * EXCHANGE_RATE.UGX_TO_USD
  }

  return amount
}

/**
 * Format currency for display
 */
export function formatCurrency(
  amount: number,
  currency: Currency,
  decimals = 2
): string {
  const symbol = CURRENCY_SYMBOLS[currency]

  if (currency === 'USD') {
    return `${symbol}${amount.toFixed(decimals)}`
  }

  // UGX - typically no decimals
  return `${symbol} ${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

/**
 * Parse currency input string to number
 */
export function parseCurrencyInput(input: string): number {
  return parseFloat(input.replace(/[^0-9.-]/g, '')) || 0
}

/**
 * Get conversion summary for display
 */
export function getConversionSummary(
  amount: number,
  originalCurrency: Currency,
  targetCurrency: Currency
): { original: string; converted: string; rate: string } {
  const converted = convertCurrency(amount, originalCurrency, targetCurrency)

  return {
    original: formatCurrency(amount, originalCurrency),
    converted: formatCurrency(converted, targetCurrency),
    rate:
      originalCurrency === 'USD'
        ? `1 USD = ${EXCHANGE_RATE.USD_TO_UGX.toLocaleString()} UGX`
        : `1 UGX = ${EXCHANGE_RATE.UGX_TO_USD.toFixed(6)} USD`,
  }
}

/**
 * Update exchange rate (for future API integration)
 */
export function updateExchangeRate(rate: number) {
  // This would be called when fetching live rates from an API
  // For now, it's a placeholder for future enhancement
  console.log(`Exchange rate updated: 1 USD = ${rate} UGX`)
}
