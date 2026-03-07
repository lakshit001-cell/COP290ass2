
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/LoginPage'; // Import the file you made
import styles from './styles/Navigation.module.css'
import Register from './pages/RegisterPage';
import Home from './pages/HomePage'
import Dashboard from './pages/Dashboard';
import Toolbar from './components/Toolbar'; // Import your new component
function App() {
  return (
    <>
      <Toolbar/>
    
    
      

      {/* The Switch Logic */}
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path= "/Dashboard" element= {<Dashboard />} />
        
        
      </Routes>
    </>
   
  );
}
export default App