import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/ManageColumn.module.css';

interface Column {
    _id?: string;
    id?: string;
    name: string;
    wipLimit: number;
    ordered?: number
}

function ManageColumns() {
    const { id, boardId } = useParams();
    const navigate = useNavigate();
    const [columns, setColumns] = useState<Column[]>([]);

    // Load initial data
    useEffect(() => {
        const fetchBoard = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const res = await fetch(`http://localhost:5000/api/task/${id}/board/${boardId}`, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                 }
                });
                const data = await res.json();
                console.log(data);

                // If board has columns, use them. Otherwise, set defaults.
                if (data.board?.columns && data.board.columns.length > 0) {
                    setColumns(data.board.columns);
                } else {
                    setColumns([
                        { _id: '1', name: "To Do", wipLimit: 0 },
                        { _id: '2', name: "In Progress", wipLimit: 5 },
                        { _id: '3', name: "In Review", wipLimit: 5 },
                        { _id: '4', name: "Done", wipLimit: 0 }
                    ]);
                }
            } catch (error) {
                console.error("Fetch failed", error);
            }
        };
        fetchBoard();
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
        };
        setColumns([...columns, newCol]);
    };

    const deleteColumn = (colId: string, colName: string) => {
       
        if (window.confirm(`Tasks inside will be lost.`)) {
            setColumns(columns.filter(c => c._id !== colId));
        }
    };




    const updateColumn = (colId: string, field: string, value: any) => {
        setColumns(prev => prev.map(col => 
            (col._id || col.id) === colId ? { ...col, [field]: value } : col
        ));
    };




    const handleSave = async () => {
        const token = localStorage.getItem("accessToken");
        const columnsToSave = columns.map((col, index) => ({
        ...col,
        ordered: index 
    }));
        try {
            const response = await fetch(`http://localhost:5000/api/board/${boardId}/columns`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ columns })
            });

            if (response.ok) {
                alert("Workflow updated successfully!");
                navigate(`/project/${id}/board/${boardId}`);
            } else {
                alert("Failed to save changes.");
            }
        } catch (error) {
            console.error("Save error", error);
        }
    };



    return (
        <div className={styles.backgnd}>
            <h1>Manage Workflow</h1>
            <div className={styles.card}>
                
                

                <div className={styles.columnList}>
                    <button className={styles.addBtn} onClick={addColumn}> Add Column</button>


                    {columns.map((col, index) => {
                        const colId = col._id || col.id;
                        return (
                        <div key={colId} className={styles.colRow}>
                            
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
                                    
                                    onChange={(e) => updateColumn(colId!, "name", e.target.value)}
                                />
                            </div>

                            <div className={styles.wipGroup}>
                                <label>WIP </label>
                                <input 
                                    type="number"
                                    min="0"
                                    value={col.wipLimit}
                                    onChange={(e) => updateColumn(colId!, "wipLimit", parseInt(e.target.value))}
                                />
                            </div>

                            { (
                                <button className={styles.deleteBtn} onClick={() => deleteColumn(colId!, col.name)}>
                                    X
                                </button>
                            )}
                        </div>
                        )})}
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