import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import styles from '../styles/Projsettings.module.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { preconnect } from 'react-dom';
import Popup from '../components/PopupPage';

function Settings (){
    const { id } = useParams();
    const navigate = useNavigate();
    const [popup, setPopup] = useState({ isOpen: false, title: "", message: "" });

    // 1. Form States
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [priority, setPriority] = useState("");
    const [addInput, setAddInput] = useState("");
    const [removeInput, setRemoveInput] = useState("");

    const openpopoup= (title :string, message :string) => {
        setPopup({isOpen:true,title,message})
    };

    const closepopup= ()=> {
        setPopup({ ...popup, isOpen: false });
        if (popup.title === "Update succesful" || popup.title === "Settings Saved") {
            navigate(`/project/${id}`);
        }


    };

const handleUpdate = () => {
        const isAddActive = addInput.trim() !== "";
        const isRemoveActive = removeInput.trim() !== "";
        

        if (!isAddActive && !isRemoveActive) {
            openpopoup("Missing Information", "please fill atleast one field")
            return;
        }

        let alertMessage = "";

        if (isAddActive) {
            openpopoup("Update succesful","user added");
        }

        if (isRemoveActive) {
            openpopoup("Update succesful","user removed")
        }

        
        
        // Reset fields and go back
        setAddInput("");
        setRemoveInput("");
        
    };

    
    



    

    useEffect(() => {
        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        const currentProject = allProjects.find((p: any) => p.id === id);

        if (currentProject) {
            setName(currentProject.name);
            setDescription(currentProject.description);
            setDeadline(currentProject.deadline);
            setPriority(currentProject.priority);
        }
    }, [id]);

    

    







    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");

        const updatedProjects = allProjects.map((p: any) => {
            if (p.id === id) {
                return { ...p, name, description, deadline, priority };
            }
            return p;
        });

        localStorage.setItem("projects", JSON.stringify(updatedProjects));
        
        navigate(`/project/${id}`);  // Return to Dashboard
    };


    const handlediscard= (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/project/${id}`);
    };

    const handleEnd= (e: React.FormEvent) => {
        e.preventDefault();
        if (!window.confirm("Are you sure you want to end this project? ")) 
            return;
        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        const completedProjects = JSON.parse(localStorage.getItem("completedProjects") || "[]");
        const projectToEnd = allProjects.find((p: any) => p.id === id);

    if (projectToEnd) {
        // Add a timestamp and status for better record-keeping
        const archivedProject = {
            ...projectToEnd,
            status: "Completed",
            completedAt: new Date().toISOString()
        };

        // 4. Remove from active projects
        const updatedActive = allProjects.filter((p: any) => p.id !== id);

        // 5. Add to completed projects
        const updatedCompleted = [...completedProjects, archivedProject];

        // 6. Save both back to localStorage
        localStorage.setItem("projects", JSON.stringify(updatedActive));
        localStorage.setItem("completedProjects", JSON.stringify(updatedCompleted));

       
        navigate('/Projects'); // Redirect to the main projects list
    }
    };


    

    return (
        <div className={styles.backgnd}>
            <Popup 
                isOpen={popup.isOpen} 
                title={popup.title} 
                message={popup.message} 
                onClose={closepopup} 
            />

            <h1 className={styles.heading}> Settings </h1>

            <div className={styles.divison}>

            <div className={styles.card}>
                <div className={styles.inputgroup}>
                                <label className={styles.size}>Project Name</label>
                              <input
                               value={name}
                              className={styles.inputField}
                              onChange={(e) => setName(e.target.value)}  required
                              />
                              </div>
                                
                             <div className={styles.inputgroup}>
                                <label className={styles.size}>Deadline</label>
                              <input
                              type='date'
                              value={deadline}
                              className={styles.inputField}
                              
                              onChange={(e) => setDeadline(e.target.value)} required
                              />
                
                
                
                              </div>


                             <div className={styles.inputgroup}>
                                <label className={styles.size}>Priority</label>
                              <select value={priority} className={styles.inputField} onChange={(e) => setPriority(e.target.value)}>
                                     <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select> 
                                
                              </div>
                
                
                
                               <div className={styles.inputgroup}>
                                <label  className={styles.size}>Description</label>
                              <textarea
                              value={description}
                              
                              
                              className={styles.inputFieldd}
                              
                              onChange={(e) => setDescription(e.target.value)} 
                              />
                              </div>
                                <div className={styles.buttons}>
                               <div className={styles.bottom}>

                                <button type="submit" className={styles.DiscardBtn} onClick={handlediscard}>
                                    Discard
                                </button>
                              <button type="submit" className={styles.submitBtn} onClick={handleSave}>
                                    Save
                                </button>
                                </div> 


                                <button type="submit" className={styles.EndBtn} onClick={handleEnd}>
                                    End Project
                                </button>
                            </div>

            </div>


            <div className={styles.card}>
                <h1>Manage Members</h1>
                <div className={styles.inputgroup}>
                                <label className={styles.size}>Add New Member</label>
                              <input
                              placeholder='Enter Username or Email'
                              value={addInput}
                               
                              className={styles.inputField}
                              onChange={(e) => setAddInput(e.target.value)}  
                              />


                               <label className={styles.size}>Remove a Member</label>
                              <input
                              placeholder='Enter Username or Email'
                              value={removeInput}
                               
                              className={styles.inputField}
                              onChange={(e) => setRemoveInput(e.target.value)}  
                              />
                              </div>
                                
                             


                            
                
                
                
                               
                                <div className={styles.buttons}>
                               <div className={styles.bottom}>

                                <button type="submit" className={styles.DiscardBtn} onClick={handlediscard}>
                                    Discard
                                </button>

                                
                              <button type="submit" className={styles.submitBtn} onClick={handleUpdate}>
                                    UPDATE
                                </button>
                                </div> 


                           
                            </div>

            </div>

            </div>

        </div>
    )
}

export default Settings;