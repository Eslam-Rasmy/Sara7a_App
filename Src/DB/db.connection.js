import mongoose from "mongoose";



const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_URL_LOCAL)
        console.log("db connected succesfull");

    } catch (err) {
        console.log("Db failed", err);

    }
}   


export default dbConnection 