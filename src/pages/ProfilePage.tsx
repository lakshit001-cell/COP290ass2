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
    const file = e.target.files?.[0];
    if (!file) return;

    // Industrial Standard: Limit file size (e.g., 2MB) because localStorage is small (5-10MB total)
    if (file.size > 2 * 1024 * 1024) {
        alert("File is too large! Please choose an image under 2MB.");
        return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
        const base64String = reader.result as string;

        // 1. Get current data
        const storedUser = localStorage.getItem("user");
        const storedProjects = localStorage.getItem("projects");

        if (storedUser) {
            const currentUser = JSON.parse(storedUser);
            
            // 2. Update the User Object
            const updatedUser = { ...currentUser, photoURL: base64String };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            
            // 3. Sync with all Projects (Data Normalization)
            if (storedProjects) {
                const allProjects = JSON.parse(storedProjects);
                
                const syncedProjects = allProjects.map((project: any) => ({
                    ...project,
                    members: project.members.map((member: any) => {
                        // If this member's email matches the user, update their photo
                        if (member.email === currentUser.email) {
                            return { ...member, photoURL: base64String };
                        }
                        return member;
                    })
                }));

                localStorage.setItem("projects", JSON.stringify(syncedProjects));
            }

            // 4. Update UI State
            setUser(updatedUser);
            
        }
    };

    reader.readAsDataURL(file);
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