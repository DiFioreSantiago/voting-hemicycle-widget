import React from 'react'
import { CircularProgress, Box, Typography } from '@mui/material'

const Loader = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    mt={4}
  >
    <CircularProgress color="primary" size={48} />
    <Typography variant="body2" mt={2}>
      Cargando información desde la API...
    </Typography>
  </Box>
)

export default Loader
