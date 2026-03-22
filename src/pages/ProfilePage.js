import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Profile.module.css';
import defaultImg from '../profile_icon.jpg';
function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    useEffect(() => {
        const data = localStorage.getItem("user");
        if (!data) {
            navigate('/login');
        }
        if (data) {
            setUser(JSON.parse(data));
        }
    }, [navigate]);
    const handleLogout = async () => {
        try {
            await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            localStorage.removeItem("user");
            console.log("removed from local storage");
            navigate('/login');
        }
        catch (error) {
            console.error("Logout failed", error);
        }
    };
    const handleImageUpload = (e) => {
        // 1. Grab the first file from the explorer
        const file = e.target.files?.[0];
        if (!file)
            return;
        // Industrial Standard: Limit file size (e.g., 2MB) because localStorage is small (5-10MB total)
        if (file.size > 2 * 1024 * 1024) {
            alert("File is too large! Please choose an image under 2MB.");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                // 3. Convert the file into a Base64 string
                const base64String = reader.result;
                const response = await fetch("http://localhost:5000/api/auth/profile-save", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: user.email,
                        profile: base64String,
                    })
                });
                const data = await response.json();
                if (!response.ok) {
                    console.error("data error", data.error);
                }
                // 4. Update LocalStorage so it persists on refresh
                const updatedUser = { ...user, profilePic: base64String };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);
                console.log("Updated User");
            }
            catch (error) {
                console.error("upload Fail", error);
            }
        };
        // 6. Tell the reader to start processing the image
        reader.readAsDataURL(file);
    };
    return (_jsx("div", { className: styles.background, children: _jsxs("div", { className: styles.profilecard, children: [_jsx("h1", { className: styles.center, children: "Profile" }), _jsx("div", { className: styles.imagewrapper, children: _jsxs("label", { className: styles.imageLabel, title: "Change profile picture", children: [_jsx("input", { type: "file", accept: 'image/*', onChange: handleImageUpload, className: styles.fileInput }), _jsx("img", { src: user?.profilePic || defaultImg, alt: 'Avatar', className: styles.profileavatar })] }) }), _jsx("div", { className: styles.group, children: _jsx("div", { className: styles.field, children: user?.name }) }), _jsx("div", { className: styles.group, children: _jsx("div", { className: styles.field, children: user?.email }) }), _jsx("button", { className: styles.LogBtn, onClick: handleLogout, children: "Logout" })] }) }));
}
export default ProfilePage;
