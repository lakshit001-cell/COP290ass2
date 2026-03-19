import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import styles from '../styles/ProjMembers.module.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import defaultIcon from '../profile_icon.jpg';

interface Member{
    user: {
        _id : string
        name : string;
        email : string;
        role: string;
        pfp ? : string;
    };
    role: string;
}

function Members() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [members, setMembers] = useState<Member[]>([]);

    useEffect(() => {
        const fetchProject = async () =>{
        console.log("getting token");
        const token = localStorage.getItem("accessToken");
        console.log("fetching");
         try{
            const response = await fetch(`http://localhost:5000/api/project/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            setMembers(data.members || []);
            console.log("set data");
         }catch(error){
            console.error("project fetch Fail", error);
         }
    }

    fetchProject();
    }, [id]);


    return (
        <div className={styles.layout}>





            <div className={styles.heading}>
                <h1>
                    Members
                </h1>

            </div>

                
            <div className={styles.grid}>
                        {members.map((m,index) => (
                            <div key={index} className={styles.card}>
                            
                            <div className={styles.avatar}>
                                <img 
                                src={m.user.pfp || defaultIcon}
                                alt={m.user.name}
                                className={styles.avatarImg}
                                >
                                
                                </img>


                            </div>


                               
            
                                <div>
                                <h2>{ m.user.name}</h2>
                                </div>
            
            
                                <h2> {m.user.email} </h2>
                            </div>
            
            
                        ) 
                    )}
            </div>
        </div>
        
    )
}


export default Members;