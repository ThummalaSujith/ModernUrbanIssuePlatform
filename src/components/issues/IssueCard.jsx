import React from "react";
import { 
    faComment, 
    faMapMarkerAlt,
    faRoad,
    faLightbulb,
    faTrashAlt,
    faTree,
    faWater,
    faEllipsisH,
    faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useReverseGeocode } from "../../Hooks/useReverseGeocode";

const IssueCard = ({issue}) => {
    // Ensure issue and issue.location are defined before trying to access lat/lng
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

      const categoryIcons = {
        "Road Damage": faRoad,
        "Lighting": faLightbulb,
        "Garbage": faTrashAlt,
        "Parks": faTree,
        "Water": faWater,
        "Other": faEllipsisH,
        "default": faQuestionCircle
      };

      const statusStyles = {
        Open: { bg: "bg-red-100", text: "text-red-700", label: "Open" },
        "In Progress": { bg: "bg-yellow-100", text: "text-yellow-700", label: "In Progress" },
        Resolved: { bg: "bg-green-100", text: "text-green-700", label: "Resolved" },
        default: { bg: "bg-gray-100", text: "text-gray-700", label: "Unknown" },
      };

      // Assuming issue.status exists. Fallback to "Resolved" if not.
      const currentStatusKey = issue.status && statusStyles[issue.status] ? issue.status : "Resolved";
      const statusStyle = statusStyles[currentStatusKey];

      const issueCategory = issue.category || "Other";
      const categoryIcon = categoryIcons[issueCategory] || categoryIcons.default;

      // Assuming issue.updates is an array. Fallback if not.
      const updatesCount = Array.isArray(issue.updates) ? issue.updates.length : 0;
      
  return (
    <div className="bg-white mt-3 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 ease-in-out">
        {/* Top Section: Category Icon, Title, Status */}
        <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
                <FontAwesomeIcon icon={categoryIcon} className={`text-xl mr-3 ${statusStyle.text}`} /> {/* Use status color for icon too, or a neutral one */}
                <h3 className="text-md font-semibold font-mono text-gray-800 truncate" title={issue.title || issueCategory}>
                    {issue.title || issueCategory}
                </h3>
            </div>
            <span className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                {statusStyle.label}
            </span>
        </div>

        {/* Description (Optional - if you want to show a snippet) */}
        {issue.description && (
            <p className="text-xs text-gray-600 font-mono mb-2 line-clamp-2">
                {issue.description}
            </p>
        )}

        {/* Middle Section: Address */}
        {formattedAddress && (
            <div className="mb-3">
                <div className="flex items-center text-xs text-gray-500 font-mono">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                    <span>{formattedAddress.line1}</span>
                </div>
                {formattedAddress.line2 && (
                    <p className="ml-5 text-xs text-gray-500 font-mono">{formattedAddress.line2}</p>
                )}
            </div>
        )}

        {/* Bottom Section: Updates and Time Ago */}
        <div className="flex justify-between items-center text-xs text-gray-500 font-mono">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faComment} className="mr-1.5" />
            <span>{updatesCount} Update{updatesCount !== 1 ? 's' : ''}</span>
          </div>
          <span>
            {formatTimeAgo(issue.createdAt)}
          </span>
        </div>
      </div>
  );
};

export default IssueCard;
