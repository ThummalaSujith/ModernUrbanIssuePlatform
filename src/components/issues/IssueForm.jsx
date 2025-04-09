import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import IssueMap from "../map/IssueMap";
import { postIssue } from "../../services/issueService";
import { Link } from "react-router-dom";
import { getCurrentUser ,fetchAuthSession } from 'aws-amplify/auth';
import {
  faCamera,
  faImages,
  faFolderOpen,
  faTimes,
  faFolder,
  faChevronRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const IssueForm = () => {
  const [position, setPosition] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    image: null,
    imagePreview: null,
    location: null,
  });


  const [base64Image, setBase64Image] = useState("");

  const removeImage = () => {
    // Revoke the object URL to prevent memory leaks
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }

    // Clear the image from state
    setFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
    }));
  };

  const handleImageCapture = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file (JPEG, PNG, etc.)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("Image size should be less than 5MB");
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      console.log("Captured image:", previewUrl);

      setFormData((prev) => ({
        ...prev,
        image: file, // Store the actual File object
        imagePreview: previewUrl, // Store the preview URL
      }));

      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onloadend = () => {
        setBase64Image(reader.result.split(",")[1]);
      };

      reader.onerror = (error) => {
        console.log("Error reading file", error);
      };

      setShowOptions(false);
      e.target.value = "";
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (position) {
      console.log("Form submitted with location:", position);
    } else {
      console.log("Form submitted without location");
    }

    if (
      !formData.category ||
      !formData.description ||
      !formData.image ||
      !formData.location
    ) {
      alert("Please complete all fields before submitting.");
      return;
    }

    console.log("Submitting:", formData);

    try {
      const { username } = await getCurrentUser();
      const userInfo = await fetchAuthSession();


      const { tokens } = await fetchAuthSession();
      console.log("ID Token payload:", tokens.idToken?.payload);
      



      const preferredUsername = userInfo.tokens?.idToken?.payload?.['cognito:username'];
      const imageType = formData.image.type.split("/")[1];

      const payload = {
        category: formData.category,
        description: formData.description,
        location: formData.location,
        imageBase64: base64Image,
        imageType: imageType,
        submittedBy: preferredUsername || username
      };

      const response = await postIssue(payload);

      // 🧹 Clear form after success
      setFormData({
        category: "",
        description: "",
        image: null,
        location: null,
        imagePreview: null,
      });

      setBase64Image("");

      const clearFileInput = (id) => {
        const input = document.getElementById(id);
        if (input) input.value = "";
      };

      clearFileInput("camera-input");
      clearFileInput("gallery-input");
      clearFileInput("file-input");

      console.log("Server Response:", response);
    } catch (error) {
      console.error("submission failed", error.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="container font-karla">
      <div className="header flex justify-between items-center mb-4 px-6 mt-4 border-b border-gray-300 shadow-sm h-12">
        <Link to="/dashboard" className="left_awrow">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        <div className="text-xl font-semibold font-mono">Report Issue</div>
        <div className="cancel">
          <FontAwesomeIcon icon={faTimes} />
        </div>
      </div>

      {/* Image Upload Section */}

      <div
        className="Image-uploader  relative flex flex-col rounded items-center justify-center mt-10 border-2 border-dotted border-gray-500 p-4 sm:w-3 h-35 mx-4 overflow-hidden"
        onClick={() => !formData.imagePreview && setShowOptions(true)}
      >
        {/* <input
          type="file"
          accept="image/*"
          className="hidden"
          id="imageUpload"
          onChange={handleImageUpload}
        /> */}

        {formData.imagePreview ? (
          // Show image preview if image exists
          <div className="relative w-full h-full">
            <img
              src={formData.imagePreview}
              alt="Preview"
              className="w-full h-full object-contain bg-gray-100 "
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
            >
              {" "}
              <FontAwesomeIcon
                icon={faTimes}
                className="text-red-500 absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
              />
            </button>
          </div>
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
            <div className="camera-text font-mono text-sm">
              {" "}
              {formData.image
                ? "Image selected"
                : "Take a photo or upload from gallery"}
            </div>
          </label>
        )}
      </div>

      {/* Upload options popups */}

      {showOptions && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" />

          <div className="fixed bottom-0 left-0 right-0 bg-white z-[51] h-70 rounded-2xl">
            <div className="heading flex items-center justify-between p-4">
              <h2 className="font-medium font-mono">Choose Upload Option </h2>
              <FontAwesomeIcon
                icon={faTimes}
                className="text-gray-700"
                onClick={() => setShowOptions(false)}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="camera-input">
                <div className=" flex items-center bg-gray-200  mx-3 rounded">
                  <FontAwesomeIcon
                    icon={faCamera}
                    className=" p-4 text-blue-400 "
                    size="lg"
                  />

                  <p className="flex justify-center font-mono">Take Picture</p>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="text-gray-500 ml-auto px-4"
                  />

                  <input
                    type="file"
                    id="camera-input"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageCapture}
                    className="hidden"
                  />
                </div>
              </label>

              <label
                htmlFor="gallery-input"
                className=" flex items-center bg-gray-200  mx-3 rounded mt-3"
              >
                <FontAwesomeIcon
                  icon={faImages}
                  className=" p-4 text-green-400"
                  size="lg"
                />

                <input
                  type="file"
                  id="gallery-input"
                  accept="image/*"
                  onChange={handleImageCapture}
                  className="hidden"
                />
                <p className="flex justify-center font-mono ">
                  Choose from Gallery
                </p>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-gray-500 ml-auto px-4"
                />
              </label>

              <label
                htmlFor="file-input"
                className=" flex items-center bg-gray-200  mx-3 rounded mt-3"
              >
                <FontAwesomeIcon
                  icon={faFolder}
                  className=" p-4 text-yellow-400 "
                  size="lg"
                />

                <input
                  type="file"
                  id="file-input"
                  accept="image/*"
                  onChange={handleImageCapture}
                  className="hidden"
                />

                <p className="flex justify-center font-mono">
                  Select from Files
                </p>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-gray-500 ml-auto px-4"
                />
              </label>
            </div>
          </div>
        </>
      )}

      {/* Category Section */}

      <div className="category px-4 mt-4">
        <p className="block text-sm font-bold text-gray-700 font-mono">
          Category
        </p>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className=" mt-2 block w-full border border-gray-300 rounded-md bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none  focus:ring-indigo-500 sm:text-sm"
        >
          <option value="" className="font-mono">
            Select a Category
          </option>
          <option value="Road Damage " className="font-mono">
            Road Damage
          </option>
          <option value="Lighting" className="font-mono">
            Lighting
          </option>
          <option value="Garbage" className="font-mono">
            Grabage
          </option>
          <option value="Parks" className="font-mono">
            Parks
          </option>
          <option value="Water" className="font-mono">
            Water
          </option>
          <option value="Other" className="font-mono">
            Other
          </option>
        </select>
      </div>

      {/* Location Section */}

      <div className="location px-4 mt-4">
        <div className="map  h-45 bg-gray-400 rounded-[9px] font-mono mt-2">
          <IssueMap position={position} />
        </div>
        <div className="flex items-center space-x-2 font-mono  mt-3">
          <div
            className="cursor-pointer flex space-x-1.5 font-mono mt-[42px]"
            onClick={handleGetLocation}
          >
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-700 " />
            <p className="block text-sm font-medium text-gray-700 font-mono">
              Use current location
            </p>
          </div>
        </div>
      </div>

      <div className="description px-4 mt-4">
        <p className="block text-sm font-bold text-gray-700 font-mono ">
          Description
        </p>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="mt-2 bloxk w-full  px-3 py-2 border border-gray-300 rounded h-40 placeholder:font-mono "
          placeholder="Describe the issue in detail..."
        />
      </div>

      <div className="flex justify-center w-full mt-4 font-mono">
        <button
          className="text-2xl bg-black text-white py-3 rounded-[9px] px-20  font-mono "
          onClick={handleSubmit}
        >
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </button>
      </div>
    </div>
  );
};

export default IssueForm;
