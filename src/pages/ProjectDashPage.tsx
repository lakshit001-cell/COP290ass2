
import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import styles from '../styles/ProjectDash.module.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function ProjectDash (){
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { id } = useParams();
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");







    return(
        <div className={styles.layout}>
            <main className={styles.boards}>
                <h1>
                    kanban boards
                </h1>

            </main>

           

            <aside className={styles.sidebar}>

                <h1> have</h1>



            </aside>




        </div>

        
    )
}

export default ProjectDash;