import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/TaskDash.module.css';
const displayBody = (body, members) => {
    if (!body)
        return "";
    return body.replace(/\[\[user:(.*?)\]\]/g, (match, userId) => {
        const cleanId = userId.trim().replace(/"/g, '');
        const member = members?.find(m => m._id === cleanId || m.user?._id === cleanId);
        if (!member)
            return `<span style="color: #ff4d4d;">@Unknown User</span>`;
        const name = member.user?.username || member.name;
        return `<span class="mention-tag" style="color: #26b249; font-weight: bold;">@${name}</span>`;
    });
};
function TaskDash() {
    const { id, boardId, taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [projectMembers, setProjectMembers] = useState([]);
    const [stories, setStories] = useState([]);
    const [showMentions, setShowMentions] = useState(false);
    const editorRef = useRef(null);
    useEffect(() => {
        if (!taskId || taskId === "undefined")
            return;
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            const header = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            try {
                const [resProj, resBoard, resTask, resComments] = await Promise.all([
                    fetch(`http://localhost:5000/api/project/${id}`, { headers: header }),
                    fetch(`http://localhost:5000/api/task/${id}/board/${boardId}`, { headers: header }),
                    fetch(`http://localhost:5000/api/task/${taskId}`, { headers: header }),
                    fetch(`http://localhost:5000/api/comments/${taskId}`, { headers: header })
                ]);
                const projData = await resProj.json();
                const boardData = await resBoard.json();
                const taskData = await resTask.json();
                const commData = await resComments.json();
                if (resProj.ok && resBoard.ok && resTask.ok) {
                    setProjectMembers(projData.members.filter((m) => m.role !== 'Viewer'));
                    setStories(boardData.stories || []);
                    setTask(taskData);
                    setComments(commData.comment || []); // Use the separate comments state
                }
            }
            catch (error) {
                console.error("fetch data fail", error);
            }
        };
        fetchData();
    }, [id, boardId, taskId]);
    const runCommand = (command, value = "") => {
        editorRef.current?.focus();
        document.execCommand(command, false, value);
    };
    const insertMention = (member) => {
        editorRef.current?.focus();
        const name = member.user?.username || member.name;
        const mentionHtml = `<span class="mention-tag" data-id="${member.user?._id}" style="color: #26b249; font-weight: bold;">@${name}</span>&nbsp;`;
        document.execCommand('insertHTML', false, mentionHtml);
        setShowMentions(false);
    };
    const handleSave = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch(`http://localhost:5000/api/task/update/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });
            if (response.ok)
                alert("Task updated");
            navigate(-1);
        }
        catch (error) {
            console.error("Save failed", error);
        }
    };
    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Delete this comment?"))
            return;
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (response.ok) {
                // Remove the comment from the local UI state
                setComments(prev => prev.filter(c => c._id !== commentId));
            }
            else {
                alert("Failed to delete comment.");
            }
        }
        catch (error) {
            console.error("Delete error:", error);
        }
    };
    const handleAddComment = async () => {
        const content = editorRef.current?.innerHTML;
        if (!content || content === "<br>" || content.trim() === "")
            return;
        const dbContent = content.replace(/<span[^>]*data-id="([^"]*)"[^>]*>@.*?<\/span>/g, '[[user:$1]]');
        const doc = new DOMParser().parseFromString(content, 'text/html');
        const mentionIds = Array.from(doc.querySelectorAll('.mention-tag')).map(tag => tag.getAttribute('data-id')).filter(id => id);
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch(`http://localhost:5000/api/comments/${taskId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    body: dbContent,
                    mention: mentionIds,
                    projectId: id,
                })
            });
            if (response.ok) {
                const savedComment = await response.json();
                setComments(prev => [...prev, savedComment]);
                if (editorRef.current)
                    editorRef.current.innerHTML = "";
            }
        }
        catch (error) {
            console.error("Failed to post comment", error);
        }
    };
    if (!task) {
        return (_jsx("div", { className: styles.backgnd, children: _jsx("div", { className: styles.container, children: _jsx("h1", { children: "Loading Task..." }) }) }));
    }
    return (_jsx("div", { className: styles.backgnd, children: _jsxs("div", { className: styles.container, children: [_jsxs("div", { className: styles.card, children: [_jsx("h1", { children: "Task Settings" }), _jsxs("div", { className: styles.inputGroup, children: [_jsx("label", { children: "Task Name" }), _jsx("input", { type: "text", value: task.name, onChange: (e) => setTask({ ...task, name: e.target.value }) })] }), _jsxs("div", { className: styles.bottom, children: [_jsx("button", { className: styles.DiscardBtn, onClick: () => navigate(-1), children: "Discard" }), _jsx("button", { className: styles.saveBtn, onClick: handleSave, children: "Save Changes" })] })] }), _jsxs("div", { className: styles.card, children: [_jsx("h1", { children: "LOG" }), _jsx("div", { className: styles.loglist, children: task.history?.slice().reverse().map((entry, index) => (_jsxs("div", { className: styles.log, children: [_jsxs("span", { children: [entry.field, " changed from ", _jsx("b", { children: String(entry.oldValue) }), " to ", _jsx("b", { children: String(entry.newValue) })] }), _jsx("span", { children: new Date(entry.timestamp).toLocaleString() })] }, index))) })] }), _jsxs("div", { className: styles.ccard, children: [_jsx("h1", { children: "Comments" }), _jsx("div", { className: styles.comments, children: comments?.map((c, index) => (_jsxs("div", { className: styles.commentItem, children: [_jsxs("div", { className: styles.commentHeader, children: [_jsx("strong", { children: c.author?.username || c.author }), _jsx("span", { children: new Date(c.createdAt || c.timestamp).toLocaleString() }), _jsx("div", { className: styles.commentaction, children: _jsx("button", { onClick: () => handleDeleteComment(c._id), title: "Delete Comment", children: "\u00D7" }) })] }), _jsx("div", { dangerouslySetInnerHTML: { __html: displayBody(c.body, projectMembers) } })] }, c._id || index))) }), _jsxs("div", { className: styles.editorBox, children: [_jsxs("div", { className: styles.toolbar, children: [_jsx("button", { onClick: () => runCommand('bold'), children: "B" }), _jsx("button", { onClick: () => runCommand('italic'), children: "I" }), _jsx("button", { onClick: () => runCommand('underline'), children: "U" }), _jsxs("div", { style: { position: 'relative', display: 'inline-block' }, children: [_jsx("button", { onClick: () => setShowMentions(!showMentions), children: "@ Mention" }), showMentions && (_jsx("ul", { className: styles.mentionDropdown, children: projectMembers.map(m => (_jsx("li", { onClick: () => insertMention(m), children: m.user?.username || m.name }, m.user?._id))) }))] })] }), _jsx("div", { ref: editorRef, className: styles.editableArea, contentEditable: true }), _jsx("button", { className: styles.postBtn, onClick: handleAddComment, children: "Post Comment" })] })] })] }) }));
}
export default TaskDash;
