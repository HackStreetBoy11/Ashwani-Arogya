import mongoose from 'mongoose';
import validator from 'validator';


const appointmentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "First name must be at least 3 characters long"],
    },
    lastName: {
        type: String,
        required: true,
        minLength: [3, "Last name must be at least 3 characters long"],
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please enter a valid email address"],
    },
    phone: {
        type: String,
        required: true,
        validate: [validator.isMobilePhone, "Please enter a valid phone number"],
    },
    nic: {
        type: String,
        required: true,
        minLength: [13, "NIC must be exactly 13 characters long"],
        maxLength: [13, "NIC must be exactly 13 characters long"],
    },
    dob: {
        type: Date,
        required: [true, "Date of Birth is required"],
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"],
    },
    appointment_date: {
        type: Date,
        required: true,
    },
    department:{
        type: String,
        required: true,
    },
    doctor:{
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        }
    },
    hasVisited: {
        type: Boolean,
        default: false,
    },
    doctorId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    patientId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["Pending", "Confirmed", "Cancelled"],
        default: "Pending",
    },
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);