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
    const [projectMembers, setProjectMembers] = useState([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [columns, setColumns] = useState<Column[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

   useEffect(() => {

    const fetchData = async () => {
        const token = localStorage.getItem("accessToken");
        const header = {
            'Authorization' : `Bearer ${token}`,
            'Content-Type' : 'application/json',
        }
        try{
            const resProject = await fetch(`http://localhost:5000/api/project/${id}`, {headers: header});
            const projData = await resProject.json();

            const resBoard = await fetch(`http://localhost:5000/api/task/${id}/board/${boardId}`, {headers: header})
            const boardData = await resBoard.json();

            if(resBoard.ok && resProject.ok){
                setProjectMembers(projData.members || []);
                setStories(boardData.stories || []);
                setColumns(boardData.board.columns);

                if (boardData.board.columns && boardData.board.columns.length > 0) {
                    setTargetColumnName(boardData.board.columns[0].name);
                }
                setIsLoaded(true);
            }

        }catch(error){
            console.error("fetch fail", error)
        }
    }
    fetchData();
}, [id, boardId]);

    const handleCreate =async () => {

    if (!taskName.trim() || !targetColumnName) {
        alert("Please enter a name and select a column");
        return;
    }

    const token = localStorage.getItem("accessToken");

    
    const newTask = {
        type: taskType,           // "Task" | "Bug"
        name: taskName,
        story: "",
        column: targetColumnName, // The status/column name
        description: description,
        assignee: assignedTo,     // The user name or ID
        deadline: deadline,
        priority: priority
    };

    if(selectedStoryId != 'Independent') newTask.story = selectedStoryId

    try {
        const response = await fetch(`http://localhost:5000/api/task/create/${boardId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        });

        const data = await response.json();

        if (response.ok) {
            alert("Task created successfully!");
        
            navigate(`/project/${id}/board/${boardId}`);
        } else {
            alert(data.message || "Failed to create task");
        }

    } catch (error) {
        console.error("Create task fail", error);
        alert("Server error while creating task");
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
                        {projectMembers.map((member:any, index: number) => (
                            <option key={member.user._id || index} value={member.user._id}>
                                {member.user.username} ({member.role}) 
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