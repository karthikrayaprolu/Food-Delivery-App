import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Incorrect password" });
        }

        // Create and send token
        const token = createToken(user._id);
        return res.json({ success: true, message: "Login successful", token });
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})

    }
};

// Token generation
const createToken = (id) => {
    try {
        return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    } catch (error) {
        console.log(error);
        throw new Error('Token generation failed');
    }
};

// Register user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;

    try {
        // Check if user already exists
        const exists = await userModel.findOne({ email }); // Fixed the typo here
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Validate email format & password strength
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hash the user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        // Save user and create token
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, message: "User created successfully", token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export { loginUser, registerUser };
