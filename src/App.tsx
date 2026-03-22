
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
import ProjectDash from './pages/ProjectDashPage';
import Members from './pages/ProjMembersPage';
import Settings from './pages/ProjsettingsPage';
import CompletedProject from './pages/CompletedProjPage';
import Kanban from './pages/NewKanbanPage';
import KanbanDash from './pages/KanbandashPage';
import NewTask from './pages/NewTaskPage';
import ManageColumn from './pages/ManageColumnPage';
import TaskDash from './pages/TaskDashPage';
import NewStory from './pages/NewStoryPage';
import Notification from './pages/NotificationPage';
import { useEffect, useState } from 'react';
function App() {

  const[accessToken, setAccessToken] =useState<string | null>(null);

  useEffect(() => {
    const refresh = async () => {
      try{
        const response = await fetch("http://localhost:5000/api/auth/refresh", {
          method: 'POST',
          credentials: 'include'
        });

        
        if(!response.ok){
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
          return;
          
        }
        const data = await response.json();
        setAccessToken(data.accessToken)
        
        
      }catch(error){
        console.error({message: "Token refresh Fail."})
      }
    };
    refresh();
  }, []);


  return (
    <>
      <Toolbar/>
    
    
      

      {/* The Switch Logic */}
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Dashboard" element= {<Dashboard />} />
        <Route path="/profile" element= {<ProfilePage/>} />
        <Route path="/NewProj" element= {<NewProject/>} />
        <Route path="/Projects" element= {<Project/>} />
        <Route path="/project/:id" element={<ProjectDash />} />
        <Route path="/project/:id/members" element={<Members />} />
        <Route path="/project/:id/settings" element={<Settings />} />
        <Route path="/CompletedProjects" element={<CompletedProject />} />
        <Route path="/project/:id/kanbanBoard" element={<Kanban />} />
        <Route path="/project/:id/board/:boardId" element={<KanbanDash />} />" 
        <Route path="/project/:id/board/:boardId/new-task" element={<NewTask />} />
        <Route path="/project/:id/board/:boardId/Manage" element={<ManageColumn />} />
        <Route path="/project/:id/board/:boardId/task/:taskId" element={<TaskDash />} />
        <Route path="/project/:id/board/:boardId/new-story" element={<NewStory />} />
        <Route path="/Notifications" element= {<Notification/>} />
        

      </Routes>
    </>
   
  );
}
export default App