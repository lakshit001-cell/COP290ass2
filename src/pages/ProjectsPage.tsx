import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import styles from '../styles/Projects.module.css';
import { useNavigate } from 'react-router-dom';


interface ProjectData {
    _id: string;
    name: string;
    description: string;
    deadline: string;
    priority: 'Low' | 'Medium' | 'High'; // String literal types 
    createdAt: string;
    createdBy: string;
}

function Project(){
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const navigate = useNavigate(); //
    useEffect(() => {
        // Fetch projects from storage
        const fetchProjects = async () => {
            console.log("getting token");
            const token = localStorage.getItem("accessToken");
            console.log("fetching");
            try{
                const response = await fetch("http://localhost:5000/api/project/user-projects", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                const data = await response.json();
                setProjects(data);
                console.log("set data");
            }catch(error){
                console.error("project fetch Fail", error);
            }
        }

        fetchProjects();
    }, []);

    const priorityColor: Record<string, string>={
        High: "#ff4d4d",   // Red
        Medium: "#ffcc00", // Yellow
        Low: "#28a745"     // Green

    }

    return(
        <div className={styles.backgnd}>
            <h1 className={styles.title}> Your Projects</h1>
            <div className={styles.grid}>
            {projects.map((proj) => (
                <div key={proj._id} className={styles.card}>

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
                    <span>{proj.deadline.split('T')[0]}</span>
                    
                    </div>
                    <div className={styles.center}>
                    <button className={styles.EnterBtn} onClick={() => navigate(`/project/${proj._id}`)} >
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

export default Project