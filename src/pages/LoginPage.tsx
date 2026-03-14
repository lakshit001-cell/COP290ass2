import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';

function Login(){
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();
    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try{
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
        console.log(data.status)
        if(response.ok) {
            console.log("Login Successful", data);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("accessToken", data.accessToken);
            console.log("Successfully saved in localstorage");
            setTimeout(() => {
                navigate('/Dashboard');
            }, 100)
        }
        else{
            console.error("Login suceeded but no data received.")
            alert(data.message);
        }
    }
    catch(error) {
        console.error("Server Connection Error", error);
        alert("Error");
    }

    }
        
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