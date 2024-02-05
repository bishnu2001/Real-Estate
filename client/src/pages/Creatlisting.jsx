import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React from "react";
import { useState } from "react";
import { app } from "../firebase";

const Creatlisting = () => {
  const [files, setFiles] = useState([]);
  const [formdata, setFormdata] = useState({
    imageUrl: [],
  });
  const [imageuploaderror, setImageuploaderror] = useState(false);
  const[uploading,setUploading]=useState(false)
  const handlesubmitimage = (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length + formdata.imageUrl.length < 7) {
        setUploading(true)
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeimage(files[i]));
      }
      Promise.all(promises)
        .then((url) => {
          setFormdata({ ...formdata, imageUrl: formdata.imageUrl.concat(url) });
          setImageuploaderror(false);
          setUploading(false)
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
      imageUrl: formdata.imageUrl.filter((_, i) => i !== index)
    });
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-2">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parkingspot" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
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
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularprice"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ /month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discount"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">($ /month)</span>
              </div>
            </div>
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
                {uploading?"uploading...":"upload"}
            </button>
          </div>
          <p className="text-red-500 text-sm">
            {imageuploaderror && imageuploaderror}
          </p>
          {formdata.imageUrl.length > 0 &&
            formdata.imageUrl.map((url, index) => (
              <div
                key={url}
                className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75 flex justify-between"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button type="button" onClick={()=>handleremoveimage(index)}>
                  Delete
                </button>
              </div>
            ))}
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            create listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default Creatlisting;
