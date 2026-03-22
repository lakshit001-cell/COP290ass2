import { useState } from 'react';
import styles from '../styles/Dashboard.module.css';
function Dashboard (){
    
    return(
        <div className={styles.backgnd

        }>
            <h1>WELCOME BACK _</h1>
            <div className={styles.card}>
                <h2>Your Stats </h2>
                <p> Total Projects :</p>
                <p>Total Tasks :</p>
                <p>Critical Tasks :</p>

            </div>

        </div>
    )
}

export default Dashboard