// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

function ProfilePage() {
  const { user, token } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // We only fetch if the user and token from context exist
    if (user && token) {
      async function fetchProfile() {
        try {
          const response = await fetch('http://localhost:5000/api/profile', {
            headers: { 'x-auth-token': token }
          });
          const data = await response.json();
          if (!response.ok) throw new Error('Could not fetch profile');
          setProfileData(data);
        } catch (err) {
          console.error(err);
        }
      }
      fetchProfile();
    }
  }, [user, token]); // Effect runs when user or token changes

  if (!user) {
    return <p>You must be logged in to view this page.</p>;
  }
  
  if (!profileData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h1>Your Profile</h1>
      <p><strong>Email:</strong> {profileData.email}</p>
      <p><strong>First Name:</strong> {profileData.first_name}</p>
      <p><strong>Last Name:</strong> {profileData.last_name}</p>
    </div>
  );
}

export default ProfilePage;