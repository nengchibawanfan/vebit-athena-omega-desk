export function sideTag(side) {
  return side === '买' ? 'user' : 'robot'
}

export function accountTypeTag(type) {
  if (type.includes('恶意')) return 'danger'
  if (type.includes('量化')) return 'robot'
  return 'user'
}

export function alertTypeClass(type) {
  return ['交易频率', '挂撤单异常', '价格操纵'].includes(type) ? 'danger' : 'warning'
}

export function statusTagClass(status) {
  if (status === '未处理' || status === '红色') return 'alert'
  if (status === '监控中' || status === '已预警') return 'warning'
  return 'success'
}
