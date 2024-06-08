function formatCurrency(amount: number | string) {
  const short = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(Number(amount));
  const long = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount));

  return { short, long }
}

export { formatCurrency }