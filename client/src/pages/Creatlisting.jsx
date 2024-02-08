import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React from "react";
import { useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Creatlisting = () => {
  const [files, setFiles] = useState([]);
  const [formdata, setFormdata] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    regularPrice: 50,
    discountPrice: 50,
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    type: "rent",
    offer: false,
  });
  console.log(formdata);
  const [imageuploaderror, setImageuploaderror] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate=useNavigate();
  const handlesubmitimage = (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length + formdata.imageUrls.length < 7) {
      setUploading(true);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeimage(files[i]));
      }
      Promise.all(promises)
        .then((url) => {
          setFormdata({
            ...formdata,
            imageUrls: formdata.imageUrls.concat(url),
          });
          setImageuploaderror(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageuploaderror("Image upload failed (2mb per image)");
          setUploading(false);
        });
    } else {
      setImageuploaderror("you can upload 6 images per listing");
    }
  };
  const storeimage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const filename = new Date().getTime() + file.name;
      const storageref = ref(storage, filename);
      const uploadtask = uploadBytesResumable(storageref, file);
      uploadtask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },

        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadtask.snapshot.ref).then((downloadurl) => {
            resolve(downloadurl);
          });
        }
      );
    });
  };
  const handleremoveimage = (index) => {
    setFormdata({
      ...formdata,
      imageUrls: formdata.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handlechange = (e) => {
    if (e.target.id == "sale" || e.target.id == "rent") {
      setFormdata({
        ...formdata,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parkingspot" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormdata({
        ...formdata,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormdata({
        ...formdata,
        [e.target.id]: e.target.value,
      });
    }
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      if (formdata.imageUrls.length < 1)
        return setError("you must upload at least one image");
      if (+formdata.regularPrice < +formdata.discountPrice)
        return setError("Discout price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formdata, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);
      console.log(data);
      navigate(`/listing/${data.listing._id}`)
    } catch (error) {
      setError(error);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handlesubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handlechange}
            value={formdata.name}
          />
          <textarea
            type="textarea"
            //if error replace text area with text
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handlechange}
            value={formdata.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handlechange}
            value={formdata.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handlechange}
                checked={formdata.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handlechange}
                checked={formdata.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parkingspot"
                className="w-5"
                onChange={handlechange}
                checked={formdata.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handlechange}
                checked={formdata.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handlechange}
                checked={formdata.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handlechange}
                value={formdata.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handlechange}
                value={formdata.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularprice"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handlechange}
                value={formdata.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ /month)</span>
              </div>
            </div>
            {formdata.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handlechange}
                  value={formdata.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  <span className="text-xs">($ /month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              accept="image/*"
              id="images"
              multiple
              className="p-3 border border-gray-300 rounded w-full "
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              className="p-3 text-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              onClick={handlesubmitimage}
            >
              {uploading ? "uploading..." : "upload"}
            </button>
          </div>
          <p className="text-red-500 text-sm">
            {imageuploaderror && imageuploaderror}
          </p>
          {formdata.imageUrls.length > 0 &&
            formdata.imageUrls.map((url, index) => (
              <div
                key={url}
                className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75 flex justify-between"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button type="button" onClick={() => handleremoveimage(index)}>
                  Delete
                </button>
              </div>
            ))}
          <button disabled={loading || uploading} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? "Creating..." : "Create listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default Creatlisting;
