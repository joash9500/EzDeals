import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'

function Navbar() {

  const navigate = useNavigate()
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false)

  //check if session exists everytime this page loads.
  useEffect(() => {
    axios.get('/api/sessions').then((res) => {
      const currentSession = res.data.sessionData
      //check if cookie data 'email' exists, otherwise user is not logged in
      if (currentSession.email !== undefined) {
        //user is logged in
        setLoggedIn(true)
      } else {
        //user is NOT logged in
        setLoggedIn(false)
      }
    })
  })

  //redirect to login form
  const login = () => {
    navigate('/login')
  }

  //destroy the session cookies
  const logout = () => {
    setLoggedIn(false)
    axios.delete('/api/sessions').then((res) => console.log('session ended', res))
  }

  //styling for nav bar links
  let activeStyle = {
    textDecoration: "underline",
  };

  let inactiveStyle = {
    textDecoration: "none",
  };

  return (
    <div className='navbar'>
      <NavLink to="/" style={({ isActive }) =>
        isActive ? activeStyle : inactiveStyle
      }>Home</NavLink>
      <NavLink to="/about" style={({ isActive }) =>
        isActive ? activeStyle : inactiveStyle
      }>About</NavLink>
      {isLoggedIn ? <NavLink to="/deals/add" style={({ isActive }) => isActive ? activeStyle : inactiveStyle}>Add New</NavLink> : null}
      {isLoggedIn ? null : <NavLink to="/signup" style={({ isActive }) => isActive ? activeStyle : inactiveStyle}>Sign Up</NavLink> }
      {isLoggedIn ? <button onClick={logout}>Logout</button> : <button onClick={login}>Login</button>}
    </div> 
  )
}

export default Navbar