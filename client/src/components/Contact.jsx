import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');

    const onChange = (event) => {
        setMessage(event.target.value);
    }

    useEffect(() => {

        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data);
            }
            catch (error) {
                console.log(error);
            }
        }

        fetchLandlord();

    }, [listing.userRef]);

    return (
        <>
            {landlord && (
                <div className='flex flex-col gap-2'>
                    <p>
                        Contact <span className='font-semibold'>
                            {landlord.username}
                        </span>
                    </p>
                    <textarea className='w-full border p-3 rounded-lg' onChange={onChange} name="message" id="message" rows="2" placeholder='Leave a message' value={message} />
                    <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                        className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-85'
                    >
                        Send Message
                    </Link>
                </div>
            )}
        </>
    )
}
