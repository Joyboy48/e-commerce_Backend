import {asyncHandler} from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js"
import {User}  from "../models/user.models.js"
import {apiResponse} from "../utils/apiResponse.js"
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken,refreshToken}

    } catch (error) {
        throw new apiError(500,`Something want wrong while 
            generating refresh and access tokens`)
    }
}

const registerUser = asyncHandler(async(req,res)=>{

    const {firstName,lastName,username,phoneNumber,email,password} = req.body;

    //console.log("Request body:", req.body);

    if(
        [firstName,lastName,username,phoneNumber,email,password]
        .some((field)=>field?.trim() === "")
    ) {
        throw new apiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
        $or:[{username},{email}]
    });

    if (existingUser) {
        throw new apiError(400, "User already exists");
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        username,
        password
    });

    const createdUser = await User.findById(user._id)
    .select("-password -refreshToken");

    if(!createdUser){
        throw new apiError(500,"Something went wrong while registering user")
    }
    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            createdUser,
            "user registered successfully"
        )
    );
});

const loginUser = asyncHandler(async(req,res)=>{

    const {email,password} = req.body;

    if(!(email || password)){
        throw new apiError(400,"email password required")
    }

    const user = await User.findOne({email});

    if(!user){
        throw new apiError(400,"invalid email")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if(!isPasswordCorrect){
        throw new apiError(400,"invalid password")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new apiResponse(
            200,
            {user:loggedInUser,accessToken,refreshToken},
            "user logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined,
                new:true
            }
        }

    )

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new apiResponse(200,{},"User logged out"))
})

const forgotPassword = asyncHandler(async(req,res)=>{
    const {email} = req.body;

    const oldUser = await User.findOne({email});

    if(!oldUser){
        throw new apiError(400,"User does not exist")
    }

    ///console.log("hi");
    

    // Generate a JWT reset token
    const resetToken = jwt.sign(
        { id: User._id }, // Payload (user ID)
        process.env.JWT_RESET_PASSWORD_SECRET, // Secret key
        { expiresIn: "15m" } // Token expiration time
    );

   // console.log("hi");
    // Create a reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

   // console.log("hi");
    // Email message
    const message = `
        You have requested to reset your password. Please click the link below to reset your password:
        ${resetUrl}
        If you did not request this, please ignore this email.
    `;
   // console.log("hi");

    try {
        // Send the email
        await sendEmail({
            email: oldUser.email,
            subject: "Password Reset Request",
            message,
        });

        return res
            .status(200)
            .json(new apiResponse(200, {}, "Password reset email sent successfully"));
    } catch (error) {
        throw new apiError(500, "Failed to send password reset email");
    }

})

const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params; // Get the token from the URL
    const { newPassword } = req.body;

    if (!newPassword) {
        throw new apiError(400, "New password is required");
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET);

        // Find the user by ID
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new apiError(400, "Invalid or expired token");
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        return res
            .status(200)
            .json(new apiResponse(200, {}, "Password reset successfully"));
    } catch (error) {
        throw new apiError(400, "Invalid or expired token");
    }
});
export {registerUser,loginUser,logoutUser,forgotPassword,resetPassword}