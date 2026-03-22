import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import styles from '../styles/ProjMembers.module.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import defaultIcon from '../profile_icon.jpg';
function Members() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [members, setMembers] = useState([]);
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
                setMembers(data.members || []);
                console.log("set data");
            }
            catch (error) {
                console.error("project fetch Fail", error);
            }
        };
        fetchProject();
    }, [id]);
    return (_jsxs("div", { className: styles.layout, children: [_jsx("div", { className: styles.heading, children: _jsx("h1", { children: "Members" }) }), _jsx("div", { className: styles.grid, children: members.map((m, index) => (_jsxs("div", { className: styles.card, children: [_jsx("div", { className: styles.avatar, children: _jsx("img", { src: m.user.pfp || defaultIcon, alt: m.user.name, className: styles.avatarImg }) }), _jsx("div", { children: _jsx("h2", { children: m.user.name }) }), _jsxs("h2", { children: [" ", m.user.email, " "] })] }, index))) })] }));
}
export default Members;
