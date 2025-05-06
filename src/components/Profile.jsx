import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useSelector } from "react-redux";

import React, { useState, useEffect } from "react";

import { fetchAuthSession, getCurrentUser } from "@aws-amplify/auth";
import { faArrowLeft,faHome,faUser,faMapLocation,faNavicon } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import IssueCard from "./issues/IssueCard";

const Profile = () => {
  const { data: issues } = useSelector((state) => state.issues);

  const [currentUser, setCurrentUser] = useState({
    displayName: null,
    identifier: null,
  });

  const [userStats, setUserStats] = useState({
    reportCount: 0,
    firstReportDate: null,
  });

  const [userIssuesList, setUserIssuesList] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = await fetchAuthSession();
        const preferredUsername =
          session.tokens?.idToken?.payload?.preferred_username;

        const identifier =
          session.tokens?.idToken?.payload?.["cognito:username"];

        // Fallback to basic username if needed
        const { username } = await getCurrentUser();

        setCurrentUser({
          displayName: preferredUsername || username,

          identifier: identifier || username,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setCurrentUser({ displayName: "Error", identifier: null });
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (currentUser?.identifier && issues.length > 0) {
      const userIssues = issues.filter(
        (issue) => issue.submittedBy === currentUser.identifier
      );
      const reportCount = userIssues.length;
      let firstReportDate = null;

      if (reportCount > 0) {
        userIssues.sort(
          (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        );
        firstReportDate = userIssues[0].createdAt;
      }
      setUserIssuesList(userIssues);
      setUserStats({
        reportCount,
        firstReportDate,
      });
    }
  }, [issues, currentUser.identifier]);

  return (
    <div>
      <div className="header flex items-center justify-between h-14 py-3 px-4 bg-red-400 text-[18px] text-white shadow-md">
        <Link to="/dashboard">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>

        <span className="font-semibold">Profile</span>
        <div className="w-6"></div>
      </div>

      <div className="profile-card h-30 bg-amber-300 flex gap-10 mt-[16px] mx-4 rounded-2xl items-center bg-gradient-to-br from-red-100 to-red-200">
        <div className="w-20  h-20 rounded-full bg-red-300 flex items-center justify-center ml-[10px]  border-white border-2  ">
          <FontAwesomeIcon
            icon={faUserCircle}
            className="text-red-500 text-5xl"
          />
        </div>

        <div className="user-details text-gray-800">
          <h1 className="font-bold text-xl font-mono ">
            {currentUser?.displayName || "Loading..."}
          </h1>
          <p className="font-mono text-red-700 text-sm">Active Citizen</p>

          {userStats.firstReportDate && (
            <p className="text-xs font-mono text-gray-600 mt-1">
              First report:{" "}
              {new Date(userStats.firstReportDate).toLocaleDateString()}{" "}
            </p>
          )}

          <p className="text-xs font-mono text-gray-600">
            Reports submitted: {userStats.reportCount}
          </p>
        </div>
      </div>

      <div className="mt-6 px-4">
        <h3 className="font-mono font-semibold">My Reports</h3>
        {userIssuesList.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No reports found.</p>
        )}
        <div className="issues-list space-y-4 pb-4">
          {userIssuesList.map((issue) => (
            <Link key={issue.id} to={`/issue/${issue.id}`}>
              <IssueCard key={issue.id} issue={issue} />
            </Link>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 right-0 left-0 border-t shadow-sm border-gray-200 h-16 bg-white py-2">
          <div className="flex justify-around">
          <Link to="/dashboard">
            <div className="flex-col justify-center items-center text-center">

              <FontAwesomeIcon icon={faHome} className="text-[16px]" />
              <p className="font-mono text-[12px]">Home</p>
            </div>
            </Link>

            <Link to="/Map">
              <div className="flex-col justify-center items-center text-center">
                <FontAwesomeIcon icon={faMapLocation} className="text-[16px]" />

                <p className="font-mono text-[12px]">Maps</p>
              </div>
            </Link>

            <div className="flex-col justify-center items-center text-center">
              <FontAwesomeIcon icon={faNavicon} className="text-[16px]" />
              <p className="font-mono text-[12px]">Reports</p>
            </div>

            <Link to="/profile">
              <div className="flex-col justify-center items-center text-center">
                <FontAwesomeIcon icon={faUser} className="text-[16px]" />
                <p className="font-mono text-[12px]">Profile</p>
              </div>
            </Link>
          </div>
        </div>
    </div>
  );
};

export default Profile;
