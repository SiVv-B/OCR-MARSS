import React,{ useState } from 'react'
import axios from "axios"
import "./ForgotPasswordScreen.css"

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const forgotPasswordHandler = async (e) => {
    e.preventDefault()

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    }
    try {
      const { data } = await axios.post(
        "/api/auth/forgotpassword",
        { email },
        config
      )

      setSuccess(data.data)
    } catch (error) {
      setError(error.response.data.error)
      setEmail("")
      setTimeout(() => {
        setError("")
      }, 5000)
    }
  }

  return (
    <div className="forgotpassword-screen">
      <form
        onSubmit={forgotPasswordHandler}
        className="forgotpassword-screen__form"
      >
        <h3 className="forgotpassword-screen__title">Mot de passe oublié</h3>
        {error && <span className="error-message">{error}</span>}
        {success && <span className="success-message">{success}</span>}
        <div className="form-group">
          <p className="forgotpassword-screen__subtext">
              Veuillez entrer l'email avec lequel vous vous identifier. 
              On vous enverra un nouveau mot de passe à cette adresse.
          </p>
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
        <button type="submit" className="btn btn-primary">
          Envoyer l'email
        </button>
      </form>
    </div>
  )
}

export default ForgotPasswordScreen