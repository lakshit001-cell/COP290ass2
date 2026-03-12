import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import styles from '../styles/ProjMembers.module.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import defaultIcon from '../profile_icon.jpg';

interface Member{
    name : string;
    email : string;
    role: string;
    Photourl ? : string;
    

}

function Members() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [members, setMembers] = useState<Member[]>([]);

    useEffect(() => {
        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        const currentProject = allProjects.find((p: any) => p.id === id);
        if (currentProject) {
            setMembers(currentProject.members);
        }
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
                                src={m.Photourl || defaultIcon}
                                alt={m.name}
                                className={styles.avatarImg}
                                >
                                
                                </img>


                            </div>


                               
            
                                <div>
                                <h2>{ m.name}</h2>
                                </div>
            
            
                                <h2> {m.email} </h2>
                            </div>
            
            
                        ) 
                    )}
            </div>
        </div>
        
    )
}


export default Members;