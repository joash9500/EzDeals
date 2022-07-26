import React from 'react';
import './App.css';
// npm install react-router-dom
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from './pages/Home'
import About from './pages/About';
import Users from './pages/Users';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home></Home>}></Route>
            <Route path='/about' element={<About></About>}></Route>
            <Route path='/users'>
              <Route index element={<Users></Users>}></Route>
              <Route path=':username' element={<Users></Users>}></Route>
            </Route>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;