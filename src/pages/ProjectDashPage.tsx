
import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import styles from '../styles/ProjectDash.module.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function ProjectDash (){
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { id } = useParams();
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [projectRole, setProjectRole] = useState<string>("");

    const [boards, setBoards] = useState<any[]>([]);
    const [projectName, setProjectName]= useState<string>("");

    const priorityColor: Record<string, string>={
        High: "#ea4343",   // Red
        Medium: "#ffcc00", // Yellow
        Low: "#28a745" ,    // Green
        Critical : "#800000"

    }

    
   useEffect(() => {
    const fetchProject = async () =>{
        const token = localStorage.getItem("accessToken");
        const header= {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
         try{
            const response = await fetch(`http://localhost:5000/api/project/${id}`, {
                method: 'GET',
                headers: header
            });
            const data = await response.json();
            if(!response.ok) {
                alert("Access denied");
                return;
            }
            setProjectName(data.name)
            
            
            const member = data.members.find((m: any) => m.user._id === currentUser.id);
            if (member) setProjectRole(member.role);

            const resBoards =  await fetch(`http://localhost:5000/api/board/project/${id}`, {
                method: 'GET',
                headers: header
            });
            const dataBoards = await resBoards.json();
            

            const tasksnBoards = await Promise.all(
                dataBoards.map(async (board: any) => {
                    const resTasks = await fetch(`http://localhost:5000/api/task/board/${board._id}`, {headers: header});
                    const dataTasks = await resTasks.json(); 

                    return {
                        ...board,
                        allTasks: Array.isArray(dataTasks) ? dataTasks : []
                    }
                })
            )
            console.log(boards, dataBoards)
            setBoards(tasksnBoards);
            

         }catch(error){
            console.error("project fetch Fail", error);
         }
    }

    fetchProject();
    }, [id, currentUser.email]);

    // Permissions Helper Functions
    const canManageSettings = currentUser.GlobalRole === 'Admin' || projectRole === 'Owner';
    const canAddBoard = projectRole !== 'Viewer';


     return (
        <div className={styles.layout}>
            <main className={styles.boards}>
                <h1>{projectName}</h1>

                <div className={styles.grid}>
                    {boards.map((board) =>  {

                        const tasks = board.allTasks || [];
                        
                        const totalTasks = tasks.length;
                        const doneCount = tasks.filter((t:any)=> t.status?.trim().toLowerCase() === "done").length;
                        const percentage = totalTasks === 0 ? 0 : Math.round((doneCount / totalTasks) * 100);

                        // Priority styling logic
                        const priorityClass = styles[`${board.priority?.toLowerCase()}Card`] || '';

                        return (
                            <div key={board._id} className={`${styles.card} ${priorityClass}`}>
                                {board.priority && (
                                    <div className={styles[`${board.priority.toLowerCase()}Badge`]}>
                                        {board.priority}
                                    </div>
                                )}

                                <div className={styles.priorityCorner}>
                                    <span 
                                        className={styles.dot} 
                                        style={{ backgroundColor: priorityColor[board.priority] }}
                                    ></span>
                                </div>

                                <div>
                                    <h1>{board.name}</h1>
                                </div>

                                <div className={styles.projdes}>{board.description}</div>

                                <div className={styles.bottom}>
                                    <span>{board.deadline ? new Date(board.deadline).toLocaleDateString() : 'No deadline'}</span>

                                    <div 
                                        className={styles.circularMeter}
                                        style={{ background: `conic-gradient(#26b249 ${percentage * 3.6}deg, #333 0deg)` }}
                                    >
                                        <div className={styles.innerCircle}>
                                            <span>{percentage}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.center}>
                                    <button 
                                        className={styles.EnterBtn} 
                                        onClick={() => navigate(`/project/${id}/board/${board.boardId || board._id}`)}
                                    >
                                        Enter
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            <aside className={styles.sidebar}>
                <button className={styles.item} onClick={() => navigate(`/project/${id}/members`)}>
                    View Members
                </button>
                
                {canAddBoard && (
                    <button className={styles.item} onClick={() => navigate(`/project/${id}/kanbanBoard`)}>
                        Add Kanban Board
                    </button>
                )}

                {canManageSettings && (
                    <button className={styles.item} onClick={() => navigate(`/project/${id}/settings`)}>
                        Manage Project Settings
                    </button>
                )}
            </aside>
        </div>
    );
}

export default ProjectDash;