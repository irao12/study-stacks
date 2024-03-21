"use client";
import React, { useEffect, useState } from 'react';
import Tile from './tile.js';
import './class.css';

const ClassPage = () => {
  const [className, setClassName] = useState('');

  useEffect(() => {
    // Check if window is defined (client-side) before setting initial state
    if (typeof window !== 'undefined') {
      setClassName('');
    }
  }, []);

  const handleCreateClass = () => {
    // Send a request to your backend to create a class with the className
    // You can use fetch or a library like axios for this
    fetch('http://localhost:8080/api/class/createclass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: className }),
    })
      .then(response => {
        if (response.ok) {
          console.log('Class created successfully');
          // Optionally, you can update the UI or show a success message
          setClassName('');
        } else {
          console.error('Failed to create class');
          // Optionally, you can show an error message
        }
      })
      .catch(error => {
        console.error('Error creating class:', error);
        // Optionally, you can show an error message
      });
  };

  return (
    <div className="body">
      <h1 className="title">Classes</h1>
      <div className="input-group">
        <input
          type="text"
          value={className}
          onChange={e => setClassName(e.target.value)}
          placeholder="Enter class name"
        />
        <button onClick={handleCreateClass}>Create Class</button>
      </div>
      <div className="tiles-div">
        <Tile className="tile"></Tile>
        <Tile className="tile"></Tile>
        <Tile className="tile"></Tile>
      </div>
    </div>
  );
};

export default ClassPage;
















// import React from 'react';
// import styles from './class.css'
// import Tile from './tile.js';

// import './class.css';

// import { useState } from "react";
// import { useRouter } from "next/navigation";
  
// const ClassPage = () => {
 

//   return (
//     <div className="body" >
//       <h1 className="title">Classes</h1>
//       <div className="tiles-div" > 
//         <Tile className="tile"></Tile>
//         <Tile className="tile"></Tile>
//         <Tile className="tile"></Tile>

        
       
//       </div>
      
//     </div>
//   );
// };

// export default ClassPage;


