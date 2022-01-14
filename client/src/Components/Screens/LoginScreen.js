import React from 'react'
import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import "./LoginScreen.css"
import {useNavigate} from 'react-router-dom'
const LoginScreen = () => {
const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
//Once the user is loggedin, they will not go again to the login page
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/")
    }
  }, [navigate])
 

  const loginHandler = async (e) => {
    e.preventDefault()

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    }

    try {
      const { data } = await axios.post(
        "/api/auth/login",
        { email, password },
        config
      )

      localStorage.setItem("authToken", data.token)

      navigate("/")
    } catch (error) {
      setError(error.response.data.error)
      setTimeout(() => {
        setError("")
      }, 5000)
    }
  }

  return (
    <div className="login-screen">
      <form onSubmit={loginHandler} className="login-screen__form">
        <h3 className="login-screen__title">S'identifier</h3>
        {error && <span className="error-message">{error}</span>}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            required
            id="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            tabIndex={1}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">
            Mot de pass:{" "}
            <Link to="/forgotpassword" className="login-screen__forgotpassword"
            tabIndex={4}>
              Vous avez oublié votre mot de pass?
            </Link>
          </label>
          <input
            type="password"
            required
            id="password"
            autoComplete="true"
            placeholder="Entrez votre mot de pass"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            tabIndex={2}
          />
        </div>
        <button type="submit" className="btn btn-primary" tabIndex={3}>
          Se connecter
        </button>

        <span className="login-screen__subtext">
          Vous n'avez pas de compte?  <Link to="/register">S'enregistrer</Link>
        </span>
      </form>
    </div>
  )
}

export default LoginScreen