export const currencyFormatter = ({ value, currency = 'en-US', money = 'USD' }) => {
  const valueFormatted = parseFloat(value)
  const formattedValue = valueFormatted.toLocaleString(currency, { style: 'currency', currency: money })

  return formattedValue
}
