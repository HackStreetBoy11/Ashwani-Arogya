import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/generateToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, nic, role } = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !role) {
        return next(new ErrorHandler("Please fill all the fields", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ErrorHandler("User already exists", 400));
    }

    const newUser = await User.create({ firstName, lastName, email, phone, password, gender, dob, nic, role });
    generateToken(newUser, "User registered successfully", 201, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    generateToken(user, "User login successful", 200, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, nic } = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic) {
        return next(new ErrorHandler("Please fill all the fields", 400));
    }

    const existing = await User.findOne({ email });
    if (existing) return next(new ErrorHandler("Admin already exists", 400));

    const admin = await User.create({ firstName, lastName, email, phone, password, gender, dob, nic, role: "Admin" });
    generateToken(admin, "Admin created successfully", 201, res);
});


export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
    const doctors = await User.find({ role: "Doctor" }).select("-password");
    if (!doctors || doctors.length === 0) {
        return next(new ErrorHandler("No doctors found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Doctors retrieved successfully",
        doctors
    });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("adminToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).json({
        success: true,
        message: "Admin logged out successfully",
    });
});

export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("patientToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).json({
        success: true,
        message: "Patient logged out successfully",
    });
});

// export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
//     if(!req.files || Object.keys(req.files).length === 0){
//         return next(new ErrorHandler("Please upload a profile picture", 400));
//     }
//     const {docAvatar} = req.files;
//     const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
//     if (!allowedFormats.includes(docAvatar.mimetype)) {
//         return next(new ErrorHandler("Invalid file format. Only JPEG, PNG, and JPG are allowed.", 400));
//     }
//     const {firstName, lastName, email, phone, password, gender, dob, nic, doctorDepartment} = req.body;
//     if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !doctorDepartment) {
//         return next(new ErrorHandler("Please fill all the fields", 400));
//     }

//     const isRegistered = await User.findOne({ email });
//     if (isRegistered) {
//         return next(new ErrorHandler("Doctor already exists", 400));
//     }
//     // const cloudinaryResponse = await cloudinary.v2.uploader.upload(docAvatar.tempFilePath);
//     // if(!cloudinaryResponse || !cloudinaryResponse.error) {
//     //     return next(new ErrorHandler("Failed to upload profile picture", 500));
//     // }

//     const doctor = await User.create({
//         firstName,
//         lastName,
//         email,
//         phone,
//         password,
//         gender,
//         nic,
//         dob,
//         role: "Doctor",
//         doctorDepartment,   
//         docAvatar: {
//             public_id: cloudinaryResponse.public_id,
//             url: cloudinaryResponse.secure_url,
//         }
// });
// res.status(201).json({
//     success: true,
//     message: "Doctor created successfully",
//     doctor,
// });

// });

export const getAllAdmins = catchAsyncErrors(async (req, res, next) => {
    const admins = await User.find({ role: "Admin" }).select("-password");
    if (!admins || admins.length === 0) {
        return next(new ErrorHandler("No admins found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Admins retrieved successfully",
        admins
    });
});


export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        doctorDepartment
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !doctorDepartment) {
        return next(new ErrorHandler("Please fill all the fields", 400));
    }

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler("Doctor already exists", 400));
    }

    // Default avatar if no file uploaded
    let avatarData = {
        public_id: "default_avatar",
        url: "https://res.cloudinary.com/demo/image/upload/v1699999999/default-avatar.jpg"
    };

    // If file is uploaded, process it
    if (req.files && req.files.docAvatar) {
        const { docAvatar } = req.files;
        const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];

        if (!allowedFormats.includes(docAvatar.mimetype)) {
            return next(new ErrorHandler("Invalid file format. Only JPEG, PNG, and JPG are allowed.", 400));
        }

        const cloudinaryResponse = await cloudinary.v2.uploader.upload(docAvatar.tempFilePath);
        avatarData = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        };
    }

    // Create doctor
    const doctor = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role: "Doctor",
        doctorDepartment,
        docAvatar: avatarData
    });

    res.status(201).json({
        success: true,
        message: "Doctor created successfully",
        doctor
    });

});
