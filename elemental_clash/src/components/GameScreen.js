import React, { useRef } from 'react';
import Button from './Button/Button';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
import Inventory from './Inventory';
// import Sandbox from './Sandbox';
// import GameStateComponent from './GameStateComponent';
// import Draggable from 'react-draggable';
// import { DraggableCore } from 'react-draggable';
import Element from './Element'
import VerticalDivider from './Divider';
import PlayingField from './PlayingField';

import { getRandomElement } from './All_Elements';

// let Draggable = require('react-draggable');
// let DraggableCore = Draggable.DraggableCore;
// Sample initial elements
const initialElements = [
  { id: 0, name: 'water 💧', position: {x: 0, y: 100} },
  { id: 1, name: 'fire 🔥', position: {x: 0, y: 200} },
  { id: 2, name: 'earth 🌍', position: {x: 0, y: 300} },
  { id: 3, name: 'air 🌬️', position: {x: 0, y: 400} },
];


const GameScreen = () => {
  const [elements, setElements] = React.useState([]);

  const [targetElement, setTargetElement] = React.useState(null);

  const clearElements = () => {
    setElements([]);
  };

  const handleGenerateTarget = async () => {
      const elem = await getRandomElement();
      if (elem) setTargetElement(elem);
      };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <PlayingField initElements={initialElements} elements={elements} setElements={setElements} />


      <Button
        text="Generate Target"
        onClick={handleGenerateTarget}
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          zIndex: 100,
        }}
     />

      <Button
        text="Remove Elements"
        onClick={clearElements}
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          zIndex: 100, // Ensure the button is above other elements
        }}
      />

      {targetElement && (<div style={{
        position: 'absolute',
        bottom: '50px',
        left: '10px',
        padding: '8px 12px',
        background: '#222',
        color: '#fff',
        borderRadius: '8px',
        zIndex: 100,
      }}>
      {targetElement}
      </div>
      )}
    </div>
  );
};

export default GameScreen;