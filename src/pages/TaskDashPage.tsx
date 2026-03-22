import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/TaskDash.module.css';


interface TaskEvent {
    event: string;
    timestamp: string;
}


interface Comment {
    author:string;
    content:string;
    timestamp:string;
}

interface Task {
    id: string;
    name: string;
    description: string;
    deadline: string;
    priority: string;
    assignedTo: string;
    parentStory?: string;
    history: TaskEvent[];
    status: string;
    type: 'Task' | 'Bug';
    comments?: Comment[];
}

interface Member {
    name: string;
    email: string;
}

interface Story {
    id: string;
    name: string;
}

const displayBody = (body: string, members: any[]) => {
    if (!body) return "";
    return body.replace(/\[\[user:(.*?)\]\]/g, (match, userId) => {
        const cleanId = userId.trim().replace(/"/g, '');
        const member = members?.find(m => m._id === cleanId || m.user?._id === cleanId);
        if (!member) return `<span style="color: #ff4d4d;">@Unknown User</span>`;
        const name = member.user?.username || member.name;
        return `<span class="mention-tag" style="color: #26b249; font-weight: bold;">@${name}</span>`;
    });
};

function TaskDash() {
    const { id, boardId, taskId } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [projectMembers, setProjectMembers] = useState<any[]>([]);
    const [stories, setStories] = useState<any[]>([]);
    const [showMentions, setShowMentions] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!taskId || taskId === "undefined") return;

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
                    setProjectMembers(projData.members.filter((m: any) => m.role !== 'Viewer'));
                    setStories(boardData.stories || []);
                    setTask(taskData);
                    setComments(commData.comment || []); // Use the separate comments state
                }
            } catch (error) {
                console.error("fetch data fail", error);
            }
        };
        fetchData();
    }, [id, boardId, taskId]);

    const runCommand = (command: string, value: string = "") => {
        editorRef.current?.focus();
        document.execCommand(command, false, value);
    };

    const insertMention = (member: any) => {
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
            if (response.ok) alert("Task updated");
            navigate(-1);
        } catch (error) {
            console.error("Save failed", error);
        }
    };
    const handleDeleteComment = async (commentId: string) => {
        if (!window.confirm("Delete this comment?")) return;

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
            } else {
                alert("Failed to delete comment.");
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };




    const handleAddComment = async () => {
        const content = editorRef.current?.innerHTML;
        if (!content || content === "<br>" || content.trim() === "") return;

        const dbContent = content.replace(
            /<span[^>]*data-id="([^"]*)"[^>]*>@.*?<\/span>/g,
            '[[user:$1]]'
        );

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
                if (editorRef.current) editorRef.current.innerHTML = "";
            }
        } catch (error) {
            console.error("Failed to post comment", error);
        }
    };

    if (!task) {
        return (
            <div className={styles.backgnd}>
                <div className={styles.container}><h1>Loading Task...</h1></div>
            </div>
        );
    }

    return (
        <div className={styles.backgnd}>
            <div className={styles.container}>
                {/* Task Settings Card */}
                <div className={styles.card}>
                    <h1>Task Settings</h1>
                    <div className={styles.inputGroup}>
                        <label>Task Name</label>
                        <input 
                            type="text" 
                            value={task.name} 
                            onChange={(e) => setTask({...task, name: e.target.value})} 
                        />
                    </div>
                    {/* ... other task inputs (Priority, Assignee, Deadline, Description) ... */}
                    <div className={styles.bottom}>
                        <button className={styles.DiscardBtn} onClick={() => navigate(-1)}>Discard</button>
                        <button className={styles.saveBtn} onClick={handleSave}>Save Changes</button>
                    </div>
                </div>

                {/* Log Card */}
                <div className={styles.card}>
                    <h1>LOG</h1>
                    <div className={styles.loglist}>
                        {task.history?.slice().reverse().map((entry: any, index: number) => (
                            <div key={index} className={styles.log}>
                                <span>{entry.field} changed from <b>{String(entry.oldValue)}</b> to <b>{String(entry.newValue)}</b></span>
                                <span>{new Date(entry.timestamp).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comments Card */}
                <div className={styles.ccard}>
                    <h1>Comments</h1>
                    <div className={styles.comments}>
                        {comments?.map((c: any, index: number) => (
                            <div key={c._id || index} className={styles.commentItem}>
                                <div className={styles.commentHeader}>
                                    <strong>{c.author?.username || c.author}</strong>
                                    <span>{new Date(c.createdAt || c.timestamp).toLocaleString()}</span>
                                    <div className={styles.commentaction}>
                                    <button 
                                    onClick={() => handleDeleteComment(c._id)}
                                    title="Delete Comment"
                                >
                                    &times;
                                </button>
                                </div>
                                </div>
                                <div 
                                    dangerouslySetInnerHTML={{ __html: displayBody(c.body, projectMembers) }} 
                                />
                            </div>
                            
                        ))}
                    </div>

                    <div className={styles.editorBox}>
                        <div className={styles.toolbar}>
                            <button onClick={() => runCommand('bold')}>B</button>
                            <button onClick={() => runCommand('italic')}>I</button>
                            <button onClick={() => runCommand('underline')}>U</button>
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <button onClick={() => setShowMentions(!showMentions)}>@ Mention</button>
                                {showMentions && (
                                    <ul className={styles.mentionDropdown}>
                                        {projectMembers.map(m => (
                                            <li key={m.user?._id} onClick={() => insertMention(m)}>
                                                {m.user?.username || m.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div ref={editorRef} className={styles.editableArea} contentEditable={true}></div>
                        <button className={styles.postBtn} onClick={handleAddComment}>Post Comment</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskDash;