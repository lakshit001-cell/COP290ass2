import {Request, Response} from 'express';
import {User} from '../models/user.js';
import bcrypt from 'bcryptjs';

interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

export const validityCheck = (email: string, pass: string): boolean => {
  const emailChars = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passChars = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  return emailChars.test(email) && passChars.test(pass);
};

export const registration = async (req: Request, res: Response) => {
  const {username, email, password} = req.body as RegisterBody;

  if (!validityCheck(email, password)) {
    return res.status(400).json({
      error: 'Invalid Format',
    });
  }

  if (await User.findOne({email})) {
    return res.status(400).json({message: 'User already registered. Login?'});
  }

  const salts = 8;
  const hashed: string = await bcrypt.hash(password, salts);

  const user = await User.create({username, email, hashed});

  return res.status(201).json({message: 'User has been registered.',
    user:{id: user._id, name: user.username, email: user.email, GlobalRole: user.GlobalRole },
  });
};

export const login = async (req: Request, res: Response) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message: "User not found. Invalid credentials"});
        }
        const salts = 8;
        const hashed: string = await bcrypt.hash(password, salts);

        const pass = await bcrypt.compare(password, user.hashed);
        if(!pass){
            return res.status(401).json({message: "Invalid credentials"});
        }

        return res.status(200).json({
            message: "Login Successful, user found",
            user: {id: user._id, name: user.username, email: user.email, GlobalRole: user.GlobalRole }
        })
    }
    catch(error){
        res.status(500).json({message: error});
    }
}
