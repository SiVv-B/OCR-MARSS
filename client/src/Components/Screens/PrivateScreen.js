import React from 'react'
import { useState, useEffect } from "react"
import axios from "axios"
import {useNavigate} from 'react-router-dom'


const PrivateScreen = () => {
  const navigate = useNavigate()

  const [error, setError] = useState("")
  const [privateData, setPrivateData] = useState("")

  useEffect(() => {
      if(!localStorage.getItem('authToken')){
        navigate("/login")
      }
    const fetchPrivateDate = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }

      try {
        const { data } = await axios.get("/api/private", config)
        setPrivateData(data.data)
        console.log("privateScreen, autentification réussie")
      } catch (error) {
        console.log(error, "privateScreen, autentification échouéé")
          //if there is an error, it means the token is invalid
        localStorage.removeItem("authToken")
        setError("Vous ne pouvez pas accéder à cette page sans identifiants")
    //it's possible to redirect the user to the register page 
    } 
    }

    fetchPrivateDate()
  }, [navigate])

  const logoutHandler = () =>{
      localStorage.removeItem("authToken")
      navigate("/login")
  }

  return error ? (
      //if the page is loaded and there is an error, we respond with this span
    <span className="error-message">{error}</span>
  ) : (
      <>
    <div
    style={{backgroundColor:'green', color:'white'}}
    >{privateData}
    </div>
    <button onClick={logoutHandler}>Se déconnecter</button>
    </>
  )
}

export default PrivateScreen 