import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import styles from '../styles/Notification.module.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import defaultIcon from '../profile_icon.jpg';

interface NotificationItem {
    _id: string;
    content: string;
    createdAt:string;
    type: string;
}



function Notification() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    const token = localStorage.getItem("accessToken");
    const header = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }

    useEffect(() => {
        fetchNoti();
    },[]);

    const fetchNoti = async () => {
        const response = await fetch(`http://localhost:5000/api/notifications/`, { headers: header });
        const data = await response.json();
        if(response.ok) setNotifications(data);
    }

    const removeNotification= async (notiId:string) => {
        const response = await fetch(`http://localhost:5000/api/notifications/${notiId}`, { 
            method: 'DELETE', 
            headers: header, 
        });
        if(response.ok) setNotifications(prev => prev.filter(n=> n._id !== notiId));
    };


    const handleClearAll= async ()=> {
        const response = await fetch(`http://localhost:5000/api/notifications/clear`, { 
            method: 'DELETE', 
            headers: header,
        });
        console.log("claerall")
        if(response.ok) setNotifications([]);
    };

    return (
        <div className={styles.layout}>
            <div className={styles.heading}>
                <h1>
                    Notification
                </h1>

            </div>

                
            <div className={styles.grid}>
                
                <button className={styles.clear} onClick={handleClearAll}>
                    Clear all
                </button>
                {notifications.length === 0 ? (
                    <p> No new Notifications</p>
                ) : (
                    notifications.map((n) => (
                        <div key={n._id} className={styles.card}>
                            <div className={styles.container}>
                                <p className={styles.message}>{n.content}</p>
                                <span>{new Date(n.createdAt).toLocaleString()}</span>
                            </div>
                            <button 
                                className={styles.close} 
                                onClick={() => removeNotification(n._id)}
                            >
                                X
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
        
    )
}


export default Notification;