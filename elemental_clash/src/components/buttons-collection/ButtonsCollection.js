import React from 'react';
import './ButtonsCollection.css';
import StyledButton from './StyledButton';

const ButtonsCollection = () => {
  return (
    <div className="buttons-container">
      <div className="button-box">
        <StyledButton variant="gradient-button" label="Gradient" />
      </div>
      <div className="button-box bg-dark">
        <StyledButton variant="glass-button" label="Glassmorphism" />
      </div>
      <div className="button-box bg-gray">
        <StyledButton variant="neumorphism-button" label="Neumorphism" />
      </div>
      <div className="button-box">
        <StyledButton variant="three-d-button" label="3D" />
      </div>
      <div className="button-box">
        <StyledButton variant="icon-button" label="Play" icon="fas fa-play" />
      </div>
      <div className="button-box">
        <StyledButton variant="border-button" label="Animated Border" />
      </div>
      <div className="button-box">
        <StyledButton variant="floating-button" label="Floating" />
      </div>
      <div className="button-box">
        <StyledButton variant="glowing-button" label="Glowing" />
      </div>
      <div className="button-box">
        <StyledButton variant="ripple-button" label="Ripple Effect" />
      </div>
      <div className="button-box">
        <StyledButton variant="outline-hover-button" label="Outline Hover" />
      </div>
      <div className="button-box">
        <StyledButton variant="skewed-button" label="Skewed Button" />
      </div>
      <div className="button-box">
        <StyledButton variant="shadow-button" label="Shadow" />
      </div>
      <div className="button-box">
        <StyledButton variant="round-icon-button" icon="fas fa-heart" />
      </div>
      <div className="button-box">
        <StyledButton variant="text-icon-button" label="Download" icon="fas fa-download" />
      </div>
      <div className="button-box">
        <StyledButton variant="loading-button" label="Loading">
          <div className="spinner" />
        </StyledButton>
      </div>
    </div>
  );
};

export default ButtonsCollection;
