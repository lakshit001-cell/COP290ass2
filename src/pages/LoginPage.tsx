import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';

import { loginUser } from '../services/AuthService';
import { addListener } from 'process';
function Login(){
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();
    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const savedUserData=localStorage.getItem("user");
    if(savedUserData){
        const reguser=JSON.parse(savedUserData);
        if (email === reguser.email && password === reguser.password) {
                navigate('/dashboard');
        }
        else {
            alert("invalid credentials")
        }
        
    }
    else {
        alert("No user found please register first")
    }
    };
        
  return (
    <div className={styles.Wrapper}> 
     <div className={styles.LoginCard}>
     

        
            <h2>Login</h2>
            <form onSubmit={handleLogin} className={styles.formLayout}>
              
              <input 
              className={styles.inputField}
              type="text" 
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)} 
              
              />

              <input 
              className={styles.inputField}
              type="password" 
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)} 
              
              />

              <button className={styles.submitBtn} >
              Submit
              </button>
            </form>
            <p className={styles.signupText}>
        <Link to="/register" className={styles.submitBtn}>Create an account</Link>
            </p>

        </div>
        
     </div>
    
    
  );

}

export default Login;