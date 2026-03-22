import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import styles from '../styles/Kanbandash.module.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
function KanbanDash() {
    const navigate = useNavigate();
    const { id, boardId } = useParams();
    const [columns, setColumns] = useState([]);
    const [stories, setStories] = useState([]);
    const [role, setRole] = useState();
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [filterStoryId, setFilterStoryId] = useState("all");
    const priorityColor = {
        High: "#ea4343", // Red
        Medium: "#ffcc00", // Yellow
        Low: "#28a745", // Green
        Critical: "#800000"
    };
    useEffect(() => {
        const getBoardData = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token)
                console.error("No token found");
            const header = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            try {
                const resBoard = await fetch(`http://localhost:5000/api/task/${id}/board/${boardId}`, { headers: header });
                const dataBoard = await resBoard.json();
                const resTask = await fetch(`http://localhost:5000/api/task/board/${boardId}`, { headers: header });
                const dataTask = await resTask.json();
                const resProj = await fetch(`http://localhost:5000/api/project/${id}`, { headers: header });
                const dataProj = await resProj.json();
                const member = dataProj.members.find((m) => m.user._id === currentUser.id);
                if (member)
                    setRole(member.role);
                if (resTask.ok) {
                    const newColumns = dataBoard.board.columns.map((col) => ({
                        ...col,
                        tasks: dataTask.filter((task) => (task.status === col.name) && (task.type !== 'Story'))
                    }));
                    setColumns(newColumns);
                }
                if (!resTask.ok) {
                    console.log("Task not fetched");
                }
                ;
                setStories(dataBoard.stories);
            }
            catch (error) {
                console.error("fetch fail", error);
            }
        };
        getBoardData();
    }, [id, boardId]);
    const moveTask = async (taskId, targetColId) => {
        const targetCol = columns.find((c) => String(c._id) === String(targetColId));
        const initCol = columns.find((c) => c.tasks.some((t) => String(t._id || t.id || t.taskId) === String(taskId)));
        if (!targetCol || !initCol) {
            console.error("Column not found", { targetCol, initCol });
            return;
        }
        const sourceColIndex = columns.findIndex((col) => String(col._id) === String(initCol._id));
        const targetColIndex = columns.findIndex((col) => String(col._id) === String(targetColId));
        console.log(`Moving from ${sourceColIndex} to ${targetColIndex}`);
        // If target index is less than or equal to source, block it
        if (targetColIndex <= sourceColIndex) {
            alert("Workflow Error: You can only move tasks forward.");
            return;
        }
        // 4. WIP LIMIT CHECK
        if (targetCol.wipLimit > 0 && targetCol.tasks.length >= targetCol.wipLimit) {
            alert(`WIP Limit Reached for ${targetCol.name}!`);
            return;
        }
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`http://localhost:5000/api/task/${taskId}/move`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    newcol: targetCol.name,
                    oldCol: initCol.name,
                })
            });
            if (response.ok) {
                const updated = columns.map(col => {
                    if (String(col._id) === String(initCol._id)) {
                        return { ...col, tasks: col.tasks.filter(t => String(t._id || t.id) !== String(taskId)) };
                    }
                    if (String(col._id) === String(targetColId)) {
                        console.log(`Adding Taks ${taskId} to ${col.name} `);
                        const moved = initCol.tasks.find(t => String(t._id || t.id) === String(taskId));
                        if (moved) {
                            return { ...col, tasks: [...col.tasks, { ...moved, status: targetCol.name, _id: taskId }] };
                        }
                    }
                    return col;
                });
                setColumns(updated);
                console.log("State updated");
            }
            else {
                console.error("Move rejected", await response.text());
            }
        }
        catch (error) {
            console.error("Patch error", error);
        }
    };
    const render = (task) => {
        const color = priorityColor[task.priority];
        const actualTaskId = task.id || task._id;
        const parentStory = stories.find(s => String(s.id || s._id) === String(task.parentStory));
        const assigneeId = typeof task.assignee === 'object' ? task.assignee?._id : task.assignee;
        const displayName = task.assignee?.username || "Unassigned";
        return (_jsxs("div", { className: styles.Task, style: { borderLeft: `8px solid ${color}` }, onClick: () => { if (!isViewer)
                navigate(`/project/${id}/board/${boardId}/task/${actualTaskId}`); }, draggable: isViewer ? "false" : "true", onDragStart: (e) => {
                const idToTransfer = task._id || task.id;
                e.dataTransfer.setData("taskId", String(idToTransfer));
            }, children: [_jsx("div", { className: styles.priorityTag, style: { backgroundColor: color }, children: task.priority }), _jsx("div", { className: styles.size, children: _jsx("p", { children: _jsx("strong", { children: task.name }) }) }), _jsxs("span", { children: ["Assigned to: ", displayName] }), parentStory && (_jsxs("div", { className: styles.text, children: ["Story: ", _jsx("p", { children: _jsxs("strong", { children: [" ", parentStory.name] }) })] })), _jsx("div", { className: styles.bold, children: _jsx("p", { children: _jsx("strong", { children: task.type }) }) })] }, actualTaskId));
    };
    const handleDragover = (e) => {
        e.preventDefault();
    };
    const handleDrop = (e, targetStatus) => {
        const taskId = e.dataTransfer.getData("taskId");
        moveTask(taskId, targetStatus);
    };
    const isViewer = (role === 'Viewer');
    const isMember = (role === 'Member');
    return (_jsxs("div", { className: styles.backgnd, children: [_jsxs("div", { className: styles.topHeader, children: [_jsx("div", { children: _jsxs("select", { className: styles.TaskBtn, value: filterStoryId, onChange: (e) => setFilterStoryId(e.target.value), children: [_jsx("option", { value: "all", children: "Track All" }), stories.map((s) => (_jsx("option", { value: s.id || s._id, children: s.name }, s.id || s._id)))] }) }), !isViewer &&
                        (_jsx("button", { className: styles.TaskBtn, onClick: () => navigate(`/project/${id}/board/${boardId}/new-story`), children: "+ New Story" })), !isViewer && (_jsx("button", { className: styles.TaskBtn, onClick: () => navigate(`/project/${id}/board/${boardId}/new-task`), children: "+ New Task" })), !isViewer && !isMember && (_jsx("button", { className: styles.TaskBtn, onClick: () => navigate(`/project/${id}/board/${boardId}/Manage`), children: "Manage Columns" }))] }), _jsx("div", { className: styles.column, children: columns.map((col) => _jsxs("div", { className: styles.Card, onDragOver: (e) => e.preventDefault(), onDrop: (e) => {
                        if (!isViewer) {
                            const taskId = e.dataTransfer.getData("taskId");
                            console.log("Droppd Task:", taskId, "intoCOl: ", col._id);
                            moveTask(taskId, col._id);
                        }
                    }, children: [_jsx("h1", { children: col.name }), col.wipLimit > 0 && (_jsxs("span", { className: styles.wipLabel, children: ["WIP: ", col.tasks.length, "/", col.wipLimit] })), col.tasks.filter(t => filterStoryId === "all" || String(t.parentStory) === String(filterStoryId)).map(render)] }, col._id || col.id || col.name)) })] }));
}
export default KanbanDash;
