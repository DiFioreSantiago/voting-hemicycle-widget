/* eslint-disable react/no-unescaped-entities */

import React, { useEffect, useState } from 'react'
import { TYPE_VOTOS, TYPE_PARTIDOS, TYPE_DIPUTADOS, TYPE_SENADORES } from '../../consts'
import Header from '../../components/Header/Header'
import ParamsHelper from '../../helpers/ParamsHelper'
import Tabs from '../../components/TabComponent/Tabs'
import Hemicycle from '../../components/Hemicycle'
import Legend from '../../components/Hemicycle/Legend'
import Loader from '../../components/Loader/Loader'
import DarkModeSwitch from '../../components/DarkModeSwitch/DarkModeSwitch'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import './widget.css'
import { API_URLS } from '../../config'

const App = () => {
  const params = ParamsHelper.getParamsFromUrl()

  const validCamaras = [TYPE_DIPUTADOS, TYPE_SENADORES]
  const validHemiciclos = [TYPE_VOTOS, TYPE_PARTIDOS]

  const camaraParam = params.get('camara') || TYPE_DIPUTADOS
  const hemicicloParam = params.get('hemiciclo') || TYPE_VOTOS

  const isValidCamara = validCamaras.includes(camaraParam)
  const isValidHemiciclo = validHemiciclos.includes(hemicicloParam)

  const [camara] = useState(isValidCamara ? camaraParam : null)
  const [activeTab, setActiveTab] = useState(isValidHemiciclo ? hemicicloParam : TYPE_VOTOS)

  const [results, setResults] = useState(null)
  const [votacionDiputados, setVotacionDiputados] = useState(null)
  const [votacionSenadores, setVotacionSenadores] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(API_URLS.mockResults).then(res => res.json()).then(setResults),
      fetch(API_URLS.votacionDiputados).then(res => res.json()).then(setVotacionDiputados),
      fetch(API_URLS.votacionSenadores).then(res => res.json()).then(setVotacionSenadores)
    ])
      .catch(err => console.error('Error cargando datos:', err))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (activeTab && camara) {
      params.set('hemiciclo', activeTab)
      params.set('camara', camara)
      window.history.replaceState({}, '', `${window.location.pathname}?${params}`)
    }
  }, [activeTab, camara])

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) return saved === 'true'
    return params.get('theme') === 'dark'
  })

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const updated = !prev
      params.set('theme', updated ? 'dark' : 'light')
      window.history.replaceState({}, '', `${window.location.pathname}?${params}`)
      document.body.classList.toggle('dark-mode', updated)
      localStorage.setItem('darkMode', updated)
      return updated
    })
  }

  const handleType = (type) => {
    setActiveTab(type)
  }

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light'
    }
  })

  const data = results ? (camara === TYPE_DIPUTADOS ? results.diputados : results.senadores) : null
  const fuenteVotos = camara === TYPE_DIPUTADOS ? votacionDiputados : votacionSenadores

  return (
    <ThemeProvider theme={theme}>
      {!isValidCamara || !isValidHemiciclo
        ? (
        <div className="app">
          <Box sx={{ mt: 2, ml: 2 }}>
            <DarkModeSwitch darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </Box>
          <Header text="O.D. 721 - LEY DE FICHA LIMPIA" />
          <p className="no-data-text">
            Parámetro inválido en la URL: "{!isValidCamara ? 'camara' : 'hemiciclo'}".
          </p>
        </div>
          )
        : isLoading
          ? (
        <div className="app">
          <Box sx={{ mt: 2, ml: 2 }}>
            <DarkModeSwitch darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </Box>
          <Header text="O.D. 721 - LEY DE FICHA LIMPIA" />
          <Loader />
        </div>
            )
          : camara === TYPE_SENADORES && (!results?.senadores || !votacionSenadores)
            ? (
        <p className="no-data-text">
          No hay información disponible aún para la Cámara de Senadores.
        </p>
              )
            : (
        <div className="app">
          <Box sx={{ mt: 2, ml: 2 }}>
            <DarkModeSwitch darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </Box>
          <Header text="O.D. 721 - LEY DE FICHA LIMPIA" />
          <Box mb={4}>
            <Tabs handleType={handleType} activeTab={activeTab} />
          </Box>
          <Hemicycle
            type={activeTab}
            results={data}
            camara={camara}
            fuenteVotos={fuenteVotos}
          />
          <Legend
            handleType={handleType}
            activeTab={activeTab}
            results={data}
            camara={camara}
            fuenteVotos={fuenteVotos}
          />
        </div>
              )}
    </ThemeProvider>
  )
}

export default App
