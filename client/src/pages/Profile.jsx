import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserstart,
  updateUserSuccess,
  updateUserfailure,
  deleteUserstart,
  deleteUserfailure,
  deleteuserSuccess,
  SignoutUserstart,
  SignoutUserfailure,
  SignoutuserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Profile = () => {
  const fileref = useRef(null);
  const [file, setFile] = useState(undefined);
  const [fileperc, setFileperc] = useState(0);
  const [fileuploaderror, setFileuploaderror] = useState(false);
  const [formdata, setFormdata] = useState({});
  const [updatesuccess, setUpdatesuccess] = useState(false);
  const [showlistingerror, setShowlistingerror] = useState(false);
  const [userlisting, setUserlisting] = useState([]);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (file) {
      FileUpload(file);
    }
  }, [file]);
  const FileUpload = (file) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);
    const uploadtask = uploadBytesResumable(storageRef, file);
    uploadtask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileperc(Math.round(progress));
      },
      (error) => {
        setFileuploaderror(true);
      },
      () => {
        getDownloadURL(uploadtask.snapshot.ref).then((downloadUrl) => {
          setFormdata({ ...formdata, avatar: downloadUrl });
        });
      }
    );
  };
  // firebase storage rule
  //  allow read;
  //     allow write:if
  //     request.resource.size<2*1024*1024 &&
  //     request.resource.contentType.matches('image/.*')

  const handlechange = (e) => {
    setFormdata({ ...formdata, [e.target.id]: e.target.defaultValue });
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserstart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserfailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdatesuccess(true);
    } catch (error) {
      dispatch(updateUserfailure(error));
    }
  };
  const handledeleteuser = async () => {
    try {
      dispatch(deleteUserstart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(deleteUserfailure(data));
        return;
      }
      dispatch(deleteuserSuccess(data));
    } catch (error) {}
  };
  const signoutuser = async () => {
    try {
      dispatch(SignoutUserstart());
      const res = await fetch("/api/auth/signout");
      const data = res.json();
      if (data.success == false) {
        dispatch(SignoutUserfailure(data.message));
        return;
      }
      dispatch(SignoutuserSuccess(data));
    } catch (error) {
      dispatch(SignoutUserfailure(data.message));
    }
  };
  const handlelisting = async () => {
    try {
      setShowlistingerror(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        showlistingerror(true);
        return;
      }
      setUserlisting(data);
    } catch (error) {
      setShowlistingerror(true);
    }
  };
  const handledeletelisting=async(listingId)=>{
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`,{
        method:"DELETE"
      });
      const data=await res.json();
      if(data.success==false){
        console.log(data.message);
        return
      }
      setUserlisting((prev)=>prev.filter((listing)=>listing._id !==listingId))
    } catch (error) {
      
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handlesubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileref}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          src={formdata.avatar || currentUser.avatar}
          alt="profilepic"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => fileref.current.click()}
        />
        <p className="text-sm self-center">
          {fileuploaderror ? (
            <span className="text-red-700">
              Error in file upload(image must be less than 2mb)
            </span>
          ) : fileperc > 0 && fileperc < 100 ? (
            <span className="text-slate-700">{`uploading ${fileperc}%`}</span>
          ) : fileperc === 100 ? (
            <span className="text-green-700">Image successfully uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          id="username"
          placeholder="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handlechange}
        />
        <input
          id="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handlechange}
        />
        <input
          id="password"
          placeholder="password"
          className="border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading" : "update"}
        </button>
        <Link
          to={"/createlisting"}
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          create listing
        </Link>
      </form>
      <div className="flex justify-between mt-2">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handledeleteuser}
        >
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={signoutuser}>
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-500">
        {updatesuccess ? "update successfull" : ""}
      </p>
      <button onClick={handlelisting} className="text-green-600 w-full">
        show listing
      </button>
      <p>{showlistingerror ? "error showing listing" : ""}</p>
      {userlisting &&
        userlisting.length > 0 &&
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold ">Your Listings</h1>
          {userlisting.map((listing) => (
          <div
            className="border rounded-lg p-3 flex justify-between items-center gap-4"
            key={listing._id}
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt="listing cover"
                className="h-16 w-16 object-contain"
              />
            </Link>
            <Link
              className="flex-1 text-slate-700 font-semibold hover:underline truncate"
              to={`/listing/${listing._id}`}
            >
              <p>{listing.name}</p>
            </Link>
            <div className="flex flex-col ite">
              <button onClick={()=>handledeletelisting(listing._id)} className="text-red-600">Delete</button>
              <button className="text-green-600">Edit</button>
            </div>
          </div>
        ))}
        </div>}
    </div>
  );
};
export default Profile;
