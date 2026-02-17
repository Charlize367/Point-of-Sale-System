import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.css'
import POS from './pages/POS'
import Login from './pages/Login'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
    <BrowserRouter>
    
            <Routes>
                <Route exact path="/login" element={<Login/>} />
                <Route exact path="/" element={<ProtectedRoute allowedRoles={["ADMIN", "STAFF", "MANAGER"]}><POS /></ProtectedRoute>} />
            </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App
