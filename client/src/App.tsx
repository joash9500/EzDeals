import './index.css'
import Home from './components/Home'
import About from './components/About';
import Navbar from './components/Navbar';
import {Users} from './components/Users';
import {Login} from './components/Login';
import Signup from './components/Signup';
import { AddListing } from './components/AddListing';
// npm install react-router-dom
import {
  Routes,
  Route,
} from "react-router-dom";
import ListingItem from './components/ListingItem';

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/about' element={<About></About>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route path='/users'>
          <Route index element={<Users user_id={5}></Users>}></Route>
          <Route path=':username' element={<Users user_id={5}></Users>}></Route>
        </Route>
        <Route path="/deals/add" element={<AddListing></AddListing>}></Route>
        <Route path="/listing/item" element={<ListingItem></ListingItem>}></Route>
      </Routes>
    </div>
  );
}

export default App;