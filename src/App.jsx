import { React } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import AuthenticationPage from './pages/Authentication/AuthenticationPage'
import SignUpPage from './pages/Authentication/SignUpPage'

function App() {

  return (
    <Routes>
      <Route path='/' element={< HomePage />} />
      <Route path='/home' element={< HomePage />} />
      <Route path='/auth' element={< AuthenticationPage />} />
      <Route path='/signup' element={< SignUpPage />} />
    </Routes>
  )
}

export default App