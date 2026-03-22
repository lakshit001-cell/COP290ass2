import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Toolbar.module.css';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface NotificationItem {
    _id: string;
    content: string;
    timestamp:string;
    type: string;
}

function Toolbar(){
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isGlobalAdmin = user.GlobalRole === 'Admin';
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    const hasUserSession = localStorage.getItem("user") !== null;
    const isPublicPage = ["/", "/login", "/register"].includes(location.pathname);
    const showInternal = !isPublicPage && hasUserSession;

    useEffect(()=>{
        const token = localStorage.getItem("accessToken");
        if(!showInternal ||  !token) return;

        const fetchNoti = async () => {
        const response = await fetch(`http://localhost:5000/api/notifications/`, { 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }});
        const data = await response.json();
        if(response.ok) setNotifications(data);
    } 
    fetchNoti();
    const interval = setInterval(fetchNoti, 60000*3);
    return () => clearInterval(interval);
    }, [showInternal]);
     
    


   
    const hasUnread = notifications.length > 0;
    const navigate = useNavigate();

    return (
        <nav className={styles.toolbardesign}>
            <div className={styles.navLinks}>
                {showInternal?(
                    <>


                        {isGlobalAdmin && (
                            <Link to="/NewProj" className={styles.link}>New Project</Link>
                        )}

                        <Link to="/Projects" className={styles.link}> Projects</Link>
                        <Link to="/CompletedProjects" className={styles.link}> Past Projects</Link>


                        
                        <div className={styles.profilecircle} onClick={() => navigate('/profile')} title="view profile">

                        </div>
                        <div className={styles.notificationWrapper}>
                        <div className={styles.notification} onClick={() => navigate('/Notifications')} title="view Notifications">

                            {hasUnread && <span className={styles.dot}>{notifications.length} </span>}

                        </div>
                        </div>



                    </>
                ) : (
                    <>
                    <Link to="/" className={styles.link}>Home</Link>
                        <Link to="/login" className={styles.link}>Login</Link>
                        <Link to="/register" className={styles.link}>Register</Link>
                    </>

                )}
                
            </div>

        </nav>





    );
}

export default Toolbar;