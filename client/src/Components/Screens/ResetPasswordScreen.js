import React from 'react'
import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

import "./ResetPasswordScreen.css"

const ResetPasswordScreen = ({ match }) => {
  console.log({match},'match')
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const resetPasswordHandler = async (e) => {
    e.preventDefault()

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    }

    if (password !== confirmPassword) {
      setPassword("")
      setConfirmPassword("")
      setTimeout(() => {
        setError("")
      }, 5000)
      return setError("Les mots de passe ne sont pas identiques")
    }

    try {
      const { data } = await axios.put(
    //this following witll add a params and add it to the backend route
        `/api/auth/resetPassword/${match.params.resetToken}`,
        {
          password,
        },
        config
      )
      console.log(data,"data of resetPassword")
      setSuccess(data.data);
    } catch (error) {
      setError(error.response.data.error)
      console.log(error.response.data.error,"data of resetPassword")
      setTimeout(() => {
        setError("")
      }, 5000)
    }
  }

  return (
    <div className="resetpassword-screen">
      <form
        onSubmit={resetPasswordHandler}
        className="resetpassword-screen__form"
      >
        <h3 className="resetpassword-screen__title">Mot de passe oublié</h3>
        {error && <span className="error-message">{error} </span>}
        {success && (
          <span className="success-message">
            {success} <Link to="/login">S'identifier</Link>
          </span>
        )}
        <div className="form-group">
          <label htmlFor="password">Nouveau Mot de pass:</label>
          <input
            type="password"
            required
            id="password"
            placeholder="Entrer le nouveau mot de pass"
            autoComplete="true"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmpassword">CConfirmer le nouveau mot de pass:</label>
          <input
            type="password"
            required
            id="confirmpassword"
            placeholder="Confirmer le nouveau mot de pass"
            autoComplete="true"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Enregistrer le nouveau mot de pass
        </button>
      </form>
    </div>
  )
}

export default ResetPasswordScreen