import './index.css'
import Home from './pages/Home'
import About from './pages/About';
import Navbar from './components/Navbar';
import {User} from './components/User';
import {Login} from './pages/Login';
import Signup from './pages/Signup';
import { AddListing } from './pages/AddListing';
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
        <Route path='/user' element={<User></User>}>
          <Route index element={<User></User>}></Route>
          <Route path='account' element={<User></User>}></Route>
        </Route>
        <Route path="/deals/add" element={<AddListing></AddListing>}></Route>
        <Route path="/listing/item" element={<ListingItem></ListingItem>}></Route>
      </Routes>
    </div>
  );
}

export default App;