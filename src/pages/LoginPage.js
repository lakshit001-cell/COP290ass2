import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
                credentials: 'include',
            });
            const data = await response.json();
            console.log(data.status);
            if (response.ok) {
                console.log("Login Successful", data);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("accessToken", data.accessToken);
                console.log("Successfully saved in localstorage");
                setTimeout(() => {
                    navigate('/Dashboard');
                }, 100);
            }
            else {
                console.error("Login suceeded but no data received.");
                alert(data.message);
            }
        }
        catch (error) {
            console.error("Server Connection Error", error);
            alert("Error");
        }
    };
    return (_jsx("div", { className: styles.Wrapper, children: _jsxs("div", { className: styles.LoginCard, children: [_jsx("h2", { children: "Login" }), _jsxs("form", { onSubmit: handleLogin, className: styles.formLayout, children: [_jsx("input", { className: styles.inputField, type: "text", placeholder: "Enter Email", onChange: (e) => setEmail(e.target.value) }), _jsx("input", { className: styles.inputField, type: "password", placeholder: "Enter Password", onChange: (e) => setPassword(e.target.value) }), _jsx("button", { className: styles.submitBtn, children: "Submit" })] }), _jsx("p", { className: styles.signupText, children: _jsx(Link, { to: "/register", className: styles.submitBtn, children: "Create an account" }) })] }) }));
}
export default Login;
