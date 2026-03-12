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


   const handleImageUpload =  (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Grab the first file from the explorer
    const file = e.target.files?.[0];
    if (!file) return;

    // Industrial Standard: Limit file size (e.g., 2MB) because localStorage is small (5-10MB total)
    if (file.size > 2 * 1024 * 1024) {
        alert("File is too large! Please choose an image under 2MB.");
        return;
    }

    const reader = new FileReader();

        reader.onloadend = async () => {
            try{
            // 3. Convert the file into a Base64 string
                const base64String = reader.result as string;

                const response = await fetch("http://localhost:5000/api/auth/profile-save", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: user.email,
                        profile: base64String,
                    })
                });

                const data = await response.json();

                if(!response.ok){
                    console.error("data error", data.error)
                }

                // 4. Update LocalStorage so it persists on refresh
                const updatedUser = {...user, profilePic: base64String};

                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);
                console.log("Updated User")
            }
            catch(error){
                console.error("upload Fail", error)
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