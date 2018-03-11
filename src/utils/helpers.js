export function createSimpleFunctional (c, el = 'div', name) {
  name = name || c.replace(/__/g, '-')

  return {
    name: `v-${name}`,
    functional: true,

    render: (h, { data, children }) => {
      data.staticClass = (`${c} ${data.staticClass || ''}`).trim()

      return h(el, data, children)
    }
  }
}

export function getObjectValueByPath (obj, path) {
  if (!path || path.constructor !== String) return
  path = path.replace(/\[(\w+)\]/g, '.$1')
  path = path.replace(/^\./, '')
  const a = path.split('.')
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i]
    if (obj instanceof Object && k in obj) {
      obj = obj[k]
    } else {
      return
    }
  }
  return obj
}
