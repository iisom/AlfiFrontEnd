// import React, { useContext } from 'react';
import { PiUserCircleDuotone } from 'react-icons/pi';


const UserProfile = () => {
//   const [authState] = useContext(AuthContext); 


  return (
    <div className="user-profile">
      <div className="profile-picture">
      <PiUserCircleDuotone className="profile-icon" />
      </div>
      <div className="profile-details">
        <h2>username </h2> 
        <p>username@email.com</p>
      </div>
    </div>
  );
};

export default UserProfile;
