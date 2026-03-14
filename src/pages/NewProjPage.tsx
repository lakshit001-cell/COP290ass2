import styles from '../styles/NewProj.module.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; //

function NewProject() {
    const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [ProjectName, setProjectName] = useState<string>("");
    const [description, setdescription] = useState<string>("");
    const [deadline, setDeadline] = useState("");
     const [priority, setpriority] = useState<string>("Low");
     const navigate = useNavigate(); //

     const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents page reload
        
        const token = localStorage.getItem("accessToken");

        if(!token){
            console.error("No Access Token found");
            return;
        }

        try{
            const response = await fetch("http://localhost:5000/api/project/new-project", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: ProjectName,
                    deadline: deadline,
                    priority: priority,
                    description: description, 
                })
            })

            const data = await response.json();

            if(!response.ok){
                console.error("Error creating project", data.error);
            }else{
            // 2. Fetch existing projects or start an empty array
            // const existingProjects = JSON.parse(localStorage.getItem("projects") || "[]");

            // // 3. Add the new project to the list and save back to storage
            // const updatedProjects = [...existingProjects, newProject];
            // localStorage.setItem("projects", JSON.stringify(updatedProjects));
                navigate('/Projects');
            }
        }catch(error){
            console.error("API/connection error", error);
        }
    };



   
    //checking admin role from local storage is unsafe as anyone can change it using inspect console.

    if (existingUser.GlobalRole !== 'Admin') {
        return <h1 className={styles.text}>Access Denied: Admins Only</h1>;
    }
    return (
        <div className={styles.backgnd}>
            <div className={styles.card}>
                 <h1>Create Project</h1>
           
              <div className={styles.inputgroup}>
                <label className={styles.size}>Project Name</label>
              <input
              type='text'
              className={styles.inputField}
              
              onChange={(e) => setProjectName(e.target.value)} 
              />
              </div>
                
             <div className={styles.inputgroup}>
                <label className={styles.size}>Deadline</label>
              <input
              type='date'
              className={styles.inputField}
              
              onChange={(e) => setDeadline(e.target.value)} 
              />



              </div>
             <div className={styles.inputgroup}>
                <label className={styles.size}>Priority</label>
              <select className={styles.inputField} onChange={(e) => setpriority(e.target.value)}>
                     <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select> 
                
              </div>



               <div className={styles.inputgroup}>
                <label className={styles.size}>Description</label>
              <textarea
              
              className={styles.inputFieldd}
              
              onChange={(e) => setdescription(e.target.value)} 
              />
              </div>

              <button type="submit" className={styles.submitBtn} onClick={handleCreate}>
                    Create
                </button>
             



              



            </div>

        </div>
    )

}

export default NewProject;