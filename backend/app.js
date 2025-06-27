import express from 'express';
import {config} from "dotenv"
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { dbConnection } from './database/dbConnection.js';
import messageRouter from './router/messageRouter.js';
import {errorMiddleware} from './middlewares/errorMiddleware.js'; // Importing catchAsyncErrors for error handling
import userRouter from './router/userRouter.js'; // Importing user router
import appointmentRouter from './router/appointmentRouter.js'; // Importing user router
const app = express();
config({path: './config/config.env'});

app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));


app.use(cookieParser()); // for cookie parsing
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './tmp/',
}
))

app.use('/api/v1/message', messageRouter); // Mounting the message router
app.use('/api/v1/user', userRouter); // Mounting the user router
app.use('/api/v1/appointment', appointmentRouter); // Mounting the appointment router

dbConnection(); // Connect to the database
app.use(errorMiddleware); // Using the error middleware for handling errors
export default app;
