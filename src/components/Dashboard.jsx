import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell as faBellRegular } from "@fortawesome/free-regular-svg-icons";
import {
  faComment,
  faEllipsisH,
  faHome,
  faLightbulb,
  faMapLocation,
  faNavicon,
  faPlus,
  faRoad,
  faTrashAlt,
  faTree,
  faUser,
  faWater,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import IssueCard from "./issues/IssueCard";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useMemo } from "react";

import { getIssues } from "../redux/slices/issueSlice";

import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";

export const Dashboard = () => {
  // const [address, setAddress] = useState("");
  const dispatch = useDispatch();

  const { data: issues, loading, error } = useSelector((state) => state.issues);
  const [userLocation, setUserLocation] = useState(null);
  const [filter, setFilter] = useState("recent");
  const [locationError, setLocationError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const authState = useSelector((state) => state.auth); // Get the whole auth state
  
  // Get the current user's name from Redux state
  // Adjust 'state.auth.user.name' if your Redux state structure is different
  const userName = useSelector((state) => state.auth?.user?.name || state.auth?.user?.username || "User");
  console.log("issues:", issues);
  console.log("Current Auth State in Dashboard:", authState); // Log the auth state
  console.log("Derived userName:", userName); // Log the derived userName

  useEffect(() => {
    dispatch(getIssues());
  }, [dispatch]);

  //User location

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError(null);
      },
      (error) => {
        setLocationError(error.message);
        setUserLocation(null);
      }
    );
  }, []);

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const filteredIssues = useMemo(() => {
    if (loading || error || !issues) return [];

    if (issues.length === 0) return [];
    // 1. Start with all issues

    let processedList = [...issues];

    if (categoryFilter) {
      processedList = processedList.filter(
        (issue) => issue.category === categoryFilter
      );
    }

    switch (filter) {
      case "recent":
        processedList.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
      case "nearby":
        if (userLocation) {
          processedList = processedList
            .map((issue) => ({
              ...issue,
              distance:
                issue.location?.lat && issue.location?.lng
                  ? getDistanceFromLatLonInKm(
                      userLocation.lat,
                      userLocation.lng,
                      issue.location.lat,
                      issue.location.lng
                    )
                  : Infinity,
            }))

            .sort((a, b) => a.distance - b.distance);
        } else {
          processedList.sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          );
        }
        break;

      case "View All":
      default:
        break;
    }

    return processedList;
  }, [issues, filter, userLocation, categoryFilter]);

  return (
    <APIProvider apiKey={`${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}>
      <div>
        <div className="header w-full h-16 bg-red-400 flex justify-between">
          <div className="Logo_heading py-4 px-4">
            <h1 className="text-2xl  font-bold font-mono">CityFix</h1>
          </div>

          <div className="">
            <FontAwesomeIcon icon={faBellRegular} className="text-2xl p-5" />
          </div>
        </div>

        <div className="content mt-6 px-4">
          <h1 className="font-bold text-2xl font-mono">Welcome back, {userName}!</h1>
          <p className="text-gray-700 font-mono text-[14px] py-1.5 ">
            Help make our city better
          </p>
        </div>

        <Link to="/report">
          <div className="flex  justify-center mt-8 ">
            <button className="issue-report h-15 w-95 rounded bg-blue  flex items-center justify-center gap-3 bg-red-400 ">
              <FontAwesomeIcon icon={faPlus} className="text-white" />
              <p className="font-mono text-white">Report New Issue</p>
            </button>
          </div>
        </Link>

        <div className="Common_Issues mt-8">
          <h5 className="font-mono font-bold text-xl px-4">Common Issues</h5>

          {categoryFilter && (
            <div className="px-4 mt-2">
              <button
                onClick={() => setCategoryFilter(null)}
                className="text-xs bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded font-mono"
              >
                Clear Filter: {categoryFilter}
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 p-4">
            <div
              className={`flex flex-col items-center bg-gray-200 rounded-xl shadow p-4 cursor-pointer transition-colors ${
                categoryFilter === "Road Damage"
                  ? "bg-red-200 ring-2 ring-red-400"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setCategoryFilter("Road Damage")}
            >
              <FontAwesomeIcon icon={faRoad} className="text-black-400" />
              <p className="mt-2 text-black-700 font-medium font-mono">Road</p>
            </div>

            <div
              className={`flex flex-col items-center bg-gray-200 rounded-xl shadow p-4 cursor-pointer transition-colors ${
                categoryFilter === "Lighting"
                  ? "bg-red-200 ring-2 ring-red-400"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setCategoryFilter("Lighting")}
            >
              <FontAwesomeIcon icon={faLightbulb} className="text-yellow-400" />
              <p className="mt-2 text-black-700 font-medium font-mono">
                Lighting
              </p>
            </div>

            <div
              className={`flex flex-col items-center bg-gray-200 rounded-xl shadow p-4 cursor-pointer transition-colors ${
                categoryFilter === "Garbage"
                  ? "bg-red-200 ring-2 ring-red-400"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setCategoryFilter("Garbage")}
            >
              <FontAwesomeIcon icon={faTrashAlt} className="text-red-400" />
              <p className="mt-2 text-black-700 font-medium font-mono">
                Garbage
              </p>
            </div>

            <div
              className={`flex flex-col items-center bg-gray-200 rounded-xl shadow p-4 cursor-pointer transition-colors ${
                categoryFilter === "Parks"
                  ? "bg-red-200 ring-2 ring-red-400"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setCategoryFilter("Parks")}
            >
              <FontAwesomeIcon icon={faTree} className="text-green-400" />
              <p className="mt-2 text-black-700 font-medium font-mono">Parks</p>
            </div>

            <div
              className={`flex flex-col items-center bg-gray-200 rounded-xl shadow p-4 cursor-pointer transition-colors ${
                categoryFilter === "Water"
                  ? "bg-red-200 ring-2 ring-red-400"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setCategoryFilter("Water")}
            >
              <FontAwesomeIcon icon={faWater} className="text-blue-400" />
              <p className="mt-2 text-black-700 font-medium font-mono">Water</p>
            </div>

            <div
              className={`flex flex-col items-center bg-gray-200 rounded-xl shadow p-4 cursor-pointer transition-colors ${
                categoryFilter === "Other"
                  ? "bg-red-200 ring-2 ring-red-400"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setCategoryFilter("Other")}
            >
              <FontAwesomeIcon icon={faEllipsisH} className="text-black-400" />
              <p className="mt-2 text-black-700 font-medium font-mono">More</p>
            </div>
          </div>
        </div>

        

        <div className="Recent_Reports px-4 mt-3">
          <div className="flex justify-between">
            <h2 className="font-mono font-bold text-xl ">Recent Reports</h2>
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md pl-1 pr-6 py-1 text-sm bg-white font-mono focus:outline-none "
              >
                <option value="recent">Recent</option>
                <option value="nearby">Nearby</option>
                <option value="View All">View All</option>
              </select>
            </div>{" "}
            {/* <p className="font-mono text-[13px] font-bold">View All</p> */}
          </div>

          {loading && <p className="text-center mt-4 text-gray-600 ">Loading reports...</p>}
          {error && <p className="text-center mt-4 text-gray-600 ">Error loading reports.</p>}
{
  !loading && !error && filteredIssues.length ===0 &&(
    <p className="font-mono text-gray-400 text-center mt-5">No reports found.</p>
  )
}
          {/* Recent_Report_cards */}

          <div className="issues-list">
            <div className="issues-list">
              {filteredIssues.map((issue) => (
                <Link to={`/issue/${issue.id}`}>
                  <IssueCard key={issue.id} issue={issue} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 right-0 left-0 border-t shadow-sm border-gray-200 h-16 bg-white py-2">
          <div className="flex justify-around">
            <div className="flex-col justify-center items-center text-center">
              <FontAwesomeIcon icon={faHome} className="text-[16px]" />
              <p className="font-mono text-[12px]">Home</p>
            </div>

            <Link to="/Map">
              <div className="flex-col justify-center items-center text-center">
                <FontAwesomeIcon icon={faMapLocation} className="text-[16px]" />

                <p className="font-mono text-[12px]">Maps</p>
              </div>
            </Link>

            <div className="flex-col justify-center items-center text-center">
              <FontAwesomeIcon icon={faNavicon} className="text-[16px]" />
              <p className="font-mono text-[12px]">Reports</p>
            </div>

            <Link to="/profile">
              <div className="flex-col justify-center items-center text-center">
                <FontAwesomeIcon icon={faUser} className="text-[16px]" />
                <p className="font-mono text-[12px]">Profile</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </APIProvider>
  );
};
