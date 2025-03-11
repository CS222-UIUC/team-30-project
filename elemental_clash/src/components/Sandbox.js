import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import DraggableElement from './DraggableElement';

const Sandbox = () => {
  const [placedElements, setPlacedElements] = useState([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ELEMENT',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const element = {
        ...item.element,
        position: {
          x: offset.x,
          y: offset.y,
        },
        id: Date.now(),
      };
      
      if (item.isFromInventory) {
        setPlacedElements((prev) => [...prev, element]);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} style={{ flex: 1, position: 'relative' }}>
      {placedElements.map((element) => (
        <div
          key={element.id}
          style={{
            position: 'absolute',
            left: element.position.x - 30,
            top: element.position.y - 20,
          }}
        >
          <DraggableElement element={element} isFromInventory={false} />
        </div>
      ))}
    </div>
  );
};

export default Sandbox; 