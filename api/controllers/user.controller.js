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
            const hashedPassword = bcryptjs.hashSync(req.body.password, 10);
        }

        const updataUser = new User.findByIdAndUpdate(req.params.id, {
            $set:{
                username: req.body.username,
                password: hashedPassword,
                email: req.user.email,
                avatar: req.user.avatar
            }
        }, {new: true});

        const {password, ...rest} = updataUser._doc;

        res.status(200).json(rest);
    }
    catch (error) {
        next(error);
    }

}

export { updateUser, test };