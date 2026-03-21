import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, data } from 'react-router-dom';
import styles from '../styles/Kanbandash.module.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import TaskDash from './TaskDashPage';

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
    id?: string;
    _id?: string;
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
    const [filterStoryId, setFilterStoryId] = useState<string>("all");

    const priorityColor: Record<string, string>={
        High: "#ea4343",   // Red
        Medium: "#ffcc00", // Yellow
        Low: "#28a745" ,    // Green
        Critical : "#800000"

    }

const moveTask = async (taskId: string, targetColId: string) => {


    const targetCol = columns.find((c: any) => c.id.toString() === targetColId);
    const initCol = columns.find((c:any) => c.tasks.some((t:any)=> t.id.toString() === taskId));

    if(!targetCol || !initCol) return;
    
    // 2. Find Source and Target columns
    const sourceColIndex = columns.findIndex((col: any) => 
        col.tasks.some((t: any) => String(t.id) === String(taskId))
    );
    const targetColIndex = columns.findIndex((col: any) => col.id === targetColId);

    // 3. THE NEW FORWARD-ONLY CHECK
    // If target index is less than or equal to source, block it
    if (targetColIndex <= sourceColIndex) {
        alert("Workflow Error: You can only move tasks forward.");
        return;
    }

    // 4. WIP LIMIT CHECK
    if (targetCol.wipLimit > 0 && targetCol.tasks.length >= targetCol.wipLimit) {
        alert(`WIP Limit Reached for ${targetCol.name}!`);
        return;
    }

    try{
        const token = localStorage.getItem("accessToken")
        const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/move`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                newcol: targetCol.name,
                oldCol: initCol.name, 
            })
        })

        if(response.ok) window.location.reload();
    }catch(error){
        console.error("Patch error", error);
    }
};

    useEffect(() => {
        const getBoardData = async () => {
            const token = localStorage.getItem("accessToken");
            if(!token) console.error("No token found");
            const header = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            try{
                const resBoard = await fetch(`http://localhost:5000/api/task/${id}/board/${boardId}`, {headers: header} );
                const dataBoard = await resBoard.json();

                const resTask = await fetch(`http://localhost:5000/api/task/board/${boardId}`, {headers: header} );
                const dataTask = await resTask.json();

                if(resTask.ok){
                    const newColumns = dataBoard.board.columns.map((col: any) => ({
                    ...col,
                    tasks: dataTask.filter((task:any)=> task.status === col.name)
                    
                }));
                setColumns(newColumns);
                }
                if (!resTask.ok){console.log("Task not fetched")};

                setStories(dataBoard.stories);
                
            }catch(error){
                console.error("fetch fail", error);
            }
        };
        getBoardData();
    }, [id, boardId]);

    const render= (task:Task) => {
        const color= priorityColor[task.priority];
        const actualTaskId = task.id || (task as any)._id;
        const parentStory = stories.find(s => String(s.id || s._id) === String(task.parentId));
        return (
            <div key={actualTaskId}  className={styles.Task} 
                
                
                style={{ borderLeft: `8px solid ${color}` }} 
                onClick={() => navigate(`/project/${id}/board/${boardId}/task/${actualTaskId}`)}
                draggable="true"
                onDragStart={(e)=>{

                    e.dataTransfer.setData("taskId", actualTaskId);

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

                <div>
                    <select
                    className={styles.TaskBtn}
                    value={filterStoryId}
                    onChange={(e) => setFilterStoryId(e.target.value)}>

                    <option value="all">
                        Track All

                    </option>


                    {stories.map((s)=>(

                        <option
                        key={s.id || s._id} value={s.id || s._id}
                        >
                            {s.name}

                        </option>
                    ))}

                    </select>

                </div>



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
                <div  key={col.id || col.name} 
                        className={styles.Card} 
                        onDragOver={(e) => e.preventDefault()} 
                        onDrop={(e) => moveTask(e.dataTransfer.getData("taskId"), col.id)}>


                            <h1>{col.name}</h1>

                            {col.wipLimit > 0 && (
                            <span className={styles.wipLabel}>WIP: {col.tasks.length}/{col.wipLimit}</span>
                        )}
                            {col.tasks.filter(t => filterStoryId === "all" || String(t.parentId) === String(filterStoryId)).map(render)}


                    </div>
            
            
            
            
            )}

               

                    

                       

            

            


             

            </div>
            </div>

        
    )
}

export default KanbanDash