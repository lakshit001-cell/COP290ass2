import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import styles from '../styles/NewTask.module.css';
import { useNavigate, useParams } from 'react-router-dom';
function NewTask() {
    const { id, boardId } = useParams();
    const navigate = useNavigate();
    const [taskType, setTaskType] = useState('Task');
    const [taskName, setTaskName] = useState("");
    const [description, setdescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [priority, setpriority] = useState("Low");
    const [assignedTo, setAssignedTo] = useState("Unassigned");
    const [selectedStoryId, setSelectedStoryId] = useState("");
    const [targetColumnName, setTargetColumnName] = useState("");
    // Data from LocalStorage
    const [projectMembers, setProjectMembers] = useState([]);
    const [stories, setStories] = useState([]);
    const [columns, setColumns] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            const header = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            try {
                const resProject = await fetch(`http://localhost:5000/api/project/${id}`, { headers: header });
                const projData = await resProject.json();
                const resBoard = await fetch(`http://localhost:5000/api/task/${id}/board/${boardId}`, { headers: header });
                const boardData = await resBoard.json();
                if (resBoard.ok && resProject.ok) {
                    setProjectMembers(projData.members || []);
                    setStories(boardData.stories || []);
                    setColumns(boardData.board.columns);
                    if (boardData.board.columns && boardData.board.columns.length > 0) {
                        setTargetColumnName(boardData.board.columns[0].name);
                    }
                    setIsLoaded(true);
                }
            }
            catch (error) {
                console.error("fetch fail", error);
            }
        };
        fetchData();
    }, [id, boardId]);
    const handleCreate = async () => {
        if (!taskName.trim() || !targetColumnName) {
            alert("Please enter a name and select a column");
            return;
        }
        const token = localStorage.getItem("accessToken");
        const newTask = {
            type: taskType, // "Task" | "Bug"
            name: taskName,
            story: "",
            column: targetColumnName, // The status/column name
            description: description,
            assignee: assignedTo, // The user name or ID
            deadline: deadline,
            priority: priority
        };
        if (selectedStoryId != 'Independent')
            newTask.story = selectedStoryId;
        try {
            const response = await fetch(`http://localhost:5000/api/task/create/${boardId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            });
            const data = await response.json();
            if (response.ok) {
                alert("Task created successfully!");
                navigate(`/project/${id}/board/${boardId}`);
            }
            else {
                alert(data.message || "Failed to create task");
            }
        }
        catch (error) {
            console.error("Create task fail", error);
            alert("Server error while creating task");
        }
    };
    const handleDiscard = () => {
        navigate(-1);
    };
    return (_jsxs("div", { className: styles.backgnd, children: [_jsx("h1", { children: "Create Task" }), _jsxs("div", { className: styles.card, children: [_jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Type" }), _jsxs("select", { className: styles.inputField, onChange: (e) => setTaskType(e.target.value), children: [_jsx("option", { value: "Task", children: "Task" }), _jsx("option", { value: "Bug", children: "Bug" })] })] }), _jsxs("div", { className: styles.inputgroup, children: [_jsxs("label", { className: styles.size, children: [taskType, " Name"] }), _jsx("input", { type: 'text', className: styles.inputField, onChange: (e) => setTaskName(e.target.value) })] }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: " Story" }), _jsxs("select", { className: styles.inputField, onChange: (e) => setSelectedStoryId(e.target.value), children: [_jsx("option", { value: "", children: "Independent" }), stories.map(s => (_jsx("option", { value: s._id, children: s.name }, s._id)))] })] }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Column" }), _jsx("select", { className: styles.inputField, value: targetColumnName, onChange: (e) => setTargetColumnName(e.target.value), children: columns.map(c => (_jsx("option", { value: c.name, children: c.name }, c.id))) })] }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Deadline" }), _jsx("input", { type: 'date', className: styles.inputField, onChange: (e) => setDeadline(e.target.value) })] }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Assign To" }), _jsxs("select", { className: styles.inputField, onChange: (e) => setAssignedTo(e.target.value), children: [_jsx("option", { value: "Unassigned", children: "Select a member" }), projectMembers.map((member, index) => (_jsxs("option", { value: member.user._id, children: [member.user.username, " (", member.role, ")"] }, member.user._id || index)))] })] }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Priority" }), _jsxs("select", { className: styles.inputField, onChange: (e) => setpriority(e.target.value), children: [_jsx("option", { value: "Low", children: "Low" }), _jsx("option", { value: "Medium", children: "Medium" }), _jsx("option", { value: "High", children: "High" }), _jsx("option", { value: "Critical", children: "Critical" })] })] }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Description" }), _jsx("textarea", { className: styles.inputFieldd, onChange: (e) => setdescription(e.target.value) })] }), _jsxs("div", { className: styles.bottom, children: [_jsx("button", { type: "button", className: styles.DiscardBtn, onClick: (handleDiscard), children: "Discard" }), _jsx("button", { type: "button", className: styles.submitBtn, onClick: handleCreate, children: "Save" })] })] })] }));
}
export default NewTask;
