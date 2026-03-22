import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from '../styles/NewProj.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; //
function NewProject() {
    const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [ProjectName, setProjectName] = useState("");
    const [description, setdescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [priority, setpriority] = useState("Low");
    const navigate = useNavigate(); //
    const handleCreate = async (e) => {
        e.preventDefault(); // Prevents page reload
        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.error("No Access Token found");
            return;
        }
        try {
            const response = await fetch("http://localhost:5000/api/project/new-project", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: ProjectName,
                    deadline: deadline,
                    priority: priority,
                    description: description,
                })
            });
            const data = await response.json();
            if (!response.ok) {
                console.error("Error creating project", data.error);
            }
            else {
                // 2. Fetch existing projects or start an empty array
                // const existingProjects = JSON.parse(localStorage.getItem("projects") || "[]");
                // // 3. Add the new project to the list and save back to storage
                // const updatedProjects = [...existingProjects, newProject];
                // localStorage.setItem("projects", JSON.stringify(updatedProjects));
                navigate('/Projects');
            }
        }
        catch (error) {
            console.error("API/connection error", error);
        }
    };
    //checking admin role from local storage is unsafe as anyone can change it using inspect console.
    if (existingUser.GlobalRole !== 'Admin') {
        return _jsx("h1", { className: styles.text, children: "Access Denied: Admins Only" });
    }
    return (_jsx("div", { className: styles.backgnd, children: _jsxs("div", { className: styles.card, children: [_jsx("h1", { children: "Create Project" }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Project Name" }), _jsx("input", { type: 'text', className: styles.inputField, onChange: (e) => setProjectName(e.target.value) })] }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Deadline" }), _jsx("input", { type: 'date', className: styles.inputField, onChange: (e) => setDeadline(e.target.value) })] }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Priority" }), _jsxs("select", { className: styles.inputField, onChange: (e) => setpriority(e.target.value), children: [_jsx("option", { value: "Low", children: "Low" }), _jsx("option", { value: "Medium", children: "Medium" }), _jsx("option", { value: "High", children: "High" })] })] }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Description" }), _jsx("textarea", { className: styles.inputFieldd, onChange: (e) => setdescription(e.target.value) })] }), _jsx("button", { type: "submit", className: styles.submitBtn, onClick: handleCreate, children: "Create" })] }) }));
}
export default NewProject;
