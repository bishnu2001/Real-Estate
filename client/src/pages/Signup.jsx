import { data } from "autoprefixer";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const Signup = () => {
  const [formdata, setFormdata] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();
  const handleinput = (e) => {
    setFormdata({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  };
  const handlesubmit = async (e) => {
    try {
           e.preventDefault();
           setLoading(true);
           const res = await fetch("/api/auth/signup", {
             method: "POST",
             headers: {
               "Content-Type": "application/json",
             },
             body: JSON.stringify(formdata),
           });
           const data = await res.json();
           console.log(data)
           setLoading(false);
           if(data.success){
            navigate('/signin')
           }
           else{
            setError(data);
           }
        
    } catch (error) {
        console.log("info unable send check api ")
    }
  };


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handlesubmit}>
        <input
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleinput}
        />
        <input
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleinput}
        />
        <input
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleinput}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading" : "Sign Up"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an Account?</p>
        <Link to="/signin">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error.error}</p>}
    </div>
  );
};

export default Signup;
