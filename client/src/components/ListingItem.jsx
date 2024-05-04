import { Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function ListingItem({ listing }) {
    return (
        <div
            className='bg-white gap-4 shadow-md hover:scale-105 rounded-lg transition-scale duration-300 hover:shadow-lg w-[full] sm:w-[320px]'
        >

            <Link to={`/listing/${listing._id}`}>
                <img
                    src={listing.imageURLs[0]}
                    alt="listing cover"
                    className='h-[320px] sm:h-[220px] w-full object-cover'
                />

                <div className='p-3 flex flex-col gap-1 w-full'>
                    <p className='truncate text-lg font-semibold text-slate-700'>
                        {listing.name}
                    </p>
                    <div className='flex items-center gap-2'>
                        <LocationOnIcon className='h-2 w-2 text-green-700' />
                        <p className='text-sm text-gray-700 truncate'>
                            {listing.address}
                        </p>
                    </div>
                    <p className='text-sm text-gray-500 line-clamp-2'>
                        {listing.description}
                    </p>

                    <p className='text-slate-500 font-semibold mt-2'>
                        ${listing.offer ? listing.discountedPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                        {listing.type === 'rent' && '/month'}
                    </p>
                    <div className='text-slate-700 flex gap-5'>
                        <div className='font-bold text-xs'>
                            {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                        </div>
                        <div className='font-bold text-xs'>
                            {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                        </div>
                    </div>
                </div>

            </Link>
        </div>
    )
}


export default ListingItem;