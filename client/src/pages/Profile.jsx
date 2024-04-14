import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { useRef, useEffect } from 'react';
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

function Profile() {
  const { currentUser } = useSelector(state => state.user);
  const fileRef = useRef(null);

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  // console.log(file);

  const [fileError, setUploadError] = useState(false);

  const [formData, setFromData] = useState({});
  // console.log(formData);

  const changeHandler = (event) => {
    return setFile(event.target.files[0]);
  }

  useEffect(() => {
    if (file) {
      handleUpload(file);
    }
  }, [file]);


  const handleUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;

    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // console.log("upload is " + progress+ "% done");
      setFilePerc(Math.round(progress));
    },
      (error) => {

        setUploadError(true);
      },

      async () => {
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL) =>setFromData({ ...formData, avatar: downloadURL })
        );
      }
    );


  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className='flex flex-col gap-3'>
        <input onChange={changeHandler} type="file" ref={fileRef} hidden accept='image/*' />
        <img onClick={() => { fileRef.current.click() }} className="rounded-full h-24 w-24 object-cover cursor-pointer self-center m-2" src={formData.avatar || currentUser.avatar} alt="profile" />
        <p className="text-sm self-center">
          {fileError?
          (<span className="text-red-700">
            Image must be less than 2MB
            </span>): 
            (filePerc>0 && filePerc<100)?
            <span className="text-green-600">
              {`Uploading ${filePerc}%`}
            </span>:
            (filePerc==100)?
          <span className="text-green-600">
            Upload Successful
          </span>:""}
        </p>
        <input type="text" placeholder="username" id="username" className="border p-3 rounded-lg" />
        <input type="email" placeholder="email" id="email" className="border p-3 rounded-lg" />
        <input type="password" placeholder="password" id="password" className="border p-3 rounded-lg" />
        <button className="bg-green-600 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-80">Update</button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}


export default Profile;