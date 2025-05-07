import React from 'react';
import './App.css';
import GameScreen from './components/GameScreen';
import Button from './components/Button/Button.js'
import VerticalDivider from './components/Divider.js'
import GameStateComponent from './components/GameStateComponent.js';
import getElementByParents from './components/All_Elements.js';
import { getRandomElement } from './components/All_Elements';


function App() {
  const [targetElement, setTargetElement] = React.useState('');
  const [targetReached, setTargetReached] = React.useState(false);
  const [resetElements, setResetElements] = React.useState(false);

  const handleGenerateTarget = (gameName) => {
    setTargetElement(getRandomElement(gameName));
  }

  const handleChangeTarget = (newTargetName) => {
    setTargetElement(newTargetName);
  }

  const handleCheckTarget = (newElement) => {
    console.log("handleCheckTarget in App.js running...")
    setTargetReached(targetElement.trim() === newElement.trim());
  }

  const shouldResetElements = () => {
    console.log('should reset elements in app.js')
    setResetElements(true);
  }
/*  const handleButtonClick = () => {
     console.log('Button clicked!');
     getElementByParents("bomb", "baby");
  };
  */

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
  <div className="App" style={{display: "flex", flexDirection: "row", background: '#c3c3c3' }}>
  {/*<Button style={{ marginLeft: '10px' }} text="Element" onClick={handleButtonClick} /> */}
    <div style={{flex: 2}}>
      <GameScreen handleCheckTarget={handleCheckTarget} resetElements={resetElements} setResetElements={setResetElements}/>
    </div>
    {targetElement && (<div style={{
        position: 'absolute',
        bottom: '90px',
        left: '50vw',
        translate: '-50%',
        padding: '8px 12px',
        background: '#222',
        color: '#fff',
        borderRadius: '8px',
        zIndex: 100,
        userSelect: 'none'
      }}>
      Your goal: {targetElement}
      </div>
      )}
    <div style={{flex: 1}}>
      <GameStateComponent handleGenerateTarget={handleGenerateTarget} handleChangeTarget={handleChangeTarget} targetReached={targetReached} setTargetReached={setTargetReached} shouldResetElements={shouldResetElements}/>
    </div>
  </div>
 )
}

export default App;
