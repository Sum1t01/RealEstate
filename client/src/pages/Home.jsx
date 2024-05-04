import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem.jsx';

function Home() {

  const [offerListing, setOfferListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);

  SwiperCore.use([Navigation]);

  useEffect(() => {

    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListing(data);
        fetchRentListings();
      }
      catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setRentListing(data);
        fetchSaleListings();
      }
      catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=4`);
        const data = await res.json();
        setSaleListing(data);
      }
      catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();

  }, []);

  // console.log(offerListing);

  return (
    <div>
      <div className='flex flex-col gap-6 py-10 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>
            perfect
          </span>
          <br />place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          The best place to find your place of comfort.
          <br />Our expert support is always available.
        </div>

        <Link to={"/search"} className='text-xs sm:text-sm text-blue-700 font-bold hover:text-blue-900'>
          Let's get started...
        </Link>
      </div>

      <Swiper navigation>
        {offerListing && offerListing.length > 0 && offerListing.map((listing) => (
          <SwiperSlide>
            <div
              style={{
                background: `url(${listing.imageURLs[0]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className='h-[500px]'
              key={listing._id}>

            </div>
          </SwiperSlide>
        ))
        }
      </Swiper>


      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {
          offerListing && offerListing.length > 0 && (
            <div>
              <div className='my-6'>
                <h2 className='font-semibold text-2xl text-slate-700'>
                  Recent Offers
                </h2>
                <Link className='text-sm text-blue-600 hover:text-blue-800' to={'/search?offer=true'}>
                  Show more offers
                </Link>
              </div>

              <div className='flex felx-wrap gap-4'>
                {
                  offerListing.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
            </div>
          )
        }

        {
          saleListing && saleListing.length > 0 && (
            <div>
              <div className='my-6'>
                <h2 className='font-semibold text-2xl text-slate-700'>
                  Recent Places for Sale
                </h2>
                <Link className='text-sm text-blue-600 hover:text-blue-800' to={'/search?type=sale'}>
                  Show more places for sale
                </Link>
              </div>

              <div className='flex felx-wrap gap-4'>
                {
                  saleListing.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
            </div>
          )
        }

        {
          rentListing && rentListing.length > 0 && (
            <div>
              <div className='my-6'>
                <h2 className='font-semibold text-2xl text-slate-700'>
                  Recent Places for Rent
                </h2>
                <Link className='text-sm text-blue-600 hover:text-blue-800' to={'/search?type=rent'}>
                  Show more places for rent
                </Link>
              </div>

              <div className='flex felx-wrap gap-4'>
                {
                  rentListing.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
            </div>
          )
        }
      </div>

    </div>
  );
}

export default Home;