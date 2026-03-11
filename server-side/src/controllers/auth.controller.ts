import { Request, Response } from 'express';
import { User } from '../models/user.js';
import bcrypt from 'bcryptjs';

interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

export const validityCheck = (email:string, pass:string): boolean => {
    const emailChars = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passChars = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    return emailChars.test(email) && passChars.test(pass);
};

export const registration = async (req: Request, res: Response) => {
    const {username, email, password} = req.body as RegisterBody;

    if(!validityCheck(email, password)) {
        return res.status(400).json({
            error: 'Invalid Format'
        });
    }

    if(await User.findOne({email})){
        return res.status(400).json({message: "User already registered. Login?"});
    }

    const salts = 8;
    const hashed : string = await bcrypt.hash(password, salts);

    const user = await User.create({username, email, hashed});

    return res.status(201).json({id: user.id, message: "User has been registered."})
};