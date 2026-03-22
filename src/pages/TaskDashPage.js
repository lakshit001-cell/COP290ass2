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
        if (!member) {
            return `<span style="color: #ff4d4d;">@Unknown User</span>`;
        }
        const name = member.user?.username || member.name;
        return `<span style="color: #26b249; font-weight: bold;">@${name}</span>`;
    });
};
function TaskDash() {
    const { id, boardId, taskId } = useParams();
    const navigate = useNavigate();
    // State Management
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
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            try {
                const [resProj, resBoard, resTask, resComments] = await Promise.all([
                    fetch(`http://localhost:5000/api/project/${id}`, { headers }),
                    fetch(`http://localhost:5000/api/task/${id}/board/${boardId}`, { headers }),
                    fetch(`http://localhost:5000/api/task/${taskId}`, { headers }),
                    fetch(`http://localhost:5000/api/comments/${taskId}`, { headers })
                ]);
                if (resProj.ok && resBoard.ok && resTask.ok) {
                    const projData = await resProj.json();
                    const boardData = await resBoard.json();
                    const taskData = await resTask.json();
                    const commData = await resComments.json();
                    setProjectMembers(projData.members.filter((m) => m.role !== 'Viewer'));
                    setStories(boardData.stories || []);
                    setTask(taskData);
                    setComments(commData.comment || commData || []);
                }
            }
            catch (error) {
                console.error("Fetch data failed:", error);
            }
        };
        fetchData();
    }, [id, boardId, taskId]);
    // Editor Commands
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
    const handleSaveTask = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/task/update/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task),
            });
            if (response.ok) {
                alert("Task updated successfully");
                navigate(-1);
            }
        }
        catch (error) {
            console.error("Update task failed:", error);
        }
    };
    const handleAddComment = async () => {
        const content = editorRef.current?.innerHTML;
        if (!content || content === "<br>" || content.trim() === "")
            return;
        const dbContent = content.replace(/<span[^>]*data-id="([^"]*)"[^>]*>@.*?<\/span>/g, '[[user:$1]]');
        const doc = new DOMParser().parseFromString(content, 'text/html');
        const mentionIds = Array.from(doc.querySelectorAll('.mention-tag'))
            .map(tag => tag.getAttribute('data-id'))
            .filter(Boolean);
        try {
            const response = await fetch(`http://localhost:5000/api/comments/${taskId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
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
                const newCom = {
                    ...savedComment,
                    body: savedComment.content,
                    createdAt: new Date().toISOString()
                };
                setComments(prev => [...prev, newCom]);
                if (editorRef.current)
                    editorRef.current.innerHTML = "";
            }
        }
        catch (error) {
            console.error("Failed to post comment:", error);
        }
    };
    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Delete this comment?"))
            return;
        try {
            const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` }
            });
            if (response.ok) {
                setComments(comments.filter(c => c._id !== commentId));
            }
        }
        catch (error) {
            console.error("Delete failed:", error);
        }
    };
    if (!task)
        return _jsx("div", { className: styles.backgnd, children: _jsx("div", { className: styles.container, children: _jsx("h1", { children: "Loading Task..." }) }) });
    return (_jsx("div", { className: styles.backgnd, children: _jsxs("div", { className: styles.container, children: [_jsxs("div", { className: styles.card, children: [_jsx("h1", { children: "Task Settings" }), _jsxs("div", { className: styles.inputGroup, children: [_jsx("label", { children: "Task Name" }), _jsx("input", { type: "text", value: task.name || "", onChange: (e) => setTask({ ...task, name: e.target.value }) })] }), _jsxs("div", { className: styles.inputGroup, children: [_jsx("label", { children: "Story Context" }), _jsxs("select", { value: task.parentStory?._id || task.parentStory || "", onChange: (e) => setTask({ ...task, parentStory: e.target.value }), children: [_jsx("option", { value: "", children: "Independent Task" }), stories.map(s => (_jsx("option", { value: s._id, children: s.name }, s._id)))] })] }), _jsxs("div", { className: styles.row, children: [_jsxs("div", { className: styles.inputGroup, children: [_jsx("label", { children: "Priority" }), _jsxs("select", { value: task.priority, onChange: (e) => setTask({ ...task, priority: e.target.value }), children: [_jsx("option", { value: "Low", children: "Low" }), _jsx("option", { value: "Medium", children: "Medium" }), _jsx("option", { value: "High", children: "High" }), _jsx("option", { value: "Critical", children: "Critical" })] })] }), _jsxs("div", { className: styles.inputGroup, children: [_jsx("label", { children: "Assigned To" }), _jsxs("select", { value: task.assignee?._id || task.assignee || "Unassigned", onChange: (e) => setTask({ ...task, assignee: e.target.value === "Unassigned" ? null : e.target.value }), children: [_jsx("option", { value: "Unassigned", children: "Unassigned" }), projectMembers.map((m) => (_jsx("option", { value: m.user?._id, children: m.user?.username }, m.user?._id)))] })] })] }), _jsxs("div", { className: styles.inputGroup, children: [_jsx("label", { children: "Deadline" }), _jsx("input", { type: "date", value: task.deadline ? task.deadline.split('T')[0] : "", onChange: (e) => setTask({ ...task, deadline: e.target.value }) })] }), _jsxs("div", { className: styles.inputGroup, children: [_jsx("label", { children: "Description" }), _jsx("textarea", { value: task.description || "", onChange: (e) => setTask({ ...task, description: e.target.value }) })] }), _jsxs("div", { className: styles.bottom, children: [_jsx("button", { className: styles.DiscardBtn, onClick: () => navigate(-1), children: "Discard" }), _jsx("button", { className: styles.saveBtn, onClick: handleSaveTask, children: "Save Changes" })] })] }), _jsxs("div", { className: styles.card, children: [_jsx("h1", { children: "Task History Log" }), _jsx("div", { className: styles.loglist, children: task.history?.slice().reverse().map((entry, idx) => (_jsxs("div", { className: styles.log, children: [_jsxs("span", { children: [_jsx("b", { children: entry.field }), ": ", entry.oldValue, " \u2794 ", _jsx("b", { children: entry.newValue })] }), _jsx("small", { children: new Date(entry.timestamp).toLocaleString() })] }, idx))) })] }), _jsxs("div", { className: styles.ccard, children: [_jsx("h1", { children: "Discussion" }), _jsx("div", { className: styles.comments, children: comments.map((c, index) => (_jsxs("div", { className: styles.commentItem, children: [_jsxs("div", { className: styles.commentHeader, children: [_jsx("strong", { children: c.author?.username || "User" }), _jsx("span", { children: new Date(c.createdAt || Date.now()).toLocaleString() }), _jsx("div", { className: styles.commentaction, children: _jsx("button", { onClick: () => handleDeleteComment(c._id), children: "X" }) })] }), _jsx("div", { className: styles.commentContent, dangerouslySetInnerHTML: { __html: displayBody(c.body, projectMembers) } })] }, c._id || index))) }), _jsxs("div", { className: styles.editorBox, children: [_jsxs("div", { className: styles.toolbar, children: [_jsx("button", { onClick: () => runCommand('bold'), children: "B" }), _jsx("button", { onClick: () => runCommand('italic'), children: "I" }), _jsx("button", { onClick: () => runCommand('underline'), children: "U" }), _jsx("button", { onClick: () => runCommand('insertUnorderedList'), title: "Bullet List", children: ". List" }), _jsx("button", { onMouseDown: (e) => { e.preventDefault(); runCommand('formatBlock', '<pre>'); }, title: "CODE Block", children: "Enter Code" }), _jsx("button", { onMouseDown: (e) => { e.preventDefault(); runCommand('insertHTML', '</pre><div><br></div>'); }, title: " Exit CODE Block", children: "Exit Code" }), _jsx("button", { onMouseDown: (e) => {
                                                e.preventDefault();
                                                const selection = window.getSelection()?.toString();
                                                if (selection) {
                                                    runCommand('createLink', selection);
                                                }
                                            }, title: "ADD Link", children: "Link" }), _jsx("input", { type: "color", onChange: (e) => runCommand('foreColor', e.target.value) }), _jsxs("select", { className: styles.font, onChange: (e) => runCommand('fontName', e.target.value), defaultValue: "Segoe UI", children: [_jsx("option", { value: "Segoe UI", children: "Segoe UI" }), _jsx("option", { value: "Arial", children: "Arial" }), _jsx("option", { value: "Courier New", children: "Monospace" }), _jsx("option", { value: "Georgia", children: "Serif" }), _jsx("option", { value: "Verdana", children: "Verdana" }), _jsx("option", { value: "Tahoma", children: "Tahoma" }), _jsx("option", { value: "Trebuchet MS", children: "Trebuchet" }), _jsx("option", { value: "Garamond", children: "Garamond" })] }), _jsxs("div", { style: { position: 'relative' }, children: [_jsx("button", { className: showMentions ? styles.activeBtn : "", onClick: () => setShowMentions(!showMentions), children: "Mention" }), showMentions && (_jsx("ul", { className: styles.mentionDropdown, children: projectMembers.map(m => (_jsx("li", { onClick: () => insertMention(m), children: m.user?.username || m.name }, m.user?._id))) }))] })] }), _jsx("div", { ref: editorRef, className: styles.editableArea, contentEditable: true }), _jsx("button", { className: styles.postBtn, onClick: handleAddComment, children: "Post Comment" })] })] })] }) }));
}
export default TaskDash;
