import React from "react";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useReverseGeocode } from "../../Hooks/useReverseGeocode";


const IssueCard = ({issue}) => {
    const address = useReverseGeocode(issue.location?.lat,issue.location?.lng)


    // Time formatting function
    const formatTimeAgo = (isoString) => {
        const now = new Date();
        const past = new Date(isoString);
        const seconds = Math.floor((now - past) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
            }
        }

        return 'Just now';
    };



    const formatAddress = (fullAddress) => {
        if (!fullAddress) return null;
        
        // Split at the last comma before the zip code
        const parts = fullAddress.split(', ');
        if (parts.length < 3) return {
          line1: fullAddress,
          line2: ''
        };
        
        // First line: street address
        const line1 = parts.slice(0, -2).join(', ');
        // Second line: city, state and zip
        const line2 = parts.slice(-2).join(', ');
        
        return { line1, line2 };
      };
    
      const formattedAddress = formatAddress(address);
      
  return (
    <div>
      <div className="Recent_Reports_Card h-32 bg-gray-200 mt-2 rounded-[6px] py-4 px-4  ">
        <div className="flex  justify-between">
          <div className="Status_button w-[110px] bg-green-300 h-8 rounded-[6px] ">
            <p className="flex items-center justify-center py-1.5 font-mono text-[13px] text-green-900">
              Resolved
            </p>
          </div>

          <p className="text-[13px] font-mono flex">
                    {formatTimeAgo(issue.createdAt)}
                </p>
        </div>

        <div className="font-mono text-[11px] text-gray-600 py-2">
          <p>{formattedAddress?.line1}</p>
          <p>{formattedAddress?.line2}</p>
        </div>

        <div className="flex gap-1.5 items-center py-1">
          <FontAwesomeIcon icon={faComment} className="text-gray-600" />
          <p className="font-mono text-[12px]">3 Updates</p>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
