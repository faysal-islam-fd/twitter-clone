import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";

export const getNofications = async (req, res) => {

    try{
        const userId = req.user._id;
        const notifications = await Notification.find({to: userId})
        .populate({
            path:"from",
            select:"profileImage username"
        });
        await Notification.updateMany({to: userId}, {read: true});
        
        res.status(200).json({notifications});
    }

    catch(error){
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }

}


export const deleteAllNofications = async (req, res) => {
    const userId = req.user._id;
    try{

        const notification = await Notification.deleteMany({to: userId});
        res.status(200).json({message: "Notifications deleted"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const deleteNofication = async (req, res) => {   
    const {notificationId} = req.params;
    if(!notificationId) return res.status(400).json({message: "Notification id is required"});
    try{
        
        const deletedNotification = await Post.findById(notificationId);
        if(!deletedNotification) return res.status(404).json({message: "Notification not found"});
        if(deleteAllNofications.to.toString() !== req.user._id.toString()){
            return res.status(401).json({message: "You are not authorized to delete this notification"})
        }
        await Notification.findByIdAndDelete(notificationId);
        res.status(200).json({message: "Notification deleted"});
        
    } 
    catch(error){
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}