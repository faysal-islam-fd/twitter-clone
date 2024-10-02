import mongoose from "mongoose";


const PostSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text:{
        type: String,
        required: true
    },
    image:{
        type: String,
        default: ""
    },
    likes:[
        {  
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments:[

        {
            text: {
                type: String,
                required: true
            },
            user:{
                type: mongoose.Types.ObjectId,
                ref: 'User'
            }
        }
        
    ]
},{timestamps: true})

const Post = mongoose.model('Post', PostSchema);

export default Post;