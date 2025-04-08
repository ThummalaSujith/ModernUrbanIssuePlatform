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

import { getIssues } from "../redux/slices/issueSlice";

import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";



export const Dashboard = () => {
  // const [address, setAddress] = useState("");
  const dispatch = useDispatch();

  const { data: issues, loading, error } = useSelector((state) => state.issues);

  console.log("issues:", issues);

  useEffect(() => {
    dispatch(getIssues());
  }, [dispatch]);

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
        <h1 className="font-bold text-2xl font-mono">Welcome back, Sarah!</h1>
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

        <div className="grid grid-cols-3 gap-4 p-4">
          <div className="flex flex-col items-center bg-gray-200 rounded-xl shadow p-4">
            <FontAwesomeIcon icon={faRoad} className="text-black-400" />
            <p className="mt-2 text-black-700 font-medium font-mono">Roads</p>
          </div>

          <div className="flex flex-col items-center bg-gray-200 rounded-xl shadow p-4">
            <FontAwesomeIcon icon={faLightbulb} className="text-yellow-400" />
            <p className="mt-2 text-black-700 font-medium font-mono">
              Lighting
            </p>
          </div>

          <div className="flex flex-col items-center bg-gray-200 rounded-xl shadow p-4">
            <FontAwesomeIcon icon={faTrashAlt} className="text-red-400" />
            <p className="mt-2 text-black-700 font-medium font-mono">Garbage</p>
          </div>

          <div className="flex flex-col items-center bg-gray-200 rounded-xl shadow p-4">
            <FontAwesomeIcon icon={faTree} className="text-green-400" />
            <p className="mt-2 text-black-700 font-medium font-mono">Parks</p>
          </div>

          <div className="flex flex-col items-center bg-gray-200 rounded-xl shadow p-4">
            <FontAwesomeIcon icon={faWater} className="text-blue-400" />
            <p className="mt-2 text-black-700 font-medium font-mono">Water</p>
          </div>

          <div className="flex flex-col items-center bg-gray-200 rounded-xl shadow p-4">
            <FontAwesomeIcon icon={faEllipsisH} className="text-black-400" />
            <p className="mt-2 text-black-700 font-medium font-mono">More</p>
          </div>
        </div>
      </div>

      <div className="Recent_Reports px-4 mt-3">
        <div className="flex justify-between">
          <h2 className="font-mono font-bold text-xl ">Recent Reports</h2>

          <p className="font-mono text-[13px] font-bold">View All</p>
        </div>

        {/* Recent_Report_cards */}

        <div className="issues-list">

        <div className="issues-list">
  {issues.map((issue) => (
    <IssueCard key={issue.id} issue={issue} />
  ))}
</div>
        </div>
      </div>

      <div className="fixed bottom-0 right-0 left-0 border-t shadow-sm border-gray-200 h-16 bg-white">
        <div className="flex justify-around">
          <div className="flex-col justify-center items-center text-center">
            <FontAwesomeIcon icon={faHome} className="text-[16px]" />
            <p className="font-mono text-[12px]">Home</p>
          </div>

          <div className="flex-col justify-center items-center text-center">
            <FontAwesomeIcon icon={faMapLocation} className="text-[16px]" />
            <p className="font-mono text-[12px]">Maps</p>
          </div>

          <div className="flex-col justify-center items-center text-center">
            <FontAwesomeIcon icon={faNavicon} className="text-[16px]" />
            <p className="font-mono text-[12px]">Reports</p>
          </div>

          <div className="flex-col justify-center items-center text-center">
            <FontAwesomeIcon icon={faUser} className="text-[16px]" />
            <p className="font-mono text-[12px]">Profile</p>
          </div>
        </div>
      </div>
    </div>
    </APIProvider>
  );
};
