import React from 'react'
import { Box, Container } from '@mui/material'
import { styled } from '@mui/material/styles'

const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}))

const ContentContainer = styled(Container)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
}))

const MainLayout = ({ children }) => {
  return (
    <MainContainer>
      <ContentContainer maxWidth="xl">
        {children}
      </ContentContainer>
    </MainContainer>
  )
}

export default MainLayout