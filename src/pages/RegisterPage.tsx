import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
function Register(){
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword,setConfirmPassword]=useState<string>("")
    const [name, setName] = useState<string>("");
    const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Verification Logic: Check if fields match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try{
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

      if(response.ok) {
        console.log("Registration Successful")
        localStorage.setItem("user", JSON.stringify(status.user));
        console.log("Successfully saved in localstorage");
        setTimeout(() => {
            navigate('/Dashboard');
        }, 100)
      }
      else{
        alert(status.message);
      }
    }
    catch(error) {
      console.error("Server Connection Error", error);
    }
  };


  return (
    <div className={styles.Wrapper}> 
     <div className={styles.RegCard}>
     
        
            <h1>Create New Account</h1>
            <form onSubmit={handleRegister} className={styles.container}>
            <input 
            className={styles.inputField}
            type="text" 
            placeholder="Enter Name"
            onChange={(e) => setName(e.target.value)} 
            />
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
             <input 
            className={styles.inputField}
            type="password" 
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)} 
            
            />

            <h3>Minimum length of password : 8 characters</h3>

            <button className={styles.submitBtn}>
            Submit
            </button>
          </form>

        </div>
        
     </div>

    
  );

}

export default Register;