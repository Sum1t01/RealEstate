import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

function Search() {

    const navigate = useNavigate();
    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'createdAt',
        order: 'desc'
    });

    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);


    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermurl = urlParams.get('searchTerm');
        const typeurl = urlParams.get('type');
        const parkingurl = urlParams.get('parking');
        const furnishedurl = urlParams.get('furnished');
        const offerurl = urlParams.get('offer');
        const sorturl = urlParams.get('sort');
        const orderurl = urlParams.get('order');

        if (searchTermurl || typeurl || parkingurl || furnishedurl || offerurl || sorturl || orderurl) {
            setSidebardata({
                searchTerm: searchTermurl || '',
                type: typeurl || '',
                parking: parkingurl === 'true' ? true : false,
                furnished: furnishedurl === 'true' ? true : false,
                offer: offerurl === 'true' ? true : false,
                sort: sorturl || 'createdAt',
                order: orderurl || 'desc'
            });
        }

        const fetchListing = async () => {

            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if (data.length > 8) {
                setShowMore(true);
            }
            else
            {
                setShowMore(false);
            }
            setListings(data);
            setLoading(false);

        }

        fetchListing();

    }, [location.search]);

    const handleChange = (event) => {
        if (event.target.id == 'all' || event.target.id == 'rent' || event.target.id === 'sale') {
            setSidebardata({ ...sidebardata, type: event.target.id });
        }

        if (event.target.id === 'searchTerm') {
            setSidebardata({ ...sidebardata, searchTerm: event.target.value });
        }

        if (event.target.id === 'parking' || event.target.id === 'furnished' || event.target.id === 'offer') {
            setSidebardata({ ...sidebardata, [event.target.id]: (event.target.checked || event.target.checked == 'true') ? true : false });
        }

        if (event.target.id === 'sort_order') {
            const sort = event.target.value.split('_')[0] || 'createdAt';
            const order = event.target.value.split('_')[1] || 'desc';

            setSidebardata({ ...sidebardata, sort: sort, order: order });
        }
    };


    const handleSubmit = (event) => {
        event.preventDefault();

        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebardata.searchTerm);
        urlParams.set('type', sidebardata.type);
        urlParams.set('parking', sidebardata.parking);
        urlParams.set('furnished', sidebardata.furnished);
        urlParams.set('offer', sidebardata.offer);
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);

        const searchQuery = urlParams.toString();

        navigate(`/search?${searchQuery}`);
    };

    const onShowMoreClick = async (event)=>{
        const noOfListings = listings.length;
        const startIndex = noOfListings;
        const urlParams = new URLSearchParams(location.search);

        urlParams.set('startIndex', startIndex);

        const searchQuery = urlParams.toString();

        const res = await fetch(`/api/listing/get?${searchQuery}`);

        const data = await res.json();

        if(data.length<9)
        {
            setShowMore(false);
        }

        setListings([...listings, ...data]);
    };

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-8 border-b-2 md:border-r-2 md:min-h-screen'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>
                            Search Term:
                        </label>
                        <input
                            type="text"
                            id="searchTerm"
                            placeholder="Search"
                            className="border rounded-lg p-3 w-full"
                            value={sidebardata.searchTerm}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>
                            Type:
                        </label>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id='all'
                                className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.type === 'all'}
                            />
                            <span>
                                Rent and Sale
                            </span>
                        </div>

                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id='rent'
                                className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.type === 'rent'}
                            />
                            <span>
                                Rent
                            </span>
                        </div>

                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id='sale'
                                className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.type === 'sale'}
                            />
                            <span>
                                Sale
                            </span>
                        </div>

                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id='offer'
                                className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.offer}
                            />
                            <span>
                                Offer
                            </span>
                        </div>
                    </div>

                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>
                            Amenities:
                        </label>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id='parking'
                                className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.parking}
                            />
                            <span>
                                Parking
                            </span>
                        </div>

                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id='furnished'
                                className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.furnished}
                            />
                            <span>
                                Furnished
                            </span>
                        </div>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>
                            Sort:
                        </label>
                        <select
                            className='border p-2 rounded-lg'
                            id="sort_order"
                            onChange={handleChange}
                            defaultValue='createdAt_desc'
                        >
                            <option
                                value='regularPrice_desc'
                            >
                                Price High to Low
                            </option>

                            <option
                                value='regularPrice_asc'
                            >
                                Price Low to High
                            </option>

                            <option
                                value='createdAt_desc'
                            >
                                Latest
                            </option>

                            <option
                                value='createdAt_asc'
                            >
                                Oldest
                            </option>
                        </select>
                    </div>

                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-85'>
                        Search
                    </button>
                </form>
            </div>

            <div className='flex-1'>
                <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
                    Listing Results:
                </h1>
                <div
                    className='p-7 flex flex-wrap gap-4'
                >
                    {!loading && listings.length === 0 && (
                        <p
                            className="text-xl text-red-700 text-center w-full"
                        >
                            No listing found!
                        </p>
                    )}

                    {loading && (
                        <p className='text-xl text-slate-700 text-center w-full'>
                            Loading...
                        </p>
                    )}

                    {!loading && listings && listings.map((listing) => (
                        <ListingItem key={listing._id} listing={listing} />
                    ))}


                    {showMore && (
                        <button
                            onClick={onShowMoreClick}
                            className='text-green-700 hover:underline p-7 text-center w-full'
                        >
                            Show More
                        </button>
                    )}
                </div>


            </div>
        </div>
    );
}

export default Search;