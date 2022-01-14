import React from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
//Routing
import PrivateRoute from './Components/Routing/PrivateRoute'
//Screens
import PrivateScreen from './Components/Screens/PrivateScreen'
import LoginScreen from './Components/Screens/LoginScreen'
import RegisterScreen from './Components/Screens/RegisterScreen'
import ForgotPasswordScreen from './Components/Screens/ForgotPasswordScreen'
import ResetPasswordScreen from './Components/Screens/ResetPasswordScreen'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                {' '}
                <PrivateScreen />{' '}
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/forgotpassword" element={<ForgotPasswordScreen />} />
          <Route
            path="/resetPassword/:resetToken"
            element={<ResetPasswordScreen />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
