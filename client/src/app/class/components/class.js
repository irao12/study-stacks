
import React from 'react';
import styles from './class.css'
import Tile from './tile.js';

import './class.css';
  
const ClassPage = () => {
 

  return (
    <div className="body" >
      <h1 className="title">Classes</h1>
      <div className="tiles-div" > 
        <Tile className="tile"></Tile>
        <Tile className="tile"></Tile>
        <Tile className="tile"></Tile>
       
      </div>
      
    </div>
  );
};

export default ClassPage;


