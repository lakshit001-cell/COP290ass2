import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import styles from '../styles/Kanbandash.module.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';


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
    history: TaskEvent[];
    status :string;
}

function KanbanDash () {

    const navigate = useNavigate();
    const { id, boardId } = useParams();
    const [todoTasks, setTodoTasks] = useState<Task[]>([]);
    const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
    const [doneTasks, setDoneTasks] = useState<Task[]>([]);

    const priorityColor: Record<string, string>={
        High: "#ea4343",   // Red
        Medium: "#ffcc00", // Yellow
        Low: "#28a745" ,    // Green
        Critical : "#800000"

    }

const moveTask = (taskId: string, newStatus: string) => {
    
    const statusRank: Record<string, number> = {
        "todo": 0,
        "Inprogress": 1,
        "Done": 2
    };

    const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const projectIndex = allProjects.findIndex((p: any) => p.id === id);
    const boardIndex = allProjects[projectIndex]?.boards.findIndex((b: any) => b.boardId === boardId);

   

    const board = allProjects[projectIndex].boards[boardIndex];
    const cols = board.columns;

    let taskToMove: Task | null = null;
    let currentStatus = "";

    // 2. Locate the task without removing it yet
    const columnNames = Object.keys(statusRank); // ['todo', 'Inprogress', 'Done']
    for (const colName of columnNames) {
        const index = cols[colName].findIndex((t: Task) => String(t.id) === String(taskId));
        if (index !== -1) {
            taskToMove = cols[colName][index];
            currentStatus = colName;
            break;
        }
    }

    // 3. Handle the "Null" error or "Backwards" movement
    

    if (statusRank[newStatus] <= statusRank[currentStatus]) {
       
        return;
    }

    // 4. Perform the actual move (Splice from old, Push to new)
    const sourceIndex = cols[currentStatus].findIndex((t: Task) => String(t.id) === String(taskId));
    const extractedTask = cols[currentStatus].splice(sourceIndex, 1)[0];

    // Update status and record the event
    extractedTask.status = newStatus;
    
    // Safety check for history/log array
    if (!extractedTask.history) extractedTask.history = [];
    
    extractedTask.history.push({
        event: `Moved from ${currentStatus} to ${newStatus}`,
        timestamp: new Date().toLocaleString()
    });

    cols[newStatus].push(extractedTask);

    // 5. Save back to LocalStorage
    localStorage.setItem("projects", JSON.stringify(allProjects));
    
    // 6. Refresh the local state to trigger a re-render
    setTodoTasks([...cols.todo]);
    setInProgressTasks([...cols.Inprogress]);
    setDoneTasks([...cols.Done]);
    };

    useEffect(() => {
        // 1. Get the data
        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        const currentProject = allProjects.find((p: any) => p.id === id);

        if (currentProject) {
            // 2. Find the specific board
            const currentBoard = currentProject.boards?.find((b: any) => b.boardId === boardId);
            
            if (currentBoard && currentBoard.columns) {
                // 3. Set tasks into simple states
                setTodoTasks(currentBoard.columns.todo || []);
                setInProgressTasks(currentBoard.columns.Inprogress || []);
                setDoneTasks(currentBoard.columns.Done || []);
            }
        }
    }, [id, boardId]);

    const render= (task:Task) => {
        const color= priorityColor[task.priority];
        return (
            <div key={task.id}  className={styles.Task} 
                
                
                style={{ borderLeft: `8px solid ${color}` }} 
                onClick={() => navigate(`/project/${id}/board/${boardId}/task/${task.id}`)}
                draggable="true"
                onDragStart={(e)=>{

                    e.dataTransfer.setData("taskId", task.id);

                }}
                
                
                
                >

                <div className={styles.priorityTag} style={{ backgroundColor: color }}>
                    {task.priority}
                </div>
                
                <p><strong>{task.name}</strong></p>
                <span>Assigned to: {task.assignedTo}</span>
            </div>

        );

    };

    const handleDragover= (e:React.DragEvent) => {
        e.preventDefault();

    }

    const handleDrop = (e: React.DragEvent, targetStatus: string) => {
        const taskId = e.dataTransfer.getData("taskId");
        moveTask(taskId,targetStatus)


    }



    return (
       
        
        <div className={styles.backgnd}>
            <div className={styles.topHeader}>
                <button className={styles.TaskBtn} onClick={() => navigate(`/project/${id}/board/${boardId}/new-task`)}>
                    + New Task
                </button>
            </div>

            <div className={styles.column} >
                <div  className={styles.Card} 
                onDragOver={handleDragover}
                onDrop={(e) => handleDrop(e, "todo")}

                >
           
            
                <h1 > To Do</h1>
                {todoTasks.map(render)}
                </div>

                    

                       

            

            <div className={styles.Card} onDragOver={handleDragover} 
            onDrop={(e) => handleDrop(e, "Inprogress")} >
                <h1> In Progress</h1>
                {inProgressTasks.map(render)}
                    

           

            </div>

            <div className={styles.Card} onDragOver={handleDragover} onDrop={(e) => handleDrop(e, "Done")}>
                <h1> Done</h1>
                {doneTasks.map(render)}
                   

          

            </div>

            </div>
            </div>

        
    )
}

export default KanbanDash