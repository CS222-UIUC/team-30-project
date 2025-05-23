import React from 'react';
import { useDrag } from 'react-dnd';

const dragWidth = 100;
const dragHeight = 100;
export {dragWidth, dragHeight};

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
    <button 
      ref={drag}
      style={{
        border: '1px solid #000',
        borderRadius: '10px',
        backgroundColor: '#fff',
        padding: '10px',
        margin: '5px',
        // width: '100%',
        // height: '100%',
        width: (dragWidth + 'px'),
        height: (dragHeight + 'px'),
        cursor: 'pointer'
      }}
    >
      {element.name}
      {/* <img src={element.image} alt={element.name}/> */}
    </button>
  );
};

export default DraggableElement; 