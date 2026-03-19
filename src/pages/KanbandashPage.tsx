import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import styles from '../styles/Kanbandash.module.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

interface Column {
    id: string;
    name: string;
    wipLimit: number;
    tasks: Task[];
}


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
    type: "Task" | "Bug";
    parentId?: string;
}

function KanbanDash () {

    const navigate = useNavigate();
    const { id, boardId } = useParams();
    const [columns, setColumns] = useState<Column[]>([]);
    const [stories, setStories] = useState<any[]>([]);

    const priorityColor: Record<string, string>={
        High: "#ea4343",   // Red
        Medium: "#ffcc00", // Yellow
        Low: "#28a745" ,    // Green
        Critical : "#800000"

    }

const moveTask = (taskId: string, targetColId: string) => {
    // 1. Load data as usual...
    const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const project = allProjects.find((p: any) => p.id === id);
    const board = project.boards.find((b: any) => b.boardId === boardId);
    
    // 2. Find Source and Target columns
    const sourceColIndex = board.columns.findIndex((col: any) => 
        col.tasks.some((t: any) => String(t.id) === String(taskId))
    );
    const targetColIndex = board.columns.findIndex((col: any) => col.id === targetColId);

    // 3. THE NEW FORWARD-ONLY CHECK
    // If target index is less than or equal to source, block it
    if (targetColIndex <= sourceColIndex) {
        alert("Workflow Error: You can only move tasks forward.");
        return;
    }

    // 4. WIP LIMIT CHECK
    const targetCol = board.columns[targetColIndex];
    if (targetCol.wipLimit > 0 && targetCol.tasks.length >= targetCol.wipLimit) {
        alert(`WIP Limit Reached for ${targetCol.name}!`);
        return;
    }

    // 5. Perform the move and save...
    const taskIndex = board.columns[sourceColIndex].tasks.findIndex((t: any) => String(t.id) === String(taskId));
    const [task] = board.columns[sourceColIndex].tasks.splice(taskIndex, 1);
    
    task.status = targetCol.name;
    targetCol.tasks.push(task);

    localStorage.setItem("projects", JSON.stringify(allProjects));
    // Trigger state update for columns array
    setColumns([...board.columns]);
};

    useEffect(() => {
        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        const currentProject = allProjects.find((p: any) => p.id === id);
        const currentBoard = currentProject?.boards?.find((b: any) => b.boardId === boardId);

        if (currentBoard && currentBoard.columns) {
            setColumns(currentBoard.columns);
            setStories(currentBoard.stories || []);
        }
    }, [id, boardId]);

    const render= (task:Task) => {
        const color= priorityColor[task.priority];
        const parentStory = stories.find(s => String(s.id) === String(task.parentId));
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
                
                <div className={styles.size}>
                <p><strong>{task.name}</strong></p>
                
                </div>
                <span>Assigned to: {task.assignedTo}</span>


                {parentStory && (<div className={styles.text}>
                    Story: <p><strong> {parentStory.name}</strong></p> 
                   
                       
                         </div>
                    )}

                <div className={styles.bold}>
                <p><strong>{task.type}</strong></p>
                </div>

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
                <button className={styles.TaskBtn} onClick={() => navigate(`/project/${id}/board/${boardId}/new-story`)}>
                    + New Story
                </button>
                <button className={styles.TaskBtn} onClick={() => navigate(`/project/${id}/board/${boardId}/new-task`)}>
                    + New Task
                </button>

                <button className={styles.TaskBtn} onClick={() => navigate(`/project/${id}/board/${boardId}/Manage`)}>
                    Manage Columns
                </button>
            </div>


            <div className={styles.column} >
                {columns.map((col)=>
                <div  key={col.id} 
                        className={styles.Card} 
                        onDragOver={(e) => e.preventDefault()} 
                        onDrop={(e) => moveTask(e.dataTransfer.getData("taskId"), col.id)}>


                            <h1>{col.name}</h1>
                            {col.wipLimit > 0 && (
                            <span className={styles.wipLabel}>WIP: {col.tasks.length}/{col.wipLimit}</span>
                        )}
                            {col.tasks.map(render)}


                    </div>
            
            
            
            
            )}

               

                    

                       

            

            


             

            </div>
            </div>

        
    )
}

export default KanbanDash