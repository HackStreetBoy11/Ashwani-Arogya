import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import jwt from "jsonwebtoken";
export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
        return next({ message: "Please login to access this resource" });
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decodedData.id);
    if (req.user.role !== "Admin") {
        return next(
            { message: "You are not authorized to access this resource", statusCode: 403 }  
        );
    }
    next();
}
);  

export const isPatientAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) {
        return next({ message: "Patient Not Authenticated", statusCode: 401 });
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decodedData.id);
    if (req.user.role !== "Patient") {
        return next(
            { message: "You are not authorized to access this resource", statusCode: 403 }  
        );
    }
    next();
}
);  