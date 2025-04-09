import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLocation, faLocationArrow, faLocationPin, faLocationPinLock, faMapLocation, faMapMarker, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import IssueMap from "../map/IssueMap";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { formatTimeAgo } from "../../Hooks/useTime";
import useCurrentLocation from "../../Hooks/useCurrentLocation";
import { useReverseGeocode } from "../../Hooks/useReverseGeocode";


const IssueDetails = () => {
  const { id } = useParams();

  console.log(id);
  const issues = useSelector((state) => state.issues.data);
  console.log(issues);

  const selectedIssue = issues.find((issue) => {
    return issue.id === id;
  });

  console.log(selectedIssue);

  const { location } = useCurrentLocation();


const address = useReverseGeocode(selectedIssue.location?.lat,selectedIssue.location?.lng)

const formatAddress = (fullAddress) => {
  if (!fullAddress) return null;
  
  // For one-line output, just return the original
  return {
    line1: fullAddress,
    line2: null,
    full: fullAddress // Add this new property
  };
};

const formattedAddress = formatAddress(address);


  return (
    <div>
      <div className="header flex justify-between items-center  px-6 mt-4 border-b border-gray-300 shadow-sm h-12">
        <Link to="/dashboard" className="left_awrow">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>

        <div className="cancel">
          <FontAwesomeIcon icon={faTimes} />
        </div>
      </div>

      <div className="map w-full  ">
        {location && <IssueMap zoom={15} position={location} />}
      </div>

      <div className="Details px-4">
        <h2 className="font-mono font-bold  mt-4 ">
          {selectedIssue.category} Issue
        </h2>
        <p className="font-mono text-gray-500 font-medium text-[13px]">
          Posted by {} <span className="font-bold text-xl px-1">.</span>{formatTimeAgo(selectedIssue.createdAt)}
        </p>
        <h4 className="font-mono font-medium text-[15px] mt-1">{selectedIssue.description}</h4>
        <div className='flex items-center gap-2 text-gray-500 text-[14px] mt-0.5'>
          <FontAwesomeIcon icon={faLocationArrow}/>
          <p className="text-gray-500 text-[14px]">{formattedAddress?.line1}</p>
        </div>
      </div>



    </div>
  );
};

export default IssueDetails;
