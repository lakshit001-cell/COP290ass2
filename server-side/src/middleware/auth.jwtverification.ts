import  {Request, Response, NextFunction} from 'express';
import jwt from "jsonwebtoken";

export const TokenAuthenticate = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1]; // split token from "Bearer"

    if (!token) return res.status(401).json({message: "No Access Token. Authentication error"});

    jwt.verify(token, process.env.JWT_ACCESS_SECRET!, (err: any, user: any) =>{
        console.error("Invalid request. Token expired or invalid")
        if(err) return res.status(403).json({message: "Invalid request. Token expired or invalid"});

        (req as any).user = user;

        next();
    });
};