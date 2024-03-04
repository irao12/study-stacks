
import React from 'react';
import styles from './class.module.css'

const ClassPage = () => {
  const handleInviteClick = () => {
    // Handle invite logic
    console.log('Invite button clicked'); //invite user to access class 
  };

  const handleCreateClick = () => {
    // Handle create study stack logic
    console.log('Create button clicked'); // call the study stack component
  };

  const handleEditClick = () => {
    // Handle edit logic
    console.log('Edit button clicked'); // edit stacks in the class 
  };

  return (
    <div>
     <div className="app-container">
      <h1 className="top-left-heading">Classes</h1>
      
    </div>

{/* 
      <button onClick={handleInviteClick}>Invite People</button>

      <button onClick={handleCreateClick}>Create New Study Stack</button>

      <button onClick={handleEditClick}>Edit</button> */}
      
    </div>
  );
};

export default ClassPage;


