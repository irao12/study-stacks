"use client";
import React, { useEffect, useState } from 'react';
import Tile from './tile.js';
import './class.css';
import CreateClass from './createClass.js';
import ViewClass from './viewClass.js';

const ClassPage = () => {

  return (
    <div className="body">
      <h1 className="title">Classes</h1>

      <CreateClass></CreateClass>
      <ViewClass></ViewClass>
      <div className="tiles-div">
        {/* <Tile className="tile"></Tile>
        <Tile className="tile"></Tile>
        <Tile className="tile"></Tile> */}
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


