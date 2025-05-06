import React from 'react';

const GameStatusPopup = ({ status, onClose }) => {
    if (status == null) {
        return null;
    }
    const won = status === 1;
    const title = won ? 'You Won!' : 'You Lost :(';
    const message = won ? 'Congratulations!  You\'re Goated!' : 'You gotta step up your game dawg';
    const backgroundColor = won ? '#dcfce7' : '#fee2e2'; //red or green
    const borderColor = won ? '#22c55e' : '#ef4444'; //also red or green
    const textColor = won ? '#166534' : '#991b1b'; //get this - red or green
    const buttonStyle = {
        backgroundColor: won ? '#22c55e' : '#ef4444', //who woulda thoguht? red or green
        ':hover': {
            backgroundColor: won ? '#16a34a' : '#dc2626' //imagine this, MORE RED AND GREEN
        }
    };
    return (
        <div className="fixed z-50 flex items-center justify-center">
            <div style={{ 
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                color: textColor,
                border: '2px solid', 
                borderRadius: '10px', 
                padding: '20px' 
            }}>
                <h2 className="text-2xl font-bold text-center">{title}</h2>
                <p className="mb-4 text-center">{message}</p>
                <button 
                    onClick={onClose}
                    style={{
                        ...buttonStyle, //style is soo goofy in this gm
                        padding: '8px 16px',
                        color: 'white',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    )
}

export default GameStatusPopup