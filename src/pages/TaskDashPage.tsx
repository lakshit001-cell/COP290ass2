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
        // Trim the userId just in case there is stray whitespace or quotes
        const cleanId = userId.trim().replace(/"/g, '');
        const member = members?.find(m => m._id === cleanId || m.user?._id === cleanId);

        if (!member) {
            return `<span style="color: #ff4d4d;">@Unknown User</span>`;
        }

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

    const editorRef = useRef<HTMLDivElement>(null);
    const [showMentions, setShowMentions] = useState(false);

    const insertMention = (member: any) => {
        editorRef.current?.focus();
        const name = member.user?.username || member.name;
        const mentionHtml = `<span class="mention-tag" data-id="${member.user?._id}" style="color: #26b249; font-weight: bold;">@${name}</span>&nbsp;`;
        document.execCommand('insertHTML', false, mentionHtml);
        setShowMentions(false);
    };

    useEffect(() => {
        if (!taskId || taskId === "undefined") {
            console.warn("TaskId is not available yet.");
            return; 
        }
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            const header = {
            'Authorization' : `Bearer ${token}`,
            'Content-Type' : 'application/json',
        }
            try{
                const [resProj, resBoard, resTask, resComments] = await Promise.all([
                    fetch(`http://localhost:5000/api/project/${id}`, { headers: header }),
                    fetch(`http://localhost:5000/api/task/${id}/board/${boardId}`, { headers: header }),
                    fetch(`http://localhost:5000/api/task/${taskId}`, {headers: header}),
                    fetch(`http://localhost:5000/api/comments/${taskId}`, { headers: header })
                ]);
                const projData = await resProj.json();
                const boardData = await resBoard.json();
                const taskData = await resTask.json();
                const commData = await resComments.json();

                const isProjOk = resProj.ok || resProj.status === 304;
                const isBoardOk = resBoard.ok || resBoard.status === 304;
                const isTaskOk = resTask.ok || resTask.status === 304;
                if(isBoardOk && isProjOk && isTaskOk){
                    setProjectMembers(projData.members.filter((m:any)=> m.role !== 'Viewer'));
                    const board = boardData.board;
                    setStories(boardData.stories || []);
                    setTask(taskData);
                    setComments(commData.comment);
                }else{
                    if(!resProj.ok) return console.error("Project not ok");
                    if(!resBoard.ok) return console.error("Board not ok");
                    if(!resTask.ok) return console.error("Task not ok");
                }
            }catch(error){
                console.error("fetch data fail", error);
            }
        }
        fetchData();
        }, [id, boardId, taskId]);

    const runCommand = (command: string, value: string = "") => {
        editorRef.current?.focus();
        document.execCommand(command, false, value);
    };


    const handleSave = async () => {
        const token = localStorage.getItem("accessToken");
            const header = {
            'Authorization' : `Bearer ${token}`,
            'Content-Type' : 'application/json',
        }
            try{
                const response = await fetch(`http://localhost:5000/api/task/update/${taskId}`,{
                    method: 'PATCH',
                    headers: header,
                    body: JSON.stringify(task),
                })
                if(response.ok) alert("Task updated");
                navigate(-1);
            }catch(error){
                console.error("fetch data fail", error);
            }
    };


    const handleAddComment = async () => {
    
        const content = editorRef.current?.innerHTML;

        // 2. Check if it's actually empty (browser often puts a <br> in empty divs)
        if (!content || content === "<br>" || content.trim() === "") {
            return; 
        }

        const dbContent = content.replace(
            /<span[^>]*data-id="([^"]*)"[^>]*>@.*?<\/span>/g, 
            '[[user:$1]]'
        )

        const doc = new DOMParser().parseFromString(content, 'text/html');
        const mentionIds = Array.from(doc.querySelectorAll('.mention-tag')).map(tag=> tag.getAttribute('data-id')).filter(id=>id);

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
                    mention: mentionIds, // Array of User ObjectIds
                    projectId: id,
                })
            });

            if (response.ok) {
                const savedComment = await response.json();
                
                // Update local state to show the comment immediately
                setComments(prev=> [...prev, savedComment]);

                // Clear editor
                if (editorRef.current) editorRef.current.innerHTML = "";
            }
        } catch (error) {
            console.error("Failed to post comment", error);
        }

        const newComment: Comment = {
            author: "You",
            content: content, 
            timestamp: new Date().toLocaleString(),
        };

        // 3. Update the task state
        const updatedTask = {
            ...task,
            comments: [...(task.comments || []), newComment],
            
        };

        setTask(updatedTask);

        // 4. Clear the editor visually
        if (editorRef.current) {
            editorRef.current.innerHTML = "";
        }
    };

    if (!task) {
        return (
            <div className={styles.backgnd}>
                <div className={styles.container}>
                    <h1>Loading Task...</h1>
                </div>
            </div>
        );
    }

    

    return (
        <div className={styles.backgnd}>

            


            <div className={styles.container}>

            
           
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

               
                <div className={styles.inputGroup}>
                    <label>Story </label>
                    <select 
                        value={task.parentStory?._id || task.parentStory|| ""} 
                        onChange={(e) => setTask({...task, parentStory: e.target.value})}
                    >
                        <option value="">Independent</option>
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
                        <select value={task.assignee?._id || "Unassigned"} onChange={(e) =>{ 
                            const val = e.target.value;
                            setTask({
                                ...task,
                                assignee: val === "Unassigned" ? null : val
                            });
                            }}>
                            <option value="Unassigned">Unassigned</option>
                            {projectMembers.map((m: any) => (
                                <option key={m.user?.id || m.user?._id} value={m.user?._id}>{m.user?.username}</option>
                            ))}
                        </select>



                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>Deadline</label>
                    <input 
                        type="date" 
                        value={task.deadline.split('T')[0] || ""} 
                        onChange={(e) => setTask({...task, deadline: e.target.value})}/>
                </div>

                <div className={styles.inputGroup}>
                    <label>Description</label>
                    <textarea 
                        value={task.description} 
                        onChange={(e) => setTask({...task, description: e.target.value})}
                    />
                </div>

                <div className={styles.bottom}>
                    <button className={styles.DiscardBtn} onClick={() => navigate(-1)}>Discard</button>
                    <button className={styles.saveBtn} onClick={handleSave}>Save Changes</button>
                </div>
            </div>



            <div className={styles.card}>
                <h1>LOG</h1>
                <div className={styles.loglist}>
                    {task.history?.slice().reverse().map((entry:any, index: number)=>
                    <div key={index} className={styles.log}>
                    <span>{entry.field} changed from <b>{String(entry.oldValue)}</b> to <b>{String(entry.newValue)}</b></span>
                     <span>{new Date(entry.timestamp).toLocaleString()}</span>

                    </div>
                    

                   
                    
                
                
                )}

                </div>


            </div>



            <div className={styles.ccard}>
                <h1>Comments</h1>

               <div className={styles.comments}>
                        {comments.map((c: any, index: number) => {
                           

                            return (
                                <div key={c._id || index} className={styles.commentItem}>
                                    
                                    <div className={styles.commentHeader}>
                                    <strong>{c.author?.username || c.author}</strong>
                                    <span>{new Date(c.createdAt || c.timestamp).toLocaleString()}</span>
                                    </div>

                                    <div dangerouslySetInnerHTML={{ __html: displayBody(c.body || c.content, projectMembers) }} />
                                </div>
                            );
                        })}
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
                        <button className={styles.postBtn} onClick={handleAddComment}>
                            Post Comment
                            </button>
                        
                    </div>







            </div>
            </div>
            </div>
       
    );
}

export default TaskDash;