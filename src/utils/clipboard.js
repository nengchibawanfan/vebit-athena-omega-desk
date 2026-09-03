import { ref } from 'vue'

const toast = ref('')
let timer = null

export function copyToast() {
  return toast
}

export async function copyText(text) {
  const value = String(text || '').trim()
  if (!value) return false
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
    } else {
      const input = document.createElement('textarea')
      input.value = value
      input.setAttribute('readonly', '')
      input.style.position = 'fixed'
      input.style.left = '-9999px'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    toast.value = '复制成功'
    clearTimeout(timer)
    timer = setTimeout(() => {
      toast.value = ''
    }, 1600)
    return true
  } catch {
    toast.value = '复制失败'
    clearTimeout(timer)
    timer = setTimeout(() => {
      toast.value = ''
    }, 1600)
    return false
  }
}
