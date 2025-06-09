/* eslint-disable react/prop-types */
/* eslint-disable quote-props */
import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { TYPE_VOTOS } from '../../consts'
import './Legend.css'

const COLORES_PARTIDOS_DIPUTADOS = {
  'La Libertad Avanza': '#A76EF2',
  'Union Por La Patria': '#118CEF',
  'Pro': '#FFAE1B',
  'Frente De Izquierda Unidad': '#FF3535',
  'Otros': '#9E9E9E'
}

const COLORES_PARTIDOS_SENADORES = {
  'La Libertad Avanza': '#8E24AA',
  'Frente Nacional Y Popular': '#1976D2',
  'Unidad Ciudadana': '#1976D2',
  'Frente Pro': '#F9A825',
  'Unión Cívica Radical': '#FC4B08',
  'Otros': '#B0BEC5'
}

const COLORES_VOTOS = {
  'AFIRMATIVO': '#2E7D32',
  'NEGATIVO': '#B71C1C',
  'ABSTENCION': '#FFD600',
  'AUSENTE': '#607D8B'
}

const getValidParties = (camara) => {
  const source = camara === 'senadores' ? COLORES_PARTIDOS_SENADORES : COLORES_PARTIDOS_DIPUTADOS
  return Object.keys(source).filter(p => p !== 'Otros')
}

const normalizarBloque = (bloque, camara) => {
  const validParties = getValidParties(camara)
  return validParties.includes(bloque) ? bloque : 'Otros'
}

const getGroupedByVote = (fuente, camara) => {
  const votos = {}
  for (const d of fuente) {
    const voto = d.VOTO || 'AUSENTE'
    const bloque = normalizarBloque(d.BLOQUE, camara)
    if (!votos[voto]) votos[voto] = { total: 0, bloques: {} }
    votos[voto].total++
    votos[voto].bloques[bloque] = (votos[voto].bloques[bloque] || 0) + 1
  }
  return votos
}

const getGroupedByPartido = (fuente, camara) => {
  const partidos = {}
  for (const d of fuente) {
    const bloque = normalizarBloque(d.BLOQUE, camara)
    const voto = d.VOTO || 'AUSENTE'
    if (!partidos[bloque]) partidos[bloque] = { total: 0, votos: {} }
    partidos[bloque].total++
    partidos[bloque].votos[voto] = (partidos[bloque].votos[voto] || 0) + 1
  }
  return partidos
}

const LegendItem = ({ label, total, subdata, activeTab, camara, fuenteVotos }) => {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen(!open)

  const mainColor = activeTab === TYPE_VOTOS
    ? COLORES_VOTOS[label]
    : (camara === 'senadores'
        ? COLORES_PARTIDOS_SENADORES[label] || COLORES_PARTIDOS_SENADORES.Otros
        : COLORES_PARTIDOS_DIPUTADOS[label] || COLORES_PARTIDOS_DIPUTADOS.Otros)

  return (
    <Accordion
      className="legend-item"
      expanded={open}
      onChange={toggle}
      disableGutters
      square
      elevation={0}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon className={`arrow ${open ? 'open' : ''}`} />}
        className="legend-summary"
      >
        <div className="legend-left">
          <svg height="10" width="15" style={{ marginRight: '6px' }}>
            <ellipse cx="5" cy="5" rx="5" ry="5" fill={mainColor} />
          </svg>
          <strong style={{ color: mainColor }}>{label}</strong>
        </div>
      </AccordionSummary>

      <AccordionDetails className={`legend-details ${open ? 'open' : ''}`}>
        {fuenteVotos
          .filter(d => {
            const bloqueNormalizado = normalizarBloque(d.BLOQUE, camara)
            return activeTab === TYPE_VOTOS
              ? d.VOTO === label
              : bloqueNormalizado === label
          })
          .map((vot, idx) => {
            const color = activeTab === TYPE_VOTOS
              ? COLORES_VOTOS[vot.VOTO] || '#ccc'
              : (camara === 'senadores'
                  ? COLORES_PARTIDOS_SENADORES[normalizarBloque(vot.BLOQUE, camara)] || COLORES_PARTIDOS_SENADORES.Otros
                  : COLORES_PARTIDOS_DIPUTADOS[normalizarBloque(vot.BLOQUE, camara)] || COLORES_PARTIDOS_DIPUTADOS.Otros)

            return (
              <div className="votante-card" key={idx}>
                <div className="votante-circle" style={{ borderColor: color }}>
                  <img
                    src={vot.FOTO || '/placeholder.jpg'}
                    alt={camara === 'diputados' ? vot.DIPUTADO : vot.SENADOR}
                    className="votante-foto"
                  />
                </div>
                <div className="votante-info">
                  <div className="votante-nombre">
                    {camara === 'diputados' ? vot.DIPUTADO : vot.SENADOR}
                  </div>
                  <div className="votante-extra">
                    {activeTab === TYPE_VOTOS ? vot.BLOQUE : vot.VOTO}
                  </div>
                </div>
              </div>
            )
          })}
      </AccordionDetails>
    </Accordion>
  )
}

const Legend = ({ activeTab, camara, fuenteVotos }) => {
  const groupedData = useMemo(() => {
    return activeTab === TYPE_VOTOS
      ? getGroupedByVote(fuenteVotos, camara)
      : getGroupedByPartido(fuenteVotos, camara)
  }, [activeTab, camara, fuenteVotos])

  return (
    <div className='legend-container'>
      {Object.entries(groupedData).map(([key, data]) => (
        <LegendItem
          key={key}
          label={key}
          total={data.total}
          subdata={activeTab === TYPE_VOTOS ? data.bloques : data.votos}
          activeTab={activeTab}
          camara={camara}
          fuenteVotos={fuenteVotos}
        />
      ))}
    </div>
  )
}

Legend.propTypes = {
  activeTab: PropTypes.string,
  camara: PropTypes.string,
  fuenteVotos: PropTypes.array
}

LegendItem.propTypes = {
  label: PropTypes.string,
  total: PropTypes.number,
  subdata: PropTypes.object,
  activeTab: PropTypes.string,
  camara: PropTypes.string,
  fuenteVotos: PropTypes.array
}

export default Legend
