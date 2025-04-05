// src/services/issueService.js
const API_URL = "https://8ckklc5esd.execute-api.eu-west-2.amazonaws.com/prod/getissue";

export const fetchIssues = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return JSON.parse(data.body); // Parse the body string to get the array
  } catch (error) {
    console.error("Error fetching issues:", error);
    return [];
  }
};