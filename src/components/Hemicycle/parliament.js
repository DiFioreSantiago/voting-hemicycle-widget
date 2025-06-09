/* eslint-disable quote-props */
'use strict'

import { s as hastH } from 'hastscript'
import roundTo from 'lodash/round.js'
import sl from 'sainte-lague'

const pi = Math.PI

const round = (x) => roundTo(x, 10)
const seatSum = (o) => {
  let result = 0
  for (const key in o) result += o[key].seats
  return result
}
const merge = (arrays) => {
  let result = []
  for (const list of arrays) result = result.concat(list)
  return result
}

const coords = (r, b) => ({
  x: round(r * Math.cos(b / r - pi)),
  y: round(r * Math.sin(b / r - pi))
})

const calculateSeatDistance = (seatCount, numberOfRings, r) => {
  const x = (pi * numberOfRings * r) / (seatCount - numberOfRings)
  const y = 1 + (pi * (numberOfRings - 1) * numberOfRings / 2) / (seatCount - numberOfRings)

  const a = x / y
  return a
}

const score = (m, n, r) => Math.abs(calculateSeatDistance(m, n, r) * n / r - (5 / 7))

const calculateNumberOfRings = (seatCount, r) => {
  let n = Math.floor(Math.log(seatCount) / Math.log(2)) || 1
  let distance = score(seatCount, n, r)

  let direction = 0
  if (score(seatCount, n + 1, r) < distance) direction = 1
  if (score(seatCount, n - 1, r) < distance && n > 1) direction = -1

  while (score(seatCount, n + direction, r) < distance && n > 0) {
    distance = score(seatCount, n + direction, r)
    n += direction
  }
  return n
}

const nextRing = (rings, ringProgress) => {
  let progressQuota, tQuota
  for (const index in rings) {
    tQuota = round((ringProgress[index] || 0) / rings[index].length)
    if (!progressQuota || tQuota < progressQuota) progressQuota = tQuota
  }
  for (const index in rings) {
    tQuota = round((ringProgress[index] || 0) / rings[index].length)
    if (tQuota === progressQuota) return index
  }
}

const partyColorsDiputados = {
  'La Libertad Avanza': '#8E24AA',
  'Union Por La Patria': '#1976D2',
  'Pro': '#F9A825',
  'Frente De Izquierda Unidad': '#E53935',
  'Otros': '#B0BEC5'
}

const partyColorsSenadores = {
  'La Libertad Avanza': '#8E24AA',
  'Frente Nacional Y Popular': '#1976D2',
  'Unidad Ciudadana': '#1976D2',
  'Frente Pro': '#F9A825',
  'Unión Cívica Radical': '#FC4B08',
  'Otros': '#B0BEC5'
}

const voteColors = {
  'AFIRMATIVO': '#2E7D32',
  'NEGATIVO': '#B71C1C',
  'ABSTENCION': '#FFD600',
  'AUSENTE': '#607D8B'
}

const getPartyColor = (party, camara) => {
  if (camara === 'senadores') {
    return partyColorsSenadores[party] || partyColorsSenadores.Otros
  }
  return partyColorsDiputados[party] || partyColorsDiputados.Otros
}
const getVoteColor = (vote) => voteColors[vote]

