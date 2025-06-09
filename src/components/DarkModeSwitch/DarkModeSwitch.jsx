/* eslint-disable react/prop-types */
import React from 'react'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import './DarkModeSwitch.css'

const DarkModeSwitch = ({ darkMode, toggleDarkMode }) => (
  <FormControlLabel
    control={
      <Switch
        checked={darkMode}
        onChange={toggleDarkMode}
        className="ios-switch"
      />
    }
    label="Modo oscuro"
    className="darkmode-label"
  />
)

export default DarkModeSwitch
