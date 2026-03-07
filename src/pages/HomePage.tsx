import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import styles from './Login.module.css';
function Home(){
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

  return (
    <div className={styles.Wrapper}> 
     <div className={styles.HomeCard}>
        <h1>KANBAN BOARD</h1>
        <h2>Source code</h2>
        <a 
        href="https://github.com/lakshit001-cell/COP290ass2" 
        target="_blank" 
        rel="noopener noreferrer" 
        className={styles.externalLink}
        
        > GitHub</a>

     

        
     </div>
    </div>
    
  );

}

export default Home;