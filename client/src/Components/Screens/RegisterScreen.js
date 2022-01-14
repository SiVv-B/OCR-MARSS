import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import './RegisterScreen.css'

const RegisterScreen = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

//Once the user is registred, they will not go again to the register page
useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/")
    }
  }, [navigate])

  const registerHandler = async (e) => {
    e.preventDefault()
//config variable for axios  
    const config = {
      header: {
        'Content-Type': 'application/json',
      },
    }
    if (password !== confirmpassword) {
      setPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        setError('')
      }, 5000)
      return setError('Les mots de passe ne correspondent pas')
    }
//axios request
    try {
      const { data } = await axios.post(
        '/api/auth/register',
        {
          username,
          email,
          password,
        },
        config,
      )
//Once the request sent we will recieve a Token in the localstorage
      localStorage.setItem('authToken', data.token)
      console.log("the user is registred")
      navigate('/')
    } catch (error) {
      console.log("the user is NOT registred")
      console.log(error)
      setError(error.response.data.error)
      setTimeout(() => {
        setError('')
      }, 5000)
    }
  }

  return (
    <div className="register-screen">
      <form onSubmit={registerHandler} className="register-screen__form">
        <h3 className="register-screen__title">S'insrire</h3>
        {/* If there is an error in the state, create a span and log that error */}
        {error && <span className="error-message">{error}</span>}
        <div className="form-group">
          <label htmlFor="name">Nom d'utilisateur:</label>
          <input
            type="text"
            required
            id="name"
            placeholder="Entrer un nom d\'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            required
            id="email"
            placeholder="Email "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            required
            id="password"
            autoComplete="true"
            placeholder="Entrer Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmpassword">Confirmez le mot de pass:</label>
          <input
            type="password"
            required
            id="confirmpassword"
            autoComplete="true"
            placeholder="Confirmer le mot de pass"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          S'inscrire
        </button>

        <span className="register-screen__subtext">
          Vous Avez déjà un compte ? <Link to="/login">s'identifier</Link>
        </span>
      </form>
    </div>
  )
}

export default RegisterScreen
