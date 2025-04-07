import React from 'react'
import {
    faComment,
  
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const IssueCard = () => {
  return (
    <div>
      
      <div className="Recent_Reports_Card h-32 bg-gray-200 mt-2 rounded-[6px] py-4 px-4  ">
          <div className="flex  justify-between">
            <div className="Status_button w-[110px] bg-green-300 h-8 rounded-[6px] ">
              <p className="flex items-center justify-center py-1.5 font-mono text-[13px] text-green-900">
                Resolved
              </p>
            </div>

            <p className="text-[13px] font-mono flex">2h ago</p>
          </div>

          <p className="font-mono font-medium text-[14px] py-1 ">
            Broken Street Light
          </p>
          <p className="font-mono text-[11px] text-gray-600 py-1">
            {" "}
            Main Street, near central park
          </p>
          <div className="flex gap-1.5 items-center py-1">
            <FontAwesomeIcon icon={faComment} className="text-gray-600" />
            <p className="font-mono text-[12px]">3 Updates</p>
          </div>
        </div>
    </div>
  )
}

export default IssueCard
