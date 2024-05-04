import express from "express";
import { mongoose } from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.route.js";
import path from 'path';

dotenv.config();

try {
    mongoose.connect(process.env.MONGO);
}
catch (err) {
    console.log(err);
}

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());


const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is listening on Port: ${PORT}...`)
})

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Backend error";

    res.status(status).json({
        success: false,
        status: status,
        message: message
    });
});