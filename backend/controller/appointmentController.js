import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Appointment } from "../models/appointmentSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor_firstName,
        doctor_lastName,
        address
    } = req.body;

    if (
        !firstName || !lastName || !email || !phone || !nic || !dob ||
        !gender || !appointment_date || !department ||
        !doctor_firstName || !doctor_lastName || !address
    ) {
        return next(new ErrorHandler("Please fill all the fields", 400));
    }

    const isConflict = await User.find({
        firstName: doctor_firstName,
        lastName: doctor_lastName,
        role: "Doctor",
        doctorDepartment: department,
    });

    if (!isConflict || isConflict.length === 0) {
        return next(new ErrorHandler("Doctor not found in the specified department", 404));
    }

    if (isConflict.length > 1) {
        return next(new ErrorHandler("Doctor conflict through email or phone", 404));
    }

    const doctorId = isConflict[0]._id;
    const patientId = req.user._id;

    const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
        firstName: doctor_firstName,
        lastName: doctor_lastName
    },
    hasVisited: false,  // default here
    address,
    doctorId,
    patientId,
});

    res.status(201).json({
        success: true,
        message: "Appointment created successfully",
        appointment,
    });
});


export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
    const appointments = await Appointment.find({}).populate("doctorId", "firstName lastName").populate("patientId", "firstName lastName");

    if (!appointments || appointments.length === 0) {
        return next(new ErrorHandler("No appointments found", 404));
    }

    res.status(200).json({
        success: true,
        appointments,
    });
});


export const updateAppointment = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return next(new ErrorHandler("Please provide appointment ID", 400));
    }

    const appointment = await Appointment.findByIdAndUpdate(
        id,
        req.body, // <-- Update with the data sent in request
        { new: true, runValidators: true }
    );

    if (!appointment) {
        return next(new ErrorHandler("Appointment not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Appointment updated successfully",
        appointment,
    });
});

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return next(new ErrorHandler("Please provide appointment ID", 400));
    }

    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
        return next(new ErrorHandler("Appointment not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Appointment deleted successfully",
    });
});