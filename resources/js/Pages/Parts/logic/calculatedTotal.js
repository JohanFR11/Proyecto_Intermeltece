export const calculateTotal = ({ selectedValues = {}, setPartsPrice = {} }) => {
  const cpuTotal = parseFloat(selectedValues.cpuCores * setPartsPrice.cpuPart) ? parseFloat(selectedValues.cpuCores * setPartsPrice.cpuPart) : 0
  const ramTotal = parseFloat(selectedValues.ram * setPartsPrice.ramPart) ? parseFloat(selectedValues.ram * setPartsPrice.ramPart) : 0
  const ddTotal = parseFloat(selectedValues.storage * setPartsPrice.storagePart) ? parseFloat(selectedValues.storage * setPartsPrice.storagePart) : 0
  const brandTotal = parseFloat(selectedValues.bandwidth * setPartsPrice.brandwichPart) ? parseFloat(selectedValues.bandwidth * setPartsPrice.brandwichPart) : 0
  const sql2extra = parseFloat(selectedValues.sql2extra * setPartsPrice.sql2extra) ? parseFloat(selectedValues.sql2extra * setPartsPrice.sql2extra) : 0
  const soTotal = parseFloat(selectedValues.so) ? parseFloat(selectedValues.so) : 0
  const backup = parseFloat(setPartsPrice.backup * selectedValues.storage) ? parseFloat(setPartsPrice.backup * selectedValues.storage) : 0
  const security = parseFloat(setPartsPrice.security)
  const support = parseFloat(setPartsPrice.support)
  const snapchot = parseFloat(setPartsPrice.snapchot)
  const sql2core = parseFloat(selectedValues.sql2core) ? parseFloat(selectedValues.sql2core + setPartsPrice.sql2core) : 0
  const rdp = parseFloat(selectedValues.rdp) ? parseFloat(selectedValues.rdp + setPartsPrice.rdp) : 0
  const ip = parseFloat(selectedValues.ip) ? parseFloat(selectedValues.ip + setPartsPrice.ip) : 0
  const rdpExtra = parseFloat(selectedValues.rdpExtra * setPartsPrice.rdp) ? parseFloat(selectedValues.rdpExtra * setPartsPrice.rdp) : 0

  const totalPrice = cpuTotal + ramTotal + ddTotal + brandTotal + soTotal + backup + security + support + snapchot + sql2core + rdp + ip + sql2extra + rdpExtra

  return totalPrice
}

export const yearTotal = ({ discount, subtotal }) => {
  const DISCONT_MOUNTS = {
    10: 12,
    20: 24,
    30: 36,
    40: 48
  }
  const DEFAULT_MOUNTS = 0
  const months = DISCONT_MOUNTS[discount] || DEFAULT_MOUNTS

  const subtotalWithDiscount = (subtotal * discount) / 100
  const yearTotal = ((subtotal - subtotalWithDiscount) * months)

  return yearTotal
}
