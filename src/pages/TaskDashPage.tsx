import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/TaskDash.module.css';


interface TaskEvent {
    event: string;
    timestamp: string;
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
    
    const [task, setTask] = useState<any>(null);
    const [projectMembers, setProjectMembers] = useState<any[]>([]);
    const [stories, setStories] = useState<any[]>([]); // NEW: State for stories

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
                const [resProj, resBoard, resTask] = await Promise.all([
                    fetch(`http://localhost:5000/api/project/${id}`, { headers: header }),
                    fetch(`http://localhost:5000/api/task/${id}/board/${boardId}`, { headers: header }),
                    fetch(`http://localhost:5000/api/task/${taskId}`, {headers: header})
                ]);
                const projData = await resProj.json();
                const boardData = await resBoard.json();
                const taskData = await resTask.json();

                const isProjOk = resProj.ok || resProj.status === 304;
                const isBoardOk = resBoard.ok || resBoard.status === 304;
                const isTaskOk = resTask.ok || resTask.status === 304;
                if(isBoardOk && isProjOk && isTaskOk){
                    setProjectMembers(projData.members);
                    const board = boardData.board;
                    setStories(boardData.stories || []);
                    setTask(taskData);
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

    if (!task) return <div className={styles.backgnd}><h1>Task not found...</h1></div>;

    return (
        <div className={styles.backgnd}>

            <div className={styles.topHeader}>
                            <button className={styles.TaskBtn} onClick={() => navigate(`/project/${id}/board/${boardId}/new-story`)}>
                                Comments
                            </button>
                            
                        </div>


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
            </div>
            </div>
       
    );
}

export default TaskDash;