import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import styles from '../styles/Notification.module.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
function Notification() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const token = localStorage.getItem("accessToken");
    const header = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    useEffect(() => {
        fetchNoti();
    }, []);
    const fetchNoti = async () => {
        const response = await fetch(`http://localhost:5000/api/notifications/`, { headers: header });
        const data = await response.json();
        if (response.ok)
            setNotifications(data);
    };
    const removeNotification = async (notiId) => {
        const response = await fetch(`http://localhost:5000/api/notifications/${notiId}`, {
            method: 'DELETE',
            headers: header,
        });
        if (response.ok)
            setNotifications(prev => prev.filter(n => n._id !== notiId));
    };
    const handleClearAll = async () => {
        const response = await fetch(`http://localhost:5000/api/notifications/clear`, {
            method: 'DELETE',
            headers: header,
        });
        console.log("claerall");
        if (response.ok)
            setNotifications([]);
    };
    return (_jsxs("div", { className: styles.layout, children: [_jsx("div", { className: styles.heading, children: _jsx("h1", { children: "Notification" }) }), _jsxs("div", { className: styles.grid, children: [_jsx("button", { className: styles.clear, onClick: handleClearAll, children: "Clear all" }), notifications.length === 0 ? (_jsx("h1", { className: styles.heading, children: " No new Notifications" })) : (notifications.map((n) => (_jsxs("div", { className: styles.card, children: [_jsxs("div", { className: styles.container, children: [_jsx("p", { className: styles.message, children: n.content }), _jsx("span", { children: new Date(n.createdAt).toLocaleString() })] }), _jsx("button", { className: styles.close, onClick: () => removeNotification(n._id), children: "X" })] }, n._id))))] })] }));
}
export default Notification;
