import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface user {
    name: string;
    email: string;
    profilepic:string;
    globalRole: 'Admin' | 'user'
    projectRole : Record<string, 'Project Admin' | 'Project Member' | 'Project Viewer'>;

}



