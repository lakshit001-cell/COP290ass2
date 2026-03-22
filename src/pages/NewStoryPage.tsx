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
    
    const [firstColumn, setFirstColumn] = useState("");

   useEffect(() => {
        const fetchContext = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                // Using your getMemetc function endpoint
                const res = await fetch(`http://localhost:5000/api/task/${id}/board/${boardId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();

                if (res.ok && data.board?.columns?.length > 0) {
                    setFirstColumn(data.board.columns[0].name);
                }
            } catch (error) {
                console.error("Failed to load board context", error);
            }
        };
        fetchContext();
    }, [id]);



const handleCreate = async () => {
        if (!storyName.trim()) {
            alert("Please enter a story name");
            return;
        }

        const token = localStorage.getItem("accessToken");
        const storyData = {
            name: storyName,
            description: description,
            type: 'Story', 
            priority: priority,
            column: firstColumn || "To Do", 
            kanban: boardId,
            deadline: deadline || null,
        };

        try {
            const response = await fetch(`http://localhost:5000/api/task/create/${boardId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(storyData)
            });

            if (response.ok) {
                alert(`Story "${storyName}" created successfully!`);
                navigate(`/project/${id}/board/${boardId}`);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Save error", error);
            alert("Server connection failed");
        }

        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");

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
                        value={storyName}
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
                        value={priority}
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
                        value={description}
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