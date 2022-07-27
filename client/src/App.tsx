import React from 'react';
import './App.css';
// npm install react-router-dom
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from './components/Home'
import About from './components/About';
import Users from './components/Users';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home></Home>}></Route>
            <Route path='/about' element={<About></About>}></Route>
            <Route path='/users'>
              <Route index element={<Users user_id={5}></Users>}></Route>
              <Route path=':username' element={<Users user_id={5}></Users>}></Route>
            </Route>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;