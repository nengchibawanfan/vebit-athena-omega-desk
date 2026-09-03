export const DEFAULT_DESK_UID = '104821'

function hashText(text) {
  let hash = 7
  const value = String(text || '')
  for (let i = 0; i < value.length; i++) hash = (hash * 33 + value.charCodeAt(i)) % 9973
  return hash
}

export function expandUid(raw) {
  const value = String(raw || '').trim()
  if (!value) return ''
  if (/^\d{4,12}$/.test(value)) return value
  const prefixed = value.match(/^(?:ACC|SM|RT|WL|KL|PG)(\d+)$/i)
  if (prefixed) return prefixed[1]
  if (value.includes('***')) {
    const [head, tail] = value.split('***')
    const h = (String(head).match(/\d+/) || ['1'])[0].slice(0, 2)
    const t = (String(tail).match(/\d+/) || ['0'])[0].slice(0, 3)
    const midLen = Math.max(1, 6 - h.length - t.length)
    const mid = String(100000 + hashText(value)).slice(0, midLen)
    return `${h}${mid}${t}`
  }
  const digits = value.replace(/\D/g, '')
  if (digits.length >= 4) return digits
  if (digits.length) return String(100000 + hashText(value) + Number(digits)).slice(0, 6)
  return String(100000 + (hashText(value) % 900000))
}

export function userDetailPath(uid) {
  const value = expandUid(uid) || DEFAULT_DESK_UID
  return `/desk/user/${encodeURIComponent(value)}`
}

const LAST_UID_KEY = 'lastDeskUid'

export function saveLastDeskUid(uid) {
  const value = expandUid(uid)
  if (value) sessionStorage.setItem(LAST_UID_KEY, value)
}

export function lastDeskUid() {
  return sessionStorage.getItem(LAST_UID_KEY) || DEFAULT_DESK_UID
}

export function lastDeskUserPath() {
  return userDetailPath(lastDeskUid())
}
