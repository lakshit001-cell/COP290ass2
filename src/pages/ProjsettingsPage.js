import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import styles from '../styles/Projsettings.module.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Popup from '../components/PopupPage';
function Settings() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [popup, setPopup] = useState({ isOpen: false, title: "", message: "" });
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    // 1. Form States
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [priority, setPriority] = useState("");
    const [addInput, setAddInput] = useState("");
    const [members, setMembers] = useState([]);
    const [role, setrole] = useState("Admin");
    const [removeInput, setRemoveInput] = useState("");
    const openpopoup = (title, message) => {
        setPopup({ isOpen: true, title, message });
    };
    const closepopup = () => {
        setPopup({ ...popup, isOpen: false });
        if (popup.title === "Update succesful" || popup.title === "Settings Saved") {
            navigate(`/project/${id}`);
        }
    };
    const handleUpdate = async () => {
        const token = localStorage.getItem('accessToken');
        const isAddActive = addInput.trim() !== "";
        const isRemoveActive = removeInput.trim() !== "";
        const isMember = members.some((m) => m.user.email.toLowerCase() === addInput.trim().toLowerCase());
        if (isAddActive && isMember) {
            openpopoup("Duplicate member", "User is already a part of this Project");
            return;
        }
        if (!isAddActive && !isRemoveActive) {
            openpopoup("Missing Information", "please fill atleast one field");
            return;
        }
        let alertMessage = "";
        if (isAddActive && !isMember) {
            const response = await fetch(`http://localhost:5000/api/project/${id}/members/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email: addInput, role: role }) // actual user is searched in the backend using email(unique)
            });
            if (response.ok)
                openpopoup("Update succesful", "user added");
        }
        if (isRemoveActive) {
            const response = await fetch(`http://localhost:5000/api/project/${id}/members/remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email: removeInput }) // actual user is searched in the backend using email(unique)
            });
            openpopoup("Update succesful", "user removed");
        }
        // Reset fields and go back
        setAddInput("");
        setRemoveInput("");
    };
    useEffect(() => {
        const fetchProject = async () => {
            console.log("getting token");
            const token = localStorage.getItem("accessToken");
            console.log("fetching");
            try {
                const response = await fetch(`http://localhost:5000/api/project/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                const data = await response.json();
                const resMem = await fetch(`http://localhost:5000/api/project/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                const dataMem = await resMem.json();
                setMembers(dataMem.members || []);
                if (response.ok) {
                    setName(data.name);
                    setDescription(data.description);
                    setDeadline(data.deadline.split('T')[0]);
                    setPriority(data.priority);
                }
                console.log("set data");
            }
            catch (error) {
                console.error("project fetch Fail", error);
            }
        };
        fetchProject();
    }, [id, currentUser.email]);
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`http://localhost:5000/api/project/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description, deadline, priority })
            });
            if (!response.ok) {
                console.error("Project details not saved");
            }
            ;
        }
        catch (error) {
            console.error("Server error", error);
        }
        navigate(`/project/${id}`); // Return to Dashboard
    };
    const handlediscard = (e) => {
        e.preventDefault();
        navigate(`/project/${id}`);
    };
    const handleEnd = async (e) => {
        e.preventDefault();
        if (!window.confirm("Are you sure you want to end this project? "))
            return;
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:5000/api/project/${id}/archive`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok)
            openpopoup("Project Ended", "Moved to Completed");
        navigate('/Projects'); // Redirect to the main projects list
    };
    return (_jsxs("div", { className: styles.backgnd, children: [_jsx(Popup, { isOpen: popup.isOpen, title: popup.title, message: popup.message, onClose: closepopup }), _jsx("h1", { className: styles.heading, children: " Settings " }), _jsxs("div", { className: styles.divison, children: [_jsxs("div", { className: styles.card, children: [_jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Project Name" }), _jsx("input", { value: name, className: styles.inputField, onChange: (e) => setName(e.target.value), required: true })] }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Deadline" }), _jsx("input", { type: 'date', value: deadline, className: styles.inputField, onChange: (e) => setDeadline(e.target.value), required: true })] }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Priority" }), _jsxs("select", { value: priority, className: styles.inputField, onChange: (e) => setPriority(e.target.value), children: [_jsx("option", { value: "Low", children: "Low" }), _jsx("option", { value: "Medium", children: "Medium" }), _jsx("option", { value: "High", children: "High" })] })] }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Description" }), _jsx("textarea", { value: description, className: styles.inputFieldd, onChange: (e) => setDescription(e.target.value) })] }), _jsxs("div", { className: styles.buttons, children: [_jsxs("div", { className: styles.bottom, children: [_jsx("button", { type: "submit", className: styles.DiscardBtn, onClick: handlediscard, children: "Discard" }), _jsx("button", { type: "submit", className: styles.submitBtn, onClick: handleSave, children: "Save" })] }), _jsx("button", { type: "submit", className: styles.EndBtn, onClick: handleEnd, children: "End Project" })] })] }), _jsxs("div", { className: styles.card, children: [_jsx("h1", { children: "Manage Members" }), _jsxs("div", { className: styles.inputgroup, children: [_jsx("label", { className: styles.size, children: "Add New Member" }), _jsx("input", { placeholder: 'Enter Username or Email', value: addInput, className: styles.inputField, onChange: (e) => setAddInput(e.target.value) }), _jsxs("label", { className: styles.size, children: ["Select Role", _jsxs("select", { value: role, className: styles.inputField, onChange: (e) => setrole(e.target.value), children: [_jsx("option", { value: "Admin", children: " Admin " }), _jsx("option", { value: "Member", children: " Member " }), _jsx("option", { value: "Viewer", children: " Viewer " })] })] }), _jsx("label", { className: styles.size, children: "Remove a Member" }), _jsx("input", { placeholder: 'Enter Username or Email', value: removeInput, className: styles.inputField, onChange: (e) => setRemoveInput(e.target.value) })] }), _jsx("div", { className: styles.buttons, children: _jsxs("div", { className: styles.bottom, children: [_jsx("button", { type: "submit", className: styles.DiscardBtn, onClick: handlediscard, children: "Discard" }), _jsx("button", { type: "submit", className: styles.submitBtn, onClick: handleUpdate, children: "UPDATE" })] }) })] })] })] }));
}
export default Settings;
