import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://karthik:karthik13@cluster0.otzqt.mongodb.net/food-del').then (()=>console.log("DB Connected"));
}

