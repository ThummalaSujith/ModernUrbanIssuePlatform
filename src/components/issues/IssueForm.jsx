import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import IssueMap from "../map/IssueMap";
import {
  faCamera,
  faImages,
  faFolderOpen,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const IssueForm = () => {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    image: null,
    imagePreview: null,
    location: null,
  });
  const [position, setPosition] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPosition(coords);
        setFormData((prev) => ({
          ...prev,
          location: coords,
        }));
      },

      (err) => {
        setLocationError("Unable to retrieve your location: " + err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (position) {
      console.log("Form submitted with location:", position);
    } else {
      console.log("Form submitted without location");
    }
  };

  const handleImageUpload = (e) => {};

  return (
    <div className="container font-karla">
      <div className="header flex justify-between items-center mb-4 px-10 mt-4">
        <div className="left_awrow">y</div>
        <div className="text-xl font-semibold">Report Issue</div>
        <div className="cancel">x</div>
      </div>

      {/* Image Upload Section */}

      <div
        className="Image-uploader flex flex-col rounded items-center justify-center mt-10 border-2 border-dotted border-gray-500 p-4 sm:w-3 h-35 mx-4 "
        onClick={() => !formData.imagePreview && setShowOptions(true)}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="imageUpload"
          onChange={handleImageUpload}
        />

        {formData.imagePreview ? (
          // Show image preview if image exists
          <>
            <img src={formData.imagePreview} alt="Preview" />
            <button onClick={removeImage}> <FontAwesomeIcon icon={faTimes} className="text-red-500" /></button>
          </>
        ) : (
          // Show upload prompt if no image

          <label
            htmlFor="imageUpload"
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="camera-icon mb-3">
              <FontAwesomeIcon
                icon={faCamera}
                className="text-gray-700 text-2xl"
              />
            </div>
            <div className="camera-text ">
              {" "}
              {formData.image
                ? "Image selected"
                : "Take a photo or upload from gallery"}
            </div>
          </label>
        )}
      </div>

      {/* Upload options popup */}

      {

showOptions && (
  <div 
    className="fixed inset-0 bg-black/40 z-50"
    onClick={() => setShowOptions(false)}
  />
)
      }

      {/* Category Section */}

      <div className="category px-4 mt-4">
        <p className="block text-sm font-medium text-gray-700">Category</p>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className=" mt-2 block w-full border border-gray-300 rounded-md bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none  focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a Category</option>
          <option value="Road Damage">Road Damage</option>
          <option value="Traffic light Problem">Traffic light Problem</option>
          <option value="Other Issue">Other Issue</option>
        </select>
      </div>

      {/* Location Section */}

      <div className="location px-4 mt-4">
        <p className="block text-sm font-medium text-gray-700 ">Location</p>
        <div className="map  h-45 bg-gray-400 rounded-[9px]  mt-2">
          <IssueMap position={position} />
        </div>
        <div className="flex items-center space-x-2  mt-3">
          <div
            className="cursor-pointer flex space-x-1.5"
            onClick={handleGetLocation}
          >
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-700" />
            <p className="block text-sm font-medium text-gray-700">
              Use current location
            </p>
          </div>
        </div>
      </div>

      <div className="description px-4 mt-4">
        <p className="block text-sm font-medium text-gray-700 ">Description</p>
        <textarea
          className="mt-2 bloxk w-full  px-3 py-2 border border-gray-300 rounded h-40 "
          placeholder="Describe the issue in detail..."
        />
      </div>

      <div className="flex justify-center w-full mt-4">
        <button
          className="text-2xl bg-black text-white py-3 rounded-[9px] px-20   "
          onClick={handleSubmit}
        >
          Submit Report
        </button>
      </div>
    </div>
  );
};

export default IssueForm;
