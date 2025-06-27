import express from 'express';
import { postAppointment,getAllAppointments, updateAppointment, deleteAppointment } from '../controller/appointmentController.js'; // ✅ correct path
import { isAdminAuthenticated, isPatientAuthenticated } from '../middlewares/auth.js';
// import { getAllAppointments } from 'mongoose';

const router = express.Router();

router.post("/post", isPatientAuthenticated,postAppointment);
router.get("/getall",isAdminAuthenticated, getAllAppointments);
router.put("/update/:id",isAdminAuthenticated, updateAppointment); 
router.delete("/delete/:id",isAdminAuthenticated, deleteAppointment); 
export default router;
