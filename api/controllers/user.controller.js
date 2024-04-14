import User from "../models/user.model.js";
import errorHandler from "../utils/error.js";
import bcryptjs from "bcryptjs";

const test = (req, res) => {
    res.send({ message: "working!" });
}

const updateUser = async (req, res, next) => {
    if (req.user.id != req.params.id) {
        return next(errorHandler(401, "Unauthorized!"));
    }

    try {
        if(req.user.password)
        {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar 
            }
        }, {new: true});

        const {password, ...rest} = updatedUser._doc;
        console.log(rest);
        res.status(200).json(rest);
    }
    catch (error) {
        // console.log("h");
        next(error);
    }

}

export { updateUser, test };