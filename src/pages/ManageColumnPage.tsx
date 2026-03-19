import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/ManageColumn.module.css';

interface Column {
    id: string;
    name: string;
    wipLimit: number;
    tasks: any[];
}

function ManageColumns() {
    const { id, boardId } = useParams();
    const navigate = useNavigate();
    const [columns, setColumns] = useState<Column[]>([]);

    // Load initial data
    useEffect(() => {
        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        const project = allProjects.find((p: any) => String(p.id) === String(id));
        const board = project?.boards.find((b: any) => String(b.boardId) === String(boardId));
        
        if (board && Array.isArray(board.columns)) {
            setColumns(board.columns);
        }
    }, [id, boardId]);

    // Handle reordering: Swapping elements in the array
    const moveColumn = (index: number, direction: 'up' | 'down') => {
        const newColumns = [...columns];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newColumns.length) return;

        // Swap
        const temp = newColumns[index];
        newColumns[index] = newColumns[targetIndex];
        newColumns[targetIndex] = temp;

        setColumns(newColumns);
    };


    const addColumn= () => {
        const newCol: Column = {
            id: `col-${Date.now()}`,
            name:" ",
            wipLimit: 10,
            tasks: []
        };
        setColumns([...columns, newCol]);
    };

    const deleteColumn = (colId: string, colName: string) => {
       
        if (window.confirm(`Tasks inside will be lost.`)) {
            setColumns(columns.filter(c => c.id !== colId));
        }
    };




    const updateColumn = (colId: string, field: string, value: any) => {
        setColumns(prev => prev.map(col => 
            col.id === colId ? { ...col, [field]: value } : col
        ));
    };




    const handleSave = () => {
        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        const projectIndex = allProjects.findIndex((p: any) => String(p.id) === String(id));
        
        if (projectIndex !== -1) {
            const boardIndex = allProjects[projectIndex].boards.findIndex((b: any) => String(b.boardId) === String(boardId));
            if (boardIndex !== -1) {
                allProjects[projectIndex].boards[boardIndex].columns = columns;
                localStorage.setItem("projects", JSON.stringify(allProjects));
                navigate(`/project/${id}/board/${boardId}`);
            }
        }
    };



    return (
        <div className={styles.backgnd}>
            <h1>Manage Workflow</h1>
            <div className={styles.card}>
                
                

                <div className={styles.columnList}>
                    <button className={styles.addBtn} onClick={addColumn}> Add Column</button>


                    {columns.map((col, index) => (
                        <div key={col.id} className={styles.colRow}>
                            
                            <div className={styles.reorderGroup}>
                                <button className={styles.orderBtn} 
                                    onClick={() => moveColumn(index, 'up')}
                                    disabled={index === 0}
                                > ▲ 
                                
                                </button>



                                    <button 
                                    className={styles.orderBtn} 
                                    onClick={() => moveColumn(index, 'down')}
                                    disabled={index === columns.length - 1}
                                > ▼ 
                                </button>

                            </div>

                            <div className={styles.inputGroup}>
                                <label>Column Name</label>
                                <input 
                                    type="text"
                                    value={col.name}
                                    
                                    onChange={(e) => updateColumn(col.id, "name", e.target.value)}
                                />
                            </div>

                            <div className={styles.wipGroup}>
                                <label>WIP </label>
                                <input 
                                    type="number"
                                    min="0"
                                    value={col.wipLimit}
                                    onChange={(e) => updateColumn(col.id, "wipLimit", parseInt(e.target.value))}
                                />
                            </div>

                            { (
                                <button className={styles.deleteBtn} onClick={() => deleteColumn(col.id, col.name)}>
                                    X
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className={styles.buttonActions}>
                    
                    <div className={styles.rightButtons}>
                        <button className={styles.cancelBtn} onClick={() => navigate(-1)}>Discard

                        </button>
                        <button className={styles.saveBtn} onClick={handleSave}>Save Changes
                            
                        </button>
                    </div>




                </div>
            </div>
        </div>
    );
}

export default ManageColumns;