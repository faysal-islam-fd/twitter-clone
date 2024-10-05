import mongoose  from 'mongoose';
import 'dotenv/config'

const connectMongoDB = async () => {
    
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
    
    }
    catch(error){
        console.log("Error connecting to MongoDB :",error)
        process.exit(1)
    }
}

export default connectMongoDB;