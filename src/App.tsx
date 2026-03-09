
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/LoginPage'; // Import the file you made
import styles from './styles/Navigation.module.css'
import Register from './pages/RegisterPage';
import Home from './pages/HomePage'
import Dashboard from './pages/Dashboard';
import Toolbar from './components/Toolbar'; // Import your new component
import ProfilePage from './pages/ProfilePage';
import NewProject from './pages/NewProjPage';
import Project from './pages/ProjectsPage'
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
        <Route path= "/profile" element= {<ProfilePage/>} />
        <Route path= "/NewProj" element= {<NewProject/>} />
        <Route path= "/Projects" element= {<Project/>} />
      </Routes>
    </>
   
  );
}
export default App