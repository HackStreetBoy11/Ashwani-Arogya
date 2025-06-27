import mongoose from "mongoose";

export const dbConnection =  () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName:"MERN_STACK_HOSPITAL_MANAGMENT_SYSTEM"
    }).then(() => {
        console.log("Database connected successfully");
    }).catch((error) => {
        console.error("Database connection failed:", error);
        process.exit(1); // Exit the process with failure
    });
};