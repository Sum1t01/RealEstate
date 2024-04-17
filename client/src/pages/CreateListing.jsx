import { useState } from "react";
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from "firebase/storage";
import { app } from "../firebase.js";

function CreateListing() {

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageURLs: [],
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (event) => {
    setFiles(event.target.files);
  }
  // console.log(files);

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
        setFormData({ ...formData, imageURLs: formData.imageURLs.concat(urls) });
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


  const handleRemoveImage = (index)=>{

    setFormData({
      ...formData,
      imageURLs: formData.imageURLs.filter((_,i)=>i!==index)
    })

  }

  console.log(formData);
  console.log(formData.imageURLs.length);

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold my-7 text-center">
        Create a Listing
      </h1>

      <form className="flex flex-col sm:flex-row gap-7">

        <div className="flex flex-col gap-5 flex-1">
          <input type="text" placeholder="Name" id="name" className="border p-3 rounded-lg" maxLength="100" minLength="10" required />

          <textarea type="text" placeholder="Description" id="description" className="border p-3 rounded-lg" required />

          <input type="text" placeholder="Address" id="address" className="border p-3 rounded-lg" required />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-4" />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-4" />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-4" />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-4" />
              <span>Parking Spot</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-4" />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-4" />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">

            <div className="flex items-center gap-2">
              <input type="number" id="bedrooms" min="1" max="10" required className="p-3 border border-gray-300 rounded-lg" />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input type="number" id="bathrooms" min="1" max="10" required className="p-3 border border-gray-300 rounded-lg" />
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input type="number" id="regularPrice" min="1" max="10" required className="p-3 border border-gray-300 rounded-lg" />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="number" id="discountedPrice" min="1" max="10" required className="p-3 border border-gray-300 rounded-lg" />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>

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
            <input onChange={handleChange} className="p-3 border border-gray-300 rounded w-full" type="file" id="images" accept="images/*" multiple />
            <button disabled={uploading} type="button" onClick={handleImageSubmit} className="p-3 text-green-700 border border-green-700 rounded-full uppercase hover:shadow-lg disabled:opacity-80">
              {uploading?"Uploading...": "Upload"}
            </button>
          </div>

          <p className="text-red-700 text-sm text-center">
            {imageUploadError && imageUploadError}
          </p>

          {
            formData.imageURLs.length > 0 && formData.imageURLs.map((url, index) => (
              <div key={url} className='flex justify-between p-3 border items-center rounded-lg'>
                <img src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg' />

                <button onClick={()=>{handleRemoveImage(index)}} type='button' className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>
                  Delete
                </button>
              </div>
            ))
          }

          <button className="border bg-slate-700 p-3 text-white rounded-lg uppercase hover:opacity-80 disabled:opacity-60">
            Create Listing
          </button>
        </div>

      </form>

    </main>
  )
}

export default CreateListing;