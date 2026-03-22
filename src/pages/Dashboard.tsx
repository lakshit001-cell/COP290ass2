import { useEffect, useState } from 'react';
import styles from '../styles/Dashboard.module.css';

interface ProjectData {
    _id: string;
    name: string;
    description: string;
    deadline: string;
    priority: 'Low' | 'Medium' | 'High'; // String literal types 
    createdAt: string;
    createdBy: string;
}
function Dashboard (){
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);
    useEffect(()=> {
        const fetchData = async () =>{
        const token = localStorage.getItem("accessToken");

        const resProj = await fetch("http://localhost:5000/api/project/user-projects", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
        const resTask = await fetch("http://localhost:5000/api/task/tasks/my", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                const dataProj = await resProj.json();
                setProjects(Array.isArray(dataProj) ? dataProj : []);
                const dataTask = await resTask.json();
                setTasks(Array.isArray(dataTask) ? dataTask : []);
            }
            fetchData();
    }, [])
    const crits = tasks.filter(t=> t.priority === 'Critical').length;
    return(
        <div className={styles.backgnd

        }>
            <h1>WELCOME BACK _</h1>
            <div className={styles.card}>
                <h2>Your Stats </h2>
                <p> Total Projects : <strong>{projects.length}</strong></p>
                <p>Total Tasks : <strong>{tasks.length}</strong></p>
                <p>Critical Tasks : <strong>{crits}</strong></p>

            </div>
            <div className={styles.listsContainer} style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                    
                    {/* Projects List */}
                    <div className={styles.card} style={{ flex: 1 }}>
                        <h3>My Projects</h3>
                        <ul>
                            {projects.map(proj => (
                                <li key={proj._id}>{proj.name}</li>
                            ))}
                            {projects.length === 0 && <li>No projects found.</li>}
                        </ul>
                    </div>

                    {/* Tasks List */}
                    <div className={styles.card} style={{ flex: 1 }}>
                        <h3>Assigned Tasks</h3>
                        <ul>
                            {tasks.map(task => (
                                <li key={task._id}>
                                    {task.name} 
                                    {task.priority === 'High' && <span style={{ color: 'red', marginLeft: '10px' }}>[!]</span>}
                                </li>
                            ))}
                            {tasks.length === 0 && <li>No tasks assigned.</li>}
                        </ul>
                    </div>
                </div>
            </div>
    );
}

export default Dashboard;