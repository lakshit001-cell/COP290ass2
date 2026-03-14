import jwt from 'jsonwebtoken';
import {Types} from 'mongoose';

export const getToken = (user: any) => {
    const access = jwt.sign({id: user._id, GlobalRole: user.GlobalRole}, process.env.JWT_ACCESS_SECRET!, {expiresIn: '30min'});
    const refresh = jwt.sign({id: user._id, GlobalRole: user.GlobalRole}, process.env.JWT_REFRESH_SECRET!, {expiresIn: '5d'});
    return {access, refresh};
};