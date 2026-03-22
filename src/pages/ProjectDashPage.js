import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import styles from '../styles/ProjectDash.module.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
function ProjectDash() {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { id } = useParams();
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [projectRole, setProjectRole] = useState("");
    const [boards, setBoards] = useState([]);
    const [projectName, setProjectName] = useState("");
    const priorityColor = {
        High: "#ea4343", // Red
        Medium: "#ffcc00", // Yellow
        Low: "#28a745", // Green
        Critical: "#800000"
    };
    useEffect(() => {
        const fetchProject = async () => {
            const token = localStorage.getItem("accessToken");
            const header = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            try {
                const response = await fetch(`http://localhost:5000/api/project/${id}`, {
                    method: 'GET',
                    headers: header
                });
                const data = await response.json();
                if (!response.ok) {
                    alert("Access denied");
                    return;
                }
                setProjectName(data.name);
                const member = data.members.find((m) => m.user._id === currentUser.id);
                if (member)
                    setProjectRole(member.role);
                const resBoards = await fetch(`http://localhost:5000/api/board/project/${id}`, {
                    method: 'GET',
                    headers: header
                });
                const dataBoards = await resBoards.json();
                const tasksnBoards = await Promise.all(dataBoards.map(async (board) => {
                    const resTasks = await fetch(`http://localhost:5000/api/task/board/${board._id}`, { headers: header });
                    const dataTasks = await resTasks.json();
                    return {
                        ...board,
                        allTasks: Array.isArray(dataTasks) ? dataTasks : []
                    };
                }));
                console.log(boards, dataBoards);
                setBoards(tasksnBoards);
            }
            catch (error) {
                console.error("project fetch Fail", error);
            }
        };
        fetchProject();
    }, [id, currentUser.email]);
    // Permissions Helper Functions
    const canManageSettings = currentUser.GlobalRole === 'Admin' || projectRole === 'Owner';
    const canAddBoard = projectRole !== 'Viewer';
    return (_jsxs("div", { className: styles.layout, children: [_jsxs("main", { className: styles.boards, children: [_jsx("h1", { children: projectName }), _jsx("div", { className: styles.grid, children: boards.map((board) => {
                            const tasks = board.allTasks || [];
                            const totalTasks = tasks.length;
                            const doneCount = tasks.filter((t) => t.status?.trim().toLowerCase() === "done").length;
                            const percentage = totalTasks === 0 ? 0 : Math.round((doneCount / totalTasks) * 100);
                            // Priority styling logic
                            const priorityClass = styles[`${board.priority?.toLowerCase()}Card`] || '';
                            return (_jsxs("div", { className: `${styles.card} ${priorityClass}`, children: [board.priority && (_jsx("div", { className: styles[`${board.priority.toLowerCase()}Badge`], children: board.priority })), _jsx("div", { className: styles.priorityCorner, children: _jsx("span", { className: styles.dot, style: { backgroundColor: priorityColor[board.priority] } }) }), _jsx("div", { children: _jsx("h1", { children: board.name }) }), _jsx("div", { className: styles.projdes, children: board.description }), _jsxs("div", { className: styles.bottom, children: [_jsx("span", { children: board.deadline ? new Date(board.deadline).toLocaleDateString() : 'No deadline' }), _jsx("div", { className: styles.circularMeter, style: { background: `conic-gradient(#26b249 ${percentage * 3.6}deg, #333 0deg)` }, children: _jsx("div", { className: styles.innerCircle, children: _jsxs("span", { children: [percentage, "%"] }) }) })] }), _jsx("div", { className: styles.center, children: _jsx("button", { className: styles.EnterBtn, onClick: () => navigate(`/project/${id}/board/${board.boardId || board._id}`), children: "Enter" }) })] }, board._id));
                        }) })] }), _jsxs("aside", { className: styles.sidebar, children: [_jsx("button", { className: styles.item, onClick: () => navigate(`/project/${id}/members`), children: "View Members" }), canAddBoard && (_jsx("button", { className: styles.item, onClick: () => navigate(`/project/${id}/kanbanBoard`), children: "Add Kanban Board" })), canManageSettings && (_jsx("button", { className: styles.item, onClick: () => navigate(`/project/${id}/settings`), children: "Manage Project Settings" }))] })] }));
}
export default ProjectDash;
