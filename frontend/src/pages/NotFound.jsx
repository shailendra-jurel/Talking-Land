// pages/NotFound.jsx

import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h5" mb={2}>Page Not Found</Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Go Home
      </Button>
    </Box>
  )
}

export default NotFound