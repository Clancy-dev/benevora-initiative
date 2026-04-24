export const EXCHANGE_RATE = 3750 // 1 USD = 3750 UGX (approximate)

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount

  if (fromCurrency === 'USD' && toCurrency === 'UGX') {
    return Math.round(amount * EXCHANGE_RATE)
  }

  if (fromCurrency === 'UGX' && toCurrency === 'USD') {
    return Math.round((amount / EXCHANGE_RATE) * 100) / 100
  }

  return amount
}

export const predefinedAmounts = {
  USD: [5, 10, 25, 50, 100, 250],
  UGX: [18750, 37500, 93750, 187500, 375000, 937500],
}
