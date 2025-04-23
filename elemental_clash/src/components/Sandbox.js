import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import DraggableElement from './DraggableElement';
import {dragWidth, dragHeight} from './DraggableElement';

const Sandbox = () => {
  const [placedElements, setPlacedElements] = useState([]);

  // const [{ isOver }, drop] = useDrop(() => ({
  //   accept: 'ELEMENT',
  //   drop: (item, monitor) => {
  //     if (monitor.didDrop()) {return;}
  //       const offset = monitor.getClientOffset();
  //       const element = {
  //         ...item.element,
  //         position: {
  //           x: offset.x,
  //           y: offset.y,
  //         },
  //         id: Date.now(),
  //       };

  //     setPlacedElements((previousElements) => {
  //       const overlappingElement = previousElements.find((closest) =>
  //         element != closest && Math.abs(element.position.x - closest.position.x) < dragWidth && Math.abs(element.position.y - closest.position.y) < dragHeight
  //       );

  //       console.log(element.position.x, element.position.y);

  //       if(overlappingElement){
  //         console.log("***************");
  //         console.log(overlappingElement.position.x, overlappingElement.position.y);
  //         console.log("***************");
  //         return [...previousElements.filter(tempElement => tempElement.id !== overlappingElement.id && tempElement.id !== item.element.id), element];
  //       }
  //       else{
  //         return [...previousElements.filter(tempElement => tempElement.id !== item.element.id), element];
  //       }
  //     });
  //   },
  //   collect: (monitor) => ({
  //     isOver: monitor.isOver(),
  //   }),
  // }));

  return (
    <div /*ref={drop}*/ style={{ flex: 1, position: 'relative' }}>
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