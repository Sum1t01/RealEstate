import React, { useState } from 'react';
import { Link,  useNavigate} from "react-router-dom";
import OAuth from '../components/OAuth';

function SignUp() {

  const [formData, setFormData] = new useState({
    username: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = new useState(false);
  const [error, setError] = new useState(null);
  const navigate = useNavigate();
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
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");

    } 
    catch (error) {
      setLoading(false);
      setError(error.message);
    }


  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl text-center my-3 font-semibold">Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='text' placeholder='User Name' className="border p-3 rounded-lg" id="username" onChange={handleChange} />
        <input type='email' placeholder='Email' className="border p-3 rounded-lg" id="email" onChange={handleChange} />
        <input type='password' placeholder='Password' className="border p-3 rounded-lg" id="password" onChange={handleChange} />
        <button disabled={loading} className="bg-slate-600 text-white uppercase p-3 rounded-lg hover:opacity-70">
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth/>
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-600">Sign In</span>
        </Link>

      </div>
      {error && <p className="text-red-700 mt-5">{error}</p>}
      {/* {!error && <p className="text-green-600">User Created Successfully&#33;</p>} */}
      </div>
  );
}

export default SignUp
