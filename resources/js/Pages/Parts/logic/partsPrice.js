import { PARTSNAME } from './partsNameConst'

export const partsPrice = ({ parts }) => {
  return {
    cpuPart: parseFloat(parts.find(part => part.product === PARTSNAME.cpuCores).usdPrice),
    ramPart: parseFloat(parts.find(part => part.product === PARTSNAME.ram).usdPrice),
    storagePart: parseFloat(parts.find(part => part.product === PARTSNAME.storage).usdPrice),
    brandwichPart: parseFloat(parts.find(part => part.product === PARTSNAME.bandwidth).usdPrice),
    sql2core: parseFloat(parts.find(part => part.product === PARTSNAME.sql2core).usdPrice),
    backup: parseFloat(parts.find(part => part.product === PARTSNAME.backup).usdPrice),
    security: parseFloat(parts.find(part => part.product === PARTSNAME.security).usdPrice),
    support: parseFloat(parts.find(part => part.product === PARTSNAME.support).usdPrice),
    snapchot: parseFloat(parts.find(part => part.product === PARTSNAME.snapchot).usdPrice),
    rdp: parseFloat(parts.find(part => part.product === PARTSNAME.rdp).usdPrice),
    rdpExtra: parseFloat(parts.find(part => part.product === PARTSNAME.rdp).usdPrice),
    ip: parseFloat(parts.find(part => part.product === PARTSNAME.ip).usdPrice),
    sql2extra: parseFloat(parts.find(part => part.product === PARTSNAME.sql2extra).usdPrice)
  }
}
