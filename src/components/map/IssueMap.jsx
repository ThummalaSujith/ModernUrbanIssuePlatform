import React from "react";

import { useEffect } from "react";

import {APIProvider,Map,AdvancedMarker,Pin} from "@vis.gl/react-google-maps"
const IssueMap = ({position}) => {


 

  return (
<APIProvider apiKey={`${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}>

<div style={{height:"21vh"}}>
  <Map   zoom={15} center={position} gestureHandling={"greedy"} disableDefaultUI={false}  fullscreenControl={true} style={{ width: "100%", height: "100%" }}></Map>
</div>
</APIProvider>
    
  )
};

export default IssueMap;
