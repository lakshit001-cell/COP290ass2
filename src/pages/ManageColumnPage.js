import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/ManageColumn.module.css';
function ManageColumns() {
    const { id, boardId } = useParams();
    const navigate = useNavigate();
    const [columns, setColumns] = useState([]);
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
                }
                else {
                    setColumns([
                        { _id: '1', name: "To Do", wipLimit: 0 },
                        { _id: '2', name: "In Progress", wipLimit: 5 },
                        { _id: '3', name: "In Review", wipLimit: 5 },
                        { _id: '4', name: "Done", wipLimit: 0 }
                    ]);
                }
            }
            catch (error) {
                console.error("Fetch failed", error);
            }
        };
        fetchBoard();
    }, [id, boardId]);
    // Handle reordering: Swapping elements in the array
    const moveColumn = (index, direction) => {
        const newColumns = [...columns];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newColumns.length)
            return;
        // Swap
        const temp = newColumns[index];
        newColumns[index] = newColumns[targetIndex];
        newColumns[targetIndex] = temp;
        setColumns(newColumns);
    };
    const addColumn = () => {
        const newCol = {
            id: `col-${Date.now()}`,
            name: " ",
            wipLimit: 10,
        };
        setColumns([...columns, newCol]);
    };
    const deleteColumn = (colId, colName) => {
        if (window.confirm(`Tasks inside will be lost.`)) {
            setColumns(columns.filter(c => c._id !== colId));
        }
    };
    const updateColumn = (colId, field, value) => {
        setColumns(prev => prev.map(col => (col._id || col.id) === colId ? { ...col, [field]: value } : col));
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
            }
            else {
                alert("Failed to save changes.");
            }
        }
        catch (error) {
            console.error("Save error", error);
        }
    };
    return (_jsxs("div", { className: styles.backgnd, children: [_jsx("h1", { children: "Manage Workflow" }), _jsxs("div", { className: styles.card, children: [_jsxs("div", { className: styles.columnList, children: [_jsx("button", { className: styles.addBtn, onClick: addColumn, children: " Add Column" }), columns.map((col, index) => {
                                const colId = col._id || col.id;
                                return (_jsxs("div", { className: styles.colRow, children: [_jsxs("div", { className: styles.reorderGroup, children: [_jsx("button", { className: styles.orderBtn, onClick: () => moveColumn(index, 'up'), disabled: index === 0, children: " \u25B2" }), _jsx("button", { className: styles.orderBtn, onClick: () => moveColumn(index, 'down'), disabled: index === columns.length - 1, children: " \u25BC" })] }), _jsxs("div", { className: styles.inputGroup, children: [_jsx("label", { children: "Column Name" }), _jsx("input", { type: "text", value: col.name, onChange: (e) => updateColumn(colId, "name", e.target.value) })] }), _jsxs("div", { className: styles.wipGroup, children: [_jsx("label", { children: "WIP " }), _jsx("input", { type: "number", min: "0", value: col.wipLimit, onChange: (e) => updateColumn(colId, "wipLimit", parseInt(e.target.value)) })] }), (_jsx("button", { className: styles.deleteBtn, onClick: () => deleteColumn(colId, col.name), children: "X" }))] }, colId));
                            })] }), _jsx("div", { className: styles.buttonActions, children: _jsxs("div", { className: styles.rightButtons, children: [_jsx("button", { className: styles.cancelBtn, onClick: () => navigate(-1), children: "Discard" }), _jsx("button", { className: styles.saveBtn, onClick: handleSave, children: "Save Changes" })] }) })] })] }));
}
export default ManageColumns;
