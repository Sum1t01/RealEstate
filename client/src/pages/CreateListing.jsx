import { useState } from "react";
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from "firebase/storage";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreateListing() {

  const { currentUser } = useSelector(state => state.user);

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageURLs: [],
    name: "",
    address: "",
    description: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 5000,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (event) => {
    setFiles(event.target.files);
  }


  const handleFromChange = (event) => {
    if (event.target.id === "rent" || event.target.id === "sale") {
      setFormData({
        ...formData,
        type: event.target.id
      });
    }
    if (event.target.id === "offer" || event.target.id === "parking" || event.target.id === "furnished") {
      setFormData({
        ...formData,
        [event.target.id]: event.target.checked
      });
    }

    if (event.target.type === 'number' || event.target.type === 'text' || event.target.type === 'textarea') {
      setFormData({
        ...formData,
        [event.target.id]: event.target.value
      });
    }
  }

  const handleImageSubmit = (event) => {
    if (files.length > 0 && files.length + formData.imageURLs.length < 7) {
      const promises = [];
      setUploading(true);
      setImageUploadError(false);

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageURLs: formData.imageURLs.concat(urls)
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload faied (size > 2MB)");
          setUploading(false);
        });
    }
    else {
      setImageUploadError("Only 6 images are allowed");
      setUploading(false);
    }

  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on("state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          console.log(`Uploaded ${progress}%`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };


  const handleRemoveImage = (index) => {

    setFormData({
      ...formData,
      imageURLs: formData.imageURLs.filter((_, i) => i !== index)
    })

  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (formData.imageURLs.length < 1) {
        return setError("You must upload at least 1 image");
      }

      if (+formData.regularPrice <= +formData.discountedPrice) {
        return setError("Regular Price should be more than Discounted Price");
      }

      setLoading(true);
      setError(false);

      const res = await fetch("/api/listing/create", {
        method: 'POST',
        headers:
        {
          'Content-type': 'application/json',
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id
        })
      });

      const data = await res.json();
      // console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }

      navigate(`/listing/${data._id}`);

    }
    catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // console.log(formData);

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold my-7 text-center">
        Create a Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-7">

        <div className="flex flex-col gap-5 flex-1">
          <input onChange={handleFromChange} value={formData.name} type="text" placeholder="Name" id="name" className="border p-3 rounded-lg" maxLength="100" minLength="10" required />

          <textarea onChange={handleFromChange} value={formData.description} type="text" placeholder="Description" id="description" className="border p-3 rounded-lg" required />

          <input onChange={handleFromChange} value={formData.address} type="text" placeholder="Address" id="address" className="border p-3 rounded-lg" required />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-4" onChange={handleFromChange} checked={formData.type == 'sale'} />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-4" onChange={handleFromChange} checked={formData.type == 'rent'} />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-4" onChange={handleFromChange} checked={formData.parking} />
              <span>Parking Spot</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-4" onChange={handleFromChange} checked={formData.furnished} />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-4" onChange={handleFromChange} checked={formData.offer} />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">

            <div className="flex items-center gap-2">
              <input type="number" id="bedrooms" min="1" max="10" required className="p-3 border border-gray-300 rounded-lg" onChange={handleFromChange} value={formData.bedrooms} />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input type="number" id="bathrooms" min="1" max="10" required className="p-3 border border-gray-300 rounded-lg" onChange={handleFromChange} value={formData.bathrooms} />
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input type="number" id="regularPrice" min="5000" max="10000000" required className="p-3 border border-gray-300 rounded-lg" onChange={handleFromChange} value={formData.regularPrice} />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>

            {formData.offer && (<div className="flex items-center gap-2">
              <input type="number" id="discountedPrice" min="0" max="10000000" required className="p-3 border border-gray-300 rounded-lg" onChange={handleFromChange} value={formData.discountedPrice} />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
            )}


          </div>

        </div>

        <div className="flex flex-col flex-1 gap-4">

          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-400 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input onChange={handleImageChange} className="p-3 border border-gray-300 rounded w-full" type="file" id="images" accept="images/*" multiple />
            <button disabled={uploading} type="button" onClick={handleImageSubmit} className="p-3 text-green-700 border border-green-700 rounded-full uppercase hover:shadow-lg disabled:opacity-80">
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          <p className="text-red-700 text-sm text-center">
            {imageUploadError && imageUploadError}
          </p>

          {
            formData.imageURLs.length > 0 && formData.imageURLs.map((url, index) => (
              <div key={url} className='flex justify-between p-3 border items-center rounded-lg'>
                <img src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg' />

                <button onClick={() => { handleRemoveImage(index) }} type='button' className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>
                  Delete
                </button>
              </div>
            ))
          }

          <button disabled={loading || uploading} className="border bg-slate-700 p-3 text-white rounded-lg uppercase hover:opacity-80 disabled:opacity-60">
            {loading ? "Creating..." : "Create"}
          </button>

          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>

      </form>

    </main>
  )
}

export default CreateListing;