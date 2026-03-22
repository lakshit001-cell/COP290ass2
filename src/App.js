import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage'; // Import the file you made
import Register from './pages/RegisterPage';
import Home from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Toolbar from './components/Toolbar'; // Import your new component
import ProfilePage from './pages/ProfilePage';
import NewProject from './pages/NewProjPage';
import Project from './pages/ProjectsPage';
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
    const [accessToken, setAccessToken] = useState(null);
    useEffect(() => {
        const refresh = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/auth/refresh", {
                    method: 'POST',
                    credentials: 'include'
                });
                if (!response.ok) {
                    localStorage.removeItem("user");
                    localStorage.removeItem("accessToken");
                    return;
                }
                const data = await response.json();
                setAccessToken(data.accessToken);
            }
            catch (error) {
                console.error({ message: "Token refresh Fail." });
            }
        };
        refresh();
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx(Toolbar, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/Register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/Dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/profile", element: _jsx(ProfilePage, {}) }), _jsx(Route, { path: "/NewProj", element: _jsx(NewProject, {}) }), _jsx(Route, { path: "/Projects", element: _jsx(Project, {}) }), _jsx(Route, { path: "/project/:id", element: _jsx(ProjectDash, {}) }), _jsx(Route, { path: "/project/:id/members", element: _jsx(Members, {}) }), _jsx(Route, { path: "/project/:id/settings", element: _jsx(Settings, {}) }), _jsx(Route, { path: "/CompletedProjects", element: _jsx(CompletedProject, {}) }), _jsx(Route, { path: "/project/:id/kanbanBoard", element: _jsx(Kanban, {}) }), _jsx(Route, { path: "/project/:id/board/:boardId", element: _jsx(KanbanDash, {}) }), "\"", _jsx(Route, { path: "/project/:id/board/:boardId/new-task", element: _jsx(NewTask, {}) }), _jsx(Route, { path: "/project/:id/board/:boardId/Manage", element: _jsx(ManageColumn, {}) }), _jsx(Route, { path: "/project/:id/board/:boardId/task/:taskId", element: _jsx(TaskDash, {}) }), _jsx(Route, { path: "/project/:id/board/:boardId/new-story", element: _jsx(NewStory, {}) }), _jsx(Route, { path: "/Notifications", element: _jsx(Notification, {}) })] })] }));
}
export default App;
