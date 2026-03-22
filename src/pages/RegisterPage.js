import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();
        // Verification Logic: Check if fields match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: name,
                    email: email,
                    password: password,
                }),
                credentials: 'include',
            });
            const status = await response.json();
            if (response.ok) {
                console.log("Registration Successful");
                localStorage.setItem("user", JSON.stringify(status.user));
                console.log("Successfully saved in localstorage");
                setTimeout(() => {
                    navigate('/Dashboard');
                }, 100);
            }
            else {
                alert(status.message);
            }
        }
        catch (error) {
            console.error("Server Connection Error", error);
        }
    };
    return (_jsx("div", { className: styles.Wrapper, children: _jsxs("div", { className: styles.RegCard, children: [_jsx("h1", { children: "Create New Account" }), _jsxs("form", { onSubmit: handleRegister, className: styles.container, children: [_jsx("input", { className: styles.inputField, type: "text", placeholder: "Enter Name", onChange: (e) => setName(e.target.value) }), _jsx("input", { className: styles.inputField, type: "text", placeholder: "Enter Email", onChange: (e) => setEmail(e.target.value) }), _jsx("input", { className: styles.inputField, type: "password", placeholder: "Enter Password", onChange: (e) => setPassword(e.target.value) }), _jsx("input", { className: styles.inputField, type: "password", placeholder: "Confirm Password", onChange: (e) => setConfirmPassword(e.target.value) }), _jsx("h3", { children: "Minimum length of password : 8 characters" }), _jsx("h3", { children: "Atleast one digit" }), _jsx("h3", { children: "Atleast one alphabet" }), _jsx("button", { className: styles.submitBtn, children: "Submit" })] })] }) }));
}
export default Register;
