/* eslint-disable no-return-assign */
import parliamentSVG from './parliament'
import { toHtml as toSvg } from 'hast-util-to-html'
import PropTypes from 'prop-types'
import './style.css'

const Hemicycle = ({ type, results, camara, fuenteVotos }) => {
  const result = type === 'partidos' ? results.partidos : results.votos
  const virtualSvg = parliamentSVG(result, { seatCount: true }, type, camara, fuenteVotos)
  const svg = toSvg(virtualSvg)

  const handleMouseEnter = (e) => {
    const svgTag = e.target.children[0]
    const seatNum = document.querySelector('.seatNumber')
    const tspan1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
    const tspan2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
    tspan1.setAttribute('x', '0')
    tspan2.setAttribute('x', '0')
    tspan2.setAttribute('dy', '-1px')

    if (seatNum) {
      seatNum.innerHTML = ''
      seatNum.append(tspan1, tspan2)
    }

    const partyName = tspan1
    const partySeats = tspan2

    Array.from(svgTag.children).forEach((child) => {
      child.onmouseenter = (event) => {
        const el = event.target
        if (!el.hasAttribute('data-votante') || el.classList.contains('seatNumber') || el.classList.contains('-mini')) return

        const party = el.getAttribute('class')
        const data = result[party] || {}

        tspan1.textContent = data.name || ''
        tspan2.textContent = data.seats || ''
        tspan2.style.fill = data.colour || '#000'
        if (seatNum) seatNum.style.display = 'block'

        const votante = el.getAttribute('data-votante') || 'N/D'
        const bloque = el.getAttribute('data-bloque') || 'N/D'
        const provincia = el.getAttribute('data-provincia') || 'N/D'
        const voto = el.getAttribute('data-voto') || 'N/D'
        const foto = el.getAttribute('data-foto') || '/placeholder.jpg'

        const tooltip = document.getElementById('circle-tooltip')
        tooltip.innerHTML = `
          <img class="tooltip-img" src="${foto}" alt="${votante}" />
          <div class="tooltip-text">
            <span>${votante}</span>
            <span>${bloque}</span>
            <span>${provincia}</span>
            <span>${voto}</span>
          </div>
        `
        tooltip.style.opacity = '1'
        tooltip.style.position = 'fixed'

        const tooltipWidth = tooltip.offsetWidth
        const tooltipHeight = tooltip.offsetHeight
        let left = event.clientX + 10
        let top = event.clientY + 10

        if (left + tooltipWidth > window.innerWidth) left = window.innerWidth - tooltipWidth - 10
        if (left < 0) left = 10
        if (top + tooltipHeight > window.innerHeight) top = event.clientY - tooltipHeight - 10
        if (top < 0) top = 10

        tooltip.style.left = `${left}px`
        tooltip.style.top = `${top}px`

        partyName.textContent = data.name || ''
        partySeats.textContent = data.seats || ''
        partySeats.style.fill = data.colour || '#000'
        Object.assign(partyName.style, {
          fill: data.colour || '#000',
          fontFamily: 'TT Interfaces',
          fontWeight: 'bold',
          fontSize: '1px'
        })
        Object.assign(partySeats.style, {
          fill: data.colour || '#000',
          fontFamily: 'TT Interfaces',
          fontWeight: 'bold'
        })
        if (seatNum) seatNum.style.fill = '#fff'

        document.querySelectorAll('circle').forEach(c => c.style.filter = 'opacity(0.3)')
        el.style.filter = 'opacity(1)'
      }
    })

    if (seatNum) {
      seatNum.onmouseenter = () => {
        document.querySelectorAll('circle').forEach(c => c.style.filter = 'opacity(1)')
      }
    }
  }

  const handleMouseLeave = () => {
    document.querySelectorAll('circle').forEach(c => c.style.filter = 'opacity(1)')
    const seatNum = document.querySelector('.seatNumber')
    if (seatNum) seatNum.style.display = 'none'
    const tooltip = document.getElementById('circle-tooltip')
    if (tooltip) tooltip.style.opacity = '0'
  }

  return (
    <>
      <div className='widget'>
        <div
          className='svgContainer'
          dangerouslySetInnerHTML={{ __html: svg }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      </div>
      <div className="tooltip" id="circle-tooltip" />
    </>
  )
}

Hemicycle.propTypes = {
  type: PropTypes.string,
  results: PropTypes.object,
  camara: PropTypes.string,
  fuenteVotos: PropTypes.array
}

export default Hemicycle
