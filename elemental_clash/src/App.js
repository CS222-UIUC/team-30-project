import React from 'react';
import './App.css';
import GameScreen from './components/GameScreen';
// import Button from './components/Button/Button.js'
import VerticalDivider from './components/Divider.js'


function App() {
  // const handleButtonClick = () => {
  //   console.log('Button clicked!');
  // };

  return (
    <div className="App">
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        {/* <Button text="Element" onClick={handleButtonClick} /> */}
        {/* <Button style={{ marginLeft: '10px' }} text="Element" onClick={handleButtonClick} /> */}
      </div>
      <VerticalDivider />
      <GameScreen />
    </div>
  );
}

export default App;
