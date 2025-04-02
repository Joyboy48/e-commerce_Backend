import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        firstName:{
            type:String,
            required:true,
            trim:true,
            index:true,
        },
        lastName:{
            type:String,
            required:true,
            trim:true,
            index:true,
        },
        phoneNumber:{
            type:String,
            required:true,
            trim:true,
            index:true,
        },
        gender: {
            type: String,
            
          },
        avatar:{
            type:String,  //cloudinary url  
        },
        dateOfBirth: {
            type: Date,
            
        },
        password:{
            type:String,
            required:[true,"Password is required"]
        },
        addresses:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Address"
            }
        ],
        orders:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Order"
            }
        ],
        wishlist:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Wishlist"
            }
        ],
        refreshToken:{
            type:String
        }

    },{timestamp:true})

userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
    
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)