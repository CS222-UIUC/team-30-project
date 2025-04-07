import React from 'react';

const Element = ( { text } ) => {
    const style = {
        display: 'inline-block',
        padding: '20px',
        borderRadius: '12px',
        border: '2px',
        backgroundColor: '#f0f0f0',
        color: '#333',
        fontSize: '16px',
        textAlign: 'center',
    };

    return <div style={style}>{text}</div>
};

export default Element;