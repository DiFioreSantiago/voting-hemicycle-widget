import React from 'react'
import PropTypes from 'prop-types'
import { Tabs as MuiTabs, Tab } from '@mui/material'
import { TYPE_VOTOS, TYPE_PARTIDOS } from '../../consts'

const Tabs = ({ handleType, activeTab }) => {
  const handleChange = (event, newValue) => {
    handleType(newValue)
  }

  return (
    <MuiTabs
      value={activeTab}
      onChange={handleChange}
      centered
      textColor="primary"
      indicatorColor="primary"
    >
      <Tab label="Por Votos" value={TYPE_VOTOS} />
      <Tab label="Por Partidos" value={TYPE_PARTIDOS} />
    </MuiTabs>
  )
}

Tabs.propTypes = {
  handleType: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired
}

export default Tabs
