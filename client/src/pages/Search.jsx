import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Listingitem from "./Listingitem";

const Search = () => {
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);
  useEffect(() => {
    const urlparams = new URLSearchParams(location.search);
    const searchtermformurl = urlparams.get("searchTerm");
    const typeformurl = urlparams.get("type");
    const parkingformurl = urlparams.get("parking");
    const furnishedformurl = urlparams.get("furnished");
    const offerformurl = urlparams.get("offer");
    const sortformurl = urlparams.get("sort");
    const orderformurl = urlparams.get("order");

    if (
      searchtermformurl ||
      typeformurl ||
      parkingformurl ||
      furnishedformurl ||
      offerformurl ||
      sortformurl ||
      orderformurl
    ) {
      setSidebardata({
        searchTerm: searchtermformurl || "",
        type: typeformurl || "all",
        parking: parkingformurl === "true" ? true : false,
        furnished: furnishedformurl === "true" ? true : false,
        offer: offerformurl === "true" ? true : false,
        sort: sortformurl || "created_at",
        order: orderformurl || "desc",
      });
    }

    const fetchlistings=async()=>{
      setLoading(true);
      setShowMore(false);
      const searchquery=urlparams.toString();
      const res=await fetch(`/api/listing/get?${searchquery}`)
      const data=await res.json();
      if(data.length>8){
        setShowMore(true)
      }else{
        setShowMore(false)
      }
      setListings(data);
      setLoading(false)
    }
    fetchlistings();

  },[location.search]);
  const navigate = useNavigate();
  const handlechange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebardata({ ...sidebardata, sort, order });
    }
  };
  const handlesubmit = (e) => {
    e.preventDefault();
    const urlparams = new URLSearchParams();
    urlparams.set("searchTerm", sidebardata.searchTerm);
    urlparams.set("type", sidebardata.type);
    urlparams.set("parking", sidebardata.parking);
    urlparams.set("furnished", sidebardata.furnished);
    urlparams.set("offer", sidebardata.offer);
    urlparams.set("sort", sidebardata.sort);
    urlparams.set("order", sidebardata.order);
    const searchquery = urlparams.toString();
    navigate(`/search?${searchquery}`);
  };
  const onShowmoreclick=async()=>{
      const numberoflistings=listings.length;
      const startindex=numberoflistings;
      const urlparams=new URLSearchParams(location.search);
      urlparams.set("startindex", startindex);
      const searchquery=urlparams.toString();
      const res=await fetch(`/api/listing/get?${searchquery}`);
      const data=await res.json();
      if(data.length <9){
        setShowMore(false);
      }
      setListings([...listings,...data])
  }
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8" onSubmit={handlesubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="search..."
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handlechange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                checked={sidebardata.type === "all"}
                onChange={handlechange}
              />
              <span>Rent & sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handlechange}
                checked={sidebardata.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handlechange}
                checked={sidebardata.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handlechange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handlechange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handlechange}
                checked={sidebardata.furnished}
              />
              <span>furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              className="border rounded-lg p-3"
              id="sort_order"
              onChange={handlechange}
              defaultValue={"created_at_desc"}
            >
              <option value="regularprice_desc">Price high to low</option>
              <option value="regularprice_asc">Price low to high</option>
              <option value="createdat_desc">Latest</option>
              <option value="regularprice_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length == 0 && (
            <p className="text-xl text-slate-700">No listing found</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => <Listingitem key={listing._id} listing={listing} />)}
            {showMore && (
              <button onClick={onShowmoreclick} className="text-green-700 hover:underline p-7 text-center w-full" >Show more</button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Search;
