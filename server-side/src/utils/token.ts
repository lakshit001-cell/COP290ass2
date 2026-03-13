import jwt from 'jsonwebtoken';
import {Types} from 'mongoose';

export const getToken = (u_Id: Types.ObjectId) => {
    const access = jwt.sign({id: u_Id}, process.env.JWT_ACCESS_SECRET!, {expiresIn: '30min'});
    const refresh = jwt.sign({id: u_Id}, process.env.JWT_REFRESH_SECRET!, {expiresIn: '5d'});
    return {access, refresh};
};