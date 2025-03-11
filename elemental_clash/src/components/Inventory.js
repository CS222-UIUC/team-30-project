import React, { useState } from 'react';
import DraggableElement from './DraggableElement';

const Inventory = ({ elements }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ width: '200px' }}>
      <h2>Inventory</h2>
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="DATABASE SEARCH"
        />
      </div>
      <div>
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