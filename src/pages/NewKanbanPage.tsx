import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import styles from '../styles/NewKanban.module.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function Kanban (){
    const { id } = useParams();
    const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [BoardName, setBoardName] = useState<string>("");
    const [description, setdescription] = useState<string>("");
    const [deadline, setDeadline] = useState("");
     const [priority, setpriority] = useState<string>("Low");
     const navigate = useNavigate(); //


    const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:5000/api/board/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            projId: id,
            name: BoardName,
            description: description,
            deadline: deadline,
            priority: priority,
        })
    });
    if(response.ok) navigate(`/project/${id}`);
    };


     
    return (

  <div className={styles.backgnd}>
              <div className={styles.card}>
                   <h1>Create Board</h1>
             
                <div className={styles.inputgroup}>
                  <label className={styles.size}>Board Name</label>
                <input
                type='text'
                className={styles.inputField}
                
                onChange={(e) => setBoardName(e.target.value)} 
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
                          <option value="Critical">Critical</option>
                      </select> 
                  
                </div>
  
  
  
                 <div className={styles.inputgroup}>
                  <label className={styles.size}>Description</label>
                <textarea
                
                className={styles.inputFieldd}
                
                onChange={(e) => setdescription(e.target.value)} 
                />
                </div>
  
                <button type="submit" className={styles.submitBtn} onClick={ handleCreateBoard}>
                      Create
                  </button>
               
  
  
  
                
  
  
  
              </div>
  
          </div>
      )
  
  }
  

export default Kanban