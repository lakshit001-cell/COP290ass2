import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Toolbar.module.css';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
function Toolbar() {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isGlobalAdmin = user.GlobalRole === 'Admin';
    const [notifications, setNotifications] = useState([]);
    const hasUserSession = localStorage.getItem("user") !== null;
    const isPublicPage = ["/", "/login", "/register"].includes(location.pathname);
    const showInternal = !isPublicPage && hasUserSession;
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!showInternal || !token)
            return;
        const fetchNoti = async () => {
            const response = await fetch(`http://localhost:5000/api/notifications/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (response.ok)
                setNotifications(data);
        };
        fetchNoti();
        const interval = setInterval(fetchNoti, 60000 * 3);
        return () => clearInterval(interval);
    }, [showInternal]);
    const hasUnread = notifications.length > 0;
    const navigate = useNavigate();
    return (_jsx("nav", { className: styles.toolbardesign, children: _jsx("div", { className: styles.navLinks, children: showInternal ? (_jsxs(_Fragment, { children: [isGlobalAdmin && (_jsx(Link, { to: "/NewProj", className: styles.link, children: "New Project" })), _jsx(Link, { to: "/Projects", className: styles.link, children: " Projects" }), _jsx(Link, { to: "/CompletedProjects", className: styles.link, children: " Past Projects" }), _jsx("div", { className: styles.profilecircle, onClick: () => navigate('/profile'), title: "view profile" }), _jsx("div", { className: styles.notificationWrapper, children: _jsx("div", { className: styles.notification, onClick: () => navigate('/Notifications'), title: "view Notifications", children: hasUnread && _jsxs("span", { className: styles.dot, children: [notifications.length, " "] }) }) })] })) : (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/", className: styles.link, children: "Home" }), _jsx(Link, { to: "/login", className: styles.link, children: "Login" }), _jsx(Link, { to: "/register", className: styles.link, children: "Register" })] })) }) }));
}
export default Toolbar;
