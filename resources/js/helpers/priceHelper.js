export const priceFormatted = ({ price, currency = 'USD', fractionDigits = 2 }) => {
  const options = {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits
  }

  const priceParsed = parseFloat(price)

  const priceFormatted = priceParsed.toLocaleString('es-CO', options)

  return priceFormatted
}
