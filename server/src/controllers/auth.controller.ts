import type {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import type {RegisterRequest} from '../../../shared/interfaces/auth.interface.ts';
import { validityCheck } from "../../../shared/interfaces/auth.interface.js";
import { prisma } from  '../config/prisma.js' 

export const registration = async (req: Request, res: Response) => {
    const data: RegisterRequest = req.body;

    if(!validityCheck(data)) {
        return res.status(400).json({
            error: 'Invalid Format'
        });
    }

    const salts = 8;
    const hashed = await bcrypt.hash(data.password, salts);

    const newUser = await prisma.user.create({
        data:{
            email: data.email,
            name: data.name,
            hashedPass: hashed,
        }
    });

    return res.status(201).json({id: newUser.id, message: "User has been registered."})
};