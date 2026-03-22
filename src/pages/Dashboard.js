import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import styles from '../styles/Dashboard.module.css';
function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            const resProj = await fetch("http://localhost:5000/api/project/user-projects", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            const resTask = await fetch("http://localhost:5000/api/task/tasks/my", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            const dataProj = await resProj.json();
            setProjects(Array.isArray(dataProj) ? dataProj : []);
            const dataTask = await resTask.json();
            setTasks(Array.isArray(dataTask) ? dataTask : []);
        };
        fetchData();
    }, []);
    const crits = tasks.filter(t => t.priority === 'Critical').length;
    return (_jsxs("div", { className: styles.backgnd, children: [_jsx("h1", { children: "WELCOME BACK _" }), _jsxs("div", { className: styles.card, children: [_jsx("h2", { children: "Your Stats " }), _jsxs("p", { children: [" Total Projects : ", _jsx("strong", { children: projects.length })] }), _jsxs("p", { children: ["Total Tasks : ", _jsx("strong", { children: tasks.length })] }), _jsxs("p", { children: ["Critical Tasks : ", _jsx("strong", { children: crits })] })] }), _jsxs("div", { className: styles.listsContainer, style: { display: 'flex', gap: '20px', marginTop: '20px' }, children: [_jsxs("div", { className: styles.card, style: { flex: 1 }, children: [_jsx("h3", { children: "My Projects" }), _jsxs("ul", { children: [projects.map(proj => (_jsx("li", { children: proj.name }, proj._id))), projects.length === 0 && _jsx("li", { children: "No projects found." })] })] }), _jsxs("div", { className: styles.card, style: { flex: 1 }, children: [_jsx("h3", { children: "Assigned Tasks" }), _jsxs("ul", { children: [tasks.map(task => (_jsxs("li", { children: [task.name, task.priority === 'High' && _jsx("span", { style: { color: 'red', marginLeft: '10px' }, children: "[!]" })] }, task._id))), tasks.length === 0 && _jsx("li", { children: "No tasks assigned." })] })] })] })] }));
}
export default Dashboard;
