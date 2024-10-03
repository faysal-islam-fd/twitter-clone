import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import {v2 as cloudinary} from 'cloudinary';
import User from "../models/user.model.js";

export const createPost = async (req, res) => {
    try{
        let {text,image} = req.body;
      
        const userId = req.user._id;
        if(!text && !image){
            return res.status(400).json({message: "Text or image is required"})
        }
        if(image){
            const res = await cloudinary.uploader.upload(image)
            image = res.secure_url;
        }
        const newPost = new Post(
            {   user:userId,
                text,
                image
            }
        )
        await newPost.save();
        res.status(201).json({message: "Post created successfully"})
    }
    catch(error){
        res.status(500).json({message: "Internal server error"})
    }

}

export const deletePost = async (req, res) => {
    try{
        const postId = req.params.postId;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({failed:true,message: "Post not found"})
        }
        if(post.user.toString() !== userId.toString()){
            return res.status(401).json({failed:true,message: "Unauthorized"})
        }
        if(post.image){
            const publicId = post.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId)
        }
        await Post.findByIdAndDelete(postId);   
        res.status(200).json({message: "Post deleted successfully"})
    }
    catch(error){
        res.status(500).json({failed:true,message: "Internal server error"})
    }
}

export const commentOnPost = async (req, res) => {

    try{
        const {text} = req.body;
        const postId = req.params.postId;
        const userId = req.user._id;
        if(!text){
            return res.status(400).json({message: "Text is required"})
        }
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message: "Post not found"})
        }
        const comment = {text, user: userId} 
        post.comments.push(comment);
        await post.save();
        res.status(201).json({message: "Comment added successfully"})
    }
    catch(error){
        res.status(500).json({message: "Internal server error"})
    }
}

export const likeUnlikePost = async (req, res) => {
    try{
        const postId = req.params.postId;
        const userId = req.user._id;
        const post = await Post.findById(postId);
      
        
        if(!post){
            return res.status(404).json({message: "Post not found"})
        }
        if(post.likes.includes(userId)){
          
            post.likes = post.likes.filter(id => id.toString() !== userId.toString())
            await User.updateOne({_id:userId}, {$pull: {likedPost: postId}})
            await post.save();
            res.status(200).json({message: "Unlike done successfully"})
        }
        else{
         
            post.likes.push(userId)
             await User.updateOne({_id: userId}, {$push: {likedPost: postId}})
            //TODO: send notification to the user..
            await post.save();
            const notification = await Notification(
                {
                    from: userId,
                    to: post.user,
                    type: "like"
                }
            )
            await notification.save()

            res.status(200).json({message: "Like done successfully"})
        }
       
       
    }
    catch(error){
      
        res.status(500).json({message: "Internal server error"})
    }
}

export const getAllPosts =  async (req,res) =>{ 
    try{
        const posts = await Post.find().sort({createAt: -1})
        .populate({path:"user",select:"-password"})
        .populate({path:"comments.user", select:"-password"})
        
        if(posts.length===0){
          return res.status(200).json([])
        }
        res.status(200).json(posts)
    }
    catch(error){
        res.status(500).json({message: "Internal server error"});
    }
}

export const getLikedPosts = async (req, res) => {
   
    const userId = req.params.userId;
       try{
            const user = await User.findById(userId);
            if(!user){
                return res.status(404).json({message: "User not found"})
            }
           
            const likingPosts = await Post.find({_id: {$in: user.likedPost}})
            .populate({path:"user",select:"-password"})
            .populate({path:"comments.user", select:"-password"})            
           
            if(likingPosts.length===0){
                return res.status(200).json([])
            }
            res.status(200).json(likingPosts)
    }
        catch(error){
           res.status(500).json({message: "Internal server error"})
        }
}

export const getFollowingPosts = async (req, res) => {
    const userId = req.user._id
    const following =  req.user.following;
    try{
        const posts = await Post.find({user: {$in: following}})
        .sort({createAt: -1})
        .populate({path:"user",select:"-password"})
        .populate({path:"comments.user", select:"-password"})
        .sort({createdAt: -1})
      
        res.status(200).json(posts)
    }
    catch(error){
        res.status(500).json({message: "Internal server error"})
    }
}

export const getUserPosts = async(req, res) => {
    try{
        const { username } = req.params;
        const user = await User.findOne({username})
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        const posts = await Post.find({user: user._id})
            .sort({createdAt: -1})
            .populate({path:"user",select:"-password"})
            .populate({path:"comments.user", select:"-password"})
        res.status(200).json(posts)
    }
    catch(error){
        res.status(500).json({message: "Internal server error"})
    }
}