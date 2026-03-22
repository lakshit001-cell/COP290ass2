import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import styles from '../styles/CompletedProj.module.css';
import { useNavigate } from 'react-router-dom';
function CompletedProject() {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate(); //
    useEffect(() => {
        // Fetch projects from your storage
        const fetchProjects = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const response = await fetch('http://localhost:5000/api/project/completed', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                setProjects(data);
            }
            catch (error) {
                console.error({ message: "Fetch error", error });
            }
        };
        fetchProjects();
    }, []);
    const priorityColor = {
        High: "#ff4d4d", // Red
        Medium: "#ffcc00", // Yellow
        Low: "#28a745" // Green
    };
    return (_jsxs("div", { className: styles.backgnd, children: [_jsx("h1", { className: styles.title, children: " Completed Projects" }), _jsx("div", { className: styles.grid, children: projects.map((proj) => (_jsxs("div", { className: styles.card, children: [_jsx("div", { className: styles.priorityCorner, children: _jsx("span", { className: styles.dot, style: { backgroundColor: priorityColor[proj.priority] } }) }), _jsx("div", { children: _jsx("h1", { children: proj.name }) }), _jsx("div", { className: styles.projdes, children: proj.description }), _jsx("div", { className: styles.bottom, children: _jsx("span", { children: proj.deadline.split('T')[0] }) }), _jsx("div", { className: styles.center, children: _jsx("button", { className: styles.EnterBtn, onClick: () => {
                                    if (currentUser.GlobalRole === 'Admin') {
                                        navigate(`/project/${proj._id}`);
                                    }
                                }, children: "Enter" }) })] }, proj._id))) })] }));
}
export default CompletedProject;
