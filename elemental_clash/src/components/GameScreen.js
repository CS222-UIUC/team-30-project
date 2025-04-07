import React, { useRef } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
import Inventory from './Inventory';
// import Sandbox from './Sandbox';
// import GameStateComponent from './GameStateComponent';
import Draggable from 'react-draggable';
import { DraggableCore } from 'react-draggable';
import Element from './Element'
import VerticalDivider from './Divider';
import PlayingField from './PlayingField';

// let Draggable = require('react-draggable');
// let DraggableCore = Draggable.DraggableCore;
// Sample initial elements
const initialElements = [
  { id: 0, name: 'Water', x: 0, y: 0 },
  { id: 1, name: 'Fire', x: 0, y: 0 },
  { id: 2, name: 'Earth', x: 0, y: 0 },
  { id: 3, name: 'Air', x: 0, y: 0 },
];


const GameScreen = () => {
  const [elements, setElements] = React.useState(initialElements);
  // const nodeRef = useRef(null);

  return (
    // <DndProvider backend={HTML5Backend}>
    //   <div style={{ display: 'flex', height: '100vh' }}>
    //     <Inventory elements={initialElements} />
    //     <Sandbox />
    //     <GameStateComponent />
    //   </div>
    // </DndProvider>
    /**
      <Draggable nodeRef = {nodeRef}>
        <div ref={nodeRef}>
          <Element text="Ayy" />  
        </div>
      </Draggable>
      */
     <div>
      <h3>Put inventory here!</h3>
      <PlayingField initElements={initialElements}/>
      <VerticalDivider />
     </div>
  );
};

export default GameScreen; 