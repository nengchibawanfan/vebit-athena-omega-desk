export function normalizeAddr(addr) {
  return (addr || '').trim().toLowerCase()
}

export function addrMatch(a, b) {
  const x = normalizeAddr(a)
  const y = normalizeAddr(b)
  if (!x || !y) return false
  if (x === y) return true
  const parts = (value) => {
    if (!value.includes('...')) return null
    const [prefix, suffix] = value.split('...')
    return { prefix, suffix }
  }
  const xp = parts(x)
  const yp = parts(y)
  if (xp && yp) return xp.prefix === yp.prefix && xp.suffix === yp.suffix
  if (xp) return y.startsWith(xp.prefix) && y.endsWith(xp.suffix)
  if (yp) return x.startsWith(yp.prefix) && x.endsWith(yp.suffix)
  return false
}

export function isExcludedAddr(address, list) {
  return (list || []).some((item) => addrMatch(item.address, address))
}

export function maskAddr(address, head = 6, tail = 4) {
  const value = String(address || '').trim()
  if (!value) return ''
  const body = value.startsWith('0x') || value.startsWith('0X') ? value.slice(2) : value
  const prefix = value.startsWith('0x') || value.startsWith('0X') ? '0x' : ''
  if (body.length <= head + tail) return value
  return `${prefix}${body.slice(0, head)}...${body.slice(-tail)}`
}

export const DEFAULT_ONCHAIN_ADDRESS = '0x4e8c19a7b2d04f65c831e90a1b7d6c5e3f2048ab'

export function addressDetailPath(address) {
  const value = String(address || '').trim() || DEFAULT_ONCHAIN_ADDRESS
  return `/chips/external/address/${encodeURIComponent(value)}`
}

const LAST_ADDRESS_KEY = 'lastExternalAddress'

export function saveLastExternalAddress(address) {
  const value = String(address || '').trim()
  if (value) sessionStorage.setItem(LAST_ADDRESS_KEY, value)
}

export function lastExternalAddress() {
  return sessionStorage.getItem(LAST_ADDRESS_KEY) || DEFAULT_ONCHAIN_ADDRESS
}

export function lastExternalAddressPath() {
  return addressDetailPath(lastExternalAddress())
}
