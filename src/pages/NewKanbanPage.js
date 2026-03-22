import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import styles from '../styles/NewKanban.module.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
function Kanban() {
    const { id } = useParams();
    const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [BoardName, setBoardName] = useState("");
    const [description, setdescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [priority, setpriority] = useState("Low");
    const navigate = useNavigate(); //
    const handleCreateBoard = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`http://localhost:5000/api/board/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                projId: id,
                name: BoardName,
                description: description,
                deadline: deadline,
                priority: priority,
            })
        });
        if (response.ok)
            navigate(`/project/${id}`);
    };
    return (_jsx("div", { className: styles.backgnd, children: _jsxs("div", { className: styles.card, children: [_jsx("h1", { children: "Create Board" }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Board Name" }), _jsx("input", { type: 'text', className: styles.inputField, onChange: (e) => setBoardName(e.target.value) })] }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Deadline" }), _jsx("input", { type: 'date', className: styles.inputField, onChange: (e) => setDeadline(e.target.value) })] }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Priority" }), _jsxs("select", { className: styles.inputField, onChange: (e) => setpriority(e.target.value), children: [_jsx("option", { value: "Low", children: "Low" }), _jsx("option", { value: "Medium", children: "Medium" }), _jsx("option", { value: "High", children: "High" }), _jsx("option", { value: "Critical", children: "Critical" })] })] }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Description" }), _jsx("textarea", { className: styles.inputFieldd, onChange: (e) => setdescription(e.target.value) })] }), _jsx("button", { type: "submit", className: styles.submitBtn, onClick: handleCreateBoard, children: "Create" })] }) }));
}
export default Kanban;
