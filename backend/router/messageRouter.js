import express from 'express';
import { getAllMessages, sendMessage } from '../controller/messageController.js';
import { isAdminAuthenticated} from '../middlewares/auth.js';

const router = express.Router();
router.post("/send",sendMessage);
router.get("/getall", isAdminAuthenticated,getAllMessages);

export default router;
// This code defines a router for handling message-related routes in an Express application.
// It imports the necessary modules, including the Express framework and a controller function for sending messages.        
// The router is created using `express.Router()` and a POST route is defined at the path "/send" that maps to the `sendMessage` controller function.
// Finally, the router is exported for use in other parts of the application, allowing it to be mounted on a specific path in the main application file.
// This modular approach helps keep the code organized and maintainable, especially as the application grows in complexity.
// The `sendMessage` function is expected to handle the logic for processing incoming messages, such as validating input and saving it to a database.   
