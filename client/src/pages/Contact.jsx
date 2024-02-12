import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { encodeURIComponent } from "react";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  const handlemessage = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchlandload = async () => {
      try {
        console.log(listing.userRef, listing.name.toLowerCase());
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchlandload();
  }, [listing.userRef]);
  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            <span className="font-semibold">{landlord.username}</span> for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className="w-full border p-3 rounded-lg "
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={handlemessage}
            placeholder="Enter your message here..."
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
};

export default Contact;
