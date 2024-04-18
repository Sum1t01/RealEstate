import React from "react";
import { Link } from "react-router-dom"
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useSelector } from "react-redux";

function Header() {
    const { currentUser } = useSelector(state => state.user);
    // console.log(currentUser);
    return (
        <header className="bg-stone-300 shadow-md">
            <div className="flex justify-between items-center mx-auto p-2">
                <Link to="/">
                    <h1 className="font-medium text-sm sm:text-sl flex flex-wrap">
                        <span className="text-slate-500 text-xl">Real</span>
                        <span className="text-slate-700 text-xl">Estate</span>
                        {/* <span><SearchRoundedIcon/></span> */}
                    </h1>
                </Link>
                <form className="bg-slate-200 p-1 rounded-lg">
                    <input type="text" placeholder="Search" className="bg-transparent focus:outline-none w-24 sm:w-64" />
                    <SearchRoundedIcon />
                </form>
                <ul className="flex gap-4">
                    <Link to="/">
                        <li className="hidden sm:inline hover:text-green-500 text-slate-700">Home</li>
                    </Link>

                    <Link to="/about">
                        <li className="hidden sm:inline hover:text-green-500 text-slate-700">About</li>
                    </Link>

                    <Link to="/profile">
                        {currentUser ? (<img className="rounded-full h-7 w-7 object-cover" src={currentUser.avatar} alt="profile" />) :
                            (<li className="sm:inline hover:text-green-500 text-slate-700">Sign In</li>)
                        } 

                    </Link>

                </ul>
            </div>
        </header>
    );
}

export default Header;