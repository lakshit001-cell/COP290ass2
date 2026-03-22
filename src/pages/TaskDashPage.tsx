import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/TaskDash.module.css';

const displayBody = (body: string, members: any[]) => {
    if (!body) return "";
    
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

                    setProjectMembers(projData.members.filter((m: any) => m.role !== 'Viewer'));
                    setStories(boardData.stories || []);
                    setTask(taskData);
                    setComments(commData.comment ||commData || []);
                }
            } catch (error) {
                console.error("Fetch data failed:", error);
            }
        };

        fetchData();
    }, [id, boardId, taskId]);

    // Editor Commands
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
        } catch (error) {
            console.error("Update task failed:", error);
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
                if (editorRef.current) editorRef.current.innerHTML = "";
            }
        } catch (error) {
            console.error("Failed to post comment:", error);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` }
            });
            if (response.ok) {
                setComments(comments.filter(c => c._id !== commentId));
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    if (!task) return <div className={styles.backgnd}><div className={styles.container}><h1>Loading Task...</h1></div></div>;

    return (
        <div className={styles.backgnd}>
            <div className={styles.container}>
                

                <div className={styles.card}>
                    <h1>Task Settings</h1>
                    
                    <div className={styles.inputGroup}>
                        <label>Task Name</label>
                        <input 
                            type="text" 
                            value={task.name || ""} 
                            onChange={(e) => setTask({...task, name: e.target.value})}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Story Context</label>
                        <select 
                            value={task.parentStory?._id || task.parentStory || ""} 
                            onChange={(e) => setTask({...task, parentStory: e.target.value})}
                        >
                            <option value="">Independent Task</option>
                            {stories.map(s => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>Priority</label>
                            <select value={task.priority} onChange={(e) => setTask({...task, priority: e.target.value})}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Assigned To</label>
                            <select 
                                value={task.assignee?._id || task.assignee || "Unassigned"} 
                                onChange={(e) => setTask({...task, assignee: e.target.value === "Unassigned" ? null : e.target.value})}
                            >
                                <option value="Unassigned">Unassigned</option>
                                {projectMembers.map((m: any) => (
                                    <option key={m.user?._id} value={m.user?._id}>{m.user?.username}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Deadline</label>
                        <input 
                            type="date" 
                            value={task.deadline ? task.deadline.split('T')[0] : ""} 
                            onChange={(e) => setTask({...task, deadline: e.target.value})}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Description</label>
                        <textarea 
                            value={task.description || ""} 
                            onChange={(e) => setTask({...task, description: e.target.value})}
                        />
                    </div>

                    <div className={styles.bottom}>
                        <button className={styles.DiscardBtn} onClick={() => navigate(-1)}>Discard</button>
                        <button className={styles.saveBtn} onClick={handleSaveTask}>Save Changes</button>
                    </div>
                </div>

                <div className={styles.card}>
                    <h1>Task History Log</h1>
                    <div className={styles.loglist}>
                        {task.history?.slice().reverse().map((entry: any, idx: number) => (
                            <div key={idx} className={styles.log}>
                                <span><b>{entry.field}</b>: {entry.oldValue} ➔ <b>{entry.newValue}</b></span>
                                <small>{new Date(entry.timestamp).toLocaleString()}</small>
                            </div>
                        ))}
                    </div>
                </div>


                <div className={styles.ccard}>
                    <h1>Discussion</h1>
                    <div className={styles.comments}>
                        {comments.map((c: any, index: number) => (
                            <div key={c._id || index} className={styles.commentItem}>
                                <div className={styles.commentHeader}>
                                    <strong>{c.author?.username || "User"}</strong>
                                    <span>{new Date(c.createdAt || Date.now()).toLocaleString()}</span>
                                    <div className={styles.commentaction}>
                                    <button onClick={() => handleDeleteComment(c._id)}>X</button>
                                </div>
                                </div>
                                <div 
                                    className={styles.commentContent}
                                    dangerouslySetInnerHTML={{ __html: displayBody(c.body, projectMembers) }} 
                                />
                            </div>
                        ))}
                    </div>

                     <div className={styles.editorBox}>

                        <div className={styles.toolbar}>

                            <button onClick={() => runCommand('bold')}>

                                B

                                </button>



                            <button onClick={() => runCommand('italic')}

                                >I



                            </button>



                            <button onClick={() => runCommand('underline')}>U</button>

                            <button onClick={()=>runCommand('insertUnorderedList')} title="Bullet List">

                                 . List

                           



                            </button>





                            <button

                            onMouseDown={(e)=>{e.preventDefault(); runCommand('formatBlock', '<pre>'); }} title="CODE Block">

                                Enter Code

                               

                            </button>





                            <button

                            onMouseDown={(e)=>{e.preventDefault(); runCommand('insertHTML', '</pre><div><br></div>'); }} title=" Exit CODE Block">

                                Exit Code

                               

                            </button>



                            <button onMouseDown={(e) => {e.preventDefault();

                                const selection= window.getSelection() ?.toString();

                                if (selection) {

                                    runCommand('createLink',selection)

                                }

                            }} title="ADD Link">

                                Link





                            </button>

                            <input type="color" onChange={(e) => runCommand('foreColor', e.target.value)} />

                           

                            <select className={styles.font} onChange={(e) => runCommand('fontName', e.target.value)}

                                defaultValue="Segoe UI">





                                <option value="Segoe UI">Segoe UI</option>

                                <option value="Arial">Arial</option>

                                <option value="Courier New">Monospace</option>

                                <option value="Georgia">Serif</option>

                                <option value="Verdana">Verdana</option>

                                <option value="Tahoma">Tahoma</option>

                                <option value="Trebuchet MS">Trebuchet</option>

                                <option value="Garamond">Garamond</option>



                            </select>

                           

                            <div style={{position: 'relative'}}>

                                <button

                                    className={showMentions ? styles.activeBtn : ""}

                                    onClick={() => setShowMentions(!showMentions)}>

                                     Mention

                                </button>

                               

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

                        <button className={styles.postBtn} onClick= {handleAddComment}>

                            Post Comment

                            </button>

                       

                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskDash;