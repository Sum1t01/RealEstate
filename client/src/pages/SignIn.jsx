import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signinSuccess, signinFailure, signinStart } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

function SignIn() {

  const [formData, setFormData] = new useState({
    username: "",
    email: "",
    password: ""
  });

  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { id, value } = event.target;

    setFormData({
      ...formData,
      [id]: value
    });

  };
  // console.log(formData);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      dispatch(signinStart());

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(signinFailure(data.message));
        return;
      }
      dispatch(signinSuccess(data));
      navigate("/");

    }
    catch (error) {
      dispatch(signinFailure(error.message));
    }


  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl text-center my-3 font-semibold">Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='email' placeholder='Email' className="border p-3 rounded-lg" id="email" onChange={handleChange} />
        <input type='password' placeholder='Password' className="border p-3 rounded-lg" id="password" onChange={handleChange} />
        <button disabled={loading} className="bg-slate-600 text-white uppercase p-3 rounded-lg hover:opacity-70">
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth/>
      </form>

      <div className='flex gap-2 mt-5'>
        <p>New User?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-600">Sign Up</span>
        </Link>

      </div>
      {error && <p className="text-red-700 mt-5">{error}</p>}
      {/* {!error && <p className="text-green-600">User Created Successfully&#33;</p>} */}
    </div>
  );
}

export default SignIn;
