import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import styles from '../styles/NewStory.module.css';
import { useNavigate, useParams } from 'react-router-dom';
function NewStory() {
    const { id, boardId } = useParams();
    const navigate = useNavigate();
    const [storyName, setStoryName] = useState("");
    const [description, setdescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [priority, setpriority] = useState("Low");
    const [isLoaded, setIsLoaded] = useState(false);
    const [firstColumn, setFirstColumn] = useState("");
    useEffect(() => {
        const fetchContext = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                // Using your getMemetc function endpoint
                const res = await fetch(`http://localhost:5000/api/task/${id}/board/${boardId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok && data.board?.columns?.length > 0) {
                    setFirstColumn(data.board.columns[0].name);
                }
            }
            catch (error) {
                console.error("Failed to load board context", error);
            }
        };
        fetchContext();
    }, [id]);
    const handleCreate = async () => {
        if (!storyName.trim()) {
            alert("Please enter a story name");
            return;
        }
        const token = localStorage.getItem("accessToken");
        const storyData = {
            name: storyName,
            description: description,
            type: 'Story',
            priority: priority,
            column: firstColumn || "To Do",
            kanban: boardId,
            deadline: deadline || null,
        };
        try {
            const response = await fetch(`http://localhost:5000/api/task/create/${boardId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(storyData)
            });
            if (response.ok) {
                alert(`Story "${storyName}" created successfully!`);
                navigate(`/project/${id}/board/${boardId}`);
            }
            else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        }
        catch (error) {
            console.error("Save error", error);
            alert("Server connection failed");
        }
        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    };
    const handleDiscard = () => {
        navigate(-1);
    };
    return (_jsxs("div", { className: styles.backgnd, children: [_jsx("h1", { children: "Create Story" }), _jsxs("div", { className: styles.card, children: [_jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Story Name" }), _jsx("input", { type: 'text', className: styles.inputField, value: storyName, onChange: (e) => setStoryName(e.target.value) })] }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Deadline" }), _jsx("input", { type: 'date', className: styles.inputField, onChange: (e) => setDeadline(e.target.value) })] }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Priority" }), _jsxs("select", { className: styles.inputField, value: priority, onChange: (e) => setpriority(e.target.value), children: [_jsx("option", { value: "Low", children: "Low" }), _jsx("option", { value: "Medium", children: "Medium" }), _jsx("option", { value: "High", children: "High" }), _jsx("option", { value: "Critical", children: "Critical" })] })] }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Description" }), _jsx("textarea", { className: styles.inputFieldd, value: description, onChange: (e) => setdescription(e.target.value) })] }), _jsxs("div", { className: styles.bottom, children: [_jsx("button", { type: "button", className: styles.DiscardBtn, onClick: (handleDiscard), children: "Discard" }), _jsx("button", { type: "button", className: styles.submitBtn, onClick: handleCreate, children: "Save" })] })] })] }));
}
export default NewStory;
