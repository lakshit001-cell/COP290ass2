import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import styles from './Login.module.css';
function Home() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (_jsx("div", { className: styles.Wrapper, children: _jsxs("div", { className: styles.HomeCard, children: [_jsx("h1", { children: "KANBAN BOARD" }), _jsx("h2", { children: "Source code" }), _jsx("a", { href: "https://github.com/lakshit001-cell/COP290ass2", target: "_blank", rel: "noopener noreferrer", className: styles.externalLink, children: " GitHub" })] }) }));
}
export default Home;
