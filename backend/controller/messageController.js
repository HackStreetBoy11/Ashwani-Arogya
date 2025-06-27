import {catchAsyncErrors} from '../middlewares/catchAsyncError.js'
import { Message } from "../models/messageSchema.js";
import ErrorHandler from '../middlewares/errorMiddleware.js';

export const sendMessage = catchAsyncErrors( async (req, res, next) => {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !message) {
        return next(new ErrorHandler("All fields are required", 400));
    }
    await Message.create({ firstName, lastName, email, phone, message });
    res.status(201).json({
        success: true,
        message: "Message sent successfully",
    });
})

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    const messages = await Message.find();
    if (!messages || messages.length === 0) {
        return next(new ErrorHandler("No messages found", 404));
    }
    res.status(200).json({
        success: true,
        messages,
    });
});