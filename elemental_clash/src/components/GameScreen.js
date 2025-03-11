import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Inventory from './Inventory';
import Sandbox from './Sandbox';

// Sample initial elements - you can modify these as needed
const initialElements = [
  { id: 1, name: 'Water' },
  { id: 2, name: 'Fire' },
  { id: 3, name: 'Earth' },
  { id: 4, name: 'Air' },
];

const GameScreen = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Inventory elements={initialElements} />
        <Sandbox />
      </div>
    </DndProvider>
  );
};

export default GameScreen; 