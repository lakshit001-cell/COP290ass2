
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
    useEffect(() => {
        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        const currentProject = allProjects.find((p: any) => p.id === id);

        if (currentProject) {
            // Find the current user in the project's member list
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
                    kanban boards
                </h1>

            </main>

           

            <aside className={styles.sidebar}>

                <button className={styles.item} onClick={() => navigate(`/project/${id}/members`) }>

                    View Members

                </button>
                {canAddBoard && (<button className={styles.item} onClick={() => navigate(`/project/${id}/members`) }>

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