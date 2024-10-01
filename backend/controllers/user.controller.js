import mongoose from "mongoose";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
export const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try{
        const user = await User.findOne({username});
        if(!user) return res.status(404).json({message: "User not found"});
        res.status(200).json({user});
    }
    catch(error){
        res.status(500).json({message: error.message});
        
    }
}

export const followUser = async (req, res) => {
    try{
        const {userId} = req.params;
        const modifyUser = await User.findById({_id:userId});
        const currentUser = await User.findById({_id:req.user._id});
       
      
        if(userId === req.user._id.toString()) return res.status(400).json({message: "You can't follow yourself"});
        if(!userId || !modifyUser) return res.status(404).json({message: "User not found"});

        const isFollowing = modifyUser.followers.includes(currentUser._id);
        if(isFollowing){
            //unfollow
            await User.findByIdAndUpdate(userId, {$pull:{followers: currentUser._id}});
            await User.findByIdAndUpdate(currentUser._id, {$pull:{following: modifyUser._id}});
            //send notification
            res.status(200).json({message:"You unfollowed the user"});
         }
        else{
            //follow
             await User.findByIdAndUpdate(userId, {$push:{followers: currentUser._id}});
             await User.findByIdAndUpdate(currentUser._id, {$push:{following: modifyUser._id}});
            
             //send notification
             const newNotifiaction = new Notification({
                type: "follow",
                from: currentUser._id,
                to: modifyUser._id
             })
             await newNotifiaction.save();
            res.status(200).json({message:"You followed the user"});
            }
    }
    catch(error){
        res.status(500).json({message: "HIII"+error.message});
    }
}

export const getSuggestedUsers = async (req, res) => {

        try{
            const userId = req.user._id;
            const userFollowedByMe = await User.findById(userId).select("following");

            const users = await User.aggregate([
                {
                    $match:{
                        _id: {$ne: userId }
                    }
                },
                {
                    $sample: {
                        size: 10
                    }
                }
            ])
            // const filteredUsers = users.filter(user=> user !== userFollowedByMe.includes(user));
            // const suggestedUsers = filteredUsers.slice(0, 5);
            // suggestedUsers.forEach(user => (user.password = null));    
            // res.status(200).json({users: suggestedUsers});
    res.status(200).json({message:"check"});
        }
        catch(error){
            res.status(500).json({message: error.message});
        }
}

export const updateProfile = async (req, res) => {
    const {username, email,currentPassword,newPassword,bio,link} = req.body;
    let {profileImage,coverImage} = req.body;
   
    const userId = req.user._id;
    try{
        let user = await User.findById(userId);
        if(!newPassword || !currentPassword ) return res.status(400).json({message: "Password fields are required"});
        if(currentPassword && newPassword){
            if(currentPassword===newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch) return res.status(400).json({message: "Incorrect password"});
            const salt = await bcrypt.genSalt(10);
            user.password = bcrypt.hash(newPassword, salt);
            }
            else{
                return res.status(400).json({message: "Passwords do not match"});
            }
        }
        if(profileImage){
            if(user.profileImage){
                await cloudinary.uploader.destroy(user.profileImage.split("/").pop().split(".")[0]);
            }
            const res = await cloudinary.uploader.upload(profileImage)
            profileImage = res.secure_url;
           
            
    }
    if(coverImage){
        if(user.coverImage){
            await cloudinary.uploader.destroy(user.coverImage.split("/").pop().split(".")[0]);
        }
        const res = await cloudinary.uploader.upload(coverImage)
        coverImage = res.secure_url;
    }
    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImage = profileImage || user.profileImage;
    user.coverImage = coverImage || user.coverImage;
    user = await user.save();
    user.password = null;    
    res.status(200).json({message: "Profile updated successfully",user});
}
    catch(error){
        res.status(500).json({message: error.message});
    }
 
}