const generatePoints = (parliament, r0, typeOfView, camara, fuenteVotos) => {
  const seatCount = seatSum(parliament)
  const numberOfRings = calculateNumberOfRings(seatCount, r0)
  const seatDistance = calculateSeatDistance(seatCount, numberOfRings, r0)

  let rings = []
  for (let i = 1; i <= numberOfRings; i++) {
    rings[i] = r0 - (i - 1) * seatDistance
  }

  rings = sl(rings, seatCount)

  const points = []
  let r, a, point

  let ring
  for (let i = 1; i <= numberOfRings; i++) {
    ring = []
    r = r0 - (i - 1) * seatDistance
    a = (pi * r) / ((rings[i] - 1) || 1)

    for (let j = 0; j <= rings[i] - 1; j++) {
      point = coords(r, j * a)
      point.r = 0.4 * seatDistance
      ring.push(point)
    }
    points.push(ring)
  }

  const ringProgress = Array(points.length).fill(0)

  for (const voteType in parliament) {
    const votantes = fuenteVotos.filter(d => d.VOTO.toUpperCase().trim() === voteType.toUpperCase().trim())

    const validParties = camara === 'senadores'
      ? ['La Libertad Avanza', 'Frente Nacional Y Popular', 'Unidad Ciudadana', 'Frente Pro', 'Unión Cívica Radical']
      : ['La Libertad Avanza', 'Union Por La Patria', 'Pro', 'Frente De Izquierda Unidad']

    const partidosVotantes = fuenteVotos.filter(d => {
      const partidoAsignado = validParties.includes(d.BLOQUE) ? d.BLOQUE : 'Otros'
      return partidoAsignado.toUpperCase().trim() === voteType.toUpperCase().trim()
    })

    let voterIndex = 0

    for (let i = 0; i < parliament[voteType].seats; i++) {
      ring = nextRing(points, ringProgress)

      if (typeOfView === 'votos') {
        if (voterIndex >= votantes.length) {
          voterIndex = 0
        }

        const voterData = votantes[voterIndex++] || { BLOQUE: 'Otros' }
        const party = voterData.BLOQUE || 'Otros'
        const color = getPartyColor(party, camara)
        const voteClass = voteType

        points[ring][ringProgress[ring]].fill = parliament[voteType].colour
        points[ring][ringProgress[ring]].party = voteClass
        points[ring][ringProgress[ring]].partyClass = party
        points[ring][ringProgress[ring]].partyColor = color
        points[ring][ringProgress[ring]].votante = {
          nombre: camara === 'diputados' ? voterData.DIPUTADO : voterData.SENADOR,
          bloque: voterData.BLOQUE,
          provincia: voterData.PROVINCIA,
          voto: voterData.VOTO,
          foto: voterData.FOTO
        }

        ringProgress[ring]++
      } else {
        if (voterIndex >= partidosVotantes.length) {
          voterIndex = 0
        }

        const voterData = partidosVotantes[voterIndex++] || { BLOQUE: 'Otros' }
        const party = voterData.VOTO
        const color = getVoteColor(party)
        const voteClass = voteType

        points[ring][ringProgress[ring]].fill = parliament[voteType].colour
        points[ring][ringProgress[ring]].party = voteClass
        points[ring][ringProgress[ring]].partyClass = party
        points[ring][ringProgress[ring]].partyColor = color
        points[ring][ringProgress[ring]].votante = {
          nombre: camara === 'diputados' ? voterData.DIPUTADO : voterData.SENADOR,
          bloque: voterData.BLOQUE,
          provincia: voterData.PROVINCIA,
          voto: voterData.VOTO,
          foto: voterData.FOTO
        }

        ringProgress[ring]++
      }
    }
  }
  return merge(points)
}

const pointToSVG = hFn => point => {
  const imageSize = point.r * 2
  const overlayColor = point.fill
  const borderColor = point.fill

  // Imagen del diputado en el centro del círculo
  const image = hFn('image', {
    href: point.votante?.foto || '',
    x: point.x - point.r,
    y: point.y - point.r,
    width: imageSize,
    height: imageSize,
    clipPath: 'circle(50%)'
  })

  // Overlay de color encima de la imagen (relleno semi-transparente)
  const overlay = hFn('circle', {
    cx: point.x,
    cy: point.y,
    r: point.r,
    fill: overlayColor,
    fillOpacity: 0.5,
    class: point.party,
    'data-votante': point.votante?.nombre,
    'data-bloque': point.votante?.bloque,
    'data-provincia': point.votante?.provincia,
    'data-voto': point.votante?.voto,
    'data-foto': point.votante?.foto
  })

  // Borde del círculo mayor
  const border = hFn('circle', {
    cx: point.x,
    cy: point.y,
    r: point.r,
    stroke: borderColor,
    strokeWidth: 0.1,
    fill: 'none'
  })

  // Minicírculo como indicador auxiliar
  const miniCircle = hFn('circle', {
    cx: point.x + point.r * 0.6,
    cy: point.y + point.r * 0.6,
    r: point.r * 0.5,
    fill: point.partyColor,
    class: `${point.partyClass}-mini`
  })

  return [image, overlay, border, miniCircle]
}

const defaults = {
  seatCount: false,
  hFunction: hastH
}

const generate = (parliament, options = {}, typeOfView, camara, fuenteVotos) => {
  const { seatCount, hFunction } = Object.assign({}, defaults, options)
  if (typeof seatCount !== 'boolean') throw new Error('`seatCount` option must be a boolean')
  if (typeof hFunction !== 'function') throw new Error('`hFunction` option must be a function')

  const radius = 20
  const points = generatePoints(parliament, radius, typeOfView, camara, fuenteVotos)
  const a = points[0].r / 0.4
  const elements = points.map(pointToSVG(hFunction))
  if (seatCount) {
    elements.push(hFunction('text', {
      x: 0,
      y: 0,
      'text-anchor': 'middle',
      style: {
        'font-family': 'Helvetica',
        'font-size': 0.25 * radius + 'px'
      },
      class: 'seatNumber'
    }, elements.length))
  }
  const document = hFunction('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: [-radius - a / 2, -radius - a / 2, 2 * radius + a, radius + a].join(',')
  }, elements)
  return document
}

export default generate
