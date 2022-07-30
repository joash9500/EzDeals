import { NavLink, Link } from 'react-router-dom'

function Navbar() {

    let activeStyle = {
        textDecoration: "underline",
    };

    let inactiveStyle = {
        textDecoration: "none",
    };
      
    return (
        <nav>
            <NavLink to="/" style={({ isActive }) =>
              isActive ? activeStyle : inactiveStyle
            }>Home</NavLink>
            <NavLink to="/about" style={({ isActive }) =>
              isActive ? activeStyle : inactiveStyle
            }>About</NavLink>
        </nav>   
    )
}

export default Navbar