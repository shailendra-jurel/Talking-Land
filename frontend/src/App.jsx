// src/App.jsx
import React from 'react'
import { BrowserRouter as Router , Routes , Route} from 'react-router-dom'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify' // 
import 'react-toastify/dist/ReactToastify.css'

import { store } from './store/store'  
import MainLayout from './components/MainLayout'
import HomePage from './pages/HomePage'



function App() {
  return (
    <Provider store={store}>  
        <Router>
            <Routes>
              <Route path="/"  element={  <MainLayout>   <HomePage />   </MainLayout> }   />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </Router>
    </Provider>
  )
}
export default App