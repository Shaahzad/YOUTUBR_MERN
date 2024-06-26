import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";
import authRoutes from "./routes/auth.js"
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config()
const app = express();


const connect = ()=>{
mongoose.connect(process.env.MONGO_URL).then(()=>console.log("connected to mongoDB")).catch((err)=>console.log(err))
}

app.use(cookieParser())
app.use(express.json())

const corsOptions = {
    origin: 'https://youtube-mern-front.vercel.app',
    credentials: true
  };
app.use(cors(corsOptions))

app.get("/", (req, res) => {
    res.send("hello")
})
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/videos", videoRoutes)
app.use("/api/comments", commentRoutes)



app.use((err,req,res,next)=>{
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message 
    })
})


app.listen(8800,()=>{
    connect()
    console.log("server is running");
})