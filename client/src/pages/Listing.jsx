import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {useSelector} from 'react-redux';
import ShareIcon from '@mui/icons-material/Share';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HotelIcon from '@mui/icons-material/Hotel';
import BathtubIcon from '@mui/icons-material/Bathtub';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import ChairIcon from '@mui/icons-material/Chair';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import Contact from '../components/Contact';

function Listing() {
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [listing, setListing] = useState(null);
    const {currentUser} = useSelector((state)=>state.user);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {

            try {

                setLoading(true);
                setError(false);
                const listingID = params.listingID;
                const res = await fetch(`/api/listing/get/${listingID}`);
                const data = await res.json();
                if (data.success === false) {
                    setLoading(false);
                    setError(true);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            }
            catch (error) {
                setError(true);
                setLoading(false);
            }

        };

        fetchListing();

    }, [params.listingID]);

    // console.log(listing);

    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'>
                Loading...
            </p>}

            {error && <p className='text-center my-7 text-lg text-red-700'>
                Something went wrong !
            </p>}

            {listing && !loading && !error && (
                <div>
                    <Swiper navigation>
                        {listing.imageURLs.map((url) => (
                            <SwiperSlide key={url}>
                                <div
                                    className='h-[550px]'
                                    style={{
                                        background: `url(${url}) center no-repeat`,
                                        backgroundSize: 'cover',
                                        // height:'550px',
                                        // width:'1000px'
                                    }}
                                >
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div
                        className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'
                    >
                        <ShareIcon
                            className='text-slate-500'
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                setCopied(true);
                                setTimeout(() => {
                                    setCopied(false);
                                }, 500);
                            }}
                        />
                    </div>
                    {copied && (
                        <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                            Link copied!
                        </p>
                    )}

                    <div
                        className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'
                    >
                        <p className='text-3xl font-semibold'>
                            {listing.name} - ${' '}
                            {listing.offer
                                ? listing.discountedPrice.toLocaleString('en-US')
                                : listing.regularPrice.toLocaleString('en-US')}
                            {listing.type === 'rent' && ' / month'}
                        </p>

                        <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
                            <LocationOnIcon className='text-green-700' />
                            {listing.address}
                        </p>

                        <div className='flex gap-4'>
                            <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>
                            {listing.offer && (
                                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                    ${+listing.regularPrice - +listing.discountedPrice} OFF
                                </p>
                            )}
                        </div>
                        <p className='text-slate-800'>
                            <span className='font-semibold text-black'>Description - </span>
                            {listing.description}
                        </p>

                        <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <HotelIcon className='text-lg' />
                                {listing.bedrooms > 1
                                    ? `${listing.bedrooms} beds `
                                    : `${listing.bedrooms} bed `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <BathtubIcon className='text-lg' />
                                {listing.bathrooms > 1
                                    ? `${listing.bathrooms} baths `
                                    : `${listing.bathrooms} bath `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <LocalParkingIcon className='text-lg' />
                                {listing.parking ? 'Parking spot' : 'No Parking'}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <ChairIcon className='text-lg' />
                                {listing.furnished ? 'Furnished' : 'Unfurnished'}
                            </li>
                        </ul>
                        {currentUser && listing.userRef !== currentUser._id && !contact &&(

                        <button onClick={()=>setContact(true)} className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-85 p-3">
                            <PermContactCalendarIcon/> 
                            Contact Landlord
                        </button>
                        )}

                        {contact && <Contact listing={listing}/>}
                    </div>

                </div>
            )}
        </main>
    )
};

export default Listing;
