import React from 'react';
import styles from '../styles/Popup.module.css';

interface popup {
    isOpen : boolean;
    title: string;
    message : string;
    onClose : () => void;


}

const Popup: React.FC<popup> = ({ isOpen, title, message, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
            <div className={styles.header}>
                    <h2>{title}</h2>
                    <button className={styles.closeIcon} onClick={onClose}>&times;</button>
            </div>



            <div className={styles.body}>
                    <p>{message}</p>
            </div>
                <div className={styles.footer}>
                    <button className={styles.actionBtn} onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Popup;