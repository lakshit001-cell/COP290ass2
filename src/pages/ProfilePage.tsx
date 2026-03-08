import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Profile.module.css';
import defaultImg from '../profile_icon.jpg';

function ProfilePage(){
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const data = localStorage.getItem("user");
        if (data) {
            setUser(JSON.parse(data));
        }
    }, []);


    const handleLogout=() => {
        localStorage.removeItem("user");
        navigate('/')
    }


   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Grab the first file from the explorer
    const file = e.target.files?.[0];
    if (file) {
        // 2. Initialize the reader to convert the file
        const reader = new FileReader();

        reader.onloadend = () => {
            // 3. Convert the file into a Base64 string
            const base64String = reader.result as string;

            // 4. Update LocalStorage so it persists on refresh
            const storedData = localStorage.getItem("user");
            if (storedData) {
                const currentUser = JSON.parse(storedData);
                const updatedUser = { ...currentUser, profilePic: base64String };

                localStorage.setItem("user", JSON.stringify(updatedUser));
                
                // 5. Update local state to show the image immediately
                setUser(updatedUser); 
            }
        };

        // 6. Tell the reader to start processing the image
        reader.readAsDataURL(file);
    }
};



    return(


        <div className={styles.background}>
            <div className= {styles.profilecard}>
                <h1 className={styles.center}>Profile</h1>
                <div className={styles.imagewrapper}>
                <label className={styles.imageLabel} title= "Change profile picture">
                    <input type="file" accept='image/*' onChange={handleImageUpload} className={styles.fileInput}/>
                       
                    <img src={user?.profilePic ||defaultImg} alt='Avatar' className={styles.profileavatar}></img>

              
                </label>
                </div>



                <div className={styles.group}>
                <div className={styles.field}>
                    {user?.name}
                </div>
                </div>


                <div className={styles.group}>
                <div className={styles.field}>
                    {user?.email}
                </div>
                </div>
                
                <button className={styles.LogBtn} onClick={()=> navigate('/')} >
                              Logout
                </button>




            </div>

        </div>
    );




}

export default ProfilePage;