import { useState, useEffect } from 'react';
import styles from '../styles/NewStory.module.css';
import { useNavigate, useParams } from 'react-router-dom';

interface Member {
    name: string;
    email: string;
    role: string;
}

interface Story {
    id: string;
    name: string;
}

interface Column {
    id: string;
    name: string;
}

function NewStory() {
    const { id, boardId } = useParams();
    const navigate = useNavigate();
    const [storyName, setStoryName] = useState("");
    const [description, setdescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [priority, setpriority] = useState("Low");

    const [isLoaded, setIsLoaded] = useState(false);
    
    


    
    

    

   useEffect(() => {
        // Just checking if project exists
        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        const project = allProjects.find((p: any) => String(p.id) === String(id));
        if (project) {
            setIsLoaded(true);
        }
    }, [id]);



const handleCreate = () => {
        if (!storyName.trim()) {
            alert("Please enter a story name");
            return;
        }

        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        
        // 1. Find the project and board indices
        const pIdx = allProjects.findIndex((p: any) => String(p.id) === String(id));
        if (pIdx === -1) return;

        const bIdx = allProjects[pIdx].boards.findIndex((b: any) => String(b.boardId) === String(boardId));
        if (bIdx === -1) return;

        // 2. Create the Story object
        const newStory = {
            id: `story-${Date.now()}`,
            name: storyName,
            description: description,
            deadline: deadline,
            priority: priority,
            createdAt: new Date().toLocaleString()
        };

        // 3. STORAGE LOGIC: Push to the board's story array
        // We ensure the array exists first so it doesn't crash
        if (!allProjects[pIdx].boards[bIdx].stories) {
            allProjects[pIdx].boards[bIdx].stories = [];
        }

        allProjects[pIdx].boards[bIdx].stories.push(newStory);

        // 4. SAVE AND NAVIGATE
        localStorage.setItem("projects", JSON.stringify(allProjects));
        alert(`Story "${storyName}" created successfully!`);
        navigate(`/project/${id}/board/${boardId}`);
    };

    const handleDiscard = () => {
        navigate(-1);
    }



   

    return (
        <div className={styles.backgnd}>
            <h1>Create Story</h1>
            <div className={styles.card}>
                

            

                <div className={styles.inputgroup}>
                    <label className={styles.size}>Story Name</label>
                    <input 
                        type='text' 
                        className={styles.inputField} 
                       
                        onChange={(e) => setStoryName(e.target.value)} 
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
                    <select 
                        className={styles.inputField} 
                   
                        onChange={(e) => setpriority(e.target.value)}
                    >
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
                        onChange={(e) => setdescription(e.target.value)} />


                </div>

                <div className={styles.bottom}>
                    <button type="button" className={styles.DiscardBtn} onClick={(handleDiscard)}>
                        Discard
                    </button>

                    <button type="button" className={styles.submitBtn} onClick={handleCreate}>
                        Save
                    </button>



                </div>
            </div>
        </div>
    );
}

export default NewStory;