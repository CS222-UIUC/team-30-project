import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableElement = ({ element, isFromInventory }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ELEMENT',
    item: { 
      type: 'ELEMENT',
      element,
      isFromInventory
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag}>
      {element.name}
    </div>
  );
};

export default DraggableElement; 