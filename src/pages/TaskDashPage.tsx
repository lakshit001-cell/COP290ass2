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
    parentId?: string;
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

function TaskDash() {
    const { id, boardId, taskId } = useParams();
    const navigate = useNavigate();
    const [commentInput, setCommentInput] = useState("");

    
    const [task, setTask] = useState<any>(null);
    const [projectMembers, setProjectMembers] = useState<any[]>([]);
    const [stories, setStories] = useState<any[]>([]); 

    const editorRef = useRef<HTMLDivElement>(null);
    const [showMentions, setShowMentions] = useState(false);

    const insertMention = (name: string) => {
        editorRef.current?.focus();
        // Insert a span with a specific class we can identify later
        const mentionHtml = `<span class="mention-tag" style="color: #26b249; font-weight: bold;">@${name}</span>&nbsp;`;
        document.execCommand('insertHTML', false, mentionHtml);
        setShowMentions(false);
    };

    // Helper to find all unique @mentions in a string of HTML
    const getMentions = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const tags = Array.from(doc.querySelectorAll('.mention-tag'));
        return Array.from(new Set(tags.map(t => t.textContent)));
    };
    








    useEffect(() => {
        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        const project = allProjects.find((p: any) => String(p.id) === String(id));
        
        if (project) {
            setProjectMembers(project.members || []);
            const board = project.boards.find((b: any) => String(b.boardId) === String(boardId));
            
            // NEW: Fetch stories from the board
            if (board) {
                setStories(board.stories || []);
            }
            
            let foundTask = null;
            board?.columns.forEach((col: any) => {
                const t = col.tasks.find((item: any) => String(item.id) === String(taskId));
                if (t) foundTask = t;
            });
            setTask(foundTask);
        }
    }, [id, boardId, taskId]);

    const runCommand = (command: string, value: string = "") => {
        document.execCommand(command, false, value);
    };


    






    const handleSave = () => {
        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        const pIdx = allProjects.findIndex((p: any) => String(p.id) === String(id));
        const bIdx = allProjects[pIdx].boards.findIndex((b: any) => String(b.boardId) === String(boardId));

        allProjects[pIdx].boards[bIdx].columns.forEach((col: any) => {
            const tIdx = col.tasks.findIndex((t: any) => String(t.id) === String(taskId));
            if (tIdx !== -1) {
                col.tasks[tIdx] = task;
                col.tasks[tIdx].history.push({
                    event: `Task details updated. Story set to: ${stories.find(s => s.id === task.parentId)?.name || "Independent"}`,
                    timestamp: new Date().toLocaleString()
                });
            }
        });

        localStorage.setItem("projects", JSON.stringify(allProjects));
        alert("Task updated successfully!");
        navigate(-1);
    };


    const handleAddComment = () => {
    
    const content = editorRef.current?.innerHTML;

    // 2. Check if it's actually empty (browser often puts a <br> in empty divs)
    if (!content || content === "<br>" || content.trim() === "") {
        return; 
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

    if (!task) return <div className={styles.backgnd}><h1>Task not found...</h1></div>;

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
                        value={task.parentId || ""} 
                        onChange={(e) => setTask({...task, parentId: e.target.value})}
                    >
                        <option value="">Independent</option>
                        {stories.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
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
                        <select value={task.assignedTo} onChange={(e) => setTask({...task, assignedTo: e.target.value})}>
                            <option value="Unassigned">Unassigned</option>
                            {projectMembers.map((m: any) => (
                                <option key={m.email} value={m.name}>{m.name}</option>
                            ))}
                        </select>



                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>Deadline</label>
                    <input 
                        type="date" 
                        value={task.deadline} 
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
                    {task.history.slice().reverse().map((entry:TaskEvent, index: number)=>
                    <div key={index} className={styles.log}>
                    <span>{entry.event}</span>
                     <span>{entry.timestamp}</span>

                    </div>
                    

                   
                    
                
                
                )}

                </div>


            </div>



            <div className={styles.ccard}>
                <h1>Comments</h1>

               <div className={styles.comments}>
                        {task.comments?.map((c: any, index: number) => {
                           

                            return (
                                <div key={index} className={styles.commentItem}>
                                    
                                    <div className={styles.commentHeader}>
                                    <strong>{c.author}</strong>
                                    <span>{c.timestamp}</span>
                                    </div>

                                    <div dangerouslySetInnerHTML={{ __html: c.content }} />
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
                            <input type="color" onChange={(e) => runCommand('foreColor', e.target.value)} />
                            
                            <select className={styles.font} onChange={(e) => runCommand('fontName', e.target.value)}
                                defaultValue="Segoe UI">


                                <option value="Segoe UI">Segoe UI</option>
                                <option value="Arial">Arial</option>
                                <option value="Courier New">Monospace</option>
                                <option value="Georgia">Serif</option>

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
                                            <li key={m.email} onClick={() => insertMention(m.name)}>
                                                {m.name}
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