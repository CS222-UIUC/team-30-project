import React, {useState, useEffect, useCallback, forwardRef} from 'react';

const Element = forwardRef(( { text, id, onDragStop }, ref ) => {
    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({x:0, y:0});
    const [startPos, setStartPos] = useState({x: 0, y: 0});
    const [elementStartPos, setElementStartPos] = useState({x: 0, y: 0});

    const handleMouseMove = useCallback((event) => {
        if (dragging) {
            const dx = event.clientX - startPos.x;
            const dy = event.clientY - startPos.y;
            setPosition({x: elementStartPos.x+dx, y: elementStartPos.y+dy});
        }
    }, [dragging, startPos, elementStartPos]);

    const handlePress = useCallback((event) => {
        console.log(`${text} was pressed`)
        event.preventDefault();
        setElementStartPos(position);
        setStartPos({x: event.clientX, y: event.clientY});
        setDragging(true);
        // setDragging(true);
        console.log(`it is ${dragging} that am dragging`)
    }, [position]);

    const handleRelease = useCallback(() => {
        if (dragging) {
            setDragging(false);
            if (onDragStop) {
                onDragStop(id, startPos, position);
            }
        }
        console.log(`${text} was released`)
        // setDragging(false);
        console.log(`it is ${dragging} that am dragging`)
    }, [dragging, id, onDragStop, position]);

    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleRelease);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleRelease);
        };
    }, [dragging, handleMouseMove, handleRelease]);
    const style = {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        display: 'inline-block',
        paddingTop: '1px',
        paddingBottom: '1px',
        paddingLeft: '15px',
        paddingRight: '15px',
        borderRadius: '12px',
        border: '2px solid',
        borderColor: '#ccc',
        backgroundColor: '#f0f0f0',
        color: '#333',
        fontSize: '16px',
        textAlign: 'center',
    };

    return (
        <div
        ref={ref}
        style={style}
        onMouseDown={handlePress}
        // onMouseUp={handleRelease}
        // onTouchStart={handlePress}
        // onTouchEnd={handleRelease}
        >{text}</div>
    );
});

export default Element;