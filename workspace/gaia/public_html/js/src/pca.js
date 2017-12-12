//const emlapack = require('./emlapack-custom')

const dsyrk = cwrap('f2c_dsyrk', null, ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'])
const dsyev = cwrap('dsyev_', null, ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'])

const cov = (x, n, m) => {
  const puplo = _malloc(1)
  const ptrans = _malloc(1)
  const pm = _malloc(4)
  const pn = _malloc(4)
  const palpha = _malloc(8)
  const plda = _malloc(4)
  const pbeta = _malloc(8)
  const pc = _malloc(m * m * 8)
  const pldc = _malloc(4)
  const c = new Float64Array(HEAPF64.buffer, pc, m * m)

  setValue(puplo, 'U'.charCodeAt(0), 'i8')
  setValue(ptrans, 'N'.charCodeAt(0), 'i8')
  setValue(pm, m, 'i32')
  setValue(pn, n, 'i32')
  setValue(palpha, 1 / n, 'double')
  setValue(pbeta, 0, 'double')
  setValue(plda, m, 'i32')
  setValue(pldc, m, 'i32')

  dsyrk(puplo, ptrans, pm, pn, palpha, x.byteOffset, plda, pbeta, pc, pldc)

  return c
}

const eig = (x, n, m) => {
  const E = cov(x, n, m)
  const pjobz = _malloc(1)
  const puplo = _malloc(1)
  const pn = _malloc(4)
  const plda = _malloc(4)
  const pw = _malloc(m * 8)
  const plwork = _malloc(4)
  const pinfo = _malloc(4)
  const pworkopt = _malloc(4)
  const lambda = new Float64Array(HEAPF64.buffer, pw, m)

  setValue(pjobz, 'V'.charCodeAt(0), 'i8')
  setValue(puplo, 'U'.charCodeAt(0), 'i8')
  setValue(pn, m, 'i32')
  setValue(plda, m, 'i32')
  setValue(plwork, -1, 'i32')

  dsyev(pjobz, puplo, pn, E.byteOffset, plda, pw, pworkopt, plwork, pinfo)

  const workopt = getValue(pworkopt, 'double')
  const pwork = _malloc(workopt * 8)
  setValue(plwork, workopt, 'i32')

  dsyev(pjobz, puplo, pn, E.byteOffset, plda, pw, pwork, plwork, pinfo)
  E.sort(function(a, b){return b-a});
  return {lambda, E}
}

const privates = new WeakMap()

class PCA {
  constructor (data) {
    const keys = Object.keys(data[0].values)
    const n = data.length
    const m = keys.length
    const px = _malloc(n * m * 8)
    const x = new Float64Array(HEAPF64.buffer, px, n * m)
    const xBar = new Float64Array(m)
    for (let i = 0; i < m; ++i) {
      let sum = 0
      for (let j = 0; j < n; ++j) {
        const value = data[j].values[keys[i]]
        sum += value
        x[j * m + i] = value
      }
      xBar[i] = sum / n
      for (let j = 0; j < n; ++j) {
        x[j * m + i] -= xBar[i]
      }
    }

    const {lambda, E} = eig(x, n, m)
    privates.set(this, {
      data,
      keys,
      m,
      xBar,
      E,
      lambda
    })
  }

  get (index1, index2) {
    const {data, keys, m, xBar, E} = privates.get(this)
    const pca1 = new Float64Array(m)
    const pca2 = new Float64Array(m)
    for (let i = 0; i < m; ++i) {
      const j1 = m - 1 - index1
      const j2 = m - 1 - index2
      pca1[i] = E[j1 * m + i]
      pca2[i] = E[j2 * m + i]
    }

    const loadings = keys.map((key, i) => {
      return {
        key: key,
        value: {
          x: pca1[i],
          y: pca2[i]
        }
      }
    })
    const scores = data.map((d) => {
      let xd = 0
      let yd = 0
      for (let i = 0, n = keys.length; i < n; ++i) {
        xd += (d.values[keys[i]] - xBar[i]) * pca1[i]
        yd += (d.values[keys[i]] - xBar[i]) * pca2[i]
      }
      return {
        key: d.name,
        value: {
          x: xd,
          y: yd
        }
      }
    })
    return {loadings, scores}
  }

  lambda () {
    const arr = Array.from(privates.get(this).lambda)
    arr.sort((x, y) => y - x)
    return arr
  }
}

//exports.PCA = PCA
