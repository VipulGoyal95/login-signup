import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import ForgotPassword from './Forgotpassword';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Signup/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="/forgotpassword" element={<ForgotPassword/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
