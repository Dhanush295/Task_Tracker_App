import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Landing from "./components/Landing";
import AppBar from "./components/Appbar";


function App() {
    return (
    <div>
      <Router>
      <AppBar></AppBar>
        <Routes>
          <Route path ={'/'} element= {<Login/>}></Route>
          <Route path ={'/signup'} element= {<Signup/>}></Route>
          <Route path ={'/home'} element= {<Landing/>}></Route>
          
        </Routes>
      </Router>
    </div>
  )
}

export default App
