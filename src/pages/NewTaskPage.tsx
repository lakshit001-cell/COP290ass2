import { useState, useEffect } from 'react';
import styles from '../styles/NewTask.module.css';
import { useNavigate, useParams } from 'react-router-dom';

interface Member {
    name: string;
    email: string;
    role: string;
}

interface Story {
    id: string;
    name: string;
}

interface Column {
    id: string;
    name: string;
}

function NewTask() {
    const { id, boardId } = useParams();
    const navigate = useNavigate();

    
    const [taskType, setTaskType] = useState<'Task' | 'Bug'>('Task');
    const [taskName, setTaskName] = useState("");
    const [description, setdescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [priority, setpriority] = useState("Low");
    const [assignedTo, setAssignedTo] = useState("Unassigned");
    
    
    const [selectedStoryId, setSelectedStoryId] = useState("");
    const [targetColumnName, setTargetColumnName] = useState("");

    // Data from LocalStorage
    const [projectMembers, setProjectMembers] = useState<Member[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [columns, setColumns] = useState<Column[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

   useEffect(() => {
    const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const project = allProjects.find((p: any) => String(p.id) === String(id));
    const board = project?.boards.find((b: any) => String(b.boardId) === String(boardId));

    if (project && board) {
        setProjectMembers(project.members || []);
        setStories(board.stories || []);
        setColumns(board.columns || []);
        
        // --- ADD THIS LINE ---
        // Automatically set the first column as the target
        if (board.columns && board.columns.length > 0) {
            setTargetColumnName(board.columns[0].name);
        }
    }
    setIsLoaded(true);
}, [id, boardId]);

    const handleCreate = () => {
        if (!taskName.trim()) {
            alert("Please enter a name");
            return;
        }

        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        const pIdx = allProjects.findIndex((p: any) => String(p.id) === String(id));
        const bIdx = allProjects[pIdx].boards.findIndex((b: any) => String(b.boardId) === String(boardId));
        
        const newTask = {
            id: `work-${Date.now()}`,
            type: taskType,
            name: taskName,
            description,
            deadline,
            priority,
            status: targetColumnName,
            assignedTo,
            parentId: selectedStoryId, 
            history: [
                { 
                    event: `Created as ${taskType} in ${targetColumnName}`, 
                    timestamp: new Date().toLocaleString() 
                }
            ]
        };

        const targetCol = allProjects[pIdx].boards[bIdx].columns.find(
            (c: any) => c.name === targetColumnName
        );
        
        if (targetCol) {
            targetCol.tasks.push(newTask);
            localStorage.setItem("projects", JSON.stringify(allProjects));
            navigate(`/project/${id}/board/${boardId}`);
        } else {
            alert("Please select a valid target column.");
        }
    };



    const handleDiscard=()=>{
        navigate(-1);
    }

    return (
        <div className={styles.backgnd}>
            <h1>Create Task</h1>
            <div className={styles.card}>
                

            <div className={styles.inputgroup}>
            <label className={styles.size}>Type</label>
                    <select 
                        className={styles.inputField} 
                        
                        onChange={(e) => setTaskType(e.target.value as 'Task' | 'Bug')}>
                        <option value="Task">Task</option>
                        <option value="Bug">Bug</option>
                    </select>
                </div>

                <div className={styles.inputgroup}>
                    <label className={styles.size}>{taskType} Name</label>
                    <input 
                        type='text' 
                        className={styles.inputField} 
                       
                        onChange={(e) => setTaskName(e.target.value)} 
                    />
                </div>

                
                <div className={styles.inputgroup}>
                    <label className={styles.size}> Story</label>
                    <select 
                        className={styles.inputField} 
                       
                        onChange={(e) => setSelectedStoryId(e.target.value)}
                    >
                        <option value="">Independent</option>
                        {stories.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

               
                <div className={styles.inputgroup}>
                    <label className={styles.size}>Column</label>
                    <select 
                        className={styles.inputField} 
                        value={targetColumnName}
                       
                        onChange={(e) => setTargetColumnName(e.target.value)}
                    >
                        {columns.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputgroup}>
                    <label className={styles.size}>Deadline</label>
                    <input 
                        type='date' 
                        className={styles.inputField} 
                        onChange={(e) => setDeadline(e.target.value)} 
                    />
                </div>

                <div className={styles.inputgroup}>
                    <label className={styles.size}>Assign To</label>
                    <select 
                        className={styles.inputField} 
                       
                        onChange={(e) => setAssignedTo(e.target.value)}
                    >
                        <option value="Unassigned">Select a member</option>
                        {projectMembers.map((member, index) => (
                            <option key={index} value={member.name}>
                                {member.name} 
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputgroup}>
                    <label className={styles.size}>Priority</label>
                    <select 
                        className={styles.inputField} 
                   
                        onChange={(e) => setpriority(e.target.value)}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                    </select> 
                </div>

                <div className={styles.inputgroup}>
                    <label className={styles.size}>Description</label>
                    <textarea
                        className={styles.inputFieldd}
                        onChange={(e) => setdescription(e.target.value)} />


                </div>

                <div className={styles.bottom}>
                    <button type="button" className={styles.DiscardBtn} onClick={(handleDiscard)}>
                        Discard
                    </button>

                    <button type="button" className={styles.submitBtn} onClick={handleCreate}>
                        Save
                    </button>



                </div>
            </div>
        </div>
    );
}

export default NewTask;