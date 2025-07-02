import React from "react";
import IssueMap from "./IssueMap";
import { Link } from "react-router-dom";
import {useState,useEffect} from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const DetailedMap = () => {

    const [position, setPosition] = useState(null);

    useEffect(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }, []);
  return (
    <div>
      <div className="container font-karla">
        <div className="header flex justify-between items-center px-6 mt-4 border-b border-gray-300 shadow-sm h-12">
          <Link to="/dashboard" className="left_awrow">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <div className="text-xl font-semibold font-mono">Map View</div>
          <div className="cancel">
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      </div>

      <IssueMap position={position} fullscreen={true} />
    </div>
  );
};

export default DetailedMap;
