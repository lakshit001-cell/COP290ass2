import { Request, Response } from 'express';
import { Noti } from "../models/notification";

export const getNotifications = async (req:any, res: Response) => {
    try {
        const notifications = await Noti.find({ recipient: req.user.id })
            .sort({ createdAt: -1 })
            .populate('sender', 'username');
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
};

export const deleteNotification = async (req:any, res:Response) => {
    await Noti.findByIdAndDelete(req.params.notiId);
    res.status(200).json({ message: "Deleted" });
};

export const clearAllNotifications = async (req:any, res:Response) => {
    await Noti.deleteMany({ recipient: req.user.id });
    res.status(200).json({ message: "Cleared all" });
};