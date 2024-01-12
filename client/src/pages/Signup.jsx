import React from 'react'

const Signup = () => {
  return (
    <div>
      <h1 className="text-3xl text-center font-semibold my-7">Signup</h1>
      <form className="flex flex-col gap-4">
        <input
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
        />
        <input
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />
      </form>
    </div>
  );
}

export default Signup;