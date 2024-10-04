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
        
        res.status(200).json(notifications);
    }

    catch(error){
        console.log(error);
        res.status(500).json({failed:true,message: "Internal server error"});
    }

}


export const deleteAllNofications = async (req, res) => {
    const userId = req.user._id;
    console.log("Deleting...")
    try{

        const notification = await Notification.deleteMany({to: userId});
        res.status(200).json({message: "Notifications deleted"});
    }
    catch(error){
        res.status(500).json({failed:true,message: "Internal server error"});
    }
}
