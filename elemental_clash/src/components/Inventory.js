import React, {useState, useEffect} from 'react';
import DraggableElement from './DraggableElement';

let clearInventory = () => {console.log("GAME OVER")};

export {clearInventory};

const Inventory = ({elements, setElements}) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    clearInventory = () => {
      setElements([]);
    };
  }, [setElements]);

  return (
    <div style={{ width: '200px', textAlign: 'center' }}>
      <h1>Inventory</h1>
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