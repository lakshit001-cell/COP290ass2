import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import styles from '../styles/Projects.module.css';
import { useNavigate } from 'react-router-dom';
function Project() {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate(); //
    useEffect(() => {
        // Fetch projects from storage
        const fetchProjects = async () => {
            console.log("getting token");
            const token = localStorage.getItem("accessToken");
            console.log("fetching");
            try {
                const response = await fetch("http://localhost:5000/api/project/user-projects", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                const data = await response.json();
                setProjects(data);
                console.log("set data");
            }
            catch (error) {
                console.error("project fetch Fail", error);
            }
        };
        fetchProjects();
    }, []);
    const priorityColor = {
        High: "#ff4d4d", // Red
        Medium: "#ffcc00", // Yellow
        Low: "#28a745" // Green
    };
    return (_jsxs("div", { className: styles.backgnd, children: [_jsx("h1", { className: styles.title, children: " Your Projects" }), _jsx("div", { className: styles.grid, children: projects.map((proj) => (_jsxs("div", { className: styles.card, children: [_jsx("div", { className: styles.priorityCorner, children: _jsx("span", { className: styles.dot, style: { backgroundColor: priorityColor[proj.priority] } }) }), _jsx("div", { children: _jsx("h1", { children: proj.name }) }), _jsx("div", { className: styles.projdes, children: proj.description }), _jsx("div", { className: styles.bottom, children: _jsx("span", { children: proj.deadline.split('T')[0] }) }), _jsx("div", { className: styles.center, children: _jsx("button", { className: styles.EnterBtn, onClick: () => navigate(`/project/${proj._id}`), children: "Enter" }) })] }, proj._id))) })] }));
}
export default Project;
