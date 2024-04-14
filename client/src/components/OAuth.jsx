import {GoogleAuthProvider, getAuth, signInWithPopup} from "@firebase/auth";
import { app } from "../firebase.js";
import {useDispatch} from "react-redux";
import {signinSuccess} from "../redux/user/userSlice.js";
import {useNavigate} from "react-router-dom";

export default function OAuth() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async (req, res) => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            // console.log(result);

            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                })
            });
            // console.log(res);
            const data = await res.json();
            dispatch(signinSuccess(data));
            navigate('/');
        }
        catch (error) {
            console.log("couldnt sign with google", error);
        }
    }

    return (
        <button onClick={handleGoogleClick} type="button" className="p-3 rounded-lg bg-red-700 text-white uppercase hover:opacity-80">continue with google</button>
    )
}
