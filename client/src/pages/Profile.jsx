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
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

const Profile = () => {
  const fileref = useRef(null);
  const [file, setFile] = useState(undefined);
  const [fileperc, setFileperc] = useState(0);
  const [fileuploaderror, setFileuploaderror] = useState(false);
  const [formdata, setFormdata] = useState({});
  const [updatesuccess, setUpdatesuccess] = useState(false);
  const { currentUser,loading,error } = useSelector((state) => state.user);
  const dispatch=useDispatch();
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
      setUpdatesuccess(true)
    } catch (error) {
      dispatch(updateUserfailure(error));
    }
  };
const handledeleteuser=async()=>{
try {
  dispatch(deleteUserstart());
  const res = await fetch(`/api/user/delete/${currentUser._id}`,{
    method:"DELETE"
  });
  const data=await res.json();
  if(data.success==false){
    dispatch(deleteUserfailure(data));
    return;
  }
  dispatch(deleteuserSuccess(data))
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
      </form>
      <div className="flex justify-between mt-2">
        <span className="text-red-700 cursor-pointer" onClick={handledeleteuser} >Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
    </div>
  );
};
export default Profile;
