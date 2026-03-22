import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Toolbar.module.css';
import { useLocation } from 'react-router-dom';

function Toolbar(){
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isGlobalAdmin = user.GlobalRole === 'Admin';


    const dummyNotifications = [
        { content: "Mentioned you", timestamp: "10:00 PM" },
        { content: "New Task", timestamp: "11:00 PM" },
        { content: "New Task", timestamp: "11:00 PM" },
        { content: "New Task", timestamp: "11:00 PM" },
        { content: "New Task", timestamp: "11:00 PM" },
        { content: "New Task", timestamp: "11:00 PM" },
        { content: "New Task", timestamp: "11:00 PM" },
        { content: "New Task", timestamp: "11:00 PM" },
        { content: "New Task", timestamp: "11:00 PM" },
        { content: "New Task", timestamp: "11:00 PM" },
        { content: "New Task", timestamp: "11:00 PM" },
        { content: "New Task", timestamp: "11:00 PM" },
        { content: "New Task", timestamp: "11:00 PM" },
        { content: "New Task", timestamp: "11:00 PM" },
        { content: "New Task", timestamp: "11:00 PM" }
    ];
   
    const hasUnread = dummyNotifications.length > 0;
    const navigate = useNavigate();
    const isPublicPage = ["/", "/login", "/register"].includes(location.pathname);

    // 2. Check if a user is logged in
    const hasUserSession = localStorage.getItem("user") !== null;

    // 3. Only show internal icons if we are NOT on a public page AND have a session
    const showInternal = !isPublicPage && hasUserSession;

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

                            {hasUnread && <span className={styles.dot}>{dummyNotifications.length} </span>}

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