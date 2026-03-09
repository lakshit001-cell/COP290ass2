import styles from '../styles/NewProj.module.css'
import { useState } from 'react';

function Project() {
    const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [ProjectName, setProjectName] = useState<string>("");
    const [description, setdescription] = useState<string>("");
    const [deadline, setDeadline] = useState("");



   

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
                <label className={styles.size}>Description</label>
              <textarea
              
              className={styles.inputFieldd}
              
              onChange={(e) => setdescription(e.target.value)} 
              />
              </div>

              <button type="submit" className={styles.submitBtn}>
                    Create
                </button>
             



              



            </div>

        </div>
    )

}

export default Project;