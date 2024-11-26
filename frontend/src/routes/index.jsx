import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../components/Layout/MainLayout'
import HomePage from '../pages/HomePage'
import NotFound from '../pages/NotFound'

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes