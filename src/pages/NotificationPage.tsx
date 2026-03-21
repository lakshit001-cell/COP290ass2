import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import styles from '../styles/Notification.module.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import defaultIcon from '../profile_icon.jpg';

interface NotificationItem {
    content: string;
    timestamp:string;
}



function Notification() {
    const { id } = useParams();
    const navigate = useNavigate();

    const dummyNotifications: NotificationItem[] = [
        {
            content: "Lakshit Solanki mentioned you in a comment: 'Check the scrollbar fix.'",
            timestamp: "3/21/2026, 11:30 PM"
        },
        {
            content: "New task 'Implement Verilog Logic' assigned dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddto you by Admin.",
            timestamp: "3/21/2026, 10:15 PM"
        },
        {
            content: "Project 'IIT Delhi Kanban' deadline updated to March 30th.",
            timestamp: "3/20/2026, 09:00 AM"
        },
        {
            content: "Pawan Gupta added a new story: 'Frontend Facelift'.",
            timestamp: "3/19/2026, 02:45 PM"
        }
    ];


    const RemoveNotification= (index:number) => {

    }


    const handleclearall= ( )=> {

    }

    
    
 


    return (
        <div className={styles.layout}>
            <div className={styles.heading}>
                <h1>
                    Notification
                </h1>

            </div>

                
            <div className={styles.grid}>
                <button className={styles.clear} onClick={()=> {handleclearall}}>
                    Clear all
                </button>
                        {dummyNotifications.map((m,index) => (
                            <div key={index} className={styles.card}>
                        
                                <div className={styles.container}>
                                <p className={styles.message}>{ m.content}</p>
                                
            
            
                                <span> {m.timestamp} </span>
                                </div>

                               <button
                               className={styles.close}
                               onClick={()=> RemoveNotification(index)}>
                                X
                                
                               </button>


                           
                            </div>
            
            
                        ) 
                    )}
            </div>
        </div>
        
    )
}


export default Notification;