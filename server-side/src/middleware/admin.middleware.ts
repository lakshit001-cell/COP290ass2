import {Request, Response, NextFunction} from 'express';

export const checkAdmin = (req: any, res: Response, next: NextFunction) => { // req: any. as this runs after tokenAuthentication
    if(req.user && req.user.GlobalRole == "Admin") {
        next();
    }
    else{
        res.status(403).json({message: "ACCESS DENIED. ADMINS ONLY"});
    }
}