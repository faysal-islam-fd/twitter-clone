import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const protectRoute = async (req, res, next) => {
    
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({failed:true,message:"Unauthorized"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({failed:true,message:"Unauthorized"})
        }

        const user = await User.findById(decoded.id).select("-password")
       
        
        if(!user){
            return res.status(401).json({failed:true,message:"User Not Found!"})
        }   
        req.user = user
        next()
    }
    catch(error){
        console.log("Error in protectRoute middlewire: ",error)
        res.status(500).json({failed:true,message:"Internal Server Error"})
    }
}