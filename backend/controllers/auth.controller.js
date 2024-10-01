import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
export const signup = async(req,res)=>{

    try{
        const {username,fullname,email,password} = req.body
        
        const validEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        if(!validEmail.test(email)){
            return res.status(400).json({message:"Invalid Email"})
        }
        const existingUser = await User.findOne({username})
        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }
        const existingEmail = await User.findOne({email})
        if(existingEmail){
            return res.status(400).json({message:"Email already exists"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            fullname,
            email,
            password: hashedPassword
        })
        if(newUser){
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save()
            return res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImage: newUser.profileImage,
                coverImage: newUser.coverImage,
                bio: newUser.bio,
                link: newUser.link
            })
        }
        else{
            return res.status(400).json({message:"Invalid User Data"})
        }


    }
    catch(error){
        console.log("Error in signup controller: ",error)
        res.status(500).json({message:"Internal Server Error"})
}
}




export const login = async (req,res)=>{
    try{
        const {username,password} = req.body
        if(!username){
            return res.status(400).json({message:"Please enter username"})
        }

        const user = await User.findOne({username})
      
        if(!user){
            return res.status(400).json({message:"User not found! Please signup"})
        }
        if(!password){
            return res.status(400).json({message:"Please enter password"})
        }
        const comparedPassword = await bcrypt.compare(password, user.password)
        if(!comparedPassword){
            return res.status(400).json({message:"Invalid Password"})
        } 
        generateTokenAndSetCookie(user._id, res)
        res.status(200).json({
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImage: user.profileImage,
            coverImage: user.coverImage,
            bio: user.bio,
            link: user.link
        })

    }
    catch(error){
        console.log("Error in login controller: ",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}





export const logout = async (req,res)=>{
        try{
            res.cookie("token","",{maxAge:1})
            res.status(200).json({message:"Logged out successfully"})
        }
        catch(error){
            console.log("Error in logout controller: ",error)
            res.status(500).json({message:"Internal Server Error"})
        }
}



export const getMe = async (req,res)=>{
 res.status(200).json(req.user)
    
}