import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import styles from '../styles/CompletedProj.module.css';
import { useNavigate } from 'react-router-dom';


interface ProjectData {
    id: string;
    name: string;
    description: string;
    deadline: string;
    priority: 'Low' | 'Medium' | 'High'; // String literal types for extra safety
    createdAt: string;
    createdBy: string;
}

function CompletedProject(){
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const navigate = useNavigate(); //
    useEffect(() => {
        // Fetch projects from your storage
        const completedProjects = JSON.parse(localStorage.getItem("completedProjects") || "[]");
        setProjects(completedProjects);
    }, []);

    const priorityColor: Record<string, string>={
        High: "#ff4d4d",   // Red
        Medium: "#ffcc00", // Yellow
        Low: "#28a745"     // Green

    }


    


    return(
        <div className={styles.backgnd}>
            <h1 className={styles.title}> Completed Projects</h1>
            <div className={styles.grid}>
            {projects.map((proj) => (
                <div key={proj.id} className={styles.card}>

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
                    
                    </div>
                    <div className={styles.center}>
                    <button className={styles.EnterBtn} onClick={() => navigate(`/project/${proj.id}`)} >
                                  Enter
                    </button>
                    </div>
                    


                </div>


            ) 
        
        
        
        )}
            

          

            </div>

            

        </div>
        
    )
}

export default CompletedProject