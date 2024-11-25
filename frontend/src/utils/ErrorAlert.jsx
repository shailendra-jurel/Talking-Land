import React from 'react'
import { Alert, Box } from '@mui/material'

const ErrorAlert = ({ message }) => {
  return (
    <Box mt={2} mb={2}>
      <Alert severity="error">{message}</Alert>
    </Box>
  )
}

export default ErrorAlert