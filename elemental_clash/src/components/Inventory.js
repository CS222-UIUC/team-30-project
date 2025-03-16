import React, { useState } from 'react';
import DraggableElement from './DraggableElement';

const Inventory = ({ elements }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ width: '200px', textAlign: 'center' }}>
      <h1>Inventory</h1>
      {/* <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="DATABASE SEARCH"
        />
      </div> */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px',
        padding: '10px'
      }}>
        {elements.map((element) => (
          <DraggableElement
            key={element.id}
            element={element}
            isFromInventory={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Inventory; 