import React from "react";
import {
  APIProvider,
  Map,

  AdvancedMarker,
  Pin
} from "@vis.gl/react-google-maps";

const IssueMap = ({ position, fullscreen = false }) => {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div style={{ height: fullscreen ? "100vh" : "21vh", width: "100%" }}>
        <Map
          zoom={15}
          center={position}
          gestureHandling={"auto"}
          disableDefaultUI={false}
          fullscreenControl={true}
          style={{ width: "100%", height: "100%" }}
          mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
        >
           
  
        </Map>
      </div>
    </APIProvider>
  );
};

export default IssueMap;
