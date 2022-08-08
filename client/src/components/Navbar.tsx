import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom'

import {Button, Stack} from '@mui/material';
import {AppBar} from '@mui/material';
import {Toolbar} from '@mui/material';
import {Typography} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';


declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: React.CSSProperties['color'];
    };
  }

  interface Palette {
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }

  interface PaletteColor {
    darker?: string;
  }
  interface SimplePaletteColorOptions {
    darker?: string;
  }
  interface ThemeOptions {
    status: {
      danger: React.CSSProperties['color'];
    };
  }
}

const theme = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    primary: {
      main: '#006064',
    },
    neutral: {
      main: '#64748B',
    },
    secondary: {
      main: '#e8f5e9'
    }
  },
});


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
    <div>
      <ThemeProvider theme={theme}>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h4' component='div' sx={{ flexGrow: 1}}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Thrifty</Link>
            </Typography>
            <Stack direction="row" spacing={2}>
              <NavLink to="/" style={({ isActive }) => isActive ? activeStyle : inactiveStyle}><Typography>Home</Typography></NavLink>
              <NavLink to="/about" style={({ isActive }) => isActive ? activeStyle : inactiveStyle}><Typography>About</Typography></NavLink>
              {isLoggedIn ? <NavLink to="/deals/add" style={({ isActive }) => isActive ? activeStyle : inactiveStyle}><Typography>Add New</Typography></NavLink> : null}
              {isLoggedIn ? <NavLink to="/user" style={({ isActive }) => isActive ? activeStyle : inactiveStyle}><Typography>Profile</Typography></NavLink> : null}
            
              {isLoggedIn ? null : <NavLink to="/signup" style={({ isActive }) => isActive ? inactiveStyle : inactiveStyle}>
                  <Button size='small' variant='contained' color='secondary'>Sign Up</Button></NavLink> }
              {isLoggedIn ? <Button onClick={logout} size='small' variant='contained' color='secondary'>Logout</Button> : 
                <Button onClick={login} size='small' variant='contained' color="secondary">Login</Button>} 
            </Stack>
          </Toolbar>
        </AppBar>
      </ThemeProvider>

    </div> 
  )
}

export default Navbar