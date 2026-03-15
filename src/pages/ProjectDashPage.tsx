
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
        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        const currentProject = allProjects.find((p: any) => p.id === id);

        if (currentProject) {
            setProjectName(currentProject.name);
            // Set the boards from this project
            setBoards(currentProject.boards || []);

            // Set the role
            const memberEntry = currentProject.members.find((m: any) => m.email === currentUser.email);
            if (memberEntry) {
                setProjectRole(memberEntry.role);
            }
        }
    }, [id, currentUser.email]);

    // Permissions Helper Functions
    const canManageSettings = currentUser.GlobalRole === 'Admin' || projectRole === 'Owner';
    const canAddBoard = projectRole !== 'Viewer';








    return(
        <div className={styles.layout}>
            <main className={styles.boards}>
                <h1>
                    {projectName}
                </h1>



                 <div className={styles.grid}>
                            {boards.map((proj) => {

                                const todoc= proj.columns.todo.length;
                                const progressCount = proj.columns.Inprogress.length ;
                            const doneCount = proj.columns.Done.length;
                            const total=todoc+progressCount+doneCount;
                            const percentage=total === 0 ? 0 : Math.round((doneCount / total) * 100);
                            const isCritical= proj.priority === "Critical";
                            const isHigh= proj.priority === "High";
                            const isMedium= proj.priority === "Medium";
                            const isLow= proj.priority === "Low";




                                return(


                                
                                <div key={proj.id} className={
                                    `${styles.card} 
                                ${isCritical ? styles.criticalCard : ''} 
                                ${isHigh ? styles.highCard : ''} 
                                ${isMedium ? styles.mediumCard : ''} 
                                ${isLow ? styles.lowCard : ''}
                                `}
                            >
                                {isCritical && <div className={styles.criticalBadge}>CRITICAL</div>}
                                {isHigh && <div className={styles.highBadge}>high</div>}
                                {isMedium && <div className={styles.mediumBadge}>Medium</div>}
                                {isLow && <div className={styles.lowBadge}>Low</div>}
                
                                    <div className={styles.priorityCorner}>
                                    <span 
                                     className={styles.dot} 
                                    style={{ backgroundColor: priorityColor[proj.priority] }}
                                    ></span>
                                    </div>
                
                
                
                                    <div>
                                    <h1>{ proj.name}</h1>
                                    </div>
                
                
                                    <div className={styles.projdes}>{proj.description}</div>
                
                                    <div className={styles.bottom}>
                                    <span>{proj.deadline}</span>

                                    <div className={styles.circularMeter}
                                    style={{background: `conic-gradient(#26b249 ${percentage * 3.6}deg, #333 0deg)`}}
                                    
                                    
                                    >
                                    <div className={styles.innerCircle}>
                                    <span>{percentage}%</span>
                                    </div>
                                    
                                        




                                    </div>
                                    
                                    </div>


                                    <div className={styles.center}>
                                    <button className={styles.EnterBtn} onClick={() => navigate(`/project/${id}/board/${proj.boardId}`)} >
                                                  Enter
                                    </button>
                                    </div>
                                    
                
                
                                </div>
                
                
                            )} 
                        
                        
                        
                        )}
                            
                
                          
                
                            </div>
                
                            
                
                        
                        

            </main>

           

            <aside className={styles.sidebar}>

                <button className={styles.item} onClick={() => navigate(`/project/${id}/members`) }>

                    View Members

                </button>
                {canAddBoard && (<button className={styles.item} onClick={() => navigate(`/project/${id}/kanbanBoard`) }>

                    Add Kanban Board

                </button>)}


                {canManageSettings && (<button className={styles.item} onClick={() => navigate(`/project/${id}/settings`) }>

                   Manage Project Settings

                </button>)}



                



            </aside>




        </div>

        
    )
}

export default ProjectDash;