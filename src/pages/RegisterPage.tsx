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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Verification Logic: Check if fields match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }


    if (password.length < 8) {
      alert("Password must be at least 8 characters!");
      return;
    }


    const newUser= {name:name,email:email,ProfilePic:'../profile_icon.jpg', password:password, GlobalRole:'Admin'};
    localStorage.setItem("user",JSON.stringify(newUser));
    
    
    // Industrial Standard: Log the action and move to Dashboard
    console.log("Registration Successful for:", );
    // 3. Navigate to dashboard
    navigate('/dashboard'); 
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