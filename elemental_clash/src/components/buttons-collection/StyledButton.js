import React from 'react';
import './ButtonsCollection.css';

//See showcase at https://farazc60.github.io/react-buttons/

const StyledButton = ({
  variant = '',
  label,
  icon,
  iconPosition = 'left',
  children,
  ...props
}) => {
  return (
    <button className={variant} {...props}>
      {icon && iconPosition === 'left' && <i className={icon} style={{ marginRight: '0.5rem' }} />}
      {label}
      {icon && iconPosition === 'right' && <i className={icon} style={{ marginLeft: '0.5rem' }} />}
      {children}
    </button>
  );
};

export default StyledButton;
