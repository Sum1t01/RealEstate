import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import errorHandler from "../utils/error.js";
import bcryptjs from "bcryptjs";

const test = (req, res) => {
    res.send({ message: "working!" });
}

const updateUser = async (req, res, next) => {
    // console.log(req.body);
    if (req.user.id != req.params.id) {
        return next(errorHandler(401, "Unauthorized!"));
    }

    try {
        if (req.user.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, { new: true });

        const { password, ...rest } = updatedUser._doc;
        // console.log(rest.username);
        res.status(200).json(rest);
    }
    catch (error) {
        // console.log("h");
        next(error);
    }

}

const deleteUser = async (req, res, next) => {
    if (req.params.id !== req.user.id) {
        return next(errorHandler(401, "Cant Delete ID"));
    }

    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json({ message: "User has been deleted" });
    }
    catch (error) {
        next(error);
    }
};

const getUserListing = async (req, res, next) => {

    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "Forbidden"));
    }

    try {
        const listings = await Listing.find({ userRef: req.params.id });
        res.status(200).json(listings);
    }
    catch (error) {
        next(error);
    }
};

const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        const { password: pass, ...rest } = user._doc;
        res.status(200).json(rest);
    }
    catch (error) {
        next(error);
    }
}

export { updateUser, test, deleteUser, getUserListing, getUser };