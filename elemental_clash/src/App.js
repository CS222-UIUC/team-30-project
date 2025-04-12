import React from 'react';
import './App.css';
import GameScreen from './components/GameScreen';
import Button from './components/Button/Button.js'
import VerticalDivider from './components/Divider.js'
import GameStateComponent from './components/GameStateComponent.js';
import getElementByParents from './components/All_Elements.js';


function App() {
  const handleButtonClick = () => {
     console.log('Button clicked!');
     getElementByParents("image", "wall");
  };

  /**
  return (
    <div className="App">
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        {<Button text="Element" onClick={handleButtonClick} />}
        {<Button style={{ marginLeft: '10px' }} text="Element" onClick={handleButtonClick} />}
      </div>
      <div style={{ display: "flex", height: "100vh" }}>
        <p>Put an inventory here</p>
          <VerticalDivider />
        <div style={{flex: 4, padding: '20px'}}>
          <GameScreen />
        </div>
        <div style={{flex: 3, padding: '20px'}}>
          <GameStateComponent />
        </div>
      </div>
    </div>
  );
  */
 return (
  <div className="App" style={{display: "flex", flexDirection: "row"}}>
    {<Button style={{ marginLeft: '10px' }} text="Element" onClick={handleButtonClick} />}
    <div style={{flex: 2}}>
      <GameScreen />
    </div>
    <div style={{flex: 1}}>
      <GameStateComponent />
    </div>
  </div>
 )
}

export default App;
