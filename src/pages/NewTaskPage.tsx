import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import styles from '../styles/NewTask.module.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

interface TaskEvent {
    event: string;
    time: string;
}
interface Task {
    id: string;
    name: string;
    description: string;
    deadline: string;
    priority: string;
    status: "todo"
    assignedTo: string;
    log : TaskEvent[];
}

interface Member {
    name: string;
    email: string;
    role: string;
}


function NewTask () 
{
   const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
       const [TaskName, setTaskName] = useState<string>("");
       const [description, setdescription] = useState<string>("");
       const [deadline, setDeadline] = useState("");
        const [priority, setpriority] = useState<string>("Low");
        const [assignedTo, setAssignedTo] = useState<string>("Unassigned");
        const { id, boardId } = useParams();
        const [projectMembers, setProjectMembers] = useState<Member[]>([]);
        const navigate = useNavigate(); 

        useEffect(() => {
        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        const currentProject = allProjects.find((p: any) => p.id === id);
        
        if (currentProject && currentProject.members) {
            setProjectMembers(currentProject.members);
        }
        }, [id]);

        const handleCreate = () => {
        if (!TaskName.trim()) {
            alert("Please enter a task name");
            return;
        }

        

        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        
        // Find the specific project and board
        const projectIndex = allProjects.findIndex((p: any) => p.id === id);
        if (projectIndex === -1) return;

        const boardIndex = allProjects[projectIndex].boards.findIndex((b: any) => b.boardId === boardId);
        if (boardIndex === -1) return;

        // Create the new task object
        const newTask: Task = {
            id: Date.now().toString(),
            name: TaskName,
            description,
            deadline,
            priority,
            status: "todo",
            assignedTo,
            log : [
                { 
                    event: `Task Created and assigned to ${assignedTo}`, 
                    time: new Date().toLocaleString() 
        }

            ]


             // New tasks start in the 'todo' column
        };

        // Push into the 'todo' array of the specific board
        // Assuming your board structure is { boards: [{ boardId, columns: { todo: [], Inprogress: [], Done: [] } }] }
        if (!allProjects[projectIndex].boards[boardIndex].columns) {
            allProjects[projectIndex].boards[boardIndex].columns = { todo: [], Inprogress: [], Done: [] };
        }

        allProjects[projectIndex].boards[boardIndex].columns.todo.push(newTask);

        // Save back to localStorage
        localStorage.setItem("projects", JSON.stringify(allProjects));
        
        
        navigate(`/project/${id}/board/${boardId}`); // Go back to the board
    };
   
        
   
   
   
      
   
       
       return (
           <div className={styles.backgnd}>
               <div className={styles.card}>
                    <h1>Create Task</h1>
              
                 <div className={styles.inputgroup}>
                   <label className={styles.size}>Task Name</label>
                 <input
                 type='text'
                 className={styles.inputField}
                 
                 onChange={(e) => setTaskName(e.target.value)} 
                 />
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
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}>


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
                 <select className={styles.inputField} onChange={(e) => setpriority(e.target.value)}>
                        <option value="Low">Low</option>
                           <option value="Medium">Medium</option>
                           <option value="High">High</option>
                           <option value="High">Critical</option>
                           
                       </select> 
                   
                 </div>
   
   
   
                  <div className={styles.inputgroup}>
                   <label className={styles.size}>Description</label>
                 <textarea
                 
                 className={styles.inputFieldd}
                 
                 onChange={(e) => setdescription(e.target.value)} 
                 />
                 </div>
   
                 <button type="submit" className={styles.submitBtn} onClick={handleCreate}>
                       Create
                   </button>
                
   
   
   
                 
   
   
   
               </div>
   
           </div>
       )
}

export default NewTask;