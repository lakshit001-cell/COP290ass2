import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from '../styles/Popup.module.css';
const Popup = ({ isOpen, title, message, onClose }) => {
    if (!isOpen)
        return null;
    return (_jsx("div", { className: styles.overlay, children: _jsxs("div", { className: styles.modal, children: [_jsxs("div", { className: styles.header, children: [_jsx("h2", { children: title }), _jsx("button", { className: styles.closeIcon, onClick: onClose, children: "\u00D7" })] }), _jsx("div", { className: styles.body, children: _jsx("p", { children: message }) }), _jsx("div", { className: styles.footer, children: _jsx("button", { className: styles.actionBtn, onClick: onClose, children: "Close" }) })] }) }));
};
export default Popup;
