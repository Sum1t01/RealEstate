import express from "express";
import { mongoose } from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

try
{
    mongoose.connect(process.env.MONGO);
}
catch(err)
{
    console.log(err);
}

const app = express();

app.use(express.json());
app.use(cookieParser);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.get("/", (req, res)=>{console.log("ding!")})

app.use((err, req, res, next)=>{
    const status = err.status || 500;
    const message = err.message || "Backend error";

    res.status(status).json({
        success:false,
        status:status,
        message: message
    });
});

const PORT = 3000

app.listen(PORT, ()=>{
    console.log(`Server is listening on Port: ${PORT}...`)
})