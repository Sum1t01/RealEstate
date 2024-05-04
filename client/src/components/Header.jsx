import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header() {
    const { currentUser } = useSelector(state => state.user);
    // console.log(currentUser);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);

        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const urlFromSearchTerm = urlParams.get('searchTerm');

        if (urlFromSearchTerm) {
            setSearchTerm(urlFromSearchTerm);
        }
    }, [location.search]);

    return (
        <header className="bg-stone-300 shadow-md">
            <div className="flex justify-between items-center mx-auto p-2">
                <Link to="/">
                    <h1 className="font-medium text-sm sm:text-sl flex flex-wrap gap-1">
                        <MapsHomeWorkIcon />
                        <span className="text-slate-500 text-xl">Real</span>
                        <span className="text-slate-700 text-xl">Estate</span>
                        {/* <span><SearchRoundedIcon/></span> */}
                    </h1>
                </Link>
                <form onSubmit={handleSubmit} className="bg-slate-200 p-1 rounded-lg">
                    <input type="text"
                        placeholder="Search"
                        className="bg-transparent focus:outline-none w-24 sm:w-64"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                    <button>
                        <SearchRoundedIcon />
                    </button>
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