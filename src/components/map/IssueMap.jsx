import React, { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useSelector } from "react-redux";

const IssueMap = ({ position = { lat: 0, lng: 0 }, fullscreen = false }) => {
  const issues = useSelector((state) => state.issues?.data || []);
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Debugging logs
  console.log("Redux issues state:", useSelector((state) => state.issues));
  console.log("Issues array to render:", issues);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div style={{ 
        height: fullscreen ? "100vh" : "400px",
        width: "100%",
      }}>
        <Map
          zoom={15}
          center={position}
          gestureHandling={"auto"}
          disableDefaultUI={false}
          fullscreenControl={true}
          style={{ width: "100%", height: "100%" }}
          mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
          onClick={() => setSelectedIssue(null)} // Close popup when clicking map
        >
          {/* Current location marker */}
          <AdvancedMarker position={position}>
            <Pin background={"#4285F4"} borderColor={"#1a73e8"} scale={0.9} />
          </AdvancedMarker>

          {/* Issue markers with popups */}
          {Array.isArray(issues) && issues.map((issue) => {
            if (!issue?.location?.lat || !issue?.location?.lng) {
              return null;
            }

            return (
              <React.Fragment key={issue.id || issue._id || `marker-${Math.random()}`}>
                <AdvancedMarker
                  position={{
                    lat: issue.location.lat,
                    lng: issue.location.lng,
                  }}
                  onClick={() => setSelectedIssue(issue)}
                >
                  <Pin
                    background={"#EA4335"}
                    borderColor={"#B31412"}
                    glyphColor={"#FFFFFF"}
                    scale={1}
                  />
                </AdvancedMarker>

                {/* Popup card for selected issue */}
                {selectedIssue?.id === issue.id && (
                  <InfoWindow
                    position={{
                      lat: issue.location.lat,
                      lng: issue.location.lng,
                    }}
                    onCloseClick={() => setSelectedIssue(null)}
                  >
                    <div style={{
                      padding: '12px',
                      minWidth: '200px',
                      maxWidth: '300px'
                    }}>
                      <h3 style={{ marginTop: 0 }}>{issue.title || 'Issue'}</h3>
                      <p><strong>ID:</strong> {issue.id}</p>
                      {issue.description && <p>{issue.description}</p>}
                      <p>
                        <strong>Location:</strong><br />
                        Lat: {issue.location.lat.toFixed(6)}<br />
                        Lng: {issue.location.lng.toFixed(6)}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </React.Fragment>
            );
          })}
        </Map>
      </div>
    </APIProvider>
  );
};

export default IssueMap;